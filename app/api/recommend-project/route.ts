import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  PERSONAL_SYSTEM_PROMPT,
  CORPORATE_SYSTEM_PROMPT,
} from '@/lib/softwareAdvisorPrompts';

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

    const genAI = new GoogleGenAI({ apiKey });

    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
    ];

    let aiResponse = '';

    for (const modelName of modelsToTry) {
      try {
        console.log(`[recommend-project] Attempting to use model: ${modelName}`);

        const result = await genAI.models.generateContent({
          model: modelName,
          contents: fullPrompt,
        });

        // SDK puede exponer el texto de formas distintas
        // @ts-ignore
        aiResponse = result.text || result.response?.text?.() || '';

        if (aiResponse) {
          console.log(
            `[recommend-project] Successfully generated response using ${modelName}`,
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


