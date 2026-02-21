// ==================================================================================
// 🛡️ AVATAR MIDDLEWARE V2.0 — 7 CAPAS OLIMPO
// ==================================================================================
// CAMBIOS v2.0 vs v1:
//   ✅ AvatarDNA tiene TODOS los campos reales de la DB (Capas 1-7)
//   ✅ currentUserId rastreado para incrementContentCount
//   ✅ filterContentRequest implementado
//   ✅ incrementContentCount implementado
//   ✅ generateAvatarSystemPrompt usa las 7 capas completas
//   ✅ Todos los helpers originales preservados (getRiskDirectives, etc.)
//   ✅ CAPA OLIMPO: 16 campos nuevos del checklist añadidos
//   ❌ Eliminado: columna obsoleta "desires" que causaba error 42703
// ==================================================================================

import { SupabaseClient } from '@supabase/supabase-js';

// ==================================================================================
// TIPOS — 7 CAPAS OLIMPO
// ==================================================================================

export interface AvatarDNA {
    id: string;
    name: string;
    is_active?: boolean;

    // ── CAPA 1: IDENTIDAD BASE ─────────────────────────────────────────────────────
    person_type?: 'emprendedor' | 'creador_contenido' | 'marca_personal' | 'empresa' | 'profesional_independiente';
    experience_level: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
    country_culture?: string;
    industry?: string;

    // ── CAPA 2: OBJETIVO PRINCIPAL ─────────────────────────────────────────────────
    primary_goal: 'viralidad' | 'autoridad' | 'venta' | 'comunidad' | 'posicionamiento';
    secondary_goals?: string[];
    success_model: 'educador_serio' | 'empresario_premium' | 'influencer_agresivo' | 'mentor_disruptivo' | 'experto_tecnico' | 'creativo_viral';
    risk_level: 'conservador' | 'balanceado' | 'agresivo';

    // ── CAPA 3: DOLOR CENTRAL ──────────────────────────────────────────────────────
    central_pain?: string;
    frustrations?: string;
    recurring_obstacles?: string;
    hidden_fears?: string;
    stagnation_feeling?: string;

    // ── CAPA 4: DESEO OCULTO ───────────────────────────────────────────────────────
    hidden_desire?: string;
    dominant_emotion: 'curiosidad' | 'deseo' | 'miedo' | 'aspiracion' | 'autoridad';
    dream_outcome?: string;
    status_aspiration?: string;

    // ── CAPA 5: LENGUAJE NATURAL ───────────────────────────────────────────────────
    communication_style: 'directo' | 'analitico' | 'inspirador' | 'provocador' | 'didactico';
    formality_level?: 'coloquial' | 'semiformial' | 'formal' | 'academico';
    mental_rhythm?: 'rapido' | 'moderado' | 'reflexivo';
    signature_vocabulary?: string[];
    banned_vocabulary?: string[];
    slang_or_expressions?: string;
    preferred_length?: string;
    preferred_cta_style?: string;
    narrative_structure?: string;
    content_priority: 'educativo' | 'opinion' | 'storytelling' | 'venta_encubierta' | 'viral_corto';

    // ── CAPA 6: OBJECIONES Y BLOQUEOS ─────────────────────────────────────────────
    common_objections?: string;
    time_objection?: string;
    credibility_objection?: string;
    competition_objection?: string;
    self_doubt?: string;

    // ── CAPA 7: TRIGGERS EMOCIONALES ──────────────────────────────────────────────
    emotional_triggers?: string;
    urgency_trigger?: string;
    status_trigger?: string;
    belonging_trigger?: string;
    loss_fear_trigger?: string;

    // ── PROHIBICIONES ──────────────────────────────────────────────────────────────
    prohibitions: {
        lenguaje_vulgar?: boolean;
        promesas_exageradas?: boolean;
        polemica_barata?: boolean;
        clickbait_engañoso?: boolean;
        venta_agresiva?: boolean;
        comparaciones_directas?: boolean;
        contenido_negativo?: boolean;
    };

    // ── EVOLUCIÓN ─────────────────────────────────────────────────────────────────
    evolution_level?: number;
    coherence_score?: number;

    // ── CAPA OLIMPO: CAMPOS CHECKLIST ─────────────────────────────────────────────

    // Checklist 1: Identidad demográfica profunda
    age_range?: string;
    gender_predominant?: string;
    socioeconomic_level?: string;
    education_level?: string;
    life_stage?: string;

    // Checklist 2: Nivel de conciencia (CRÍTICO)
    awareness_level?: 'inconsciente' | 'consciente_problema' | 'consciente_solucion' | 'consciente_producto' | 'listo_decidir';

    // Checklist 3: Dolor profundo adicional
    social_pain?: string;

    // Checklist 4: Horizonte temporal
    timeline_expectation?: string;

    // Checklist 8: Tono interno del avatar
    internal_tone?: 'victima' | 'ambicioso' | 'confundido' | 'frustrado' | 'esperanzado';

    // Checklist 9: Resistencia al cambio
    change_resistance?: 'alta' | 'media' | 'baja';

    // Checklist 11: Mapa de transformación
    transformation_point_a?: string;
    internal_obstacle?: string;
    external_obstacle?: string;
    emotional_friction?: string;

    // Checklist 12: Segmentación avanzada
    audience_temperature?: 'frio' | 'tibio' | 'caliente';
    audience_segment?: 'masivo' | 'premium' | 'mixto';
}

export interface AvatarValidationResult {
    success: boolean;
    avatar?: AvatarDNA;
    error?: string;
    warnings?: string[];
}

export interface ContentSafetyResult {
    approved: boolean;
    warnings?: string[];
    suggestions?: string[];
}

// ==================================================================================
// MIDDLEWARE CLASS
// ==================================================================================

export class AvatarMiddleware {
    private supabase: SupabaseClient;
    private cachedAvatar: Map<string, AvatarDNA> = new Map();
    private currentUserId: string | null = null;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    // ==================================================================================
    // MÉTODO PRINCIPAL: VALIDAR Y OBTENER AVATAR
    // ==================================================================================

    async validateAndGetAvatar(userId: string): Promise<AvatarValidationResult> {
        this.currentUserId = userId;
        try {
            if (this.cachedAvatar.has(userId)) {
                return {
                    success: true,
                    avatar: this.cachedAvatar.get(userId)!
                };
            }

            const { data, error } = await this.supabase
                .rpc('get_active_avatar', { p_user_id: userId });

            if (error) {
                console.error('Error getting avatar:', error);
                return {
                    success: false,
                    error: 'Error al obtener avatar del usuario'
                };
            }

            if (!data || data.length === 0) {
                return {
                    success: false,
                    error: '⚠️ AVATAR OBLIGATORIO NO ENCONTRADO. Debes crear un perfil de avatar para usar Titan.',
                    warnings: [
                        'El sistema requiere un avatar activo para funcionar',
                        'Ve a "Avatar" en el menú y crea tu perfil'
                    ]
                };
            }

            const avatarData = data[0];
            const avatar: AvatarDNA = {
                id: avatarData.avatar_id,
                ...avatarData.avatar_data
            };

            const validation = this.validateAvatarIntegrity(avatar);
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Avatar incompleto. Faltan campos obligatorios.',
                    warnings: validation.missing_fields
                };
            }

            this.cachedAvatar.set(userId, avatar);
            return { success: true, avatar };

        } catch (error: any) {
            console.error('Avatar validation error:', error);
            return {
                success: false,
                error: error.message || 'Error desconocido al validar avatar'
            };
        }
    }

    // ==================================================================================
    // VALIDAR INTEGRIDAD DEL AVATAR
    // ==================================================================================

    private validateAvatarIntegrity(avatar: any): { valid: boolean; missing_fields?: string[] } {
        const required_fields = [
            'experience_level',
            'primary_goal',
            'communication_style',
            'risk_level',
            'content_priority',
            'dominant_emotion',
            'prohibitions',
            'success_model'
        ];

        const missing_fields: string[] = [];
        for (const field of required_fields) {
            if (!avatar[field]) {
                missing_fields.push(field);
            }
        }

        if (!avatar.central_pain && !avatar.frustrations) {
            missing_fields.push('⚠️ Sin dolor emocional definido — los hooks serán genéricos');
        }
        if (!avatar.hidden_desire && !avatar.dream_outcome) {
            missing_fields.push('⚠️ Sin deseo definido — la resolución no tendrá impacto');
        }
        if (!avatar.awareness_level) {
            missing_fields.push('⚠️ Sin nivel de conciencia — el contenido puede estar desalineado');
        }

        return {
            valid: missing_fields.length === 0,
            missing_fields: missing_fields.length > 0 ? missing_fields : undefined
        };
    }

    // ==================================================================================
    // FILTRAR CONTENIDO — CHEQUEO DE PROHIBICIONES
    // ==================================================================================

    async filterContentRequest(request: any, userId: string): Promise<ContentSafetyResult> {
        const cached = this.cachedAvatar.get(userId);
        if (!cached) return { approved: true };

        const warnings: string[] = [];
        const p = cached.prohibitions || {};
        const content = JSON.stringify(request).toLowerCase();
        const suggestions: string[] = [];

        if (p.lenguaje_vulgar && /mierda|puta|coño|joder|fuck|shit/.test(content)) {
            warnings.push('Lenguaje vulgar detectado');
            suggestions.push('Usa lenguaje directo pero profesional para generar el mismo impacto');
        }
        if (p.promesas_exageradas && /ganar millones|rico en días|ingresos pasivos infinitos/.test(content)) {
            warnings.push('Posible promesa exagerada detectada');
            suggestions.push('Sustituye por resultados reales con timeframes verificables');
        }
        if (p.clickbait_engañoso && /no lo creerás|esto te sorprenderá|secreto prohibido/.test(content)) {
            warnings.push('Posible clickbait engañoso detectado');
            suggestions.push('Usa hooks de curiosidad genuina sin defraudar la promesa del título');
        }
        if (p.venta_agresiva && /compra ahora|último lugar|oferta expira/.test(content)) {
            warnings.push('Lenguaje de venta agresiva detectado');
            suggestions.push('Presenta el valor primero, luego la CTA de forma natural');
        }

        return {
            approved: true,
            warnings: warnings.length > 0 ? warnings : undefined,
            suggestions: suggestions.length > 0 ? suggestions : undefined
        };
    }

    // ==================================================================================
    // CONSTRUIR PROMPT CON AVATAR INYECTADO
    // ==================================================================================

    buildPromptWithAvatar(basePrompt: string, avatar: AvatarDNA, mode: string): string {
        const avatarPrompt = this.generateAvatarSystemPrompt(avatar, mode);
        return `${avatarPrompt}\n\n${basePrompt}`;
    }

    // ==================================================================================
    // GENERAR SYSTEM PROMPT — 7 CAPAS COMPLETAS
    // ==================================================================================

    private generateAvatarSystemPrompt(avatar: AvatarDNA, mode: string): string {
        return `
═══════════════════════════════════════════════════════════════════════════════
🧬 AVATAR PROFILE ACTIVO - DNA COGNITIVO OLIMPO (7 CAPAS)
═══════════════════════════════════════════════════════════════════════════════

NOMBRE: ${avatar.name}
MODO: ${mode}
TIPO: ${avatar.person_type || 'creador_contenido'} | INDUSTRIA: ${avatar.industry || 'General'} | CULTURA: ${avatar.country_culture || 'Latam'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CAPA 1-2: IDENTIDAD + OBJETIVO (DIRECTIVAS CORE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NIVEL DE EXPERIENCIA: ${avatar.experience_level.toUpperCase()}
${this.getExperienceDirectives(avatar.experience_level)}

2. OBJETIVO PRINCIPAL: ${avatar.primary_goal.toUpperCase()}
${this.getGoalDirectives(avatar.primary_goal)}

3. NIVEL DE RIESGO: ${avatar.risk_level.toUpperCase()}
${this.getRiskDirectives(avatar.risk_level)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CAPA OLIMPO: AUDIENCIA PROFUNDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFIL DEMOGRAFICO:
- Edad: ${avatar.age_range || 'No definida'} | Genero: ${avatar.gender_predominant || 'Mixto'}
- NSE: ${avatar.socioeconomic_level || 'No definido'} | Educacion: ${avatar.education_level || 'No definida'}
- Etapa de vida: ${avatar.life_stage || 'No definida'}

NIVEL DE CONCIENCIA: ${(avatar.awareness_level || 'consciente_problema').toUpperCase()}
${this.getAwarenessDirectives(avatar.awareness_level || 'consciente_problema')}

MAPA DE TRANSFORMACION:
- Punto A (HOY): ${avatar.transformation_point_a || avatar.central_pain || 'No definido'}
- Punto B (META): ${avatar.dream_outcome || 'No definido'}
- Obstaculo interno: ${avatar.internal_obstacle || avatar.self_doubt || 'No definido'}
- Obstaculo externo: ${avatar.external_obstacle || avatar.recurring_obstacles || 'No definido'}
- Friccion emocional: ${avatar.emotional_friction || avatar.stagnation_feeling || 'No definida'}
- Dolor social (teme que otros piensen): ${avatar.social_pain || 'No definido'}
- Horizonte temporal esperado: ${avatar.timeline_expectation || 'No definido'}

PSICOGRAFIA AVANZADA:
- Tono interno: ${avatar.internal_tone || 'No definido'} -> ${this.getInternalToneDirective(avatar.internal_tone || '')}
- Resistencia al cambio: ${(avatar.change_resistance || 'media').toUpperCase()}
${this.getResistanceDirectives(avatar.change_resistance || 'media')}

TEMPERATURA DE AUDIENCIA: ${(avatar.audience_temperature || 'tibio').toUpperCase()}
- Segmento: ${avatar.audience_segment || 'mixto'}
${this.getTemperatureDirectives(avatar.audience_temperature || 'tibio')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🩸 CAPA 3: DOLOR CENTRAL (AGITA ESTO EN LOS HOOKS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Dolor principal:  ${avatar.central_pain || 'No definido'}
- Frustraciones:    ${avatar.frustrations || 'No definidas'}
- Obstaculos:       ${avatar.recurring_obstacles || 'No definidos'}
- Miedos ocultos:   ${avatar.hidden_fears || 'No definidos'}
- Estancamiento:    ${avatar.stagnation_feeling || 'No definido'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 CAPA 4: DESEO OCULTO (PINTA ESTO EN LA RESOLUCION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Deseo:             ${avatar.hidden_desire || 'No definido'}
- Emocion dominante: ${avatar.dominant_emotion.toUpperCase()}
${this.getEmotionDirectives(avatar.dominant_emotion)}
- Resultado sonado:  ${avatar.dream_outcome || 'No definido'}
- Aspiracion:        ${avatar.status_aspiration || 'No definida'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗣️ CAPA 5: LENGUAJE NATURAL (HABLA EXACTAMENTE ASI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ESTILO COMUNICATIVO: ${avatar.communication_style.toUpperCase()}
${this.getStyleDirectives(avatar.communication_style)}

- Formalidad:  ${avatar.formality_level || 'semiformial'} | Ritmo: ${avatar.mental_rhythm || 'moderado'}
- Jerga nicho: ${avatar.slang_or_expressions || 'Ninguna especificada'}

5. PRIORIDAD DE CONTENIDO: ${avatar.content_priority.toUpperCase()}
${this.getContentDirectives(avatar.content_priority)}

${avatar.signature_vocabulary && avatar.signature_vocabulary.length > 0 ? 'VOCABULARIO CARACTERISTICO:\n' + avatar.signature_vocabulary.map((w: string) => `  - "${w}"`).join('\n') : ''}
${avatar.banned_vocabulary && avatar.banned_vocabulary.length > 0 ? 'VOCABULARIO PROHIBIDO:\n' + avatar.banned_vocabulary.map((w: string) => `  - "${w}"`).join('\n') : ''}
${avatar.preferred_cta_style ? 'ESTILO DE CTA: ' + avatar.preferred_cta_style + '\n' + this.getCTAStyle(avatar.preferred_cta_style) : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 CAPA 6: OBJECIONES (NEUTRALIZA ESTAS EN EL COPY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Principal:    ${avatar.common_objections || 'No definida'}
- Tiempo:       ${avatar.time_objection || 'No definida'}
- Credibilidad: ${avatar.credibility_objection || 'No definida'}
- Competencia:  ${avatar.competition_objection || 'No definida'}
- Duda propia:  ${avatar.self_doubt || 'No definida'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CAPA 7: TRIGGERS EMOCIONALES (USA EN HOOKS Y CTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- General:     ${avatar.emotional_triggers || 'No definido'}
- Urgencia:    ${avatar.urgency_trigger || 'No definido'}
- Estatus:     ${avatar.status_trigger || 'No definido'}
- Pertenencia: ${avatar.belonging_trigger || 'No definido'}
- FOMO:        ${avatar.loss_fear_trigger || 'No definido'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PROHIBICIONES ABSOLUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.getProhibitions(avatar.prohibitions)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 MODELO DE REFERENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARQUETIPO: ${avatar.success_model}
${this.getModelReference(avatar.success_model)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ MANDATO FINAL — CONSTITUCION DE TITAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TODO lo que generes DEBE:
- Objetivo activo:        ${avatar.primary_goal}
- Estilo comunicativo:    ${avatar.communication_style}
- Nivel riesgo:           ${avatar.risk_level}
- Contenido prioritario:  ${avatar.content_priority}
- Emocion dominante:      ${avatar.dominant_emotion}
- Hook agita:             "${avatar.central_pain || 'el dolor central del avatar'}"
- Resolucion pinta:       "${avatar.hidden_desire || 'el deseo oculto del avatar'}"
- CTA activa:             "${avatar.urgency_trigger || avatar.emotional_triggers || 'el trigger principal'}"
- CERO violaciones de prohibiciones

JERARQUIA DE PRIORIDAD:
1. El AVATAR domina el POR QUE y el COMO SE SIENTE (Emocion).
2. El EXPERTO domina el QUE y la PRUEBA TECNICA (Autoridad).
3. Si la peticion del usuario rompe una PROHIBICION -> el sistema se bloquea.

Si hay conflicto entre lo que pide el usuario y el avatar -> EL AVATAR GANA.
═══════════════════════════════════════════════════════════════════════════════
`;
    }

    // ==================================================================================
    // INCREMENTAR CONTADOR DE CONTENIDO (EVOLUCIÓN DEL AVATAR)
    // ==================================================================================

    async incrementContentCount(): Promise<void> {
        if (!this.currentUserId) return;
        try {
            const cached = this.cachedAvatar.get(this.currentUserId);
            if (!cached) return;
            await this.supabase
                .from('avatars')
                .update({
                    evolution_level: (cached.evolution_level || 1) + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('id', cached.id);
            this.cachedAvatar.delete(this.currentUserId);
        } catch (e) {
            console.error('Error incrementando evolución:', e);
        }
    }

    // ==================================================================================
    // HELPERS — DIRECTIVAS POR CAMPO
    // ==================================================================================

    private getExperienceDirectives(level: string): string {
        const directives: Record<string, string> = {
            'principiante': `-> Usa lenguaje SIMPLE y cotidiano\n-> Explica conceptos basicos sin asumir conocimiento previo\n-> Estructura paso a paso muy clara\n-> Evita jerga tecnica o explicala siempre\n-> Ejemplos concretos y relacionables`,
            'intermedio': `-> Balance entre tecnico y accesible\n-> Puedes usar terminologia del sector (pero define)\n-> Profundidad media en explicaciones\n-> Ejemplos practicos del mercado\n-> Asume conocimiento basico del tema`,
            'avanzado': `-> Lenguaje sofisticado y preciso\n-> Asume alto conocimiento del sector\n-> Profundiza en estrategias avanzadas\n-> Referencias a casos complejos\n-> Zero explicaciones basicas`,
            'experto': `-> Maxima profundidad tecnica\n-> Insights de nivel industria\n-> Analisis de patrones complejos\n-> Referencias academicas/profesionales\n-> Lenguaje de experto a experto`
        };
        return directives[level] || directives['intermedio'];
    }

    private getGoalDirectives(goal: string): string {
        const directives: Record<string, string> = {
            'viralidad': `-> Hook ULTRA fuerte en primeros 3 segundos\n-> Patron de interrupcion agresivo\n-> Formato optimizado para algoritmo\n-> CTA hacia compartir/comentar\n-> Prioridad: Engagement > Profundidad`,
            'autoridad': `-> Citar datos, estudios, fuentes\n-> Demostrar expertise profundo\n-> Opiniones fundamentadas con evidencia\n-> Evitar clickbait sensacionalista\n-> Prioridad: Credibilidad > Todo`,
            'venta': `-> CTA claros y directos hacia oferta\n-> Beneficios tangibles destacados\n-> Manejo preventivo de objeciones\n-> Urgencia/escasez cuando aplique\n-> Prioridad: Conversion > Engagement`,
            'comunidad': `-> Preguntas abiertas que invitan dialogo\n-> Tono inclusivo y cercano\n-> Crear sentido de pertenencia\n-> CTAs hacia participacion\n-> Prioridad: Interaccion > Venta`,
            'posicionamiento': `-> Mensaje de marca ultra consistente\n-> Diferenciacion clara vs competencia\n-> Valores y mision siempre presentes\n-> Expertise unico destacado\n-> Prioridad: Coherencia de marca > Viralidad`
        };
        return directives[goal] || directives['autoridad'];
    }

    private getStyleDirectives(style: string): string {
        const directives: Record<string, string> = {
            'directo': `-> Sin rodeos, al grano inmediatamente\n-> Frases cortas y contundentes\n-> Cero relleno innecesario`,
            'analitico': `-> Basado en datos y logica\n-> Estructura clara A->B->C\n-> Desglose detallado de conceptos`,
            'inspirador': `-> Lenguaje motivacional y aspiracional\n-> Historias de transformacion\n-> Enfoque en posibilidades`,
            'provocador': `-> Cuestionamiento del status quo\n-> Opiniones polarizantes (controladas)\n-> Desafio a creencias comunes`,
            'didactico': `-> Explicativo paso a paso\n-> Analogias y ejemplos claros\n-> Tono de mentor/profesor`
        };
        return directives[style] || directives['directo'];
    }

    private getRiskDirectives(risk: string): string {
        const directives: Record<string, string> = {
            'conservador': `-> Evita afirmaciones polemicas\n-> Opiniones balanceadas y fundamentadas\n-> Promesas realistas y alcanzables\n-> Tono profesional y medido`,
            'balanceado': `-> Opiniones claras pero justificadas\n-> Controversia calculada si aporta valor\n-> Promesas ambiciosas pero creibles\n-> Tono firme pero profesional`,
            'agresivo': `-> Opiniones polarizantes permitidas\n-> Afirmaciones fuertes y contundentes\n-> Desafio directo a status quo\n-> Lenguaje disruptivo`
        };
        return directives[risk] || directives['balanceado'];
    }

    private getContentDirectives(content: string): string {
        const directives: Record<string, string> = {
            'educativo': `-> Foco en ensenar conceptos\n-> Valor educativo claro\n-> Estructura didactica\n-> Takeaways accionables`,
            'opinion': `-> Hot takes y perspectivas unicas\n-> Postura clara sobre temas\n-> Argumentacion solida\n-> Invitacion al debate`,
            'storytelling': `-> Narrativa personal o casos\n-> Estructura de historia (inicio-conflicto-resolucion)\n-> Conexion emocional\n-> Leccion al final`,
            'venta_encubierta': `-> Educar mientras introduces solucion\n-> Soft sell natural\n-> Valor primero, oferta despues\n-> CTA suave al final`,
            'viral_corto': `-> Maximo impacto en minimo tiempo\n-> Hook ultra fuerte\n-> Payoff rapido\n-> Formato snackable`
        };
        return directives[content] || directives['educativo'];
    }

    private getEmotionDirectives(emotion: string): string {
        const directives: Record<string, string> = {
            'curiosidad': `-> Generar preguntas en la mente\n-> Loop abierto que invita a seguir\n-> Informacion revelada gradualmente`,
            'deseo': `-> Pintar resultado aspiracional\n-> Beneficios tangibles destacados\n-> Crear FOMO o aspiracion`,
            'miedo': `-> Consecuencias de inaccion\n-> Problema urgente destacado\n-> Pero: Ofrecer solucion, no solo miedo`,
            'aspiracion': `-> Vision de futuro mejor\n-> Transformacion posible\n-> Identidad aspiracional`,
            'autoridad': `-> Demostrar expertise\n-> Citar fuentes y datos\n-> Credibilidad por encima de todo`
        };
        return directives[emotion] || directives['curiosidad'];
    }

    private getProhibitions(prohibitions: any): string {
        const active: string[] = [];
        if (prohibitions?.lenguaje_vulgar) active.push('- Lenguaje vulgar o groserías');
        if (prohibitions?.promesas_exageradas) active.push('- Promesas exageradas o irreales');
        if (prohibitions?.polemica_barata) active.push('- Polemica barata sin fundamento');
        if (prohibitions?.clickbait_engañoso) active.push('- Clickbait enganoso');
        if (prohibitions?.venta_agresiva) active.push('- Venta agresiva sin valor previo');
        if (prohibitions?.comparaciones_directas) active.push('- Comparaciones directas con competencia');
        if (prohibitions?.contenido_negativo) active.push('- Contenido excesivamente negativo');
        return active.length > 0 ? active.join('\n') : 'Sin prohibiciones especificas configuradas';
    }

    private getModelReference(model: string): string {
        const references: Record<string, string> = {
            'educador_serio': 'Gary Vaynerchuk, Neil Patel — Educador con autoridad y datos',
            'empresario_premium': 'Alex Hormozi, Grant Cardone — Empresario de alto ticket',
            'influencer_agresivo': 'Dan Lok, Tai Lopez — Disruptivo y polarizante',
            'mentor_disruptivo': 'Russell Brunson, Tony Robbins — Mentor transformacional',
            'experto_tecnico': 'Tim Ferriss, Naval Ravikant — Experto analitico y preciso',
            'creativo_viral': 'MrBeast, Casey Neistat — Creativo de alto impacto'
        };
        return references[model] || 'Profesional balanceado';
    }

    private getCTAStyle(style: string): string {
        const styles: Record<string, string> = {
            'directo': 'CTA claro: Haz la accion ahora',
            'suave': 'CTA sutil: Si te interesa, puedes...',
            'urgencia': 'CTA con urgencia: Solo hoy / Ultimas plazas',
            'curiosidad': 'CTA por curiosidad: Quieres saber como?',
            'exclusividad': 'CTA exclusivo: Solo para miembros / Acceso limitado'
        };
        return styles[style] || styles['directo'];
    }

    private getAwarenessDirectives(level: string): string {
        const map: Record<string, string> = {
            'inconsciente': `-> NO menciones el problema directamente\n-> Hook basado en identidad o resultado\n-> Nivel de confrontacion: CERO\n-> Promesa: aspiracional y suave`,
            'consciente_problema': `-> Ataca el dolor directo desde el primer segundo\n-> Hook: Si tienes [dolor]...\n-> Nivel de confrontacion: MEDIO\n-> No expliques la solucion todavia`,
            'consciente_solucion': `-> Diferenciate de otras soluciones\n-> Hook: por que las otras soluciones fallan\n-> Nivel de confrontacion: ALTO\n-> Posicionate como la opcion correcta`,
            'consciente_producto': `-> Habla de resultados y prueba social\n-> Hook: casos de exito o transformacion\n-> Nivel de confrontacion: BAJO\n-> CTA mas directa hacia la accion`,
            'listo_decidir': `-> Elimina friccion de la decision\n-> Hook: urgencia y escasez\n-> Confrontacion: CERO (ya esta convencido)\n-> CTA directa e inmediata`
        };
        return map[level] || map['consciente_problema'];
    }

    private getResistanceDirectives(level: string): string {
        const map: Record<string, string> = {
            'alta': `-> Usa mucha prueba social y datos\n-> Confrontacion progresiva, no inmediata\n-> Estructura: Problema -> Evidencia -> Solucion\n-> Evita afirmaciones sin respaldo`,
            'media': `-> Balance entre confrontacion y validacion\n-> Historia de transformacion como puente\n-> Evidencia moderada`,
            'baja': `-> Puedes ir directo al insight\n-> Hook agresivo permitido\n-> Menos contexto, mas accion`
        };
        return map[level] || map['media'];
    }

    private getTemperatureDirectives(temp: string): string {
        const map: Record<string, string> = {
            'frio': `-> Contenido educativo primero, venta NUNCA directa\n-> Construye confianza antes que conversion\n-> Hook: curiosidad o dato sorprendente`,
            'tibio': `-> Mix educacion + autoridad + CTA suave\n-> Prueba social estrategica\n-> Puede haber mencion indirecta de oferta`,
            'caliente': `-> CTA directa permitida\n-> Objeciones en el copy\n-> Urgencia y escasez activadas`
        };
        return map[temp] || map['tibio'];
    }

    private getInternalToneDirective(tone: string): string {
        const map: Record<string, string> = {
            'victima': 'Hook debe validar primero, luego empoderar',
            'ambicioso': 'Hook directo al resultado, sin victimizacion',
            'confundido': 'Hook de claridad: Por fin entenderas...',
            'frustrado': 'Hook de confrontacion: Cansado de...?',
            'esperanzado': 'Hook aspiracional: Imagina si...'
        };
        return map[tone] || 'Adaptar segun contexto';
    }

    // ==================================================================================
    // CACHE
    // ==================================================================================

    invalidateCache(userId: string): void {
        this.cachedAvatar.delete(userId);
    }

    clearAllCache(): void {
        this.cachedAvatar.clear();
    }
}

export default AvatarMiddleware;