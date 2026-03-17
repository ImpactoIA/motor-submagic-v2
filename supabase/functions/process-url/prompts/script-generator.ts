// ==================================================================================
// 🔥 PROMPT_GENERADOR_GUIONES_V800
// Conectado con campos REALES de:
//   • expert_profiles  → todos los campos del DEFAULT_FORM de ExpertProfile.tsx
//   • avatars          → todas las 7 capas OLIMPO de AvatarProfile.tsx
//   • documents        → content de KnowledgeBase.tsx (tabla: documents)
//   • content_items    → título + notas desde Calendar.tsx (si viene del calendario)
//   • QuickIdeas       → topic, gancho, strategyLoop, vectorEmocional, platform
//   • Imagen           → conceptoVisual ya analizado por analizarImagenEstrategica
// ==================================================================================

export const PROMPT_GENERADOR_GUIONES_V800 = (
  contexto: any,
  _viralDNA: any,
  settings: any = {}
): string => {

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 0 — EXTRACCIÓN CENTRAL
  // Una variable por campo. Sin repetición. Orden de prioridad descendente.
  // ════════════════════════════════════════════════════════════════════════════

  const tema     = contexto.tema_especifico || contexto.nicho || 'General';
  const nicho    = contexto.nicho || tema;

  // Settings del generador
  const plataforma       = settings.platform          || 'TikTok';
  const duracion         = settings.durationId        || settings.duration    || 'medium';
  const estructura       = settings.structure         || 'winner_rocket';
  const modoInterno      = settings.internalMode      || settings.internal_mode || 'viral_rapido';
  const formatoNarrativo = settings.narrativeFormat   || settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD';
  const intensidad       = settings.intensity         || 'equilibrado';
  const strategyLoop     = settings.strategyLoop      || settings.strategy_loop  || 'magnetic_loop';
  const vectorEmocional  = settings.vector_emocional  || 'dolor_profundo';
  const arquetipoVoz     = settings.arquetipo_voz     || 'autoridad_empatica';
  const objetivoCierre   = settings.closingObjective  || settings.closing_objective || 'seguidores';
  const hookMode         = settings.hookMode          || 'elite';
  const customHookRaw    = settings.customHook        || '';
  const culturalContext  = settings.culturalContext   || settings.cultural_context_usuario || '';
  const awareness        = settings.awareness         || 'Consciente del Problema';
  const situation        = settings.situation         || 'Dolor Agudo (Urgencia)';

  // Origen del input (idea, texto, imagen, calendar, quickideas)
  const modoGeneracion   = contexto.modo_generacion   || 'idea';
  const esImagen         = modoGeneracion === 'imagen';
  const esDesdeCalendario= !!(settings.fromCalendar || contexto.fromCalendar);
  const esDesdeIdeas     = !!(settings.fromIdeas     || contexto.fromIdeas);

  // TCA del Estratega (Paso 1 del pipeline)
  const tca            = contexto.estrategia_tca       || {};
  const planAtaque     = contexto.plan_ataque_estratega || '';
  const tcaConflicto   = tca.conflicto_central         || '';
  const tcaInsight     = tca.insight_explotable        || '';
  const tcaSector      = tca.sector_utilizado          || 'General';
  const tcaNivel       = tca.nivel_posicionamiento     || 'N2-N3';
  const tcaHook        = tca.hook_sectorial            || '';

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 1 — PERFIL EXPERTO (tabla: expert_profiles)
  // Todos los campos del DEFAULT_FORM de ExpertProfile.tsx
  // ════════════════════════════════════════════════════════════════════════════

  const ep = contexto.expertProfile || {};

  // Identidad
  const epName              = ep.name                  || '';
  const epNiche             = ep.niche                 || nicho;
  const epSubNiche          = ep.sub_niche             || '';
  const epMission           = ep.mission               || '';
  const epOriginStory       = ep.origin_story          || '';
  const epUniquePos         = ep.unique_positioning    || '';
  const epEnemy             = ep.enemy                 || '';
  const epMainObjective     = ep.main_objective        || 'autoridad';

  // Transformación
  const epTransformPromise  = ep.transformation_promise || '';
  const epPointA            = ep.point_a               || '';
  const epPointB            = ep.point_b               || '';
  const epTangibleResult    = ep.tangible_result       || '';
  const epEmotionalResult   = ep.emotional_result      || '';

  // Autoridad y prueba
  const epAuthorityLevel    = ep.authority_level       || 'practicante';
  const epAuthorityType     = ep.authority_type        || 'practica';
  const epDepthLevel        = ep.depth_level           || 'media';
  const epMentalTerritory   = ep.mental_territory      || '';
  const epCaseStudies       = ep.case_studies          || '';
  const epClientResults     = ep.client_results        || '';
  const epTestimonials      = ep.testimonials          || '';
  const epCertifications    = ep.certifications        || '';
  const epMediaAppearances  = ep.media_appearances     || '';

  // Mecanismo
  const epFramework         = ep.framework             || '';
  const epMechanismName     = ep.mechanism_name        || '';
  const epMethodologySteps  = ep.methodology_steps     || '';

  // ADN Verbal
  const epTone              = ep.tone                  || '';
  const epKeyVocabulary     = ep.key_vocabulary        || '';
  const epPersonalityArch   = ep.personality_archetype || '';
  const epPillar1           = ep.content_pillar_1      || '';
  const epPillar2           = ep.content_pillar_2      || '';
  const epVerbalAgg         = Number(ep.verbal_aggressiveness)   || 2;
  const epLexicalSoph       = Number(ep.lexical_sophistication)  || 3;
  const epStorytellingRatio = Number(ep.storytelling_ratio)      || 50;
  const epNarrativeRhythm   = ep.narrative_rhythm      || 'medio';
  const epPhraseType        = ep.phrase_type           || 'mixtas';
  const epMetaphorLevel     = Number(ep.metaphor_level)          || 2;
  const epForcefulness      = Number(ep.forcefulness_level)      || 3;
  const epEmotionality      = Number(ep.emotionality_level)      || 3;
  const epTechnicality      = Number(ep.technicality_level)      || 2;
  const epConfrontation     = Number(ep.confrontation_level)     || 3;
  const epPolarization      = Number(ep.polarization_level)      || 2;
  const epMaxControversy    = Number(ep.max_controversy)         || 3;
  const epMaxPersonalExp    = Number(ep.max_personal_exposure)   || 3;

  // Prohibiciones del experto
  const epProhib = (() => {
    try {
      const r = ep.prohibitions;
      return typeof r === 'string' ? JSON.parse(r) : (r || {});
    } catch { return {}; }
  })();

  // Config de red para la plataforma activa
  const epNet = (() => {
    try {
      const r = ep.network_config;
      const parsed = typeof r === 'string' ? JSON.parse(r) : (r || {});
      const key = plataforma.toLowerCase() as keyof typeof parsed;
      return parsed[key] || {};
    } catch { return {}; }
  })();

  const netTone       = epNet.tone          || 'auto';
  const netDepth      = epNet.depth         || 'auto';
  const netAggressive = epNet.aggressiveness|| 'auto';
  const netCloseType  = epNet.close_type    || 'auto';

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 2 — AVATAR (tabla: avatars)
  // 7 capas OLIMPO completas
  // ════════════════════════════════════════════════════════════════════════════

  const av = contexto.avatar || contexto.avatarProfile || {};

  // Capa 1 — Identidad
  const avName          = av.name              || '';
  const avPersonType    = av.person_type       || 'creador_contenido';
  const avExpLevel      = av.experience_level  || 'intermedio';
  const avCountry       = av.country_culture   || '';
  const avIndustry      = av.industry          || '';

  // Capa 2 — Objetivo
  const avPrimaryGoal   = av.primary_goal      || 'autoridad';
  const avSuccessModel  = av.success_model     || 'educador_serio';
  const avRiskLevel     = av.risk_level        || 'balanceado';

  // Capa 3 — Dolor (los más críticos para TCA N3→N2→N1)
  const avCentralPain   = av.central_pain      || '';
  const avFrustrations  = av.frustrations      || '';
  const avObstacles     = av.recurring_obstacles|| '';
  const avHiddenFears   = av.hidden_fears      || '';
  const avStagnation    = av.stagnation_feeling|| '';

  // Capa 4 — Deseo oculto
  const avHiddenDesire  = av.hidden_desire     || '';
  const avDomEmotion    = av.dominant_emotion  || 'curiosidad';
  const avDreamOutcome  = av.dream_outcome     || '';
  const avStatusAsp     = av.status_aspiration || '';

  // Capa 5 — Lenguaje natural
  const avCommStyle     = av.communication_style   || 'didactico';
  const avFormality     = av.formality_level        || 'semiformial';
  const avMentalRhythm  = av.mental_rhythm          || 'moderado';
  const avSigVocab      = Array.isArray(av.signature_vocabulary)
    ? av.signature_vocabulary.join(', ') : (av.signature_vocabulary || '');
  const avBannedVocab   = Array.isArray(av.banned_vocabulary)
    ? av.banned_vocabulary.join(', ') : (av.banned_vocabulary || '');
  const avSlang         = av.slang_or_expressions   || '';
  const avPrefCTA       = av.preferred_cta_style    || 'directo';
  const avNarrStr       = av.narrative_structure    || 'problema_solucion';
  const avContentPri    = av.content_priority       || 'educativo';

  // Capa 6 — Objeciones
  const avObjCommon     = av.common_objections      || '';
  const avObjTime       = av.time_objection         || '';
  const avObjCred       = av.credibility_objection  || '';
  const avObjComp       = av.competition_objection  || '';
  const avSelfDoubt     = av.self_doubt             || '';

  // Capa 7 — Triggers
  const avEmotTrig      = av.emotional_triggers     || '';
  const avUrgTrig       = av.urgency_trigger        || '';
  const avStatusTrig    = av.status_trigger         || '';
  const avBelongTrig    = av.belonging_trigger      || '';
  const avLossFear      = av.loss_fear_trigger      || '';

  // Capa OLIMPO
  const avAwarenessLvl  = av.awareness_level        || awareness;
  const avChangeRes     = av.change_resistance      || 'media';
  const avAudTemp       = av.audience_temperature   || 'tibio';
  const avInternalTone  = av.internal_tone          || '';
  const avTimeline      = av.timeline_expectation   || '';
  const avSocialPain    = av.social_pain            || '';
  const avTransformPtA  = av.transformation_point_a || '';
  const avInternalObs   = av.internal_obstacle      || '';
  const avExternalObs   = av.external_obstacle      || '';
  const avEmotFriction  = av.emotional_friction     || '';

  // Prohibiciones del avatar
  const avProhib = av.prohibitions || {};

  // Directives del AvatarMiddleware
  const avatarDirectives = contexto.avatarDirectives || '';

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 3 — KNOWLEDGE BASE (tabla: documents)
  // ════════════════════════════════════════════════════════════════════════════

  const kb = contexto.knowledge_base_content
    ? contexto.knowledge_base_content.substring(0, 1500)
    : '';

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 4 — ORIGEN DEL INPUT
  // Trata diferente cada fuente: imagen, QuickIdeas, Calendario, texto libre
  // ════════════════════════════════════════════════════════════════════════════

  const ORIGEN_INPUT = (() => {
    if (esImagen) {
      return `ORIGEN: IMAGEN VISUAL ANALIZADA
El usuario subió una imagen. El concepto visual ya fue extraído por el analizador de visión.
Tema derivado de la imagen: "${tema}"

INSTRUCCIÓN ESPECIAL PARA IMAGEN:
La imagen es el gancho visual. El teleprompter debe describir exactamente lo que el espectador VE
y conectarlo con el dolor o deseo más profundo del avatar.
El Plan Audiovisual debe indicar cómo usar esa imagen como B-Roll o frame de apertura.
No inventes elementos que no están en la imagen — amplifica lo que SÍ está.`;
    }

    if (esDesdeIdeas) {
      return `ORIGEN: IDEA RÁPIDA (generada por el Cerebro Estratégico)
Idea base: "${tema}"
Gancho sugerido por Ideas Rápidas: "${customHookRaw || 'usar el más poderoso según contexto'}"
Strategy Loop mapeado: ${strategyLoop}
Vector emocional mapeado: ${vectorEmocional}

INSTRUCCIÓN ESPECIAL DESDE IDEAS RÁPIDAS:
Esta idea ya pasó por TCA y tiene un gancho pre-analizado.
Usa el gancho sugerido como base OBLIGATORIA del hook.
El TCA ya está resuelto — no expandas el tema innecesariamente, desarrolla la idea exacta.`;
    }

    if (esDesdeCalendario) {
      return `ORIGEN: CALENDARIO EDITORIAL
El usuario programó este contenido con antelación.
Título del evento: "${tema}"
Notas/contexto del calendario: "${settings.calendarNotes || ''}"
Formato planificado: "${settings.calendarFormat || ''}"

INSTRUCCIÓN ESPECIAL DESDE CALENDARIO:
Este guion debe respetar el tema y formato planificados.
El calendario define el compromiso — el guion debe honrar esa intención editorial.`;
    }

    if (modoGeneracion === 'texto') {
      return `ORIGEN: TEXTO LARGO (el usuario pegó contenido propio)
El sistema ya analizó la estructura implícita del texto.
Conflicto central detectado: "${tcaConflicto || 'extraer del texto'}"
Insight explotable: "${tcaInsight || 'extraer del texto'}"

INSTRUCCIÓN ESPECIAL PARA TEXTO LARGO:
No repitas el texto — transmuútalo. Extrae el mecanismo narrativo y reconstruye
con la voz del creador, el gancho correcto y la arquitectura del formato elegido.
El usuario no quiere su texto reformateado — quiere su IDEA amplificada.`;
    }

    return `ORIGEN: IDEA DIRECTA DEL CREADOR
Tema: "${tema}"`;
  })();

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 5 — RESOLUCIÓN DEL HOOK
  // ════════════════════════════════════════════════════════════════════════════

  const ELITE_HOOK_MAP: Record<string, string> = {
    enemigo_comun:
      `GANCHO — ENEMIGO COMÚN:
       Enemigo real del avatar: "${epEnemy || avCentralPain || 'el sistema que perpetúa el problema'}"
       Primera frase = acusación directa al culpable externo. Sin suavizadores.
       El avatar siente: "Por fin alguien nombra lo que yo no me atrevía a decir."
       Fórmula: "[Ellos/El sistema/La industria] [verbo de traición] [lo que el avatar desea/merece]"`,

    verdad_impopular:
      `GANCHO — VERDAD IMPOPULAR:
       Verdad que el sector "${epNiche || nicho}" evita por comodidad o interés económico.
       Primera frase = afirmación que el 80% del nicho considerará incómoda pero irrefutable.
       Nivel de controversia del creador: ${epMaxControversy}/5 — calibrar en consecuencia.
       Fórmula: "Lo que nadie en [nicho] te dice porque [razón de por qué lo ocultan]"`,

    error_novato:
      `GANCHO — ERROR DE NOVATO:
       Error específico que comete el avatar en "${avIndustry || nicho}" ahora mismo sin saberlo.
       Relacionado con sus obstáculos recurrentes: "${avObstacles || 'sus intentos fallidos habituales'}"
       Primera frase = señalar el error con precisión quirúrgica.
       Fórmula: "[Número]% de [audiencia] hace [error específico] y no sabe que [consecuencia]"`,

    secreto_industria:
      `GANCHO — SECRETO DE LA INDUSTRIA:
       Mecanismo oculto que los que dominan "${epNiche || nicho}" prefieren que nadie sepa.
       Relacionado con el posicionamiento único: "${epUniquePos || 'lo que diferencia al creador'}"
       Primera frase = loop de conspiración controlada.
       Fórmula: "Lo que [referente/industria/élite] no enseña sobre [tema] porque [razón]"`,

    promesa_contraintuitiva:
      `GANCHO — PROMESA CONTRAINTUITIVA:
       Acción opuesta a la lógica convencional de "${epNiche || nicho}".
       Conectada con el reencuadre del territorio mental: "${epMentalTerritory || tema}"
       Primera frase = disonancia cognitiva inmediata.
       Fórmula: "Deja de [acción convencional]. Empieza a [acción contraintuitiva]. Así es como [resultado]"`,
  };

  let hookDefinition = '';
  if (hookMode === 'elite' && settings.eliteHookId) {
    hookDefinition = ELITE_HOOK_MAP[settings.eliteHookId]
      || `Hook ${settings.eliteHookId} — máxima especificidad al contexto del creador.`;
  } else if (hookMode === 'custom' && customHookRaw) {
    hookDefinition = `GANCHO EXACTO DEL CREADOR (obligatorio usar):
"${customHookRaw}"
Usa esta frase como primera línea o versión directamente más poderosa. No la suavices. No la reescribas sin conservar su esencia.`;
  } else if (hookMode === 'arsenal' && settings.arsenalHook) {
    hookDefinition = `TIPO ARSENAL: ${settings.arsenalHook}
Aplicar este tipo con máxima especificidad al dolor "${avCentralPain || tema}" y al nicho "${epNiche || nicho}".`;
  } else {
    hookDefinition = `Hook directo al dolor "${avCentralPain || tema}". Sin presentación. Primera frase = golpe.`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 6 — AWARENESS → PUNTO DE ENTRADA TCA
  // El awareness del generador tiene prioridad sobre el del avatar
  // ════════════════════════════════════════════════════════════════════════════

  const awarenessEfectivo = awareness !== 'Consciente del Problema'
    ? awareness
    : (avAwarenessLvl || awareness);

  const AWARENESS_ENTRY: Record<string, string> = {
    'Totalmente Inconsciente':
      `NIVEL TCA: INCONSCIENTE TOTAL — Apertura en N3 OBLIGATORIO.
       Este avatar NO sabe que tiene el problema. NO conoce el nicho.
       
       PROHIBIDO en primeras 6 líneas: "${epNiche || nicho}", "${epMechanismName || 'nombre del mecanismo'}", cualquier término técnico.
       ${avCountry ? `Usar referencias culturales de: ${avCountry}` : ''}
       
       Recorrido N3 → N2 → N1:
       • N3 (línea 1-3): Situación cotidiana universal — cualquier persona la reconoce
         Conectada con: "${avStagnation || avCentralPain || 'la frustración universal del avatar'}"
       • N2 (línea 4-6): Giro que conecta esa situación con el dolor oculto
         Usando: "${avEmotFriction || avHiddenFears || 'el miedo que no nombra'}"
       • N1 (línea 7+): Aparece por primera vez el contexto específico del creador
       
       EJEMPLO DEL PATRÓN:
       ❌ MAL: "Si eres [profesión del nicho] y quieres [resultado]..."
       ✅ BIEN: "[Situación que todos viven] → [Giro] → [Revelación del problema real]"`,

    'Consciente del Problema':
      `NIVEL TCA: CONSCIENTE DEL PROBLEMA — Apertura en N2.
       El avatar sabe que tiene el problema pero culpa a la causa EQUIVOCADA.
       Su dolor real: "${avCentralPain || 'no obtener resultados a pesar del esfuerzo'}"
       Lo que cree que es culpa: "${avObjCommon || avSelfDoubt || 'su propia limitación'}"
       
       Recorrido N2 → N1:
       • Línea 1-2: Nombra el dolor directamente. Sin rodeos.
       • Línea 3-5: "No es [causa que el avatar cree]. La causa real es [causa que revelarás]"
         Enemigo a señalar: "${epEnemy || 'la narrativa falsa que les vendieron'}"
       • Línea 6+: Tu mecanismo como solución: "${epMechanismName || epFramework || 'el sistema del creador'}"`,

    'Consciente de la Solución':
      `NIVEL TCA: CONSCIENTE DE LA SOLUCIÓN — Apertura atacando soluciones fallidas.
       El avatar probó soluciones. Ninguna funcionó.
       Sus intentos fallidos: "${avObstacles || avFrustrations || 'los métodos convencionales del nicho'}"
       Su frustración específica: "${avStagnation || 'seguir sin ver resultados reales'}"
       
       Recorrido:
       • Línea 1-2: "[Las soluciones que probaste] no funcionan porque [mecanismo oculto]"
       • Línea 3-5: El mecanismo que hace fallar a las demás soluciones
       • Línea 6+: Tu enfoque diferente — "${epUniquePos || epMechanismName || 'la diferencia real'}"`,

    'Consciente del Producto':
      `NIVEL TCA: CONSCIENTE DEL PRODUCTO — Apertura directa con resultado.
       El avatar ya te conoce o conoce tu categoría.
       Resultado diferencial comprobado: "${epTangibleResult || epClientResults || 'resultado específico'}"
       
       Recorrido:
       • Línea 1: Resultado concreto con número o métrica. Sin contexto previo.
       • Línea 2-4: Por qué otros no lo lograron. Enemigo: "${epEnemy || 'los que enseñan sin resultados reales'}"
       • Línea 5+: Mecanismo exacto: "${epMechanismName || epFramework || 'el sistema exclusivo'}"`,
  };

  const awarenessInstruction = AWARENESS_ENTRY[awarenessEfectivo]
    || AWARENESS_ENTRY['Consciente del Problema'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 7 — FORMATO NARRATIVO → ARQUITECTURA CON DATOS REALES
  // ════════════════════════════════════════════════════════════════════════════

  type FmtKey =
    | 'EDUCATIVO_AUTORIDAD'   | 'STORYTELLING_EMOCIONAL' | 'ANUNCIO_DIRECTO'
    | 'ANUNCIO_INDIRECTO'     | 'OPINION_POLARIZACION'   | 'CASO_ESTUDIO'
    | 'TUTORIAL_PASO_A_PASO'  | 'PODCAST_REFLEXIVO'      | 'MASTERCLASS_COMPRIMIDA'
    | 'FRAME_DISRUPTIVO';

  const FORMAT_ARCH: Record<FmtKey, string> = {
    EDUCATIVO_AUTORIDAD:
      `TESIS PROVOCADORA sobre "${epNiche || nicho}"
       → EVIDENCIA CONTRAINTUITIVA: ${epCaseStudies || epClientResults || 'datos del creador'}
       → SISTEMA NOMBRADO: "${epMechanismName || epFramework || 'el método del creador'}"
       → APLICACIÓN INMEDIATA para avatar tipo: ${avPersonType}, nivel ${avExpLevel}
       → CTA DE POSICIONAMIENTO alineado con: ${objetivoCierre}
       PROHIBIDO: tips genéricos que cualquier IA generaría sin el perfil del creador.`,

    STORYTELLING_EMOCIONAL:
      `IN MEDIA RES — La escena comienza en el momento de máximo conflicto.
       Punto A de la historia: "${epPointA || avTransformPtA || 'la situación inicial real'}"
       El giro: de "${epPointA || 'antes'}" a "${epPointB || avDreamOutcome || 'después'}"
       Historia de origen disponible: "${epOriginStory ? epOriginStory.substring(0, 200) : 'construir desde el punto A y B del experto'}"
       Vulnerabilidad permitida: ${epMaxPersonalExp}/5
       Storytelling ratio del creador: ${epStorytellingRatio}%
       PROHIBIDO: "Les voy a contar una historia..." / introducción antes de la escena.`,

    ANUNCIO_DIRECTO:
      `FILTRO AVATAR — 1 frase que selecciona exactamente a:
       "${avPersonType} en ${avIndustry || nicho}, nivel ${avExpLevel}, que sufre ${avCentralPain || 'el problema central'}"
       → DOLOR AFILADO: "${avCentralPain || avFrustrations}"
       → SOLUCIÓN DIFERENCIADA: "${epUniquePos || epMechanismName}"
       → PRUEBA IMPLÍCITA: "${epTangibleResult || epClientResults || 'resultado demostrable'}"
       → CTA ÚNICO estilo "${avPrefCTA}"
       PROHIBIDO: mencionar la solución antes de atacar el dolor dos veces.`,

    ANUNCIO_INDIRECTO:
      `VALOR PURO relacionado con "${epPillar1 || tema}" — sin pedir nada.
       → PROBLEMA IMPLÍCITO que vive el avatar: "${avCentralPain || avFrustrations}"
       → CONEXIÓN ORGÁNICA con "${epUniquePos || epMechanismName}"
       → CTA SUAVE estilo "${avPrefCTA}" — el avatar no percibe que es un anuncio hasta el final.
       Emocionalidad del creador: ${epEmotionality}/5 — usarla para crear confianza gradual.`,

    OPINION_POLARIZACION:
      `DECLARACIÓN DIVISIVA — Primera frase divide en dos bandos.
       Sobre: "${epEnemy || 'la narrativa dominante en ' + (epNiche || nicho)}"
       → ARGUMENTO IRREFUTABLE basado en: "${epCaseStudies || epTangibleResult || 'evidencia real'}"
       → ATAQUE AL ENEMIGO explícito: "${epEnemy || 'los que perpetúan el problema'}"
       → LLAMADA A LA TRIBU usando trigger: "${avBelongTrig || avStatusTrig}"
       → CTA DE IDENTIDAD
       Polarización del creador: ${epPolarization}/5. Confrontación: ${epConfrontation}/5.
       PROHIBIDO: "por un lado... pero por otro" — el creador NO cede su postura.`,

    CASO_ESTUDIO:
      `RESULTADO PRIMERO: "${epTangibleResult || epClientResults || 'caso real documentado'}"
       → PUNTO A INICIAL: "${epPointA || avTransformPtA || 'situación antes'}"
       → SISTEMA APLICADO: "${epMechanismName || epFramework || 'metodología del creador'}"
       → RESULTADO MEDIBLE con número concreto
       → PRINCIPIO REPLICABLE que el avatar puede aplicar hoy
       → CTA
       PROHIBIDO: presentar contexto antes del resultado.`,

    TUTORIAL_PASO_A_PASO:
      `PROMESA HIPER-ESPECÍFICA basada en: "${epTangibleResult || epTransformPromise}"
       → POR QUÉ LOS DEMÁS FALLAN: no conocen "${epMechanismName || 'el mecanismo correcto'}"
       → PASOS del método: ${epMethodologySteps || epFramework || 'los pasos del sistema del creador'}
         Cada paso incluye el error más común: derivado de "${avObstacles || avFrustrations}"
       → CTA DE URGENCIA conectado con: "${avUrgTrig || avLossFear || 'lo que el avatar arriesga si no actúa'}"`,

    PODCAST_REFLEXIVO:
      `PREGUNTA ÍNTIMA que el avatar piensa pero nunca dice sobre "${tema}"
       Relacionada con: "${avInternalTone || avSelfDoubt || avHiddenFears}"
       → EXPLORACIÓN HONESTA desde el territorio mental: "${epMentalTerritory || tema}"
       → REENCUADRE INESPERADO usando: "${epUniquePos || epMechanismName}"
       → NUEVA PREGUNTA que amplía la perspectiva
       → CIERRE ABIERTO — NO dar la respuesta definitiva.
       Exposición personal: ${epMaxPersonalExp}/5. PROHIBIDO: CTA de venta directa.`,

    MASTERCLASS_COMPRIMIDA:
      `PROMESA DE TRANSFORMACIÓN: "${epTransformPromise || `de "${epPointA}" a "${epPointB}"`}"
       → MAPA DEL SISTEMA: "${epMechanismName || epFramework}"
       → CONCEPTO 1 + ejemplo real de: "${epCaseStudies || 'caso propio'}"
       → CONCEPTO 2 + aplicación para: ${avPersonType} nivel ${avExpLevel}
       → CONCEPTO 3 + resultado: "${epTangibleResult || 'transformación medible'}"
       → SÍNTESIS en frase memorable ≤10 palabras
       → CTA alineado con ${objetivoCierre}`,

    FRAME_DISRUPTIVO:
      `AFIRMACIÓN IMPOSIBLE sobre: "${epEnemy || 'la creencia dominante en ' + (epNiche || nicho)}"
       → EVIDENCIA que la sostiene: "${epCaseStudies || epTangibleResult || epClientResults}"
       → REENCUADRE TOTAL desde: "${epMentalTerritory || 'la perspectiva del creador'}"
       → NUEVA ACCIÓN que antes parecía ilógica — conectada con "${epUniquePos}"
       → CTA DE RUPTURA
       PROHIBIDO: suavizar la afirmación inicial / disculparse por la postura.`,
  };

  const formatArch = FORMAT_ARCH[formatoNarrativo as FmtKey]
    || FORMAT_ARCH['EDUCATIVO_AUTORIDAD'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 8 — COMBINACIONES FORMATO + GANCHO + LOOP
  // Instrucciones específicas para combinaciones que generan conflicto
  // ════════════════════════════════════════════════════════════════════════════

  const COMBO_INSTRUCTION = (() => {
    const f = formatoNarrativo;
    const h = settings.eliteHookId || '';
    const l = strategyLoop;

    if (f === 'STORYTELLING_EMOCIONAL' && h === 'enemigo_comun')
      return `COMBO Storytelling + Enemigo Común:
La historia DEBE tener un antagonista explícito: "${epEnemy || 'la narrativa que les frenó'}".
El avatar es el héroe. El enemigo es externo — NUNCA el propio avatar.
La transformación es de víctima del enemigo a constructor del sistema propio.`;

    if (f === 'OPINION_POLARIZACION' && intensidad === 'dominante')
      return `COMBO Opinión + Dominante:
La primera frase hace que la mitad del feed quiera irse y la otra mitad quiera quedarse.
Sin suavizadores. Sin "en mi opinión". Sin "quizás".
El creador habla como alguien que ya ganó el debate — no como alguien que está tratando de ganarlo.`;

    if (f === 'EDUCATIVO_AUTORIDAD' && l === 'viral_loop')
      return `COMBO Educativo + Viral Loop:
El conocimiento se entrega en FRAGMENTOS que abren loops.
Nunca entregas el dato completo hasta el penúltimo bloque.
Cada bloque termina con "pero hay algo más que nadie en ${epNiche || nicho} te cuenta..."`;

    if (f === 'ANUNCIO_DIRECTO' && l === 'magnetic_loop')
      return `COMBO Anuncio Directo + Magnetic Loop:
El dolor se escala bloque a bloque — no se resuelve hasta el CTA.
Cada bloque añade una capa de urgencia sobre el dolor: "${avCentralPain}"
El CTA es la única salida del loop que el avatar tiene disponible.`;

    if (f === 'FRAME_DISRUPTIVO' && epPolarization >= 4)
      return `COMBO Frame Disruptivo + Alta Polarización (${epPolarization}/5):
La afirmación inicial debe ser la más controversial que el perfil del creador permite.
No hay escala gradual — golpe directo desde la primera línea.
Nivel de confrontación máximo permitido: ${epConfrontation}/5.`;

    return `Combina "${f}" con gancho tipo "${settings.eliteHookId || hookMode}".
El gancho es la primera frase. El formato dicta la progresión del resto.
Cada bloque debe ser coherente con la voz del creador (${epTone || arquetipoVoz}).`;
  })();

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 9 — INTENSIDAD + ADN VERBAL DEL CREADOR
  // Calibrado con los sliders REALES del ExpertProfile
  // ════════════════════════════════════════════════════════════════════════════

  const INTENSITY_VOICE: Record<string, string> = {
    conservador:
      `TONO CONSERVADOR — Agresividad verbal: ${epVerbalAgg}/5. Metáforas: ${epMetaphorLevel}/5.
       La autoridad se construye por profundidad, no confrontación.
       Sofisticación léxica: ${epLexicalSoph}/5.
       ${epProhib.ataques_personales ? '⛔ PROHIBIDO: ataques personales (configurado por el creador).' : ''}
       ${epProhib.contenido_superficial ? '⛔ PROHIBIDO: contenido superficial (configurado).' : ''}`,

    equilibrado:
      `TONO EQUILIBRADO — Firmeza sin agresividad.
       Agresividad: ${epVerbalAgg}/5. Contundencia: ${epForcefulness}/5. Emocionalidad: ${epEmotionality}/5.
       Tecnicidad: ${epTechnicality}/5. Storytelling: ${epStorytellingRatio}% narrativo.
       Ritmo de frases: ${epNarrativeRhythm}. Tipo de frase: ${epPhraseType}.
       ${epProhib.simplificaciones_extremas ? '⛔ PROHIBIDO: simplificaciones extremas.' : ''}`,

    agresivo:
      `TONO AGRESIVO — Confrontación directa al statu quo.
       Agresividad: ${epVerbalAgg}/5. Controversia máxima: ${epMaxControversy}/5.
       Confrontación: ${epConfrontation}/5. Polarización: ${epPolarization}/5.
       ${epProhib.ataques_personales ? '⛔ PROHIBIDO: ataques personales.' : '✅ Ataques conceptuales permitidos.'}
       ${epProhib.promesas_rapidas ? '⛔ PROHIBIDO: promesas de resultado inmediato.' : ''}
       Frases de choque en registro: "${epTone || 'directo y sin filtros'}"`,

    dominante:
      `TONO DOMINANTE — Máxima disrupción dentro del perfil real del creador.
       Polarización: ${epPolarization}/5. Confrontación: ${epConfrontation}/5.
       Controversia: ${epMaxControversy}/5. Exposición personal: ${epMaxPersonalExp}/5.
       ${epProhib.polemica_barata ? '⛔ PROHIBIDO: polémica sin sustento.' : ''}
       ${epProhib.opinion_sin_prueba ? '⛔ PROHIBIDO: opinión sin evidencia.' : ''}
       El creador toma postura radical — NO la cede. Cada frase es una declaración de poder.`,
  };

  const intensityVoice = INTENSITY_VOICE[intensidad] || INTENSITY_VOICE['equilibrado'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 10 — STRATEGY LOOP ♾️ CALIBRADO CON TRIGGERS REALES DEL AVATAR
  // ════════════════════════════════════════════════════════════════════════════

  const LOOP_MAP: Record<string, string> = {
    magnetic_loop:
      `MAGNETIC LOOP ♾️:
       Motor del loop: el miedo a perder "${avLossFear || avHiddenFears || avDreamOutcome}"
       Fórmula de cierre de bloque:
       "[Dato/acción] ... pero lo que muy pocos en ${avIndustry || nicho} descubren es [siguiente bloque]"
       El espectador no puede irse porque siente que perderá acceso a "${avDreamOutcome || avHiddenDesire}"`,

    engagement_loop:
      `ENGAGEMENT LOOP ♾️:
       Trigger de comentario: "${avEmotTrig || avUrgTrig || avCentralPain}"
       Afirmación polarizante en bloque 3: divide entre quienes hacen X vs Y
       Conectada con el trigger de pertenencia: "${avBelongTrig || avStatusAsp}"
       CTA estilo: "${avPrefCTA}" — pregunta que el avatar NECESITA responder`,

    authority_loop:
      `AUTHORITY LOOP ♾️:
       Cada bloque entrega un dato que el ${avExpLevel === 'experto' ? '99%' : '95%'} del nicho desconoce.
       Autoridad demostrada por: "${epCertifications || epMediaAppearances || epCaseStudies || 'resultados reales'}"
       Territorio mental reclamado: "${epMentalTerritory || epNiche || nicho}"
       Nivel de autoridad declarado: ${epAuthorityLevel} (${epAuthorityType})
       La frase de autoridad del bloque central: algo que SOLO alguien con esa trayectoria podría decir.`,

    viral_loop:
      `VIRAL LOOP ♾️ — 2 Open Loops obligatorios:
       Open Loop 1 (bloque 1-2) — basado en miedo: "${avHiddenFears || tcaConflicto}"
       Frase para abrir loop 1: "¿Y si todo lo que te dijeron sobre ${tema} está diseñado para que nunca lo consigas?"
       Open Loop 2 (bloque 3) — basado en insight: "${tcaInsight || epUniquePos}"
       Frase para abrir loop 2: "Lo que descubrí después fue lo que nadie en ${epNiche || nicho} tiene incentivos para enseñarte..."
       Resolución (bloque 5): cierra ambos loops con "${epMechanismName || epFramework || 'el mecanismo del creador'}"`,
  };

  const loopInstruction = LOOP_MAP[strategyLoop] || LOOP_MAP['magnetic_loop'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 11 — ARQUETIPO DE VOZ + LENGUAJE REAL DEL AVATAR
  // ════════════════════════════════════════════════════════════════════════════

  const ARCHETYPE_MAP: Record<string, string> = {
    dominante_agresivo:
      `VOZ DOMINANTE/AGRESIVA:
       Agresividad: ${epVerbalAgg}/5. Tecnicidad: ${epTechnicality}/5.
       ${epKeyVocabulary ? `Vocabulario clave del creador: "${epKeyVocabulary}"` : ''}
       ${avBannedVocab ? `PROHIBIDO usar: "${avBannedVocab}"` : ''}
       Metáforas: ${epMetaphorLevel}/5 — mínimas y concretas.
       Frases ${epPhraseType}. PROHIBIDO: lenguaje florido.`,

    sabio_filosofico:
      `VOZ SABIA/FILOSÓFICA:
       Sofisticación léxica: ${epLexicalSoph}/5.
       ${epKeyVocabulary ? `Vocabulario del creador: "${epKeyVocabulary}"` : ''}
       Conecta "${tema}" con verdades universales. Usa paradojas y preguntas retóricas.
       Ritmo: ${epNarrativeRhythm}. Profundidad: ${epDepthLevel}.`,

    autoridad_empatica:
      `VOZ AUTORIDAD EMPÁTICA:
       Emocionalidad: ${epEmotionality}/5. Contundencia: ${epForcefulness}/5.
       Reconoce "${avCentralPain || 'el dolor del avatar'}" ANTES de entregar la solución.
       ${epKeyVocabulary ? `Vocabulario del creador: "${epKeyVocabulary}"` : ''}
       ${avSlang ? `Expresiones del avatar: "${avSlang}"` : ''}
       ${avSigVocab ? `Vocabulario que el avatar reconoce y espera: "${avSigVocab}"` : ''}
       Storytelling: ${epStorytellingRatio}% narrativo. No predica — conversa.`,

    analitico_frio:
      `VOZ ANALÍTICA/FRÍA:
       Tecnicidad: ${epTechnicality}/5. Sofisticación: ${epLexicalSoph}/5.
       Emocionalidad: ${epEmotionality}/5 — usarla estratégicamente.
       ${epCaseStudies || epClientResults ? `Datos reales: "${(epCaseStudies || epClientResults).substring(0, 100)}"` : ''}
       PROHIBIDO: afirmaciones sin sustento lógico.`,

    revelador_confesional:
      `VOZ REVELADORA/CONFESIONAL:
       El creador revela algo que "no debería decir".
       Historia de origen como palanca: "${epOriginStory ? epOriginStory.substring(0, 150) : 'construir desde la cicatriz del creador'}"
       Exposición personal: ${epMaxPersonalExp}/5.
       ${avEmotFriction ? `Fricción emocional del avatar a tocar: "${avEmotFriction}"` : ''}
       Emocionalidad: ${epEmotionality}/5.`,
  };

  const archetypeStyle = ARCHETYPE_MAP[arquetipoVoz] || ARCHETYPE_MAP['autoridad_empatica'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 12 — PLATAFORMA CON CONFIG REAL DEL CREADOR (network_config)
  // ════════════════════════════════════════════════════════════════════════════

  const PLATFORM_MAP: Record<string, string> = {
    TikTok:
      `TIKTOK NATIVO:
       Tono configurado: ${netTone !== 'auto' ? netTone : 'directo, sin filtros'}
       Profundidad: ${netDepth !== 'auto' ? netDepth : 'contundente y comprimido'}
       Agresividad: ${netAggressive !== 'auto' ? netAggressive : `nivel ${epVerbalAgg}/5`}
       Cierre: ${netCloseType !== 'auto' ? netCloseType : avPrefCTA}
       Frases ≤8 palabras. Retención en segundos 3, 15, 45.
       CTA: pregunta binaria usando trigger "${avUrgTrig || avEmotTrig || 'el dolor más urgente'}"`,

    Reels:
      `REELS NATIVO:
       Tono: ${netTone !== 'auto' ? netTone : 'aspiracional, humano'}
       Algoritmo premia GUARDADOS (5x vs likes).
       Frase guardable en bloque 4: ≤12 palabras, conectada con "${avStatusAsp || avDreamOutcome}"
       CTA: "Guarda esto porque lo vas a necesitar cuando ${avCentralPain || 'lo necesites'}"
       Estilo: ${avPrefCTA}`,

    YouTube:
      `YOUTUBE NATIVO:
       Tono: ${netTone !== 'auto' ? netTone : 'profesional, educativo'}
       Promete en bloque 1 exactamente lo que entregará en bloque 5.
       Los Shorts se reproducen en bucle — el cierre conecta con la apertura.
       CTA que genera debate: divide en dos posiciones sobre "${epMentalTerritory || tema}"`,

    LinkedIn:
      `LINKEDIN NATIVO:
       Tono: ${netTone !== 'auto' ? netTone : 'ejecutivo, sobrio'}
       Algoritmo premia comentarios en primeros 60 minutos.
       Profundidad: ${netDepth !== 'auto' ? netDepth : 'alta — no motivacional'}
       CTA: pregunta que divide en dos posiciones profesionales sobre "${tema}"
       PROHIBIDO: links en el texto.`,

    Facebook:
      `FACEBOOK NATIVO:
       70% ve sin audio — texto en pantalla obligatorio en el plan audiovisual.
       Apertura cálida — tono: "${avCommStyle}" y "${avFormality}"
       CTA: UNA pregunta que divide opiniones. Debate = distribución orgánica.
       PROHIBIDO: múltiples CTAs / engagement bait explícito.`,
  };

  const platformRules = PLATFORM_MAP[plataforma] || PLATFORM_MAP['TikTok'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 13 — CTA CALIBRADO CON OBJETIVO + AVATAR
  // ════════════════════════════════════════════════════════════════════════════

  const CTA_MAP: Record<string, { cta: string; mecanismo: string }> = {
    seguidores: {
      cta: `"Sígueme si quieres más de esto sobre ${tema}."
Pero adaptado a la tribu del creador — no un CTA genérico.
Usar trigger de pertenencia: "${avBelongTrig || avStatusAsp || 'la identidad que el avatar quiere tener'}"`,
      mecanismo: 'Identidad tribal — el avatar no sigue una cuenta, entra a una tribu.',
    },
    leads: {
      cta: `"Tengo [recurso específico relacionado con ${epMechanismName || tema}] en mi bio."
El recurso debe resolver exactamente "${avCentralPain || 'el problema central del avatar'}"`,
      mecanismo: 'Micro-conversión sin fricción — el recurso es la respuesta directa al dolor.',
    },
    venta: {
      cta: `"Si estás listo para pasar de '${epPointA || avTransformPtA || 'tu situación actual'}' a '${epPointB || avDreamOutcome || 'tu resultado deseado'}', el link está en mi bio."
NO se menciona el producto — se menciona la transformación.`,
      mecanismo: 'Venta por transformación — el avatar compra el resultado, no el servicio.',
    },
    autoridad: {
      cta: `"¿Cuál es tu mayor duda sobre ${tema}? Respondo a todos."
Usando trigger de status: "${avStatusTrig || 'el reconocimiento que el avatar busca'}"`,
      mecanismo: 'Liderazgo intelectual — el creador se posiciona como referente accesible.',
    },
  };

  const ctaConfig = CTA_MAP[objetivoCierre] || CTA_MAP['seguidores'];

  // ════════════════════════════════════════════════════════════════════════════
  // BLOQUE 14 — LONGITUD OBJETIVO + PROHIBICIONES COMBINADAS
  // ════════════════════════════════════════════════════════════════════════════

  const WORD_TARGETS: Record<string, string> = {
    short:       'MÍNIMO 70 palabras, MÁXIMO 85 (Flash 30s)',
    medium:      'MÍNIMO 140 palabras, MÁXIMO 175 (Estándar 60s)',
    long:        'MÍNIMO 200 palabras, MÁXIMO 240 (Profundo 90s)',
    masterclass: 'MÍNIMO 700 palabras, MÁXIMO 1200 (Masterclass +5min)',
  };
  const wordTarget = WORD_TARGETS[duracion] || WORD_TARGETS['medium'];

  // Prohibiciones combinadas (experto + avatar, sin duplicados)
  const prohibicionesActivas = [
    epProhib.promesas_rapidas        && '⛔ Sin promesas de resultado inmediato (experto)',
    epProhib.simplificaciones_extremas && '⛔ Sin simplificaciones extremas (experto)',
    epProhib.ataques_personales       && '⛔ Sin ataques personales (experto)',
    epProhib.opinion_sin_prueba       && '⛔ Toda opinión necesita evidencia (experto)',
    epProhib.contenido_superficial    && '⛔ Sin contenido superficial (experto)',
    avProhib.lenguaje_vulgar          && '⛔ Sin lenguaje vulgar (avatar)',
    avProhib.promesas_exageradas      && '⛔ Sin promesas exageradas (avatar)',
    avProhib.polemica_barata          && '⛔ Sin polémica sin sustento (avatar)',
    avProhib.clickbait_engañoso       && '⛔ Sin clickbait engañoso (avatar)',
    avProhib.venta_agresiva           && '⛔ Sin venta agresiva (avatar)',
    avProhib.comparaciones_directas   && '⛔ Sin comparaciones directas a competidores (avatar)',
    avProhib.contenido_negativo       && '⛔ Sin contenido negativo o desmotivador (avatar)',
    avBannedVocab                      && `⛔ Vocabulario prohibido por el avatar: "${avBannedVocab}"`,
  ].filter(Boolean).join('\n');

  // ════════════════════════════════════════════════════════════════════════════
  // CONSTRUCCIÓN FINAL DEL PROMPT — 4 CAPAS JERÁRQUICAS
  // ════════════════════════════════════════════════════════════════════════════

  return `
═══════════════════════════════════════════════════════════════════════════════
🔥 MOTOR VIRAL V800 ÉLITE — PROMPT STACKING JERÁRQUICO
   Método: Víctor Heras · TCA · 4 Capas · Perfiles Reales Conectados
═══════════════════════════════════════════════════════════════════════════════

INSTRUCCIÓN SUPREMA:
Lee las 4 capas EN ORDEN. Cada capa filtra y refina la anterior.
Si hay conflicto entre capas, la de MENOR número gana SIEMPRE.
No puedes contradecir la Capa 1 desde la Capa 4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPA 1 — IDENTIDAD, BASE DE DATOS Y ORIGEN DEL INPUT
         (FUENTE DE VERDAD ABSOLUTA — no contradecir bajo ningún concepto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▌ QUIÉN ES EL CREADOR:
${ep && Object.keys(ep).length > 0 ? `
• Nombre/marca: ${epName || 'No especificado'}
• Nicho: ${epNiche}${epSubNiche ? ` → Sub-nicho: ${epSubNiche}` : ''}
• Misión única (UVP): "${epMission || 'No configurada — inferir desde el nicho'}"
• Historia de origen: "${epOriginStory ? epOriginStory.substring(0, 250) : 'No configurada — usar el punto A→B'}"
• Posicionamiento único: "${epUniquePos || 'No configurado'}"
• Enemigo narrativo: "${epEnemy || 'No configurado — inferir desde el nicho'}"
• Objetivo principal del creador: ${epMainObjective}

▌ TRANSFORMACIÓN QUE OFRECE:
• Promesa: "${epTransformPromise || 'No configurada'}"
• De (punto A): "${epPointA || 'No especificado'}"
• A (punto B): "${epPointB || 'No especificado'}"
• Resultado tangible: "${epTangibleResult || 'No especificado'}"
• Resultado emocional: "${epEmotionalResult || 'No especificado'}"

▌ AUTORIDAD Y PRUEBA REAL:
• Nivel de autoridad: ${epAuthorityLevel} (tipo: ${epAuthorityType}, profundidad: ${epDepthLevel})
• Territorio mental reclamado: "${epMentalTerritory || 'No definido'}"
• Casos de estudio: "${epCaseStudies ? epCaseStudies.substring(0, 200) : 'No especificados'}"
• Resultados de clientes: "${epClientResults ? epClientResults.substring(0, 200) : 'No especificados'}"
• Certificaciones: "${epCertifications || 'No especificadas'}"
• Apariciones en medios: "${epMediaAppearances || 'No especificadas'}"

▌ MECANISMO PROPIETARIO:
• Nombre del mecanismo: "${epMechanismName || 'No definido — no inventar uno'}"
• Framework: "${epFramework || 'No definido'}"
• Pasos de metodología: "${epMethodologySteps ? epMethodologySteps.substring(0, 200) : 'No especificados'}"

▌ ADN VERBAL DEL CREADOR:
• Tono personal: "${epTone || 'No definido — inferir desde el arquetipo seleccionado'}"
• Vocabulario clave: "${epKeyVocabulary || 'No definido'}"
• Arquetipo de personalidad: "${epPersonalityArch || 'No definido'}"
• Pilares de contenido: "${epPillar1 || 'No definido'}" / "${epPillar2 || 'No definido'}"
• Agresividad verbal: ${epVerbalAgg}/5 | Sofisticación léxica: ${epLexicalSoph}/5
• Contundencia: ${epForcefulness}/5 | Emocionalidad: ${epEmotionality}/5
• Tecnicidad: ${epTechnicality}/5 | Metáforas: ${epMetaphorLevel}/5
• Storytelling: ${epStorytellingRatio}% | Ritmo: ${epNarrativeRhythm} | Frases: ${epPhraseType}
• Confrontación: ${epConfrontation}/5 | Polarización: ${epPolarization}/5
• Controversia máxima: ${epMaxControversy}/5 | Exposición personal: ${epMaxPersonalExp}/5
` : `• Perfil experto NO configurado.
  La voz, autoridad y datos se construyen desde el tema "${tema}" y el arquetipo elegido.
  La prueba es implícita — se demuestra con el nivel de especificidad del contenido.`}

▌ BASE DE CONOCIMIENTOS:
${kb
  ? `Contexto adicional del creador (usar como fuente de verdad, no contradecir):
${kb}`
  : `Base de conocimientos no configurada — generar desde el conocimiento del tema "${tema}".`}

${avatarDirectives
  ? `▌ PERSONALIDAD DEL AVATAR (obligatorio respetar):
${avatarDirectives}`
  : ''}

▌ ORIGEN DEL INPUT:
${ORIGEN_INPUT}

▌ ANÁLISIS ESTRATÉGICO PREVIO (Paso 1 del pipeline — ya procesado):
${planAtaque
  ? planAtaque
  : `Sin análisis previo — inferir conflicto y insight desde el tema "${tema}".`}

TCA detectado: Sector "${tcaSector}" | Nivel ${tcaNivel}
${tcaConflicto ? `Conflicto central: "${tcaConflicto}"` : ''}
${tcaInsight ? `Insight explotable: "${tcaInsight}"` : ''}
${tcaHook ? `Hook sectorial: "${tcaHook}"` : ''}

REGLA DE CAPA 1: TODO el guion debe ser coherente con este perfil.
Si el perfil indica un nivel de autoridad "${epAuthorityLevel}", usa ese registro — ni más ni menos.
Si hay datos reales (casos, resultados, testimonios) — ÚSALOS. No los inventes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPA 2 — AUDIENCIA Y NIVEL DE CONCIENCIA
         (DETERMINA EL PUNTO DE ENTRADA TCA — ejecutar ANTES de la arquitectura)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▌ PERFIL DEL AVATAR:
${av && Object.keys(av).length > 0 ? `
• Nombre: ${avName || 'Avatar activo'}
• Tipo: ${avPersonType} | Experiencia: ${avExpLevel} | Industria: ${avIndustry || epNiche}
${avCountry ? `• Contexto cultural: ${avCountry}` : ''}
• Objetivo primario: ${avPrimaryGoal} | Modelo de éxito: ${avSuccessModel}
• Nivel de riesgo: ${avRiskLevel}

DOLOR CENTRAL (Capa 3 OLIMPO):
• Pain principal: "${avCentralPain || 'No definido'}"
• Frustraciones: "${avFrustrations || 'No definidas'}"
• Obstáculos recurrentes: "${avObstacles || 'No definidos'}"
• Miedos ocultos: "${avHiddenFears || 'No definidos'}"
• Estancamiento que siente: "${avStagnation || 'No definido'}"

DESEO OCULTO (Capa 4 OLIMPO):
• Deseo profundo: "${avHiddenDesire || 'No definido'}"
• Emoción dominante: ${avDomEmotion}
• Resultado soñado: "${avDreamOutcome || 'No definido'}"
• Aspiración de estatus: "${avStatusAsp || 'No definida'}"

LENGUAJE NATURAL (Capa 5 OLIMPO):
• Estilo comunicación: ${avCommStyle} | Formalidad: ${avFormality} | Ritmo mental: ${avMentalRhythm}
${avSigVocab ? `• Vocabulario signature (usar): "${avSigVocab}"` : ''}
${avBannedVocab ? `• Vocabulario prohibido: "${avBannedVocab}"` : ''}
${avSlang ? `• Expresiones propias: "${avSlang}"` : ''}
• CTA preferido: ${avPrefCTA} | Estructura narrativa esperada: ${avNarrStr}
• Prioridad de contenido: ${avContentPri}

OBJECIONES (Capa 6 OLIMPO):
${avObjCommon ? `• Objeción común: "${avObjCommon}"` : ''}
${avObjTime ? `• Objeción de tiempo: "${avObjTime}"` : ''}
${avObjCred ? `• Objeción de credibilidad: "${avObjCred}"` : ''}
${avObjComp ? `• Objeción de competencia: "${avObjComp}"` : ''}
${avSelfDoubt ? `• Duda propia: "${avSelfDoubt}"` : ''}

TRIGGERS EMOCIONALES (Capa 7 OLIMPO):
${avEmotTrig ? `• Trigger emocional: "${avEmotTrig}"` : ''}
${avUrgTrig ? `• Trigger de urgencia: "${avUrgTrig}"` : ''}
${avStatusTrig ? `• Trigger de estatus: "${avStatusTrig}"` : ''}
${avBelongTrig ? `• Trigger de pertenencia: "${avBelongTrig}"` : ''}
${avLossFear ? `• Miedo a perder: "${avLossFear}"` : ''}

CAPA OLIMPO:
• Temperatura audiencia: ${avAudTemp} | Resistencia al cambio: ${avChangeRes}
${avInternalTone ? `• Tono interno: "${avInternalTone}"` : ''}
${avTimeline ? `• Expectativa de tiempo: "${avTimeline}"` : ''}
${avSocialPain ? `• Dolor social: "${avSocialPain}"` : ''}
${avTransformPtA ? `• Punto A del avatar: "${avTransformPtA}"` : ''}
${avInternalObs ? `• Obstáculo interno: "${avInternalObs}"` : ''}
${avExternalObs ? `• Obstáculo externo: "${avExternalObs}"` : ''}
${avEmotFriction ? `• Fricción emocional: "${avEmotFriction}"` : ''}
` : `• Avatar NO configurado.
  Inferir el perfil de audiencia desde el nicho "${nicho}" y el nivel de awareness "${awareness}".`}

▌ NIVEL DE CONCIENCIA ACTIVO: "${awarenessEfectivo}"
SITUACIÓN: ${situation} | VECTOR EMOCIONAL: ${vectorEmocional}

▌ INSTRUCCIÓN TCA — PUNTO DE ENTRADA (NO NEGOCIABLE):
${awarenessInstruction}

PUENTE TCA OBLIGATORIO (Método Víctor Heras):
El recorrido es: N3 (Universal) → N2 (Sector amplio) → N1 (Nicho "${epNiche || nicho}")
NUNCA empieces el teleprompter en N1 si el awareness es "Inconsciente" o "Consciente del Problema".

REGLA DE CAPA 2: El hook no puede mencionar el nicho técnico N1 antes de que
el avatar haya sentido "esto habla exactamente de mí" desde un nivel más amplio.
Si el awareness es "Totalmente Inconsciente" — la primera frase NO puede contener "${epNiche || nicho}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPA 3 — ESTRUCTURA Y FORMATO
         (ARQUITECTURA DEL GUION — aplica sobre el punto de entrada de Capa 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMATO NARRATIVO: ${formatoNarrativo}
ESTRUCTURA BASE: ${estructura} / Modo: ${modoInterno}
TIPO DE GANCHO: ${hookMode.toUpperCase()}

▌ ARQUITECTURA OBLIGATORIA:
${formatArch}

▌ GANCHO — INSTRUCCIÓN ESPECÍFICA:
${hookDefinition}

▌ COMBINACIÓN FORMATO + GANCHO + LOOP:
${COMBO_INSTRUCTION}

▌ PLATAFORMA: ${plataforma}
${platformRules}

▌ OBJETIVO DE CIERRE: ${objetivoCierre}
CTA A USAR: ${ctaConfig.cta}
Mecanismo: ${ctaConfig.mecanismo}

▌ LONGITUD OBJETIVO: ${wordTarget}

${culturalContext
  ? `▌ CONTEXTO CULTURAL ACTIVO:
"${culturalContext}"
Integrar de forma natural como fondo emocional — NO mencionar explícitamente.`
  : ''}

REGLA DE CAPA 3: La estructura rige el orden de los bloques.
Si el formato dice "in media res" — empieza in media res aunque Capa 2 diga awareness inconsciente.
El puente TCA ocurre DENTRO de la escena, no como introducción antes de ella.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPA 4 — VOZ, TONO Y RETENCIÓN ♾️
         (FILTRO FINAL — colorea sin reescribir la arquitectura de Capa 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▌ INTENSIDAD: ${intensidad.toUpperCase()}
${intensityVoice}

▌ ARQUETIPO DE VOZ: ${arquetipoVoz}
${archetypeStyle}

▌ STRATEGY LOOP ♾️: ${strategyLoop}
${loopInstruction}

▌ PROHIBICIONES ACTIVAS (experto + avatar combinados):
${prohibicionesActivas || 'Sin prohibiciones específicas configuradas.'}

▌ REGLAS ANTI-IA HARDCODED (estas no las configura nadie — son absolutas):
❌ "En un mundo donde..." / "Imagina que..." / "La clave está en..."
❌ "Es importante que..." / "Vale la pena mencionar..."
❌ "[pausa]" / "[sonríe]" / "[mira a cámara]" — CERO acotaciones de actuación
❌ "Hola, soy [nombre] y hoy te voy a hablar de..." — CERO presentaciones
❌ "No olvides dar like y suscribirte" — CERO CTAs genéricos
❌ "quizás" / "en cierta medida" / "puede que" — CERO suavizadores
❌ Frases que cualquier IA generaría sin haber leído el perfil del creador
✅ Lenguaje directo. Persuasivo. Calibrado con el ADN verbal real del creador.
✅ Cada frase tiene peso propio — si se puede borrar sin perder sentido, bórrala.
✅ La "frase de oro" (≤10 palabras) que el avatar va a guardar como screenshot.

REGLA DE CAPA 4: El tono es un FILTRO, no una reescritura.
Si hay conflicto entre el tono y la arquitectura (Capa 3), la arquitectura gana.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMA A DESARROLLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${tema}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA DE SALIDA — MARKDOWN ESTRICTO (sin JSON, sin explicaciones)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu respuesta contiene EXACTAMENTE estas 3 secciones y NADA MÁS.
Sin preámbulos. Sin notas al pie. Sin "Aquí tienes tu guion:".
La primera línea de tu respuesta ES "[SECCIÓN 1: FRASE MINIATURA]".

[SECCIÓN 1: FRASE MINIATURA]

MISIÓN DE LA MINIATURA:
Detener el scroll de alguien que NO conoce al creador, NO conoce el nicho,
y NO sabe que tiene el problema. Ese es el estándar mínimo.
Si solo la entienden los que ya conocen el nicho — es una miniatura de N1. Rehacerla.

LEY TCA DE LA MINIATURA (no negociable):
La frase miniatura vive en N3 o N2. NUNCA en N1.
La prueba: ¿La entendería alguien que no sabe nada del nicho "${epNiche || nicho}"?
Si la respuesta es NO → la frase está en N1 → PROHIBIDA.

MATERIAL DISPONIBLE PARA CONSTRUIRLA:
• Dolor universal del avatar: "${avCentralPain || avStagnation || 'el dolor más amplio del avatar'}"
• Miedo profundo: "${avHiddenFears || avLossFear || 'lo que el avatar teme perder'}"
• Estancamiento que siente: "${avStagnation || 'la sensación de no avanzar'}"
• Deseo oculto: "${avHiddenDesire || avDreamOutcome || 'lo que realmente quiere'}"
• Sector masivo detectado por TCA: "${tcaSector || 'Dinero / Tiempo / Libertad / Reconocimiento'}"
• Nivel TCA del tema: ${tcaNivel}

RECORRIDO TCA DE LA MINIATURA:
El proceso interno para construirla es:
1. Identifica el sector universal (N3): dinero, tiempo, libertad, relaciones, reconocimiento, salud
2. Encuentra la tensión emocional que vive el avatar en ese sector
3. Comprímela en ≤6 palabras que cualquier persona reconozca como propia
4. Verifica que NO menciona el nicho, la profesión, ni el mecanismo del creador

FÓRMULAS TCA PARA LA MINIATURA (usar la más poderosa según el contexto):

FÓRMULA 1 — CONTRADICCIÓN VISIBLE (N3 puro):
"[Haces/Tienes] [lo correcto] y [resultado opuesto al esperado]"
Ejemplo: "Trabajas más y tienes menos."
Conectada con: "${avCentralPain || avStagnation}"

FÓRMULA 2 — VERDAD QUE DUELE (N3 con tensión):
"[Lo que crees que funciona] no funciona."
Ejemplo: "El esfuerzo solo no alcanza."
Conectada con: "${avFrustrations || avObstacles}"

FÓRMULA 3 — ACUSACIÓN SIN CULPABLE EXPLÍCITO (N2-N3):
"[Alguien/Algo] te está frenando sin que lo sepas."
Ejemplo: "Te enseñaron a perder."
Conectada con: "${epEnemy || 'la narrativa que frena al avatar'}"

FÓRMULA 4 — PROMESA IMPOSIBLE (N3 aspiracional):
"[Resultado deseado] sin [sacrificio convencional]."
Ejemplo: "Más resultados. Menos esfuerzo inútil."
Conectada con: "${avDreamOutcome || avHiddenDesire}"

FÓRMULA 5 — PÉRDIDA SILENCIOSA (N3 miedo):
"Pierdes [algo valioso] sin saberlo."
Ejemplo: "Tu tiempo vale más de lo que cobras."
Conectada con: "${avLossFear || avHiddenFears}"

REGLAS DE CONSTRUCCIÓN:
✅ Máximo 6 palabras — si necesitas 7, elimina una
✅ Debe funcionar como texto en pantalla del thumbnail Y como primera frase sobreimpresa
✅ Sin signos de interrogación — las preguntas no paran el scroll, las afirmaciones sí
✅ Sin puntos suspensivos — transmiten duda, no tensión
✅ Sin el nombre del creador, del nicho, ni del mecanismo
✅ La frase se entiende en 0.3 segundos — ese es el tiempo que tiene en el feed
❌ PROHIBIDO: "La clave es..." / "Descubre cómo..." / "Aprende a..."
❌ PROHIBIDO: cualquier término técnico del nicho "${epNiche || nicho}"
❌ PROHIBIDO: emojis en la frase miniatura

VALIDACIÓN FINAL ANTES DE ESCRIBIRLA:
Pregúntate: ¿Un fontanero, un estudiante universitario y una madre de familia
pararían el scroll al ver esta frase?
Si los tres la entienden y la sienten como propia → es N3. Válida.
Si solo la entiende quien ya conoce el nicho → es N1. Rehacerla.

ESCRIBE SOLO LA FRASE. Sin explicación. Sin comillas. Sin etiquetas adicionales.

[SECCIÓN 2: TELEPROMPTER PROFESIONAL]
SOLO el texto que el creador lee frente a cámara.
CERO corchetes de acción. CERO instrucciones técnicas. CERO números de bloque.
Texto fluido y continuo que suena exactamente como "${epTone || 'la voz natural del creador'}".
Longitud: ${wordTarget}
Aplica en orden: Capa 2 (punto de entrada TCA) → Capa 3 (arquitectura) → Capa 4 (voz y loops)

[SECCIÓN 3: PLAN AUDIOVISUAL (DIRECTOR'S CUT)]
Instrucciones técnicas para el editor. Formato: lista con timestamps.
Para cada momento clave incluir:
  • Timestamp aproximado
  • Tipo de plano (ej: primer plano extremo, b-roll, plano medio)
  • Movimiento de cámara (ej: zoom in agresivo, estático, handheld)
  • Texto en pantalla si aplica
  • SFX / música (ej: bass drop, silencio súbito, whoosh)
  • B-Roll específico (ej: "manos sobre teclado, plano detalle a 4K")
Mínimo 5 momentos clave con los 5 campos cada uno.
${esImagen ? 'NOTA ESPECIAL: La imagen subida por el usuario debe aparecer como B-Roll en el momento de mayor impacto.' : ''}
${plataforma === 'Facebook' ? 'NOTA: Incluir subtítulos en TODOS los bloques (70% ve sin audio en Facebook).' : ''}
`;
};