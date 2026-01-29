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

// 1️⃣ IDEAS RÁPIDAS
const PROMPT_IDEAS_RAPIDAS = (contexto: ContextoUsuario) => `ERES UN GENIO CREATIVO DE CONTENIDO VIRAL EN ESPAÑOL.
TU MISIÓN: Generar 10 ideas de video EXPLOSIVAS para el nicho del usuario en menos de 30 segundos.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Deseo: ${contexto.deseo_principal || 'N/A'}
- Hooks exitosos previos: ${contexto.hooks_exitosos?.join(', ') || 'N/A'}
- Patrones virales identificados: ${contexto.patrones_virales?.join(', ') || 'N/A'}

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${VIDEO_FORMATS_STR}
${ALGORITHM_SECRETS_STR}

PROTOCOLO DE GENERACIÓN:
1. Analiza el contexto completo del usuario
2. Aplica los 7 disparadores virales: Curiosidad, Miedo, Deseo, Urgencia, Identidad, Controversia, Transformación
3. Combina los patrones exitosos detectados por el sistema
4. Genera ideas que conecten con el dolor profundo del Avatar

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
    "idea_id": 3,
    "razon": "Explicación de por qué esta es la mejor opción ahora"
  }
}

⚠️ INSTRUCCIÓN CRÍTICA: Todas las ideas deben estar en ESPAÑOL NEUTRO y ser específicas para el nicho del usuario.`;

// 2️⃣ AUTOPSIA VIRAL - Ingeniería inversa de videos exitosos
const PROMPT_AUTOPSIA_VIRAL = (platform: string) => `ERES EL FORENSE DE VIRALIDAD #1 DEL MUNDO.
TU MISIÓN: Deconstruir videos virales hasta sus componentes atómicos y extraer el ADN replicable.

INSTRUCCIONES CRÍTICAS:
1. IGNORA el contenido superficial (de qué habla el video)
2. ENFÓCATE en la estructura (cómo está construido)
3. EXTRAE los mecanismos psicológicos (por qué funciona)
4. TRADUCE todo a fórmulas replicables

PLATAFORMA: ${platform}

PROTOCOLO DE SECUENCIACIÓN (6 CAPAS):

CAPA 1: ADN DEL GANCHO (0-3s)
- Tipo de disparador exacto: (Curiosidad/Miedo/Identidad/Shock/Patrón-Interrupción)
- Fórmula estructural: [ELEMENTO 1] + [ELEMENTO 2]
- Mecanismo psicológico activado: Por qué el cerebro no puede parar de ver
- Score de retención predicho: 0-100

CAPA 2: ARQUITECTURA DE RETENCIÓN (Toda la duración)
- Timeline de Micro-Hooks: Qué mantiene enganchado cada 5-7 segundos
- Brechas de información: Cuándo se abren preguntas y cuándo se cierran
- Curva de tensión emocional: Mapa de altos y bajos
- Puntos de posible abandono: Dónde la gente podría irse

CAPA 3: ESTRUCTURA NARRATIVA
- Framework identificado: (PAS / Héroe / Antes-Después / Problema-Solución / Mito vs Realidad)
- Desglose en actos: Inicio, desarrollo, clímax, resolución
- Por qué funciona esta estructura: Biología y psicología detrás

CAPA 4: ADN DE PRODUCCIÓN
- Ritmo de cortes: Cada cuántos segundos cambia la escena
- Movimiento de cámara: Estático/Dinámico/Combinado
- Uso de B-Roll: Cuándo y por qué
- Elementos visuales clave: Texto en pantalla, overlays, efectos

CAPA 5: SEÑALES ALGORÍTMICAS
- Táctica de watch time: Cómo maximiza el tiempo de visualización
- Hooks de engagement: Qué dispara comentarios/likes/shares
- SEO y discoverability: Keywords, hashtags, momento de publicación

CAPA 6: BLUEPRINT DE REPLICACIÓN
- Fórmula exacta extraída del video
- Cómo adaptar al nicho del usuario sin copiar
- Variaciones para testear
- Trampas que evitar

BIBLIOTECAS DE CONOCIMIENTO:
${MASTER_HOOKS_STR}
${WINNER_ROCKET_TIMELINE}
${ALGORITHM_SECRETS_STR}

FORMATO DE SALIDA JSON ESTRICTO:
{
  "score_viral": {
    "potencial_total": 9.2,
    "factores_exito": ["Factor 1", "Factor 2", "Factor 3"],
    "nivel_replicabilidad": "Alta/Media/Baja"
  },
  "adn_extraido": {
    "idea_ganadora": "La idea central en una frase potente",
    "disparador_psicologico": "El mecanismo mental principal",
    "estructura_exacta": "PAS / Héroe / Otra",
    "formula_gancho": "[ELEMENTO 1] + [ELEMENTO 2] = Ejemplo del video"
  },
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción de lo que sucede en pantalla",
      "porque_funciona": "Mecanismo psicológico activado",
      "replicar_como": "Cómo aplicarlo al nicho del usuario"
    }
  ],
  "patron_replicable": {
    "nombre_patron": "Nombre descriptivo del patrón",
    "formula": "PASO 1: X + PASO 2: Y + PASO 3: Z",
    "aplicacion_generica": "Cómo cualquiera puede usar esto"
  },
  "produccion_deconstruida": {
    "visuales_clave": ["Elemento visual 1", "Elemento visual 2"],
    "ritmo_cortes": "Cada X segundos",
    "movimiento_camara": "Descripción",
    "musica_sonido": "Tipo de audio usado",
    "texto_pantalla": "Cuándo y cómo se usa"
  },
  "insights_algoritmicos": {
    "optimizacion_retencion": "Qué hace para que no pares de ver",
    "triggers_engagement": "Qué dispara interacción",
    "seo_keywords": ["Keyword 1", "Keyword 2"]
  }
}

⚠️ REGLA CRÍTICA: No describas el video, DECONSTRUYE su arquitectura.`;

// 3️⃣ // ==================================================================================
// 🧠 3. GENERADOR DE GUIONES (MEGA PROMPT V300 - WINNER ROCKET & PSYCHOLOGY)
// ==================================================================================

const PROMPT_GENERADOR_GUIONES = (contexto: any, viralDNA: any, settings: any = {}) => {
  const dnaContext = viralDNA ? `\n\nADN VIRAL EXTRAÍDO:\n${JSON.stringify(viralDNA)}` : '';
  
  // 1. EXTRACCIÓN DE PARÁMETROS PSICOLÓGICOS
  const structureType = settings.structure || 'winner_rocket'; // Default a la nueva
  const awarenessLevel = settings.awareness || 'Consciente del Problema';
  const contentObjective = settings.objective || 'Educar';
  const avatarSituation = settings.situation || 'Dolor Agudo';

  // 📚 DICCIONARIO DE ARQUITECTURAS VIRALES (ACTUALIZADO)
  const ARCHITECTURES: Record<string, string> = {
    'winner_rocket': `
      1. HOOK PODEROSO (0-3s): Dispara curiosidad o usa una afirmación disruptiva. Debe detener el scroll inmediatamente.
      2. CONTEXTO (4-10s): Conecta con la realidad del espectador (empatía). Di: "Sé que te pasa esto...".
      3. CONFLICTO (11-20s): Revela un error, mito, bloqueo o dolor oculto que el avatar no ve.
      4. CURIOSITY LOOP (21-23s): Abre una incógnita antes del tip ("Y cuando descubrí esto..." o "Pero lo curioso es...").
      5. INSIGHT / VALOR (24-35s): Revela la enseñanza potente, el método o el cambio de mentalidad.
      6. RESOLUCIÓN (36-50s): Muestra el cambio logrado. Comparte una pequeña victoria. Inspira.
      7. CIERRE + CTA NATURAL (51-60s): Frase emocional que invite a seguirte desde el corazón, no desde la venta fría.`,

    'pas': `1. PROBLEMA (0-10s): Describe el dolor. 2. AGITACIÓN (11-30s): Consecuencias de no actuar. 3. SOLUCIÓN (31-60s): Tu método.`,
    'aida': `1. ATENCIÓN (0-3s). 2. INTERÉS (4-15s). 3. DESEO (16-45s). 4. ACCIÓN (46-60s).`,
    'bab': `1. ANTES (0-10s): Mundo con dolor. 2. DESPUÉS (11-30s): Mundo ideal. 3. PUENTE (31-60s): Cómo llegar ahí.`,
    'hso': `1. HOOK (0-3s). 2. STORY (4-40s): Anécdota personal. 3. OFFER (41-60s): Lección aprendida.`
  };

  const selectedStructure = ARCHITECTURES[structureType] || ARCHITECTURES['winner_rocket'];

  return `ERES EL MEJOR GUIONISTA DE CONTENIDO VIRAL Y ESTRATEGA PSICOLÓGICO DEL MUNDO.
TU MISIÓN: Escribir un guion COMPLETO, palabra por palabra, aplicando la arquitectura seleccionada y la psicología del avatar.

--- CONTEXTO DEL EXPERTO (USUARIO) ---
- Nicho: ${contexto.nicho || 'General'}
- Avatar Ideal: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'N/A'}
- Deseo Principal: ${contexto.deseo_principal || 'N/A'}
- Enemigo Común: ${contexto.enemigo_comun || 'N/A'}${dnaContext}

--- 🧠 CONFIGURACIÓN PSICOLÓGICA (CRÍTICO) ---
1. NIVEL DE CONCIENCIA: "${awarenessLevel}"
   - Si es "Totalmente Inconsciente": Usa historias y metáforas, no hables del problema directo aún.
   - Si es "Consciente del Problema": Agita el dolor y muestra empatía.
   - Si es "Consciente de la Solución": Muestra por qué tu método es único.
   
2. OBJETIVO DEL CONTENIDO: "${contentObjective}"
   - (Ej: Si es "Inspirar", usa tono emotivo. Si es "Persuadir", usa lógica y beneficios).

3. SITUACIÓN ACTUAL DEL AVATAR: "${avatarSituation}"
   - El guion debe atacar específicamente este punto (miedo, objeción o anhelo).

--- 🛠️ ARQUITECTURA SELECCIONADA: ${structureType.toUpperCase()} ---
Sigue ESTRICTAMENTE esta estructura de tiempos y contenido:
${selectedStructure}

--- REGLAS DE ORO DE ESCRITURA (WINNER ROCKET STYLE) ---
1. **LENGUAJE HUMANO:** Usa palabras emocionales, no técnicas. Habla de "tú a tú".
2. **CURIOSITY LOOPS:** Incluye al menos 2 momentos de curiosidad que se resuelvan después.
3. **NO RESUMAS:** Escribe EXACTAMENTE lo que la persona debe decir a la cámara.
4. **FORMATO TELEPROMPTER:** Texto fluido, sin [corchetes] en la parte hablada.

--- FORMATO DE SALIDA JSON OBLIGATORIO ---
{
  "metadata_guion": {
    "nicho": "${contexto.nicho}",
    "arquitectura": "${structureType}",
    "psicologia": {
      "nivel_conciencia": "${awarenessLevel}",
      "objetivo": "${contentObjective}"
    },
    "duracion_estimada": "60 segundos"
  },
  "ganchos_opcionales": [
    { "tipo": "Disruptivo", "texto": "Opción 1 (Directa al dolor)", "retencion_predicha": 95 },
    { "tipo": "Curiosidad", "texto": "Opción 2 (Misteriosa)", "retencion_predicha": 92 }
  ],
  "guion_completo": "ESCRIBE AQUÍ EL GUION ENTERO CON SALTOS DE LÍNEA.\n\n[0-3s] GANCHO: (Escribe la frase exacta)...\n\n[4-10s] CONTEXTO: ...\n\n[11-20s] CONFLICTO: ...\n\n[21-23s] CURIOSITY LOOP: ...\n\n[24-35s] INSIGHT: ...\n\n[36-50s] RESOLUCIÓN: ...\n\n[51-60s] CIERRE EMOCIONAL: ...",
  "plan_visual": [
    { "tiempo": "0-3s", "accion_en_pantalla": "Primer plano impactante", "instruccion_produccion": "Mirada directa a lente" },
    { "tiempo": "4-20s", "accion_en_pantalla": "Cambio de ángulo o B-Roll ilustrativo", "instruccion_produccion": "Plano medio" },
    { "tiempo": "21-End", "accion_en_pantalla": "Hablando a cámara con gestos naturales", "instruccion_produccion": "Cámara en mano suave" }
  ],
  "analisis_psicologico": {
    "gatillo_mental_usado": "Ej: Autoridad / Reciprocidad",
    "emocion_objetivo": "Ej: Alivio / Esperanza"
  }
}`;
};

// ⚡ EJECUTOR ACTUALIZADO (RECIBE SETTINGS COMPLETOS)
async function ejecutarGeneradorGuiones(
  contexto: any,
  viralDNA: any | null,
  openai: any,
  settings: any = {} 
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📝 Generando Guion Winner Rocket...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { 
        role: 'system', 
        content: 'Eres un guionista experto en psicología viral. REGLA SUPREMA: Escribe el guion COMPLETO palabra por palabra. Nunca resumas. Usa bucles de curiosidad.' 
      },
      { 
        // Pasamos "settings" al prompt para que lea la estructura y la psicología
        role: 'user', 
        content: PROMPT_GENERADOR_GUIONES(contexto, viralDNA, settings) 
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    data: JSON.parse(completion.choices[0].message.content || '{}'),
    tokens: completion.usage?.total_tokens || 0
  };
}

⚠️ REGLA DE ORO: El guion debe ser tan bueno que el usuario solo necesite leerlo en cámara para crear un video viral.`;
};

// 4️⃣ JUEZ VIRAL
const PROMPT_JUEZ_VIRAL = (contexto: ContextoUsuario, contenido: string) => `ERES EL ALGORITMO HUMANO MÁS PRECISO PARA PREDECIR VIRALIDAD.
TU MISIÓN: Evaluar guiones, ideas o videos ANTES de publicarlos y dar un veredicto científico.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor: ${contexto.dolor_principal || 'N/A'}
- Competencia analizada: ${contexto.competencia_analizada?.length || 0} competidores

CONTENIDO A EVALUAR:
${contenido}

MATRIZ DE EVALUACIÓN (10 CRITERIOS - Puntaje 0-10 cada uno):

1. GANCHO (0-3s) - ¿Rompe el scroll? ¿Dispara curiosidad? ¿Es específico?
2. RETENCIÓN (4-30s) - ¿Mantiene micro-ganchos? ¿Ritmo dinámico?
3. RESONANCIA EMOCIONAL - ¿Toca el dolor? ¿Arco emocional claro?
4. CLARIDAD DEL MENSAJE - ¿Se entiende en 5s? ¿Lenguaje del Avatar?
5. CALL TO ACTION - ¿CTA específico? ¿Genera urgencia?
6. PRODUCCIÓN - ¿Visuales potencian? ¿Ritmo adecuado?
7. ORIGINALIDAD - ¿Concepto fresco? ¿Se diferencia?
8. POTENCIAL DE COMPARTIR - ¿Útil/entretenido? ¿Genera conversación?
9. SEÑALES ALGORÍTMICAS - ¿Optimizado para retención? ¿Keywords?
10. TIMING Y CONTEXTO - ¿Relevante ahora? ¿Momento estratégico?

FORMATO DE SALIDA JSON ESTRICTO:
{
  "veredicto_final": {
    "score_total": 85,
    "clasificacion": "ALTO POTENCIAL / MEDIO / BAJO",
    "probabilidad_viral": "78%",
    "confianza_prediccion": "92%"
  },
  "evaluacion_criterios": [
    {
      "criterio": "Gancho",
      "score": 9,
      "analisis": "El gancho rompe el patrón porque...",
      "sugerencia": "Para mejorar, considera..."
    }
  ],
  "fortalezas_clave": [
    "Fortaleza 1 con explicación",
    "Fortaleza 2 con explicación"
  ],
  "debilidades_criticas": [
    {
      "problema": "Descripción del problema",
      "impacto": "Por qué esto reduce el potencial viral",
      "solucion": "Cómo arreglarlo específicamente"
    }
  ],
  "optimizaciones_rapidas": [
    "Cambio 1 que aumentaría el score en 5 puntos",
    "Cambio 2 que aumentaría el score en 3 puntos"
  ],
  "prediccion_metricas": {
    "vistas_estimadas": "10K - 50K",
    "engagement_rate": "6% - 10%",
    "tiempo_viralizacion": "24-48 horas / 3-7 días"
  },
  "decision_recomendada": "PUBLICAR / MEJORAR ANTES DE PUBLICAR / DESCARTAR"
}

⚠️ INSTRUCCIÓN CRÍTICA: Sé brutalmente honesto. Es mejor un 6/10 real que un 9/10 falso.`;

// 5️⃣ TRANSCRIPTOR
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

// 6️⃣ AUDITOR DE AVATAR
const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string) => `ERES UN PSICÓLOGO DE CONSUMIDOR Y ESTRATEGA DE AVATARES.
TU MISIÓN: Crear el perfil más completo del Cliente Ideal para que TODO el contenido hable directo a su cerebro.

INFORMACIÓN PROPORCIONADA:
Nicho: ${nicho}
Info del cliente: ${infoCliente}

PROTOCOLO DE AUDITORÍA (10 DIMENSIONES):

1. DEMOGRÁFICOS BÁSICOS - Edad, género, ubicación, ingresos
2. PSICOGRÁFICOS - Valores, creencias, identidad aspiracional
3. SITUACIÓN ACTUAL (Dolor) - Problema principal, síntomas, frustración
4. ESTADO DESEADO (Cielo) - Vida ideal si problema desaparece
5. OBJECIONES Y MIEDOS - Qué le detiene de tomar acción
6. LENGUAJE Y JERGA - Palabras exactas que usa el Avatar
7. PLATAFORMAS Y HÁBITOS - Dónde consume contenido, cuándo
8. PROCESO DE DECISIÓN - Cómo toma decisiones, qué necesita para confiar
9. NIVEL DE CONSCIENCIA - Unaware/Problem Aware/Solution Aware/Product Aware
10. CONTENIDO QUE ENGANCHA - Ganchos, ángulos, formato preferido

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_avatar": {
    "nombre_avatar": "Nombre descriptivo (Ej: 'María la Emprendedora Estancada')",
    "frase_identidad": "Una frase que capture la esencia",
    "arquetipo": "Tipo psicológico"
  },
  "perfil_completo": {
    "dolor_principal": {
      "problema": "No logra generar clientes consistentemente",
      "sintomas": ["Síntoma 1", "Síntoma 2"],
      "frustracion": "Ve a otros con menos experiencia teniendo más éxito"
    },
    "estado_deseado": {
      "vision": "Tener 3-5 clientes nuevos cada mes sin perseguirlos",
      "emocion_objetivo": "Confianza y tranquilidad"
    },
    "lenguaje": {
      "palabras_clave": ["Palabra 1", "Palabra 2"],
      "frases_resuenan": ["Frase 1", "Frase 2"],
      "evitar": ["Término confuso 1"],
      "tono_preferido": "Conversacional pero experto"
    },
    "tipo_contenido_efectivo": {
      "ganchos": ["Tipo gancho 1", "Tipo gancho 2"],
      "formato": "Videos de 60-90s en vertical",
      "tono": "Directa y empoderadora"
    }
  },
  "insights_estrategicos": [
    {
      "insight": "Este Avatar valora SIMPLIFICACIÓN sobre información",
      "aplicacion": "Tu contenido debe ser 'Esto es TODO lo que necesitas'"
    }
  ]
}

⚠️ REGLA DE ORO: Un Avatar bien definido hace que TODO el contenido sea 10x más efectivo.`;

// 7️⃣ AUDITOR DE EXPERTO
const PROMPT_AUDITOR_EXPERTO = (contexto: ContextoUsuario) => `ERES UN ANALISTA COMPETITIVO Y ESTRATEGA DE POSICIONAMIENTO.
TU MISIÓN: Analizar el perfil del usuario, su competencia y el mercado para encontrar su ÁNGULO ÚNICO.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}

PROTOCOLO DE AUDITORÍA (7 FASES):

1. MAPEO DE COMPETENCIA - Identificar top 10-20 players, categorizar por tamaño
2. ANÁLISIS DE BRECHAS - Qué hace TODO el mundo / Qué NO hace NADIE
3. DIFERENCIACIÓN - Fortalezas únicas del usuario
4. POSICIONAMIENTO - Crear declaración única
5. ESTRATEGIA DE CONTENIDO - Pilares (3-5 temas principales)
6. MATRIZ DE OPORTUNIDADES - Qué crear AHORA
7. SISTEMA DE MONITOREO - KPIs a trackear

FORMATO DE SALIDA JSON ESTRICTO:
{
  "resumen_ejecutivo": {
    "estado_mercado": "Saturado/En Crecimiento/Naciente",
    "nivel_competencia": "Alta/Media/Baja",
    "oportunidad_principal": "Descripción de la oportunidad detectada"
  },
  "analisis_brechas": {
    "todos_hacen": ["Cosa 1", "Cosa 2"],
    "nadie_hace": ["Oportunidad 1 - ANGLE VIRGEN"],
    "hacen_mal": ["Error común que comete la mayoría"]
  },
  "posicionamiento_estrategico": {
    "declaracion_posicionamiento": "Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN] a través de [MÉTODO ÚNICO]",
    "enemigo_comun": "Qué rechaza el usuario",
    "bandera": "Por qué lucha el usuario",
    "propuesta_valor": "Una frase que capture el ÚNICO valor"
  },
  "estrategia_contenido": {
    "pilares_contenido": [
      {
        "pilar": "Pilar 1: Ej: Estrategia de Contenido",
        "objetivo": "Educar/Posicionar/Convertir",
        "frecuencia": "2-3 veces/semana",
        "angulos": ["Ángulo 1", "Ángulo 2"]
      }
    ],
    "mix_contenido": {
      "educativo": "60%",
      "entretenimiento": "20%",
      "ventas": "10%"
    }
  },
  "plan_90_dias": {
    "mes_1": {
      "objetivo": "Establecer posicionamiento y voz",
      "acciones": ["Acción 1", "Acción 2"],
      "meta_numerica": "1,000 seguidores nuevos"
    }
  }
}

⚠️ OBJETIVO: El usuario debe saber QUIÉN es en su mercado y CÓMO destacar.`;

// 8️⃣ MENTOR ESTRATÉGICO
const PROMPT_MENTOR_ESTRATEGICO = (contexto: ContextoUsuario, resultados?: any) => {
  const resultadosStr = resultados ? `\n\nRESULTADOS RECIENTES:\n${JSON.stringify(resultados)}` : '';
  
  return `ERES UN MENTOR DE ÉLITE Y ESTRATEGA DE CRECIMIENTO.
TU MISIÓN: Sintetizar todos los datos, guiar con visión a largo plazo, y optimizar continuamente.

CONTEXTO DEL USUARIO:
- Nicho: ${contexto.nicho || 'General'}
- Avatar: ${contexto.avatar_ideal || 'N/A'}
- Posicionamiento: ${contexto.posicionamiento || 'N/A'}${resultadosStr}

PROTOCOLO DE MENTORÍA (5 NIVELES):

1. DIAGNÓSTICO INTEGRAL - Revisar todos los datos, identificar patrones
2. ESTRATEGIA ADAPTATIVA - Proponer pivotes o escalamiento
3. OPTIMIZACIÓN CONTINUA - Recomendar mejoras de alto impacto
4. VISIÓN A LARGO PLAZO - Crear roadmap 6-12 meses
5. COACHING PERSONALIZADO - Feedback honesto y constructivo

FORMATO DE SALIDA JSON ESTRICTO:
{
  "diagnostico_actual": {
    "estado_general": "En camino / Necesita ajustes / Excelente",
    "score_ejecucion": 7.5,
    "areas_fuertes": [
      {
        "area": "Calidad de guiones",
        "evidencia": "Los últimos 3 guiones tienen score 8+"
      }
    ],
    "areas_debiles": [
      {
        "area": "Consistencia de publicación",
        "impacto": "Afecta visibilidad algorítmica",
        "prioridad": "Alta"
      }
    ]
  },
  "estrategia_optimizada": {
    "ajustes_inmediatos": [
      {
        "area": "Ganchos",
        "cambio": "Implementar patrón X",
        "impacto_esperado": "Alto"
      }
    ],
    "experimentos_propuestos": [
      {
        "experimento": "Testear storytelling personal",
        "hipotesis": "Mayor conexión = Mayor seguimiento",
        "metricas_evaluar": ["Engagement rate", "Shares"]
      }
    ]
  },
  "roadmap_6_meses": {
    "mes_1_2": {
      "objetivo_principal": "Validar formato",
      "acciones_clave": ["Acción 1", "Acción 2"],
      "meta_numerica": "1,000 seguidores"
    }
  },
  "sesion_coaching": {
    "reflexion": "¿Qué te está deteniendo?",
    "feedback_honesto": "Observación directa",
    "motivacion": "Mensaje inspirador"
  }
}

⚠️ ROL: GUIAR con visión, EMPODERAR con confianza, OPTIMIZAR con datos.`;
};

// 9️⃣ INGENIERÍA INVERSA
const PROMPT_INGENIERIA_INVERSA = (contexto: ContextoUsuario, numVideos: number) => `ERES UN CIENTÍFICO DE DATOS DE CONTENIDO VIRAL.
TU MISIÓN: Analizar múltiples videos virales y extraer PATRONES UNIVERSALES replicables.

CONTEXTO:
- Nicho: ${contexto.nicho || 'General'}
- Videos a analizar: ${numVideos}

DIFERENCIA CON AUTOPSIA:
- Autopsia: 1 video → ADN completo
- Ingeniería Inversa: ${numVideos}+ videos → Patrones comunes → Meta-fórmula

PROTOCOLO:

FASE 1: IDENTIFICACIÓN - Buscar elementos repetidos en 60%+ videos
FASE 2: CUANTIFICACIÓN - Asignar score de frecuencia y correlación con éxito
FASE 3: META-FÓRMULA - Combinar mejores patrones
FASE 4: APLICACIÓN - Traducir al nicho del usuario

FORMATO DE SALIDA JSON ESTRICTO:
{
  "metadata_analisis": {
    "videos_analizados": ${numVideos},
    "nicho_estudiado": "${contexto.nicho || 'General'}",
    "periodo_analisis": "Últimos 3 meses"
  },
  "patrones_universales": [
    {
      "patron_id": "P1",
      "nombre": "Gancho de Pregunta Shock",
      "categoria": "Hook",
      "frecuencia": "87%",
      "descripcion": "Descripción detallada",
      "mecanismo_psicologico": "Por qué funciona",
      "score_efectividad": 9.2,
      "cuando_usar": "Primera opción para contenido educativo"
    }
  ],
  "meta_formula": {
    "nombre": "Fórmula Viral Universal del Nicho",
    "componentes": [
      "GANCHO: Patrón P1",
      "DESARROLLO: Patrón P2",
      "CIERRE: Patrón P3"
    ],
    "duracion_ideal": "60-90 segundos"
  },
  "aplicacion_al_usuario": {
    "patrones_prioritarios": ["P1", "P2", "P3"],
    "razon_seleccion": "Por qué estos patrones son perfectos",
    "ejemplos_aplicados": [
      "Idea 1 usando meta-fórmula",
      "Idea 2 usando variación"
    ]
  }
}

⚠️ OBJETIVO: Sistema probado de creación viral, no solo ideas sueltas.`;

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
  console.log('[CEREBRO] 📝 Ejecutando Generador de Guiones (Modo Estricto)...');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { 
        role: 'system', 
        // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE: Le ordenamos escribir todo
        content: 'Eres un guionista experto. TU REGLA #1: Escribir el guion COMPLETO palabra por palabra. Nunca uses resúmenes. El campo "guion_completo" debe tener todo el texto hablado.' 
      },
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
  // B. GUIONES DE TEXTO (CORREGIDO Y BLINDADO)
  if (mode === 'generar_guion') {
    
    // 1. LEER LA DURACIÓN (Blindaje: lee 'duration' O 'durationId')
    const durationSetting = settings?.duration || settings?.durationId || '';
    
    // 2. DETECTAR MASTERCLASS (Por setting o por texto)
    const isMasterclass = 
        durationSetting === 'masterclass' || 
        durationSetting === 'long' || 
        inputContext.toLowerCase().includes("masterclass") || 
        inputContext.toLowerCase().includes("30 minutos");

    // 3. APLICAR PRECIOS EXACTOS
    if (isMasterclass) return 32; // Antes cobraba 30, ahora 32 exactos
    return 5; // Antes cobraba 1, ahora 5 exactos (tarifa base)
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
        // Pasamos 'settings' (que contiene structure, awareness, objective, situation)
        const res = await ejecutarGeneradorGuiones(userContext, null, openai, settings);
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