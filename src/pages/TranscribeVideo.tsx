import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Mic, Copy, RefreshCw, Wand2, 
    Activity, Youtube, Instagram, Linkedin, Video, 
    Facebook, Link as LinkIcon, Layers, Scissors, PenTool, Save, AlignLeft, Wallet, Upload,
    User, Users, BookOpen 
} from 'lucide-react';

// --- CONFIGURACIÓN ECONÓMICA ---
const BASE_COST = 5;

// PLATAFORMAS
const PLATFORMS = [
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-900/10' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-900/10' },
    { id: 'instagram', label: 'Reels', icon: Instagram, color: 'text-pink-500', border: 'border-pink-500/50', bg: 'bg-pink-900/10' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-900/10' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', border: 'border-blue-600/50', bg: 'bg-blue-900/10' },
];

// MODOS DE TRANSFORMACIÓN
const MODES = [
    { id: 'clean', label: 'Transcripción Pulida', icon: AlignLeft, desc: 'Limpia, corrige y formatea el texto.', promptAddon: 'OBJETIVO: Limpiar el texto, corregir gramática y darle formato legible.' },
    { id: 'authority', label: 'Post de Autoridad', icon: PenTool, desc: 'Artículo persuasivo estilo "Broetry".', promptAddon: 'OBJETIVO: Transformar en un artículo de LinkedIn/Blog con tono de alta autoridad.' },
    { id: 'shorts', label: 'Pack de 3 Shorts/Reels', icon: Scissors, desc: '3 Guiones virales de 60s.', promptAddon: 'OBJETIVO: Extraer 3 guiones cortos de 60 segundos con ganchos virales.' },
    { id: 'carousel', label: 'Estructura Carrusel', icon: Layers, desc: 'Texto paso a paso para slides.', promptAddon: 'OBJETIVO: Resumir en estructura de Carrusel (Slide 1, Slide 2, etc).' },
    { id: 'structure', label: 'Ingeniería Inversa', icon: Activity, desc: 'Análisis de estructura viral.', promptAddon: 'OBJETIVO: Analizar la estructura viral y los sesgos psicológicos usados.' }
];

export const TranscribeVideo: React.FC = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth(); 
    
    // --- ESTADOS DE UI ---
    const [url, setUrl] = useState('');
    const [transcript, setTranscript] = useState('');
    const [detectedPlatform, setDetectedPlatform] = useState<any>(null);
    const [selectedMode, setSelectedMode] = useState(MODES[0]); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    
    // Costos
    const [estimatedCost, setEstimatedCost] = useState(BASE_COST);
    const [finalCost, setFinalCost] = useState(0);

    // Subida
    const [isUploading, setIsUploading] = useState(false);

    // --- ESTADOS DE CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]); 
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>(''); 

    // --- CARGAR PERFILES ---
    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            try {
                // Expertos
                const { data: expData } = await supabase.from('expert_profiles').select('id, name, niche').eq('user_id', user.id);
                if (expData) setExperts(expData);
                
                // Avatares
                const { data: avData } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if (avData) setAvatars(avData);

                // Bases de Conocimiento (Fallback robusto)
                const { data: kbData, error } = await supabase.from('knowledge_bases').select('*').eq('user_id', user.id);
                
                if (kbData && kbData.length > 0) {
                    setKnowledgeBases(kbData.map((k: any) => ({
                        id: k.id,
                        title: k.title || k.name || k.filename || "Documento sin nombre"
                    })));
                } else {
                    const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user.id);
                    if (docs) {
                        setKnowledgeBases(docs.map((d: any) => ({
                            id: d.id,
                            title: d.title || d.name || d.filename || "Documento"
                        })));
                    }
                }

                // Defaults
                if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
                if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
            } catch (e) {
                console.error("Error loading profiles:", e);
            }
        };
        fetchProfiles();
    }, [user, userProfile]);

    // --- SUBIDA DE ARCHIVO ---
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert("⚠️ El archivo es demasiado grande. Máximo 50MB.");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
            if (!data.publicUrl) throw new Error("No se pudo generar el enlace del archivo.");

            setUrl(data.publicUrl);
            setDetectedPlatform({ label: 'Archivo Subido', icon: Video, color: 'text-green-500', border: 'border-green-500/50' });
            alert("✅ Archivo subido exitosamente.");
        } catch (e: any) {
            console.error("Upload error:", e);
            alert("Error al subir el archivo: " + e.message);
        } finally {
            setIsUploading(false);
        }
    };

    // --- EFECTOS Y HANDLERS ---
    useEffect(() => {
        if (url) setEstimatedCost(5); 
        else setEstimatedCost(BASE_COST);
    }, [url, transcript]); 

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUrl(val);
        if (val.includes('youtube') || val.includes('youtu.be')) setDetectedPlatform(PLATFORMS.find(p => p.id === 'youtube'));
        else if (val.includes('tiktok')) setDetectedPlatform(PLATFORMS.find(p => p.id === 'tiktok'));
        else if (val.includes('instagram')) setDetectedPlatform(PLATFORMS.find(p => p.id === 'instagram'));
        else if (val.includes('linkedin')) setDetectedPlatform(PLATFORMS.find(p => p.id === 'linkedin'));
        else if (val.includes('facebook')) setDetectedPlatform(PLATFORMS.find(p => p.id === 'facebook'));
        else if (val.includes('supabase')) setDetectedPlatform({ label: 'Archivo Subido', icon: Video, color: 'text-green-500', border: 'border-green-500/50' });
        else setDetectedPlatform(null);
    };

    // --- PROCESAMIENTO (IA) ---
    const handleProcess = async () => {
        if ((!url && !transcript) || !user || !userProfile) {
            alert("Por favor, ingresa una URL o pega el texto base.");
            return;
        }

        if (userProfile.tier !== 'admin' && userProfile.credits < estimatedCost) {
            if(confirm(`⚠️ Saldo insuficiente. Necesitas mínimo ${estimatedCost} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsProcessing(true);
        setResult(null);
        setFinalCost(0);
        
        try {
            const contextPrefix = `[MODO: ${selectedMode.label}]\n${selectedMode.promptAddon}\n\nCONTENIDO ORIGINAL:\n`;
            const finalInput = transcript ? (contextPrefix + transcript) : ""; 

            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: url,
                    text: finalInput,
                    transcript: finalInput, 
                    selectedMode: selectedMode.id, 
                    platform: detectedPlatform?.label || 'Video General',
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId
                },
            });

            if (error) {
                if (error.status === 402) {
                    alert(`🚫 SALDO INSUFICIENTE.`);
                    navigate('/settings');
                    return;
                }
                throw error;
            }

            const generatedData = data?.generatedData || data;

            if (typeof generatedData === 'string' && generatedData.includes("ERROR_")) {
                throw new Error(`Error Técnico del Servidor: ${generatedData}`);
            }
            if (JSON.stringify(generatedData).includes("ERROR_")) {
                const errMsg = generatedData.cleaned_text || generatedData.final_script || generatedData.result || "Error desconocido";
                alert(`⚠️ REPORTE TÉCNICO:\n${errMsg}`);
            }

            const mainContentFound = 
                generatedData?.cleaned_text || 
                generatedData?.cleanedText || 
                generatedData?.transcription ||
                generatedData?.article ||
                generatedData?.final_script ||
                generatedData?.finalScriptRemix ||
                generatedData?.result ||
                generatedData?.content ||
                generatedData?.carousel_content ||
                generatedData?.structure_breakdown ||
                (typeof generatedData === 'string' ? generatedData : null);

            const finalDisplayContent = mainContentFound || (typeof generatedData === 'object' ? JSON.stringify(generatedData, null, 2) : "Contenido no legible.");

            if (!finalDisplayContent || finalDisplayContent === "{}") {
                throw new Error("La IA no devolvió contenido legible.");
            }

            const adaptedResult = {
                title: generatedData?.title || generatedData?.seo_title || `${selectedMode.label} Generado`,
                viralHook: generatedData?.hook || generatedData?.viralHook || "Contenido Optimizado",
                mainContent: finalDisplayContent,
                actionableTip: "Copia este contenido y ajústalo a tu tono de voz."
            };

            setFinalCost(data.finalCost || estimatedCost);
            setResult(adaptedResult);
            
            if(refreshProfile) refreshProfile(); 

        } catch (e: any) {
            console.error("Error al procesar:", e);
            if (e.message && e.message.includes("Unexpected token")) {
                alert("⚠️ Error de conexión o tiempo de espera. \n\nSOLUCIÓN: Usa el botón de 'Sube el archivo MP4' si el video es muy largo.");
            } else {
                alert("Error: " + e.message);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // --- GUARDADO ---
    const handleSave = async () => {
        if (!result) return;
        setSaving(true);
        try {
            const contentToSave = typeof result === 'object' ? JSON.stringify(result) : result;
            const { error } = await supabase.from('transcriptions').insert({
                user_id: user?.id,
                video_url: url || 'Texto Manual',
                platform: detectedPlatform?.label || 'General',
                video_title: result.title,
                detected_hook: result.viralHook, 
                transcript_content: contentToSave, 
                cost_credits: finalCost 
            });

            if (error) throw error;
            alert("✅ Contenido guardado en el Baúl");
        } catch (e: any) { 
            console.error(e); 
            alert("Error al guardar: " + e.message); 
        } finally { 
            setSaving(false); 
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20 p-4">
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Mic className="text-purple-500" /> Transcriptor & Reciclador Viral
                </h1>
                <p className="text-gray-400">Transforma, limpia o recicla el contenido de cualquier video.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* CONTROLES */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
                        
                        {/* 1. URL */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">1. Link del Video (Opcional)</label>
                                <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/30">Referencia</span>
                            </div>
                            <div className={`flex items-center gap-3 bg-[#0B0E14] border ${detectedPlatform ? detectedPlatform.border : 'border-gray-700'} rounded-xl p-3 transition-all`}>
                                {detectedPlatform ? <detectedPlatform.icon className={detectedPlatform.color} size={20}/> : <LinkIcon className="text-gray-500" size={20}/>}
                                <input 
                                    type="text" 
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://youtube.com/..." 
                                    className="bg-transparent border-none focus:outline-none text-white text-sm w-full"
                                />
                            </div>
                            {/* Bypass Upload */}
                            <div className="mt-4 p-3 border border-dashed border-gray-700 hover:border-purple-500 rounded-xl bg-gray-900/30 text-center transition-all group">
                                <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center py-2">
                                    <div className="p-2 bg-gray-800 rounded-full group-hover:bg-purple-600 transition-colors shadow-lg">
                                        {isUploading ? <RefreshCw className="animate-spin text-white" size={16}/> : <Upload size={16} className="text-white"/>}
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-gray-300 block group-hover:text-white">
                                            {isUploading ? "Subiendo a la nube..." : "¿Video Privado? Sube el archivo MP4"}
                                        </span>
                                        <input type="file" accept="video/mp4,audio/*" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* 2. TEXTO */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">2. Transcripción / Texto Base</label>
                            </div>
                            <textarea 
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Pega aquí el texto completo para reciclar..."
                                className="w-full h-40 bg-[#0B0E14] border border-gray-700 rounded-xl p-4 text-white focus:outline-none resize-none font-mono text-sm focus:border-purple-500 transition-colors custom-scrollbar"
                            />
                            <div className="flex justify-between mt-2 items-center">
                                <span className="text-xs text-gray-500">{transcript.length} caracteres</span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${estimatedCost > 5 ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' : 'bg-green-900/20 border-green-500/30 text-green-400'}`}>
                                    <Wallet size={14}/>
                                    <span className="text-xs font-bold">{url ? 'Costo Variable' : `Costo Fijo: ${estimatedCost} Cr`}</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. MODO */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-gray-500 uppercase block">3. ¿Qué quieres hacer?</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {MODES.map(m => (
                                    <button 
                                        key={m.id} 
                                        onClick={() => setSelectedMode(m)}
                                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${selectedMode.id === m.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-[#0B0E14] border-gray-800 text-gray-500 hover:border-gray-600'}`}
                                    >
                                        <div className={`mt-1 ${selectedMode.id === m.id ? 'text-purple-400' : 'text-gray-600'}`}><m.icon size={18}/></div>
                                        <div><div className="text-sm font-bold">{m.label}</div><div className="text-[10px] opacity-70">{m.desc}</div></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. CONTEXTO V30 (NICHE GUARD) */}
                        <div className="pt-4 border-t border-gray-800">
                             <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-gray-500 uppercase block">4. Contexto (Niche Guard)</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                
                                {/* EXPERTO */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={14} /></div>
                                    <select 
                                        value={selectedExpertId} 
                                        onChange={(e) => setSelectedExpertId(e.target.value)}
                                        className="w-full bg-[#0B0E14] border border-gray-700 text-white text-sm rounded-xl p-3 pl-9 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="">-- Experto (Voz) --</option>
                                        {experts.map(e => <option key={e.id} value={e.id}>{e.name} ({e.niche})</option>)}
                                    </select>
                                </div>

                                {/* AVATAR */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={14} /></div>
                                    <select 
                                        value={selectedAvatarId} 
                                        onChange={(e) => setSelectedAvatarId(e.target.value)}
                                        className="w-full bg-[#0B0E14] border border-gray-700 text-white text-sm rounded-xl p-3 pl-9 focus:border-pink-500 focus:outline-none"
                                    >
                                        <option value="">-- Avatar (Audiencia) --</option>
                                        {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>

                                {/* BASE DE CONOCIMIENTO */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={14} /></div>
                                    <select 
                                        value={selectedKbId} 
                                        onChange={(e) => setSelectedKbId(e.target.value)}
                                        className="w-full bg-[#0B0E14] border border-gray-700 text-white text-sm rounded-xl p-3 pl-9 focus:border-yellow-500 focus:outline-none"
                                    >
                                        <option value="">-- Conocimiento (IA) --</option>
                                        {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                    </select>
                                </div>

                            </div>
                        </div>

                        <button 
                            onClick={handleProcess} 
                            disabled={(!url && !transcript) || isProcessing} 
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20 transition-all transform active:scale-[0.99]"
                        >
                            {isProcessing ? <RefreshCw className="animate-spin"/> : <Wand2/>} {isProcessing ? 'Procesando...' : 'Generar Transformación'}
                        </button>
                    </div>
                </div>

                {/* RESULTADOS */}
                <div className="lg:col-span-5">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 sticky top-6">
                            <div className="mb-6 border-b border-gray-800 pb-4 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Resultado IA</span>
                                        <h2 className="text-xl font-bold text-white mt-1 leading-tight">{result.title}</h2>
                                    </div>
                                    {finalCost > 0 && (<span className="text-[10px] text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded bg-yellow-900/10 whitespace-nowrap flex items-center gap-1"><Wallet size={10}/> -{finalCost} C</span>)}
                                </div>
                                <button onClick={handleSave} disabled={saving} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-900/20">
                                    {saving ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>} Guardar en Baúl
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                                    <span className="text-xs font-bold text-purple-400 uppercase block mb-1 flex items-center gap-2"><Activity size={12}/> Gancho / Idea Central</span>
                                    <p className="text-white font-bold italic text-sm">"{result.viralHook}"</p>
                                </div>
                                <div className="bg-[#1A1D24] p-5 rounded-xl text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar border border-gray-800 font-medium">
                                    {result.mainContent}
                                </div>
                                <div className="bg-indigo-900/10 p-3 rounded-lg border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-2"><Wand2 size={12}/> Nota: {result.actionableTip}</div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => { navigator.clipboard.writeText(result.mainContent); alert("Copiado!"); }} className="flex-1 py-3 bg-gray-800 rounded-xl hover:text-white text-gray-400 text-sm font-bold flex justify-center items-center gap-2 transition-all hover:bg-gray-700"><Copy size={16}/> Copiar</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-600 min-h-[400px]">
                            <Mic size={48} className="mb-4 opacity-20"/>
                            <p className="text-sm">Pega la transcripción<br/>para generar activos virales.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};