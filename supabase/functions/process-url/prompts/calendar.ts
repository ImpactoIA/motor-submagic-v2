// ====================================================================================
// 📅 prompts/calendar.ts
// PROMPT_CALENDARIO_GOD_MODE  →  usado por ejecutarCalendario
// ejecutarCalendario          →  handler llama: await ejecutarCalendario(...)
// ====================================================================================

import { ContextoUsuario } from '../lib/types.ts';

// ── PROMPT_CALENDARIO_GOD_MODE ───────────────────────────────────
const PROMPT_CALENDARIO_GOD_MODE = (settings: any, contexto: ContextoUsuario) => {
  const dias = settings.duration || 7;
  const enfoque = settings.focus || 'Viralidad';
  const plataforma = settings.platform || 'TikTok';
  const tema = settings.topic || contexto.nicho;
  const ep = (contexto as any).expertProfile;

  // Leer config de red si existe
  let netOverride = '';
  if (ep?.network_config) {
    try {
      const nc = typeof ep.network_config === 'string' ? JSON.parse(ep.network_config) : ep.network_config;
      const cfg = nc[plataforma.toLowerCase()];
      if (cfg && Object.values(cfg).some((v: any) => v !== 'auto')) {
        netOverride = `
OVERRIDE DE RED PARA ${plataforma.toUpperCase()}:
${cfg.tone !== 'auto' ? `- Tono: ${cfg.tone}` : ''}
${cfg.depth !== 'auto' ? `- Profundidad: ${cfg.depth}` : ''}
${cfg.close_type !== 'auto' ? `- Tipo de cierre: ${cfg.close_type}` : ''}`;
      }
    } catch {}
  }

  return `ACTÚA COMO: Estratega de contenido OLIMPO para ${plataforma}.

OBJETIVO: Calendario estratégico de ${dias} días alineado al perfil del experto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXTO DEL CREADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Nicho: ${contexto.nicho}
- Avatar: ${contexto.avatar_ideal}
- Tema Principal: "${tema}"
- Enfoque del Calendario: ${enfoque}
${ep ? `
- Nivel de Autoridad: ${ep.authority_level || 'practicante'}
- Objetivo Principal de Contenido: ${ep.main_objective || 'autoridad'}
- Tipo de Autoridad: ${ep.authority_type || 'practica'}
- Confrontación Permitida: ${ep.confrontation_level || 3}/5
- Polarización Permitida: ${ep.polarization_level || 2}/5
${ep.mechanism_name ? `- Mecanismo Propietario: "${ep.mechanism_name}"` : ''}
${ep.point_a ? `- Punto A del Avatar: "${ep.point_a}"` : ''}
${ep.point_b ? `- Punto B (destino): "${ep.point_b}"` : ''}
${ep.enemy ? `- Enemigo Común: "${ep.enemy}"` : ''}
${ep.mental_territory ? `- Territorio Mental™: "${ep.mental_territory}"` : ''}
` : ''}
${netOverride}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS DEL CALENDARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cada día debe tener un objetivo distinto (autoridad, viralidad, leads, comunidad, ventas).
2. El objetivo de cada día debe alinearse con el objetivo principal del experto: "${ep?.main_objective || enfoque}".
3. Los ganchos deben respetar el nivel de confrontación del experto.
4. Si existe mecanismo propietario, al menos 1 de cada 3 días debe reforzarlo.
5. El tipo de cierre de cada pieza debe variar para no saturar.

FORMATO JSON — responde SOLO con este JSON, sin markdown:
{
  "calendar": [
    {
      "dia": 1,
      "tema": "TÍTULO ATRACTIVO",
      "objetivo": "autoridad | viralidad | leads | comunidad | ventas",
      "gancho_sugerido": "Primera frase impactante...",
      "disparador": "Curiosidad | Miedo | Esperanza | Indignación | Sorpresa",
      "tipo_cierre": "pregunta | cta_link | reflexion | oferta | autoridad",
      "refuerza_mecanismo": true
    }
  ]
}`;
};

// ==================================================================================
// 📝 PROMPT COPY EXPERT V400 - TRADUCTOR COGNITIVO MULTIPLATAFORMA
// ==================================================================================
// ✅ Adaptación estratégica por RED SOCIAL + FORMATO
// ✅ Sistema de validación interna (6 checks)
// ✅ Sugerencias inteligentes automáticas
// ✅ Coherencia con Avatar, Experto y Base de Conocimiento
// ✅ Compatible con inputs: Texto / Video Transcrito / URL
// ==================================================================================

interface CopyExpertSettings {
  red_social: string;        // TikTok, Instagram, YouTube, LinkedIn, Facebook, X
  formato: string;            // Video, Post, Carrusel, Hilo
  objetivo: string;           // Educar, Inspirar, Persuadir, Entretener, Romper Objeciones
  tipo_contenido?: string;    // Guion de video, Caption, Idea, Borrador
}

// ==================================================================================
// 🧬 MATRIZ DE ADAPTACIÓN POR PLATAFORMA (DNA NATIVO)
// ==================================================================================

const PLATFORM_PSYCHOLOGY: Record<string, any> = {
  'TikTok': {
    comportamiento: 'Exploración caótica - Scroll frenético',
    por_que_consume: 'Entretenimiento / Aprendizaje rápido / Identificación',
    que_lo_detiene: 'Shock / Curiosidad extrema / Humor inesperado',
    lenguaje: 'Crudo, directo, sin filtros, slang de internet',
    tono: 'Auténtico, sin pulir, como habla un amigo',
    estructura_caption: 'Hook (1 línea) + Intriga (2-3 líneas) + CTA implícito',
    cta_esperado: 'Comentar / Compartir / Guardar',
    longitud_ideal: '50-150 caracteres (caption minimalista)',
    prohibiciones: ['Presentaciones formales', 'Lenguaje corporativo', 'CTAs de venta directa'],
    ejemplos: [
      'Esto te está haciendo invisible en [nicho] y nadie te lo dice 👀',
      'Si haces esto en [tema], nunca vas a crecer (guardalo)',
      'POV: Descubriste el secreto que [avatar] necesita'
    ]
  },
  
  'Instagram': {
    comportamiento: 'Identidad / Estatus / Aspiración',
    por_que_consume: 'Inspiración / Pertenencia / Descubrimiento',
    que_lo_detiene: 'Estética + Empatía + Frases compartibles',
    lenguaje: 'Aspiracional, elegante, emocional pero accesible',
    tono: 'Humano, cercano, cálido, con propósito',
    estructura_caption: 'Hook emocional + Historia/Contexto + Insight + CTA suave',
    cta_esperado: 'Guardar / Compartir / Enviar a alguien',
    longitud_ideal: '150-300 caracteres (caption medio)',
    prohibiciones: ['Agresividad', 'Clickbait burdo', 'Venta descarada'],
    ejemplos: [
      'La diferencia entre [A] y [B] no es el talento. Es esto ↓',
      'Si supieras esto sobre [tema] hace 5 años, hoy serías otra persona.',
      'Para los que entienden que [nicho] no es suerte, sino estrategia.'
    ]
  },
  
  'Facebook': {
    comportamiento: 'Comunidad / Conversación / Comprensión',
    por_que_consume: 'Conexión / Aprender / Debate',
    que_lo_detiene: 'Historias humanas + Preguntas + Opiniones',
    lenguaje: 'Conversacional, explicativo, como hablar con un vecino',
    tono: 'Cálido, comprensivo, sin pretensiones',
    estructura_caption: 'Historia/Pregunta + Desarrollo + Reflexión + Invitación',
    cta_esperado: 'Comentar opiniones / Etiquetar amigos / Compartir',
    longitud_ideal: '200-400 caracteres (caption largo permitido)',
    prohibiciones: ['Lenguaje frío', 'Tecnicismos sin explicar', 'Venta agresiva'],
    ejemplos: [
      'Hace unos años me preguntaba por qué [dolor]. Hoy entiendo que...',
      '¿Alguna vez te pasó que [situación]? Te cuento qué aprendí.',
      'Esto es para los que [descripción avatar]. Si te identificas, lee.'
    ]
  },
  
  'YouTube': {
    comportamiento: 'Intención clara / Profundidad / Valor',
    por_que_consume: 'Aprender algo específico / Tutorial / Entretenimiento largo',
    que_lo_detiene: 'Promesa cumplida + Claridad + Profundidad real',
    lenguaje: 'Claro, estructurado, profesional pero accesible',
    tono: 'Educativo, seguro, sin humo',
    estructura_caption: 'Promesa clara + Qué aprenderán + Contexto + Timestamps + CTA',
    cta_esperado: 'Suscribirse / Ver video completo / Comentar dudas',
    longitud_ideal: '300-500 caracteres (descripción completa)',
    prohibiciones: ['Clickbait sin entrega', 'Promesas exageradas', 'Falta de estructura'],
    ejemplos: [
      'En este video descubrirás exactamente cómo [resultado] en [tiempo]. Sin humo.',
      'Los 3 pasos que nadie te enseña sobre [tema]. Con ejemplos reales.',
      'Si quieres dominar [nicho], este es el método que funciona. Timestamps ↓'
    ]
  },
  
  'LinkedIn': {
    comportamiento: 'Autoridad / Networking / Crecimiento profesional',
    por_que_consume: 'Insights de negocio / Lecciones / Conexiones',
    que_lo_detiene: 'Ideas inteligentes + Experiencia + Pensamiento original',
    lenguaje: 'Profesional, preciso, ejecutivo pero humano',
    tono: 'Seguro, reflexivo, sin exageración emocional',
    estructura_caption: 'Afirmación fuerte + Contexto profesional + Insight + Reflexión',
    cta_esperado: 'Comentar opinión / Conectar / Repostear',
    longitud_ideal: '200-400 caracteres (post medio-largo)',
    prohibiciones: ['Lenguaje coloquial', 'Humor forzado', 'Clickbait emocional'],
    ejemplos: [
      'Después de 10 años en [industria], descubrí que [insight contraintuitivo].',
      'El 95% de [profesión] ignora esto: [verdad incómoda].',
      'Trabajé con 200+ empresas en [nicho]. Este es el patrón que siempre veo.'
    ]
  },
  
  'X': {
    comportamiento: 'Opinión / Debate / Actualidad',
    por_que_consume: 'Noticias / Hot takes / Comunidad',
    que_lo_detiene: 'Opiniones afiladas + Controversia + Humor inteligente',
    lenguaje: 'Directo, afilado, sin rodeos',
    tono: 'Seguro, a veces irónico, siempre claro',
    estructura_caption: 'Afirmación polémica + Razón/Dato + (Opcional) Thread',
    cta_esperado: 'Debate / RT con opinión / Quote tweet',
    longitud_ideal: '100-280 caracteres (tweet completo)',
    prohibiciones: ['Vaguedad', 'Neutralidad excesiva', 'Falta de postura'],
    ejemplos: [
      'Hot take: [opinión controversial] y aquí está por qué →',
      'Todos hablan de [tema], pero nadie menciona [verdad incómoda].',
      'Si aún crees que [creencia común], te estás saboteando. Thread:'
    ]
  }
};

// ==================================================================================
// 📋 MATRIZ DE FORMATOS (ESTRUCTURA ESPECÍFICA)
// ==================================================================================

const FORMAT_STRUCTURES: Record<string, any> = {
  'Video': {
    funcion_copy: 'Reforzar el hook hablado sin repetirlo',
    estructura: 'Hook textual (1 línea) + Promesa/Intriga (2-3 líneas) + CTA visual',
    reglas: [
      'NO repetir exactamente lo que se dice en el video',
      'Complementar, no competir con el audio',
      'Agregar contexto o curiosidad adicional',
      'Hook textual debe funcionar SIN sonido'
    ],
    ejemplo: 'Video: "Hoy te enseño X" → Caption: "El método que cambió mi [resultado] ↓"'
  },
  
  'Post': {
    funcion_copy: 'El texto ES el contenido principal',
    estructura: 'Hook completo + Desarrollo narrativo + Insight/Lección + CTA',
    reglas: [
      'Debe funcionar como pieza standalone',
      'Narrativa propia y completa',
      'Saltos de línea estratégicos para lectura',
      'Puede ser largo si aporta valor'
    ],
    ejemplo: 'Historia completa con inicio, desarrollo, lección y llamado a la acción'
  },
  
  'Carrusel': {
    funcion_copy: 'Introducir la historia SIN spoilear',
    estructura: 'Hook curiosidad + "Desliza para ver..." + CTA al final',
    reglas: [
      'NO revelar el contenido de los slides',
      'Generar curiosidad para deslizar',
      'Caption corto (el contenido está en slides)',
      'CTA al final para engagement'
    ],
    ejemplo: 'Los 5 errores que [avatar] comete en [tema]. Desliza para descubrirlos ↓'
  },
  
  'Hilo': {
    funcion_copy: 'Progresión lógica con micro-loops',
    estructura: 'Tweet inicial (gancho) + Tweets desarrollo + Cierre fuerte',
    reglas: [
      'Cada tweet debe funcionar solo pero conectar con el siguiente',
      'Micro-loops: "Pero espera, hay más..."',
      'Numeración clara (1/10, 2/10...)',
      'Cierre con CTA o reflexión poderosa'
    ],
    ejemplo: '1/ El secreto de [tema] que nadie te dice:\n\n2/ Primero, entiende esto...'
  }
};

// ==================================================================================
// 🎯 PROMPT MAESTRO V400
// ==================================================================================


// ── ejecutarCalendario ───────────────────────────────────────────
async function ejecutarCalendario(
  settings: any,
  contexto: ContextoUsuario,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📅 Generando Calendario...');
  
  const systemPrompt = PROMPT_CALENDARIO_GOD_MODE(settings, contexto);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el Estratega #1. Responde SOLO con JSON.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  const rawContent = completion.choices[0].message.content || '{"calendar":[]}';
  const parsedData = JSON.parse(rawContent);

  const finalData = {
      calendar: parsedData.calendar || parsedData.calendario || []
  };

  return {
    data: finalData,
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// 🧠 SCRAPER DE COMENTARIOS — INTELIGENCIA DE MERCADO AVATAR V2
// ==================================================================================

async function scrapeYouTubeComments(url: string): Promise<{
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
      console.warn('[COMMENTS] ⚠️ Sin resultados de Apify');
      return { comments: [], videoTitle: '', description: '' };
    }

    const video = items[0];
    const rawComments: any[] = video.comments || [];

    const comments = rawComments
      .filter((c: any) => c.text && c.text.trim().length > 10)
      .map((c: any) => ({
        text: c.text?.trim() || '',
        likes: c.likes || 0
      }))
      .sort((a: any, b: any) => b.likes - a.likes)
      .slice(0, 80);

    console.log(`[COMMENTS] ✅ ${comments.length} comentarios útiles extraídos`);

    return {
      comments,
      videoTitle: video.title || '',
      description: video.description || ''
    };

  } catch (error: any) {
    console.error('[COMMENTS] ❌ Error Apify:', error.message);
    return { comments: [], videoTitle: '', description: '' };
  }
}

// ==================================================================================
// 🎬 FUNCIONES DE SCRAPING Y WHISPER (100% PRESERVADAS)
// ==================================================================================

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  const timeout = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timeout]);
}
  function detectPlatform(url: string): string {
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/shorts')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com') || url.includes('facebook.com/reel')) return 'facebook';
  return 'unknown';
}

// ✅ TIKTOK SCRAPER V2
async function scrapeTikTok(url: string): Promise<{ 
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
    const run = runResult;
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      console.warn('[SCRAPER] ⚠️ TikTok no devolvió items');
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
    }
    const v = items[0] as any;
    const bestVideoUrl = v.videoUrlNoWatermark || v.videoUrl || v.downloadAddr || '';
    console.log('[SCRAPER] ✅ TikTok obtenido:', {
      hasVideoUrl: !!(bestVideoUrl && bestVideoUrl !== url),
      duration: v.videoMeta?.duration || v.duration || 0,
      hasSubtitles: !!(v.subtitles || v.subtitleText),
    });
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
    console.log(`[SCRAPER] 📝 Transcript TikTok (${transcriptFinal.length} chars): ${transcriptFinal.substring(0, 100)}`);
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

// ✅ INSTAGRAM SCRAPER V2
async function scrapeInstagram(url: string): Promise<{ 
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
      console.warn('[SCRAPER] ⚠️ Instagram no devolvió items');
      return { videoUrl: url, description: '', duration: 0 };
    }
    const v = items[0] as any;
    const bestVideoUrl = v.videoUrl || v.videoPlaybackUrl || v.displayUrl || '';
    const transcript = v.caption || v.accessibility_caption || v.text || '';
    console.log('[SCRAPER] ✅ Instagram obtenido:', {
      hasVideoUrl: !!(bestVideoUrl && bestVideoUrl !== url),
      transcriptLen: transcript.length,
    });
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

// ✅ YOUTUBE SCRAPER V2
async function scrapeYouTube(url: string): Promise<{ 
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
      console.warn('[SCRAPER] ⚠️ YouTube streamers falló, probando bernardo...');
      const run2 = await client.actor('bernardo/youtube-scraper').call({
        startUrls: [{ url }],
        maxResults: 1,
      }, { waitSecs: 60 });
      const { items: items2 } = await client.dataset(run2.defaultDatasetId).listItems();
      if (!items2 || items2.length === 0) {
        return { videoUrl: url, description: '', transcript: '', duration: 0 };
      }
      const v2 = items2[0] as any;
      return { videoUrl: url, description: v2.description || '', transcript: v2.subtitles || v2.subtitleText || v2.captions || v2.description || '', duration: v2.lengthSeconds || 0 };
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
    console.log('[SCRAPER] ✅ YouTube obtenido, transcript:', transcript.length, 'chars');
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

async function transcribeVideoWithWhisper(videoUrl: string, openai: any): Promise<{ 
    transcript: string; 
    duration: number 
}> {
  console.log('[WHISPER] 🎤 Descargando audio...');

  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error('No se pudo descargar el video');
  }

  const videoBlob = await videoResponse.blob();
  const videoBuffer = await videoBlob.arrayBuffer();
  
  const sizeMB = videoBuffer.byteLength / 1024 / 1024;
  console.log('[WHISPER] 📊 Video descargado:', {
    size: `${sizeMB.toFixed(2)} MB`,
    type: videoBlob.type
  });

  // Whisper tiene límite de 25MB — rechazar antes de que falle
  if (sizeMB > 24) {
    throw new Error(`Video demasiado grande para Whisper: ${sizeMB.toFixed(1)}MB (máximo 24MB)`);
  }

  const videoFile = new File([videoBuffer], 'video.mp4', { type: 'video/mp4' });

  console.log('[WHISPER] 🎙️ Enviando a Whisper...');

  const transcription = await openai.audio.transcriptions.create({
    file: videoFile,
    model: 'whisper-1',
    // ✅ Sin 'language': Whisper autodetecta inglés, portugués, español, etc.
    response_format: 'verbose_json'
  });

  console.log('[WHISPER] ✅ Transcripción completada');

  return {
  transcript: transcription.text,
  duration: transcription.duration || 0,
  language: transcription.language || 'auto',
  };
}

async function scrapeAndTranscribeVideo(
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
      case 'tiktok':
        videoData = await scrapeTikTok(url);
        break;
      case 'instagram':
        videoData = await scrapeInstagram(url);
        break;
      case 'youtube':
        videoData = await scrapeYouTube(url);
        break;
        case 'facebook':
        videoData = await scrapeFacebook(url);
        break;
      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }

    console.log('[SCRAPER] ✅ Scraping completado');

    const transcriptLen = videoData.transcript?.length || 0;
    const hasRealVideoUrl = videoData.videoUrl && videoData.videoUrl !== url && videoData.videoUrl.startsWith('http');

    if (transcriptLen > 300) {
      console.log(`[SCRAPER] ✅ Transcript rico (${transcriptLen} chars) — usando directo`);
      return {
        transcript: videoData.transcript!,
        description: videoData.description,
        duration: (videoData as any).duration || 0,
        platform,
        videoUrl: videoData.videoUrl,
        detectedLanguage: (videoData as any).detectedLanguage || 'auto',
        likes:    (videoData as any).likes    || 0,
        views:    (videoData as any).views    || 0,
        comments: (videoData as any).comments || 0,
        shares:   (videoData as any).shares   || 0,
        author:   (videoData as any).author   || '',
      };
    }

    if (hasRealVideoUrl) {
      console.log(`[SCRAPER] 🎤 Transcript corto (${transcriptLen} chars) — activando Whisper`);
      try {
        const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl!, openai);
        if (whisperResult.transcript && whisperResult.transcript.length > transcriptLen) {
          console.log(`[SCRAPER] ✅ Whisper exitoso: ${whisperResult.transcript.length} chars`);
          return {
            transcript: whisperResult.transcript,
            description: videoData.description,
            duration: whisperResult.duration,
            platform,
            videoUrl: videoData.videoUrl,
            detectedLanguage: (whisperResult as any).language || 'auto',
            likes:    (videoData as any).likes    || 0,
            views:    (videoData as any).views    || 0,
            comments: (videoData as any).comments || 0,
            shares:   (videoData as any).shares   || 0,
            author:   (videoData as any).author   || '',
          };
        }
      } catch (whisperErr: any) {
        console.warn('[SCRAPER] ⚠️ Whisper falló:', whisperErr.message);
      }
    }

    const fallbackContent = videoData.transcript || videoData.description || '';
    if (fallbackContent.length > 20) {
      console.log(`[SCRAPER] ℹ️ Usando contenido disponible (${fallbackContent.length} chars)`);
      return {
        transcript: fallbackContent,
        description: videoData.description,
        duration: (videoData as any).duration || 0,
        platform,
        videoUrl: videoData.videoUrl || '',
        likes:    (videoData as any).likes    || 0,
        views:    (videoData as any).views    || 0,
        comments: (videoData as any).comments || 0,
        shares:   (videoData as any).shares   || 0,
        author:   (videoData as any).author   || '',
      };
    }

    console.warn('[SCRAPER] ⚠️ Sin contenido — usando URL como contexto');
    return {
      transcript: `Video de ${platform}: ${url}. Analiza basándote en el nicho del usuario.`,
      description: url,
      duration: 0,
      platform,
      videoUrl: url
    };

    console.log('[SCRAPER] 🎤 Transcribiendo con Whisper...');
    const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl!, openai);

    return {
  transcript: whisperResult.transcript,
  description: videoData.description,
  duration: whisperResult.duration,
  platform,
  videoUrl: videoData.videoUrl,
  detectedLanguage: (whisperResult as any).language || 'auto'
};
   

  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error:', error.message);
    
    if (videoData.description && videoData.description.length > 50) {
      console.log('[SCRAPER] ⚠️ Usando solo descripción como fallback');
      return {
        transcript: videoData.description,
        description: videoData.description,
        duration: 0,
        platform
      };
    }
    
    throw error;
  }
}

async function processUploadedVideo(
  fileBase64: string,
  fileName: string,
  openai: any
): Promise<{ 
  transcript: string; 
  duration: number; 
  fileType: string;
}> {
  console.log('[UPLOAD] 📁 Procesando video subido:', fileName);

  try {
    const base64Data = fileBase64.split(',')[1] || fileBase64;
    const videoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    console.log('[UPLOAD] 📊 Video cargado:', {
      size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      fileName
    });

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
      // Sin language: autodetecta español, inglés, portugués, francés
      response_format: 'verbose_json'
    });

    console.log('[UPLOAD] ✅ Transcripción completada');

    return {
      transcript: transcription.text,
      duration: transcription.duration || 0,
      fileType: fileExtension
    };

  } catch (error: any) {
    console.error('[UPLOAD] ❌ Error:', error.message);
    throw new Error(`Error al procesar video subido: ${error.message}`);
  }
}

async function getVideoContent(
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
    
    // ✅ Video subido: no hay engagement disponible — flujo protegido
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
      likes:    (result as any).likes    || 0,
      views:    (result as any).views    || 0,
      comments: (result as any).comments || 0,
      shares:   (result as any).shares   || 0,
      author:   (result as any).author   || '',
    };
  }
  
  throw new Error('Debes proporcionar una URL o subir un video');
}


export {
  PROMPT_CALENDARIO_GOD_MODE,
  ejecutarCalendario,
};