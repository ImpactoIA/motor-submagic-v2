// ==================================================================================
// 📦 TITAN ENGINE — TIPOS E INTERFACES CENTRALIZADAS
// Todos los tipos usados en handlers, prompts y el servidor principal
// ==================================================================================

export interface SystemMemory {
  videos_analizados: any[];
  estructuras_exitosas: string[];
  hooks_alto_rendimiento: string[];
  estrategias_validadas: string[];
  patrones_virales: string[];
}

export interface ContextoUsuario {
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
  tema_especifico?: string;
  expertProfile?: any;
  // Campos extendidos para Ideas Rápidas
  avatar_situacion_actual?: string | null;
  avatar_objetivo_primario?: string | null;
  avatar_pain_points?: string | null;
  // Avatar middleware
  avatarDirectives?: string;
  expertProfileValidation?: any;
}

export interface JuezViralV500Result {
  veredicto_final: {
    score_total: number;
    clasificacion: string;
    probabilidad_viral: string;
    confianza_prediccion: string;
    viral_probability_score: number;
  };
  modulos: {
    fidelidad_arquitectonica: {
      indice_fidelidad: number;
      bloques_detectados: number;
      bloques_inconsistentes: string[];
      posicion_insight: string;
      posicion_climax: string;
      tipo_cierre: string;
      secuencia_narrativa: string;
      riesgo_estructural: string;
      arquitectura_detectada: string;
    };
    progresion_emocional: {
      curva_emocional: Array<{
        bloque: string;
        segundo_inicio: number;
        segundo_fin: number;
        intensidad: number;
        tipo_emocion: string;
        dinamica: string;
      }>;
      indice_intensidad_emocional: number;
      riesgo_monotonia: string;
      tiene_dinamica: boolean;
      puntos_criticos: string[];
    };
    retencion_cognitiva: {
      retention_risk_score: number;
      scroll_interruption_score: number;
      segundo_probable_abandono: number;
      punto_friccion_principal: string;
      punto_distraccion: string;
      punto_alto_engagement: string;
      prediccion_usuario_promedio: string;
      razon_abandono: string;
      zona_peligro: string;
    };
    hook_power: {
      hook_power_score: number;
      tipo_hook_detectado: string;
      criterios: {
        especificidad: number;
        rareza: number;
        tension: number;
        curiosidad_incompleta: number;
        promesa_clara: number;
        ruptura_patron: number;
      };
      diagnostico: string;
      recomendacion_mejora: string;
      hook_original: string;
      hook_optimizado: string;
    };
    densidad_valor: {
      value_density_index: number;
      insights_por_bloque: Array<{
        bloque: string;
        cantidad_insights: number;
        tiempo_entrega: number;
        calidad: string;
      }>;
      bloques_debiles: string[];
      bloques_sobrecargados: string[];
      relleno_detectado: boolean;
      porcentaje_utilidad: number;
    };
    equivalencia_psicologica: {
      impact_equivalence_score: number;
      tipo_promesa: string;
      tipo_transformacion: string;
      emocion_activada: string;
      tipo_tension: string;
      tipo_activacion: string;
      impacto_psicologico: string;
      nivel_activacion_emocional: number;
      sesgo_cognitivo_explotado: string;
    };
    ritmo_narrativo: {
      rhythm_optimization_score: number;
      monotony_risk: string;
      longitud_promedio_frases: number;
      variacion_detectada: boolean;
      cambios_tempo: number;
      micro_pausas: number;
      cadencia: string;
      ajuste_recomendado: string;
    };
    triggers_virales: {
      share_trigger_index: number;
      save_trigger_index: number;
      frases_memorables: string[];
      momentos_revelacion: string[];
      frases_citables: string[];
      insights_guardables: string[];
      potencial_screenshot: string;
    };
    autoridad_percibida: {
      authority_score: number;
      posicionamiento_creador: string;
      nivel_credibilidad: string;
      riesgo_percepcion_debil: string;
      elementos_autoridad: string[];
      elementos_debilitan: string[];
    };
    conversion_estrategica: {
      conversion_alignment_score: number;
      objetivo_detectado: string;
      tipo_cierre: string;
      alineacion: string;
      optimizacion_recomendada: string;
      cta_actual: string;
      cta_optimizado: string;
    };
  };
  diagnostico_maestro: {
    diagnostico_principal: string;
    error_principal: string;
    mejora_concreta: string;
    puntos_criticos: string[];
    oportunidades: string[];
  };
  optimizaciones_automaticas: {
    hook_reescrito: {
      original: string;
      optimizado: string;
      por_que_funciona: string;
      score_mejora: number;
    };
    ajuste_tono: {
      opcion_1: string;
      opcion_2: string;
      opcion_3: string;
    };
    adaptacion_plataforma: {
      cambio_1: string;
      cambio_2: string;
      version_optimizada: string;
    };
  };
  prediccion_metricas: {
    vistas_estimadas: string;
    engagement_rate: string;
    tiempo_viralizacion: string;
    probabilidad_guardado: string;
    probabilidad_share: string;
    retencion_estimada: string;
  };
  fortalezas_clave: string[];
  debilidades_criticas: Array<{
    problema: string;
    impacto: string;
    solucion: string;
    prioridad: string;
  }>;
  decision_recomendada: string;
  razonamiento_decision: string;
  siguiente_paso_sugerido: string;
}

// ─── MOTOR 1: Descomposición Estructural ────────────────────
export interface BloqueProfundo {
  tipo: "hook" | "setup" | "escalada" | "giro" | "climax" | "resolucion" | "cierre_estrategico";
  inicio_segundos: number;
  fin_segundos: number;
  duracion_segundos: number;
  descripcion: string;
  funcion_narrativa: string;
  intensidad: number;
}

export interface AdnEstructura {
  bloques: BloqueProfundo[];
  tipo_apertura: string;
  tipo_cierre: string;
  proporcion_hook_porcentaje: number;
  velocidad_escalada: "lenta" | "media" | "rapida" | "explosiva";
  patron_narrativo_detectado: string;
  complejidad_estructural: number;
}

// ─── MOTOR 2: Curva Emocional ────────────────────────────────
export interface PicoEmocional {
  segundo: number;
  emocion: string;
  intensidad: number;
  detonante: string;
}

export interface CurvaEmocional {
  emocion_dominante: string;
  emocion_secundaria: string;
  emocion_final: string;
  picos_emocionales: PicoEmocional[];
  intensidad_promedio: number;
  variabilidad_emocional: number;
  arco_emocional: string;
  segmentos: Array<{ bloque: string; emocion: string; intensidad: number }>;
}

// ─── MOTOR 3: Micro-Loops ────────────────────────────────────
export interface MicroLoop {
  tipo: "promesa_abierta" | "cliffhanger" | "pregunta_pendiente" | "anticipacion" | "gancho_diferido";
  descripcion: string;
  segundo_apertura: number;
  segundo_cierre: number | null;
  intensidad: number;
}

export interface MicroLoops {
  loops: MicroLoop[];
  total_loops: number;
  intervalo_promedio_segundos: number;
  densidad_anticipacion: number;
  loops_sin_resolver: number;
  estrategia_tension: string;
}

// ─── MOTOR 4: Polarización ───────────────────────────────────
export interface Polarizacion {
  nivel_confrontacion: number;
  ruptura_creencia_detectada: string;
  enemigo_implicito: string | null;
  nivel_friccion_narrativa: number;
  mecanismo_polarizacion: string;
  afirmaciones_divisivas: string[];
  posicionamiento_vs: string;
}

// ─── MOTOR 5: Identidad Verbal ───────────────────────────────
export interface IdentidadVerbal {
  longitud_promedio_frases: number;
  ritmo_sintactico: "staccato" | "fluido" | "mixto" | "explosivo";
  proporcion_frases_cortas_pct: number;
  proporcion_frases_largas_pct: number;
  uso_metaforas: number;
  uso_imperativos: number;
  sofisticacion_lexica: number;
  nivel_agresividad_verbal: number;
  firma_linguistica: string;
  palabras_poder_detectadas: string[];
}

// ─── MOTOR 6: Status y Posicionamiento ──────────────────────
export interface StatusYPosicionamiento {
  tipo_autoridad: "mentor" | "rebelde" | "experto_tecnico" | "disruptor" | "insider" | "testigo" | "transformado";
  experiencia_proyectada: "implicita" | "explicita" | "mixta";
  rol_narrativo: string;
  nivel_confianza_percibida: number;
  distancia_con_audiencia: "cercana" | "media" | "distante";
  prueba_social_detectada: boolean;
  mecanismos_autoridad: string[];
}

// ─── MOTOR 7: Densidad de Valor ─────────────────────────────
export interface DensidadValor {
  valor_por_minuto: number;
  porcentaje_contenido_abierto: number;
  porcentaje_contenido_cerrado: number;
  profundidad_insight: number;
  micro_aprendizajes: string[];
  ratio_promesa_entrega: number;
  tipo_valor_dominante: "educativo" | "inspiracional" | "entretenimiento" | "provocacion" | "solucion";
}

// ─── MOTOR 8: Manipulación de Atención ──────────────────────
export interface ManipulacionAtencion {
  cambios_ritmo: Array<{ segundo: number; tipo: string; descripcion: string }>;
  interrupciones_patron: number;
  reencuadres_mentales: string[];
  golpes_narrativos: Array<{ segundo: number; descripcion: string; impacto: number }>;
  reactivaciones_atencion: number;
  tecnicas_detalladas: string[];
  frecuencia_estimulacion: number;
}

// ─── MOTOR 9: Activadores de Guardado ───────────────────────
export interface ActivadorGuardado {
  tipo: "frase_memorable" | "reencuadre" | "dato_contraintuitivo" | "formula_repetible" | "revelacion";
  contenido: string;
  segundo_aproximado: number;
  potencia_guardado: number;
}

// ─── MOTOR 10: Adaptabilidad al Nicho ───────────────────────
export interface AdaptabilidadNicho {
  contexto_usuario: string;
  sofisticacion_audiencia_target: "basica" | "intermedia" | "avanzada" | "experta";
  nivel_conciencia_mercado: number;
  intensidad_psicologica_tolerable: number;
  ajustes_necesarios: string[];
  riesgos_adaptacion: string[];
}

// ─── MOTOR 11: Anti-Saturación ──────────────────────────────
export interface ElementoCliché {
  tipo: "frase_cliche" | "hook_generico" | "formula_repetida" | "plantilla_obvia";
  contenido: string;
  nivel_saturacion: number;
  alternativa_sugerida: string;
}

// ─── MOTOR 12: Ritmo Narrativo ───────────────────────────────
export interface RitmoNarrativo {
  velocidad_progresion: "lenta" | "media" | "rapida" | "variable";
  intervalo_promedio_entre_estimulos_seg: number;
  variacion_intensidad: number;
  fluidez_estructural: number;
  momentos_pausa: number;
  aceleraciones: Array<{ segundo: number; causa: string }>;
}

// ─── MOTOR 13: Score Viral Estructural ──────────────────────
export interface ScoreViralEstructural {
  retencion_estructural: number;
  intensidad_emocional: number;
  polarizacion: number;
  manipulacion_atencion: number;
  densidad_valor: number;
  viralidad_estructural_global: number;
  breakdown_motores: Record<string, number>;
}

// ─── MOTOR 15: Blueprint ─────────────────────────────────────
export interface BlueprintReplicable {
  nombre_patron: string;
  formula_base: string;
  pasos_estructurales: string[];
  equivalencias_estructurales: {
    hook_type: string;
    escalation_pattern: string;
    giro_type: string;
    closure_type: string;
  };
  equivalencias_psicologicas: {
    emocion_entrada: string;
    emocion_escalada: string;
    emocion_salida: string;
    tension_type: string;
    activation_mechanism: string;
  };
  equivalencias_verbales: {
    ritmo: string;
    agresividad: string;
    sofisticacion: string;
  };
  instrucciones_para_generador: string;
  instrucciones_para_juez_viral: string;
}

// ─── MOTOR 16: Análisis TCA ──────────────────────────────────
export type NivelTCA = "N0" | "N1" | "N2" | "N3" | "N4";

export interface AnalisisTCA {
  nivel_tca_detectado: NivelTCA;
  sector_detectado: string;
  tipo_alcance: string;
  mass_appeal_score: number;
  equilibrio_masividad_calificacion: boolean;
  diagnostico_tca: string;
  capa_visible: string;
  capa_estrategica: string;
  filtro_audiencia_implicito: string;
  tipo_trafico_que_atrae: string;
  nivel_conversion_probable: "bajo" | "medio" | "alto" | "muy_alto";
  esta_muy_tecnico: boolean;
  esta_muy_mainstream: boolean;
}

export interface MapaAdaptacionTCA {
  nivel_tca_recomendado: string;
  sector_recomendado: string;
  nuevo_hook_sectorial: string;
  nueva_capa_visible: string;
  capa_estrategica_conservada: string;
  estructura_espejo: boolean;
  version_tecnica: string;
  version_equilibrio_ideal: string;
  version_sector_masivo: string;
  advertencia_micronicho: string | null;
}

// ─── OUTPUT INGENIERÍA INVERSA PRO ──────────────────────────
export interface IngenieriaInversaProOutput {
  url_analizada: string;
  nicho_origen: string;
  nicho_usuario: string;
  timestamp: string;
  iteracion_loop: number;
  adn_estructura: AdnEstructura;
  curva_emocional: CurvaEmocional;
  micro_loops: MicroLoops;
  polarizacion: Polarizacion;
  identidad_verbal: IdentidadVerbal;
  status_y_posicionamiento: StatusYPosicionamiento;
  densidad_valor: DensidadValor;
  manipulacion_atencion: ManipulacionAtencion;
  activadores_guardado: ActivadorGuardado[];
  adaptabilidad_nicho: AdaptabilidadNicho;
  elementos_cliche_detectados: ElementoCliché[];
  ritmo_narrativo: RitmoNarrativo;
  score_viral_estructural: ScoreViralEstructural;
  guion_adaptado_al_nicho: string;
  guion_adaptado_espejo: string;
  blueprint_replicable: BlueprintReplicable;
  analisis_tca: AnalisisTCA;
  mapa_de_adaptacion: MapaAdaptacionTCA;
  validacion_olimpo?: {
    arquitectura_completa: boolean;
    loops_reales_detectados: boolean;
    nivel_tca_identificado: boolean;
    equilibrio_ideal_detectado: boolean;
    filtro_implicito_extraido: boolean;
    adaptacion_sin_micronicho: boolean;
    adn_estructural_conservado: boolean;
    score_validacion: number;
  };
  recomendaciones_estrategicas: string[];
  alertas_criticas: string[];
  loop_alcanzado_minimo: boolean;
  score_final_obtenido: number;
}

export interface IngenieriaInversaProParams {
  transcripcion: string;
  url: string;
  nicho_origen: string;
  nicho_usuario: string;
  objetivo_usuario: string;
  umbral_score_minimo?: number;
  max_iteraciones?: number;
}

export interface CopyExpertSettings {
  red_social: string;
  formato: string;
  objetivo: string;
  tipo_contenido?: string;
}

export interface ResultadoValidacion {
  esValido: boolean;
  score: number;
  problemas: string[];
  advertencias: string[];
  sugerencias: string[];
}