// ====================================================================================
// 👁️ prompts/vision.ts
// analizarImagenEstrategica  →  handler llama: await analizarImagenEstrategica(...)
//                               (el prompt está inline dentro de la función)
// ====================================================================================

// ── analizarImagenEstrategica ────────────────────────────────────
async function analizarImagenEstrategica(
  imageBase64: string,
  openai: any,
  contextoUsuario?: {
    nicho?: string;
    avatar_ideal?: string;
    dolor_principal?: string;
    deseo_principal?: string;
    plataforma?: string;
    formato_narrativo?: string;
    expertProfile?: any;
  }
): Promise<string> {
  console.log('[VISION V700] 👁️ Analizando imagen con contexto completo del usuario...');

  const nicho          = contextoUsuario?.nicho             || 'General';
  const avatar         = contextoUsuario?.avatar_ideal       || 'Audiencia objetivo del creador';
  const dolor          = contextoUsuario?.dolor_principal    || 'No especificado';
  const deseo          = contextoUsuario?.deseo_principal    || 'No especificado';
  const plataforma     = contextoUsuario?.plataforma         || 'TikTok';
  const formato        = contextoUsuario?.formato_narrativo  || 'EDUCATIVO_AUTORIDAD';
  const mecanismo      = contextoUsuario?.expertProfile?.mechanism_name           || null;
  const transformacion = contextoUsuario?.expertProfile?.transformation_promise   || null;
  const enemigo        = contextoUsuario?.expertProfile?.enemy                    || null;

  const formatoADN: Record<string, string> = {
    EDUCATIVO_AUTORIDAD:    'Tesis provocadora → Evidencia contraintuitiva → Sistema nombrado → Aplicación inmediata. Busca el CONCEPTO que puede nombrarse y replicarse.',
    STORYTELLING_EMOCIONAL: 'In media res → Conflicto real → Giro narrativo. Busca el DOLOR HUMANO o la situación de vida que cuenta la imagen.',
    ANUNCIO_DIRECTO:        'Filtro de avatar → Dolor afilado → Solución diferenciada. Busca el PROBLEMA URGENTE que resuelve la imagen.',
    ANUNCIO_INDIRECTO:      'Valor puro → Problema implícito → Solución orgánica. Busca el INSIGHT DE VALOR que puede entregarse sin vender.',
    OPINION_POLARIZACION:   'Declaración divisiva → Argumento irrefutable → Llamada a la tribu. Busca el ÁNGULO CONFRONTATIVO que despierta el debate.',
    CASO_ESTUDIO:           'Resultado concreto → Punto A → Sistema → Resultado medible. Busca el LOGRO O TRANSFORMACIÓN específica que puede documentarse.',
    TUTORIAL_PASO_A_PASO:   'Promesa específica → Por qué fallan → Pasos con micro-aplicación. Busca el PROCESO ACCIONABLE que enseña la imagen.',
    PODCAST_REFLEXIVO:      'Pregunta que el avatar tiene en la cabeza → Exploración honesta → Reencuadre. Busca la TENSIÓN FILOSÓFICA o dilema que abre reflexión.',
    MASTERCLASS_COMPRIMIDA: 'Promesa de perspectiva → Mapa mental → Conceptos con ejemplos reales. Busca el SISTEMA COMPLETO que puede comprimirse.',
    FRAME_DISRUPTIVO:       'Afirmación imposible → Evidencia que la sostiene → Reencuadre total. Busca la VERDAD CONTRAINTUITIVA que destroza una creencia.',
  };

  const adnFormato = formatoADN[formato] || formatoADN['EDUCATIVO_AUTORIDAD'];

  const plataformaContext: Record<string, string> = {
    'TikTok':         'El concepto debe funcionar en 30-60s. Gancho en los primeros 2 segundos. Ritmo staccato. Sin introducción.',
    'Reels':          'El concepto debe funcionar en 30-60s con estética aspiracional. Música emotiva. Identidad tribal.',
    'YouTube':        'El concepto puede expandirse a 8-15 min. Gap informativo profundo. Estructura en capítulos.',
    'LinkedIn':       'El concepto debe resonar con profesionales. Reflexión experiencial. Primera persona. Tono sobrio.',
    'Facebook':       'El concepto debe generar debate comunitario. Subtítulos completos. Audiencia amplia y emocional.',
    'YouTube Shorts': 'Concepto en 60s máximo. Gancho instantáneo. Valor comprimido. Alto scroll-stopping.',
  };

  const plataformaGuia = plataformaContext[plataforma] || plataformaContext['TikTok'];

  const systemPrompt = `Eres el Extractor de ADN Viral más preciso del mundo.
Tu trabajo NO es describir imágenes. Es convertirlas en ARMAS NARRATIVAS personalizadas.

CONTEXTO DEL CREADOR (usa esto para personalizar cada parte del análisis):
- Nicho: ${nicho}
- Avatar objetivo: ${avatar}
- Dolor principal del avatar: ${dolor}
- Deseo principal del avatar: ${deseo}
- Plataforma destino: ${plataforma}
- Formato narrativo activo: ${formato}
${mecanismo      ? `- Mecanismo propietario del experto: "${mecanismo}" → intégralo si encaja` : ''}
${transformacion ? `- Promesa de transformación: "${transformacion}" → conéctala con la imagen`  : ''}
${enemigo        ? `- Enemigo común del experto: "${enemigo}" → úsalo si potencia la tensión`    : ''}

ADN DEL FORMATO ACTIVO (${formato}):
${adnFormato}

GUÍA DE PLATAFORMA (${plataforma}):
${plataformaGuia}

EJECUTA ESTOS 4 DETECTORES EN ORDEN:

DETECTOR 1 — TENSIÓN EXPLOTABLE:
¿Qué conflicto, dolor o deseo del avatar de ${nicho} activa esta imagen?
NO la descripción visual. SÍ la tensión narrativa específica para ${avatar}.

DETECTOR 2 — ÁNGULO VIRAL PARA ${formato}:
¿Cómo se convierte esta imagen en el gancho perfecto para el formato ${formato}?
Usa el ADN del formato. Sé específico al nicho ${nicho}.

DETECTOR 3 — INSIGHT CONTRAINTUITIVO:
¿Qué verdad no obvia o reencuadre mental puede extraerse para ${plataforma}?
Debe ser sorprendente. Que el avatar diga "nunca lo había visto así".

DETECTOR 4 — SEMILLA FINAL:
Escribe UN párrafo potente (80-120 palabras) que sirva como semilla exacta para el generador.
Debe contener: la tensión, el ángulo para ${formato}, el dolor de ${avatar}, y el insight.
Este párrafo es el input que usará el Motor V700 para generar el guion completo.

RESPONDE SOLO con el párrafo del DETECTOR 4. Sin títulos, sin explicaciones adicionales.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analiza esta imagen para un creador de contenido de ${nicho} en ${plataforma}. Su avatar es "${avatar}" con dolor "${dolor}". Formato activo: ${formato}. Extrae el concepto viral personalizado.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
              detail: "high"
            }
          }
        ]
      }
    ],
    max_tokens: 600
  });

  const analisis = response.choices[0].message.content;
  console.log(`[VISION V700] ✅ Concepto extraído para ${nicho} | ${plataforma} | ${formato}:`, analisis?.substring(0, 100) + '...');
  return analisis || '';
}

// ==================================================================================
// 🔄 CONTEXTO Y COSTOS
// ==================================================================================


export {
  analizarImagenEstrategica,
};