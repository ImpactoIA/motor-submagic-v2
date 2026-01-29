// ==================================================================================
// 🚀 TITAN ENGINE V103 ULTIMATE - CORRECCIÓN COMPLETA
// ==================================================================================
// ✅ Sintaxis corregida (sin EOF errors)
// ✅ Routing unificado para TODOS los modos
// ✅ Costos alineados con frontend
// ✅ Scrapers + Whisper + Cerebro completamente conectados
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
// 🧠 NÚCLEO DE INTELIGENCIA
// ==================================================================================

interface SystemMemory {
  videos_analizados: any[];
  estructuras_exitosas: string[];
  hooks_alto_rendimiento: string[];
  estrategias_validadas: string[];
  patrones_virales: string[];
}

interface ContextoUsuario {
  nicho: string;
  avatar_ideal: string;
  dolor_principal: string;
  deseo_principal: string;
  competencia_analizada: any[];
  hooks_exitosos: string[];
  patrones_virales: string[];
  posicionamiento?: string;
  enemigo_comun?: string;
  diferenciadores?: string[];
  knowledge_base_content?: string;
}

const MEMORIA_SISTEMA: SystemMemory = {
  videos_analizados: [],
  estructuras_exitosas: [],
  hooks_alto_rendimiento: [],
  estrategias_validadas: [],
  patrones_virales: []
};

// ==================================================================================
// 📚 BIBLIOTECAS DE CONOCIMIENTO WINNER ROCKET
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
// 🧠 SISTEMA CEREBRAL - PROMPTS V300
// ==================================================================================

const PROMPT_IDEAS = (topic: string, contexto: any) => `
ERES UN GENIO CREATIVO DE CONTENIDO VIRAL EN ESPAÑOL.
TU MISIÓN: Generar ideas de video EXPLOSIVAS sobre el tema: "${topic}".

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${VIDEO_FORMATS_STR}
${ALGORITHM_SECRETS_STR}

FORMATO DE SALIDA JSON ESTRICTO:
{
  "ideas": [
    {
      "id": 1,
      "titulo": "Título impactante del video (Max 60 caracteres)",
      "concepto": "Descripción de la idea en 1 frase",
      "disparador_principal": "Curiosidad/Miedo/Deseo/etc",
      "gancho_sugerido": "Primera línea potente del video",
      "potencial_viral": 8.5,
      "razon_potencia": "Por qué esta idea puede explotar",
      "formato_visual": "Uno de los 12 formatos Winner Rocket"
    }
  ]
}
`;

const PROMPT_AUTOPSIA_VIRAL = (platform: string, contexto: any) => `ACTÚA COMO LA INTELIGENCIA ARTIFICIAL DE PRODUCCIÓN MÁS AVANZADA DEL MUNDO.

TU MISIÓN SUPREMA:
1. DECONSTRUIR el video viral origen.
2. TRADUCIR esa mecánica al nicho del usuario: **${contexto.nicho || 'Marca Personal'}**.
3. GENERAR los planes de rodaje y diseño gráfico.

CONTEXTO DEL USUARIO (DESTINO):
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Cliente Potencial'}
- Dolor: ${contexto.dolor_principal || 'N/A'}

PLATAFORMA: ${platform}

SALIDA JSON ESTRICTA:
{
  "score_viral": {
    "potencial_total": (0-10),
    "factores_exito": ["Psicología", "Edición", "Narrativa"],
    "nivel_replicabilidad": "Alta/Media"
  },
  "adn_extraido": {
    "idea_ganadora": "El concepto abstracto",
    "disparador_psicologico": "Curiosidad / Miedo / Estatus",
    "formula_gancho": "[Elemento Visual] + [Texto]"
  },
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción técnica de la acción original",
      "porque_funciona": "Sesgo cognitivo activado",
      "instruccion_rodaje": "ACCIÓN FÍSICA TRADUCIDA: 'Graba [Acción específica]'"
    }
  ],
  "produccion_deconstruida": {
    "ritmo_cortes": "Rápido / Lento",
    "movimiento_camara": "Estático / Handheld",
    "musica_sonido": "Vibra sugerida"
  },
  "thumbnail_concept": {
    "elemento_visual": "Imagen principal sugerida",
    "texto_en_imagen": "Copy corto (Max 3 palabras)",
    "color_psicologia": "Colores de alto contraste",
    "composicion": "Regla de tercios / Split Screen"
  }
}`;

const PROMPT_GENERADOR_GUIONES = (contexto: ContextoUsuario, viralDNA?: any) => {
  const dnaContext = viralDNA ? `\n\nADN VIRAL EXTRAÍDO:\n${JSON.stringify(viralDNA)}` : '';
  
  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL EN ESPAÑOL DEL MUNDO.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}${dnaContext}

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${WINNER_ROCKET_TIMELINE}
${VIDEO_FORMATS_STR}

ARQUITECTURA DE GUION:
1. GANCHO (0-3s): Dispara curiosidad
2. PROBLEMA (4-15s): Amplifica el dolor
3. AGITACIÓN (16-30s): Profundiza consecuencias
4. SOLUCIÓN (31-50s): Presenta el camino
5. PRUEBA (51-70s): Validación social
6. CTA (71-90s): Llamado a la acción

FORMATO DE SALIDA JSON ESTRICTO:
{
  "metadata_guion": {
    "nicho": "${contexto.nicho || 'General'}",
    "duracion_estimada": "60-90 segundos",
    "dificultad_produccion": "Baja/Media/Alta"
  },
  "ganchos_opcionales": [
    {
      "tipo": "Curiosidad",
      "texto": "Primera línea del video",
      "retencion_predicha": 92,
      "patron_usado": "De los 40 ganchos Winner Rocket"
    }
  ],
  "guion_completo": "AQUÍ VA EL GUION PALABRA POR PALABRA",
  "plan_visual": [
    {
      "tiempo": "0-3s",
      "accion_en_pantalla": "Descripción de lo que se ve",
      "instruccion_produccion": "Plano detalle / Movimiento",
      "audio": "Música / Silencio / Efecto"
    }
  ]
}`;
};

const PROMPT_JUEZ_VIRAL = (contexto: ContextoUsuario, contenido: string) => `ACTÚA COMO EL 'CHIEF ATTENTION OFFICER' DE LA MAYOR CONSULTORA DE VIRALIDAD DEL MUNDO.

CONTEXTO DEL OBJETIVO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'N/A'}

CONTENIDO A AUDITAR:
"${contenido}"

FORMATO DE SALIDA JSON ESTRICTO:
{
  "veredicto_final": {
    "score_total": (0-100),
    "clasificacion": "VIRAL ELITE / POTENCIAL BUENO / INVISIBLE",
    "probabilidad_viral": "Alta/Media/Baja",
    "confianza_prediccion": "96%"
  },
  "evaluacion_criterios": [
    { 
      "criterio": "Impacto Neuro-Visual (Hook)", 
      "score": (0-10), 
      "analisis": "Análisis técnico",
      "sugerencia": "Acción específica"
    }
  ],
  "fortalezas_clave": ["Elemento de autoridad bien usado"],
  "debilidades_criticas": [
    {
      "problema": "Inicio lento",
      "impacto": "Pérdida del 60% de tráfico",
      "solucion": "Empezar in-media-res"
    }
  ],
  "optimizaciones_rapidas": ["PNL: Cambia X por Y"],
  "decision_recomendada": "PUBLICAR / REESCRIBIR / DESCARTAR",
  "rewritten_version": "VERSIÓN OPTIMIZADA DEL GUION"
}`;

const PROMPT_AUDIT_AVATAR = (avatarJson: string) => `
ACTÚA COMO: Psicólogo de Consumo experto.

DATOS DEL AVATAR A AUDITAR:
${avatarJson}

SALIDA JSON ESTRICTA:
{
  "audit_result": {
    "score": (0-100),
    "feedback": "Resumen directo",
    "blind_spots": ["Punto Ciego 1", "Punto Ciego 2"],
    "suggestions": ["Acción 1", "Acción 2"]
  }
}
`;

const PROMPT_AUDIT_EXPERT = (expertProfile: any, avatarContext: string) => `
ERES UN ANALISTA COMPETITIVO Y ESTRATEGA DE POSICIONAMIENTO.

DATOS DEL EXPERTO:
- Nicho: ${expertProfile.niche || 'General'}
- Misión: ${expertProfile.mission || 'N/A'}

CONTEXTO DEL AVATAR:
${avatarContext || 'Mercado General'}

SALIDA JSON ESTRICTA:
{
  "audit_result": {
    "score": (0-100),
    "feedback": "Resumen ejecutivo y posicionamiento",
    "blind_spots": ["Brecha de Mercado", "Error Común"],
    "suggestions": ["Estrategia de Contenido", "Acción Inmediata"]
  }
}
`;

const PROMPT_MENTOR_STRATEGIST = (userQuery: string, contexto: any) => `
ACTÚA COMO: Asesor de Negocios Gran Maestro.

TU CEREBRO (Knowledge Base): ${contexto.knowledge_base_content ? 
   `[PRIORIDAD MÁXIMA] "${contexto.knowledge_base_content.substring(0, 3000)}..."` : 
   "Usa principios universales de marketing."}

LA CONSULTA:
"${userQuery}"

SALIDA JSON ESTRICTA:
{
  "answer": "Tu respuesta estratégica (Markdown)",
  "action_steps": ["Paso 1", "Paso 2", "Paso 3"],
  "key_insight": "Frase brutal y memorable"
}
`;

const PROMPT_CALENDAR_GENERATOR = (settings: any, contexto: any) => `
ACTÚA COMO: Director de Estrategia de Contenidos (CMO).
TU MISIÓN: Crear un plan de ${settings.duration} días.

CONTEXTO:
- Experto: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia General'}
- Conocimiento Base: ${contexto.knowledge_base_content ? 
   `"${contexto.knowledge_base_content.substring(0, 1500)}..."` : 
   "Temas estándar del nicho"}

PARÁMETROS:
- OBJETIVO: ${settings.focus}
- FORMATO: ${settings.format}

SALIDA JSON ESTRICTA:
{
  "calendar": [
    {
      "day": 1,
      "title": "Título gancho potente",
      "objective": "Viralidad/Autoridad/Venta",
      "format": "${settings.format}",
      "angle": "Enfoque psicológico",
      "description": "Breve descripción"
    }
  ]
}
`;

// ==================================================================================
// 🧠 FUNCIONES EJECUTORAS DE MÓDULOS
// ==================================================================================

async function ejecutarIdeasRapidas(
  userInput: string,
  contexto: any,
  qty: number,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log(`[CEREBRO] 💡 Ejecutando Ideas Rápidas (${qty})...`);
  
  const promptDinamico = `
    TEMA: "${userInput}".
    CONTEXTO: ${contexto.nicho}.
    TU MISIÓN: Generar EXACTAMENTE ${qty} ideas de video virales.
    FORMATO JSON: { "ideas": [{ "titulo": "...", "concepto": "...", "gancho_sugerido": "...", "potencial_viral": 9.5 }] }
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un genio creativo de contenido viral.' },
      { role: 'user', content: promptDinamico }
    ],
    temperature: 0.8,
    max_tokens: qty === 10 ? 2500 : 1500
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{"ideas":[]}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAutopsiaViral(
  content: string,
  platform: string,
  contexto: any,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🔬 Ejecutando Autopsia Viral...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el forense de viralidad #1 del mundo.' },
      { role: 'user', content: `${PROMPT_AUTOPSIA_VIRAL(platform, contexto)}\n\nCONTENIDO A ANALIZAR:\n${content}` }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });
  
  const data = JSON.parse(completion.choices[0].message.content || '{}');
  
  if (data.patron_replicable) MEMORIA_SISTEMA.patrones_virales.push(data.patron_replicable.nombre_patron);
  if (data.adn_extraido?.formula_gancho) MEMORIA_SISTEMA.hooks_alto_rendimiento.push(data.adn_extraido.formula_gancho);
  
  return {
    data,
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarGeneradorGuiones(
  contexto: any,
  viralDNA: any | null,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📝 Ejecutando Generador de Guiones...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el mejor guionista de contenido viral en español.' },
      { role: 'user', content: PROMPT_GENERADOR_GUIONES(contexto, viralDNA) }
    ],
    temperature: 0.7,
    max_tokens: 4096
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarJuezViral(
  contexto: any,
  contenido: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] ⚖️ Ejecutando Juez Viral...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el algoritmo humano más preciso para predecir viralidad.' },
      { role: 'user', content: PROMPT_JUEZ_VIRAL(contexto, contenido) }
    ],
    temperature: 0.3,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAuditorAvatar(
  infoCliente: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un psicólogo de consumidor y estratega de avatares.' },
      { role: 'user', content: PROMPT_AUDIT_AVATAR(infoCliente) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarAuditorExperto(
  contexto: any,
  contenidoExtra: string, 
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un analista competitivo y estratega de posicionamiento.' },
      { role: 'user', content: PROMPT_AUDIT_EXPERT(contexto, contenidoExtra) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarMentorEstrategico(
  query: string,
  contexto: any,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🧭 Ejecutando Mentor Estratégico...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un mentor de élite y estratega de crecimiento.' },
      { role: 'user', content: PROMPT_MENTOR_STRATEGIST(query, contexto) }
    ],
    temperature: 0.6,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

async function ejecutarCalendario(
  settings: any,
  contexto: any,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📅 Generando Calendario...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un estratega de contenidos CMO.' },
      { role: 'user', content: PROMPT_CALENDAR_GENERATOR(settings, contexto) }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// 🔄 CONTEXTO DE USUARIO
// ==================================================================================

async function getUserContext(
  supabase: any, 
  expertId: string, 
  avatarId: string, 
  kbId: string
): Promise<ContextoUsuario> {
  const promises = [
    expertId ? supabase.from('expert_profiles').select('*').eq('id', expertId).single() : null,
    avatarId ? supabase.from('avatars').select('*').eq('id', avatarId).single() : null,
    kbId ? supabase.from('documents').select('content').eq('id', kbId).single() : null
  ].filter(Boolean);

  const results = await Promise.allSettled(promises as Promise<any>[]);
  
  const contexto: ContextoUsuario = {
    nicho: 'General',
    avatar_ideal: 'Audiencia general',
    dolor_principal: 'N/A',
    deseo_principal: 'N/A',
    competencia_analizada: [],
    hooks_exitosos: [],
    patrones_virales: MEMORIA_SISTEMA.patrones_virales
  };
  
  if (results[0]?.status === 'fulfilled') {
    const expert = results[0].value?.data;
    if (expert) {
      contexto.nicho = expert.niche || contexto.nicho;
    }
  }
  
  if (results[1]?.status === 'fulfilled') {
    const avatar = results[1].value?.data;
    if (avatar) {
      contexto.avatar_ideal = avatar.name || contexto.avatar_ideal;
      contexto.dolor_principal = avatar.dolor || contexto.dolor_principal;
      contexto.deseo_principal = avatar.cielo || contexto.deseo_principal;
    }
  }

  if (results[2]?.status === 'fulfilled') {
    const kb = results[2].value?.data;
    if (kb?.content) {
      contexto.knowledge_base_content = kb.content.substring(0, 5000);
    }
  }
  
  return contexto;
}

// ==================================================================================
// 💰 CALCULADORA DE TARIFAS TITAN (100% ALINEADA CON FRONTEND)
// ==================================================================================

function calculateTitanCost(mode: string, inputContext: string, whisperMinutes: number, settings: any): number {
  
  // 1️⃣ IDEAS RÁPIDAS (QuickIdeas.tsx)
  if (mode === 'ideas_rapidas') {
    if (inputContext.toLowerCase().includes("10 ideas") || settings?.quantity === 10) return 7;
    return 3; 
  }

  // 2️⃣ CALENDARIO (Calendar.tsx)
  if (mode === 'calendar_generator') {
    const days = settings?.duration || 7; 
    if (days <= 3) return 2;   // Frontend: COST_PLANNING_3 = 2
    if (days <= 7) return 5;   // Frontend: COST_PLANNING_7 = 5
    return 10;                 // Frontend: COST_PLANNING_15 = 10
  }

  // 3️⃣ AUTOPSIA VIRAL (AnalyzeViral.tsx)
  if (mode === 'autopsia_viral') {
    return 5; // Frontend: ANALYSIS_COST = 5
  }

  // 4️⃣ RECREATE (TitanViral.tsx) - Precio según duración del video procesado
  if (mode === 'recreate') {
    // Si procesó un video largo (detectado por Whisper)
    if (whisperMinutes > 30) return 45; // Video Largo = 45 CR
    return 5; // Video Corto = 5 CR
  }

  // 5️⃣ GENERADOR DE GUIONES (ScriptGenerator.tsx)
  if (mode === 'generar_guion') {
    // Detectar duración según settings o keywords
    const durationId = settings?.durationId || 'medium';
    
    // MASTERCLASS = 30 CRÉDITOS
    if (durationId === 'masterclass' || inputContext.toLowerCase().includes('masterclass')) return 30;
    
    // LONG (90s+) = 2 CRÉDITOS
    if (durationId === 'long') return 2;
    
    // SHORT/MEDIUM (60s) = 1 CRÉDITO
    return 1;
  }

  // 6️⃣ JUEZ VIRAL (ViralCalculator.tsx)
  if (mode === 'juez_viral') {
    return 2; // Frontend: AUDIT_COST = 2
  }

  // 7️⃣ AUDITORÍAS DE AVATAR Y EXPERTO
  if (['audit_avatar', 'auditar_avatar'].includes(mode)) {
    return 2; // Frontend: COSTO_AUDITORIA = 2 (AvatarProfile.tsx)
  }

  if (['audit_expert', 'auditar_experto'].includes(mode)) {
    return 2; // Frontend: COSTO_AUDITORIA = 2 (ExpertProfile.tsx)
  }

  // 8️⃣ MENTOR / CHAT (AiAssistant.tsx)
  if (['mentor_ia', 'mentor_estrategico'].includes(mode)) {
    return 2; // Frontend: COSTO_MENTOR = 2
  }

  if (['chat_avatar', 'chat_expert'].includes(mode)) {
    return 1; // Frontend: COSTO_CHAT = 1 (en los componentes Avatar/Expert)
  }

  // 9️⃣ TRANSCRIPTOR Y HERRAMIENTAS DE TEXTO (TranscribeVideo.tsx)
  if (['transcribe', 'transcriptor'].includes(mode)) {
    // Lógica de video según duración
    if (whisperMinutes > 60) return 45;  // Masterclass (+1h)
    if (whisperMinutes > 30) return 15;  // Video largo (30min-1h)
    return 5; // Frontend: BASE_COST = 5 (video corto)
  }

  // Herramientas de transformación de texto
  if (['clean', 'authority', 'carousel', 'shorts', 'structure', 'ingenieria_inversa'].includes(mode)) {
    return 2; // Costo fijo bajo para transformaciones de texto puro
  }

  // 🔟 DEFAULT (Seguridad)
  return 1; 
}

// ==================================================================================
// 🚀 SERVIDOR PRINCIPAL
// ==================================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const apifyToken = Deno.env.get('APIFY_API_TOKEN');
    
    if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error('Faltan variables de entorno críticas');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    
    if (authError || !user) throw new Error('Usuario no autenticado o token inválido');
    userId = user.id;

    if (!checkRateLimit(userId)) throw new Error('Has excedido el límite de solicitudes por minuto. Espera un momento.');

    const body = await req.json();
    const { selectedMode, url, platform, expertId, avatarId, knowledgeBaseId, estimatedCost } = body;

    let processedContext = body.transcript || body.text || body.userInput || body.customPrompt || body.topic || body.query || "";
    
    let settings: any = {};
    if (body.quantity) settings.quantity = body.quantity;
    if (body.duration) settings.duration = body.duration;
    if (body.format) settings.format = body.format;

    try {
      if (processedContext.trim().startsWith('{')) {
         const parsed = JSON.parse(processedContext);
         settings = { ...settings, ...parsed };
         if (parsed.topic) processedContext = parsed.topic;
      }
    } catch (e) {}

    console.log(`[TITAN V300] 🧠 MODE: ${selectedMode} | INPUT LEN: ${processedContext.length} | USER: ${userId}`);

    if (estimatedCost > 0) {
      const { data: p } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      if (p?.tier !== 'admin' && (p?.credits || 0) < estimatedCost) {
        throw new Error(`Saldo insuficiente. Tienes ${p?.credits || 0} créditos y se requieren ${estimatedCost}.`);
      }
    }

    const userContext = await getUserContext(supabase, expertId || '', avatarId || '', knowledgeBaseId || '');

    let whisperMinutes = 0;
    if (url && processedContext.length < 50 && apifyToken) {
       try {
         const ingestion = await runIngestionPipeline(url, apifyToken, openaiKey);
         processedContext = ingestion.content;
         whisperMinutes = ingestion.whisperMinutes;
       } catch (e: any) { 
         console.error("[INGESTION] Error en pipeline:", e.message);
         if (!processedContext) processedContext = `Analizar contenido de la URL: ${url}`;
       }
    }

    let result: any;
    let tokensUsed = 0;

    switch (selectedMode) {
      case 'ideas_rapidas': {
        const userTopic = processedContext || "Viralidad";
        const quantity = (settings.quantity === 10 || userTopic.includes("10 ideas")) ? 10 : 3;
        
        const res = await ejecutarIdeasRapidas(userTopic, userContext, quantity, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'calendar_generator': {
        if (!settings.duration) settings.duration = 7;
        const res = await ejecutarCalendario(settings, userContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'autopsia_viral':
      case 'recreate': {
        const platName = platform || 'General';
        const autopsiaResponse = await ejecutarAutopsiaViral(processedContext, platName, userContext, openai);
        
        if (selectedMode === 'recreate') {
            const guionResponse = await ejecutarGeneradorGuiones(userContext, autopsiaResponse.data.adn_extraido, openai);
            result = { autopsia_viral: autopsiaResponse.data, guion_adaptado: guionResponse.data };
            tokensUsed = autopsiaResponse.tokens + guionResponse.tokens;
        } else {
            result = autopsiaResponse.data;
            tokensUsed = autopsiaResponse.tokens;
        }
        break;
      }

      case 'generar_guion': {
        const res = await ejecutarGeneradorGuiones(userContext, null, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'juez_viral': {
        const res = await ejecutarJuezViral(userContext, processedContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }
      
      case 'auditar_avatar':
      case 'audit_avatar': {
        const res = await ejecutarAuditorAvatar(processedContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'auditar_experto':
      case 'audit_expert': {
        const res = await ejecutarAuditorExperto(userContext, processedContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'mentor_estrategico':
      case 'mentor_ia':
      case 'chat_expert':
      case 'chat_avatar': {
         const res = await ejecutarMentorEstrategico(processedContext, userContext, openai);
         result = res.data;
         tokensUsed = res.tokens;
         break;
      }

      case 'transcribe':
      case 'clean':
      case 'authority':
      case 'shorts':
      case 'carousel':
      case 'structure': {
        const modePrompts: Record<string, string> = {
          'clean': 'Limpia y formatea el texto corrigiendo errores ortográficos y gramaticales.',
          'authority': 'Transforma este contenido en un artículo de autoridad estilo LinkedIn/Newsletter.',
          'shorts': 'Extrae 3 guiones virales de 60 segundos basados en este texto.',
          'carousel': 'Resume este contenido en una estructura de carrusel (Slide 1, Slide 2...).',
          'structure': 'Analiza la estructura viral y los sesgos psicológicos usados en este texto.',
          'transcribe': 'Mejora la transcripción y organízala por puntos clave.'
        };

        const instruction = modePrompts[selectedMode] || 'Procesa el contenido.';
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: `Eres un experto en transformación de contenido. ${instruction}` },
            { role: 'user', content: processedContext }
          ],
          temperature: 0.5
        });

        result = { 
            text_output: completion.choices[0].message.content,
            mode: selectedMode 
        };
        tokensUsed = completion.usage?.total_tokens || 0;
        break;
      }

      default: {
        result = { message: `Modo '${selectedMode}' desconocido o no implementado`, available_modes: true };
      }
    }

    const calculatedPrice = calculateTitanCost(selectedMode, processedContext, whisperMinutes, settings);
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      
      if (profile?.tier !== 'admin') {
         if ((profile?.credits || 0) < finalCost) {
            throw new Error(`Saldo insuficiente al finalizar. Costo real: ${finalCost} créditos.`);
         }
         
         const { error: creditError } = await supabase.rpc('decrement_credits', { user_uuid: userId, amount: finalCost });
         if (creditError) console.error(`[COBROS] ⚠️ Error al restar créditos: ${creditError.message}`);
         else console.log(`[COBROS] ✅ Cobrados ${finalCost} créditos a ${userId}`);
      }
    }

    const noSaveModes = ['chat-avatar', 'mentor_ia', 'mentor', 'chat_expert'];
    
    if (!noSaveModes.includes(selectedMode)) {
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedData: result, 
        finalCost, 
        metadata: { 
          mode: selectedMode, 
          duration: Date.now() - startTime,
          credits_deducted: finalCost 
        } 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );

  } catch (error: any) {
    console.error(`[ERROR CRÍTICO]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});