import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Microscope, RefreshCw, AlertTriangle, Wallet, Link as LinkIcon, 
    Layers, Clock, Camera, Activity, ArrowRight, Brain, Dna, 
    Database, Fingerprint, BarChart2, CheckCircle2, Sparkles,
    TrendingUp, Target, Zap, Film, Eye, Upload, Trash2, Info
} from 'lucide-react';

// ==================================================================================
// 🎯 SISTEMA DE COSTOS DINÁMICO (ACTUALIZADO SEGÚN PLAN ESTRATÉGICO)
// ==================================================================================

interface CostEstimate {
    basePrice: number;
    whisperEstimate: number;
    total: number;
    category: 'reel' | 'video_largo' | 'masterclass';
    categoryLabel: string;
}

function calculateCostFromDuration(durationSeconds: number): CostEstimate {
    let basePrice = 10;
    let category: 'reel' | 'video_largo' | 'masterclass' = 'reel';
    let categoryLabel = 'Reel/Short';
    
    // 🎯 SEGÚN PLAN ESTRATÉGICO:
    if (durationSeconds <= 90) {
        basePrice = 10;
        category = 'reel';
        categoryLabel = 'Reel/Short';
    } else if (durationSeconds <= 600) {
        basePrice = 30;
        category = 'video_largo';
        categoryLabel = 'Video Largo';
    } else {
        basePrice = 45;
        category = 'masterclass';
        categoryLabel = 'Masterclass/Conferencia';
    }
    
    // Estimación de Whisper (si aplica)
    const whisperMinutes = Math.ceil(durationSeconds / 60);
    const whisperCostDollars = whisperMinutes * 0.006;
    const whisperEstimate = Math.ceil(whisperCostDollars / 0.01);
    
    return {
        basePrice,
        whisperEstimate,
        total: basePrice + whisperEstimate,
        category,
        categoryLabel
    };
}

async function detectVideoDurationFromFile(fileBase64: string): Promise<number> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(Math.floor(video.duration));
        };
        
        video.onerror = () => {
            resolve(60); // Default: 60s si no se puede detectar
        };
        
        video.src = fileBase64;
    });
}

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const AnalyzeViral = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS PRINCIPALES ---
    const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
    const [url, setUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'dna' | 'timeline' | 'production'>('overview');
    const [progress, setProgress] = useState(0);
    
    // --- 🆕 SISTEMA DE COSTOS DINÁMICO ---
    const [costEstimate, setCostEstimate] = useState<CostEstimate>({
        basePrice: 10,
        whisperEstimate: 0,
        total: 10,
        category: 'reel',
        categoryLabel: 'Reel/Short (estimado)'
    });

    // --- CARGAR URL SI VIENE DE OTRA PÁGINA ---
    useEffect(() => {
        if (location.state?.contentToAnalyze) {
            setUrl(location.state.contentToAnalyze);
            setInputMode('url');
        }
    }, [location]);

    // --- SIMULAR PROGRESO DURANTE ANÁLISIS ---
    useEffect(() => {
        if (isAnalyzing) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 500);
            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [isAnalyzing]);

    // --- 🆕 DETECTAR DURACIÓN CUANDO SE SUBE ARCHIVO ---
    useEffect(() => {
        if (uploadedFile) {
            detectVideoDurationFromFile(uploadedFile)
                .then(duration => {
                    console.log(`[COST] Duración detectada: ${duration}s`);
                    const estimate = calculateCostFromDuration(duration);
                    setCostEstimate(estimate);
                })
                .catch(err => {
                    console.error('[COST] Error detectando duración:', err);
                });
        }
    }, [uploadedFile]);

    // --- MANEJADOR DE SUBIDA DE VIDEO ---
    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
        if (!validTypes.includes(file.type)) {
            setError('Tipo de archivo no soportado. Usa MP4, MOV, WEBM o AVI.');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            setError('El archivo es demasiado grande. Máximo 100MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedFile(reader.result as string);
            setUploadedFileName(file.name);
            setUrl('');
        };
        reader.readAsDataURL(file);
    };

    const handleClearUpload = () => {
        setUploadedFile(null);
        setUploadedFileName('');
        setCostEstimate({
            basePrice: 10,
            whisperEstimate: 0,
            total: 10,
            category: 'reel',
            categoryLabel: 'Reel/Short (estimado)'
        });
    };

    // --- EJECUTAR ANÁLISIS ---
    const handleAnalyze = async () => {
        // Validaciones
        if (inputMode === 'url' && !url.trim()) {
            return setError("⚠️ Ingresa una URL válida.");
        }
        if (inputMode === 'file' && !uploadedFile) {
            return setError("⚠️ Sube un video primero.");
        }
        if (!user || !userProfile) return;
        
        // 🆕 VALIDAR SALDO CON COSTO ESTIMADO REAL
        const estimatedCost = costEstimate.total;
        
        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < estimatedCost) {
            if(confirm(`💰 Saldo insuficiente. Costo estimado: ${estimatedCost} créditos. ¿Recargar?`)) {
                navigate('/dashboard/settings');
            }
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            // Detectar plataforma
            const platform = url.includes('youtu') ? 'youtube' 
                : url.includes('tiktok') ? 'tiktok' 
                : url.includes('instagram') ? 'instagram'
                : 'general';
            
            // Construir payload
            const payload: any = {
                selectedMode: 'autopsia_viral',
                estimatedCost: estimatedCost, // 🆕 COSTO REAL
                platform: platform
            };

            // Agregar URL o archivo
            if (inputMode === 'url') {
                payload.url = url;
            } else {
                payload.uploadedVideo = uploadedFile;
                payload.uploadedFileName = uploadedFileName;
            }

            console.log('[ANALYZE] Enviando al backend:', {
                mode: payload.selectedMode,
                hasUrl: !!payload.url,
                hasUpload: !!payload.uploadedVideo,
                platform: payload.platform,
                estimatedCost: payload.estimatedCost // 🆕 LOG
            });

            // Llamada al backend
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: payload
            });

            if (apiError) throw apiError;
            if (!data?.generatedData) {
                throw new Error("La IA no pudo extraer el ADN del video.");
            }

            console.log('[ANALYZE] Respuesta del backend:', data);

            // Completar progreso
            setProgress(100);
            
            // Guardar resultado
            setTimeout(() => {
                setResult(data.generatedData);
                setActiveTab('overview');
            }, 300);
            
            // Refrescar créditos
            if(refreshProfile) refreshProfile();

        } catch (e: any) {
            console.error('[ANALYZE] Error:', e);
            setError(e.message || "Error al extraer datos forenses.");
        } finally {
            setTimeout(() => {
                setIsAnalyzing(false);
            }, 500);
        }
    };

    // --- ENVIAR A CLONACIÓN ---
    const handleSendToClone = () => {
        if (!result) return;
        
        navigate('/dashboard/titan-viral', { 
            state: { 
                viralDNA: result, 
                originalUrl: url || `Archivo: ${uploadedFileName}`,
                platform: inputMode === 'url' 
                    ? (url.includes('youtu') ? 'YouTube' : url.includes('tiktok') ? 'TikTok' : 'Instagram')
                    : 'Upload'
            } 
        });
    };

    // --- RENDERIZADO DE TABS ---
    const renderContent = () => {
        if (!result) return null;

        // OVERVIEW - Vista general con métricas clave
        if (activeTab === 'overview') {
            const viralScore = result.score_viral?.potencial_total || 0;
            const scoreColor = viralScore >= 8 ? 'text-green-400' : viralScore >= 6 ? 'text-yellow-400' : 'text-orange-400';
            const scoreBg = viralScore >= 8 ? 'bg-green-500/10' : viralScore >= 6 ? 'bg-yellow-500/10' : 'bg-orange-500/10';

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Grid de Métricas Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Viral Score */}
                        <div className={`${scoreBg} border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                            <div className="absolute top-0 right-0 opacity-10">
                                <TrendingUp size={100} className={scoreColor}/>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={14} className={scoreColor}/>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        Potencial Viral
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-black ${scoreColor}`}>
                                        {viralScore.toFixed(1)}
                                    </span>
                                    <span className="text-xl text-gray-500 font-bold">/10</span>
                                </div>
                                <div className="mt-4 h-2 bg-gray-900 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${viralScore >= 8 ? 'bg-green-500' : viralScore >= 6 ? 'bg-yellow-500' : 'bg-orange-500'} transition-all duration-1000`}
                                        style={{ width: `${viralScore * 10}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trigger Psicológico */}
                        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 opacity-10">
                                <Brain size={100} className="text-purple-400"/>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain size={14} className="text-purple-400"/>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        Trigger Mental
                                    </span>
                                </div>
                                <p className="text-white font-bold text-lg leading-tight mt-3">
                                    {result.adn_extraido?.disparador_psicologico || 'Curiosidad'}
                                </p>
                            </div>
                        </div>

                        {/* Nivel de Replicabilidad */}
                        <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 opacity-10">
                                <Target size={100} className="text-cyan-400"/>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 size={14} className="text-cyan-400"/>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        Replicabilidad
                                    </span>
                                </div>
                                <p className="text-white font-bold text-lg leading-tight mt-3">
                                    {result.score_viral?.nivel_replicabilidad || 'Alta'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Idea Central */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Fingerprint size={18} className="text-cyan-400"/>
                                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                                    Idea Ganadora Detectada
                                </span>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">
                                "{result.adn_extraido?.idea_ganadora || "Estructura viral identificada"}"
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <Zap size={14} className="text-yellow-400"/>
                                    <span className="text-xs text-gray-400">Gancho:</span>
                                    <span className="text-sm font-bold text-white">
                                        {result.adn_extraido?.formula_gancho || 'N/A'}
                                    </span>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <Layers size={14} className="text-blue-400"/>
                                    <span className="text-xs text-gray-400">Estructura:</span>
                                    <span className="text-sm font-bold text-white">
                                        {result.adn_extraido?.estructura_exacta || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Factores de Éxito */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-sm font-black uppercase tracking-wide text-green-400 mb-4 flex items-center gap-2">
                                <CheckCircle2 size={16}/> Factores de Éxito
                            </h3>
                            <ul className="space-y-2">
                                {(result.score_viral?.factores_exito || ['Análisis exitoso']).map((factor: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <span className="text-green-400 shrink-0">•</span>
                                        <span className="text-gray-300">{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-sm font-black uppercase tracking-wide text-cyan-400 mb-4 flex items-center gap-2">
                                <Database size={16}/> Patrón Replicable
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">
                                        Nombre
                                    </span>
                                    <p className="text-sm font-bold text-white">
                                        {result.patron_replicable?.nombre_patron || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">
                                        Fórmula
                                    </span>
                                    <p className="text-xs font-mono text-cyan-300 bg-gray-950 p-2 rounded-lg border border-gray-800">
                                        {result.patron_replicable?.formula || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // DNA - ADN Estructural detallado
        if (activeTab === 'dna') {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Patrón Completo */}
                    <div className="bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                <Dna size={24} className="text-cyan-400"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">
                                    Fórmula Matemática Extraída
                                </h3>
                                <p className="text-sm text-cyan-300/60">
                                    Ecuación exacta para replicar este éxito
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-5">
                                <span className="text-[10px] font-black uppercase tracking-wide text-cyan-400 block mb-2">
                                    Nombre del Patrón
                                </span>
                                <p className="text-white font-bold text-lg">
                                    {result.patron_replicable?.nombre_patron || 'Patrón detectado'}
                                </p>
                            </div>
                            
                            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-5">
                                <span className="text-[10px] font-black uppercase tracking-wide text-cyan-400 block mb-2">
                                    Ecuación Base
                                </span>
                                <p className="text-cyan-200 font-mono text-sm leading-relaxed">
                                    {result.patron_replicable?.formula || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={14} className="text-cyan-400"/>
                                <span className="text-[10px] font-black uppercase tracking-wide text-cyan-400">
                                    Cómo Aplicar Este Patrón
                                </span>
                            </div>
                            <p className="text-sm text-cyan-100 leading-relaxed">
                                {result.patron_replicable?.aplicacion_generica || 'Aplica esta estructura a tu contenido'}
                            </p>
                        </div>
                    </div>

                    {/* Componentes del ADN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-black uppercase tracking-wide text-purple-400 mb-4 flex items-center gap-2">
                                <Brain size={16}/> Componente Psicológico
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Trigger Principal</span>
                                    <p className="text-white font-bold">
                                        {result.adn_extraido?.disparador_psicologico}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Estructura Narrativa</span>
                                    <p className="text-white font-bold">
                                        {result.adn_extraido?.estructura_exacta}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-black uppercase tracking-wide text-yellow-400 mb-4 flex items-center gap-2">
                                <Zap size={16}/> Gancho Viral
                            </h4>
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <p className="text-yellow-200 font-mono text-sm leading-relaxed">
                                    {result.adn_extraido?.formula_gancho}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // TIMELINE - Desglose segundo a segundo
        if (activeTab === 'timeline') {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Clock size={20} className="text-orange-400"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">
                                        Secuencia Temporal
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Desglose segundo a segundo
                                    </p>
                                </div>
                            </div>
                            <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs font-bold text-gray-400">
                                {result.desglose_temporal?.length || 0} Puntos Clave
                            </span>
                        </div>

                        <div className="space-y-6 relative">
                            {/* Línea temporal */}
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500 via-orange-600 to-transparent"></div>

                            {(result.desglose_temporal || []).map((step: any, i: number) => (
                                <div key={i} className="flex gap-6 relative group">
                                    {/* Marcador de tiempo */}
                                    <div className="relative z-10 w-16 shrink-0">
                                        <div className="bg-orange-500 text-black text-xs font-black px-3 py-2 rounded-xl text-center shadow-lg shadow-orange-500/20">
                                            {step.segundo}s
                                        </div>
                                        {/* Dot en la línea */}
                                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-3 h-3 rounded-full bg-orange-500 border-2 border-gray-900"></div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 pb-6">
                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-orange-500/30 transition-colors">
                                            <p className="text-white font-bold mb-3 leading-tight">
                                                {step.que_pasa}
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Brain size={12} className="text-blue-400"/>
                                                        <span className="text-[10px] font-black uppercase tracking-wide text-blue-400">
                                                            Por Qué Funciona
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-300">
                                                        {step.porque_funciona}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Target size={12} className="text-green-400"/>
                                                        <span className="text-[10px] font-black uppercase tracking-wide text-green-400">
                                                            Cómo Replicarlo
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-300">
                                                        {step.replicar_como}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // PRODUCTION - Datos técnicos de producción
        if (activeTab === 'production') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Producción Visual */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Camera size={20} className="text-purple-400"/>
                            </div>
                            <h3 className="text-lg font-black text-white">
                                Producción Visual
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                                        Ritmo de Cortes
                                    </span>
                                    <Film size={14} className="text-purple-400"/>
                                </div>
                                <p className="text-white font-bold">
                                    {result.produccion_deconstruida?.ritmo_cortes || 'N/A'}
                                </p>
                            </div>

                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                                        Movimiento de Cámara
                                    </span>
                                    <Eye size={14} className="text-purple-400"/>
                                </div>
                                <p className="text-white font-bold">
                                    {result.produccion_deconstruida?.movimiento_camara || 'N/A'}
                                </p>
                            </div>

                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <span className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
                                    Audio/Música
                                </span>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {result.produccion_deconstruida?.musica_sonido || 'N/A'}
                                </p>
                            </div>

                            {result.produccion_deconstruida?.visuales_clave && (
                                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                                    <span className="text-xs text-purple-400 uppercase tracking-wide block mb-2 font-bold">
                                        Elementos Visuales Clave
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.produccion_deconstruida.visuales_clave.map((visual: string, i: number) => (
                                            <span key={i} className="bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-800">
                                                {visual}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Señales Algorítmicas */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <BarChart2 size={20} className="text-yellow-400"/>
                            </div>
                            <h3 className="text-lg font-black text-white">
                                Señales Algorítmicas
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={14} className="text-yellow-400"/>
                                    <span className="text-xs font-black uppercase tracking-wide text-yellow-400">
                                        Retención
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {result.insights_algoritmicos?.optimizacion_retencion || 'N/A'}
                                </p>
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={14} className="text-blue-400"/>
                                    <span className="text-xs font-black uppercase tracking-wide text-blue-400">
                                        Engagement
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {result.insights_algoritmicos?.triggers_engagement || 'N/A'}
                                </p>
                            </div>

                            {result.insights_algoritmicos?.seo_keywords && (
                                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Database size={14} className="text-cyan-400"/>
                                        <span className="text-xs font-black uppercase tracking-wide text-cyan-400">
                                            Keywords SEO
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.insights_algoritmicos.seo_keywords.map((keyword: string, i: number) => (
                                            <span key={i} className="bg-gray-950 text-cyan-300 text-xs font-mono px-3 py-1 rounded-lg border border-gray-800">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                
                {/* HEADER MODERNO */}
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
                    
                    <div className="relative z-10 text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-[11px] font-black text-cyan-400 uppercase tracking-widest mb-4 backdrop-blur-sm">
                            <Microscope size={14} /> Forensic Analysis Engine V2.0
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                            AUTOPSIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">VIRAL</span>
                        </h1>
                        
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Deconstruye cualquier video viral hasta su ADN molecular. Extrae la fórmula matemática exacta detrás de su éxito.
                        </p>
                    </div>

                    {/* 🆕 Badge de costo DINÁMICO */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 px-5 py-3 rounded-xl">
                            <Wallet size={18} className="text-cyan-400"/>
                            <div className="text-left">
                                <span className="text-xs text-gray-500 block">Costo estimado:</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-black text-white text-xl">{costEstimate.total}</span>
                                    <span className="text-xs text-gray-400">créditos</span>
                                    <span className="text-[10px] text-gray-600">({costEstimate.categoryLabel})</span>
                                </div>
                            </div>
                            {costEstimate.whisperEstimate > 0 && (
                                <div className="ml-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-400 font-bold">
                                    +{costEstimate.whisperEstimate} Whisper
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* INPUT SECTION */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Tabs URL / File */}
                    <div className="flex gap-2 p-1 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
                        <button
                            onClick={() => setInputMode('url')}
                            className={`flex-1 py-3 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                inputMode === 'url'
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <LinkIcon size={16}/>
                            URL del Video
                        </button>
                        <button
                            onClick={() => setInputMode('file')}
                            className={`flex-1 py-3 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                inputMode === 'file'
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <Upload size={16}/>
                            Subir Archivo
                        </button>
                    </div>

                    {/* Input Container */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                        {inputMode === 'url' ? (
                            <div className="flex items-center gap-4 p-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={20}/>
                                    <input 
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://www.tiktok.com/@user/video/..."
                                        className="w-full bg-transparent border-none py-5 pl-14 pr-4 text-white focus:ring-0 placeholder:text-gray-600 text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                    />
                                </div>
                                <button 
                                    onClick={handleAnalyze} 
                                    disabled={!url.trim() || isAnalyzing}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-8 py-5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider shadow-lg shadow-cyan-900/20"
                                >
                                    {isAnalyzing ? <RefreshCw className="animate-spin" size={18}/> : <Microscope size={18}/>}
                                    {isAnalyzing ? 'EXTRAYENDO' : 'ANALIZAR'}
                                </button>
                            </div>
                        ) : (
                            <div className="p-6">
                                {!uploadedFile ? (
                                    <label className="block cursor-pointer group">
                                        <input 
                                            type="file" 
                                            accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                        />
                                        <div className="border-2 border-dashed border-gray-700 rounded-xl py-12 text-center hover:border-cyan-500/50 transition-colors group-hover:bg-gray-800/30">
                                            <Upload size={48} className="mx-auto text-gray-600 group-hover:text-cyan-500 transition-colors mb-4"/>
                                            <p className="text-sm text-gray-400 font-medium mb-1">
                                                Arrastra tu video o haz clic para seleccionar
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                MP4, MOV, WEBM, AVI (Max 100MB)
                                            </p>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-cyan-500/10 rounded-lg">
                                                    <Film size={24} className="text-cyan-500"/>
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold truncate max-w-[250px]">
                                                        {uploadedFileName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Listo para analizar</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleClearUpload}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} className="text-red-500"/>
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider shadow-lg shadow-cyan-900/20"
                                        >
                                            {isAnalyzing ? <RefreshCw className="animate-spin" size={18}/> : <Microscope size={18}/>}
                                            {isAnalyzing ? 'EXTRAYENDO ADN...' : 'ANALIZAR VIDEO'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 🆕 Info sobre costos */}
                    {(uploadedFile || url) && !isAnalyzing && !result && (
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                            <Info size={18} className="text-blue-400 shrink-0 mt-0.5"/>
                            <div className="text-sm text-blue-200">
                                <p className="font-bold mb-1">Sistema de Costos Inteligente</p>
                                <p className="text-xs text-blue-300/80">
                                    El costo se calcula según la duración del video:
                                    <span className="block mt-1">
                                        • <strong>Reels/Shorts</strong> (0-90s): 10 créditos
                                    </span>
                                    <span className="block">
                                        • <strong>Videos Largos</strong> (90s-10min): 30 créditos
                                    </span>
                                    <span className="block">
                                        • <strong>Masterclass</strong> (+10min): 45 créditos
                                    </span>
                                    <span className="block mt-1 text-yellow-400">
                                        + Costo adicional de Whisper según duración
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Barra de progreso */}
                    {isAnalyzing && (
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-400">Analizando estructura viral...</span>
                                <span className="text-sm font-black text-cyan-400">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertTriangle size={20} className="text-red-500 shrink-0"/>
                            <span className="text-red-300 text-sm font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* RESULTADOS */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        
                        {/* Tabs de navegación */}
                        <div className="flex justify-center">
                            <div className="inline-flex gap-2 p-2 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800">
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                        activeTab === 'overview' 
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                                            : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <Eye size={14}/> Overview
                                </button>
                                <button 
                                    onClick={() => setActiveTab('dna')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                        activeTab === 'dna' 
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                                            : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <Dna size={14}/> ADN
                                </button>
                                <button 
                                    onClick={() => setActiveTab('timeline')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                        activeTab === 'timeline' 
                                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                                            : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <Clock size={14}/> Timeline
                                </button>
                                <button 
                                    onClick={() => setActiveTab('production')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                        activeTab === 'production' 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                            : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <Camera size={14}/> Producción
                                </button>
                            </div>
                        </div>

                        {/* Contenido dinámico */}
                        <div className="min-h-[500px]">
                            {renderContent()}
                        </div>

                        {/* CTA Final - Más prominente */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
                            
                            <div className="relative z-10 text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">
                                    <Sparkles size={12}/> Siguiente Paso
                                </div>
                                
                                <button 
                                    onClick={handleSendToClone}
                                    className="group relative mx-auto px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-2xl text-base uppercase tracking-widest transition-all shadow-2xl shadow-cyan-900/30 hover:scale-105 flex items-center gap-4"
                                >
                                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                                        <Dna size={24}/>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-cyan-200 text-xs font-bold mb-1">CLONAR ESTRUCTURA</span>
                                        <span className="block">Adaptar a Mi Nicho</span>
                                    </div>
                                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform"/>
                                </button>

                                <p className="text-gray-500 text-sm">
                                    Usa este ADN para crear contenido viral adaptado a tu audiencia
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholder cuando no hay resultados */}
                {!result && !isAnalyzing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 mt-16">
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center hover:opacity-100 transition-opacity">
                            <Layers className="text-gray-600 mx-auto mb-4" size={40}/>
                            <h3 className="text-white font-bold mb-2">Estructura</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Detectamos el esqueleto matemático del guion
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center hover:opacity-100 transition-opacity">
                            <Brain className="text-gray-600 mx-auto mb-4" size={40}/>
                            <h3 className="text-white font-bold mb-2">Psicología</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Revelamos por qué el cerebro no pudo dejar de mirar
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center hover:opacity-100 transition-opacity">
                            <Camera className="text-gray-600 mx-auto mb-4" size={40}/>
                            <h3 className="text-white font-bold mb-2">Producción</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Extraemos el ritmo de edición y ángulos de cámara
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};