// ==================================================================================
// ⚖️ HANDLER: JUEZ VIRAL V500
// ==================================================================================

import { ejecutarJuezViralV500 } from '../prompts/juez-viral.ts';
import { ejecutarAuditoriaExperto } from '../prompts/audit-expert.ts';
import { ejecutarAuditorAvatar } from '../prompts/audit-avatar.ts';
import { ejecutarMentorEstrategico } from '../prompts/mentor.ts';
import { ejecutarCopyExpert } from '../prompts/copy-expert.ts';
import { getVideoContent } from '../lib/analizaredes.ts';
import { scrapeYouTubeComments } from '../lib/analizaredes.ts';
import { ContextoUsuario } from '../lib/types.ts';
import { logger, createError, validateUrl, sanitizeContext } from '../lib/logger.ts';

// ─── JUEZ VIRAL ─────────────────────────────────────────────

export async function handleJuezViral(
  body: any,
  settings: any,
  processedContext: string,
  userContext: ContextoUsuario,
  userId: string,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] ⚖️ Juez Viral V500 OMEGA...');

  const texto = body.text || body.userInput || processedContext;
  if (!texto) throw new Error("⚠️ El Juez necesita un texto para analizar.");

  const contextoConUser = { ...userContext, userId };
  const res = await ejecutarJuezViralV500(contextoConUser, texto, openai, settings);
  return { result: res.data, tokensUsed: res.tokens };
}

// ─── AUDIT EXPERT ────────────────────────────────────────────

export async function handleAuditExpert(
  body: any,
  userContext: ContextoUsuario,
  supabase: any,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] 🚀 Auditoría de Experto...');

  // 1. Parsear datos del experto
  let expertData: any = {};
  try {
    if (body.transcript && typeof body.transcript === 'string') {
      const cleanJson = body.transcript.trim();
      if (cleanJson.startsWith('{')) {
        expertData = JSON.parse(cleanJson);
        console.log(`[AUDIT-EXPERT] ✅ Experto: ${expertData.name || 'Sin nombre'}`);
      } else {
        expertData = { raw_input: cleanJson };
      }
    } else if (typeof body.transcript === 'object') {
      expertData = body.transcript;
    } else {
      expertData = { raw: String(body.transcript) };
    }
  } catch (e) {
    expertData = { raw_text: body.transcript || "Error de lectura" };
  }

  // 2. Contexto del avatar si aplica
  let avatarContext = "";
  if (body.avatarId) {
    const { data: avatar } = await supabase
      .from('avatars')
      .select('name, pain_points, desires, current_situation, primary_goal')
      .eq('id', body.avatarId)
      .single();

    if (avatar) {
      avatarContext = `
CONTEXTO DEL CLIENTE IDEAL (TARGET):
Este experto le vende a un Avatar llamado "${avatar.name}".
- Sus Dolores: ${avatar.pain_points}
- Sus Deseos: ${avatar.desires}
- Situación Actual: ${avatar.current_situation}
- Objetivo del Avatar: ${avatar.primary_goal}
NOTA: Evalúa si la autoridad del experto es suficiente para ESTE avatar.`;
    }
  }

  // 3. URLs de competidores
  const competitorUrls: string[] = body.competitorUrls || [];

  // 4. Ejecutar auditoría
  const res = await ejecutarAuditoriaExperto(expertData, avatarContext, openai, competitorUrls);

  const result = {
    ...res.data,
    metadata: {
      timestamp: new Date().toISOString(),
      analisis_realizado: true,
      nicho_detectado: expertData.niche || "No especificado",
      version_motor: "Titan Strategy V4.0"
    }
  };

  return { result, tokensUsed: res.tokens };
}

// ─── AUDIT AVATAR ────────────────────────────────────────────

export async function handleAuditAvatar(
  body: any,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] 🚀 Auditoría de Avatar...');

  // 1. Parsear datos
  let avatarData: any = {};
  let infoParaPrompt = "";

  try {
    if (body.transcript && typeof body.transcript === 'string' && body.transcript.trim().startsWith('{')) {
      avatarData = JSON.parse(body.transcript);
      console.log('[AUDIT-AVATAR] ✅ Campos:', Object.keys(avatarData));

      infoParaPrompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS COMPLETOS DEL AVATAR (JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(avatarData, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RESUMEN LEGIBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 IDENTIDAD:
  • Nombre: ${avatarData.name || 'Sin nombre'}
  • Estado: ${avatarData.is_active ? '✅ Activo' : '⚠️ Inactivo'}

🧠 CORE (OBLIGATORIO):
  • Nivel Experiencia: ${avatarData.experience_level || 'N/A'}
  • Objetivo Principal: ${avatarData.primary_goal || 'N/A'}
  • Estilo Comunicación: ${avatarData.communication_style || 'N/A'}
  • Nivel Riesgo: ${avatarData.risk_level || 'N/A'}
  • Prioridad Contenido: ${avatarData.content_priority || 'N/A'}
  • Emoción Dominante: ${avatarData.dominant_emotion || 'N/A'}

🛡️ PROHIBICIONES ACTIVAS:
${Object.entries(avatarData.prohibitions || {})
  .filter(([_, v]) => v === true)
  .map(([k]) => `  ✓ ${k.replace(/_/g, ' ')}`)
  .join('\n') || '  (Ninguna)'}

📚 VOCABULARIO:
  • Palabras Clave: ${Array.isArray(avatarData.signature_vocabulary) ? avatarData.signature_vocabulary.join(', ') : 'No definidas'}
  • Palabras Prohibidas: ${Array.isArray(avatarData.banned_vocabulary) ? avatarData.banned_vocabulary.join(', ') : 'No definidas'}

⚠️ INSTRUCCIÓN: Penaliza campos vacíos. Recompensa especificidad. Devuelve JSON optimizado.
`;
    } else {
      infoParaPrompt = body.transcript || "Perfil vacío";
    }
  } catch (e) {
    infoParaPrompt = body.transcript || "Error al procesar datos";
  }

  // 2. Nicho operativo
  const nichoOperativo = body.niche || userContext.nicho || "General";

  // 3. Validación
  if (!infoParaPrompt || infoParaPrompt.trim().length < 20) {
    throw new Error('⚠️ Datos insuficientes. Completa al menos el nombre y los campos core.');
  }

  // 4. Scraping de comentarios (opcional)
  let comentariosExtraidos = '';
  const urlsCompetidores: string[] = body.competitorUrls || [];
  if (urlsCompetidores.length > 0) {
    console.log(`[AUDIT-AVATAR] 🕵️ Scraping ${urlsCompetidores.length} URL(s)...`);
    const todosLosComentarios: string[] = [];
    for (const url of urlsCompetidores.slice(0, 3)) {
      try {
        const scraped = await scrapeYouTubeComments(url);
        if (scraped.comments.length > 0) {
          const frases = scraped.comments.slice(0, 30).map((c: any) => `- "${c.text}" (👍 ${c.likes})`).join('\n');
          todosLosComentarios.push(`VIDEO: ${scraped.videoTitle || url}\n${frases}`);
        }
      } catch (e) {
        console.warn(`[AUDIT-AVATAR] ⚠️ Error scraping ${url}`);
      }
    }
    if (todosLosComentarios.length > 0) {
      comentariosExtraidos = todosLosComentarios.join('\n\n');
    }
  }

  // 5. Ejecutar auditoría
  const res = await ejecutarAuditorAvatar(infoParaPrompt, nichoOperativo, openai, comentariosExtraidos);

  const result = {
    ...res.data,
    metadata: {
      analisis_realizado: true,
      nicho_usado: nichoOperativo,
      timestamp: new Date().toISOString(),
      campos_analizados: Object.keys(avatarData).length,
      datos_originales_preservados: avatarData
    }
  };

  console.log(`[AUDIT-AVATAR] ✅ Score: ${result.auditoria_calidad?.score_global || 'N/A'}/100`);
  return { result, tokensUsed: res.tokens };
}

// ─── MENTOR / CHAT ───────────────────────────────────────────

export async function handleMentor(
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  const res = await ejecutarMentorEstrategico(userContext, processedContext, openai);
  return { result: res.data, tokensUsed: res.tokens };
}

// ─── COPY EXPERT ─────────────────────────────────────────────

export async function handleCopyExpert(
  body: any,
  settings: any,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number; whisperMinutes: number }> {
  console.log('[HANDLER] 📝 Copy Expert Multiplataforma...');

  let contenidoOriginal = "";
  let whisperMinutes = 0;
  let videoSource: 'url' | 'upload' | 'manual' = 'manual';

  // 1. Obtener contenido
  try {
    if (body.url || body.uploadedVideo) {
      const videoData = await getVideoContent(
        body.url || null,
        body.uploadedVideo || null,
        body.uploadedFileName || null,
        openai
      );
      contenidoOriginal = videoData.transcript;
      videoSource = videoData.source;
      if (videoData.duration > 0) {
        whisperMinutes = Math.ceil(videoData.duration / 60);
      }
    } else if (processedContext && processedContext.length > 20) {
      contenidoOriginal = processedContext;
      videoSource = 'manual';
    } else {
      throw new Error('⚠️ Proporciona contenido (texto, URL o video).');
    }
  } catch (videoError: any) {
    if (processedContext && processedContext.length > 20) {
      contenidoOriginal = processedContext;
      videoSource = 'manual';
    } else {
      throw new Error(`Error obteniendo contenido: ${videoError.message}`);
    }
  }

  if (!contenidoOriginal || contenidoOriginal.length < 20) {
    throw new Error('⚠️ Contenido insuficiente. Mínimo 20 caracteres.');
  }

  // 2. Settings
  const copySettings = {
    red_social: settings.red_social || body.settings?.red_social || 'TikTok',
    formato: settings.formato || body.settings?.formato || 'Video',
    objetivo: settings.objetivo || body.settings?.objetivo || 'Educar / Valor',
    tipo_contenido: body.settings?.tipo_contenido || undefined
  };

  // 3. Ejecutar
  const copyRes = await ejecutarCopyExpert(contenidoOriginal, userContext, openai, copySettings);

  const result = {
    ...copyRes.data,
    metadata_procesamiento: {
      source: videoSource,
      whisper_usado: whisperMinutes > 0,
      longitud_original: contenidoOriginal.length,
      url_original: body.url || null,
      archivo_subido: body.uploadedFileName || null,
      timestamp: new Date().toISOString()
    }
  };

  console.log(`[COPY EXPERT] ✅ Score: ${result.validacion_interna?.score_calidad || 'N/A'}`);
  return { result, tokensUsed: copyRes.tokens, whisperMinutes };
}