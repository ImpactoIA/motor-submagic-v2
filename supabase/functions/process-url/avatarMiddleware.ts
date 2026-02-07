// ==================================================================================
// 🛡️ AVATAR MIDDLEWARE - VALIDADOR OBLIGATORIO
// ==================================================================================
// Este middleware SE EJECUTA EN TODAS LAS FUNCIONES
// Si no hay avatar activo → SISTEMA BLOQUEADO
// ==================================================================================

import { SupabaseClient } from '@supabase/supabase-js';

// ==================================================================================
// TIPOS
// ==================================================================================

export interface AvatarDNA {
    id: string;
    name: string;
    
    // CORE OBLIGATORIO
    experience_level: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
    primary_goal: 'viralidad' | 'autoridad' | 'venta' | 'comunidad' | 'posicionamiento';
    communication_style: 'directo' | 'analitico' | 'inspirador' | 'provocador' | 'didactico';
    risk_level: 'conservador' | 'balanceado' | 'agresivo';
    content_priority: 'educativo' | 'opinion' | 'storytelling' | 'venta_encubierta' | 'viral_corto';
    dominant_emotion: 'curiosidad' | 'deseo' | 'miedo' | 'aspiracion' | 'autoridad';
    
    // LÍMITES
    prohibitions: {
        lenguaje_vulgar?: boolean;
        promesas_exageradas?: boolean;
        polemica_barata?: boolean;
        clickbait_engañoso?: boolean;
        venta_agresiva?: boolean;
        comparaciones_directas?: boolean;
        contenido_negativo?: boolean;
    };
    
    success_model: 'educador_serio' | 'empresario_premium' | 'influencer_agresivo' | 'mentor_disruptivo' | 'experto_tecnico' | 'creativo_viral';
    
    // PERSONALIZACIÓN
    signature_vocabulary?: string[];
    banned_vocabulary?: string[];
    narrative_structure?: string;
    preferred_length?: string;
    preferred_cta_style?: string;
    
    // EVOLUCIÓN
    evolution_level: number;
    coherence_score?: number;
}

export interface AvatarValidationResult {
    success: boolean;
    avatar?: AvatarDNA;
    error?: string;
    warnings?: string[];
}

// ==================================================================================
// MIDDLEWARE CLASS
// ==================================================================================

export class AvatarMiddleware {
    private supabase: SupabaseClient;
    private cachedAvatar: Map<string, AvatarDNA> = new Map();
    
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    
    // ==================================================================================
    // MÉTODO PRINCIPAL: VALIDAR Y OBTENER AVATAR
    // ==================================================================================
    
    async validateAndGetAvatar(userId: string): Promise<AvatarValidationResult> {
        try {
            // 1. Verificar cache
            if (this.cachedAvatar.has(userId)) {
                return {
                    success: true,
                    avatar: this.cachedAvatar.get(userId)!
                };
            }
            
            // 2. Consultar avatar activo
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
            
            // 3. Validar integridad del avatar
            const validation = this.validateAvatarIntegrity(avatar);
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Avatar incompleto. Faltan campos obligatorios.',
                    warnings: validation.missing_fields
                };
            }
            
            // 4. Cachear avatar
            this.cachedAvatar.set(userId, avatar);
            
            return {
                success: true,
                avatar
            };
            
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
        
        return {
            valid: missing_fields.length === 0,
            missing_fields: missing_fields.length > 0 ? missing_fields : undefined
        };
    }
    
    // ==================================================================================
    // CONSTRUIR PROMPT CON AVATAR INYECTADO
    // ==================================================================================
    
    buildPromptWithAvatar(basePrompt: string, avatar: AvatarDNA, mode: string): string {
        // Construir el prompt completo con el DNA del avatar
        const avatarPrompt = this.generateAvatarSystemPrompt(avatar, mode);
        
        return `${avatarPrompt}\n\n${basePrompt}`;
    }
    
    // ==================================================================================
    // GENERAR SYSTEM PROMPT DEL AVATAR
    // ==================================================================================
    
    private generateAvatarSystemPrompt(avatar: AvatarDNA, mode: string): string {
        return `
═══════════════════════════════════════════════════════════════════════════════
🧬 AVATAR PROFILE ACTIVO - DNA COGNITIVO OBLIGATORIO
═══════════════════════════════════════════════════════════════════════════════

NOMBRE: ${avatar.name}
MODO: ${mode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 DIRECTIVAS CORE (NO NEGOCIABLES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NIVEL DE EXPERIENCIA: ${avatar.experience_level.toUpperCase()}
${this.getExperienceDirectives(avatar.experience_level)}

2. OBJETIVO PRINCIPAL: ${avatar.primary_goal.toUpperCase()}
${this.getGoalDirectives(avatar.primary_goal)}

3. ESTILO COMUNICATIVO: ${avatar.communication_style.toUpperCase()}
${this.getStyleDirectives(avatar.communication_style)}

4. NIVEL DE RIESGO: ${avatar.risk_level.toUpperCase()}
${this.getRiskDirectives(avatar.risk_level)}

5. PRIORIDAD DE CONTENIDO: ${avatar.content_priority.toUpperCase()}
${this.getContentDirectives(avatar.content_priority)}

6. EMOCIÓN DOMINANTE: ${avatar.dominant_emotion.toUpperCase()}
${this.getEmotionDirectives(avatar.dominant_emotion)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PROHIBICIONES ABSOLUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.getProhibitions(avatar.prohibitions)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PERSONALIZACIÓN AVANZADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODELO DE REFERENCIA: ${avatar.success_model}
${this.getModelReference(avatar.success_model)}

${avatar.signature_vocabulary && avatar.signature_vocabulary.length > 0 ? `
VOCABULARIO CARACTERÍSTICO:
${avatar.signature_vocabulary.map(w => `✓ "${w}"`).join('\n')}
` : ''}

${avatar.banned_vocabulary && avatar.banned_vocabulary.length > 0 ? `
VOCABULARIO PROHIBIDO:
${avatar.banned_vocabulary.map(w => `✗ "${w}"`).join('\n')}
` : ''}

${avatar.preferred_cta_style ? `
ESTILO DE CTA: ${avatar.preferred_cta_style}
${this.getCTAStyle(avatar.preferred_cta_style)}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ MANDATO FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TODO lo que generes DEBE:
✓ Alinearse con el objetivo principal (${avatar.primary_goal})
✓ Usar el estilo comunicativo (${avatar.communication_style})
✓ Respetar el nivel de riesgo (${avatar.risk_level})
✓ Priorizar el tipo de contenido (${avatar.content_priority})
✓ Evocar la emoción dominante (${avatar.dominant_emotion})
✓ NO violar ninguna prohibición

Si hay conflicto entre lo que pide el usuario y el avatar → EL AVATAR GANA.

═══════════════════════════════════════════════════════════════════════════════
`;
    }
    
    // ==================================================================================
    // HELPERS: DIRECTIVAS POR CAMPO
    // ==================================================================================
    
    private getExperienceDirectives(level: string): string {
        const directives = {
            'principiante': `
→ Usa lenguaje SIMPLE y cotidiano
→ Explica conceptos básicos sin asumir conocimiento previo
→ Estructura paso a paso muy clara
→ Evita jerga técnica o explícala siempre
→ Ejemplos concretos y relacionables`,
            
            'intermedio': `
→ Balance entre técnico y accesible
→ Puedes usar terminología del sector (pero define)
→ Profundidad media en explicaciones
→ Ejemplos prácticos del mercado
→ Asume conocimiento básico del tema`,
            
            'avanzado': `
→ Lenguaje sofisticado y preciso
→ Asume alto conocimiento del sector
→ Profundiza en estrategias avanzadas
→ Referencias a casos complejos
→ Zero explicaciones básicas`,
            
            'experto': `
→ Máxima profundidad técnica
→ Insights de nivel industria
→ Análisis de patrones complejos
→ Referencias académicas/profesionales
→ Lenguaje de experto a experto`
        };
        
        return directives[level as keyof typeof directives] || directives['intermedio'];
    }
    
    private getGoalDirectives(goal: string): string {
        const directives = {
            'viralidad': `
→ Hook ULTRA fuerte en primeros 3 segundos
→ Patrón de interrupción agresivo
→ Formato optimizado para algoritmo
→ CTA hacia compartir/comentar
→ Prioridad: Engagement > Profundidad`,
            
            'autoridad': `
→ Citar datos, estudios, fuentes
→ Demostrar expertise profundo
→ Opiniones fundamentadas con evidencia
→ Evitar clickbait sensacionalista
→ Prioridad: Credibilidad > Todo`,
            
            'venta': `
→ CTA claros y directos hacia oferta
→ Beneficios tangibles destacados
→ Manejo preventivo de objeciones
→ Urgencia/escasez cuando aplique
→ Prioridad: Conversión > Engagement`,
            
            'comunidad': `
→ Preguntas abiertas que invitan diálogo
→ Tono inclusivo y cercano
→ Crear sentido de pertenencia
→ CTAs hacia participación
→ Prioridad: Interacción > Venta`,
            
            'posicionamiento': `
→ Mensaje de marca ultra consistente
→ Diferenciación clara vs competencia
→ Valores y misión siempre presentes
→ Expertise único destacado
→ Prioridad: Coherencia de marca > Viralidad`
        };
        
        return directives[goal as keyof typeof directives] || directives['autoridad'];
    }
    
    private getStyleDirectives(style: string): string {
        const directives = {
            'directo': `
→ Sin rodeos, al grano inmediatamente
→ Frases cortas y contundentes
→ Cero relleno innecesario
→ Ejemplo: "Esto es lo que necesitas: [punto clave]"`,
            
            'analitico': `
→ Basado en datos y lógica
→ Estructura clara A→B→C
→ Desglose detallado de conceptos
→ Ejemplo: "Analicemos esto en 3 partes..."`,
            
            'inspirador': `
→ Lenguaje motivacional y aspiracional
→ Historias de transformación
→ Enfoque en posibilidades
→ Ejemplo: "Imagina lo que podrías lograr si..."`,
            
            'provocador': `
→ Cuestionamiento del status quo
→ Opiniones polarizantes (controladas)
→ Desafío a creencias comunes
→ Ejemplo: "La verdad que nadie te dice sobre..."`,
            
            'didactico': `
→ Explicativo paso a paso
→ Analogías y ejemplos claros
→ Tono de mentor/profesor
→ Ejemplo: "Déjame explicarte esto de forma simple..."`
        };
        
        return directives[style as keyof typeof directives] || directives['directo'];
    }
    
    private getRiskDirectives(risk: string): string {
        const directives = {
            'conservador': `
→ Evita afirmaciones polémicas
→ Opiniones balanceadas y fundamentadas
→ Promesas realistas y alcanzables
→ Tono profesional y medido
❌ NO: Controversia, extremos, clickbait agresivo`,
            
            'balanceado': `
→ Opiniones claras pero justificadas
→ Controversia calculada si aporta valor
→ Promesas ambiciosas pero creíbles
→ Tono firme pero profesional`,
            
            'agresivo': `
→ Opiniones polarizantes permitidas
→ Afirmaciones fuertes y contundentes
→ Desafío directo a status quo
→ Lenguaje disruptivo
✓ PERO: Respeta prohibiciones del avatar`
        };
        
        return directives[risk as keyof typeof directives] || directives['balanceado'];
    }
    
    private getContentDirectives(content: string): string {
        const directives = {
            'educativo': `
→ Foco en enseñar conceptos
→ Valor educativo claro
→ Estructura didáctica
→ Takeaways accionables`,
            
            'opinion': `
→ Hot takes y perspectivas únicas
→ Postura clara sobre temas
→ Argumentación sólida
→ Invitación al debate`,
            
            'storytelling': `
→ Narrativa personal o casos
→ Estructura de historia (inicio-conflicto-resolución)
→ Conexión emocional
→ Lección al final`,
            
            'venta_encubierta': `
→ Educar mientras introduces solución
→ Soft sell natural
→ Valor primero, oferta después
→ CTA suave al final`,
            
            'viral_corto': `
→ Máximo impacto en mínimo tiempo
→ Hook ultra fuerte
→ Payoff rápido
→ Formato snackable`
        };
        
        return directives[content as keyof typeof directives] || directives['educativo'];
    }
    
    private getEmotionDirectives(emotion: string): string {
        const directives = {
            'curiosidad': `
→ Generar preguntas en la mente
→ "Loop abierto" que invita a seguir
→ Información revelada gradualmente
→ Ejemplo: "Descubrí algo que cambió todo..."`,
            
            'deseo': `
→ Pintar resultado aspiracional
→ Beneficios tangibles destacados
→ "Imagina tener/ser..."
→ Crear FOMO o aspiración`,
            
            'miedo': `
→ Consecuencias de inacción
→ Problema urgente destacado
→ "Si no haces X, pasará Y"
→ Pero: Ofrecer solución, no solo miedo`,
            
            'aspiracion': `
→ Visión de futuro mejor
→ Transformación posible
→ Identidad aspiracional
→ "Conviértete en..."`,
            
            'autoridad': `
→ Demostrar expertise
→ Citar fuentes y datos
→ Lenguaje de experto
→ Credibilidad por encima de todo`
        };
        
        return directives[emotion as keyof typeof directives] || directives['curiosidad'];
    }
    
    private getProhibitions(prohibitions: any): string {
        const active = [];
        
        if (prohibitions.lenguaje_vulgar) active.push('✗ Lenguaje vulgar o groserías');
        if (prohibitions.promesas_exageradas) active.push('✗ Promesas exageradas o irreales');
        if (prohibitions.polemica_barata) active.push('✗ Polémica barata sin fundamento');
        if (prohibitions.clickbait_engañoso) active.push('✗ Clickbait engañoso');
        if (prohibitions.venta_agresiva) active.push('✗ Venta agresiva sin valor previo');
        if (prohibitions.comparaciones_directas) active.push('✗ Comparaciones directas con competencia');
        if (prohibitions.contenido_negativo) active.push('✗ Contenido excesivamente negativo');
        
        return active.length > 0 ? active.join('\n') : 'No hay prohibiciones específicas';
    }
    
    private getModelReference(model: string): string {
        const references = {
            'educador_serio': 'Gary Vaynerchuk, Neil Patel - Educador con autoridad',
            'empresario_premium': 'Alex Hormozi, Grant Cardone - Empresario de alto ticket',
            'influencer_agresivo': 'Dan Lok, Tai Lopez - Disruptivo y polarizante',
            'mentor_disruptivo': 'Russell Brunson, Tony Robbins - Mentor transformacional',
            'experto_tecnico': 'Tim Ferriss, Naval Ravikant - Experto analítico',
            'creativo_viral': 'MrBeast, Casey Neistat - Creativo de alto impacto'
        };
        
        return references[model as keyof typeof references] || 'Profesional balanceado';
    }
    
    private getCTAStyle(style: string): string {
        const styles = {
            'directo': 'CTA claro: "Haz [acción] ahora"',
            'suave': 'CTA sutil: "Si te interesa, puedes..."',
            'urgencia': 'CTA con urgencia: "Solo hoy", "Últimas plazas"',
            'curiosidad': 'CTA por curiosidad: "¿Quieres saber cómo?"',
            'exclusividad': 'CTA exclusivo: "Solo para miembros", "Acceso limitado"'
        };
        
        return styles[style as keyof typeof styles] || styles['directo'];
    }
    
    // ==================================================================================
    // INVALIDAR CACHE
    // ==================================================================================
    
    invalidateCache(userId: string): void {
        this.cachedAvatar.delete(userId);
    }
    
    clearAllCache(): void {
        this.cachedAvatar.clear();
    }
}

// ==================================================================================
// EXPORT
// ==================================================================================

export default AvatarMiddleware;