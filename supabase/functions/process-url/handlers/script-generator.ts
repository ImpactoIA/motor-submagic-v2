// ==================================================================================
// ✍️ HANDLER: SCRIPT GENERATOR V800 — PIPELINE SECUENCIAL + STREAMING SSE
// Arquitectura: Paso 1 (Estratega rápido sin stream) → Paso 2 (PROMPT_GENERADOR_GUIONES_V800)
// Salida: Markdown 3 secciones — [FRASE MINIATURA] [TELEPROMPTER] [PLAN AUDIOVISUAL]
// ==================================================================================

import { ejecutarGeneradorGuiones, guardarFeedbackTCA } from '../prompts/script-generator.ts';
import { analizarImagenEstrategica } from '../prompts/vision.ts';
import { ContextoUsuario } from '../lib/types.ts';
import { corsHeaders } from '../lib/constants.ts';

// ==================================================================================
// 🔑 TIPOS INTERNOS
// ==================================================================================

interface EstrategiaPlano {
  conflicto_central: string;
  insight_explotable: string;
  tension_base: string;
  sector_tca: string;
  nivel_masivo: string;
  hook_recomendado: string;
}

// ==================================================================================
// 🧠 PASO 1: ESTRATEGA — llamada rápida sin streaming
// Devuelve el Plan de Ataque (Pre-análisis + TCA) que luego inyectamos en el Paso 2.
// ==================================================================================

async function ejecutarEstrategaPaso1(
  temaUsuario: string,
  settings: any,
  userContext: ContextoUsuario,
  openai: any
): Promise<EstrategiaPlano> {
  const systemPrompt = `Eres un estratega de contenido viral de élite. 
Tu única tarea es analizar el tema recibido y devolver un JSON compacto con el Plan de Ataque.
Responde SOLO con JSON válido, sin texto adicional, sin bloques markdown, sin comentarios.`;

  const userPrompt = `TEMA: ${temaUsuario}
PLATAFORMA: ${settings.platform || 'TikTok'}
NICHO: ${(userContext as any).nicho || 'General'}
AVATAR DOLOR: ${(userContext as any).avatar?.central_pain || (userContext as any).avatar_ideal || 'Audiencia objetivo'}

Analiza y devuelve exactamente este JSON:
{
  "conflicto_central": "El conflicto emocional que explota este tema en sector N2-N3",
  "insight_explotable": "La verdad no obvia que nadie dice — el giro que diferencia el guion",
  "tension_base": "La tensión narrativa que mantiene al espectador enganchado",
  "sector_tca": "El sector universal: Dinero / Tiempo / Libertad / Reconocimiento / Salud / Relaciones",
  "nivel_masivo": "TOFU / MOFU / BOFU",
  "hook_recomendado": "El tipo de hook de apertura más poderoso para este tema y plataforma"
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 400,
    temperature: 0.4,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as EstrategiaPlano;
  } catch {
    console.warn('[ESTRATEGA] JSON inválido, usando fallback:', raw.substring(0, 200));
    return {
      conflicto_central: 'Conflicto detectado automáticamente',
      insight_explotable: 'Insight basado en el tema',
      tension_base: 'Media (50/100)',
      sector_tca: 'Dinero / Tiempo / Reconocimiento',
      nivel_masivo: 'TOFU',
      hook_recomendado: 'Hook disruptivo directo al dolor'
    };
  }
}

// ==================================================================================
// 🚀 HANDLER PRINCIPAL — handleScriptGenerator
// Devuelve una Response SSE inmediata. Los chunks fluyen en tiempo real.
// ==================================================================================

export async function handleScriptGenerator(
  body: any,
  settings: any,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any,
  corsHeadersOverride?: Record<string, string>
): Promise<Response> {
  console.log('[HANDLER V800] ✨ Generar Guion — Pipeline Secuencial + SSE');

  const headers = {
    ...(corsHeadersOverride || corsHeaders),
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
    'Connection': 'keep-alive',
  };

  const encoder = new TextEncoder();

  // Helper para error SSE inmediato
  const errorSSE = (message: string): Response => {
    const s = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message })}\n\n`
        ));
        controller.close();
      }
    });
    return new Response(s, { headers });
  };

  // ══════════════════════════════════════════════════════════
  // CONSTRUCCIÓN DEL TEMA (sin llamadas al LLM todavía)
  // ══════════════════════════════════════════════════════════

  let temaUsuario = '';
  let modoGeneracion: 'idea' | 'texto' | 'imagen' = 'idea';

  // RUTA A: IMAGEN
  if (body.image) {
    console.log('[MOTOR V800] 📸 Imagen detectada — activando análisis visual...');
    modoGeneracion = 'imagen';

    try {
      const conceptoVisual = await analizarImagenEstrategica(body.image, openai, {
        nicho: (userContext as any).nicho || settings.nicho || 'General',
        avatar_ideal: (userContext as any).avatar?.central_pain || 'Audiencia objetivo',
        dolor_principal: (userContext as any).dolor_principal || 'No especificado',
        deseo_principal: (userContext as any).deseo_principal || 'No especificado',
        plataforma: settings.platform || 'TikTok',
        formato_narrativo: settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD',
        expertProfile: (userContext as any).expertProfile || null,
      });

      const contextoAdicional = (body.text || body.userInput || '').trim();
      const temaFinal = contextoAdicional || conceptoVisual;

      temaUsuario = `[TEMA PRINCIPAL DEL USUARIO]: ${temaFinal}

[INSTRUCCIÓN ESPECIAL — ORIGEN IMAGEN]:
El guion DEBE hablar específicamente sobre: "${temaFinal}".
${contextoAdicional
  ? `El usuario escribió este tema: "${contextoAdicional}". La imagen complementa visualmente.`
  : `Tema extraído de la imagen. Úsalo como eje central.`}
La imagen debe aparecer en el Plan Audiovisual como B-Roll en el momento de mayor impacto.
PROHIBIDO: guion genérico. OBLIGATORIO: mencionar detalles concretos del tema visual.`;

      console.log('[MOTOR V800] 🧬 Fusión Visual completada.');
    } catch (imgError: any) {
      console.error('[ERROR VISION]', imgError);
      return errorSSE('Error analizando la imagen. Asegúrate de que sea JPG/PNG válido.');
    }

  // RUTA B: TEXTO LARGO (> 150 chars)
  } else if ((body.text || body.userInput || processedContext || '').length > 150) {
    const inputTexto = body.text || body.userInput || processedContext || '';
    console.log('[MOTOR V800] 📝 Texto largo detectado.');
    modoGeneracion = 'texto';
    temaUsuario = `[TEXTO ORIGINAL DEL USUARIO]:\n${inputTexto.substring(0, 1500)}`;

  // RUTA C: IDEA CORTA
  } else {
    temaUsuario = body.text || body.userInput || settings.topic || (userContext as any).nicho || 'Tema General';
    modoGeneracion = 'idea';

    if (!temaUsuario || temaUsuario === 'Tema General') {
      return errorSSE('⚠️ Debes ingresar un tema, texto o imagen para generar el guion.');
    }

    console.log(`[MOTOR V800] 💡 Idea corta lista | Modo: ${modoGeneracion}`);
  }

  // ══════════════════════════════════════════════════════════
  // STREAM PRINCIPAL — Paso 1 + Paso 2
  // ══════════════════════════════════════════════════════════

  const stream = new ReadableStream({
    async start(controller) {

      const send = (payload: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // Cliente desconectó — ignorar
        }
      };

      // ──────────────────────────────────────────────────────
      // PASO 1: ESTRATEGA — Plan de Ataque (sin stream)
      // ──────────────────────────────────────────────────────
      send({ type: 'status', phase: 'estratega', message: '🧠 Analizando Estrategia y TCA...' });
      console.log('[MOTOR V800] 🧠 Paso 1: Ejecutando Estratega...');

      let estrategiaPlano: EstrategiaPlano;
      try {
        estrategiaPlano = await ejecutarEstrategaPaso1(temaUsuario, settings, userContext, openai);
        console.log('[MOTOR V800] ✅ Paso 1 completado | Sector TCA:', estrategiaPlano.sector_tca);
        send({ type: 'estrategia', data: estrategiaPlano });
      } catch (error: any) {
        console.error('[MOTOR V800] ❌ Error en Paso 1:', error.message);
        send({ type: 'error', message: `Error en el análisis estratégico: ${error.message}` });
        controller.close();
        return;
      }

      // ──────────────────────────────────────────────────────
      // PASO 2: GENERADOR con PROMPT_GENERADOR_GUIONES_V800
      // Llama a ejecutarGeneradorGuiones() que internamente usa
      // el nuevo prompt y devuelve Markdown de 3 secciones
      // ──────────────────────────────────────────────────────
      send({ type: 'status', phase: 'generador', message: '✍️ Escribiendo Guion Viral...' });
      console.log('[MOTOR V800] ✍️ Paso 2: Iniciando Generador V800...');

      try {
        const contextoEnriquecido = {
          ...userContext,
          tema_especifico: temaUsuario,
          modo_generacion: modoGeneracion,
          estrategia_tca: {
            mass_appeal_score:     80,
            nivel_posicionamiento: estrategiaPlano.nivel_masivo,
            sector_utilizado:      estrategiaPlano.sector_tca,
            tipo_contenido_embudo: estrategiaPlano.nivel_masivo,
            hook_sectorial:        estrategiaPlano.hook_recomendado,
            capa_visible:          'Contenido masivo optimizado',
            capa_estrategica:      'Autoridad implícita',
            conflicto_central:     estrategiaPlano.conflicto_central,
            insight_explotable:    estrategiaPlano.insight_explotable,
            tension_base:          estrategiaPlano.tension_base,
          },
          plan_ataque_estratega: `
[PLAN DE ATAQUE DEL ESTRATEGA — INYECTADO]:
• Conflicto central: ${estrategiaPlano.conflicto_central}
• Insight explotable: ${estrategiaPlano.insight_explotable}
• Tensión narrativa: ${estrategiaPlano.tension_base}
• Sector TCA activado: ${estrategiaPlano.sector_tca} (${estrategiaPlano.nivel_masivo})
• Hook recomendado: ${estrategiaPlano.hook_recomendado}
`,
        };

        const settingsEnriquecidos = {
          ...settings,
          fromIdeas:    !!(settings.fromIdeas),
          fromCalendar: !!(settings.fromCalendar),
          modoGeneracion,
        };

        // ejecutarGeneradorGuiones usa PROMPT_GENERADOR_GUIONES_V800
        // internamente (prompts/script-generator.ts) y devuelve
        // { data, tokens } con frase_miniatura, teleprompter_script,
        // plan_audiovisual_director ya parseados desde el Markdown
        const executorResult = await ejecutarGeneradorGuiones(
          contextoEnriquecido,
          null,
          openai,
          settingsEnriquecidos
        );

        const parsedResult = executorResult.data;

        // Reconstruir el Markdown completo para enviarlo como chunk
        // El frontend lo parsea con extractSection() en ResultBlocks
        const markdownOutput = [
          `[SECCIÓN 1: FRASE MINIATURA]\n${parsedResult.frase_miniatura || parsedResult.hook || ''}`,
          `\n\n[SECCIÓN 2: TELEPROMPTER PROFESIONAL]\n${parsedResult.teleprompter_script || parsedResult.guion_completo || ''}`,
          `\n\n[SECCIÓN 3: PLAN AUDIOVISUAL (DIRECTOR'S CUT)]\n${parsedResult.plan_audiovisual_director || ''}`,
        ].join('');

        send({ type: 'chunk', text: markdownOutput });

        console.log(`[MOTOR V800] ✅ Guion generado | Tokens: ${executorResult.tokens}`);

        send({
          type: 'complete',
          result: {
            ...parsedResult,
            modo_generacion: modoGeneracion,
            estrategia_tca:  contextoEnriquecido.estrategia_tca,
          }
        });

      } catch (error: any) {
        console.error('[MOTOR V800] ❌ Error en Paso 2:', error.message || error);
        send({
          type: 'error',
          message: `Error en la generación del guion: ${error.message || 'Error desconocido'}`
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, { headers });
}

// ==================================================================================
// 📊 TCA FEEDBACK (guardar resultado del video publicado)
// ==================================================================================

export async function handleTcaFeedback(
  body: any,
  userId: string,
  supabase: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] 📊 Guardando feedback TCA...');

  await guardarFeedbackTCA(supabase, userId, body.guion_data || {}, {
    resultado_categoria: body.resultado_categoria || 'normal',
    vistas_48h: body.vistas_48h || null,
    notas: body.notas || null
  });

  return {
    result: { success: true, mensaje: '✅ Resultado guardado. El sistema aprende de tu experiencia.' },
    tokensUsed: 0
  };
}