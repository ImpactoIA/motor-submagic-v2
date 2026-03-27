// ====================================================================================
// 💎 prompts/ingenieria-inversa.ts
// FUNCIÓN: Analiza un video Y genera un guion nuevo adaptado al nicho del experto
// MODO:    recreate
// MOTOR:   SNIPER ENTERPRISE v2 — 7 bloques, hook emocional preservado, score real
// ====================================================================================

import { delay } from '../lib/security.ts';
import { ejecutarAutopsiaViral } from './autopsia-viral.ts';

// ── PROMPT SNIPER ENTERPRISE v2 ───────────────────────────────────
const PROMPT_INGENIERIA_INVERSA_PRO = (
  transcripcion: string,
  transcripcionFiel: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any,
  contexto?: any,
) => `Eres TITAN SNIPER ENTERPRISE v2 — sistema de clonación viral de precisión quirúrgica.
Tu misión: clonar el ADN emocional del video original y trasplantarlo al nicho del usuario SIN perder la crudeza, el riesgo narrativo ni la intensidad del hook original.

REGLA DE ORO — OBLIGATORIA:
El hook del guion adaptado DEBE tener la misma carga emocional y nivel de riesgo narrativo del hook original.
Si el original era crudo, polémico, vulnerable o confrontacional → el adaptado DEBE serlo en igual medida.
Un hook suavizado = fracaso total. No negociable.

=== TRANSCRIPCIÓN FIEL DEL VIDEO ORIGINAL ===
${transcripcion}

=== DATOS DEL USUARIO ===
- Nicho / Tema a adaptar: ${nichoUsuario || 'No especificado'}
- Nicho de origen del video: ${nichoOrigen || 'General'}
- Objetivo: ${objetivoUsuario || 'Viralidad y autoridad'}
${expertProfile?.mechanism_name ? `- Mecanismo propio: "${expertProfile.mechanism_name}" → intégralo en el guion` : ''}
${expertProfile?.enemy ? `- Enemigo narrativo: "${expertProfile.enemy}" → úsalo como antagonista` : ''}
${expertProfile?.point_a ? `- Dolor del avatar: "${expertProfile.point_a}"` : ''}
${expertProfile?.point_b ? `- Destino: "${expertProfile.point_b}"` : ''}
${expertProfile?.authority_level ? `- Nivel de autoridad: ${expertProfile.authority_level}` : ''}
${contexto?.outputLanguageFull ? `- IDIOMA DE SALIDA OBLIGATORIO: ${contexto.outputLanguageFull}` : ''}

=== INSTRUCCIÓN ÚNICA ===
Analiza la transcripción y devuelve EXCLUSIVAMENTE este JSON (sin texto antes, sin markdown, sin backticks):

{
  "transcripcion_fiel": "La transcripción exacta del video original, limpia y formateada en párrafos legibles. Separa por oraciones. Máximo 800 palabras si el original es más largo.",

  "idea_ganadora": "2-3 líneas. El concepto raíz exacto que hizo explotar este video: qué creencia rompe, qué conflicto activa, por qué millones no pudieron ignorarlo.",

  "adn_viral": [
    "Disparador 1: nombre del mecanismo psicológico + cómo opera en este video específico",
    "Disparador 2: nombre del mecanismo psicológico + cómo opera en este video específico",
    "Disparador 3: nombre del mecanismo psicológico + cómo opera en este video específico"
  ],

  "score_adn": {
    "retencion": 0,
    "emocion": 0,
    "atencion": 0,
    "valor": 0,
    "polarizacion": 0,
    "global": 0,
    "diagnostico": "1 frase. Qué hace que este video funcione o falle estructuralmente."
  },

  "guion_adaptado_teleprompter": "Guion nuevo para el usuario. REGLAS ABSOLUTAS:\\n\\n1. HOOK (0-3s): Extrae la EMOCIÓN RAÍZ del hook original — el riesgo, la crudeza, la vulnerabilidad o la confrontación — y trasplántala al nicho del usuario. NO suavices. NO pongas preguntas genéricas. Usa la misma intensidad emocional del original adaptada al contexto del usuario.\\n\\n2. DESARROLLO: Mantén los 3 disparadores del ADN viral. Incluye UNA historia concreta o decisión difícil que el usuario haya tomado en su nicho (aunque sea hipotética pero verosímil). Mínimo 200 palabras.\\n\\n3. TEORÍA CIRCULAR DE ALCANCE — NO NEGOCIABLE: La última frase DEBE ser una variación directa de la primera frase. El espectador debe sentir que el video cerró el círculo. Este mecanismo fuerza el re-watch.\\n\\n4. SIN RELLENO: Cada frase debe ganar su derecho a existir. Sin frases de transición vacías.\\n\\n5. Si el original tenía lenguaje informal, coloquial o vulgar → MANTÉN ese mismo registro adaptado al nicho.",

  "plan_audiovisual_pro": {
    "hook_visual": "Qué se ve exactamente en pantalla durante los primeros 3 segundos. Tipo de plano (primer plano / plano medio / detalle), composición, movimiento de cámara, expresión del presentador.",
    "escenas": [
      {
        "id": 1,
        "momento": "0-3s",
        "tipo": "HOOK",
        "descripcion_escena": "Qué ocurre exactamente en pantalla. Acción, postura, mirada.",
        "angulo_camara": "Primer plano / Plano medio / Plano detalle / etc.",
        "movimiento": "Estático / Zoom in / Zoom out / Paneo / Handheld",
        "caption": "Máximo 3 palabras en pantalla. Bold. Contraste máximo.",
        "prompt_broll": "Prompt completo listo para copiar en Midjourney, Runway o Sora. Describe: sujeto, acción, ambiente, iluminación, estilo cinematográfico, aspect ratio. Ejemplo: 'A confident entrepreneur in a modern office, facing the camera with intense expression, dramatic side lighting, cinematic 4K, shallow depth of field, 9:16 vertical'",
        "sfx": "Sonido o música exacto para este momento y por qué funciona psicológicamente.",
        "por_que_retiene": "Mecanismo psicológico específico que activa en el espectador."
      },
      {
        "id": 2,
        "momento": "3-15s",
        "tipo": "DESARROLLO_1",
        "descripcion_escena": "Qué ocurre en pantalla. Primera historia o dato de impacto.",
        "angulo_camara": "Tipo de plano.",
        "movimiento": "Movimiento de cámara.",
        "caption": "Frase clave del desarrollo — máximo 4 palabras.",
        "prompt_broll": "Prompt completo para generar este B-roll en IA. Descripción visual detallada con estilo cinematográfico y ratio 9:16.",
        "sfx": "Música de fondo: estilo, BPM aproximado, emoción que debe transmitir.",
        "por_que_retiene": "Por qué el espectador no puede dejar de ver en este momento."
      },
      {
        "id": 3,
        "momento": "15-40s",
        "tipo": "DESARROLLO_2",
        "descripcion_escena": "Momento de mayor tensión narrativa. La decisión difícil o el punto de inflexión.",
        "angulo_camara": "Tipo de plano para máximo impacto emocional.",
        "movimiento": "Movimiento que refuerza la tensión.",
        "caption": "La frase más impactante del guion — este caption se comparte.",
        "prompt_broll": "Prompt completo para generar el B-roll del clímax en IA. Máximo detalle visual.",
        "sfx": "SFX de impacto en el momento de mayor intensidad. Describe el sonido exacto.",
        "por_que_retiene": "Mecanismo de retención en el punto más crítico del video."
      },
      {
        "id": 4,
        "momento": "40s-fin",
        "tipo": "CIERRE_CIRCULAR",
        "descripcion_escena": "Cierre visual que conecta con el hook. Resolución del arco emocional.",
        "angulo_camara": "Plano que cierra el arco visual iniciado en el hook.",
        "movimiento": "Movimiento de cierre — puede ser el inverso del hook para el efecto circular.",
        "caption": "Caption del CTA circular — conecta visualmente con el hook.",
        "prompt_broll": "Prompt completo para el B-roll de cierre. Debe resonar visualmente con el hook.",
        "sfx": "Resolución sonora. Cómo debe sonar el cierre para completar el arco emocional.",
        "por_que_retiene": "Por qué este cierre fuerza el re-watch."
      }
    ],
    "ritmo_de_cortes": "LENTO / MEDIO / ACELERADO / VARIABLE — patrón exacto con justificación narrativa. Ej: 'VARIABLE — cortes rápidos (0.5s) en el hook para urgencia, ritmo medio (2-3s) en el desarrollo para comprensión, corte lento (5s) en el cierre para impacto emocional'",
    "musica_completa": {
      "genero": "Género musical específico (hip-hop instrumental / cinematic / lo-fi / trap / etc.)",
      "bpm": "BPM aproximado",
      "referencia": "Artista o track de referencia para el editor",
      "cuando_entra": "En qué segundo entra la música",
      "cuando_sube": "En qué segundo sube el volumen al clímax",
      "cuando_baja": "Cómo termina — fade out, corte seco, etc."
    }
  },

  "miniatura_circular": {
    "frase_principal": "Máximo 5 palabras. Genera el mismo gap de curiosidad que el HOOK del guion.",
    "por_que_genera_clic": "Mecanismo psicológico: Gap informativo / Disonancia cognitiva / Polarización / Urgencia implícita.",
    "variante_b": "Segunda opción para A/B test."
  }
}

REGLAS CRÍTICAS:
- SOLO JSON. Cero texto antes o después. Cero markdown. Cero backticks.
- "adn_viral" DEBE ser array de exactamente 3 strings.
- "guion_adaptado_teleprompter" DEBE tener mínimo 200 palabras.
- "score_adn" — todos los valores numéricos entre 0-100. Basados en análisis REAL del video original, no inventados.
- "plan_audiovisual_pro.escenas" DEBE tener exactamente 4 objetos con todos sus campos completos.
- Cada "prompt_broll" DEBE ser un prompt completo y funcional de mínimo 20 palabras listo para copiar en Midjourney/Runway/Sora.
- Teoría Circular NO NEGOCIABLE: primera y última frase del guion hacen loop.
- HOOK: misma intensidad emocional y nivel de riesgo del original. NO suavizar.
- Adapta TODO al nicho "${nichoUsuario}".
- IDIOMA: todos los campos en el idioma especificado en DATOS DEL USUARIO.`;

// ── Aliases de compatibilidad — NO BORRAR ────────────────────────
const buildPromptRefinamientoLoop = (
  _outputAnterior: string,
  _scoreActual: number,
  _umbralMinimo: number,
  _iteracion: number,
  _nichoUsuario: string
): string => '{}';

const PROMPT_REFINAMIENTO_LOOP = buildPromptRefinamientoLoop;
const PROMPT_ADN_FORENSE       = PROMPT_INGENIERIA_INVERSA_PRO;
const PROMPT_GUION_ELITE       = (..._args: any[]) => '';

// ==================================================================================
// ⚡ EJECUTOR SNIPER ENTERPRISE v2
// ==================================================================================

async function ejecutarIngenieriaInversaPro(
  content: string,
  contexto: any,
  openai: any,
  nichoOrigen: string = 'General',
): Promise<{ data: any; tokens: number }> {

  const nichoUsuario    = contexto?.nicho_usuario_explicito || contexto?.nicho || '';
  const objetivoUsuario = contexto?.deseo_principal || '';
  const expertProfile   = contexto?.expertProfile   || null;

  const contentLimpio = content
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/(.{20,}?)\1+/g, '$1')
    .replace(/\s{3,}/g, '\n\n')
    .trim();

  const MAX_CHARS      = 10500;
  const MAX_CHARS_FIEL = 4000;

  const contentTruncado = contentLimpio.length > MAX_CHARS
    ? contentLimpio.slice(0, MAX_CHARS) + '\n\n[... truncado a 7 min]'
    : contentLimpio;

  const transcripcionFiel = contentLimpio.length > MAX_CHARS_FIEL
    ? contentLimpio.slice(0, MAX_CHARS_FIEL) + '\n[... continúa]'
    : contentLimpio;

  const prompt = PROMPT_INGENIERIA_INVERSA_PRO(
    contentTruncado,
    transcripcionFiel,
    nichoOrigen,
    nichoUsuario,
    objetivoUsuario,
    expertProfile,
    contexto,
  );

  console.log('[SNIPER-ENTERPRISE-v2] 🎯 Llamando a gpt-4o-mini...');
  console.log(`[SNIPER-ENTERPRISE-v2] Chars: ${contentTruncado.length} | Nicho: ${nichoUsuario.substring(0, 50)}`);

  const response = await openai.chat.completions.create({
    model:       'gpt-4o-mini',
    max_tokens:  4000,
    temperature: 0,
    messages: [
      {
        role:    'system',
        content: 'Eres un sistema de análisis viral de precisión. Devuelves SOLO JSON válido con exactamente 7 claves: transcripcion_fiel, idea_ganadora, adn_viral, score_adn, guion_adaptado_teleprompter, plan_audiovisual_pro, miniatura_circular. Sin texto adicional. Sin backticks. Sin markdown.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const raw    = response.choices[0]?.message?.content?.trim() || '{}';
  const tokens = response.usage?.total_tokens || 0;

  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let data: any;
  try {
    data = JSON.parse(clean);
  } catch (_) {
    console.error('[SNIPER-ENTERPRISE-v2] ❌ JSON inválido:', clean.substring(0, 300));
    data = {
      transcripcion_fiel:          transcripcionFiel,
      idea_ganadora:               'Error al procesar. Intenta de nuevo.',
      adn_viral:                   ['No disponible', 'No disponible', 'No disponible'],
      score_adn: {
        retencion: 0, emocion: 0, atencion: 0, valor: 0,
        polarizacion: 0, global: 0, diagnostico: 'Error de procesamiento.',
      },
      guion_adaptado_teleprompter: raw,
      plan_audiovisual_pro: {
        hook_visual:     '',
        escenas:         [],
        ritmo_de_cortes: 'MEDIO',
        musica_completa: {},
      },
      miniatura_circular: {
        frase_principal:     'Error de procesamiento',
        por_que_genera_clic: '',
        variante_b:          '',
      },
    };
  }

  // ── Normalizar adn_viral ──────────────────────────────────────────
  if (typeof data.adn_viral === 'string') {
    data.adn_viral = data.adn_viral
      .split(/\n|;|•|-/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }
  if (!Array.isArray(data.adn_viral) || data.adn_viral.length === 0) {
    data.adn_viral = ['No disponible', 'No disponible', 'No disponible'];
  }

  // ── Normalizar score_adn ──────────────────────────────────────────
  if (!data.score_adn || typeof data.score_adn !== 'object') {
    data.score_adn = {
      retencion: 0, emocion: 0, atencion: 0, valor: 0,
      polarizacion: 0, global: 0, diagnostico: '',
    };
  }

  // ── Normalizar plan_audiovisual_pro ───────────────────────────────
  if (typeof data.plan_audiovisual_pro === 'string') {
    data.plan_audiovisual_pro = { resumen: data.plan_audiovisual_pro, escenas: [] };
  }
  if (!Array.isArray(data.plan_audiovisual_pro?.escenas)) {
    data.plan_audiovisual_pro.escenas = [];
  }

  // ── Compatibilidad hacia atrás ────────────────────────────────────
  data.guion_adaptado_espejo        = data.guion_adaptado_teleprompter || '';
  data.guion_adaptado_al_nicho      = data.guion_adaptado_teleprompter || '';
  data.guion_tecnico_completo       = data.guion_adaptado_teleprompter || '';
  data.frase_miniatura              = data.miniatura_circular?.frase_principal || '';
  data.miniatura_dominante          = {
    frase_principal:   data.miniatura_circular?.frase_principal || '',
    variante_agresiva: data.miniatura_circular?.variante_b      || '',
  };
  data.plan_audiovisual_profesional = data.plan_audiovisual_pro || {};

  // score_viral_estructural compatible con IRProScoreCard (mantiene los nombres que ya usa el frontend)
  data.score_viral_estructural = {
    viralidad_estructural_global: data.score_adn?.global             || 0,
    retencion_estructural:        data.score_adn?.retencion          || 0,
    intensidad_emocional:         data.score_adn?.emocion            || 0,
    manipulacion_atencion:        data.score_adn?.atencion           || 0,
    densidad_valor:               data.score_adn?.valor              || 0,
    polarizacion:                 data.score_adn?.polarizacion       || 0,
    recomendacion_express:        data.score_adn?.diagnostico        || '',
  };

  data.listo_para_auditoria = (data.score_adn?.global || 0) >= 60;
  data.paquete_juez_viral   = null;

  console.log(`[SNIPER-ENTERPRISE-v2] ✅ Tokens: ${tokens} | Score global: ${data.score_adn?.global} | Escenas: ${data.plan_audiovisual_pro?.escenas?.length}`);
  return { data, tokens };
}

// ==================================================================================
// EXPORTS
// ==================================================================================

export {
  PROMPT_INGENIERIA_INVERSA_PRO,
  buildPromptRefinamientoLoop,
  PROMPT_REFINAMIENTO_LOOP,
  PROMPT_ADN_FORENSE,
  PROMPT_GUION_ELITE,
  ejecutarIngenieriaInversaPro,
};