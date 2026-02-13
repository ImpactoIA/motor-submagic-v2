// ==================================================================================
// 🧠 EXPERT AUTHORITY ENGINE — FUNCIONES DE DECISIÓN
// ==================================================================================

export class ExpertAuthoritySystem {

  // ESTA ES LA FUNCIÓN 1 QUE TÚ ME DISTE
  static generateDirectives(expertProfile: any): string {
    if (!expertProfile) return "";

    const {
      authority_level = 'practicante',
      authority_type = 'practica',
      depth_level = 'media',
      proof_type = 'casos_reales',
      mental_territory = '',
      prohibitions = {}
    } = expertProfile;

let prohibitionsObj = {};
try {
    prohibitionsObj = typeof prohibitions === 'string' ? JSON.parse(prohibitions) : (prohibitions || {});
} catch (e) {
    console.error("⚠️ Error parseando prohibiciones en generateDirectives");
    prohibitionsObj = {};
}
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PERFIL DE EXPERTO (DIRECTIVAS OBLIGATORIAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ESTAS REGLAS ANULAN CUALQUIER OTRA INSTRUCCIÓN SI HAY CONFLICTO:

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
   - Cita fuentes cuando sea posible: "Según un estudio de...", "Los datos muestran..."
   ` : authority_type === 'practica' ? `
   - DEBES incluir al menos 1 caso real, resultado o experiencia personal.
   - Usa lenguaje coloquial pero profesional.
   - Ejemplos: "Cuando trabajé con X...", "Un cliente logró Y haciendo Z..."
   ` : authority_type === 'estrategica' ? `
   - DEBES presentar sistemas, frameworks o procesos.
   - Usa visión de alto nivel: "La estrategia clave es...", "El sistema que funciona..."
   - Piensa en "cómo" más que en "qué".
   ` : `
   - Cuestiona el status quo. Usa: "Lo que nadie te dice es...", "La verdad incómoda..."
   - Puedes ser polémico, pero con argumento sólido.
   - Rompe paradigmas, no repitas lo obvio.
   `}

3. PROFUNDIDAD REQUERIDA: ${depth_level.toUpperCase()}
   ${depth_level === 'superficial' ? `
   - Mantén explicaciones SIMPLES. 1 idea = 1 oración.
   - NO uses jerga técnica.
   - Máximo 150 palabras.
   ` : depth_level === 'media' ? `
   - Explica CON EJEMPLOS, pero sin exceso de detalle.
   - Puedes usar ALGO de jerga, pero defínela.
   - 150-250 palabras.
   ` : depth_level === 'profunda' ? `
   - Profundiza en matices y detalles.
   - Usa jerga del nicho SIN explicarla (tu audiencia la entiende).
   - 250-400 palabras.
   ` : `
   - Nivel técnico MÁXIMO. Asume que tu audiencia es experta.
   - Implementación exacta, paso a paso.
   - 400+ palabras si es necesario.
   `}

4. TIPO DE PRUEBA PREFERIDA: ${proof_type.toUpperCase()}
   ${proof_type === 'datos' ? `
   - Incluye números, porcentajes, métricas.
   - Cita estudios o investigaciones.
   ` : proof_type === 'casos_reales' ? `
   - Cuenta historias de casos reales (tuyos o de clientes).
   - Usa nombres ficticios si es necesario, pero SIEMPRE resultados específicos.
   ` : proof_type === 'analogias' ? `
   - Explica conceptos con metáforas o analogías.
   - Haz lo complejo simple mediante comparaciones.
   ` : `
   - Tu opinión razonada ES la prueba (Thought Leadership).
   - Explica TU visión del tema con argumentos sólidos.
   `}

5. TERRITORIO MENTAL™: ${mental_territory || 'No definido'}
   ${mental_territory ? `
   - Cada idea/guion DEBE reflejar estos conceptos clave.
   - Refuerza tu marca registrada conceptual.
   ` : ''}

6. 🚫 PROHIBICIONES ABSOLUTAS (HARD STOP):
   ${prohibitionsObj.promesas_rapidas ? '- ❌ NO uses promesas de "resultados rápidos", "fácil", "sin esfuerzo".' : ''}
   ${prohibitionsObj.simplificaciones_extremas ? '- ❌ NO digas "solo", "simplemente", "así de fácil" si el tema es complejo.' : ''}
   ${prohibitionsObj.ataques_personales ? '- ❌ NO ataques personas. Critica IDEAS, no INDIVIDUOS.' : ''}
   ${prohibitionsObj.opinion_sin_prueba ? '- ❌ NO des opiniones sin fundamento. SIEMPRE respalda con prueba.' : ''}
   ${prohibitionsObj.contenido_superficial ? '- ❌ NO hagas contenido viral vacío. Debe tener VALOR REAL.' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ESTAS DIRECTIVAS TIENEN PRIORIDAD MÁXIMA.
Si hay conflicto entre el Avatar y el Experto, EL AVATAR SIEMPRE GANA en:
- Tono emocional
- Nivel de riesgo
- Personalidad

Pero EL EXPERTO GANA en:
- Profundidad
- Tipo de argumento
- Tipo de prueba
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  // ESTA ES LA FUNCIÓN 2 QUE TÚ ME DISTE
  static applyFilter(
    expertProfile: any,
    contentType: 'idea' | 'guion' | 'hook' | 'estructura',
    content: any
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
      prohibitions = {}
    } = expertProfile;

    // REGLA 1: VALIDAR PROFUNDIDAD VS NIVEL DE AUTORIDAD
    if (contentType === 'guion') {
      const texto = content.guion_completo || content.guion_tecnico_completo || '';
      const palabras = texto.split(' ').length;
      
      if (authority_level === 'aprendiz' && palabras > 300) {
        warnings.push("⚠️ ADVERTENCIA: Guion demasiado largo para nivel Aprendiz. Riesgo de perder credibilidad.");
        scoreCredibilidad -= 20;
      }

      if (authority_level === 'referente' && palabras < 150) {
        warnings.push("⚠️ ADVERTENCIA: Guion demasiado corto para nivel Referente. Pareces principiante.");
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
        warnings.push("⚠️ ADVERTENCIA: Tu autoridad es 'Práctica' pero no mencionas experiencia real.");
        scoreCredibilidad -= 20;
      }

      if (proof_type === 'datos' && !texto.match(/\d+/)) {
        warnings.push("⚠️ Tu tipo de prueba es 'Datos' pero no usas números en el guion.");
        scoreCredibilidad -= 15;
      }
    }

    // REGLA 3: PROHIBICIONES (HARD STOP)

    let prohibitionsObj = {};
try {
    prohibitionsObj = typeof prohibitions === 'string' ? JSON.parse(prohibitions) : (prohibitions || {});
} catch (e) {
    console.error("⚠️ Error parseando prohibiciones en applyFilter");
    prohibitionsObj = {};
}
    

    if (contentType === 'guion' || contentType === 'hook') {
      const texto = typeof content === 'string' ? content : (content.texto || content.guion_sugerido || content.guion_completo || '');

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
          warnings.push("🚫 PROHIBICIÓN CRÍTICA: Ataques personales detectados. Esto te desprofesionaliza.");
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

    // REGLA 4: FILTRADO DE IDEAS (ESPECÍFICO)
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
    }

    return {
      approved,
      warnings,
      score_credibilidad: scoreCredibilidad,
      modifications
    };
  }
}