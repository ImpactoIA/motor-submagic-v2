// ==================================================================================
// ✍️ HANDLER: SCRIPT GENERATOR V800 — PIPELINE SECUENCIAL + STREAMING SSE
// Arquitectura: Paso 1 (Estratega rápido sin stream) → Paso 2 (Generador con stream)
// Sin loops, sin reintentos, sin acumulación en servidor.
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
AVATAR: ${(userContext as any).avatar_ideal || 'Audiencia objetivo'}

Analiza y devuelve exactamente este JSON:
{
  "conflicto_central": "El conflicto emocional que explota este tema",
  "insight_explotable": "La verdad no obvia que nadie dice sobre este tema",
  "tension_base": "La tensión narrativa que mantiene al espectador enganchado",
  "sector_tca": "El sector de audiencia masivo al que apela (N1/N2/N3)",
  "nivel_masivo": "TOFU / MOFU / BOFU",
  "hook_recomendado": "El tipo de hook de apertura más efectivo para este tema"
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
    // Limpia bloques markdown por si el modelo los incluye igualmente
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as EstrategiaPlano;
  } catch {
    // Si el JSON falla, devolvemos un fallback seguro para no bloquear el Paso 2
    console.warn('[ESTRATEGA] JSON inválido, usando fallback:', raw.substring(0, 200));
    return {
      conflicto_central: 'Conflicto detectado automáticamente',
      insight_explotable: 'Insight basado en el tema',
      tension_base: 'Media (50/100)',
      sector_tca: 'N2 - Audiencia ampliada',
      nivel_masivo: 'TOFU',
      hook_recomendado: 'Hook disruptivo directo'
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
        avatar_ideal: (userContext as any).avatar_ideal || 'Audiencia objetivo',
        dolor_principal: (userContext as any).dolor_principal || 'No especificado',
        deseo_principal: (userContext as any).deseo_principal || 'No especificado',
        plataforma: settings.platform || 'TikTok',
        formato_narrativo: settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD',
        expertProfile: (userContext as any).expertProfile || null,
      });

      const contextoAdicional = (body.text || body.userInput || '').trim();
      const temaFinal = contextoAdicional || conceptoVisual;

      temaUsuario = `[TEMA PRINCIPAL DEL USUARIO]: ${temaFinal}

[INSTRUCCIÓN OBLIGATORIA PARA EL MOTOR]:
El guion DEBE hablar específicamente sobre: "${temaFinal}".
${contextoAdicional
  ? `El usuario escribió este tema: "${contextoAdicional}". La imagen complementa visualmente.`
  : `Tema extraído de la imagen. Úsalo como eje central.`}
PROHIBIDO: guion genérico. OBLIGATORIO: mencionar detalles concretos del tema.`;

      console.log('[MOTOR V800] 🧬 Fusión Visual completada.');
    } catch (imgError: any) {
      console.error('[ERROR VISION]', imgError);
      // Devolvemos error como SSE para que el frontend lo muestre
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Error analizando la imagen. Asegúrate de que sea JPG/PNG válido.' })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, { headers });
    }

  // RUTA B: TEXTO LARGO (> 150 chars)
  } else if ((body.text || body.userInput || processedContext || '').length > 150) {
    const inputTexto = body.text || body.userInput || processedContext || '';
    console.log('[MOTOR V800] 📝 Texto largo detectado.');
    modoGeneracion = 'texto';

    temaUsuario = `[TEXTO ORIGINAL DEL USUARIO]:
${inputTexto.substring(0, 1500)}`;

  // RUTA C: IDEA CORTA
  } else {
    temaUsuario = body.text || body.userInput || settings.topic || (userContext as any).nicho || 'Tema General';
    modoGeneracion = 'idea';

    if (!temaUsuario || temaUsuario === 'Tema General') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: '⚠️ Debes ingresar un tema, texto o imagen para generar el guion.' })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, { headers });
    }

    console.log(`[MOTOR V800] 💡 Idea corta lista | Modo: ${modoGeneracion}`);
  }

  // ══════════════════════════════════════════════════════════
  // CONSTRUCCIÓN DEL STREAM — La magia ocurre aquí
  // ══════════════════════════════════════════════════════════

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {

      const send = (payload: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // El cliente desconectó — ignoramos silenciosamente
        }
      };

      // ────────────────────────────────────────────────────
      // PASO 1: ESTRATEGA — Plan de Ataque (sin stream)
      // ────────────────────────────────────────────────────
      send({ type: 'status', phase: 'estratega', message: '🧠 Analizando Estrategia y TCA...' });
      console.log('[MOTOR V800] 🧠 Paso 1: Ejecutando Estratega...');

      let estrategiaPlano: EstrategiaPlano;
      try {
        estrategiaPlano = await ejecutarEstrategaPaso1(temaUsuario, settings, userContext, openai);
        console.log('[MOTOR V800] ✅ Paso 1 completado | Sector TCA:', estrategiaPlano.sector_tca);
        send({ type: 'estrategia', data: estrategiaPlano });
      } catch (error: any) {
        console.error('[MOTOR V800] ❌ Error en Paso 1 (Estratega):', error.message || error);
        send({ type: 'error', message: `Error en el análisis estratégico: ${error.message || 'Error desconocido'}` });
        controller.close();
        return;
      }

      // ────────────────────────────────────────────────────
      // PASO 2: GENERADOR MAESTRO — Stream real de tokens
      // ────────────────────────────────────────────────────
      send({ type: 'status', phase: 'generador', message: '✍️ Escribiendo Guion Viral...' });
      console.log('[MOTOR V800] ✍️ Paso 2: Iniciando Generador con streaming...');

      const contextoEnriquecido = {
        ...userContext,
        tema_especifico: temaUsuario,
        modo_generacion: modoGeneracion,
        estrategia_tca: {
          mass_appeal_score: 80,
          nivel_posicionamiento: estrategiaPlano.nivel_masivo,
          sector_utilizado: estrategiaPlano.sector_tca,
          tipo_contenido_embudo: estrategiaPlano.nivel_masivo,
          hook_sectorial: estrategiaPlano.hook_recomendado,
          capa_visible: 'Contenido masivo optimizado',
          capa_estrategica: 'Autoridad implícita',
          conflicto_central: estrategiaPlano.conflicto_central,
          insight_explotable: estrategiaPlano.insight_explotable,
          tension_base: estrategiaPlano.tension_base,
        },
        plan_ataque_estratega: `
[PLAN DE ATAQUE DEL ESTRATEGA - INYECTADO]:
- CONFLICTO CENTRAL: ${estrategiaPlano.conflicto_central}
- INSIGHT EXPLOTABLE: ${estrategiaPlano.insight_explotable}
- TENSIÓN BASE: ${estrategiaPlano.tension_base}
- SECTOR TCA ACTIVADO: ${estrategiaPlano.sector_tca} (${estrategiaPlano.nivel_masivo})
- HOOK RECOMENDADO: ${estrategiaPlano.hook_recomendado}
`
      };

      try {
        // ejecutarGeneradorGuiones debe aceptar stream:true y devolver el stream de OpenAI
        // Si ya usa openai.chat.completions.create internamente, pasamos stream:true via settings
        const streamSettings = {
          ...settings,
          stream: true,
          _plan_ataque: contextoEnriquecido.plan_ataque_estratega
        };

        // Intento de streaming nativo desde el generador existente
        // Creamos la llamada directamente aquí para garantizar stream:true
        const systemGuion = buildSystemPromptGenerador(contextoEnriquecido, streamSettings);
        const userGuion = buildUserPromptGenerador(temaUsuario, estrategiaPlano, streamSettings, contextoEnriquecido);

        const openaiStream = await openai.chat.completions.create({
          model: 'gpt-4o',
          max_tokens: 4000,
          temperature: 0.85,
          stream: true,
          messages: [
            { role: 'system', content: systemGuion },
            { role: 'user', content: userGuion }
          ]
        });

        let fullText = '';

        for await (const chunk of openaiStream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            send({ type: 'chunk', text: delta });
          }

          // Verificamos si terminó
          if (chunk.choices[0]?.finish_reason === 'stop') {
            break;
          }
        }

        console.log('[MOTOR V800] ✅ Stream completado | Chars:', fullText.length);

        // Parseamos el JSON final acumulado e intentamos extraer estructura
        let parsedResult: any = {};
        try {
          const jsonClean = fullText.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(jsonClean);
        } catch {
          // El modelo respondió texto libre, lo usamos como guion_completo
          parsedResult = {
            guion_completo: fullText,
            teleprompter_script: fullText,
          };
        }

        // Aseguramos que guion_completo siempre exista
        if (!parsedResult.guion_completo && !parsedResult.teleprompter_script) {
          parsedResult.guion_completo = fullText;
        }

        // Enviamos el resultado completo estructurado al final
        send({
          type: 'complete',
          result: {
            ...parsedResult,
            modo_generacion: modoGeneracion,
            estrategia_tca: contextoEnriquecido.estrategia_tca,
          }
        });

      } catch (error: any) {
        console.error('[MOTOR V800] ❌ Error en Paso 2 (Generador):', error.message || error);
        send({
          type: 'error',
          message: `Error en la generación del guion: ${error.message || 'Error desconocido en OpenAI'}`
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, { headers });
}

// ==================================================================================
// 🧩 BUILDERS DE PROMPT — Generan los prompts del Paso 2 con el plan inyectado
// ==================================================================================

function buildSystemPromptGenerador(contexto: any, settings: any): string {
  const nicho = (contexto as any).nicho || 'General';
  const plataforma = settings.platform || 'TikTok';
  const estructura = settings.structure || 'winner_rocket';
  const formato = settings.narrativeFormat || 'EDUCATIVO_AUTORIDAD';
  const intensidad = settings.intensity || 'equilibrado';
  const duration = settings.duration || 'medium';
  const closingObj = settings.closingObjective || 'seguidores';
  const arquetipo = settings.arquetipo_voz || settings.vector_emocional || 'autoridad_empatica';

  const avatarDirectives = (contexto as any).avatarDirectives || '';
  const expertProfile = (contexto as any).expertProfile
    ? `\n[PERFIL EXPERTO]: ${JSON.stringify((contexto as any).expertProfile).substring(0, 800)}`
    : '';
  const knowledgeBase = (contexto as any).knowledge_base_content
    ? `\n[BASE DE CONOCIMIENTO]: ${((contexto as any).knowledge_base_content || '').substring(0, 1000)}`
    : '';

  return `Eres el Motor Viral V700 ÉLITE — el generador de guiones más avanzado del mercado hispanohablante.

MISIÓN: Generar un guion viral de máximo impacto para ${plataforma}.
NICHO: ${nicho}
PLATAFORMA: ${plataforma}
ARQUITECTURA NARRATIVA: ${estructura}
FORMATO NARRATIVO: ${formato}
INTENSIDAD: ${intensidad}
DURACIÓN OBJETIVO: ${duration}
OBJETIVO DE CIERRE: ${closingObj}
ARQUETIPO DE VOZ: ${arquetipo}

${settings._plan_ataque || ''}
${expertProfile}
${knowledgeBase}
${avatarDirectives ? `\n[PERSONALIDAD AVATAR OBLIGATORIA]:\n${avatarDirectives}` : ''}

REGLAS ABSOLUTAS DEL MOTOR V700:
1. El guion DEBE tener gancho en los primeros 3 segundos que detenga el scroll
2. Cada línea debe generar tensión hacia la siguiente (micro-loops abiertos)
3. El lenguaje debe sonar humano, nativo a la plataforma, nunca corporativo
4. Debe incluir activadores psicológicos: curiosidad, contraste, urgencia o identidad
5. El cierre debe tener un CTA claro alineado con: ${closingObj}
6. PROHIBIDO: frases cliché, promesas vacías, transiciones genéricas
7. Responde SOLO con JSON válido sin bloques markdown

ESTRUCTURA JSON OBLIGATORIA DE RESPUESTA:
{
  "hook": "Los primeros 3 segundos exactos del guion",
  "guion_completo": "El guion completo listo para grabar, con instrucciones entre [corchetes]",
  "teleprompter_script": "Solo el texto para leer, sin instrucciones técnicas",
  "estructura_desglosada": {
    "apertura": "...",
    "desarrollo": "...",
    "cierre": "..."
  },
  "ganchos_opcionales": [
    { "tipo": "curiosidad", "texto": "...", "retencion_predicha": 85, "mecanismo": "..." }
  ],
  "score_predictivo": {
    "retention_score": 0,
    "share_score": 0,
    "save_score": 0,
    "authority_score": 0,
    "viral_index": 0,
    "razonamiento": "..."
  },
  "miniatura_dominante": {
    "frase_principal": "...",
    "sector_tca_activado": "...",
    "mecanismo_psicologico": "...",
    "ctr_score": 0,
    "nivel_disrupcion": 0,
    "nivel_gap_curiosidad": 0,
    "nivel_polarizacion": 0,
    "compatibilidad_algoritmica": 0
  },
  "poder_del_guion": {
    "hook_primeros_3_segundos": "...",
    "frase_de_oro": "...",
    "punto_de_no_retorno": "...",
    "por_que_llegara_a_millones": "...",
    "momento_mas_compartible": "..."
  },
  "metadata_guion": {
    "tema_tratado": "...",
    "plataforma": "${plataforma}",
    "arquitectura": "${estructura}",
    "objetivo_viral": "...",
    "tono_voz": "...",
    "nivel_intensidad": "${intensidad}"
  }
}`;
}

function buildUserPromptGenerador(
  temaUsuario: string,
  estrategia: EstrategiaPlano,
  settings: any,
  contexto: any
): string {
  const hookPersonalizado = settings.hookType || settings.customHook || '';
  const strategyLoop = settings.strategyLoop || 'magnetic_loop';
  const vectorEmocional = settings.vector_emocional || 'dolor_profundo';
  const awareness = settings.awareness || 'Consciente del Problema';
  const situation = settings.situation || 'Dolor Agudo (Urgencia)';
  const culturalContext = settings.culturalContext || '';

  return `GENERA EL GUION VIRAL AHORA.

TEMA / INPUT DEL USUARIO:
${temaUsuario}

PARÁMETROS DE EJECUCIÓN:
- Strategy Loop: ${strategyLoop}
- Vector Emocional: ${vectorEmocional}
- Nivel de Conciencia: ${awareness}
- Situación del Avatar: ${situation}
- Hook Personalizado: ${hookPersonalizado || 'Generar el más poderoso según análisis'}
${culturalContext ? `- Contexto Cultural: ${culturalContext}` : ''}

PLAN DE ATAQUE (ya analizado por el Estratega):
- Conflicto central a explotar: ${estrategia.conflicto_central}
- Insight a revelar: ${estrategia.insight_explotable}
- Tensión narrativa: ${estrategia.tension_base}
- Sector masivo activado: ${estrategia.sector_tca}
- Hook recomendado: ${estrategia.hook_recomendado}

EJECUTA. Devuelve SOLO el JSON estructurado. Sin texto previo. Sin markdown.`;
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