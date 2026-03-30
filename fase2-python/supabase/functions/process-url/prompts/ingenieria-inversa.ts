// ====================================================================================
// 💎 prompts/ingenieria-inversa.ts
// FUNCIÓN: Analiza un video Y genera un guion nuevo adaptado al nicho del experto
// MODO:    recreate
// MOTOR:   SNIPER ENTERPRISE — 6 bloques letales, 1 llamada, < 30s
// ====================================================================================

import { delay } from '../lib/security.ts';
import { ejecutarAutopsiaViral } from './autopsia-viral.ts';

// ── PROMPT SNIPER ENTERPRISE — 6 BLOQUES LETALES ─────────────────
const PROMPT_INGENIERIA_INVERSA_PRO = (
  transcripcion: string,
  transcripcionFiel: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any,
  contexto?: any,
) => `Eres TITAN SNIPER ENTERPRISE — sistema de clonación viral de precisión quirúrgica.
Tu misión: analizar el ADN del video original y generar 6 bloques letales listos para publicar.
Una sola llamada. Respuesta en menos de 30 segundos.

=== TRANSCRIPCIÓN FIEL DEL VIDEO ORIGINAL (extraída por Whisper) ===
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

  "guion_adaptado_teleprompter": "Guion nuevo para el usuario. REGLAS ABSOLUTAS:\\n\\n1. TEORÍA CIRCULAR DE ALCANCE: La última frase DEBE ser una variación directa de la primera frase — el espectador debe sentir que el video cerró el círculo. Este mecanismo fuerza el re-watch.\\n\\n2. ESTRUCTURA:\\nHOOK (0-3s): Frase de máximo impacto. Sin contexto previo. Tensión inmediata.\\n\\nDESARROLLO: Mantén los 3 disparadores del ADN viral. Adapta al nicho del usuario. Mínimo 180 palabras.\\n\\nCIERRE CIRCULAR (últimos 5s): Variación directa del HOOK que cierra el loop y fuerza el re-watch.\\n\\n3. SIN RELLENO: Cada frase debe ganar su derecho a existir.\\n4. Si el original era crudo o polémico → MANTÉN esa misma intensidad adaptada al nicho.",

  "plan_audiovisual_pro": {
    "hook_visual": "Qué se ve exactamente en pantalla durante los primeros 3 segundos. Plano, composición, movimiento de cámara.",
    "captions_dinamicos": [
      {"segundo": "0-3s", "texto_pantalla": "Palabra o frase clave — máximo 3 palabras, fuente bold, contraste máximo"},
      {"segundo": "desarrollo_1", "texto_pantalla": "Caption de refuerzo en el punto de mayor tensión"},
      {"segundo": "climax", "texto_pantalla": "La frase más impactante del guion — este caption se comparte"},
      {"segundo": "cierre", "texto_pantalla": "Caption del CTA circular — conecta visualmente con el hook"}
    ],
    "brolls_estrategicos": [
      {"momento": "segundo o bloque", "que_mostrar": "descripción específica", "por_que_retiene": "mecanismo psicológico que activa"},
      {"momento": "segundo o bloque", "que_mostrar": "descripción específica", "por_que_retiene": "mecanismo psicológico que activa"}
    ],
    "sfx_y_musica": {
      "hook": "Sonido exacto para los primeros 3s y por qué fuerza atención.",
      "desarrollo": "Estilo musical + BPM aproximado. Cómo refuerza la tensión narrativa.",
      "climax": "SFX de impacto en el momento de mayor intensidad.",
      "cierre": "Resolución sonora que completa el arco emocional."
    },
    "ritmo_de_cortes": "LENTO / MEDIO / ACELERADO / VARIABLE — patrón con justificación narrativa."
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
- Teoría Circular NO NEGOCIABLE: primera y última frase del guion hacen loop.
- "captions_dinamicos" DEBE tener exactamente 4 objetos.
- Adapta TODO al nicho "${nichoUsuario}".
- IDIOMA: todos los campos en el idioma especificado en DATOS DEL USUARIO.`;

// ── Aliases de compatibilidad — NO BORRAR ────────────────────────
// Otros módulos pueden importar estos nombres — deben seguir existiendo
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
// ⚡ EJECUTOR SNIPER ENTERPRISE — 1 llamada a gpt-4o-mini, 6 bloques, < 30s
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

  // ── Limpiar y truncar a 7 minutos máximo (~10,500 chars) ─────────
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

  console.log('[SNIPER-ENTERPRISE] 🎯 Llamando a gpt-4o-mini...');
  console.log(`[SNIPER-ENTERPRISE] Chars: ${contentTruncado.length} | Nicho: ${nichoUsuario.substring(0, 50)}`);

  const response = await openai.chat.completions.create({
    model:       'gpt-4o-mini',
    max_tokens:  3000,
    temperature: 0,
    messages: [
      {
        role:    'system',
        content: 'Eres un sistema de análisis viral de precisión. Devuelves SOLO JSON válido con exactamente 6 claves: transcripcion_fiel, idea_ganadora, adn_viral, guion_adaptado_teleprompter, plan_audiovisual_pro, miniatura_circular. Sin texto adicional. Sin backticks.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const raw    = response.choices[0]?.message?.content?.trim() || '{}';
  const tokens = response.usage?.total_tokens || 0;

  // ── Parseo defensivo ──────────────────────────────────────────────
  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let data: any;
  try {
    data = JSON.parse(clean);
  } catch (_) {
    console.error('[SNIPER-ENTERPRISE] ❌ JSON inválido:', clean.substring(0, 300));
    data = {
      transcripcion_fiel:          transcripcionFiel,
      idea_ganadora:               'Error al procesar. Intenta de nuevo.',
      adn_viral:                   ['No disponible', 'No disponible', 'No disponible'],
      guion_adaptado_teleprompter: raw,
      plan_audiovisual_pro: {
        hook_visual:          '',
        captions_dinamicos:   [],
        brolls_estrategicos:  [],
        sfx_y_musica:         {},
        ritmo_de_cortes:      'MEDIO',
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

  // ── Normalizar plan_audiovisual_pro ───────────────────────────────
  if (typeof data.plan_audiovisual_pro === 'string') {
    data.plan_audiovisual_pro = { resumen: data.plan_audiovisual_pro };
  }

  // ── Campos de compatibilidad hacia atrás ─────────────────────────
  // El handler, el frontend antiguo y el Juez Viral leen estas claves
  data.guion_adaptado_espejo        = data.guion_adaptado_teleprompter || '';
  data.guion_adaptado_al_nicho      = data.guion_adaptado_teleprompter || '';
  data.guion_tecnico_completo       = data.guion_adaptado_teleprompter || '';
  data.frase_miniatura              = data.miniatura_circular?.frase_principal || '';
  data.miniatura_dominante          = {
    frase_principal:   data.miniatura_circular?.frase_principal || '',
    variante_agresiva: data.miniatura_circular?.variante_b      || '',
  };
  data.plan_audiovisual_profesional = data.plan_audiovisual_pro || {};
  data.score_viral_estructural      = { viralidad_estructural_global: 0 };
  data.listo_para_auditoria         = false;
  data.paquete_juez_viral           = null;

  console.log(`[SNIPER-ENTERPRISE] ✅ Tokens: ${tokens} | Bloques: ${Object.keys(data).length}`);
  return { data, tokens };
}

// ==================================================================================
// EXPORTS — solo exporta lo que existe en este archivo
// ==================================================================================

export {
  PROMPT_INGENIERIA_INVERSA_PRO,
  buildPromptRefinamientoLoop,
  PROMPT_REFINAMIENTO_LOOP,
  PROMPT_ADN_FORENSE,
  PROMPT_GUION_ELITE,
  ejecutarIngenieriaInversaPro,
};