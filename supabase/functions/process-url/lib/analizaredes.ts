// ==================================================================================
// 🎬 TITAN ENGINE — SCRAPERS DE PLATAFORMAS + WHISPER
// TikTok, Instagram, YouTube, Facebook + transcripción de audio
// Todos dependen de Apify (APIFY_API_TOKEN) y OpenAI Whisper
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
// 🎵 TIKTOK SCRAPER V2
// ==================================================================================

export async function scrapeTikTok(url: string): Promise<{
  videoUrl: string;
  description: string;
  transcript?: string;
  duration?: number;
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  author?: string;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) {
    console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado');
    return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }
  try {
    console.log('[SCRAPER] 🎵 Iniciando scraping de TikTok:', url);
    const client = new ApifyClient({ token: apifyToken });
    const runResult = await withTimeout(
      client.actor('apify/tiktok-scraper').call({
        postURLs: [url],
        resultsPerPage: 1,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
        shouldDownloadSubtitles: true,
        subtitlesLanguage: 'es',
        subtitlesLanguage2: 'en',
        proxyConfiguration: { useApifyProxy: true },
      }, { waitSecs: 30 }),
      30000,
      null
    );
    if (!runResult) {
      console.warn('[SCRAPER] ⚠️ TikTok timeout 55s — continuando sin scraper');
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
    }
    const { items } = await client.dataset(runResult.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      console.warn('[SCRAPER] ⚠️ TikTok no devolvió items');
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
    }
    const v = items[0] as any;
    const bestVideoUrl = v.videoUrlNoWatermark || v.videoUrl || v.downloadAddr || '';
    let transcriptFinal = '';
    if (Array.isArray(v.subtitles) && v.subtitles.length > 0) {
      transcriptFinal = v.subtitles.map((s: any) => s.text || s.content || s.word || '').join(' ').trim();
    } else if (typeof v.subtitles === 'string' && v.subtitles.length > 20) {
      transcriptFinal = v.subtitles;
    } else if (v.subtitleText && v.subtitleText.length > 20) {
      transcriptFinal = v.subtitleText;
    } else if (v.videoSubtitles) {
      transcriptFinal = Array.isArray(v.videoSubtitles)
        ? v.videoSubtitles.map((s: any) => s.text || '').join(' ')
        : String(v.videoSubtitles);
    }
    const description = v.text || v.desc || v.description || '';
    if (!transcriptFinal || transcriptFinal.length < 50) {
      transcriptFinal = description;
    }
    console.log(`[SCRAPER] ✅ TikTok listo — Transcript: ${transcriptFinal.length} chars`);
    return {
      videoUrl: bestVideoUrl || url,
      description,
      transcript: transcriptFinal,
      duration: v.videoMeta?.duration || v.duration || 0,
      likes: v.diggCount || v.likeCount || v.likes || 0,
      views: v.playCount || v.viewCount || v.views || 0,
      comments: v.commentCount || v.comments || 0,
      shares: v.shareCount || v.shares || 0,
      author: v.authorMeta?.name || v.author?.uniqueId || '',
    };
  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error TikTok:', error.message);
    return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }
}

// ==================================================================================
// 📸 INSTAGRAM SCRAPER V2
// ==================================================================================

export async function scrapeInstagram(url: string): Promise<{
  videoUrl: string;
  description: string;
  transcript?: string;
  detectedLanguage?: string;
  duration?: number;
  likes?: number;
  views?: number;
  comments?: number;
  author?: string;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) {
    console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado');
    return { videoUrl: url, description: '', duration: 0 };
  }
  try {
    console.log('[SCRAPER] 📸 Iniciando scraping de Instagram:', url);
    const client = new ApifyClient({ token: apifyToken });
    const igRun = await withTimeout(
      client.actor('apify/instagram-scraper').call({
        directUrls: [url],
        resultsType: 'posts',
        resultsLimit: 1,
      }, { waitSecs: 30 }),
      30000,
      null
    );
    if (!igRun) {
      console.warn('[SCRAPER] ⚠️ Instagram timeout 55s');
      return { videoUrl: url, description: '', duration: 0 };
    }
    const { items } = await client.dataset(igRun.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      return { videoUrl: url, description: '', duration: 0 };
    }
    const v = items[0] as any;
    const bestVideoUrl = v.videoUrl || v.videoPlaybackUrl || v.displayUrl || '';
    const transcript = v.caption || v.accessibility_caption || v.text || '';
    console.log(`[SCRAPER] ✅ Instagram listo — Transcript: ${transcript.length} chars`);
    return {
      videoUrl: bestVideoUrl || url,
      description: transcript,
      transcript,
      detectedLanguage: v.language || 'auto',
      duration: v.videoDuration || v.duration || 0,
      likes: v.likesCount || v.likes || 0,
      views: v.videoViewCount || v.views || 0,
      comments: v.commentsCount || v.comments || 0,
      author: v.ownerUsername || v.username || '',
    };
  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error Instagram:', error.message);
    return { videoUrl: url, description: '', duration: 0 };
  }
}

// ==================================================================================
// 🎥 YOUTUBE SCRAPER V2
// ==================================================================================

export async function scrapeYouTube(url: string): Promise<{
  videoUrl: string;
  description: string;
  transcript?: string;
  duration?: number;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) {
    console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado');
    return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }
  try {
    console.log('[SCRAPER] 🎥 Iniciando scraping de YouTube:', url);
    const client = new ApifyClient({ token: apifyToken });
    const ytRun = await withTimeout(
      client.actor('apify/youtube-scraper').call({
        startUrls: [{ url }],
        maxResults: 1,
        subtitlesLanguage: 'es',
        subtitlesLanguage2: 'en',
        downloadSubtitles: true,
        subtitlesFormat: 'plaintext',
      }, { waitSecs: 30 }),
      30000,
      null
    );
    if (!ytRun) {
      console.warn('[SCRAPER] ⚠️ YouTube timeout 55s');
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
    }
    const { items } = await client.dataset(ytRun.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      // Fallback: segundo actor
      console.warn('[SCRAPER] ⚠️ YouTube streamers falló, probando bernardo...');
      const client2 = new ApifyClient({ token: apifyToken });
      const run2 = await client2.actor('bernardo/youtube-scraper').call({
        startUrls: [{ url }],
        maxResults: 1,
      }, { waitSecs: 60 });
      const { items: items2 } = await client2.dataset(run2.defaultDatasetId).listItems();
      if (!items2 || items2.length === 0) {
        return { videoUrl: url, description: '', transcript: '', duration: 0 };
      }
      const v2 = items2[0] as any;
      return {
        videoUrl: url,
        description: v2.description || '',
        transcript: v2.subtitles || v2.subtitleText || v2.captions || v2.description || '',
        duration: v2.lengthSeconds || 0
      };
    }
    const v = items[0] as any;
    let transcript = '';
    if (Array.isArray(v.subtitles)) {
      transcript = v.subtitles.map((s: any) => s.text || s.content || '').join(' ').trim();
    } else if (typeof v.subtitles === 'string') {
      transcript = v.subtitles;
    } else if (v.subtitleText) {
      transcript = v.subtitleText;
    } else if (v.captions) {
      transcript = typeof v.captions === 'string' ? v.captions : JSON.stringify(v.captions);
    }
    if (!transcript || transcript.length < 100) {
      transcript = v.description || v.text || '';
    }
    console.log(`[SCRAPER] ✅ YouTube listo — Transcript: ${transcript.length} chars`);
    return {
      videoUrl: url,
      description: v.description || '',
      transcript,
      duration: v.lengthSeconds || v.duration || 0
    };
  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error YouTube:', error.message);
    return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }
}

// ==================================================================================
// 👍 FACEBOOK SCRAPER V2
// ==================================================================================

export async function scrapeFacebook(url: string): Promise<{
  videoUrl: string;
  description: string;
  transcript?: string;
  detectedLanguage?: string;
  duration?: number;
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  author?: string;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  if (!apifyToken) {
    console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado para Facebook');
    return { videoUrl: url, description: '', duration: 0 };
  }
  try {
    console.log('[SCRAPER] 👍 Iniciando scraping de Facebook:', url);
    const client = new ApifyClient({ token: apifyToken });
    const fbRun = await withTimeout(
      client.actor('apify/facebook-posts-scraper').call({
        startUrls: [{ url }],
        resultsLimit: 1,
      }, { waitSecs: 30 }),
      30000,
      null
    );
    if (!fbRun) {
      console.warn('[SCRAPER] ⚠️ Facebook timeout 50s');
      return { videoUrl: url, description: '', duration: 0 };
    }
    const { items } = await client.dataset(fbRun.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      return { videoUrl: url, description: '', duration: 0 };
    }
    const v = items[0] as any;
    const bestVideoUrl = v.videoUrl || v.videoHdUrl || v.videoSdUrl || url;
    const transcript = v.text || v.message || v.description || v.caption || '';
    console.log(`[SCRAPER] ✅ Facebook listo — Transcript: ${transcript.length} chars`);
    return {
      videoUrl: bestVideoUrl,
      description: transcript,
      transcript,
      detectedLanguage: v.language || 'auto',
      duration: v.videoDuration || v.duration || 0
    };
  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error Facebook:', error.message);
    return { videoUrl: url, description: '', duration: 0 };
  }
}

// ==================================================================================
// 💬 YOUTUBE COMMENTS SCRAPER (para Audit Avatar)
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
// 🎙️ WHISPER TRANSCRIPTION (para videos con audio)
// ==================================================================================

export async function transcribeVideoWithWhisper(videoUrl: string, openai: any): Promise<{
  transcript: string;
  duration: number;
  language?: string;
}> {
  console.log('[WHISPER] 🎤 Descargando audio...');
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error('No se pudo descargar el video');
  }
  const videoBlob = await videoResponse.blob();
  const videoBuffer = await videoBlob.arrayBuffer();
  const sizeMB = videoBuffer.byteLength / 1024 / 1024;
  console.log(`[WHISPER] 📊 Video: ${sizeMB.toFixed(2)} MB`);
  
  // Estrategia: Chunking de Buffer para archivos grandes
  if (sizeMB > 24) {
    console.log(`[WHISPER] 📁 Archivo grande detectado. Iniciando división (chunking)...`);
    return await transcribeLargeVideoWithWhisper(videoBuffer, openai);
  }
  
  const videoFile = new File([videoBuffer], 'video.mp4', { type: 'video/mp4' });
  console.log('[WHISPER] 🎙️ Enviando a Whisper...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 segundos máximo

  const transcription = await openai.audio.transcriptions.create({
    file: videoFile,
    model: 'whisper-1',
    response_format: 'verbose_json',
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  console.log('[WHISPER] ✅ Transcripción completada');
  return {
    transcript: transcription.text,
    duration: transcription.duration || 0,
    language: transcription.language || 'auto',
  };
}

// ==================================================================================
// 📁 CHUNKING DE BUFFER PARA ARCHIVOS GRANDES
// ==================================================================================

async function transcribeLargeVideoWithWhisper(videoBuffer: ArrayBuffer, openai: any): Promise<{
  transcript: string;
  duration: number;
  language?: string;
}> {
  console.log('[WHISPER CHUNKING] 📦 Iniciando chunking de video grande...');
  
  // Configuración de chunking
  const CHUNK_SIZE_MB = 20; // Tamaño objetivo por chunk (en MB)
  const CHUNK_SIZE_BYTES = CHUNK_SIZE_MB * 1024 * 1024;
  const totalSize = videoBuffer.byteLength;
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE_BYTES);
  
  console.log(`[WHISPER CHUNKING] 📊 Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[WHISPER CHUNKING] 📦 Número de chunks: ${totalChunks}`);
  
  const transcripts: string[] = [];
  let totalDuration = 0;
  let detectedLanguage = 'auto';
  
  // Procesar cada chunk secuencialmente
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE_BYTES;
    const end = Math.min(start + CHUNK_SIZE_BYTES, totalSize);
    const chunkBuffer = videoBuffer.slice(start, end);
    
    console.log(`[WHISPER CHUNKING] 🔄 Procesando chunk ${i + 1}/${totalChunks} (${(chunkBuffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);
    
    try {
      const chunkFile = new File([chunkBuffer], `chunk_${i + 1}.mp4`, { type: 'video/mp4' });
      const chunkTranscription = await openai.audio.transcriptions.create({
        file: chunkFile,
        model: 'whisper-1',
        response_format: 'verbose_json'
      });
      
      transcripts.push(chunkTranscription.text);
      totalDuration += chunkTranscription.duration || 0;
      
      if (chunkTranscription.language && chunkTranscription.language !== 'auto') {
        detectedLanguage = chunkTranscription.language;
      }
      
      console.log(`[WHISPER CHUNKING] ✅ Chunk ${i + 1}/${totalChunks} completado`);
      
    } catch (error: any) {
      console.error(`[WHISPER CHUNKING] ❌ Error en chunk ${i + 1}:`, error.message);
      // Si un chunk falla, continuar con los siguientes
      continue;
    }
  }
  
  // Concatenar todos los transcripts
  const fullTranscript = transcripts.join(' ').trim();
  
  console.log(`[WHISPER CHUNKING] ✅ Chunking completado. Transcript final: ${fullTranscript.length} caracteres`);
  
  return {
    transcript: fullTranscript,
    duration: totalDuration,
    language: detectedLanguage,
  };
}

// ==================================================================================
// 📁 PROCESAR VIDEO SUBIDO (Base64 → Whisper)
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
    console.log('[UPLOAD] 🎙️ Enviando a Whisper...');
    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: 'whisper-1',
      response_format: 'verbose_json'
    });
    console.log('[UPLOAD] ✅ Transcripción completada');
    return { transcript: transcription.text, duration: transcription.duration || 0, fileType: fileExtension };
  } catch (error: any) {
    console.error('[UPLOAD] ❌ Error:', error.message);
    throw new Error(`Error al procesar video subido: ${error.message}`);
  }
}

// ==================================================================================
// 🎯 ORQUESTADOR PRINCIPAL: getVideoContent
// Entrada unificada para URL o video subido — usa el scraper correcto
// ==================================================================================

export async function scrapeAndTranscribeVideo(
  url: string,
  openai: any
): Promise<{
  transcript: string;
  description: string;
  duration: number;
  platform: string;
  videoUrl?: string;
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  author?: string;
}> {
  const platform = detectPlatform(url);
  console.log(`[SCRAPER] 🎯 Plataforma detectada: ${platform.toUpperCase()}`);

  let videoData: { videoUrl: string; description: string; transcript?: string } = {
    videoUrl: '',
    description: '',
    transcript: ''
  };

  try {
    switch (platform) {
      case 'tiktok':    videoData = await scrapeTikTok(url);    break;
      case 'instagram': videoData = await scrapeInstagram(url); break;
      case 'youtube':   videoData = await scrapeYouTube(url);   break;
      case 'facebook':  videoData = await scrapeFacebook(url);  break;
      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }

    const transcriptLen = videoData.transcript?.length || 0;
    const hasRealVideoUrl = videoData.videoUrl && videoData.videoUrl !== url && videoData.videoUrl.startsWith('http');

    // ─── Transcript rico: usarlo directo ──────────────────
    if (transcriptLen > 300) {
      console.log(`[SCRAPER] ✅ Transcript rico (${transcriptLen} chars) — usando directo`);
      return {
        transcript: videoData.transcript!,
        description: videoData.description,
        duration: (videoData as any).duration || 0,
        platform,
        videoUrl: videoData.videoUrl,
        likes: (videoData as any).likes || 0,
        views: (videoData as any).views || 0,
        comments: (videoData as any).comments || 0,
        shares: (videoData as any).shares || 0,
        author: (videoData as any).author || '',
      };
    }

    // ─── Transcript corto + videoUrl: activar Whisper ─────
    if (hasRealVideoUrl) {
      console.log(`[SCRAPER] 🎤 Transcript corto — activando Whisper`);
      try {
        const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl!, openai);
        if (whisperResult.transcript && whisperResult.transcript.length > transcriptLen) {
          return {
            transcript: whisperResult.transcript,
            description: videoData.description,
            duration: whisperResult.duration,
            platform,
            videoUrl: videoData.videoUrl,
            likes: (videoData as any).likes || 0,
            views: (videoData as any).views || 0,
            comments: (videoData as any).comments || 0,
            shares: (videoData as any).shares || 0,
            author: (videoData as any).author || '',
          };
        }
      } catch (whisperErr: any) {
        console.warn('[SCRAPER] ⚠️ Whisper falló:', whisperErr.message);
      }
    }

    // ─── Fallback: usar lo que haya ──────────────────────
    const fallbackContent = videoData.transcript || videoData.description || '';
    return {
      transcript: fallbackContent.length > 20 ? fallbackContent : `Video de ${platform}: ${url}`,
      description: videoData.description,
      duration: (videoData as any).duration || 0,
      platform,
      videoUrl: videoData.videoUrl || url,
      likes: (videoData as any).likes || 0,
      views: (videoData as any).views || 0,
      comments: (videoData as any).comments || 0,
      shares: (videoData as any).shares || 0,
      author: (videoData as any).author || '',
    };

  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error:', error.message);
    if ((videoData as any).description?.length > 50) {
      return { transcript: videoData.description, description: videoData.description, duration: 0, platform };
    }
    throw error;
  }
}

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
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  author?: string;
}> {
  if (uploadedFile && fileName) {
    console.log('[VIDEO] 📁 Procesando video subido...');
    const result = await processUploadedVideo(uploadedFile, fileName, openai);
    return {
      transcript: result.transcript,
      description: `Video subido: ${fileName}`,
      duration: result.duration,
      platform: 'upload',
      source: 'upload'
    };
  }
  if (url && url.includes('http')) {
    console.log('[VIDEO] 🔗 Procesando URL...');
    const result = await scrapeAndTranscribeVideo(url, openai);
    return {
      transcript: result.transcript,
      description: result.description,
      duration: result.duration,
      platform: result.platform,
      source: 'url',
      likes: (result as any).likes || 0,
      views: (result as any).views || 0,
      comments: (result as any).comments || 0,
      shares: (result as any).shares || 0,
      author: (result as any).author || '',
    };
  }
  throw new Error('Debes proporcionar una URL o subir un video');
}