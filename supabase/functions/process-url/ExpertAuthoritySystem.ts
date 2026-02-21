// ==================================================================================
// 🧠 EXPERT AUTHORITY ENGINE — OLIMPO EDITION
// ==================================================================================

export class ExpertAuthoritySystem {

  // ─── HELPER: safe prohibitions parse ─────────────────────────────────────────
  private static parseProhibitions(raw: any): Record<string, any> {
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
    } catch {
      return {};
    }
  }

  private static parseNetworkConfig(raw: any): Record<string, any> {
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
    } catch {
      return {};
    }
  }

  // ─── SLIDER LABEL HELPER ──────────────────────────────────────────────────────
  private static sliderLabel(value: number, low: string, mid: string, high: string): string {
    if (value <= 2) return low;
    if (value <= 3) return mid;
    return high;
  }

  // ─── FUNCIÓN 1: GENERATE DIRECTIVES ──────────────────────────────────────────
  static generateDirectives(expertProfile: any): string {
    if (!expertProfile) return "";

    const {
      // Identidad
      name = '',
      niche = '',
      sub_niche = '',
      market_sophistication = 'aware',
      market_awareness = 'aware',
      unique_positioning = '',
      enemy = '',
      transformation_promise = '',

      // Autoridad
      authority_level = 'practicante',
      authority_type = 'practica',
      depth_level = 'media',
      proof_type = 'casos_reales',
      mental_territory = '',
      prohibitions = {},

      // Objetivo & Transformación
      main_objective = 'autoridad',
      point_a = '',
      point_b = '',
      tangible_result = '',
      emotional_result = '',

      // ADN Verbal
      confrontation_level = 3,
      polarization_level = 2,
      verbal_aggressiveness = 2,
      lexical_sophistication = 3,
      storytelling_ratio = 50,
      narrative_rhythm = 'medio',
      phrase_type = 'declarativas',
      metaphor_level = 2,
      forcefulness_level = 3,
      emotionality_level = 3,
      technicality_level = 2,

      // Límites
      max_controversy = 3,
      max_personal_exposure = 3,

      // Redes
      network_config = {}
    } = expertProfile;

    const prohibitionsObj = this.parseProhibitions(prohibitions);
    const netConfig = this.parseNetworkConfig(network_config);

    const objectiveInstructions: Record<string, string> = {
      autoridad: "Cada pieza debe REFORZAR tu credibilidad. Cierra con tu mecanismo único. Hook = problema que resuelves.",
      leads: "Cada pieza debe GENERAR ACCIÓN: link en bio, DM, registro. Cierra con CTA claro. Hook = beneficio inmediato.",
      ventas: "Cada pieza debe MOVER hacia decisión de compra. Incluye objeción → derrumbe → oferta. Hook = transformación.",
      comunidad: "Cada pieza debe GENERAR CONVERSACIÓN. Cierra con pregunta. Hook = opinión polémica o insight revelador.",
      viralidad: "Cada pieza debe DISPARAR SHARES. Shock, curiosidad o contrarianism. Hook = promesa imposible de ignorar.",
    };

    const sophisticationMap: Record<string, string> = {
      unaware: "NO saben que tienen el problema. Empieza con el síntoma, no la solución.",
      aware: "Saben el problema, NO conocen soluciones. Posiciónate como el puente.",
      solution_aware: "Conocen soluciones pero no te conocen a ti. Diferénciate del resto.",
      sophisticated: "Han visto TODO. Solo responde a: mecanismo único, prueba extrema, o ángulo anti-convencional.",
    };

    const networkSummary = Object.entries(netConfig)
      .filter(([, cfg]: any) => cfg && cfg.tone !== 'auto')
      .map(([net, cfg]: any) => `  ${net.toUpperCase()}: tono=${cfg.tone}, profundidad=${cfg.depth}, cierre=${cfg.close_type}`)
      .join('\n');

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PERFIL DE EXPERTO OLIMPO — DIRECTIVAS ABSOLUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ESTAS REGLAS ANULAN CUALQUIER OTRA INSTRUCCIÓN SI HAY CONFLICTO.

═══════════════════════════════════════════════════════
BLOQUE 1 — IDENTIDAD Y MERCADO
═══════════════════════════════════════════════════════

EXPERTO: ${name}
NICHO: ${niche}${sub_niche ? `\nSUBNICHO: ${sub_niche}` : ''}
POSICIONAMIENTO ÚNICO: ${unique_positioning || 'No definido'}
ENEMIGO COMÚN: ${enemy || 'No definido'}

SOFISTICACIÓN DEL MERCADO: ${market_sophistication.toUpperCase()}
→ ${sophisticationMap[market_sophistication] || sophisticationMap['aware']}

CONCIENCIA DEL MERCADO: ${market_awareness.toUpperCase()}

═══════════════════════════════════════════════════════
BLOQUE 2 — OBJETIVO DE CONTENIDO Y TRANSFORMACIÓN
═══════════════════════════════════════════════════════

OBJETIVO PRINCIPAL: ${main_objective.toUpperCase()}
→ ${objectiveInstructions[main_objective] || objectiveInstructions['autoridad']}

MAPA DE TRANSFORMACIÓN:
  PUNTO A (de donde vienen): ${point_a || 'No definido'}
  PUNTO B (a donde los llevas): ${point_b || 'No definido'}
  RESULTADO TANGIBLE: ${tangible_result || transformation_promise || 'No definido'}
  RESULTADO EMOCIONAL: ${emotional_result || 'No definido'}
  PROMESA DIFERENCIAL: ${transformation_promise || 'No definida'}

REGLA DE ORO: Cada guion debe mover al avatar de A → B usando tu mecanismo.

═══════════════════════════════════════════════════════
BLOQUE 3 — NIVEL Y TIPO DE AUTORIDAD
═══════════════════════════════════════════════════════

1. NIVEL DE AUTORIDAD: ${authority_level.toUpperCase()}
   ${authority_level === 'aprendiz' ? `
   - Habla desde la humildad. Usa "Estoy aprendiendo...", "Descubrí que..."
   - NO pretendas ser experto. Comparte tu viaje.
   - Longitud máxima de guiones: 200 palabras.
   - Admite errores, muestra vulnerabilidad.
   ` : authority_level === 'practicante' ? `
   - Habla desde la experiencia. Usa "He probado...", "En mi experiencia..."
   - Puedes dar consejos, pero siempre con disclaimer: "Esto me funcionó a mí..."
   - Longitud recomendada: 150-300 palabras.
   - Muestra prueba social (resultados propios).
   ` : authority_level === 'experto' ? `
   - Habla con seguridad técnica. Usa "La forma correcta es...", "El error común es..."
   - Puedes ser prescriptivo. Tu palabra tiene peso.
   - Longitud recomendada: 200-400 palabras.
   - Usa frameworks, sistemas, metodologías.
   ` : `
   - Hablas como la voz definitiva del nicho. Usa "La realidad es...", "Déjame decirte algo..."
   - Puedes contradecir creencias populares CON FUNDAMENTO.
   - Longitud recomendada: 300-600 palabras.
   - Tu opinión ES la verdad para tu audiencia.
   `}

2. TIPO DE AUTORIDAD: ${authority_type.toUpperCase()}
   ${authority_type === 'academica' ? `
   - DEBES incluir al menos 1 dato/estadística/estudio por guion.
   - Usa lenguaje más formal y preciso.
   - Cita fuentes cuando sea posible.
   ` : authority_type === 'practica' ? `
   - DEBES incluir al menos 1 caso real, resultado o experiencia personal.
   - Usa lenguaje coloquial pero profesional.
   ` : authority_type === 'estrategica' ? `
   - DEBES presentar sistemas, frameworks o procesos.
   - Usa visión de alto nivel: "La estrategia clave es...", "El sistema que funciona..."
   ` : `
   - Cuestiona el status quo. Usa: "Lo que nadie te dice es...", "La verdad incómoda..."
   - Puedes ser polémico, pero con argumento sólido.
   `}

3. PROFUNDIDAD REQUERIDA: ${depth_level.toUpperCase()}
   ${depth_level === 'superficial' ? `
   - Mantén explicaciones SIMPLES. 1 idea = 1 oración. Máximo 150 palabras.
   ` : depth_level === 'media' ? `
   - Explica CON EJEMPLOS, pero sin exceso de detalle. 150-250 palabras.
   ` : depth_level === 'profunda' ? `
   - Profundiza en matices y detalles. 250-400 palabras.
   ` : `
   - Nivel técnico MÁXIMO. 400+ palabras. Implementación paso a paso.
   `}

4. TIPO DE PRUEBA: ${proof_type.toUpperCase()}
   ${proof_type === 'datos' ? '- Incluye números, porcentajes, métricas. Cita estudios.' :
     proof_type === 'casos_reales' ? '- Cuenta historias de casos reales con resultados específicos.' :
     proof_type === 'analogias' ? '- Explica conceptos con metáforas o analogías potentes.' :
     '- Tu opinión razonada ES la prueba. Argumenta con profundidad.'}

5. TERRITORIO MENTAL™: ${mental_territory || 'No definido'}${mental_territory ? '\n   - Cada guion DEBE reflejar estos conceptos clave.' : ''}

═══════════════════════════════════════════════════════
BLOQUE 4 — ADN VERBAL (CONFIGURACIÓN EXACTA)
═══════════════════════════════════════════════════════

CONFRONTACIÓN: ${confrontation_level}/5 → ${this.sliderLabel(confrontation_level, 'Nunca confrontes. Sugiere, no exige.', 'Confronta ideas, no personas. Con respaldo.', 'Confrontación directa permitida. Di lo que otros callan.')}

POLARIZACIÓN: ${polarization_level}/5 → ${this.sliderLabel(polarization_level, 'No polarices. Habla a todos.', 'Alguna toma de posición. Define tu bando.', 'Polarización máxima. Obliga al avatar a elegir bando.')}

AGRESIVIDAD VERBAL: ${verbal_aggressiveness}/5 → ${this.sliderLabel(verbal_aggressiveness, 'Lenguaje suave, diplomático, inclusivo.', 'Directo pero respetuoso. Sin rodeos.', 'Lenguaje crudo, impactante. Llama al toro por el nombre.')}

SOFISTICACIÓN LÉXICA: ${lexical_sophistication}/5 → ${this.sliderLabel(lexical_sophistication, 'Vocabulario simple. Nada de jerga.', 'Lenguaje profesional accesible.', 'Jerga experta del nicho. Sin explicar términos técnicos.')}

STORYTELLING: ${storytelling_ratio}% narrativa / ${100 - storytelling_ratio}% enseñanza directa
→ ${storytelling_ratio >= 70 ? 'MODO NARRADOR: Envuelve cada idea en una historia.' :
   storytelling_ratio >= 40 ? 'MODO EQUILIBRADO: Alterna historia con dato/framework.' :
   'MODO INSTRUCTOR: Directo al grano. Historia solo como gancho.'}

RITMO NARRATIVO: ${narrative_rhythm.toUpperCase()}
→ ${narrative_rhythm === 'lento' ? 'Frases largas. Reflexión. Pausa entre ideas.' :
   narrative_rhythm === 'medio' ? 'Ritmo estable. Mezcla de frases cortas y largas.' :
   narrative_rhythm === 'rapido' ? 'Frases cortas. Urgencia. Sin relleno.' :
   'Frases muy cortas. Golpes. Staccato cinematográfico.'}

TIPO DE FRASE: ${phrase_type.toUpperCase()}
→ ${phrase_type === 'declarativas' ? 'Afirmaciones poderosas. "X es Y." Seguridad total.' :
   phrase_type === 'interrogativas' ? 'Preguntas que generan reflexión. Involucra al avatar.' :
   phrase_type === 'exclamativas' ? 'Énfasis y emoción. Energía alta. Impacto inmediato.' :
   'Mix de los 4 tipos. Variedad según el momento del guion.'}

NIVEL DE METÁFORAS: ${metaphor_level}/5
NIVEL DE CONTUNDENCIA: ${forcefulness_level}/5
NIVEL DE EMOCIONALIDAD: ${emotionality_level}/5
NIVEL DE TECNICISMO: ${technicality_level}/5

═══════════════════════════════════════════════════════
BLOQUE 5 — LÍMITES Y LÍNEAS ROJAS
═══════════════════════════════════════════════════════

NIVEL MÁXIMO DE POLÉMICA PERMITIDO: ${max_controversy}/5
NIVEL MÁXIMO DE EXPOSICIÓN PERSONAL: ${max_personal_exposure}/5

6. 🚫 PROHIBICIONES ABSOLUTAS (HARD STOP):
   ${prohibitionsObj.promesas_rapidas ? '- ❌ NO uses promesas de "resultados rápidos", "fácil", "sin esfuerzo".' : ''}
   ${prohibitionsObj.simplificaciones_extremas ? '- ❌ NO digas "solo", "simplemente", "así de fácil" si el tema es complejo.' : ''}
   ${prohibitionsObj.ataques_personales ? '- ❌ NO ataques personas. Critica IDEAS, no INDIVIDUOS.' : ''}
   ${prohibitionsObj.opinion_sin_prueba ? '- ❌ NO des opiniones sin fundamento. SIEMPRE respalda con prueba.' : ''}
   ${prohibitionsObj.contenido_superficial ? '- ❌ NO hagas contenido viral vacío. Debe tener VALOR REAL.' : ''}

═══════════════════════════════════════════════════════
BLOQUE 6 — CONFIGURACIÓN POR RED SOCIAL
═══════════════════════════════════════════════════════

${networkSummary || 'Configuración automática (adaptar según estándar de la plataforma).'}

REGLA: Si hay configuración específica por red, PREVALECE sobre la configuración global de ADN verbal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ JERARQUÍA: Red Social > Experto > Avatar en: profundidad, argumento, prueba.
Avatar > Experto en: tono emocional, nivel de riesgo, personalidad.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  // ─── FUNCIÓN 2: APPLY FILTER ──────────────────────────────────────────────────
  static applyFilter(
    expertProfile: any,
    contentType: 'idea' | 'guion' | 'hook' | 'estructura',
    content: any,
    targetNetwork?: string
  ): { approved: boolean; warnings: string[]; score_credibilidad: number; modifications?: any } {

    if (!expertProfile) {
      return { approved: true, warnings: [], score_credibilidad: 100 };
    }

    const warnings: string[] = [];
    let scoreCredibilidad = 100;
    let approved = true;

    const {
      authority_level = 'practicante',
      authority_type = 'practica',
      depth_level = 'media',
      proof_type = 'casos_reales',
      prohibitions = {},
      confrontation_level = 3,
      polarization_level = 2,
      verbal_aggressiveness = 2,
      max_controversy = 3,
      max_personal_exposure = 3,
      storytelling_ratio = 50,
      main_objective = 'autoridad',
      network_config = {},
      point_a = '',
      point_b = '',
    } = expertProfile;

    const prohibitionsObj = this.parseProhibitions(prohibitions);
    const netConfig = this.parseNetworkConfig(network_config);

    // REGLA 1: PROFUNDIDAD VS NIVEL DE AUTORIDAD
    if (contentType === 'guion') {
      const texto = content.guion_completo || content.guion_tecnico_completo || '';
      const palabras = texto.split(' ').length;

      if (authority_level === 'aprendiz' && palabras > 300) {
        warnings.push("⚠️ Guion demasiado largo para nivel Aprendiz. Riesgo de perder credibilidad.");
        scoreCredibilidad -= 20;
      }

      if (authority_level === 'referente' && palabras < 150) {
        warnings.push("⚠️ Guion demasiado corto para nivel Referente. Pareces principiante.");
        scoreCredibilidad -= 15;
      }

      if (depth_level === 'superficial' && (texto.includes('framework') || texto.includes('sistema'))) {
        warnings.push("⚠️ CONFLICTO: Mencionas 'framework/sistema' pero tu profundidad es 'superficial'.");
        scoreCredibilidad -= 10;
      }
    }

    // REGLA 2: TIPO DE PRUEBA VS TIPO DE AUTORIDAD
    if (contentType === 'guion') {
      const texto = content.guion_completo || content.guion_tecnico_completo || '';

      if (authority_type === 'academica' && !texto.match(/\d+%|\bestudio\b|\binvestigación\b/i)) {
        warnings.push("❌ CRÍTICO: Tu autoridad es 'Académica' pero no usas datos/estudios. Pierdes credibilidad.");
        scoreCredibilidad -= 30;
        approved = false;
      }

      if (authority_type === 'practica' && !texto.match(/cliente|caso|resultado|logré|apliqué/i)) {
        warnings.push("⚠️ Tu autoridad es 'Práctica' pero no mencionas experiencia real.");
        scoreCredibilidad -= 20;
      }

      if (proof_type === 'datos' && !texto.match(/\d+/)) {
        warnings.push("⚠️ Tu tipo de prueba es 'Datos' pero no usas números en el guion.");
        scoreCredibilidad -= 15;
      }
    }

    // REGLA 3: VALIDAR OBJETIVO VS ESTRUCTURA
    if (contentType === 'guion' || contentType === 'estructura') {
      const texto = typeof content === 'string' ? content :
        (content.guion_completo || content.guion_tecnico_completo || JSON.stringify(content));

      if (main_objective === 'leads' && !texto.match(/link|dm|regístra|únete|descarga|accede/i)) {
        warnings.push("⚠️ Objetivo 'Leads' pero no hay CTA de captación en el guion.");
        scoreCredibilidad -= 20;
      }

      if (main_objective === 'ventas' && !texto.match(/precio|oferta|inversión|compra|accede|últimas plazas/i)) {
        warnings.push("⚠️ Objetivo 'Ventas' pero no hay elementos de conversión en el guion.");
        scoreCredibilidad -= 15;
      }

      if (main_objective === 'comunidad' && !texto.match(/¿qué|cuéntame|comenta|dime|tu experiencia/i)) {
        warnings.push("⚠️ Objetivo 'Comunidad' pero no hay pregunta de engagement en el cierre.");
        scoreCredibilidad -= 10;
      }
    }

    // REGLA 4: VALIDAR TRANSFORMACIÓN (PUNTO A → B)
    if (contentType === 'guion' && point_a && point_b) {
      const texto = content.guion_completo || content.guion_tecnico_completo || '';
      const mentionsProblem = texto.toLowerCase().includes(point_a.toLowerCase().substring(0, 10));
      const mentionsResult = texto.toLowerCase().includes(point_b.toLowerCase().substring(0, 10));

      if (!mentionsProblem && !mentionsResult) {
        warnings.push("⚠️ El guion no conecta con el Mapa de Transformación (Punto A → B) del experto.");
        scoreCredibilidad -= 15;
      }
    }

    // REGLA 5: NIVEL DE POLÉMICA
    if (contentType === 'guion' || contentType === 'hook') {
      const texto = typeof content === 'string' ? content :
        (content.texto || content.guion_sugerido || content.guion_completo || '');

      const controversyPatterns = /mentira|fraude|engaño|estafa|tóxico|te mienten|verdad incómoda|nadie te dice/i;
      if (max_controversy < 3 && texto.match(controversyPatterns)) {
        warnings.push(`🚫 LÍMITE: Contenido polémico detectado. Tu nivel máximo es ${max_controversy}/5.`);
        scoreCredibilidad -= 25;
        if (max_controversy <= 1) approved = false;
      }
    }

    // REGLA 6: PROHIBICIONES (HARD STOP)
    if (contentType === 'guion' || contentType === 'hook') {
      const texto = typeof content === 'string' ? content :
        (content.texto || content.guion_sugerido || content.guion_completo || '');

      if (prohibitionsObj.promesas_rapidas) {
        if (texto.match(/en \d+ días|rápido|inmediato|fácil|sin esfuerzo/i)) {
          warnings.push("🚫 PROHIBICIÓN VIOLADA: Promesas rápidas detectadas. Esto contradice tu posicionamiento.");
          scoreCredibilidad -= 40;
          approved = false;
        }
      }

      if (prohibitionsObj.simplificaciones_extremas) {
        if (texto.match(/solo|simplemente|nada más|así de simple/i) && depth_level !== 'superficial') {
          warnings.push("🚫 PROHIBICIÓN: Simplificaciones extremas detectadas.");
          scoreCredibilidad -= 25;
        }
      }

      if (prohibitionsObj.ataques_personales) {
        if (texto.match(/estúpido|idiota|imbécil|ignorante/i)) {
          warnings.push("🚫 PROHIBICIÓN CRÍTICA: Ataques personales detectados.");
          scoreCredibilidad -= 50;
          approved = false;
        }
      }

      if (prohibitionsObj.contenido_superficial && (authority_level === 'experto' || authority_level === 'referente')) {
        if (texto.split(' ').length < 100) {
          warnings.push("🚫 CONFLICTO: Contenido demasiado superficial para tu nivel de autoridad.");
          scoreCredibilidad -= 30;
        }
      }
    }

    // REGLA 7: CONFIGURACIÓN POR RED
    if (targetNetwork && contentType === 'guion') {
      const netCfg = netConfig[targetNetwork];
      if (netCfg && netCfg.depth !== 'auto') {
        const texto = content.guion_completo || '';
        const palabras = texto.split(' ').length;

        if (netCfg.depth === 'superficial' && palabras > 200) {
          warnings.push(`⚠️ Para ${targetNetwork.toUpperCase()} tienes configurada profundidad 'superficial' pero el guion es muy largo.`);
          scoreCredibilidad -= 10;
        }
        if (netCfg.depth === 'profunda' && palabras < 200) {
          warnings.push(`⚠️ Para ${targetNetwork.toUpperCase()} tienes configurada profundidad 'profunda' pero el guion es muy corto.`);
          scoreCredibilidad -= 10;
        }
      }
    }

    // REGLA 8: IDEAS
    if (contentType === 'idea') {
      const idea = content;

      if (depth_level === 'profunda' && idea.dificultad_produccion === 'Baja') {
        warnings.push("⚠️ Esta idea es demasiado simple para tu posicionamiento 'Profundo'.");
        scoreCredibilidad -= 15;
      }

      if (authority_level === 'aprendiz' && idea.dificultad_produccion === 'Alta') {
        warnings.push("⚠️ Esta idea puede parecer pretenciosa para nivel 'Aprendiz'.");
        scoreCredibilidad -= 10;
      }
    }

    // REGLA 9: OLIMPO — VALIDAR CONFIG DE RED SOCIAL
    if (targetNetwork && contentType === 'guion') {
      let networkConfigObj: any = {};
      try {
        networkConfigObj = typeof expertProfile.network_config === 'string'
          ? JSON.parse(expertProfile.network_config)
          : (expertProfile.network_config || {});
      } catch { networkConfigObj = {}; }

      const netCfg = networkConfigObj[targetNetwork.toLowerCase()];
      if (netCfg && netCfg.depth && netCfg.depth !== 'auto') {
        const texto = content.guion_completo || content.guion_tecnico_completo || '';
        const palabras = texto.split(' ').length;
        if (netCfg.depth === 'superficial' && palabras > 200) {
          warnings.push(`⚠️ RED: Para ${targetNetwork.toUpperCase()} tienes configurada profundidad 'superficial' pero el guion tiene ${palabras} palabras. Considera acortarlo.`);
          scoreCredibilidad -= 10;
        }
        if (netCfg.depth === 'profunda' && palabras < 150) {
          warnings.push(`⚠️ RED: Para ${targetNetwork.toUpperCase()} tienes configurada profundidad 'profunda' pero el guion es demasiado corto (${palabras} palabras).`);
          scoreCredibilidad -= 10;
        }
      }
    }

    // MODIFICACIONES SUGERIDAS
    const modifications: any = {};

    if (scoreCredibilidad < 70) {
      modifications.sugerencia_ajuste = "Considera ajustar el contenido para alinearlo mejor con tu perfil de experto.";

      if (authority_type === 'academica') {
        modifications.accion_recomendada = "Agrega una estadística o referencia a estudio.";
      }
      if (authority_type === 'practica') {
        modifications.accion_recomendada = "Menciona un caso real o resultado específico.";
      }
      if (main_objective === 'leads') {
        modifications.accion_cta = "Agrega un CTA claro: link en bio, DM, o registro.";
      }
    }

    return {
      approved,
      warnings,
      score_credibilidad: Math.max(0, scoreCredibilidad),
      modifications
    };
  }

  // ─── FUNCIÓN 3: GET NETWORK OVERRIDE ─────────────────────────────────────────
  // Retorna configuración específica para la red, o null si es 'auto'
  static getNetworkOverride(expertProfile: any, network: string): Record<string, string> | null {
    if (!expertProfile?.network_config) return null;
    const netConfig = this.parseNetworkConfig(expertProfile.network_config);
    const cfg = netConfig[network];
    if (!cfg) return null;
    // Return only non-auto fields
    const overrides: Record<string, string> = {};
    for (const [key, val] of Object.entries(cfg)) {
      if (val !== 'auto') overrides[key] = val as string;
    }
    return Object.keys(overrides).length > 0 ? overrides : null;
  }

  // ─── FUNCIÓN 4: VALIDATE PROFILE COMPLETENESS ────────────────────────────────
  static validateProfileCompleteness(expertProfile: any): {
    isOlimpo: boolean;
    score: number;
    missing: string[];
    passed: string[];
  } {
    const missing: string[] = [];
    const passed: string[] = [];
    let score = 0;
    const total = 100;

    const check = (condition: boolean, label: string, points: number) => {
      if (condition) { passed.push(`✅ ${label}`); score += points; }
      else { missing.push(`❌ ${label}`); }
    };

    check(!!expertProfile.niche, 'Nicho definido', 5);
    check(!!expertProfile.sub_niche, 'Sub-nicho específico', 5);
    check(!!expertProfile.market_sophistication, 'Sofisticación de mercado', 5);
    check(!!expertProfile.market_awareness, 'Nivel de conciencia del mercado', 5);
    check(!!expertProfile.unique_positioning, 'Posicionamiento único', 5);
    check(!!expertProfile.enemy, 'Enemigo común definido', 3);
    check(!!expertProfile.main_objective, 'Objetivo principal de contenido', 5);
    check(!!expertProfile.point_a, 'Punto A del avatar definido', 5);
    check(!!expertProfile.point_b, 'Punto B (destino) definido', 5);
    check(!!expertProfile.tangible_result, 'Resultado tangible definido', 5);
    check(!!expertProfile.emotional_result, 'Resultado emocional definido', 5);
    check(!!expertProfile.mechanism_name, 'Mecanismo propietario nombrado', 5);
    check(!!expertProfile.framework, 'Framework metodológico definido', 5);
    check(!!expertProfile.mental_territory, 'Territorio Mental™ definido', 5);
    check(!!expertProfile.key_vocabulary, 'Vocabulario propietario configurado', 3);
    check(!!expertProfile.personality_archetype, 'Arquetipo de personalidad seleccionado', 3);
    check(!!expertProfile.origin_story, 'Historia de origen registrada', 3);
    check(!!expertProfile.client_results, 'Resultados de clientes documentados', 5);
    check(
      (() => {
        try {
          const nc = typeof expertProfile.network_config === 'string'
            ? JSON.parse(expertProfile.network_config) : (expertProfile.network_config || {});
          return Object.keys(nc).length > 0;
        } catch { return false; }
      })(),
      'Configuración por red social',
      8
    );
    check(
      (() => {
        try {
          const p = typeof expertProfile.prohibitions === 'string'
            ? JSON.parse(expertProfile.prohibitions) : (expertProfile.prohibitions || {});
          return Object.values(p).some(Boolean);
        } catch { return false; }
      })(),
      'Líneas rojas / prohibiciones activas',
      5
    );

    return {
      isOlimpo: score >= 80,
      score,
      missing,
      passed
    };
  }
}