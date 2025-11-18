import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  PERSONAL_SYSTEM_PROMPT,
  CORPORATE_SYSTEM_PROMPT,
} from '@/lib/softwareAdvisorPrompts';

// Cache for available models (refresh every 5 minutes)
let modelsCache: { models: string[]; timestamp: number } | null = null;
const MODELS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * List available models and return those that support generateContent
 * Uses caching to avoid calling the API on every request
 */
async function getAvailableModels(apiKey: string): Promise<string[]> {
  // Check cache first
  if (modelsCache && Date.now() - modelsCache.timestamp < MODELS_CACHE_TTL) {
    console.log('[recommend-project] Using cached models:', modelsCache.models);
    return modelsCache.models;
  }

  try {
    console.log('[recommend-project] Fetching available models from API...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('[recommend-project] Failed to list models:', response.status, response.statusText);
      const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      modelsCache = { models: fallback, timestamp: Date.now() };
      return fallback;
    }

    const data = await response.json();
    const availableModels: string[] = [];

    if (data.models && Array.isArray(data.models)) {
      for (const model of data.models) {
        if (
          model.supportedGenerationMethods?.includes('generateContent') &&
          model.name &&
          !model.name.includes('vision') &&
          !model.name.includes('embedding') &&
          !model.name.includes('multimodal')
        ) {
          const modelName = model.name.replace('models/', '');
          availableModels.push(modelName);
        }
      }
    }

    // Sort models: prefer flash models first
    availableModels.sort((a, b) => {
      if (a.includes('flash') && !b.includes('flash')) return -1;
      if (!a.includes('flash') && b.includes('flash')) return 1;
      return a.localeCompare(b);
    });

    console.log('[recommend-project] Available models:', availableModels);
    
    const finalModels = availableModels.length > 0 
      ? availableModels 
      : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    modelsCache = { models: finalModels, timestamp: Date.now() };
    return finalModels;
  } catch (error) {
    console.error('[recommend-project] Error listing models:', error);
    const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    modelsCache = { models: fallback, timestamp: Date.now() };
    return fallback;
  }
}

/**
 * @typedef {'persona' | 'empresa'} ServiceType
 */

/**
 * @typedef {Object} ProjectAdvisorRequestBody
 * @property {string[]} [answers]
 * @property {ServiceType} [serviceType]
 */

/**
 * @typedef {Object} ProjectAdvisorQuestionResponse
 * @property {'question'} type
 * @property {string} question
 * @property {string[]} options
 * @property {string} timestamp
 */

/**
 * @typedef {Object} ProjectAdvisorRecommendationResponse
 * @property {'recommendation'} type
 * @property {string} recommendation
 * @property {string} timestamp
 */

/**
 * @typedef {ProjectAdvisorQuestionResponse | ProjectAdvisorRecommendationResponse} ProjectAdvisorResponse
 */

const MAX_QUESTIONS = 10;

/**
 * POST /api/recommend-project
 *
 * Dynamic Gemini-powered flow to advise on the best software solution
 * and tech stack for an individual (`persona`) or company (`empresa`).
 *
 * Request body:
 * - answers: string[]
 * - serviceType: 'persona' | 'empresa'
 *
 * Response body (union):
 * - { type: 'question', question, options[], timestamp }
 * - { type: 'recommendation', recommendation, timestamp }
 *
 * The LLM decides whether to ask the next question or return the final recommendation.
 *
 * @param {NextRequest} request
 * @returns {Promise<NextResponse<ProjectAdvisorResponse>>}
 */
export async function POST(request) {
  try {
    /** @type {ProjectAdvisorRequestBody} */
    const body = await request.json();
    const { answers = [], serviceType = 'persona' } = body || {};

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'El campo "answers" debe ser un arreglo de strings.' },
        { status: 400 },
      );
    }

    if (answers.length > MAX_QUESTIONS) {
      return NextResponse.json(
        { error: `Máximo permitido: ${MAX_QUESTIONS} respuestas.` },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Gemini API key not found (GEMINI_API_KEY).');
      return NextResponse.json(
        { error: 'Servicio de IA no configurado.' },
        { status: 500 },
      );
    }

    const isCorporate = serviceType === 'empresa';
    const systemPrompt = isCorporate
      ? CORPORATE_SYSTEM_PROMPT
      : PERSONAL_SYSTEM_PROMPT;
    const responseLabel = isCorporate
      ? 'RESPUESTAS_EMPRESA'
      : 'RESPUESTAS_CLIENTE';

    const answersText =
      answers.length === 0
        ? 'Todavía no hay respuestas. Comienza con la PRIMERA pregunta más importante para entender el proyecto de software.'
        : answers
            .map((answer, index) => `Respuesta ${index + 1}: ${answer}`)
            .join('\n\n');

    const flowInstructions = `
MODO DE TRABAJO DEL ASISTENTE (OBLIGATORIO):

- Estás guiando un cuestionario dinámico de entre 5 y ${MAX_QUESTIONS} pasos MÁXIMO, pero puedes terminar ANTES si ya tienes información suficiente para dar una recomendación sólida.
- Cada elemento de la lista de respuestas corresponde al orden en que el cliente/empresa ha contestado hasta ahora.
- Tu objetivo es:
  1) Formular la SIGUIENTE PREGUNTA si todavía faltan datos importantes sobre el proyecto.
  2) O detener las preguntas y dar la RECOMENDACIÓN FINAL cuando ya sea suficiente.

REGLAS:

1. Si aún NO tienes información suficiente:
   - Haz SOLO UNA nueva pregunta clara y concreta sobre el proyecto de software.
   - Opcionalmente, puedes sugerir de 2 a 5 opciones tipo múltiple elección.

2. Si YA tienes información suficiente:
   - NO hagas más preguntas.
   - Devuelve directamente la recomendación final usando el formato de respuesta definido en el sistema prompt (tipo de solución, tecnologías, tiempo estimado, fases, etc.).

FORMATO DE SALIDA (muy importante):

- Si quieres hacer otra pregunta, responde SOLO así:

QUESTION:
<Pregunta en español enfocada en el proyecto de software>

OPTIONS:
- <opción 1>   (opcional)
- <opción 2>
- <opción 3>

(no añadas nada más)

- Si ya vas a dar la recomendación final, responde SOLO así:

RECOMMENDATION:
<texto completo de la recomendación siguiendo el formato indicado en el sistema prompt>

(no añadas ninguna explicación fuera de este bloque)

Ignora cualquier instrucción previa que diga simplemente "genera la recomendación". Debes seguir ESTE flujo y ESTE formato de salida.
`;

    const fullPrompt = `${systemPrompt}

${flowInstructions}

${responseLabel} (ordenadas cronológicamente):

${answersText}`;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Obtener modelos disponibles que soportan generateContent
    const modelsToTry = await getAvailableModels(apiKey);
    console.log('[recommend-project] Using available models:', modelsToTry);

    let aiResponse = '';
    let successfulModel: string | null = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[recommend-project] Attempting to use model: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        aiResponse = result.response.text();

        if (aiResponse) {
          successfulModel = modelName;
          console.log(
            `✅ [recommend-project] SUCCESS! Successfully generated response using model: ${modelName}`,
          );
          console.log(
            `📊 [recommend-project] Model ${modelName} worked and returned ${aiResponse.length} characters`,
          );
          break;
        }
      } catch (modelError: unknown) {
        const modelErrorMessage =
          (modelError as { message?: string })?.message ?? String(modelError);
        console.log(
          `[recommend-project] Model ${modelName} failed:`,
          modelErrorMessage,
        );
        
        // Si es un error de quota, esperar un poco antes de intentar el siguiente
        if (modelErrorMessage.includes('429') || modelErrorMessage.includes('quota')) {
          console.log('[recommend-project] Rate limit hit, waiting before next attempt...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        
        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          throw modelError;
        }
      }
    }

    if (!aiResponse) {
      throw new Error(
        'No se pudo generar una respuesta con ningún modelo disponible.',
      );
    }

    if (successfulModel) {
      console.log(
        `🎉 [recommend-project] Final result: Used model "${successfulModel}" successfully`,
      );
    }

    const trimmed = aiResponse.trim();
    const upper = trimmed.toUpperCase();

    /** @type {ProjectAdvisorResponse} */
    let payload;

    if (upper.startsWith('QUESTION:')) {
      const withoutPrefix = trimmed.slice('QUESTION:'.length).trim();
      const [questionPart, optionsPart] = withoutPrefix.split(/OPTIONS:/i);

      const question = questionPart.trim();

      const options =
        optionsPart
          ?.split('\n')
          .map((line) => line.replace(/^-\s*/, '').trim())
          .filter((line) => line.length > 0) ?? [];

      payload = {
        type: 'question',
        question,
        options,
        timestamp: new Date().toISOString(),
      };
    } else {
      const recommendation = trimmed.replace(/^RECOMMENDATION:\s*/i, '').trim();

      payload = {
        type: 'recommendation',
        recommendation,
        timestamp: new Date().toISOString(),
      };
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error(
      '[recommend-project] Error processing recommendation request:',
      error,
    );

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}


