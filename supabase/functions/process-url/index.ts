// ==================================================================================
// 🚀 TITAN ENGINE V103 ULTIMATE - FULL CEREBRO INTEGRADO
// ==================================================================================
// SISTEMA COMPLETO:
// ✅ Scrapers para 6 plataformas (YouTube, TikTok, Instagram, Facebook, Twitter, LinkedIn)
// ✅ Whisper transcription con chunking
// ✅ Sistema de seguridad (rate limiting, sanitización, validación créditos)
// ✅ CEREBRO COMPLETO: 9 módulos de IA interconectados
// ✅ Memoria del sistema y contexto compartido
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
// 🧠 NÚCLEO DE INTELIGENCIA - Base de conocimiento compartida
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
}

// Base de datos de aprendizaje continuo (en memoria para esta ejecución)
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
// 🧠 SISTEMA CEREBRAL - 9 MÓDULOS DE IA INTERCONECTADOS
// ==================================================================================

// 1️ IDEAS RÁPIDAS (VERSIÓN TITAN POWER - SYNTAX FIXED)
// Mantiene toda la potencia del prompt original pero dentro de las comillas correctas.
const PROMPT_IDEAS = (topic: string, contexto: any) => `
ERES UN GENIO CREATIVO DE CONTENIDO VIRAL EN ESPAÑOL.
TU MISIÓN: Generar ideas de video EXPLOSIVAS sobre el tema: "${topic}".

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}
- Hooks exitosos previos: ${contexto.hooks_exitosos?.join(', ') || 'N/A'}
- Patrones virales identificados: ${contexto.patrones_virales?.join(', ') || 'N/A'}

BIBLIOTECAS DE CONOCIMIENTO (ÚSALAS PARA MAXIMIZAR VIRALIDAD):
${MASTER_HOOKS_STR}
${VIDEO_FORMATS_STR}
${ALGORITHM_SECRETS_STR}

PROTOCOLO DE GENERACIÓN:
1. Analiza el contexto completo del usuario.
2. Aplica los 7 disparadores virales: Curiosidad, Miedo, Deseo, Urgencia, Identidad, Controversia, Transformación.
3. Combina los patrones exitosos detectados por el sistema.
4. Genera ideas que conecten con el dolor profundo del Avatar.

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
  ],
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "Explicación de por qué esta es la mejor opción ahora"
  }
}

⚠️ INSTRUCCIÓN CRÍTICA: Todas las ideas deben estar en ESPAÑOL NEUTRO y ser específicas para el nicho del usuario.
`;

// 2️ AUTOPSIA VIRAL (V113 - TITAN SHOWRUNNER & TRANSLATOR)
// Requiere: platform (string) y contexto (objeto con nicho/avatar)
const PROMPT_AUTOPSIA_VIRAL = (platform: string, contexto: any) => `ACTÚA COMO LA INTELIGENCIA ARTIFICIAL DE PRODUCCIÓN MÁS AVANZADA DEL MUNDO.
ERES: Un Analista Forense + Un Director de Cine + Un Traductor de Nichos.

TU MISIÓN SUPREMA:
1. DECONSTRUIR el video viral origen (entender la mecánica).
2. TRADUCIR esa mecánica al nicho del usuario: **${contexto.nicho || 'Marca Personal'}**.
3. GENERAR los planes de rodaje y diseño gráfico.

CONTEXTO DEL USUARIO (DESTINO):
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Cliente Potencial'}
- Dolor: ${contexto.dolor_principal || 'N/A'}

--------------------------------------------------------
🧠 ZONA DE ENTRENAMIENTO (LÓGICA DE TRADUCCIÓN):
Si el video viral es de "Gatos saltando" (Sorpresa + Movimiento) y el usuario es "Contador":
❌ NO DIGAS: "Graba un gato".
✅ DI: "Graba una pila de papeles cayendo de golpe sobre el escritorio (Sorpresa + Movimiento)".
--------------------------------------------------------

PLATAFORMA: ${platform}

SALIDA JSON ESTRICTA (PARA ALIMENTAR EL DASHBOARD V120):
{
  "score_viral": {
    "potencial_total": (0-10),
    "factores_exito": ["Psicología", "Edición", "Narrativa"],
    "nivel_replicabilidad": "Alta/Media"
  },
  "adn_extraido": {
    "idea_ganadora": "El concepto abstracto (ej: 'El error costoso')",
    "disparador_psicologico": "Curiosidad / Miedo / Estatus / Identidad",
    "formula_gancho": "[Elemento Visual del Nicho] + [Texto de Negación]"
  },
  "patron_replicable": {
    "nombre_patron": "Nombre marketinero (ej: 'El Gancho Invertido')",
    "formula": "Paso 1 -> Paso 2 -> Paso 3",
    "aplicacion_generica": "Explicación estratégica de la estructura"
  },
  
  // --- ALIMENTA LA PESTAÑA 'TIMELINE / RODAJE' ---
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción técnica de la acción original",
      "porque_funciona": "Sesgo cognitivo activado (ej: Ruptura de patrón)",
      "instruccion_rodaje": "ACCIÓN FÍSICA TRADUCIDA AL NICHO ${contexto.nicho}: 'Graba [Acción específica] mirando a cámara con expresión de [Emoción]'"
    },
    {
      "segundo": "4-10",
      "que_pasa": "Retención y Desarrollo",
      "porque_funciona": "Apertura de bucle / Agitación",
      "instruccion_rodaje": "CAMBIO DE PLANO: 'Muestra [B-Roll o Pantalla] que demuestre el problema mencionado'"
    },
    {
      "segundo": "11-End",
      "que_pasa": "Resolución y CTA",
      "porque_funciona": "Dopamina y Recompensa",
      "instruccion_rodaje": "CIERRE: 'Vuelve a plano medio, da la solución en una frase y señala para el CTA'"
    }
  ],

  // --- ALIMENTA LA PESTAÑA 'PRODUCCIÓN' ---
  "produccion_deconstruida": {
    "ritmo_cortes": "Rápido (TikTok) / Lento (Cinemático)",
    "movimiento_camara": "Estático / Handheld / Zoom Digital",
    "musica_sonido": "Vibra sugerida (ej: Trending Phonk, Lo-fi, Tensión)"
  },

  // --- ALIMENTA LA PESTAÑA 'MINIATURA' ---
  "thumbnail_concept": {
    "elemento_visual": "Imagen principal sugerida (ej: Tu cara en primer plano sosteniendo [Objeto del Nicho])",
    "texto_en_imagen": "Copy corto y gigante (Max 3 palabras, ej: '¡ERROR FATAL!')",
    "color_psicologia": "Colores de alto contraste recomendados (ej: Amarillo sobre Negro)",
    "composicion": "Regla de tercios / Split Screen / Cara Sorprendida"
  },

  "insights_algoritmicos": {
    "optimizacion_retencion": "Táctica usada para evitar el abandono",
    "seo_keywords": ["Keyword 1", "Keyword 2"]
  }
}`;

// 3️ GENERADOR DE GUIONES
const PROMPT_GENERADOR_GUIONES = (contexto: ContextoUsuario, viralDNA?: any) => {
  const dnaContext = viralDNA ? `\n\nADN VIRAL EXTRAÍDO:\n${JSON.stringify(viralDNA)}` : '';
  
  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL EN ESPAÑOL DEL MUNDO.
TU MISIÓN: Crear guiones completos, listos para teleprompter, que ENGANCHEN desde el segundo 1.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}
- Posicionamiento: ${contexto.posicionamiento || 'N/A'}
- Enemigo común: ${contexto.enemigo_comun || 'N/A'}${dnaContext}

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${WINNER_ROCKET_TIMELINE}
${VIDEO_FORMATS_STR}

ARQUITECTURA DE GUION (APLICAR SIEMPRE):
1. GANCHO (0-3s): Dispara curiosidad o rompe patrón
2. PROBLEMA (4-15s): Amplifica el dolor del Avatar
3. AGITACIÓN (16-30s): Profundiza en consecuencias
4. SOLUCIÓN (31-50s): Presenta el camino (tu método/producto)
5. PRUEBA (51-70s): Validación social o datos
6. CTA (71-90s): Llamado a la acción irresistible

PROTOCOLOS DE ESCRITURA:
- Español neutro, natural, conversacional
- Frases cortas (máx 15 palabras)
- Lenguaje del Avatar (sus palabras, su jerga)
- Sin relleno, cada palabra tiene propósito
- Formato teleprompter: SIN [corchetes] ni (paréntesis) en el texto hablado

FORMATO DE SALIDA JSON ESTRICTO:
{
  "metadata_guion": {
    "nicho": "${contexto.nicho || 'General'}",
    "duracion_estimada": "60-90 segundos",
    "dificultad_produccion": "Baja/Media/Alta",
    "recursos_necesarios": ["Recurso 1", "Recurso 2"]
  },
  "estructura_narrativa": {
    "framework": "PAS / Héroe / Mito vs Realidad",
    "arco_emocional": "Descripción de la curva emocional"
  },
  "ganchos_opcionales": [
    {
      "tipo": "Curiosidad",
      "texto": "Primera línea del video - Opción 1 (Max 12 palabras)",
      "retencion_predicha": 92,
      "patron_usado": "De los 40 ganchos Winner Rocket"
    },
    {
      "tipo": "Disrupción",
      "texto": "Primera línea del video - Opción 2 (Max 12 palabras)",
      "retencion_predicha": 95,
      "patron_usado": "De los 40 ganchos Winner Rocket"
    },
    {
      "tipo": "Miedo",
      "texto": "Primera línea del video - Opción 3 (Max 12 palabras)",
      "retencion_predicha": 88,
      "patron_usado": "De los 40 ganchos Winner Rocket"
    }
  ],
  "guion_completo": "AQUÍ VA EL GUION PALABRA POR PALABRA\\n\\nSeparado en párrafos claros.\\n\\nCada párrafo es una idea completa.\\n\\nListo para leer en teleprompter.\\n\\nSin anotaciones de producción en el texto hablado.",
  "plan_visual": [
    {
      "tiempo": "0-3s",
      "accion_en_pantalla": "Descripción de lo que se ve",
      "instruccion_produccion": "Plano detalle / Movimiento de cámara",
      "audio": "Música / Silencio / Efecto"
    }
  ],
  "optimizacion_algoritmica": {
    "keywords_seo": ["Keyword 1", "Keyword 2", "Keyword 3"],
    "momento_publicacion": "Mejor día y hora basado en nicho",
    "hashtags_sugeridos": ["#hashtag1", "#hashtag2"],
    "descripcion_video": "Texto optimizado para SEO de plataforma"
  }
}

⚠️ REGLA DE ORO: El guion debe ser tan bueno que el usuario solo necesite leerlo en cámara para crear un video viral.`;
};

// 4️ JUEZ VIRAL (V109 - THE NEURO-SURGEON)
const PROMPT_JUEZ_VIRAL = (contexto: ContextoUsuario, contenido: string) => `ACTÚA COMO EL 'CHIEF ATTENTION OFFICER' DE LA MAYOR CONSULTORA DE VIRALIDAD DEL MUNDO.
TU CONOCIMIENTO: Neurociencia (Dopamina/Cortisol), Copywriting de Respuesta Directa y Algoritmos de Retención (Short-Form).

TU MISIÓN:
Realizar una "Neuro-Cirugía" al contenido del usuario.
1. DIAGNÓSTICO: Encuentra dónde el cerebro del espectador se "desconecta" (Cognitive Load alto).
2. CIRUGÍA: Reescribe el guion para que sea imposible de ignorar, usando "Palabras Gatillo" y "Bucles de Curiosidad".

CONTEXTO DEL OBJETIVO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'N/A'}

CONTENIDO A AUDITAR:
"${contenido}"

PROTOCOLO DE REESCRITURA (ESTRICTO):
1. LEY DEL HIELO (0-3s): Si el gancho no promete un beneficio egoísta inmediato o rompe una creencia, MÁTALO. Escribe uno nuevo.
2. VELOCIDAD NARRATIVA: Elimina adverbios, saludos y "fluff". Aumenta la densidad de información.
3. INGENIERÍA DE LA BRECHA: Abre un bucle al inicio ("Te han mentido sobre...") y ciérralo SOLO al final.
4. TONO: Autoridad Absoluta pero Empatía Radical. Háblale al dolor del Avatar.

FORMATO DE SALIDA JSON ESTRICTO:
{
  "veredicto_final": {
    "score_total": (0-100. Sé científico. Un 90+ requiere perfección psicológica),
    "clasificacion": "VIRAL ELITE / POTENCIAL BUENO / INVISIBLE",
    "probabilidad_viral": "Alta/Media/Baja",
    "confianza_prediccion": "96%"
  },
  "evaluacion_criterios": [
    { 
      "criterio": "Impacto Neuro-Visual (Hook)", 
      "score": (0-10), 
      "analisis": "¿Rompe el patrón de scroll o es ruido blanco? Análisis técnico.",
      "sugerencia": "Acción específica (ej: 'Usa un objeto físico')"
    },
    { 
      "criterio": "Retención y Pacing", 
      "score": (0-10), 
      "analisis": "Evaluación de la densidad de valor por segundo.",
      "sugerencia": "Dónde cortar grasa"
    }
  ],
  "fortalezas_clave": ["Elemento de autoridad bien usado", "Trigger emocional detectado"],
  "debilidades_criticas": [
    {
      "problema": "Inicio lento (La 'Zona de Muerte' de los 3s)",
      "impacto": "Pérdida del 60% de tráfico",
      "solucion": "Empezar in-media-res (en medio de la acción)"
    }
  ],
  "optimizaciones_rapidas": [
    "PNL: Cambia 'trataré de explicar' por 'te voy a revelar'",
    "Estructura: Mueve el beneficio final al principio"
  ],
  "prediccion_metricas": {
    "vistas_estimadas": "Proyección basada en el gancho",
    "engagement_rate": "Proyección basada en el CTA",
    "tiempo_viralizacion": "Estimado"
  },
  "decision_recomendada": "PUBLICAR / REESCRIBIR (USAR VERSIÓN OPTIMIZADA) / DESCARTAR",
  
  "rewritten_version": "ESCRIBE AQUÍ LA 'MASTERPIECE' VIRAL. APLICA TODA TU CIENCIA.\n\nREGLAS DE ORO PARA ESTA VERSIÓN:\n1. FORMATO: Usa mayúsculas para énfasis y saltos de línea rítmicos.\n2. VOCABULARIO: Usa palabras sensoriales y de alto impacto.\n3. ESTRUCTURA: Gancho (La Promesa/El Miedo) -> El Problema (Agitación) -> La Solución (Tu Método) -> CTA (Identidad).\n4. SIN SALUDOS: Empieza golpeando.\n5. ADAPTADO AL NICHO: Usa la jerga específica del ${contexto.nicho}."
}`;

// 5️ TRANSCRIPTOR
const PROMPT_TRANSCRIPTOR = (platform: string) => `ERES UN TRANSCRIPTOR EXPERTO CON ANÁLISIS CONTEXTUAL.
TU MISIÓN: Convertir videos en texto estructurado Y añadir capas de análisis.

PLATAFORMA: ${platform}

PROTOCOLO DE TRANSCRIPCIÓN INTELIGENTE:

NIVEL 1: TRANSCRIPCIÓN BÁSICA
- Texto exacto palabra por palabra
- Timestamps cada 5 segundos
- Identificación de pausas significativas
- Marcadores de cambio de tono/énfasis

NIVEL 2: ESTRUCTURA NARRATIVA
- Identificar secciones: Gancho, Problema, Desarrollo, CTA
- Etiquetar transiciones clave
- Mapear arco emocional del discurso

NIVEL 3: ANÁLISIS CONTEXTUAL
- Identificar hooks y por qué funcionan
- Extraer frases potentes replicables
- Detectar patrones persuasivos
- Keywords y temas principales

FORMATO DE SALIDA JSON ESTRICTO:
{
  "metadata_transcripcion": {
    "duracion_video": "90 segundos",
    "numero_palabras": 245,
    "velocidad_promedio": "163 palabras/minuto",
    "idioma_detectado": "Español"
  },
  "transcripcion_completa": [
    {
      "timestamp": "0:00 - 0:03",
      "texto": "Texto exacto dicho en este segmento",
      "seccion": "Gancho",
      "enfasis": "Alto/Medio/Bajo"
    }
  ],
  "estructura_identificada": {
    "gancho": {
      "texto": "Primeras palabras del video",
      "duracion": "3 segundos",
      "tipo_hook": "Pregunta/Shock/Curiosidad",
      "score_efectividad": 8.5
    },
    "cierre": {
      "texto": "Últimas palabras del video",
      "tipo_cta": "Suscribirse/Comentar/Comprar"
    }
  },
  "frases_potentes": [
    {
      "frase": "Frase exacta que destaca",
      "timestamp": "0:25",
      "porque_funciona": "Análisis de por qué esta frase es fuerte"
    }
  ],
  "patrones_detectados": [
    {
      "patron": "Uso de pregunta retórica cada 15 segundos",
      "frecuencia": "5 veces en 90 segundos",
      "efecto": "Mantiene atención por micro-ganchos"
    }
  ]
}`;

// 6️ AUDITOR DE AVATAR (V300 - THE EMPATHY PROFILER)
// Analiza la profundidad psicológica del cliente ideal.
const PROMPT_AUDIT_AVATAR = (avatarJson: string) => `
ACTÚA COMO: El Psicólogo de Consumo y Copywriter de Respuesta Directa más sofisticado del mundo (Estilo Eugene Schwartz + Jordan Peterson).

TU OBJETIVO:
Auditar sin piedad el perfil del "Avatar" (Cliente Ideal) que ha definido el usuario. Debes detectar si es un perfil real, visceral y rentable, o si es una descripción genérica y superficial.

DATOS DEL AVATAR A AUDITAR:
${avatarJson}

CRITERIOS DE CALIFICACIÓN (ESTÁNDAR DE ÉLITE):
1. **ESPECIFICIDAD:** - 0 Puntos: "Quiere ganar más dinero".
   - 100 Puntos: "Le tiembla la mano al pasar la tarjeta en el súper por miedo a que sea rechazada".
2. **URGENCIA (BLEEDING NECK):** - ¿El dolor descrito es una molestia leve o una herida abierta que necesita solución YA?
3. **COHERENCIA EMOCIONAL:** - ¿El "Miedo Oculto" coincide con la "Objeción"? (Ej: Si su miedo es el estatus, su objeción será "qué dirán si esto falla", no el precio).

SALIDA JSON ESTRICTA (PARA ALIMENTAR EL DASHBOARD):
{
  "audit_result": {
    "score": (0-100. Sé crítico. 100 es perfección psicológica),
    
    "feedback": "Resumen directo. Dime si este avatar es rentable o es una fantasía. Sé duro pero constructivo.",
    
    "blind_spots": [
      "Punto Ciego 1: Ej. 'Su Infierno es muy genérico, falta describir la emoción física'.",
      "Punto Ciego 2: Ej. 'Dices que tiene 20 años pero su miedo es de alguien de 50'."
    ],
    
    "suggestions": [
      "Acción 1: Ej. 'Cambia el dolor X por Y para aumentar la urgencia'.",
      "Acción 2: Ej. 'Define una situación específica donde sienta ese miedo (cena familiar, oficina)'."
    ]
  }
}
`;

// 7️ AUDITOR DE EXPERTO (V300 - ELITE STRATEGIST)
// Fusiona tu lógica de "7 Fases" con la estructura visual del Frontend
const PROMPT_AUDIT_EXPERT = (expertProfile: any, avatarContext: string) => `
ERES UN ANALISTA COMPETITIVO Y ESTRATEGA DE POSICIONAMIENTO.
TU MISIÓN: Analizar el perfil del usuario, su competencia y el mercado para encontrar su ÁNGULO ÚNICO.

DATOS DEL EXPERTO:
- Nicho: ${expertProfile.niche || 'General'}
- Misión: ${expertProfile.mission || 'N/A'}
- Framework: ${expertProfile.framework || 'N/A'}

CONTEXTO DEL AVATAR (OBJETIVO):
${avatarContext || 'Mercado General'}

--- TU PROTOCOLO DE PENSAMIENTO (LAS 7 FASES DE ÉLITE) ---
Usa internamente este proceso para generar el análisis:
1. MAPEO DE COMPETENCIA (Top players)
2. ANÁLISIS DE BRECHAS (Qué hacen todos vs Qué no hace nadie)
3. DIFERENCIACIÓN (Fortalezas únicas)
4. POSICIONAMIENTO (Declaración única)
5. ESTRATEGIA DE CONTENIDO (Pilares)
6. MATRIZ DE OPORTUNIDADES (Qué crear ahora)
7. SISTEMA DE MONITOREO (KPIs)

--- SALIDA JSON ESTRICTA (MAPEO AL DASHBOARD) ---
Traduce tus hallazgos de las 7 fases al siguiente formato para la interfaz gráfica:

{
  "audit_result": {
    "score": (0-100. 100=Océano Azul Total, 0=Irrelevante/Copia),
    
    "feedback": "Sintetiza aquí el 'Resumen Ejecutivo' y el 'Posicionamiento Estratégico'. Diles cuál es su Oportunidad Principal detectada en la Fase 6.",
    
    "blind_spots": [
      "Brecha de Mercado: Describe el 'Ángulo Virgen' detectado en la Fase 2.",
      "Error Común: Describe lo que 'Todos hacen mal' según tu análisis."
    ],
    
    "suggestions": [
      "Estrategia de Contenido: Tu mejor recomendación de la Fase 5 (Pilares).",
      "Acción Inmediata: La acción más crítica del 'Plan de 90 Días' (Fase 7)."
    ]
  }
}
`;

// 8 MENTOR ESTRATÉGICO (V300 - THE GRANDMASTER)
// Este prompt usa razonamiento profundo y prioriza la Base de Conocimiento (KB)
const PROMPT_MENTOR_STRATEGIST = (userQuery: string, contexto: any) => `
ACTÚA COMO: Un Asesor de Negocios de "Nivel Gran Maestro" (Mezcla de Alex Hormozi, Dan Kennedy y un Estratega Militar).
TU OBJETIVO: Resolver la duda del usuario con precisión quirúrgica, usando EXCLUSIVAMENTE su propia metodología si está disponible.

--- TUS ARCHIVOS (LA VERDAD ABSOLUTA) ---
1. QUIÉN ERES (Experto): ${contexto.nicho || 'Experto General'}.
2. A QUIÉN VENDES (Avatar): ${contexto.avatar_ideal || 'Audiencia General'}.
3. TU CEREBRO (Knowledge Base): ${contexto.knowledge_base_content ? 
   `[PRIORIDAD MÁXIMA] USA ESTOS DATOS PARA RESPONDER: "${contexto.knowledge_base_content.substring(0, 3000)}..."` : 
   "[ALERTA] No hay Knowledge Base. Usa principios universales de marketing de respuesta directa."}

--- LA CONSULTA ---
"${userQuery}"

--- TU PROTOCOLO DE PENSAMIENTO (CHAIN OF THOUGHT) ---
Antes de generar el JSON, piensa internamente:
1. **DECODIFICACIÓN:** ¿Qué está preguntando realmente? (Ej: Si pregunta "¿Qué color uso?", en realidad pregunta "¿Cómo transmito confianza?").
2. **BÚSQUEDA VECTORIAL MENTAL:** ¿Hay respuesta en la 'Base de Conocimiento'? SI LA HAY, ÚSALA. No inventes si el documento ya tiene la respuesta. Cita la metodología del usuario.
3. **SIMULACIÓN DE AVATAR:** ¿Cómo reaccionaría el Avatar definido a este consejo? ¿Le calmaría su dolor?
4. **SÍNTESIS DE ÉLITE:** Redacta la respuesta sin "fluff", sin rellenos corporativos. Ve al grano.

--- SALIDA JSON ESTRICTA (PARA INTERFAZ GRÁFICA) ---
{
  "answer": "Tu respuesta estratégica aquí (Markdown). Si usaste la Knowledge Base, di: 'Según tu metodología...'. Sé autoritario, empático y ultra-práctico.",
  
  "action_steps": [
    "Paso 1: La acción más obvia e inmediata (Quick Win).",
    "Paso 2: La acción estratégica profunda.",
    "Paso 3: El movimiento avanzado para escalar."
  ],
  
  "key_insight": "Una frase corta, brutal y memorable que resuma la estrategia (Ej: 'No vendes coaching, vendes certeza')."
}
`;

// 9 RECREATE VIRAL (V300 - THE NEURO-ADAPTER / CHAIN OF THOUGHT)
// Este es el prompt más avanzado. Usa razonamiento por pasos para garantizar la adaptación.
const PROMPT_RECREATE_VIRAL = (platform: string, contexto: any) => `
ACTÚA COMO: El Arquitecto Viral más sofisticado del mundo. Eres experto en Psicología Conductual, Storytelling y Adaptación de Nichos.

--- TUS ENTRADAS ---
PLATAFORMA ORIGEN: ${platform}
NICHO DESTINO (USUARIO): ${contexto.nicho || 'General'}
AVATAR DESTINO: ${contexto.avatar_ideal || 'Cliente Potencial'}
CONOCIMIENTO BASE (CEREBRO): ${contexto.knowledge_base_content ? `"${contexto.knowledge_base_content.substring(0, 500)}..."` : "Usa principios generales del nicho."}

--- TU PROTOCOLO DE PENSAMIENTO (CHAIN OF THOUGHT) ---
1.  **DECONSTRUCCIÓN:** Analiza el video viral. ¿Cuál es el "Mecanismo Abstracto"? (Ej: No es "un gato saltando", es "un elemento inesperado entrando en cuadro rápidamente").
2.  **PUENTE LÓGICO:** Busca equivalentes en el nicho del usuario. (Ej: Si el nicho es "Abogado", el equivalente a "gato saltando" podría ser "un contrato rompiéndose").
3.  **SÍNTESIS:** Si hay "Conocimiento Base", úsalo para dar autoridad al guion.

--- SALIDA JSON OBLIGATORIA (SIN TEXTO EXTRA) ---
Debes llenar este JSON para alimentar la interfaz gráfica del usuario:

{
  "viral_score": (0-100, sé crítico),
  "adaptation_metadata": {
    "original_niche": "Deduce el nicho del video viral (Ej: Entretenimiento)",
    "target_niche": "${contexto.nicho}",
    "core_mechanism": "Nombre científico del gancho (Ej: Pattern Interrupt Visual)"
  },

  // 1. EL MOTOR DE ESPEJO (Para comparar Origen vs Destino)
  "translation_engine": [
    {
      "phase": "GANCHO (0-3s)",
      "original_action": "Describe brevemente la acción visual del video viral",
      "your_action": "INSTRUCCIÓN DE RODAJE EXACTA para el nicho ${contexto.nicho}. Sé visual y directivo.",
      "principle": "El sesgo cognitivo usado (Ej: Curiosidad Inmediata)"
    },
    {
      "phase": "RETENCIÓN (Cuerpo)",
      "original_action": "Qué mantiene la atención en el original",
      "your_action": "Acción adaptada que aporta valor/entretenimiento en ${contexto.nicho}",
      "principle": "Ej: Open Loop / Storytelling"
    },
    {
      "phase": "CLÍMAX / CTA",
      "original_action": "Cómo cierra el original",
      "your_action": "Cierre estratégico para vender/convertir en ${contexto.nicho}",
      "principle": "Ej: High Dopamine Reward"
    }
  ],

  // 2. EL GUION VERTICAL (Lo que el usuario debe decir/leer)
  "script_structure": {
    "hook": "Escribe la PRIMERA FRASE impactante adaptada al nicho.",
    "body": "Desarrollo del guion (puntos clave). Usa el tono del experto.",
    "cta": "La frase final para pedir acción (Follow/Buy)."
  },

  // 3. DATOS PARA LAS PESTAÑAS (Tabs)
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Gancho Visual",
      "instruccion_rodaje": "Describe la toma exacta: Plano, Acción, Gesto.",
      "porque_funciona": "Explicación psicológica breve."
    },
    {
      "segundo": "4-End",
      "que_pasa": "Desarrollo",
      "instruccion_rodaje": "Instrucciones para el cuerpo del video y cierre.",
      "porque_funciona": "Retención."
    }
  ],
  "produccion_deconstruida": {
    "musica_sonido": "Sugiere música (Trending/Cinematic) y SFX específicos."
  },
  "thumbnail_concept": {
    "elemento_visual": "Descripción de la imagen principal para la miniatura.",
    "texto_en_imagen": "Texto corto (max 3 palabras) para la imagen.",
    "color_psicologia": "Paleta de colores recomendada.",
    "composicion": "Ej: Regla de tercios, Cara grande, etc."
  }
}
`;

// 10 GENERADOR DE CALENDARIO (V300 - WAR ROOM STRATEGIST)
const PROMPT_CALENDAR_GENERATOR = (settings: any, contexto: any) => `
ACTÚA COMO: Director de Estrategia de Contenidos (CMO) de clase mundial.
TU MISIÓN: Crear un plan de acción de ${settings.duration} días.

--- TU ARSENAL (CONTEXTO) ---
1. EL EXPERTO (Voz): ${contexto.nicho || 'General'}.
2. EL OBJETIVO (Target): ${contexto.avatar_ideal || 'Audiencia General'}.
3. LA BIBLIA (Fuente de Verdad): ${contexto.knowledge_base_content ? 
   `USA ESTA BASE DE CONOCIMIENTO PARA LOS TEMAS: "${contexto.knowledge_base_content.substring(0, 1500)}..."` : 
   "No hay base de conocimiento. Usa temas estándar del nicho."}

--- PARÁMETROS DE LA MISIÓN ---
- OBJETIVO TÁCTICO: ${settings.focus} (Viralidad / Autoridad / Venta).
- FORMATO: ${settings.format}.

--- INSTRUCCIONES DE EJECUCIÓN ---
1. Si hay "Base de Conocimiento", extrae conceptos específicos de ahí. No inventes, usa su metodología.
2. Si el objetivo es "Venta", asegúrate de que las ideas ataquen objeciones del Avatar.
3. Si el objetivo es "Viralidad", usa ganchos polarizantes.

--- SALIDA JSON ESTRICTA ---
{
  "calendar": [
    {
      "day": 1,
      "title": "Un título gancho potente (Ej: 'Deja de hacer X')",
      "objective": "Viralidad/Autoridad/Venta",
      "format": "${settings.format}",
      "angle": "Explica el enfoque psicológico (Ej: 'Derribar un mito común del nicho')",
      "description": "Breve descripción de qué trata el video."
    },
    ... (Repite para los ${settings.duration} días)
  ]
}
`;

// ==================================================================================
// 🧠 FUNCIONES EJECUTORAS DE MÓDULOS (ACTUALIZADO V300)
// ==================================================================================

// ejecutarIdeasRapidas por esta:
async function ejecutarIdeasRapidas(
  userInput: string,
  contexto: any,
  qty: number, // <--- AHORA ACEPTA CANTIDAD
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log(`[CEREBRO] 💡 Ejecutando Ideas Rápidas (${qty})...`);
  
  // Prompt interno dinámico para asegurar la cantidad
  const promptDinamico = `
    TEMA: "${userInput}".
    CONTEXTO: ${contexto.nicho}.
    TU MISIÓN: Generar EXACTAMENTE ${qty} ideas de video virales.
    NO generes más ni menos.
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
// 2. AUTOPSIA VIRAL (Ahora recibe Contexto para adaptar)
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
  
  // Guardamos patrones en memoria si existen (Opcional)
  if (typeof MEMORIA_SISTEMA !== 'undefined') {
      if (data.patron_replicable) MEMORIA_SISTEMA.patrones_virales.push(data.patron_replicable.nombre_patron);
      if (data.adn_extraido?.formula_gancho) MEMORIA_SISTEMA.hooks_alto_rendimiento.push(data.adn_extraido.formula_gancho);
  }
  
  return {
    data,
    tokens: completion.usage?.total_tokens || 0
  };
}

// 3. GENERADOR DE GUIONES
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

// 4. JUEZ VIRAL
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

// 5. AUDITOR DE AVATAR
async function ejecutarAuditorAvatar(
  infoCliente: string,
  nicho: string,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un psicólogo de consumidor y estratega de avatares.' },
      { role: 'user', content: PROMPT_AUDITOR_AVATAR(infoCliente, nicho) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// 6. AUDITOR DE EXPERTO
async function ejecutarAuditorExperto(
  contexto: any, // Pasamos el contexto completo (expertProfile)
  contenidoExtra: string, 
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 🎯 Ejecutando Auditor de Experto...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres un analista competitivo y estratega de posicionamiento.' },
      { role: 'user', content: PROMPT_AUDITOR_EXPERTO(contexto, contenidoExtra) }
    ],
    temperature: 0.5,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// 7. MENTOR ESTRATÉGICO
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
      { role: 'user', content: PROMPT_MENTOR_ESTRATEGICO(query, contexto) }
    ],
    temperature: 0.6,
    max_tokens: 3000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

// 8. GENERADOR DE CALENDARIO (¡NUEVO!)
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
// 🔄 CONTEXTO DE USUARIO (Carga de perfil)
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
    kbId ? supabase.from('documents').select('*').eq('id', kbId).single() : null
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
  
  return contexto;
}
// ==================================================================================
// 💰 CALCULADORA DE TARIFAS TITAN (VERSIÓN COMPLETA - TODAS LAS FUNCIONES)
// ==================================================================================
function calculateTitanCost(mode: string, inputContext: string, whisperMinutes: number, settings: any): number {
  
  // 1. IDEAS RÁPIDAS (Dinámico: 3 o 7 créditos)
  if (mode === 'ideas_rapidas') {
    if (inputContext.toLowerCase().includes("10 ideas") || settings?.quantity === 10) return 7;
    return 3; 
  }

  // 2. PROCESAMIENTO DE VIDEO / AUDIO (Dinámico por duración)
  // Aplica para: Autopsia, Recreate, Transcriptor, Shorts (video), Structure (video), Ingeniería
  if (['autopsia_viral', 'recreate', 'transcribe', 'transcriptor', 'ingenieria_inversa', 'shorts', 'structure'].includes(mode)) {
    // Regla de duración real (si se procesó con Whisper)
    if (whisperMinutes > 60) return 45; // Masterclass (+1h)
    if (whisperMinutes > 30) return 15; // Largo (30m-1h)
    
    // Regla de seguridad por texto (si no hubo whisper pero el usuario pegó un texto largo o keywords)
    if (inputContext.toLowerCase().includes("masterclass") || inputContext.toLowerCase().includes("1 hora")) return 45;
    if (inputContext.toLowerCase().includes("30 minutos")) return 15;
    
    // Tarifa base para videos cortos (<30min) o análisis simples
    // 'shorts' costaba 3 en tu tabla vieja, pero si procesa video real, 5 es más seguro.
    return 5; 
  }

  // 3. CALENDARIO (Dinámico por días: 2, 5, 10 créditos)
  if (mode === 'calendar_generator') {
    const days = settings?.duration || 7; 
    if (days <= 3) return 2;
    if (days <= 7) return 5;
    return 10; // 15 días
  }

  // 4. HERRAMIENTAS DE TEXTO (Precios Fijos Específicos)
  if (mode === 'clean') return 2;
  if (mode === 'authority') return 2;
  if (mode === 'carousel') return 2;
  if (mode === 'generar_guion') return 5; // Guiones de texto

  // 5. MENTORES Y AUDITORÍAS (Standard: 5 créditos)
  if ([
    'juez_viral', 
    'auditar_avatar', 
    'auditar_experto', 
    'mentor_ia', 
    'mentor_estrategico', 
    'chat_avatar', 
    'chat_expert',
    'audit_avatar', // Alias
    'audit_expert'  // Alias
  ].includes(mode)) {
    return 5;
  }

  // 6. DEFAULT (Seguridad)
  return 1; 
}

// ==================================================================================
// 🚀 SERVIDOR PRINCIPAL (LÓGICA PROFESIONAL INTEGRADA)
// ==================================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    // 1. SETUP
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const apifyToken = Deno.env.get('APIFY_API_TOKEN');
    
    if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error('Faltan variables de entorno');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });
    
    // 2. AUTH
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    if (authError || !user) throw new Error('Usuario no autenticado');
    userId = user.id;

    // 3. RATE LIMITING (Tu seguridad original)
    if (!checkRateLimit(userId)) throw new Error('RATE_LIMIT: Demasiadas solicitudes');

    // 4. PARSEO DE DATOS (LA "ASPIRADORA" QUE ARREGLA EL INPUT)
    const body = await req.json();
    const { selectedMode, url, expertId, avatarId, knowledgeBaseId, estimatedCost } = body;

    // Buscamos el texto donde sea que venga (transcript, text, userInput, customPrompt, etc.)
    let processedContext = body.transcript || body.text || body.userInput || body.customPrompt || body.topic || body.query || "";
    
    // Detectamos configuración extra
    let settings: any = {};
    if (body.quantity) settings.quantity = body.quantity;
    if (body.duration) settings.duration = body.duration;
    if (body.format) settings.format = body.format;

    // Parseo si el texto es JSON string
    try {
      if (processedContext.trim().startsWith('{')) {
         const parsed = JSON.parse(processedContext);
         settings = { ...settings, ...parsed };
         if (parsed.topic) processedContext = parsed.topic;
      }
    } catch (e) {}

    console.log(`[TITAN V300] 🧠 MODE: ${selectedMode} | INPUT LEN: ${processedContext.length}`);

    // 5. VALIDACIÓN DE CRÉDITOS (PRE-CHECK)
    if (estimatedCost > 0) {
      const { data: p } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      if (p?.tier !== 'admin' && (p?.credits || 0) < estimatedCost) throw new Error('Saldo insuficiente');
    }

    // 6. CARGA DE CONTEXTO (Tu función original)
    const userContext = await getUserContext(supabase, expertId || '', avatarId || '', knowledgeBaseId || '');

    // 7. INGESTIÓN INTELIGENTE (Tus scrapers originales)
    let whisperMinutes = 0;
    if (url && processedContext.length < 50 && apifyToken) {
       try {
         // Llamamos a tu función original de pipeline
         const ingestion = await runIngestionPipeline(url, apifyToken, openaiKey);
         processedContext = ingestion.content;
         whisperMinutes = ingestion.whisperMinutes;
       } catch (e: any) { 
         console.error("[INGESTION] Falló, usando fallback:", e.message);
         if (!processedContext) processedContext = `Analizar URL: ${url}`;
       }
    }

    // ==================================================================================
    // 9. EJECUCIÓN DEL CEREBRO
    // ==================================================================================
    
    let result: any;
    let tokensUsed = 0;

    switch (selectedMode) {
      
      // CASO ESPECIAL: IDEAS (3 vs 10)
      case 'ideas_rapidas': {
        const userTopic = processedContext || "Viralidad";
        const quantity = (settings.quantity === 10 || userTopic.includes("10 ideas")) ? 10 : 3;
        // Llamamos a la función actualizada que acepta qty
        const res = await ejecutarIdeasRapidas(userTopic, userContext, quantity, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      // CASO ESPECIAL: CALENDARIO
      case 'calendar_generator': {
        if (!settings.duration) settings.duration = 7;
        const res = await ejecutarCalendario(settings, userContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      // CASOS ESTÁNDAR (Usan tus funciones originales)
      case 'autopsia_viral':
      case 'recreate': {
        const autopsiaResponse = await ejecutarAutopsiaViral(processedContext, body.platform || 'General', userContext, openai);
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
        const res = await ejecutarAuditorAvatar(processedContext, userContext.nicho, openai);
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

      // HERRAMIENTAS DE TEXTO (Recuperadas)
      case 'transcribe':
      case 'clean':
      case 'authority':
      case 'shorts':
      case 'carousel':
      case 'structure': {
        const prompts: any = {
          clean: 'Limpia y corrige el texto.',
          authority: 'Transforma en artículo de autoridad.',
          shorts: 'Extrae 3 guiones de 60s.',
          carousel: 'Crea estructura de carrusel.',
          structure: 'Analiza la estructura viral.',
          transcribe: 'Mejora la transcripción.'
        };
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'system', content: prompts[selectedMode] }, { role: 'user', content: processedContext }]
        });
        result = { text_output: completion.choices[0].message.content, mode: selectedMode };
        tokensUsed = completion.usage.total_tokens;
        break;
      }

      default: {
        result = { message: 'Modo desconocido' };
      }
    }

    // ==================================================================================
    // 10. COBRO REAL (USANDO LA CALCULADORA NUEVA)
    // ==================================================================================
    
    // Aquí es donde ocurre la magia del precio dinámico
    const calculatedPrice = calculateTitanCost(selectedMode, processedContext, whisperMinutes, settings);
    
    // Seguridad: Cobramos lo mayor entre lo calculado y lo que dijo el frontend
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    // Ejecutar cobro
    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      
      if (profile?.tier !== 'admin') {
         if ((profile?.credits || 0) < finalCost) throw new Error(`Saldo insuficiente. Costo real: ${finalCost}`);
         
         const { error: payErr } = await supabase.rpc('decrement_credits', { user_uuid: userId, amount: finalCost });
         if (payErr) console.error("Error cobrando:", payErr);
      }
    }

    // 11. PERSISTENCIA
    if (!['chat-avatar', 'mentor_ia', 'mentor', 'chat_expert'].includes(selectedMode)) {
      await supabase.from('viral_generations').insert({ 
        user_id: userId, type: selectedMode, content: result, original_url: url || null, 
        cost_credits: finalCost, platform: platform || 'general', tokens_used: tokensUsed, whisper_minutes: whisperMinutes
      });
    }

    // 12. RESPUESTA
    return new Response(
      JSON.stringify({ 
        success: true, generatedData: result, finalCost, 
        metadata: { mode: selectedMode, duration: Date.now() - startTime } 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error(`[ERROR CRÍTICO]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});