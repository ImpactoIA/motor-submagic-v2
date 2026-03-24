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
    
    try {
        const response = await fetch('https://motor-submagic-production.up.railway.app/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Secret': railwaySecret
            },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[RAILWAY ERROR] ❌ Status: ${response.status} - ${errorText}`);
            throw new Error(`Error en el motor de Railway: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[RAILWAY] ✅ Transcripción exitosa: ${data.words} palabras en ${data.time_ms}ms`);

        return {
            transcript: data.transcript,
            duration: 0, 
            platform: detectPlatform(url)
        };
    } catch (error: any) {
        console.error(`[RAILWAY FATAL] ❌ No se pudo conectar al motor:`, error.message);
        throw error;
    }
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
      fileExtension === 'mov' ? 'video/quicktime' :
      fileExtension === 'avi' ? 'video/x-msvideo' :
      fileExtension === 'webm' ? 'video/webm' :
      'video/mp4';
    const videoFile = new File([videoBuffer], fileName, { type: mimeType });
    console.log('[UPLOAD] 🎙️ Enviando a Whisper Local...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); 
    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      temperature: 0,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log('[UPLOAD] ✅ Transcripción completada');
    return { transcript: transcription.text, duration: transcription.duration || 0, fileType: fileExtension };
  } catch (error: any) {
    console.error('[UPLOAD] ❌ Error:', error.message);
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
      startUrls: [{ url }],
      maxResults: 1,
      maxComments: 100,
      subtitlesLanguage: 'es',
    });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      return { comments: [], videoTitle: '', description: '' };
    }
    const video = items[0] as any;
    const rawComments: any[] = video.comments || [];
    const comments = rawComments
      .filter((c: any) => c.text && c.text.trim().length > 10)
      .map((c: any) => ({ text: c.text?.trim() || '', likes: c.likes || 0 }))
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
// El cerebro que decide a dónde mandar el trabajo.
// ==================================================================================
export async function getVideoContent(
  url: string | null,
  uploadedFile: string | null,
  fileName: string | null,
  openai: any
): Promise<{
  transcript: string;
  description: string;
  duration: number;
  platform: string;
  source: 'url' | 'upload';
}> {
  
  // 1. Si el usuario sube un archivo desde su PC/Celular (No se rompe tu otra función)
  if (uploadedFile && fileName) {
    console.log('[VIDEO] 📁 Procesando video subido localmente...');
    const result = await processUploadedVideo(uploadedFile, fileName, openai);
    return {
      transcript: result.transcript,
      description: `Video subido: ${fileName}`,
      duration: result.duration,
      platform: 'upload',
      source: 'upload'
    };
  }
  
  // 2. Si el usuario pega un Link (Se va a Railway para no saturar)
  if (url && url.includes('http')) {
    console.log('[VIDEO] 🔗 Procesando URL con el nuevo motor de Railway...');
    const result = await transcribeWithRailway(url);
    
    return {
      transcript: result.transcript,
      description: `Transcrito con éxito por el Motor Titan.`,
      duration: result.duration,
      platform: result.platform,
      source: 'url'
    };
  }
  
  throw new Error('Debes proporcionar una URL válida o subir un archivo.');
}