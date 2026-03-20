// ==================================================================================
// 🔌 PARCHE FUTURO — lib/analizaredes.ts
//
// INSTRUCCIÓN: Cuando el microservicio Python esté desplegado en Railway/Render,
// aplica estos 2 cambios quirúrgicos en analizaredes.ts.
// NO modifiques nada más del archivo.
// ==================================================================================

// ==================================================================================
// CAMBIO 1 — Agregar esta función al inicio del archivo
// (pégala justo después de los imports existentes, antes de detectPlatform)
// ==================================================================================

const SUBMAGIC_API_URL    = Deno.env.get('SUBMAGIC_API_URL')    || '';  // ej: https://tu-app.railway.app
const SUBMAGIC_API_SECRET = Deno.env.get('SUBMAGIC_API_SECRET') || '';  // el API_SECRET que configuraste

/**
 * Llama al microservicio Python para transcribir un video.
 * Si el microservicio no está disponible, retorna null y el sistema
 * cae en fallback al Whisper nativo de OpenAI (sin romper nada).
 */
async function transcribeWithSubmagicMotor(
  videoUrl: string,
  language?: string
): Promise<{ transcript: string; duration: number; language: string } | null> {

  if (!SUBMAGIC_API_URL) {
    console.log('[SUBMAGIC] ⚠️ SUBMAGIC_API_URL no configurada — usando Whisper nativo');
    return null;
  }

  try {
    console.log(`[SUBMAGIC] 🐍 Enviando a motor Python: ${videoUrl.substring(0, 60)}...`);
    const t = Date.now();

    const response = await fetch(`${SUBMAGIC_API_URL}/transcribe`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'X-Api-Secret':  SUBMAGIC_API_SECRET,
      },
      body: JSON.stringify({ url: videoUrl, language: language || null }),
      signal: AbortSignal.timeout(45000), // 45s timeout
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn(`[SUBMAGIC] ⚠️ Error ${response.status}: ${err.substring(0, 100)}`);
      return null;
    }

    const data = await response.json();
    const elapsed = Date.now() - t;

    console.log(`[SUBMAGIC] ✅ Transcripción en ${elapsed}ms — ${data.words} palabras — idioma: ${data.language}`);

    return {
      transcript: data.transcript || '',
      duration:   data.duration   || 0,
      language:   data.language   || 'auto',
    };

  } catch (error: any) {
    console.warn(`[SUBMAGIC] ⚠️ Microservicio no disponible: ${error.message} — usando Whisper nativo`);
    return null;  // Fallback graceful — el sistema sigue funcionando
  }
}


// ==================================================================================
// CAMBIO 2 — En la función scrapeAndTranscribeVideo,
// reemplaza el bloque "Transcript corto + videoUrl: activar Whisper" (línea ~554)
//
// BUSCA exactamente:
//
//     // ─── Transcript corto + videoUrl: activar Whisper ─────
//     if (hasRealVideoUrl) {
//       console.log(`[SCRAPER] 🎤 Transcript corto — activando Whisper`);
//       try {
//         const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl!, openai);
//
// REEMPLAZA con:
// ==================================================================================

    // ─── Transcript corto + videoUrl: intentar Submagic Motor primero ─────
    if (hasRealVideoUrl) {
      console.log(`[SCRAPER] 🎤 Transcript corto — intentando Motor Submagic...`);
      try {

        // 1. Intentar con el microservicio Python (más rápido y preciso)
        const submagicResult = await transcribeWithSubmagicMotor(videoData.videoUrl!);

        if (submagicResult && submagicResult.transcript.length > transcriptLen) {
          console.log(`[SCRAPER] ⚡ Motor Submagic exitoso — ${submagicResult.transcript.length} chars`);
          return {
            transcript: submagicResult.transcript,
            description: videoData.description,
            duration: submagicResult.duration || (videoData as any).duration || 0,
            platform,
            videoUrl: videoData.videoUrl,
            likes:    (videoData as any).likes    || 0,
            views:    (videoData as any).views    || 0,
            comments: (videoData as any).comments || 0,
            shares:   (videoData as any).shares   || 0,
            author:   (videoData as any).author   || '',
          };
        }

        // 2. Fallback: Whisper nativo de OpenAI
        console.log(`[SCRAPER] 🔄 Fallback a Whisper nativo...`);
        const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl!, openai);
        if (whisperResult.transcript && whisperResult.transcript.length > transcriptLen) {
          return {
            transcript: whisperResult.transcript,
            description: videoData.description,
            duration: whisperResult.duration,
            platform,
            videoUrl: videoData.videoUrl,
            likes:    (videoData as any).likes    || 0,
            views:    (videoData as any).views    || 0,
            comments: (videoData as any).comments || 0,
            shares:   (videoData as any).shares   || 0,
            author:   (videoData as any).author   || '',
          };
        }

      } catch (whisperErr: any) {
        console.warn('[SCRAPER] ⚠️ Ambos motores fallaron:', whisperErr.message);
      }
    }

// ==================================================================================
// VARIABLES DE ENTORNO A AGREGAR EN SUPABASE (Dashboard → Settings → Edge Functions)
//
// SUBMAGIC_API_URL     = https://tu-app.railway.app
// SUBMAGIC_API_SECRET  = un-token-secreto-largo-aqui
//
// Y en Railway/Render configurar el mismo API_SECRET en las variables de entorno
// del microservicio Python.
// ==================================================================================