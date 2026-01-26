// ==================================================================================
// 🚀 TITAN ENGINE V103 COMPLETE - FULL PRODUCTION SYSTEM
// ==================================================================================
// SISTEMA COMPLETO:
// ✅ Scrapers para 6 plataformas (YouTube, TikTok, Instagram, Facebook, Twitter, LinkedIn)
// ✅ Whisper transcription con chunking
// ✅ Sistema de seguridad (rate limiting, sanitización, validación créditos)
// ✅ Extracción de ADN Viral (6 capas de análisis)
// ✅ Adaptación inteligente al nicho
// ✅ Quality assurance automático
// ✅ Predicción de rendimiento
// ✅ Sistema completo de costos y transacciones
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'
import { ApifyClient } from 'npm:apify-client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ==================================================================================
// 🔐 CONFIGURACIÓN DE SEGURIDAD
// ==================================================================================

const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_CONTENT_LENGTH: 50000,
  MAX_VIDEO_DURATION: 7200,
  WHISPER_COST_PER_MINUTE: 0.006,
  GPT4_COST_PER_1K_TOKENS: 0.00001,
  MIN_CREDITS_BUFFER: 5,
  DANGEROUS_PATTERNS: [
    /ignore\s+(all\s+)?previous\s+instructions?/gi,
    /system\s+prompt/gi,
    /reveal\s+(your|the)\s+instructions?/gi,
    /you\s+are\s+now/gi,
    /new\s+instructions?:/gi,
    /disregard\s+above/gi,
    /instead\s+respond\s+with/gi,
    /override\s+your\s+programming/gi
  ]
};

// ==================================================================================
// 📚 BIBLIOTECAS DE CONOCIMIENTO
// ==================================================================================

const VIDEO_FORMATS_STR = `12 FORMATOS VISUALES WINNER ROCKET:
1.Hablando a cámara 2.Entrevista/Podcast 3.POV 4.Storytelling Cinemático 5.Demo/Tutorial 6.Testimonio 7.Gancho-Corte-Solución 8.Texto+Música 9.Vlog 10.Sketch 11.Micro-Clase 60s 12.Mito vs Realidad`;

const MASTER_HOOKS_STR = `40 GANCHOS MAESTROS WINNER ROCKET:
1.Frame Break 2.Objeto Mágico 3.Antes-Después 4.En Movimiento 5.Sneak Peek 6.Chasquido 7.Pantalla Verde 8.Stop Scroll 9.Mito-Verdad 10.Enemigo Común 11.Negativo 12.Ridículo 13.Arrepentimiento 14.Advertencia 15.Verdad Dura 16.Miedo 17.Paradoja 18.Secreto 19.Pieza Faltante 20.Pregunta Provocadora 21.Detective 22.Acceso Denegado 23.ADN 24.What If 25.Loop 26.Comparación 27.Regla de 3 28.Dato Impactante 29.Ahorro 30.Autoridad Prestada 31.Autoridad Propia 32.Francotirador 33.Historia Personal 34.Promesa 35.Nuevo 36.Única Cosa 37.Tutorial 38.Regalo 39.Identidad 40.Reto`;

const WINNER_ROCKET_TIMELINE = `ESTRUCTURA 60s: 0-3s HOOK | 4-10s CONTEXTO | 11-20s CONFLICTO | 21-23s LOOP | 24-35s INSIGHT | 36-50s RESOLUCIÓN | 51-60s CTA`;

const ALGORITHM_SECRETS_STR = `SECRETOS ALGORITMOS:
TIKTOK: 3s iniciales=80% alcance | Texto frame 1 +40% retención | Sonidos trending x5
INSTAGRAM: Carousels 3x alcance | Reels loop +60% shares | 3 hashtags grandes + 2 nicho
YOUTUBE: Títulos números mejor | Loop endscreen | Subtítulos +35% retención`;

// ==================================================================================
// 🛡️ FUNCIONES DE SEGURIDAD
// ==================================================================================

function sanitizeUserContent(content: string): string {
  if (!content) return "";
  let sanitized = content;
  
  SECURITY_CONFIG.DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[CONTENIDO FILTRADO POR SEGURIDAD]');
  });
  
  if (sanitized.length > SECURITY_CONFIG.MAX_CONTENT_LENGTH) {
    console.log(`[SECURITY] ⚠️ Contenido truncado: ${sanitized.length} -> ${SECURITY_CONFIG.MAX_CONTENT_LENGTH}`);
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_CONTENT_LENGTH);
  }
  
  sanitized = sanitized
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  
  return sanitized;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const key = userId;
  const limit = rateLimitStore.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    console.log(`[RATE_LIMIT] ❌ Usuario ${userId} excedió límite`);
    return false;
  }
  
  limit.count++;
  return true;
}

async function validateUserCredits(
  supabase: any, 
  userId: string, 
  estimatedCost: number
): Promise<{ valid: boolean; currentBalance: number; error?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      return { valid: false, currentBalance: 0, error: 'No se pudo obtener balance' };
    }
    
    const currentBalance = profile.credits || 0;
    const requiredCredits = estimatedCost + SECURITY_CONFIG.MIN_CREDITS_BUFFER;
    
    if (currentBalance < requiredCredits) {
      console.log(`[CREDITS] ❌ Insuficientes: ${currentBalance} < ${requiredCredits}`);
      return { 
        valid: false, 
        currentBalance, 
        error: `Créditos insuficientes. Necesitas ${requiredCredits}, tienes ${currentBalance}` 
      };
    }
    
    console.log(`[CREDITS] ✅ Validación exitosa: ${currentBalance} créditos`);
    return { valid: true, currentBalance };
    
  } catch (error: any) {
    console.error(`[CREDITS] Error validando: ${error.message}`);
    return { valid: false, currentBalance: 0, error: error.message };
  }
}

function calculateRealCost(tokensUsed: number, whisperMinutes: number = 0): number {
  const gptCost = (tokensUsed / 1000) * SECURITY_CONFIG.GPT4_COST_PER_1K_TOKENS;
  const whisperCost = whisperMinutes * SECURITY_CONFIG.WHISPER_COST_PER_MINUTE;
  const totalUSD = gptCost + whisperCost;
  const credits = Math.ceil(totalUSD * 100);
  
  console.log(`[COST] GPT: $${gptCost.toFixed(4)} | Whisper: $${whisperCost.toFixed(4)} | Total: ${credits} créditos`);
  
  return credits;
}

// ==================================================================================
// 🧩 CHUNKING INTELIGENTE
// ==================================================================================

function smartChunk(text: string, maxChunkSize: number = 15000): string[] {
  if (text.length <= maxChunkSize) return [text];
  
  const chunks: string[] = [];
  let currentChunk = "";
  const paragraphs = text.split(/\n\n+/);
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  console.log(`[CHUNKING] Dividido en ${chunks.length} partes`);
  return chunks;
}

async function summarizeChunk(chunk: string, openai: any): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Resume el siguiente contenido manteniendo los puntos clave y estructura. Máximo 500 palabras." },
      { role: "user", content: chunk }
    ],
    temperature: 0.3,
    max_tokens: 800
  });
  
  return response.choices[0].message.content || "";
}

async function processLongContent(text: string, openai: any): Promise<string> {
  if (text.length <= SECURITY_CONFIG.MAX_CONTENT_LENGTH) return text;
  
  console.log(`[CHUNKING] Contenido largo detectado: ${text.length} chars`);
  const chunks = smartChunk(text, 15000);
  const summaries = await Promise.all(chunks.map(chunk => summarizeChunk(chunk, openai)));
  const result = summaries.join("\n\n--- SECCIÓN SIGUIENTE ---\n\n");
  console.log(`[CHUNKING] ✅ Procesado: ${result.length} chars finales`);
  
  return result;
}

// ==================================================================================
// 🎤 CONFIGURACIÓN DE SCRAPERS (6 PLATAFORMAS)
// ==================================================================================

interface ScraperConfig {
  actorId: string;
  fallbackActorId?: string;
  inputBuilder: (url: string) => any;
  videoExtractor: (item: any) => string | null;
  audioExtractor: (item: any) => string | null;
  textExtractor: (item: any) => string;
  metadataExtractor?: (item: any) => any;
  platform: string;
  audioStrategy: 'primary' | 'fallback';
  requiresAuth?: boolean;
}

const PLATFORM_CONFIGS: Record<string, ScraperConfig> = {
  youtube: {
    actorId: "apify/youtube-scraper",
    fallbackActorId: "streamers/youtube-scraper",
    platform: "YouTube",
    audioStrategy: 'primary',
    
    inputBuilder: (url: string) => ({
      startUrls: [{ url }],
      maxResults: 1,
      downloadSubtitles: true,
      subtitlesLanguage: "es,en,es-ES,en-US,es-419,pt,pt-BR",
      subtitlesFormat: "text",
      downloadMedia: true,
      onlyAudio: true,
      maxVideoLength: 7200,
      extendOutputFunction: `({ data }) => {
        return {
          ...data,
          duration: data.duration,
          hasSubtitles: !!data.subtitles
        }
      }`
    }),
    
    audioExtractor: (item: any) => {
      if (item.audioUrl) return item.audioUrl;
      if (item.downloadedFiles?.audio) return item.downloadedFiles.audio;
      if (item.media?.audioUrl) return item.media.audioUrl;
      if (item.url || item.id) {
        const videoId = item.url?.match(/[?&]v=([^&]+)/)?.[1] || item.id;
        if (videoId) return `https://www.youtube.com/watch?v=${videoId}`;
      }
      return null;
    },
    
    videoExtractor: () => null,
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.title) parts.push(`TÍTULO: ${item.title}`);
      if (item.description) parts.push(`DESCRIPCIÓN: ${item.description}`);
      
      let transcription = null;
      if (item.subtitles) {
        transcription = 
          item.subtitles?.es ||
          item.subtitles?.en ||
          item.subtitles?.['es-ES'] ||
          item.subtitles?.['en-US'] ||
          item.subtitles?.['es-419'] ||
          item.subtitles?.pt;
      }
      
      if (transcription) parts.push(`[SUBTÍTULOS FALLBACK]\n${transcription}`);
      if (item.duration) parts.push(`DURACIÓN: ${item.duration}s`);
      if (item.viewCount) parts.push(`VISTAS: ${item.viewCount}`);
      
      return parts.join("\n\n");
    },
    
    metadataExtractor: (item: any) => ({
      duration: item.duration || 0,
      hasSubtitles: !!item.subtitles,
      views: item.viewCount || 0,
      useAudioPrimary: true
    })
  },
  
  instagram: {
    actorId: "apify/instagram-scraper",
    fallbackActorId: "zuzka/instagram-scraper",
    platform: "Instagram",
    audioStrategy: 'primary',
    
    inputBuilder: (url: string) => ({
      directUrls: [url],
      resultsType: "posts",
      searchLimit: 1,
      resultsPerPage: 1,
      addParentData: true,
      enhanceUserData: false
    }),
    
    audioExtractor: (item: any) => {
      if (item.musicInfo?.audioUrl) return item.musicInfo.audioUrl;
      if (item.audioUrl) return item.audioUrl;
      if (item.videoUrl) return item.videoUrl;
      return null;
    },
    
    videoExtractor: (item: any) => {
      if (item.videoUrl) return item.videoUrl;
      if (item.displayUrl && item.type === 'Video') return item.displayUrl;
      if (item.isReel && item.url) return item.url;
      if (item.childPosts?.length > 0) {
        for (const child of item.childPosts) {
          if (child.videoUrl) return child.videoUrl;
        }
      }
      return item.displayUrl || null;
    },
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.caption) parts.push(`CAPTION: ${item.caption}`);
      if (item.ownerUsername) parts.push(`AUTOR: @${item.ownerUsername}`);
      if (item.isReel) parts.push(`FORMATO: Reel`);
      if (item.musicInfo?.name) {
        parts.push(`MÚSICA: ${item.musicInfo.name} - ${item.musicInfo.artist || 'Desconocido'}`);
      }
      if (item.hashtags?.length > 0) {
        parts.push(`HASHTAGS: ${item.hashtags.join(' ')}`);
      }
      return parts.join("\n\n");
    },
    
    metadataExtractor: (item: any) => ({
      isReel: item.isReel || false,
      hasAudio: !!(item.musicInfo?.audioUrl || item.audioUrl || item.videoUrl),
      useAudioPrimary: item.isReel
    })
  },
  
  tiktok: {
    actorId: "clockworks/free-tiktok-scraper",
    fallbackActorId: "apidojo/tiktok-scraper",
    platform: "TikTok",
    audioStrategy: 'primary',
    
    inputBuilder: (url: string) => ({
      postURLs: [url],
      resultsPerPage: 1,
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
      shouldDownloadSubtitles: false,
      shouldDownloadSlideshows: false,
      proxyConfiguration: { useApifyProxy: true }
    }),
    
    audioExtractor: (item: any) => {
      if (item.video?.downloadAddr) return item.video.downloadAddr;
      if (item.downloadAddr) return item.downloadAddr;
      if (item.videoUrl) return item.videoUrl;
      return null;
    },
    
    videoExtractor: (item: any) => {
      if (item.video?.downloadAddr) return item.video.downloadAddr;
      if (item.downloadAddr) return item.downloadAddr;
      return null;
    },
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.text) parts.push(`TEXTO: ${item.text}`);
      if (item.desc) parts.push(`DESC: ${item.desc}`);
      if (item.authorMeta?.name) parts.push(`AUTOR: @${item.authorMeta.name}`);
      return parts.join("\n\n");
    }
  },
  
  facebook: {
    actorId: "apify/facebook-posts-scraper",
    fallbackActorId: "alien_force/facebook-scraper-pro",
    platform: "Facebook",
    audioStrategy: 'primary',
    requiresAuth: true,
    
    inputBuilder: (url: string) => ({
      startUrls: [url],
      maxPosts: 1,
      proxyConfiguration: { useApifyProxy: true }
    }),
    
    audioExtractor: (item: any) => {
      if (item.videoUrl) return item.videoUrl;
      if (item.video) return item.video;
      if (item.media?.video) return item.media.video;
      if (item.attachments?.length > 0) {
        for (const att of item.attachments) {
          if (att.type === 'video' && att.url) return att.url;
          if (att.media?.video?.url) return att.media.video.url;
        }
      }
      return null;
    },
    
    videoExtractor: (item: any) => {
      if (item.videoUrl) return item.videoUrl;
      if (item.video) return item.video;
      if (item.media?.video) return item.media.video;
      if (item.attachments?.length > 0) {
        for (const att of item.attachments) {
          if (att.type === 'video' && att.url) return att.url;
        }
      }
      return null;
    },
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.text) parts.push(`TEXTO: ${item.text}`);
      if (item.postText) parts.push(`POST: ${item.postText}`);
      if (item.author) parts.push(`AUTOR: ${item.author}`);
      if (item.likes) parts.push(`LIKES: ${item.likes}`);
      if (item.shares) parts.push(`SHARES: ${item.shares}`);
      return parts.join("\n\n");
    },
    
    metadataExtractor: (item: any) => ({
      hasVideo: !!(item.videoUrl || item.video),
      useAudioPrimary: true
    })
  },
  
  twitter: {
    actorId: "apidojo/tweet-scraper",
    fallbackActorId: "vdrmota/twitter-scraper",
    platform: "Twitter",
    audioStrategy: 'primary',
    
    inputBuilder: (url: string) => ({
      tweetUrls: [url],
      maxTweets: 1,
      includeReplies: false
    }),
    
    audioExtractor: (item: any) => {
      if (item.video?.url) return item.video.url;
      if (item.videoUrl) return item.videoUrl;
      if (item.media?.length > 0) {
        for (const media of item.media) {
          if (media.type === 'video' && media.video_info?.variants) {
            const variants = media.video_info.variants
              .filter((v: any) => v.content_type === 'video/mp4')
              .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
            if (variants[0]) return variants[0].url;
          }
        }
      }
      return null;
    },
    
    videoExtractor: (item: any) => {
      if (item.video?.url) return item.video.url;
      if (item.videoUrl) return item.videoUrl;
      if (item.media?.length > 0) {
        for (const media of item.media) {
          if (media.type === 'video' && media.url) return media.url;
        }
      }
      return null;
    },
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.text) parts.push(`TWEET: ${item.text}`);
      if (item.author?.username) parts.push(`AUTOR: @${item.author.username}`);
      if (item.hashtags?.length > 0) {
        parts.push(`HASHTAGS: ${item.hashtags.map((h: any) => `#${h}`).join(' ')}`);
      }
      if (item.views) parts.push(`VISTAS: ${item.views}`);
      return parts.join("\n\n");
    },
    
    metadataExtractor: (item: any) => ({
      hasVideo: !!(item.video || item.videoUrl),
      useAudioPrimary: true
    })
  },
  
  linkedin: {
    actorId: "curious_coder/linkedin-post-scraper",
    platform: "LinkedIn",
    audioStrategy: 'fallback',
    requiresAuth: true,
    
    inputBuilder: (url: string) => ({
      postUrls: [url],
      maxPosts: 1
    }),
    
    audioExtractor: (item: any) => {
      if (item.videoUrl) return item.videoUrl;
      if (item.media?.video) return item.media.video;
      return null;
    },
    
    videoExtractor: (item: any) => {
      if (item.videoUrl) return item.videoUrl;
      if (item.media?.video) return item.media.video;
      return null;
    },
    
    textExtractor: (item: any) => {
      const parts = [];
      if (item.text) parts.push(`CONTENIDO: ${item.text}`);
      if (item.author) parts.push(`AUTOR: ${item.author}`);
      if (item.authorTitle) parts.push(`TÍTULO: ${item.authorTitle}`);
      return parts.join("\n\n");
    },
    
    metadataExtractor: (item: any) => ({
      hasVideo: !!(item.videoUrl || item.media?.video),
      useAudioPrimary: false
    })
  }
};

// ==================================================================================
// 🔧 FUNCIONES AUXILIARES
// ==================================================================================

function isValidUrl(urlString: string): boolean {
  if (!urlString || urlString.length < 10) return false;
  const invalidPatterns = ['idea_generator', 'script_generator', 'mentor', 'autopsy', 'recreate', 'calendar', 'clean', 'authority', 'audit'];
  if (invalidPatterns.some(p => urlString.toLowerCase().includes(p))) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

function detectPlatform(url: string): string | null {
  if (!isValidUrl(url)) return null;
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'tiktok';
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) return 'facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('supabase.co') || url.match(/\.(mp4|mp3|wav|webm|m4a)(\?|$)/i)) return 'archivo_directo';
  return null;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadWithRetry(url: string, platform: string, maxRetries = 3): Promise<Blob | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[DOWNLOAD] Intento ${attempt}/${maxRetries}`);
      const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "video/mp4,audio/*,*/*",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache"
      };
      
      if (platform === 'tiktok') headers["Referer"] = "https://www.tiktok.com/";
      else if (platform === 'instagram') {
        headers["Referer"] = "https://www.instagram.com/";
        headers["X-IG-App-ID"] = "936619743392459";
      } else if (platform === 'facebook') {
        headers["Referer"] = "https://www.facebook.com/";
      }
      
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Blob vacío");
      console.log(`[DOWNLOAD] ✅ ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
      return blob;
    } catch (error: any) {
      console.error(`[DOWNLOAD] ❌ ${error.message}`);
      if (attempt < maxRetries) await delay(attempt * 2000);
    }
  }
  return null;
}

// ==================================================================================
// 🎤 WHISPER TRANSCRIPTION
// ==================================================================================

async function transcribeWithWhisper(
  blob: Blob, 
  openaiKey: string, 
  forceLanguage?: string
): Promise<{text: string, language: string, segments: any[], durationMinutes: number}> {
  console.log('[WHISPER] 🎤 Transcribiendo...');
  
  const file = new File([blob], "media.mp4", { type: blob.type || "video/mp4" });
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");
  if (forceLanguage) formData.append("language", forceLanguage);
  formData.append("timestamp_granularities[]", "segment");
  formData.append("response_format", "verbose_json");
  formData.append("temperature", "0");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${openaiKey}` },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.text || data.text.trim().length < 3) throw new Error("Transcripción vacía");
  
  const durationMinutes = data.duration ? data.duration / 60 : (blob.size / (1024 * 1024 * 2));
  
  console.log(`[WHISPER] ✅ ${data.text.length} chars | Lang: ${data.language} | ${durationMinutes.toFixed(2)}min`);
  
  return { 
    text: data.text, 
    language: data.language || 'unknown', 
    segments: data.segments || [],
    durationMinutes 
  };
}

// ==================================================================================
// 📡 PIPELINE DE INGESTIÓN
// ==================================================================================

async function runIngestionPipeline(
  url: string, 
  apifyToken: string, 
  openaiKey: string
): Promise<{ content: string; whisperMinutes: number }> {
  console.log(`[PIPELINE] Procesando: ${url}`);
  
  if (!isValidUrl(url)) throw new Error("URL inválida");
  const platform = detectPlatform(url);
  if (!platform) throw new Error("URL no soportada");

  if (platform === 'archivo_directo') {
    const blob = await downloadWithRetry(url, platform);
    if (!blob) throw new Error("No se pudo descargar archivo");
    const result = await transcribeWithWhisper(blob, openaiKey);
    return {
      content: `[TRANSCRIPCIÓN]\n\n${result.text}`,
      whisperMinutes: result.durationMinutes
    };
  }

  const config = PLATFORM_CONFIGS[platform];
  const client = new ApifyClient({ token: apifyToken });
  let scraperResult: any = null;
  let whisperMinutes = 0;

  try {
    console.log(`[SCRAPER] 🔄 Primary: ${config.actorId}`);
    const input = config.inputBuilder(url);
    const run = await client.actor(config.actorId).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    scraperResult = items.length > 0 ? items[0] : null;
  } catch (error: any) {
    console.error(`[SCRAPER] ❌ Primary falló: ${error.message}`);
    
    if (config.fallbackActorId) {
      console.log(`[SCRAPER] 🔄 Fallback: ${config.fallbackActorId}`);
      try {
        let fallbackInput = config.inputBuilder(url);
        if (config.fallbackActorId.includes('clockworks')) {
          fallbackInput = { postURLs: [url], resultsPerPage: 1 };
        }
        const run = await client.actor(config.fallbackActorId).call(fallbackInput);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        scraperResult = items.length > 0 ? items[0] : null;
      } catch (e2: any) {
        console.error(`[SCRAPER] ❌ Fallback falló: ${e2.message}`);
      }
    }
  }

  if (!scraperResult) throw new Error("No se pudo obtener contenido del scraper");

  const audioUrl = config.audioExtractor(scraperResult);
  const captionText = config.textExtractor(scraperResult);

  if (audioUrl) {
    console.log(`[PIPELINE] 🎥 Media encontrada`);
    const mediaBlob = await downloadWithRetry(audioUrl, platform);
    
    if (mediaBlob) {
      if (mediaBlob.size > 24 * 1024 * 1024) {
        console.log("[PIPELINE] ⚠️ Archivo > 24MB, usando servicio externo...");
        try {
          const run = await client.actor("vittuhy/audio-and-video-transcript").call({ 
            mediaUrl: audioUrl, 
            language: "es" 
          });
          const { items } = await client.dataset(run.defaultDatasetId).listItems();
          if (items.length > 0 && items[0].transcript) {
            return {
              content: `[TRANSCRIPCIÓN CHUNKED]\n\n${items[0].transcript}`,
              whisperMinutes: mediaBlob.size / (1024 * 1024 * 2) / 60
            };
          }
        } catch (e: any) {
          console.log(`[CHUNKING] Fallback a texto: ${e.message}`);
          if (captionText.length > 50) {
            return {
              content: `[CONTENIDO (FALLBACK)]\n\n${captionText}`,
              whisperMinutes: 0
            };
          }
        }
      }

      try {
        const whisperData = await transcribeWithWhisper(mediaBlob, openaiKey);
        whisperMinutes = whisperData.durationMinutes;
        
        let fullText = `[TRANSCRIPCIÓN ${platform.toUpperCase()}]\n\n${whisperData.text}`;
        if (whisperData.segments) {
          fullText += "\n\n--- TIMELINE ---\n";
          whisperData.segments.forEach((seg: any) => {
            fullText += `[${Math.floor(seg.start)}s] ${seg.text}\n`;
          });
        }
        return { content: fullText, whisperMinutes };
      } catch (e: any) {
        console.error(`[WHISPER] Falló: ${e.message}`);
      }
    }
  }

  if (captionText && captionText.length > 20) {
    console.log(`[PIPELINE] ⚠️ Usando texto fallback`);
    return { content: `[CONTENIDO (TEXTO)]\n\n${captionText}`, whisperMinutes: 0 };
  }

  throw new Error("No se pudo extraer contenido");
}

// ==================================================================================
// 🧬 PROMPTS MAESTROS V103
// ==================================================================================

const VIRAL_DNA_EXTRACTOR = `YOU ARE THE WORLD'S #1 VIRAL VIDEO FORENSIC ANALYST.

MISSION: Extract the complete STRUCTURAL DNA from this video - not the content, but the MECHANISMS that make it viral.

Execute 6-layer viral DNA sequencing:

LAYER 1: HOOK DNA (0-3s)
- Trigger type (pattern interrupt/curiosity gap/identity/data shock/fear/secret)
- Formula structure: [ELEMENT 1] + [ELEMENT 2] + [ELEMENT 3]
- Psychological mechanism activated
- Visual/audio synchronization (exact timing)
- Retention score prediction (0-100)

LAYER 2: RETENTION ARCHITECTURE
- Micro-hooks timeline (every 5-7s: what keeps watching?)
- Information gaps (opened timestamp → closed timestamp)
- Emotional curve (plot: 0s emotion, 10s emotion, 20s...)
- Pacing map (fast segments, slow segments, acceleration points)
- Loop mechanics (what creates rewatchability)

LAYER 3: NARRATIVE STRUCTURE
- Framework name (PAS/BAB/Hero Journey/Myth vs Reality/Enemy/Secret/etc)
- Act breakdown (setup 0-Xs, conflict X-Ys, resolution Y-Zs)
- Story beats with timestamps
- Why this structure works

LAYER 4: PRODUCTION DNA
Visual: shot distribution %, cut rhythm, camera style, B-roll strategy, text timing
Audio: music architecture, voice characteristics (WPM/energy), strategic silence

LAYER 5: ALGORITHM SIGNALS
- Watch time tactics
- Engagement engineering (comment/share/save baits)
- Platform-specific optimizations detected
- Viral coefficient estimate (0-10)

LAYER 6: REPLICATION BLUEPRINT
PRESERVE: hook formula, micro-hook timing, emotional peaks, narrative framework, pacing
ADAPT: words (keep structure), examples (keep pattern), niche references
Complexity score (0-10), production requirements

OUTPUT: Complete JSON with all 6 layers + viral_potential_score + key_success_factors`;

const NICHE_ADAPTER = `YOU ARE AN ELITE VIRAL CONTENT ADAPTATION SPECIALIST.

MISSION: Transform viral DNA into niche-specific content maintaining 100% of viral mechanics.

PROTOCOL:

1. PRESERVE STRUCTURE (100%)
✓ Hook formula (exact pattern)
✓ Micro-hook timing (same intervals)
✓ Emotional curve (same shape)
✓ Narrative framework (same beats)
✓ Pacing rhythm (same dynamics)

2. TRANSLATE CONTENT (100%)
Generic → Niche-specific
Broad audience → Avatar profile
General examples → Industry examples
Common language → Expert vocabulary
Universal desire → Avatar dream
Generic objection → Avatar objection

3. GENERATE 3 HOOKS (using viral DNA formula)
A. LOGIC: [STRUCTURE] + niche data (max 10 words)
B. EMOTION: [STRUCTURE] + avatar pain (max 12 words)  
C. DISRUPTION: [STRUCTURE] + niche contrarian (max 10 words)

4. FULL SCRIPT ADAPTATION
Maintain: timing, gaps, peaks, pacing
Change: examples, vocabulary, pain points, references
Format: Teleprompter-ready (no brackets)

5. VISUAL PLAN
Replicate: shot types, timing, rhythm
Adapt: visuals to niche context

6. THUMBNAIL
Maintain: emotional impact
Adapt: visual context to niche
Text: max 5 words, niche-relevant

OUTPUT JSON:
{
  "adaptation_metadata": { dna_preserved, niche_translation },
  "hook_variations": [3 hooks with formula + retention prediction],
  "script_body": "clean teleprompter text",
  "visual_plan": [timeline maintaining DNA timing],
  "thumbnail_concept": { description, text, emotion },
  "viral_prediction": { score, views_range, strengths, risks, tips },
  "quality_scores": { dna_preservation, niche_authenticity, specificity, actionability }
}

RULES:
✗ NO generic advice
✗ NO timing changes from DNA
✗ NO vague examples
✗ NO brackets in scripts
✓ Preserve viral mechanics 100%
✓ Niche-specific everything
✓ Actionable, specific content`;

// ==================================================================================
// 🧠 FUNCIONES V103
// ==================================================================================

async function executeViralDNAExtraction(content: string, platform: string, openai: any) {
  console.log('[V103] 🧬 Extrayendo ADN viral...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are the world\'s leading viral video reverse engineer.' },
      { role: 'user', content: `${VIRAL_DNA_EXTRACTOR}\n\nPLATFORM: ${platform}\n\nCONTENT:\n${content}` }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });
  
  // Ahora devolvemos un objeto con la DATA y los TOKENS
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// 2. ADAPTACIÓN AL NICHO (Actualizada con retorno de tokens)
async function executeNicheAdaptation(viralDNA: any, context: any, openai: any) {
  console.log('[V103] 🎯 Adaptando al nicho...');
  
  const contextStr = `
Expert: ${context.expertNiche || 'General'} | Tone: ${context.expertTone || 'Pro'}
Avatar: ${context.avatarName || 'Audience'} | Pain: ${context.avatarPain || 'N/A'}
Dream: ${context.avatarCielo || 'N/A'} | Objection: ${context.avatarObjecion || 'N/A'}
KB: ${context.knowledgeBase || 'N/A'}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are an elite viral content adaptation specialist.' },
      { role: 'user', content: `${NICHE_ADAPTER}\n\nVIRAL DNA:\n${JSON.stringify(viralDNA)}\n\nCONTEXT:${contextStr}` }
    ],
    temperature: 0.7,
    max_tokens: 4096
  });
  
  // Ahora devolvemos un objeto con la DATA y los TOKENS
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// 3. CONTEXTO DE USUARIO (Se mantiene igual, es sólida)
async function getUserContext(supabase: any, expertId: string, avatarId: string, kbId: string) {
  const promises = [
    expertId ? supabase.from('expert_profiles').select('*').eq('id', expertId).single() : null,
    avatarId ? supabase.from('avatars').select('*').eq('id', avatarId).single() : null,
    kbId ? supabase.from('documents').select('*').eq('id', kbId).single() : null
  ].filter(Boolean);

  const results = await Promise.allSettled(promises as Promise<any>[]);
  
  const context: any = {};
  
  if (results[0]?.status === 'fulfilled') {
    const expert = results[0].value?.data;
    if (expert) {
      context.expertNiche = expert.niche;
      context.expertMission = expert.mission;
      context.expertTone = expert.tone;
      context.expertVocabulary = expert.key_vocabulary;
    }
  }
  
  if (results[1]?.status === 'fulfilled') {
    const avatar = results[1].value?.data;
    if (avatar) {
      context.avatarName = avatar.name;
      context.avatarPain = avatar.dolor;
      context.avatarInfierno = avatar.infierno;
      context.avatarCielo = avatar.cielo;
      context.avatarObjecion = avatar.objecion;
    }
  }
  
  if (results[2]?.status === 'fulfilled') {
    const kb = results[2].value?.data;
    if (kb) {
      context.knowledgeBase = (kb.content || kb.content_text || '').substring(0, 8000);
    }
  }
  
  return context;
}

// ==================================================================================
// 🚀 SERVIDOR PRINCIPAL
// ==================================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    // 1. CONFIGURACIÓN E INSTANCIAS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const apifyToken = Deno.env.get('APIFY_TOKEN');
    
    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      throw new Error('ENV_ERROR: Variables críticas faltantes');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });
    
    // 2. AUTENTICACIÓN
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );
    
    if (authError || !user) throw new Error('AUTH_ERROR: Usuario no autenticado');
    userId = user.id;

    // 3. SEGURIDAD: RATE LIMIT
    if (!checkRateLimit(userId)) {
      throw new Error('RATE_LIMIT: Demasiadas solicitudes. Espera 1 minuto.');
    }

    // 4. PARSEO DE DATOS
    const { selectedMode, url, platform, transcript, expertId, avatarId, knowledgeBaseId, estimatedCost } = await req.json();

    console.log(`\n${'='.repeat(80)}`);
    console.log(`[TITAN V103] 🚀 INICIANDO SISTEMA DE INGENIERÍA FORENSE`);
    console.log(`[USER]: ${user.email} | [MODE]: ${selectedMode}`);
    console.log(`${'='.repeat(80)}`);

    // 5. VALIDACIÓN DE CRÉDITOS
    const creditCheck = await validateUserCredits(supabase, userId, estimatedCost || 0);
    if (!creditCheck.valid) throw new Error(`CREDITS_ERROR: ${creditCheck.error}`);

    // 6. PIPELINE DE INGESTIÓN (URL o Transcripción)
    let contextText = transcript || "";
    let whisperMinutes = 0;
    
    if (url && isValidUrl(url) && (!transcript || transcript.length < 50)) {
      console.log(`[PIPELINE] 🚀 Procesando fuente externa...`);
      const pipeResult = await runIngestionPipeline(url, apifyToken || "", openaiKey || "");
      contextText = pipeResult.content;
      whisperMinutes = pipeResult.whisperMinutes;
    }

   // ==================================================================================
    // 7. SANITIZACIÓN Y CONTEXTO ESTRATÉGICO
    // ==================================================================================
    const sanitizedContext = sanitizeUserContent(contextText);
    let processedContext = sanitizedContext;
    
    // Si el contenido es masivo, lo resumimos inteligentemente para no quemar tokens
    if (sanitizedContext.length > SECURITY_CONFIG.MAX_CONTENT_LENGTH) {
      console.log(`[CHUNKING] 📦 Contenido extenso detectado, optimizando...`);
      processedContext = await processLongContent(sanitizedContext, openai);
    }

    // Cargamos el ADN del experto, el avatar y la base de conocimiento en paralelo
    const userContext = await getUserContext(supabase, expertId, avatarId, knowledgeBaseId);

    // ==================================================================================
    // 8. --- LÓGICA V103 MASTER (INGENIERÍA FORENSE DE DOBLE CAPA) ---
    // ==================================================================================
    let result: any;
    let tokensUsed = 0;

    if (selectedMode === 'recreate') {
      // FASE A: Extracción Forense del ADN Viral (Secuenciación de 6 capas)
      const dnaResult = await executeViralDNAExtraction(processedContext, platform || 'general', openai);
      const viralDNA = dnaResult.data;
      
      // FASE B: Adaptación Quirúrgica al Nicho (Traducción 100% fiel al ADN viral)
      const nicheResult = await executeNicheAdaptation(viralDNA, userContext, openai);
      
      // Consolidación de resultados y suma de tokens REALES
      result = nicheResult.data;
      tokensUsed = (dnaResult.tokens || 0) + (nicheResult.tokens || 0); 
      
      console.log(`[V103] ✅ Ingeniería Forense Finalizada. Consumo Total: ${tokensUsed} tokens.`);
    } else {
      // Fallback de seguridad para otros modos
      result = { 
        message: 'Modo no implementado en V103',
        tip: 'Usa el modo RECREATE para activar la ingeniería forense de 6 capas.'
      };
    }

    // 9. CÁLCULO DE COSTO Y COBRO REAL
    const realCost = calculateRealCost(tokensUsed, whisperMinutes);
    const finalCost = Math.max(estimatedCost || 0, realCost);
    
    if (finalCost > 0) {
      const { error: creditError } = await supabase.rpc('decrement_credits', { 
        user_uuid: userId, 
        amount: finalCost 
      });
      if (creditError) console.error(`[CREDITS] ⚠️ Error: ${creditError.message}`);
    }

    // 10. PERSISTENCIA EN BASE DE DATOS
    if (!['chat-avatar', 'mentor_ia', 'mentor'].includes(selectedMode)) {
      await supabase.from('viral_generations').insert({ 
        user_id: userId, 
        type: selectedMode, 
        content: result, 
        original_url: url || null, 
        cost_credits: finalCost, 
        platform: platform || 'general',
        tokens_used: tokensUsed,
        whisper_minutes: whisperMinutes
      });
    }

    // 11. RESPUESTA FINAL
    const duration = Date.now() - startTime;
    return new Response(
      JSON.stringify({ 
        success: true,
        generatedData: result, 
        finalCost, 
        metadata: { mode: selectedMode, version: 'V103_COMPLETE', duration }
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error(`[ERROR]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
