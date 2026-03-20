// ==================================================================================
// 🔬 HANDLER: AUTOPSIA VIRAL + RECREATE (Ingeniería Inversa)
// autopsia_viral → análisis forense puro de un video
// recreate       → Sniper Enterprise — 6 bloques directos al frontend
// ==================================================================================

import { ejecutarAutopsiaViral } from '../prompts/autopsia-viral.ts';
import { ejecutarIngenieriaInversaPro } from '../prompts/ingenieria-inversa.ts';
import { getVideoContent } from '../lib/analizaredes.ts';
import { ContextoUsuario } from '../lib/types.ts';
import { logger, createError, sanitizeContext } from '../lib/logger.ts';

// ==================================================================================
// 🔬 AUTOPSIA VIRAL — sin cambios, funciona igual
// ==================================================================================

export async function handleAutopsiaViral(
  body: any,
  settings: any,
  platform: string,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number; whisperMinutes: number; videoDurationSecs: number }> {
  console.log('[HANDLER] 🔬 Autopsia Viral...');

  let contentToAnalyze = "";
  let platName          = platform || 'General';
  let videoDescription  = '';
  let whisperMinutes    = 0;
  let videoDurationSecs = 0;
  let videoSource: 'url' | 'upload' | 'manual' = 'manual';

  try {
    if (body.url || body.uploadedVideo) {
      const videoData = await getVideoContent(
        body.url || null,
        body.uploadedVideo || null,
        body.uploadedFileName || null,
        openai
      );

      const transcriptPart  = videoData.transcript || '';
      const descriptionPart = (videoData as any).description || '';
      contentToAnalyze = transcriptPart.length >= descriptionPart.length
        ? transcriptPart
        : (transcriptPart + (descriptionPart && descriptionPart !== transcriptPart
            ? '\n\n' + descriptionPart : ''));

      videoDescription  = videoData.description;
      platName          = videoData.platform || platName;
      videoSource       = videoData.source;
      videoDurationSecs = videoData.duration || 0;

      if (videoData.duration > 0) {
        whisperMinutes = Math.ceil(videoData.duration / 60);
      }

    } else if (processedContext && processedContext.length > 50) {
      contentToAnalyze = processedContext;
      videoDescription = 'Transcripción manual';
      videoSource      = 'manual';
    } else {
      throw new Error('Proporciona URL, video subido, o transcripción manual.');
    }
  } catch (videoError: any) {
    if (processedContext && processedContext.length > 50) {
      contentToAnalyze = processedContext;
      videoSource      = 'manual';
    } else {
      throw new Error(`Error: ${videoError.message}`);
    }
  }

  if (!contentToAnalyze || contentToAnalyze.length < 20) {
    throw new Error('Contenido insuficiente (mínimo 20 caracteres).');
  }

  const autopsiaRes = await ejecutarAutopsiaViral(contentToAnalyze, platName, openai);

  const result = {
    ...autopsiaRes.data,
    metadata_video: {
      source:           videoSource,
      platform:         platName,
      description:      videoDescription,
      whisper_used:     whisperMinutes > 0,
      whisper_minutes:  whisperMinutes,
      duration_seconds: videoDurationSecs,
      original_url:     body.url || null,
      uploaded_file:    body.uploadedFileName || null,
    },
  };

  return { result, tokensUsed: autopsiaRes.tokens, whisperMinutes, videoDurationSecs };
}

// ==================================================================================
// 🔁 RECREATE — SNIPER ENTERPRISE (6 bloques directos)
// ==================================================================================

export async function handleReCreate(
  body: any,
  settings: any,
  platform: string,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number; whisperMinutes: number; videoDurationSecs: number }> {
  console.log('[HANDLER] ⚡ SNIPER ENTERPRISE — Ingeniería Inversa');

  const rawUrls: string[]          = body.urls || (body.url ? [body.url] : []);
  const outputLanguage: string     = body.outputLanguage || settings.outputLanguage || 'es';
  const languageNames: Record<string, string> = {
    'es': 'espanol - escribe como hispanohablante nativo, adapta modismos y referencias culturales',
    'en': 'English - write as a native English speaker, adapt idioms and cultural references',
    'pt': 'portugues brasileiro - escreva como falante nativo, adapte expressoes e referencias culturais',
    'fr': 'francais - ecris comme un locuteur natif, adapte les expressions et references culturelles',
  };
  const outputLanguageFull = languageNames[outputLanguage] || languageNames['es'];
  const urlCount           = rawUrls.filter((u: string) => u && u.trim()).length;
  settings.urlCount        = urlCount;

  let contentToAnalyze  = "";
  let targetTopic       = processedContext;
  let platName          = settings.platform || platform || 'TikTok';
  let videoDescription  = '';
  let whisperMinutes    = 0;
  let videoDurationSecs = 0;
  let videoSource: 'url' | 'upload' | 'manual' = 'manual';
  let videoData: any    = null;
  const multiAnalysis: any[] = [];

  // ── Obtener contenido del video ─────────────────────────────────
  try {
    if (rawUrls.length > 0 || body.uploadedVideo) {
      const sources = rawUrls.length > 0 ? rawUrls : [null];

      for (let i = 0; i < sources.length; i++) {
        const singleUrl = sources[i];
        console.log(`[RECREATE] Procesando fuente ${i + 1}/${sources.length}...`);

        videoData = await getVideoContent(
          singleUrl,
          i === 0 ? (body.uploadedVideo    || null) : null,
          i === 0 ? (body.uploadedFileName || null) : null,
          openai
        );

        if (i === 0) {
          contentToAnalyze  = (videoData.transcript || '').slice(0, 6000);
          videoDescription  = videoData.description;
          platName          = videoData.platform || platName;
          videoSource       = videoData.source;
          videoDurationSecs = videoData.duration || 0;
        } else {
          const extra = (videoData.transcript || '').slice(0, 2500);
          contentToAnalyze += `\n\n[VIDEO ${i + 1}]:\n${extra}`;
        }

        if (videoData.duration > 0) {
          whisperMinutes += Math.ceil(videoData.duration / 60);
        }

        // Para multi-URL: análisis individual de cada fuente
        if (rawUrls.length > 1) {
          const autopsiaIndividual = await ejecutarAutopsiaViral(
            videoData.transcript, platName, openai
          );
          multiAnalysis.push(autopsiaIndividual.data);
        }
      }

    } else if (processedContext && processedContext.length > 50) {
      contentToAnalyze = processedContext;
      videoDescription = 'Transcripción manual';
      videoSource      = 'manual';
    } else {
      throw new Error('Proporciona URL(s), video subido, o transcripción manual.');
    }
  } catch (videoError: any) {
    if (processedContext && processedContext.length > 50) {
      contentToAnalyze = processedContext;
      videoSource      = 'manual';
    } else {
      throw new Error(`Error: ${videoError.message}`);
    }
  }

  if (!contentToAnalyze || contentToAnalyze.length < 20) {
    throw new Error('Contenido insuficiente (mínimo 20 caracteres).');
  }

  // ── Enriquecer contexto del usuario ────────────────────────────
  if (targetTopic?.trim()) {
    (userContext as any).nicho                    = targetTopic.trim();
    (userContext as any).nicho_usuario_explicito  = targetTopic.trim();
  }
  (userContext as any).contentType        = settings.contentType  || 'reel';
  (userContext as any).targetPlatform     = settings.platform     || platName;
  (userContext as any).outputLanguage     = outputLanguage;
  (userContext as any).outputLanguageFull = outputLanguageFull;
  (userContext as any)._videoDurationSecs = videoDurationSecs;

  if (videoData?.likes !== undefined) {
    (userContext as any)._engagement = {
      likes:    videoData.likes    || 0,
      views:    videoData.views    || 0,
      comments: videoData.comments || 0,
      shares:   videoData.shares   || 0,
      author:   videoData.author   || '',
    };
  }

  if (multiAnalysis.length > 1) {
    (userContext as any).multi_adn_sources = multiAnalysis.map((a: any) => ({
      genero: a.adn_profundo?.genero_narrativo,
      emocion: a.adn_profundo?.emocion_nucleo,
      hook:    a.adn_estructura?.tipo_apertura,
      score:   a.score_viral_estructural?.viralidad_estructural_global,
    }));
  }

  // ── Ejecutar motor Sniper Enterprise ───────────────────────────
  const motorRes = await ejecutarIngenieriaInversaPro(
    contentToAnalyze, userContext, openai, videoDescription || platName
  );

  settings._videoDurationSecs = videoDurationSecs;

  // ── Extraer los 6 bloques directamente ─────────────────────────
  const sniperData = motorRes.data || {};

  const result = {
    // ── 6 BLOQUES LETALES — acceso directo desde el frontend ─────
    transcripcion_fiel:          sniperData.transcripcion_fiel          || '',
    idea_ganadora:               sniperData.idea_ganadora               || '',
    adn_viral:                   Array.isArray(sniperData.adn_viral)
                                   ? sniperData.adn_viral
                                   : ['No disponible', 'No disponible', 'No disponible'],
    guion_adaptado_teleprompter: sniperData.guion_adaptado_teleprompter || '',
    plan_audiovisual_pro:        sniperData.plan_audiovisual_pro        || {},
    miniatura_circular:          sniperData.miniatura_circular          || {},

    // ── COMPATIBILIDAD HACIA ATRÁS ────────────────────────────────
    // Cualquier código que lea result.guion_generado.* no explota
    guion_generado: {
      ...sniperData,
      // Aliases para que handleRunAudit y OmegaAuditCard lean el guion correctamente
      guion_adaptado_espejo:   sniperData.guion_adaptado_teleprompter || '',
      guion_adaptado_al_nicho: sniperData.guion_adaptado_teleprompter || '',
      guion_tecnico_completo:  sniperData.guion_adaptado_teleprompter || '',
    },

    // Alias plano para SniperResultView (frase miniatura)
    frase_miniatura:  sniperData.miniatura_circular?.frase_principal || '',

    modo: urlCount > 1 ? 'sniper_enterprise_hibrido' : 'sniper_enterprise',

    metadata_video: {
      source:           videoSource,
      platform:         platName,
      description:      videoDescription,
      whisper_used:     whisperMinutes > 0,
      whisper_minutes:  whisperMinutes,
      duration_seconds: videoDurationSecs,
      urls_analizadas:  urlCount,
      original_url:     rawUrls[0]               || null,
      uploaded_file:    body.uploadedFileName     || null,
      nicho_usuario:    targetTopic || (userContext as any)?.nicho || '',
    },
  };

  console.log(`[HANDLER] ✅ Sniper completado — bloques: transcripcion_fiel=${!!result.transcripcion_fiel}, guion=${result.guion_adaptado_teleprompter.length} chars`);

  return { result, tokensUsed: motorRes.tokens, whisperMinutes, videoDurationSecs };
}