import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
    Microscope, RefreshCw, AlertTriangle, Wallet, Link as LinkIcon, 
    Layers, Clock, Camera, Activity, ArrowRight, 
    Brain, Dna, Database, Fingerprint, BarChart2, CheckCircle2
} from 'lucide-react';

const ANALYSIS_COST = 5;

export const AnalyzeViral = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS ---
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'adn' | 'timeline' | 'tech'>('adn');

    // --- CARGAR URL SI VIENE DE OTRA PAGINA ---
    useEffect(() => {
        if (location.state?.contentToAnalyze) setUrl(location.state.contentToAnalyze);
    }, [location]);

    // --- EJECUTAR ANÁLISIS PROFUNDO (BACKEND V105) ---
    const handleAnalyze = async () => {
        if (!url.trim()) return setError("⚠️ Ingresa una URL válida.");
        if (!user || !userProfile) return;
        
        // 1. Validar Saldo
        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < ANALYSIS_COST) {
            if(confirm(`💰 Saldo insuficiente. Costo: ${ANALYSIS_COST} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            // Detectar plataforma para ayudar al scraper
            const platform = url.includes('youtu') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';
            
            // 2. Llamada al Backend (Modo 'autopsia_viral')
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'autopsia_viral',
                    userInput: url, // La URL es el input principal
                    platform: platform,
                    estimatedCost: ANALYSIS_COST
                }
            });

            if (apiError) throw apiError;
            if (!data?.generatedData) throw new Error("La IA no pudo extraer el ADN del video.");

            // Guardamos el resultado completo
            setResult(data.generatedData);
            
            // Actualizamos créditos en la UI
            if(refreshProfile) refreshProfile();

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Error al extraer datos forenses.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- 🚀 EL PUENTE HACIA INGENIERÍA INVERSA ---
    const handleSendToReverseEngineering = () => {
        if (!result) return;
        
        // Navegamos llevando el PAQUETE COMPLETO DE DATOS (El ADN)
        // Esto pre-llenará la siguiente pantalla automáticamente.
        navigate('/tools/reverse-engineering', { 
            state: { 
                viralDNA: result, 
                originalUrl: url,
                platform: url.includes('youtu') ? 'YouTube' : url.includes('tiktok') ? 'TikTok' : 'Instagram'
            } 
        });
    };

    // --- RENDERIZADO VISUAL ---
    const renderContent = () => {
        if (!result) return null;

        // TAB 1: ADN ESTRUCTURAL (La información más valiosa)
        if (activeTab === 'adn') {
            return (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Tarjeta Principal */}
                        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-6 rounded-3xl flex-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Fingerprint size={100} className="text-cyan-400"/></div>
                            
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                <CheckCircle2 size={12}/> Idea Central Detectada
                            </span>
                            
                            <h2 className="text-xl font-black text-white leading-tight mb-4">
                                "{result.adn_extraido?.idea_ganadora || "Estructura Viral Detectada"}"
                            </h2>
                            
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-black/40 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-2">
                                    🧠 Psicología: <span className="text-white">{result.adn_extraido?.disparador_psicologico}</span>
                                </span>
                                <span className="bg-black/40 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-2">
                                    🪝 Gancho: <span className="text-white">{result.adn_extraido?.formula_gancho}</span>
                                </span>
                            </div>
                        </div>

                        {/* Viral Score */}
                        <div className="bg-[#0B0E14] border border-gray-800 p-6 rounded-3xl w-full md:w-48 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Potencial Viral</span>
                            <div className="relative z-10">
                                <span className="text-5xl font-black text-green-400 tracking-tighter">{result.score_viral?.potencial_total || 9.2}</span>
                                <span className="text-sm text-gray-600 font-bold">/10</span>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1.5 bg-gray-800 w-full">
                                <div className="h-full bg-green-500" style={{ width: `${(result.score_viral?.potencial_total || 0) * 10}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* El Patrón Replicable */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                            <Database size={20} className="text-cyan-500"/> Fórmula Matemática Extraída
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nombre del Patrón</span>
                                <p className="text-white font-bold">{result.patron_replicable?.nombre_patron}</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ecuación Exacta</span>
                                <p className="text-cyan-300 font-mono text-xs leading-relaxed">{result.patron_replicable?.formula}</p>
                            </div>
                        </div>
                        <div className="mt-4 bg-cyan-900/10 p-3 rounded-lg border border-cyan-500/20">
                            <p className="text-xs text-cyan-200">
                                <span className="font-bold">Cómo aplicar:</span> {result.patron_replicable?.aplicacion_generica}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        // TAB 2: TIMELINE (Desglose segundo a segundo)
        if (activeTab === 'timeline') {
            return (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <Clock size={16} className="text-orange-500"/> Secuencia Temporal
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{result.desglose_temporal?.length || 0} Puntos Clave</span>
                        </div>
                        
                        <div className="space-y-0 relative">
                            {/* Línea de tiempo vertical */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-800"></div>
                            
                            {(result.desglose_temporal || []).map((step: any, i: number) => (
                                <div key={i} className="flex gap-4 relative group mb-6 last:mb-0">
                                    <div className="z-10 w-14 shrink-0 flex flex-col items-center">
                                        <div className="bg-[#0B0E14] border border-gray-700 text-orange-400 text-[10px] font-black px-2 py-1.5 rounded-xl w-full text-center shadow-lg">
                                            {step.segundo}s
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-900/30 border border-gray-800 p-4 rounded-xl hover:bg-gray-900 hover:border-gray-700 transition-all">
                                            <p className="text-sm font-bold text-white mb-2">{step.que_pasa}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                                                    <Brain size={10}/> {step.porque_funciona}
                                                </span>
                                                <span className="text-[10px] bg-green-500/10 text-green-300 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                                    <Layers size={10}/> {step.replicar_como}
                                                </span>
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

        // TAB 3: DATOS TÉCNICOS
        if (activeTab === 'tech') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6">
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Camera size={16} className="text-purple-500"/> Producción</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                                <span className="text-xs text-gray-500">Ritmo de Cortes</span>
                                <span className="text-xs font-bold text-white">{result.produccion_deconstruida?.ritmo_cortes}</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                                <span className="text-xs text-gray-500">Movimiento</span>
                                <span className="text-xs font-bold text-white text-right max-w-[150px] truncate">{result.produccion_deconstruida?.movimiento_camara}</span>
                            </li>
                            <li>
                                <span className="text-xs text-gray-500 block mb-2">Audio Sugerido</span>
                                <p className="text-xs font-medium text-white bg-gray-900 p-2 rounded-lg">{result.produccion_deconstruida?.musica_sonido}</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6">
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-yellow-500"/> Señales Algorítmicas</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                                <span className="text-[10px] text-yellow-500 font-bold block">Retención</span>
                                <p className="text-xs text-gray-300">{result.insights_algoritmicos?.optimizacion_retencion}</p>
                            </div>
                            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                <span className="text-[10px] text-blue-400 font-bold block">Engagement</span>
                                <p className="text-xs text-gray-300">{result.insights_algoritmicos?.triggers_engagement}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 font-sans text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-800 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Microscope size={12} /> Titan Deep Scan
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
                        AUTOPSIA VIRAL <span className="text-gray-600 text-lg font-normal">| Extracción de ADN</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 max-w-lg">
                        Deconstruye cualquier video para extraer su fórmula exacta y replicarla en tu nicho.
                    </p>
                </div>
                
                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <Wallet size={16} className="text-cyan-500"/>
                    <span className="text-xs font-bold text-gray-400">Costo: <span className="text-white">{ANALYSIS_COST} créditos</span></span>
                </div>
            </div>

            {/* INPUT SECTION */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-2 shadow-xl flex flex-col md:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500"><LinkIcon size={20}/></div>
                    <input 
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Pega aquí el enlace del video viral (TikTok, Reels, YouTube)..."
                        className="w-full bg-transparent border-none py-6 pl-14 pr-4 text-white focus:ring-0 placeholder:text-gray-600 font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                </div>
                <button 
                    onClick={handleAnalyze} 
                    disabled={!url.trim() || isAnalyzing}
                    className="w-full md:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed m-2"
                >
                    {isAnalyzing ? <RefreshCw className="animate-spin" size={20}/> : <Microscope size={20}/>}
                    {isAnalyzing ? 'ESCANEANDO...' : 'EXTRAER ADN'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* RESULTADOS */}
            {result ? (
                <div className="space-y-8 animate-in slide-in-from-bottom-8">
                    
                    {/* Navegación de Pestañas */}
                    <div className="flex justify-center">
                        <div className="flex p-1 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm">
                            <button onClick={() => setActiveTab('adn')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'adn' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                <Dna size={14}/> ADN Viral
                            </button>
                            <button onClick={() => setActiveTab('timeline')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'timeline' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                <Clock size={14}/> Timeline
                            </button>
                            <button onClick={() => setActiveTab('tech')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'tech' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                <Activity size={14}/> Tech
                            </button>
                        </div>
                    </div>

                    {/* Contenido Dinámico */}
                    <div className="min-h-[400px]">
                        {renderContent()}
                    </div>

                    {/* 🚀 BOTÓN DE ACCIÓN FINAL */}
                    <div className="flex justify-center pt-8 border-t border-gray-800">
                        <button 
                            onClick={handleSendToReverseEngineering}
                            className="group relative px-10 py-6 bg-white text-black font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center gap-3"
                        >
                            <div className="p-2 bg-black rounded-full text-white group-hover:scale-110 transition-transform">
                                <Dna size={20}/>
                            </div>
                            <div className="text-left">
                                <span className="block text-[10px] text-gray-500 font-bold mb-0.5">PASO SIGUIENTE</span>
                                <span className="block text-base">CLONAR ESTRUCTURA EN MI NICHO</span>
                            </div>
                            <ArrowRight size={24} className="ml-2 group-hover:translate-x-2 transition-transform text-purple-600"/>
                        </button>
                    </div>

                </div>
            ) : (
                /* ESTADO VACÍO (Placeholder Educativo) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 mt-12">
                    <div className="bg-[#0B0E14] border border-gray-800 p-6 rounded-3xl text-center">
                        <Layers className="text-gray-600 mx-auto mb-4" size={32}/>
                        <h3 className="text-gray-300 font-bold mb-2">Estructura</h3>
                        <p className="text-xs text-gray-500">Detectamos el esqueleto exacto del guion.</p>
                    </div>
                    <div className="bg-[#0B0E14] border border-gray-800 p-6 rounded-3xl text-center">
                        <Brain className="text-gray-600 mx-auto mb-4" size={32}/>
                        <h3 className="text-gray-300 font-bold mb-2">Psicología</h3>
                        <p className="text-xs text-gray-500">Revelamos por qué el cerebro no pudo dejar de mirar.</p>
                    </div>
                    <div className="bg-[#0B0E14] border border-gray-800 p-6 rounded-3xl text-center">
                        <Camera className="text-gray-600 mx-auto mb-4" size={32}/>
                        <h3 className="text-gray-300 font-bold mb-2">Producción</h3>
                        <p className="text-xs text-gray-500">Extraemos el ritmo de edición y ángulos.</p>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};