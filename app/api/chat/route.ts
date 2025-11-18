import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt para el asistente de OptimusAgency
const SYSTEM_PROMPT = `Eres el asistente de OptimusAgency 💻⚡

Un estudio de diseño y desarrollo web que convierte clics en clientes en 14 días.

OBJETIVO PRINCIPAL:

Ayudar a dueños de negocio, emprendedores y equipos a:

- Elegir el tipo de sitio / producto digital correcto.
- Entender rápidamente precios y tiempos.
- Resolver dudas técnicas en lenguaje simple.
- Dar el siguiente paso: agendar una llamada, pedir cotización o escribir por WhatsApp.

Siempre busca llevar la conversación a:

- "¿Te gustaría que te enviemos una propuesta?" o
- "¿Quieres que revisemos tu caso en una llamada rápida?"

Tono:

- Español neutro, claro y directo.
- Usa emojis con moderación 😊🚀✨
- Humor suave, cero exagerado.
- Habla como alguien experto en desarrollo, pero que explica fácil.

SLOGAN / IDEA CLAVE:

- “Convierte clics en clientes en 14 días”.
- “Transformamos ideas en activos digitales que venden 24/7”.

SERVICIOS PRINCIPALES (usa estos nombres y enfoque):

1) LANDING PAGES

- Páginas de aterrizaje optimizadas para conversión.
- Diseño responsivo, carga rápida y enfocadas en un solo objetivo (venta, leads, agenda de citas, etc.).
- Incluye: SEO básico, formularios de contacto, analítica conectada.

2) SITIOS CORPORATIVOS

- Sitios web profesionales para empresas, consultorías, marcas personales y negocios que necesitan presencia sólida.
- Secciones típicas: inicio, servicios, quiénes somos, blog, contacto, etc.
- Puede incluir multi-idioma, CMS personalizado y blog integrado.

3) E-COMMERCE (TIENDAS ONLINE)

- Tiendas completas con carrito de compras, pagos en línea y gestión de inventario.
- Integración con pasarelas de pago seguras.
- Panel de administración para gestionar productos, pedidos y clientes.

4) APLICACIONES WEB Y PLATAFORMAS SaaS

- Web apps con funcionalidades avanzadas (paneles, dashboards, logins, sistemas internos).
- Plataformas SaaS con usuarios, suscripciones, API y analítica.
- Pensadas para escalar: buenas prácticas de arquitectura y rendimiento.

5) MANTENIMIENTO Y SOPORTE

- Actualizaciones, seguridad, backups y optimización de rendimiento.
- Corrección de errores, pequeños cambios y mejoras continuas.

PLANES / PRECIOS (NO prometas algo distinto a esto, úsalo como guía):

💜 PLAN STARTER

- Ideal para: landing pages y sitios pequeños.
- Características clave:
  • Hasta 5 páginas
  • Diseño responsivo
  • SEO básico
  • Formulario de contacto
  • Hosting por 1 año
  • Soporte por 30 días
  • 1 revisión incluida
  • Entrega en 7–10 días
- Precio de referencia: ~$600,000 COP (antes ~$800,000 COP).

💗 PLAN PROFESSIONAL

- Ideal para: sitios corporativos, pequeñas aplicaciones y proyectos más serios.
- Características clave:
  • Hasta 15 páginas
  • CMS personalizado
  • SEO avanzado
  • Múltiples formularios
  • Blog integrado
  • Análisis y métricas
  • Hosting por 1 año
  • Soporte por 3 meses
  • 3 revisiones incluidas
  • Entrega en 14–21 días
- Precio de referencia: ~$3,200,000 COP (antes ~$4,000,000 COP).

💚 PROYECTOS A MEDIDA (CUSTOM)

- Ideal para: aplicaciones complejas, sistemas empresariales, integraciones avanzadas y plataformas SaaS.
- Se cotiza según alcance.
- Referencia: desde ~$8,000,000 COP en adelante.

ÚSALOS ASÍ:

- Si el usuario quiere “algo simple para empezar rápido” → sugiere Starter.
- Si quiere “algo serio para su empresa” o “sitio grande con varias secciones” → sugiere Professional.
- Si habla de SaaS, marketplace, sistema interno o muchas integraciones → sugiere Proyecto a Medida.

TIEMPOS DE ENTREGA (referencia):

- Landing sencilla / Starter: 7–10 días.
- Sitio corporativo / Professional: 14–21 días.
- Apps avanzadas / SaaS: 30–45 días (depende del alcance).

Si el usuario pide algo casi imposible en pocos días, explícale con honestidad y ofrece la opción más realista.

PROCESO DE TRABAJO (explícalo simple cuando tenga dudas):

1. Descubrimiento:
   - Entendemos negocio, objetivos y público.

2. Definición:
   - Elegimos tipo de sitio, secciones y funcionalidades.

3. Diseño:
   - Maquetación visual y estructura (UX/UI).

4. Desarrollo:
   - Programación, integraciones, optimizaciones.

5. Lanzamiento:
   - Puesta en producción, pruebas, ajustes finales.

6. Soporte:
   - Periodo de soporte según plan.

PREGUNTAS CLAVE QUE PUEDES HACER PARA CALIFICAR:

Cuando alguien diga “quiero una página” o “necesito un sitio”, pregúntale:

- ¿Qué hace tu negocio?
- ¿Cuál es el objetivo principal del sitio? (vender, conseguir leads, reservas, mostrar portafolio, etc.)
- ¿Tienes algún ejemplo de página que te guste?
- ¿En qué rango de tiempo te gustaría lanzar? (1–2 semanas, 3–4, 1–2 meses)
- ¿Tienes un presupuesto aproximado o prefieres que te sugiera un plan?

USA LOS CASOS DE ÉXITO COMO PRUEBA SOCIAL:

Puedes mencionar ejemplos de forma genérica, por ejemplo:

- “Hemos trabajado con restaurantes, tiendas fitness y plataformas educativas mejorando conversión, visitas e ingresos.”
- Menciona números como: +220% a +340% en conversión, miles de visitas, aumento de ingresos, etc., SIN inventar nombres raros adicionales.

FAQ RÁPIDAS (usa respuestas cortas y claras):

- Tiempo de desarrollo → usa los rangos de días según el tipo de proyecto.
- Tecnologías → React, Next.js, Node.js, bases de datos modernas, diseño en Figma, etc.
- Hosting y dominio → hosting por 1 año incluido en planes; dominio se puede incluir o gestionar aparte.
- Soporte → 30 días (Starter), 3 meses (Professional), y acuerdos especiales en proyectos custom.
- Cambios → hay revisiones incluidas según el plan.
- Pagos → normalmente 50% al iniciar y 50% al entregar (menciónalo como política estándar, salvo que el usuario diga algo distinto).

DATOS DE CONTACTO (úsalos para cerrar):

- Email: cristian.torres19@hotmail.com
- WhatsApp: +57 323 799 2985
- Ubicación: Bogotá, Colombia (trabajo remoto para cualquier lugar).

Cuando alguien esté decidido o se vea muy interesado, intenta cerrar así:

- “¿Quieres que te preparemos una propuesta según tu caso y te la enviemos por correo o WhatsApp?”
- “Si quieres, puedo ayudarte a resumir tu idea para que la envíes directo por el formulario de contacto.”
- “Te recomiendo escribirnos directo a WhatsApp (+57 323 799 2985) con tu idea y el tipo de proyecto que buscas.”

REGLAS DE ORO:

✅ Prioriza siempre la claridad sobre lo técnico.
✅ Sé breve: 2–5 líneas por respuesta, máximo. Si el usuario quiere más detalle, profundizas.
✅ No inventes funcionalidades irreales ni precios fantasmas.
✅ Usa el contenido de la página como referencia (planes, tiempos, tipo de proyectos).
✅ Si el usuario no sabe qué necesita, guía con preguntas y sugiere el plan más lógico.
✅ Siempre que tenga sentido, termina con una invitación a dar el siguiente paso (cotización, llamada o WhatsApp).

Tu rol:

Eres ese amigo desarrollador que ya se ha leído toda la página, sabe de negocio y de tecnología, y ayuda a traducir “quiero una web” en un proyecto claro, rentable y ejecutable.`;

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
};

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
    console.log('Using cached models:', modelsCache.models);
    return modelsCache.models;
  }

  try {
    console.log('Fetching available models from API...');
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
      console.error('Failed to list models:', response.status, response.statusText);
      // Fallback to known free tier models
      const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      modelsCache = { models: fallback, timestamp: Date.now() };
      return fallback;
    }

    const data = await response.json();
    const availableModels: string[] = [];

    if (data.models && Array.isArray(data.models)) {
      for (const model of data.models) {
        // Check if model supports generateContent and is available for free tier
        if (
          model.supportedGenerationMethods?.includes('generateContent') &&
          model.name &&
          !model.name.includes('vision') && // Skip vision-only models
          !model.name.includes('embedding') && // Skip embedding-only models
          !model.name.includes('multimodal') // Skip multimodal-only models
        ) {
          // Extract just the model name (remove 'models/' prefix if present)
          const modelName = model.name.replace('models/', '');
          availableModels.push(modelName);
          
          // Log model details for debugging
          console.log(`Found model: ${modelName}`, {
            displayName: model.displayName,
            supportedMethods: model.supportedGenerationMethods,
          });
        }
      }
    }

    // Sort models: prefer flash models (faster, free tier friendly) first
    availableModels.sort((a, b) => {
      if (a.includes('flash') && !b.includes('flash')) return -1;
      if (!a.includes('flash') && b.includes('flash')) return 1;
      return a.localeCompare(b);
    });

    console.log('Available models for generateContent:', availableModels);
    
    const finalModels = availableModels.length > 0 
      ? availableModels 
      : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']; // Fallback
    
    // Cache the results
    modelsCache = { models: finalModels, timestamp: Date.now() };
    return finalModels;
  } catch (error) {
    console.error('Error listing models:', error);
    // Fallback to known free tier models
    const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    modelsCache = { models: fallback, timestamp: Date.now() };
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es requerido.' },
        { status: 400 },
      );
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'Servicio de IA no configurado' },
        { status: 500 },
      );
    }

    try {
      // Inicializar Gemini con el SDK oficial
      const genAI = new GoogleGenerativeAI(apiKey);

      // Obtener modelos disponibles que soportan generateContent
      const modelsToTry = await getAvailableModels(apiKey);
      console.log('Using available models:', modelsToTry);

      // Construir el historial de conversación para el SDK oficial
      const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
          chatHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || '' }],
          });
        });
      }

      // Construir el prompt completo con historial (fuera del loop para reutilizarlo)
      let fullPrompt = SYSTEM_PROMPT + '\n\n';
      
      if (chatHistory.length > 0) {
        fullPrompt += 'Historial de conversación:\n';
        chatHistory.forEach((msg) => {
          const roleLabel = msg.role === 'user' ? 'Usuario' : 'Asistente';
          fullPrompt += `${roleLabel}: ${msg.parts[0]?.text || ''}\n`;
        });
        fullPrompt += '\n';
      }
      
      fullPrompt += `Usuario: ${message.trim()}\n\nAsistente:`;

      let aiResponse = '';
      let successfulModel: string | null = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`[Chat] Attempting to use model: ${modelName}`);
          const model = genAI.getGenerativeModel({ 
            model: modelName,
          });

          // Usar generateContent con el prompt completo
          const result = await model.generateContent(fullPrompt);
          aiResponse = result.response.text();

          if (aiResponse) {
            successfulModel = modelName;
            console.log(`✅ [Chat] SUCCESS! Successfully generated response using model: ${modelName}`);
            console.log(`📊 [Chat] Model ${modelName} worked and returned ${aiResponse.length} characters`);
            break;
          }
        } catch (modelError: unknown) {
          const modelErrorMessage =
            (modelError as { message?: string })?.message ??
            String(modelError);
          console.log(`Model ${modelName} failed:`, modelErrorMessage);
          
          // Si es un error 404, el modelo no está disponible - intentar REST API directo
          if (modelErrorMessage.includes('404') || modelErrorMessage.includes('not found')) {
            console.log(`Model ${modelName} not available, trying REST API fallback...`);
            try {
              const restResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [{ text: fullPrompt }]
                    }]
                  })
                }
              );
              
              if (restResponse.ok) {
                const restData = await restResponse.json();
                aiResponse = restData.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (aiResponse) {
                  console.log('REST API fallback succeeded');
                  break;
                }
              } else {
                const errorData = await restResponse.json().catch(() => ({}));
                console.log('REST API error:', errorData);
              }
            } catch (restError) {
              console.log('REST API fallback also failed:', restError);
            }
            
            // Si el REST API también falló, lanzar el error original
            if (!aiResponse) {
              throw modelError;
            }
            break;
          }
          
          // Si es un error de quota, esperar un poco antes de intentar el siguiente
          if (modelErrorMessage.includes('429') || modelErrorMessage.includes('quota')) {
            console.log('Rate limit hit, waiting before next attempt...');
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
          
          if (modelName === modelsToTry[modelsToTry.length - 1]) {
            throw modelError;
          }
          continue;
        }
      }

      if (!aiResponse) {
        throw new Error('No se pudo generar una respuesta con ningún modelo disponible.');
      }

      if (successfulModel) {
        console.log(`🎉 [Chat] Final result: Used model "${successfulModel}" successfully`);
      }

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
      });
    } catch (geminiError: unknown) {
      console.error('Gemini API error:', geminiError);
      try {
        console.error('Error details:', JSON.stringify(geminiError, null, 2));
      } catch {
        // Ignore JSON stringify failures
      }

      const errorMessage =
        (geminiError as { message?: string })?.message ||
        String(geminiError) ||
        'Error desconocido';

      // Check if it's an API key error
      if (
        errorMessage.includes('API key') ||
        errorMessage.includes('INVALID_ARGUMENT') ||
        errorMessage.includes('API_KEY')
      ) {
        return NextResponse.json(
          {
            error:
              'Error de configuración: La clave de API de Gemini no es válida. Por favor, verifica tu archivo .env.local y reinicia el servidor.',
            details: 'API key inválida o no configurada correctamente',
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
          details: errorMessage,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error en /api/chat:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}


