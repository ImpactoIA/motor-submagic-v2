import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Activity, RefreshCw, AlertTriangle, CheckCircle2, 
    Zap, ShieldCheck, Trophy, Brain, 
    Eye, ArrowLeft, Target, 
    Flame, Award, Heart, Volume2, ThumbsUp, Share2, Sparkles, 
    AlertCircleIcon, Copy, ChevronRight, Info, TrendingUp, Layers, 
    Settings, ChevronDown, ChevronUp, Gauge,
    Lightbulb, Smile, Frown, Meh, Star
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES TYPESCRIPT
// ==================================================================================

interface ViralJudgeV500Result {
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

// ==================================================================================
// 🎨 CONSTANTES
// ==================================================================================

const MODOS_JUEZ = [
    { 
        id: 'viral', 
        label: 'Viral', 
        icon: Flame, 
        desc: 'Prioriza alcance masivo. Acepta riesgo.',
        color: 'text-orange-400',
        bg: 'bg-orange-900/20',
        border: 'border-orange-500/30'
    },
    { 
        id: 'autoridad', 
        label: 'Autoridad', 
        icon: Award, 
        desc: 'Prioriza posicionamiento y credibilidad.',
        color: 'text-blue-400',
        bg: 'bg-blue-900/20',
        border: 'border-blue-500/30'
    },
    { 
        id: 'estricto', 
        label: 'Estricto', 
        icon: ShieldCheck, 
        desc: 'Evalúa como estratega senior. Marca top.',
        color: 'text-purple-400',
        bg: 'bg-purple-900/20',
        border: 'border-purple-500/30'
    }
];

const PLATAFORMAS = [
    { id: 'TikTok', label: 'TikTok', icon: '🎵' },
    { id: 'Instagram', label: 'Instagram', icon: '📸' },
    { id: 'YouTube', label: 'YouTube', icon: '▶️' },
    { id: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
    { id: 'Facebook', label: 'Facebook', icon: '👥' }
];

const AUDIT_COST = 2;

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const ViralCalculatorV500 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();

    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ViralJudgeV500Result | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedMode, setSelectedMode] = useState('viral');
    const [selectedPlatform, setSelectedPlatform] = useState('TikTok');
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [showOptimizations, setShowOptimizations] = useState(false);
    const [selectedOptimization, setSelectedOptimization] = useState<'hook' | 'tono' | 'plataforma'>('hook');

    useEffect(() => {
        if (location.state?.contentToAnalyze) {
            setInputValue(location.state.contentToAnalyze);
        }
        if (user) fetchContextData();
    }, [location, user]);

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase
                .from('expert_profiles')
                .select('id, niche, name')
                .eq('user_id', user?.id);
            if (exp) setExperts(exp.map((e: any) => ({ id: e.id, name: e.name || e.niche || "Experto" })));

            const { data: av } = await supabase
                .from('avatars')
                .select('id, name')
                .eq('user_id', user?.id);
            if (av) setAvatars(av);

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) {
            console.error('[ViralCalculator] Error cargando contexto:', e);
        }
    };

    const handleAnalyze = async () => {
        if (!inputValue.trim()) {
            setError("⚠️ Ingresa el guion o idea a evaluar.");
            return;
        }
        if (!user || !userProfile) return;

        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < AUDIT_COST) {
            const shouldRecharge = confirm(`💰 Saldo insuficiente. Costo: ${AUDIT_COST} créditos. ¿Recargar?`);
            if (shouldRecharge) navigate('/dashboard/settings');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setShowOptimizations(false);
        setActiveModule(null);

        try {
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'juez_viral',
                    userInput: inputValue.trim(),
                    text: inputValue.trim(),
                    expertId: selectedExpertId || undefined,
                    avatarId: selectedAvatarId || undefined,
                    settings: { mode: selectedMode, platform: selectedPlatform },
                    estimatedCost: AUDIT_COST
                }
            });

            if (apiError) throw new Error(apiError.message || 'Error al conectar con el backend');
            if (!data?.success && !data?.generatedData) {
                throw new Error(data?.error || 'El backend devolvió un error desconocido');
            }

            setResult(data.generatedData || data);
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error('[ViralCalculator] Error:', e);
            setError(e.message || "Error inesperado al analizar.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ==================================================================================
    // 🎨 FUNCIONES DE ESTILO
    // ==================================================================================

    const getScoreStyles = (score: number) => {
        if (score >= 90) return { color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-950/20', label: 'EXCELENTE', icon: Star };
        if (score >= 75) return { color: 'text-green-400', border: 'border-green-500', bg: 'bg-green-950/20', label: 'BUENO', icon: Smile };
        if (score >= 50) return { color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-950/20', label: 'REGULAR', icon: Meh };
        return { color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-950/20', label: 'NECESITA MEJORA', icon: Frown };
    };

    const getModuleIcon = (moduleId: string) => {
        const icons: Record<string, any> = {
            'fidelidad_arquitectonica': Layers,
            'progresion_emocional': Activity,
            'retencion_cognitiva': Eye,
            'hook_power': Zap,
            'densidad_valor': Target,
            'equivalencia_psicologica': Brain,
            'ritmo_narrativo': Volume2,
            'triggers_virales': Share2,
            'autoridad_percibida': Award,
            'conversion_estrategica': TrendingUp
        };
        return icons[moduleId] || Info;
    };

    const getModuleName = (moduleId: string) => {
        const names: Record<string, string> = {
            'fidelidad_arquitectonica': 'Fidelidad Arquitectónica',
            'progresion_emocional': 'Progresión Emocional',
            'retencion_cognitiva': 'Retención Cognitiva',
            'hook_power': 'Poder del Hook',
            'densidad_valor': 'Densidad de Valor',
            'equivalencia_psicologica': 'Equivalencia Psicológica',
            'ritmo_narrativo': 'Ritmo Narrativo',
            'triggers_virales': 'Triggers Virales',
            'autoridad_percibida': 'Autoridad Percibida',
            'conversion_estrategica': 'Conversión Estratégica'
        };
        return names[moduleId] || moduleId;
    };

    const getModuleScore = (moduleId: string, data: any): number => {
        const scoreMap: Record<string, string> = {
            'fidelidad_arquitectonica': 'indice_fidelidad',
            'progresion_emocional': 'indice_intensidad_emocional',
            'retencion_cognitiva': 'retention_risk_score',
            'hook_power': 'hook_power_score',
            'densidad_valor': 'value_density_index',
            'equivalencia_psicologica': 'impact_equivalence_score',
            'ritmo_narrativo': 'rhythm_optimization_score',
            'triggers_virales': 'share_trigger_index',
            'autoridad_percibida': 'authority_score',
            'conversion_estrategica': 'conversion_alignment_score',
        };
        return data[scoreMap[moduleId]] || 0;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("✅ Copiado al portapapeles"))
            .catch(() => alert("❌ Error al copiar"));
    };

    // ==================================================================================
    // 🎨 FUNCIÓN RENDERIZAR MÓDULOS
    // ==================================================================================

    const renderModuleContent = (moduleId: string, data: any, styles: any) => {

        const StatRow = ({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) => (
            <div className="flex justify-between items-start py-1.5 border-b border-gray-800/50 last:border-0 gap-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">{label}</span>
                <span className={`text-xs font-bold text-right ${highlight ? styles.color : 'text-white'}`}>{value ?? '—'}</span>
            </div>
        );

        const ScoreBar = ({ score, label }: { score: number; label: string }) => (
            <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">{label}</span>
                    <span className={score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}>{score}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                </div>
            </div>
        );

        const TagList = ({ items }: { items: string[] }) => {
            if (!items || items.length === 0) return <span className="text-[10px] text-gray-600">Sin datos</span>;
            return (
                <div className="flex flex-wrap gap-1 mt-1">
                    {items.map((item, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{item}</span>
                    ))}
                </div>
            );
        };

        // ── MÓDULO 1: FIDELIDAD ARQUITECTÓNICA ──
        if (moduleId === 'fidelidad_arquitectonica') return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Arquitectura Detectada</p>
                        <p className="text-xs text-white font-bold">{data.arquitectura_detectada || '—'}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Bloques</p>
                        <p className={`text-2xl font-black ${styles.color}`}>{data.bloques_detectados || 0}</p>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Secuencia Narrativa" value={data.secuencia_narrativa} highlight />
                    <StatRow label="Posición Insight" value={data.posicion_insight} highlight />
                    <StatRow label="Posición Clímax" value={data.posicion_climax} highlight />
                    <StatRow label="Tipo de Cierre" value={data.tipo_cierre} />
                    <StatRow label="Riesgo Estructural" value={data.riesgo_estructural} highlight />
                </div>
                {data.bloques_inconsistentes && data.bloques_inconsistentes.length > 0 && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-red-400 uppercase font-bold mb-2">⚠️ Bloques Inconsistentes:</p>
                        <TagList items={data.bloques_inconsistentes} />
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 2: PROGRESIÓN EMOCIONAL ──
        if (moduleId === 'progresion_emocional') return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className={`bg-black/30 rounded-xl p-3 border ${styles.border} text-center`}>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Intensidad</p>
                        <p className={`text-2xl font-black ${styles.color}`}>{data.indice_intensidad_emocional || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">¿Tiene Dinámica?</p>
                        <p className={`text-sm font-black ${data.tiene_dinamica ? 'text-green-400' : 'text-red-400'}`}>
                            {data.tiene_dinamica ? '✅ SÍ' : '❌ NO'}
                        </p>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                    <StatRow label="Riesgo Monotonía" value={data.riesgo_monotonia} highlight />
                </div>
                {data.curva_emocional && data.curva_emocional.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">📈 Curva Emocional:</p>
                        <div className="space-y-2">
                            {data.curva_emocional.map((punto: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-400">{punto.bloque} <span className="text-gray-600">({punto.segundo_inicio}s–{punto.segundo_fin}s)</span></span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400 bg-blue-900/20 px-1.5 rounded text-[9px]">{punto.tipo_emocion}</span>
                                            <span className={styles.color}>{punto.intensidad}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${punto.intensidad >= 75 ? 'bg-green-500' : punto.intensidad >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${punto.intensidad}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.puntos_criticos && data.puntos_criticos.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">⚡ Puntos Críticos:</p>
                        <ul className="space-y-1">{data.puntos_criticos.map((p: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-yellow-500 shrink-0">•</span>{p}</li>
                        ))}</ul>
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 3: RETENCIÓN COGNITIVA ──
        if (moduleId === 'retencion_cognitiva') return (
            <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                    <div className={`bg-black/30 rounded-xl p-3 border ${styles.border} text-center`}>
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Riesgo</p>
                        <p className={`text-2xl font-black ${styles.color}`}>{data.retention_risk_score || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Scroll</p>
                        <p className="text-2xl font-black text-white">{data.scroll_interruption_score || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-red-500/30 text-center">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Abandono</p>
                        <p className="text-2xl font-black text-red-400">{data.segundo_probable_abandono || 0}s</p>
                    </div>
                </div>
                <div className={`p-3 rounded-xl border text-center font-black text-sm ${data.prediccion_usuario_promedio?.toLowerCase().includes('quedar') ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                    {data.prediccion_usuario_promedio || '—'}
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Zona Peligro" value={data.zona_peligro} highlight />
                    <StatRow label="Fricción Principal" value={data.punto_friccion_principal} />
                    <StatRow label="Alto Engagement" value={data.punto_alto_engagement} />
                    <StatRow label="Razón Abandono" value={data.razon_abandono} />
                </div>
            </div>
        );

        // ── MÓDULO 4: HOOK POWER ──
        if (moduleId === 'hook_power') return (
            <div className="space-y-3">
                <div className={`bg-black/30 rounded-xl p-4 border ${styles.border} text-center`}>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Hook Power Score</p>
                    <p className={`text-5xl font-black ${styles.color}`}>{data.hook_power_score || 0}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{data.tipo_hook_detectado}</p>
                </div>
                {data.criterios && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-2">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">📊 Criterios:</p>
                        <ScoreBar score={data.criterios.especificidad} label="Especificidad" />
                        <ScoreBar score={data.criterios.rareza} label="Rareza" />
                        <ScoreBar score={data.criterios.tension} label="Tensión" />
                        <ScoreBar score={data.criterios.curiosidad_incompleta} label="Curiosidad Incompleta" />
                        <ScoreBar score={data.criterios.promesa_clara} label="Promesa Clara" />
                        <ScoreBar score={data.criterios.ruptura_patron} label="Ruptura de Patrón" />
                    </div>
                )}
                <div className="bg-black/40 rounded-xl p-3 border border-red-500/20">
                    <p className="text-[10px] text-red-400 uppercase font-bold mb-1">❌ Hook Original:</p>
                    <p className="text-xs text-gray-400">{data.hook_original || '—'}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-green-500/20">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] text-green-400 uppercase font-bold">✅ Hook Optimizado:</p>
                        <button onClick={() => copyToClipboard(data.hook_optimizado || '')} className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold hover:bg-green-500/40 transition-colors flex items-center gap-1">
                            <Copy size={10}/> Copiar
                        </button>
                    </div>
                    <p className="text-xs text-white font-medium">{data.hook_optimizado || '—'}</p>
                </div>
                {data.diagnostico && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">🔍 Diagnóstico:</p>
                        <p className="text-xs text-gray-300">{data.diagnostico}</p>
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 5: DENSIDAD DE VALOR ──
        if (moduleId === 'densidad_valor') return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className={`bg-black/30 rounded-xl p-3 border ${styles.border} text-center`}>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Value Density</p>
                        <p className={`text-3xl font-black ${styles.color}`}>{data.value_density_index || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Utilidad</p>
                        <p className="text-3xl font-black text-white">{data.porcentaje_utilidad || 0}%</p>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                    <StatRow label="Relleno Detectado" value={data.relleno_detectado ? '⚠️ SÍ' : '✅ NO'} highlight />
                </div>
                {data.insights_por_bloque && data.insights_por_bloque.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">📦 Insights por Bloque:</p>
                        <div className="space-y-1.5">
                            {data.insights_por_bloque.map((bloque: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400">{bloque.bloque}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${bloque.calidad === 'Alto' ? 'bg-green-900/30 text-green-400' : bloque.calidad === 'Medio' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>{bloque.calidad}</span>
                                        <span className={styles.color}>{bloque.cantidad_insights} insights</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.bloques_debiles && data.bloques_debiles.length > 0 && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-red-400 uppercase font-bold mb-1">⚠️ Bloques Débiles:</p>
                        <TagList items={data.bloques_debiles} />
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 6: EQUIVALENCIA PSICOLÓGICA ──
        if (moduleId === 'equivalencia_psicologica') return (
            <div className="space-y-3">
                <div className={`bg-black/30 rounded-xl p-4 border ${styles.border} text-center`}>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Impact Score</p>
                    <p className={`text-5xl font-black ${styles.color}`}>{data.impact_equivalence_score || 0}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Tipo de Promesa" value={data.tipo_promesa} highlight />
                    <StatRow label="Transformación" value={data.tipo_transformacion} />
                    <StatRow label="Emoción Activada" value={data.emocion_activada} highlight />
                    <StatRow label="Tipo de Tensión" value={data.tipo_tension} />
                    <StatRow label="Tipo de Activación" value={data.tipo_activacion} />
                    <StatRow label="Sesgo Cognitivo" value={data.sesgo_cognitivo_explotado} highlight />
                </div>
                {data.impacto_psicologico && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">🧠 Impacto:</p>
                        <p className="text-xs text-gray-300">{data.impacto_psicologico}</p>
                    </div>
                )}
                <div className="space-y-1">
                    <ScoreBar score={data.nivel_activacion_emocional || 0} label="Nivel Activación Emocional" />
                </div>
            </div>
        );

        // ── MÓDULO 7: RITMO NARRATIVO ──
        if (moduleId === 'ritmo_narrativo') return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className={`bg-black/30 rounded-xl p-3 border ${styles.border} text-center`}>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Rhythm Score</p>
                        <p className={`text-3xl font-black ${styles.color}`}>{data.rhythm_optimization_score || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Cadencia</p>
                        <p className="text-xs font-black text-white">{data.cadencia || '—'}</p>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Riesgo Monotonía" value={data.monotony_risk} highlight />
                    <StatRow label="Variación Detectada" value={data.variacion_detectada ? '✅ SÍ' : '❌ NO'} highlight />
                    <StatRow label="Cambios de Tempo" value={data.cambios_tempo} />
                    <StatRow label="Micro-Pausas" value={data.micro_pausas} />
                    <StatRow label="Long. Prom. Frases" value={`${data.longitud_promedio_frases || 0} palabras`} />
                </div>
                {data.ajuste_recomendado && (
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">💡 Ajuste Recomendado:</p>
                        <p className="text-xs text-gray-300">{data.ajuste_recomendado}</p>
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 8: TRIGGERS VIRALES ──
        if (moduleId === 'triggers_virales') return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className={`bg-black/30 rounded-xl p-3 border ${styles.border} text-center`}>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Share Index</p>
                        <p className={`text-3xl font-black ${styles.color}`}>{data.share_trigger_index || 0}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Save Index</p>
                        <p className="text-3xl font-black text-white">{data.save_trigger_index || 0}</p>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                    <StatRow label="Potencial Screenshot" value={data.potencial_screenshot} highlight />
                </div>
                {data.frases_memorables && data.frases_memorables.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">🔥 Frases Memorables:</p>
                        <ul className="space-y-1">{data.frases_memorables.map((f: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-orange-500 shrink-0">★</span>{f}</li>
                        ))}</ul>
                    </div>
                )}
                {data.frases_citables && data.frases_citables.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">💬 Frases Citables:</p>
                        <ul className="space-y-1">{data.frases_citables.map((f: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-blue-500 shrink-0">❝</span>{f}</li>
                        ))}</ul>
                    </div>
                )}
                {data.insights_guardables && data.insights_guardables.length > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">💾 Insights Guardables:</p>
                        <TagList items={data.insights_guardables} />
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 9: AUTORIDAD PERCIBIDA ──
        if (moduleId === 'autoridad_percibida') return (
            <div className="space-y-3">
                <div className={`bg-black/30 rounded-xl p-4 border ${styles.border} text-center`}>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Authority Score</p>
                    <p className={`text-5xl font-black ${styles.color}`}>{data.authority_score || 0}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{data.posicionamiento_creador}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Nivel Credibilidad" value={data.nivel_credibilidad} highlight />
                    <StatRow label="Riesgo Percepción" value={data.riesgo_percepcion_debil} highlight />
                </div>
                {data.elementos_autoridad && data.elementos_autoridad.length > 0 && (
                    <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-green-400 uppercase font-bold mb-2">✅ Elementos que CONSTRUYEN autoridad:</p>
                        <ul className="space-y-1">{data.elementos_autoridad.map((e: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><CheckCircle2 size={10} className="text-green-500 shrink-0 mt-0.5"/>{e}</li>
                        ))}</ul>
                    </div>
                )}
                {data.elementos_debilitan && data.elementos_debilitan.length > 0 && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-red-400 uppercase font-bold mb-2">❌ Elementos que DEBILITAN autoridad:</p>
                        <ul className="space-y-1">{data.elementos_debilitan.map((e: string, i: number) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><AlertTriangle size={10} className="text-red-500 shrink-0 mt-0.5"/>{e}</li>
                        ))}</ul>
                    </div>
                )}
            </div>
        );

        // ── MÓDULO 10: CONVERSIÓN ESTRATÉGICA ──
        if (moduleId === 'conversion_estrategica') return (
            <div className="space-y-3">
                <div className={`bg-black/30 rounded-xl p-4 border ${styles.border} text-center`}>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Conversion Score</p>
                    <p className={`text-5xl font-black ${styles.color}`}>{data.conversion_alignment_score || 0}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-gray-800 space-y-1">
                    <StatRow label="Objetivo Detectado" value={data.objetivo_detectado} highlight />
                    <StatRow label="Tipo de Cierre" value={data.tipo_cierre} />
                    <StatRow label="Alineación" value={data.alineacion} highlight />
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-red-500/20">
                    <p className="text-[10px] text-red-400 uppercase font-bold mb-1">❌ CTA Actual:</p>
                    <p className="text-xs text-gray-400">{data.cta_actual || '—'}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-green-500/20">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] text-green-400 uppercase font-bold">✅ CTA Optimizado:</p>
                        <button onClick={() => copyToClipboard(data.cta_optimizado || '')} className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold hover:bg-green-500/40 transition-colors flex items-center gap-1">
                            <Copy size={10}/> Copiar
                        </button>
                    </div>
                    <p className="text-xs text-white font-medium">{data.cta_optimizado || '—'}</p>
                </div>
                {data.optimizacion_recomendada && (
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">💡 Optimización Recomendada:</p>
                        <p className="text-xs text-gray-300">{data.optimizacion_recomendada}</p>
                    </div>
                )}
            </div>
        );

        // Fallback
        return (
            <div className="text-xs text-gray-400 bg-gray-900/50 rounded-lg p-3">
                <pre className="whitespace-pre-wrap text-[10px]">{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    // ==================================================================================
    // 🎨 RENDERIZADO PRINCIPAL
    // ==================================================================================

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-all text-gray-400 hover:text-white">
                    <ArrowLeft size={24}/>
                </button>
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Brain size={12} className="animate-pulse" /> Juez Viral V500 OMEGA
                    </div>
                    <h1 className="text-3xl font-black flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                        <Activity size={32} className="text-pink-500" /> SISTEMA DE SIMULACIÓN COGNITIVA
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">10 Módulos Obligatorios | Predicción Matemática | Optimización Automática</p>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Créditos:</span>
                    <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* PANEL IZQUIERDO */}
                <div className="lg:col-span-5 space-y-6">

                    {/* MODO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <Settings size={14} /> Modo de Evaluación
                        </label>
                        <div className="space-y-2">
                            {MODOS_JUEZ.map((modo) => (
                                <button key={modo.id} onClick={() => setSelectedMode(modo.id)}
                                    className={`w-full p-3 rounded-xl border text-left transition-all ${selectedMode === modo.id ? `${modo.bg} ${modo.border} ${modo.color}` : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'}`}>
                                    <div className="flex items-center gap-3">
                                        <modo.icon size={18} />
                                        <div className="flex-1">
                                            <span className="font-bold text-sm block">{modo.label}</span>
                                            <p className="text-[10px] opacity-70 mt-0.5">{modo.desc}</p>
                                        </div>
                                        {selectedMode === modo.id && <CheckCircle2 size={16} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PLATAFORMA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">Plataforma Objetivo</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PLATAFORMAS.map((plat) => (
                                <button key={plat.id} onClick={() => setSelectedPlatform(plat.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-sm ${selectedPlatform === plat.id ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800'}`}>
                                    <span className="text-lg">{plat.icon}</span>{plat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONTEXTO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                            <ShieldCheck size={14} /> Contexto del Análisis
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Trophy size={14}/></div>
                            <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-indigo-500 appearance-none">
                                <option value="">-- Sin experto --</option>
                                {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Heart size={14}/></div>
                            <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-pink-500 appearance-none">
                                <option value="">-- Sin avatar --</option>
                                {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* TEXTAREA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col" style={{ minHeight: '400px' }}>
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">Contenido a Evaluar</label>
                        <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pega aquí tu guion completo, caption o idea..."
                            className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-pink-500/50 resize-none font-medium placeholder:text-gray-700 shadow-inner leading-relaxed"/>
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
                            <span>{inputValue.length} caracteres</span>
                            <span>Mínimo recomendado: 100</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                            <AlertTriangle size={16}/><span>{error}</span>
                        </div>
                    )}

                    <button onClick={handleAnalyze} disabled={!inputValue.trim() || isAnalyzing}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group">
                        {isAnalyzing ? (
                            <><RefreshCw className="animate-spin" size={20}/>SIMULANDO COMPORTAMIENTO...</>
                        ) : (
                            <><Brain size={20} className="group-hover:rotate-12 transition-transform"/>INICIAR ANÁLISIS SUPREMO ({AUDIT_COST} CR)</>
                        )}
                    </button>
                </div>

                {/* PANEL DERECHO */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="space-y-6 animate-in slide-in-from-right-10">

                            {/* VEREDICTO */}
                            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl">
                                <div className="flex justify-between items-start pb-6 border-b border-gray-800">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${getScoreStyles(result.veredicto_final?.score_total || 0).color}`}>
                                            {result.veredicto_final?.clasificacion || "EVALUACIÓN COMPLETADA"}
                                        </p>
                                        <div className="flex items-baseline gap-3">
                                            <h2 className="text-7xl font-black text-white">{result.veredicto_final?.score_total || 0}</h2>
                                            <span className="text-2xl text-gray-600">/100</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                            <Gauge size={14}/>Confianza: <span className="font-bold text-white">{result.veredicto_final?.confianza_prediccion || "Media"}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 px-4 py-2 rounded-xl border border-orange-500/30 flex items-center gap-2">
                                            <Flame size={14} className="text-orange-400"/>
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-500 uppercase font-bold">Probabilidad Viral</p>
                                                <p className="text-xs font-bold text-white">{result.veredicto_final?.probabilidad_viral || "?"}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 px-4 py-2 rounded-xl border border-blue-500/30 flex items-center gap-2">
                                            <Eye size={14} className="text-blue-400"/>
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-500 uppercase font-bold">Vistas Estimadas</p>
                                                <p className="text-xs font-bold text-white">{result.prediccion_metricas?.vistas_estimadas || "?"}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 px-4 py-2 rounded-xl border border-green-500/30 flex items-center gap-2">
                                            <ThumbsUp size={14} className="text-green-400"/>
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-500 uppercase font-bold">Engagement</p>
                                                <p className="text-xs font-bold text-white">{result.prediccion_metricas?.engagement_rate || "?"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* DIAGNÓSTICO */}
                                <div className="mt-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                    <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Brain size={16}/> Diagnóstico del Sistema
                                    </h3>
                                    <div className="space-y-3 relative z-10">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">📊 Diagnóstico Principal:</span>
                                            <p className="text-white font-bold text-sm">{result.diagnostico_maestro?.diagnostico_principal}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">⚠️ Error Principal:</span>
                                            <p className="text-red-400 font-medium text-sm">{result.diagnostico_maestro?.error_principal}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">💡 Mejora Concreta:</span>
                                            <p className="text-gray-300 text-sm whitespace-pre-line">{result.diagnostico_maestro?.mejora_concreta}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 10 MÓDULOS */}
                            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Layers size={14}/> 10 Módulos de Análisis Supremo
                                </h3>
                                <div className="space-y-3">
                                    {result.modulos && Object.entries(result.modulos).map(([moduleId, moduleData]: [string, any]) => {
                                        const Icon = getModuleIcon(moduleId);
                                        const isOpen = activeModule === moduleId;
                                        const moduleScore = getModuleScore(moduleId, moduleData);
                                        const styles = getScoreStyles(moduleScore);
                                        const ScoreIcon = styles.icon;

                                        return (
                                            <div key={moduleId} className={`border rounded-xl transition-all ${isOpen ? styles.border : 'border-gray-800'} ${isOpen ? styles.bg : 'bg-gray-900/50'}`}>
                                                <button onClick={() => setActiveModule(activeModule === moduleId ? null : moduleId)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
                                                            <Icon size={16} className={styles.color}/>
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="font-bold text-sm text-white block">{getModuleName(moduleId)}</span>
                                                            <span className="text-xs text-gray-500">Click para expandir análisis</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <ScoreIcon size={14} className={styles.color}/>
                                                            <span className={`text-xl font-black ${styles.color}`}>{moduleScore}</span>
                                                        </div>
                                                        {isOpen ? <ChevronUp size={16} className={styles.color}/> : <ChevronDown size={16} className="text-gray-500"/>}
                                                    </div>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2">
                                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                                                        {renderModuleContent(moduleId, moduleData, styles)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* OPTIMIZACIONES */}
                            {result.optimizaciones_automaticas && (
                                <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={14}/> Optimizaciones Automáticas
                                        </h3>
                                        <button onClick={() => setShowOptimizations(!showOptimizations)}
                                            className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-3 py-1 rounded-lg transition-colors font-bold uppercase flex items-center gap-1">
                                            {showOptimizations ? 'Ocultar' : 'Ver Soluciones'}
                                            <ChevronRight size={12} className={`transition-transform ${showOptimizations ? 'rotate-90' : ''}`}/>
                                        </button>
                                    </div>
                                    {showOptimizations && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2">
                                            <div className="flex gap-2 border-b border-gray-800 pb-2">
                                                {(['hook', 'tono', 'plataforma'] as const).map((opt) => (
                                                    <button key={opt} onClick={() => setSelectedOptimization(opt)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${selectedOptimization === opt ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}>
                                                        {opt === 'hook' ? '🎣 Hook' : opt === 'tono' ? '🎭 Tono' : '📱 Plataforma'}
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedOptimization === 'hook' && result.optimizaciones_automaticas.hook_reescrito && (
                                                <div className="space-y-3">
                                                    <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
                                                        <span className="text-[10px] text-red-400 uppercase font-bold block mb-2">❌ Original:</span>
                                                        <p className="text-gray-400 text-sm">{result.optimizaciones_automaticas.hook_reescrito.original}</p>
                                                    </div>
                                                    <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-green-400 uppercase font-bold">✅ Optimizado:</span>
                                                                <span className="text-[10px] text-green-300 bg-green-900/30 px-2 py-0.5 rounded">+{result.optimizaciones_automaticas.hook_reescrito.score_mejora} puntos</span>
                                                            </div>
                                                            <button onClick={() => copyToClipboard(result!.optimizaciones_automaticas.hook_reescrito.optimizado)}
                                                                className="text-[10px] bg-green-500/20 hover:bg-green-500/40 text-green-300 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                                                <Copy size={10}/> Copiar
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-200 text-sm font-medium mb-2">{result.optimizaciones_automaticas.hook_reescrito.optimizado}</p>
                                                        <p className="text-xs text-gray-500 italic">💡 {result.optimizaciones_automaticas.hook_reescrito.por_que_funciona}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedOptimization === 'tono' && result.optimizaciones_automaticas.ajuste_tono && (
                                                <div className="space-y-2">
                                                    {Object.entries(result.optimizaciones_automaticas.ajuste_tono).map(([key, value]) => (
                                                        <div key={key} className="bg-black/40 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/30 transition-colors group">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] text-indigo-400 uppercase font-bold">
                                                                    {key === 'opcion_1' ? '🔥 Agresivo' : key === 'opcion_2' ? '💙 Empático' : '🧠 Técnico'}
                                                                </span>
                                                                <button onClick={() => copyToClipboard(value as string)}
                                                                    className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-2 py-1 rounded transition-all font-bold flex items-center gap-1">
                                                                    <Copy size={10}/> Copiar
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedOptimization === 'plataforma' && result.optimizaciones_automaticas.adaptacion_plataforma && (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs text-gray-400"><Sparkles size={12} className="text-yellow-500"/><span>{result.optimizaciones_automaticas.adaptacion_plataforma.cambio_1}</span></div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400"><Sparkles size={12} className="text-yellow-500"/><span>{result.optimizaciones_automaticas.adaptacion_plataforma.cambio_2}</span></div>
                                                    </div>
                                                    <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] text-green-400 uppercase font-bold">✨ Versión Optimizada:</span>
                                                            <button onClick={() => copyToClipboard(result!.optimizaciones_automaticas.adaptacion_plataforma.version_optimizada)}
                                                                className="text-[10px] bg-green-500/20 hover:bg-green-500/40 text-green-300 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                                                <Copy size={10}/> Copiar
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{result.optimizaciones_automaticas.adaptacion_plataforma.version_optimizada}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORTALEZAS Y DEBILIDADES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.fortalezas_clave && result.fortalezas_clave.length > 0 && (
                                    <div className="bg-[#0B0E14] border border-green-500/20 rounded-2xl p-5">
                                        <h4 className="text-green-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={14}/> Fortalezas Clave
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.fortalezas_clave.map((f, i) => (
                                                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0"/>{f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.debilidades_criticas && result.debilidades_criticas.length > 0 && (
                                    <div className="bg-[#0B0E14] border border-red-500/20 rounded-2xl p-5">
                                        <h4 className="text-red-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <AlertCircleIcon size={14}/> Puntos Críticos
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.debilidades_criticas.map((d, i) => (
                                                <li key={i} className="text-xs">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-red-400 font-bold">⚠️ {d.problema}</span>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${d.prioridad === 'CRÍTICA' ? 'bg-red-500/20 text-red-400' : d.prioridad === 'ALTA' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{d.prioridad}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-[10px] mb-1">Impacto: {d.impacto}</p>
                                                    <p className="text-gray-300 text-[10px]">💡 {d.solucion}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* DECISIÓN FINAL */}
                            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
                                <div className={`p-5 rounded-xl text-center border font-black text-base uppercase tracking-widest ${
                                    (result.decision_recomendada || "").includes("PUBLICAR") ? 'bg-green-900/20 border-green-500 text-green-400' :
                                    (result.decision_recomendada || "").includes("OPTIMIZAR") ? 'bg-yellow-900/20 border-yellow-500 text-yellow-400' :
                                    (result.decision_recomendada || "").includes("REHACER") ? 'bg-orange-900/20 border-orange-500 text-orange-400' :
                                    'bg-red-900/20 border-red-500 text-red-400'
                                }`}>
                                    DECISIÓN: {result.decision_recomendada || "REVISIÓN REQUERIDA"}
                                </div>
                                {result.razonamiento_decision && (
                                    <p className="text-sm text-gray-400 text-center italic px-4">{result.razonamiento_decision}</p>
                                )}
                                {result.siguiente_paso_sugerido && (
                                    <div className="bg-indigo-900/10 border border-indigo-500/20 p-5 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb size={16} className="text-indigo-400"/>
                                            <span className="text-xs text-indigo-400 uppercase font-bold">Siguiente Paso:</span>
                                        </div>
                                        <p className="text-sm text-white font-medium">{result.siguiente_paso_sugerido}</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full min-h-[700px] border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/10">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-full flex items-center justify-center mb-6 shadow-xl border border-pink-500/20">
                                <Activity size={40} className="text-pink-500/50" />
                            </div>
                            <h3 className="text-white font-black text-xl mb-3">Sistema en Espera</h3>
                            <p className="text-gray-600 text-sm max-w-[320px] leading-relaxed">
                                Configura los parámetros a la izquierda y pega tu contenido para iniciar el análisis más avanzado del mundo.
                            </p>
                            <div className="mt-6 flex gap-2 text-xs text-gray-700">
                                <span className="flex items-center gap-1"><Brain size={12}/> 10 Módulos</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Zap size={12}/> Simulación Cognitiva</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Target size={12}/> Predicción Matemática</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
            `}</style>
        </div>
    );
};

export default ViralCalculatorV500;