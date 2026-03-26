// ==================================================================================
// 🎬 TITAN ENGINE — ARQUITECTURA HÍBRIDA (RAILWAY + PROCESAMIENTO LOCAL)
// ==================================================================================

import { ApifyClient } from 'npm:apify-client';
import { withTimeout } from './security.ts';

// ==================================================================================
// 🔍 DETECTOR DE PLATAFORMA
// ==================================================================================
export function detectPlatform(url: string): string {
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/shorts')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com') || url.includes('facebook.com/reel')) return 'facebook';
  return 'unknown';
}

// ==================================================================================
// 🚀 CONEXIÓN DIRECTA CON RAILWAY (Para Links)
// ==================================================================================
export async function transcribeWithRailway(url: string): Promise<{
    transcript: string;
    duration: number;
    platform: string;
}> {
    console.log(`[RAILWAY] 🚀 Enviando URL al motor externo: ${url}`);

    const railwaySecret = Deno.env.get('API_SECRET') || '';

    // CORRECCIÓN: timeout explícito de 5 minutos (300s) para videos largos
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 300_000);

    let response: Response;
    try {
        response = await fetch('https://motor-submagic-production.up.railway.app/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Secret': railwaySecret,
            },
            body: JSON.stringify({ url }),
            signal: controller.signal,
        });
    } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
            // CORRECCIÓN: error real, no silencioso
            throw new Error(
                'RAILWAY_TIMEOUT: El motor de transcripción tardó más de 5 minutos. ' +
                'El video puede ser demasiado largo o el servidor está ocupado. Intenta de nuevo.'
            );
        }
        throw new Error(`RAILWAY_NETWORK: No se pudo conectar al motor de transcripción: ${fetchError.message}`);
    } finally {
        clearTimeout(timeoutId);
    }

    // CORRECCIÓN: propagar el error real del servidor Railway con detalle
    if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
            const errorBody = await response.json();
            errorDetail = errorBody?.detail || errorBody?.error || JSON.stringify(errorBody);
        } catch {
            try {
                errorDetail = await response.text();
            } catch {
                // mantener el status code
            }
        }

        // Mensajes específicos por código para que el frontend los muestre bien
        if (response.status === 401) {
            throw new Error('RAILWAY_AUTH: El motor de transcripción rechazó la solicitud (API_SECRET incorrecto).');
        }
        if (response.status === 408) {
            throw new Error(`RAILWAY_TIMEOUT: ${errorDetail}`);
        }
        if (response.status === 413) {
            throw new Error(`RAILWAY_FILE_TOO_LARGE: ${errorDetail}`);
        }
        if (response.status === 422) {
            throw new Error(`RAILWAY_UNPROCESSABLE: ${errorDetail}`);
        }
        throw new Error(`RAILWAY_ERROR_${response.status}: ${errorDetail}`);
    }

    let data: any;
    try {
        data = await response.json();
    } catch {
        throw new Error('RAILWAY_PARSE: El motor devolvió una respuesta no válida (no es JSON).');
    }

    // CORRECCIÓN: validar que la transcripción tenga contenido real
    const transcript = (data?.transcript || '').trim();
    if (!transcript || transcript.length < 10) {
        throw new Error(
            'RAILWAY_EMPTY_TRANSCRIPT: La transcripción resultó vacía. ' +
            'El video puede no tener audio hablado, estar en un idioma no soportado, ' +
            'o la URL no es accesible públicamente.'
        );
    }

    console.log(`[RAILWAY] ✅ Transcripción exitosa: ${data.words} palabras en ${data.time_ms}ms`);

    return {
        transcript,
        duration: data.duration || 0,
        platform: detectPlatform(url),
    };
}

// ==================================================================================
// 📁 PROCESAR VIDEO SUBIDO (Mantenido intacto para Generador de Guiones)
// ==================================================================================
export async function processUploadedVideo(
  fileBase64: string,
  fileName: string,
  openai: any
): Promise<{ transcript: string; duration: number; fileType: string }> {
  console.log('[UPLOAD] 📁 Procesando video subido:', fileName);
  try {
    const base64Data = fileBase64.split(',')[1] || fileBase64;
    const videoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeType =
      fileExtension === 'mov'  ? 'video/quicktime'  :
      fileExtension === 'avi'  ? 'video/x-msvideo'  :
      fileExtension === 'webm' ? 'video/webm'        :
      'video/mp4';
    const videoFile = new File([videoBuffer], fileName, { type: mimeType });

    console.log('[UPLOAD] 🎙️ Enviando a Whisper Local...');
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 25_000);

    let transcription: any;
    try {
        transcription = await openai.audio.transcriptions.create({
            file:            videoFile,
            model:           'whisper-1',
            response_format: 'verbose_json',
            temperature:     0,
            signal:          controller.signal,
        });
    } catch (err: any) {
        if (err.name === 'AbortError') {
            throw new Error('UPLOAD_TIMEOUT: Whisper tardó más de 25 segundos procesando el archivo subido.');
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }

    const transcript = (transcription?.text || '').trim();
    if (!transcript || transcript.length < 10) {
        throw new Error('UPLOAD_EMPTY_TRANSCRIPT: El video subido no produjo transcripción. Verifica que tenga audio hablado.');
    }

    console.log('[UPLOAD] ✅ Transcripción completada');
    return { transcript, duration: transcription.duration || 0, fileType: fileExtension };

  } catch (error: any) {
    console.error('[UPLOAD] ❌ Error:', error.message);
    // Re-lanzar con prefijo claro para que el handler lo muestre tal cual
    throw new Error(`Error al procesar video subido: ${error.message}`);
  }
}

// ==================================================================================
// 💬 YOUTUBE COMMENTS SCRAPER (Intacto para Audit Avatar)
// ==================================================================================
export async function scrapeYouTubeComments(url: string): Promise<{
  comments: { text: string; likes: number }[];
  videoTitle: string;
  description: string;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) {
    console.warn('[COMMENTS] ⚠️ APIFY_API_TOKEN no configurado');
    return { comments: [], videoTitle: '', description: '' };
  }
  try {
    console.log('[COMMENTS] 💬 Scraping comentarios YouTube:', url);
    const client = new ApifyClient({ token: apifyToken });
    const run = await client.actor('bernardo/youtube-scraper').call({
      startUrls:         [{ url }],
      maxResults:        1,
      maxComments:       100,
      subtitlesLanguage: 'es',
    });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      return { comments: [], videoTitle: '', description: '' };
    }
    const video        = items[0] as any;
    const rawComments: any[] = video.comments || [];
    const comments = rawComments
      .filter((c: any) => c.text && c.text.trim().length > 10)
      .map((c: any)    => ({ text: c.text?.trim() || '', likes: c.likes || 0 }))
      .sort((a: any, b: any) => b.likes - a.likes)
      .slice(0, 80);
    console.log(`[COMMENTS] ✅ ${comments.length} comentarios útiles extraídos`);
    return { comments, videoTitle: video.title || '', description: video.description || '' };
  } catch (error: any) {
    console.error('[COMMENTS] ❌ Error Apify:', error.message);
    return { comments: [], videoTitle: '', description: '' };
  }
}

// ==================================================================================
// 🎯 ORQUESTADOR PRINCIPAL: getVideoContent
// CORRECCIÓN: elimina todo fallback silencioso — si hay error, lanza el error real.
// ==================================================================================
export async function getVideoContent(
  url: string | null,
  uploadedFile: string | null,
  fileName: string | null,
  openai: any
): Promise<{
  transcript:  string;
  description: string;
  duration:    number;
  platform:    string;
  source:      'url' | 'upload';
}> {

  // 1. Video subido desde PC/Celular
  if (uploadedFile && fileName) {
    console.log('[VIDEO] 📁 Procesando video subido localmente...');
    // CORRECCIÓN: no hay try/catch aquí — el error sube limpio al handler
    const result = await processUploadedVideo(uploadedFile, fileName, openai);
    return {
      transcript:  result.transcript,
      description: `Video subido: ${fileName}`,
      duration:    result.duration,
      platform:    'upload',
      source:      'upload',
    };
  }

  // 2. URL de plataforma social
  if (url && url.includes('http')) {
    console.log('[VIDEO] 🔗 Procesando URL con el motor de Railway...');
    // CORRECCIÓN: no hay try/catch aquí — el error sube limpio al handler
    const result = await transcribeWithRailway(url);
    return {
      transcript:  result.transcript,
      description: `Transcrito con éxito por el Motor Titan.`,
      duration:    result.duration,
      platform:    result.platform,
      source:      'url',
    };
  }

  throw new Error('Debes proporcionar una URL válida (http/https) o subir un archivo de video.');
}