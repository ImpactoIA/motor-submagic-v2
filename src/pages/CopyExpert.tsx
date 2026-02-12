import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Wand2, Copy, RefreshCw, AlertTriangle, CheckCircle2,
    User, Users, BookOpen, Upload, Link as LinkIcon, 
    FileText, Video, Image as ImageIcon, List, MessageSquare,
    Wallet, ArrowLeft, Sparkles, Target, TrendingUp, Award,
    Youtube, Instagram, Linkedin, Facebook, Twitter, Info,
    ChevronDown, Eye, ThumbsUp, Share2, Zap
} from 'lucide-react';

// ==================================================================================
// 🎨 CONFIGURACIÓN Y CONSTANTES
// ==================================================================================

const COPY_COST = 3;

const REDES_SOCIALES = [
    { id: 'TikTok', label: 'TikTok', icon: '🎵', color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-900/10' },
    { id: 'Instagram', label: 'Instagram', icon: '📸', color: 'text-pink-500', border: 'border-pink-500/50', bg: 'bg-pink-900/10' },
    { id: 'Facebook', label: 'Facebook', icon: '👥', color: 'text-blue-600', border: 'border-blue-600/50', bg: 'bg-blue-900/10' },
    { id: 'YouTube', label: 'YouTube', icon: '▶️', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-900/10' },
    { id: 'LinkedIn', label: 'LinkedIn', icon: '💼', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-900/10' },
    { id: 'X', label: 'X (Twitter)', icon: '🐦', color: 'text-gray-400', border: 'border-gray-500/50', bg: 'bg-gray-900/10' }
];

const FORMATOS = [
    { id: 'Video', label: 'Video', icon: Video, desc: 'Caption que complementa el video sin repetirlo' },
    { id: 'Post', label: 'Post', icon: FileText, desc: 'El texto ES el contenido principal' },
    { id: 'Carrusel', label: 'Carrusel', icon: ImageIcon, desc: 'Introduce sin spoilear los slides' },
    { id: 'Hilo', label: 'Hilo/Thread', icon: List, desc: 'Progresión lógica con micro-loops' }
];

const OBJETIVOS = [
    { id: 'Educar / Valor', label: 'Educar / Valor', icon: Award, desc: 'Posicionar como quien resuelve' },
    { id: 'Inspirar / Motivar', label: 'Inspirar / Motivar', icon: TrendingUp, desc: 'Mostrar transformación posible' },
    { id: 'Persuadir / Vender', label: 'Persuadir / Vender', icon: Target, desc: 'Activar dolor o deseo' },
    { id: 'Entretener / Viralidad', label: 'Entretener / Viralidad', icon: Sparkles, desc: 'Romper creencias, generar debate' },
    { id: 'Romper Objeciones', label: 'Romper Objeciones', icon: MessageSquare, desc: 'Anticipar y desactivar dudas' }
];

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const CopyExpert: React.FC = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();

    // --- Estados de Input ---
    const [contenidoOriginal, setContenidoOriginal] = useState('');
    const [url, setUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    // --- Estados de Configuración ---
    const [selectedRed, setSelectedRed] = useState('TikTok');
    const [selectedFormato, setSelectedFormato] = useState('Video');
    const [selectedObjetivo, setSelectedObjetivo] = useState('Educar / Valor');

    // --- Estados de Contexto ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- Estados de Proceso ---
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    // --- UI States ---
    const [showVariantes, setShowVariantes] = useState(false);
    const [selectedVariante, setSelectedVariante] = useState(0);

    // ==================================================================================
    // 🔄 EFECTOS
    // ==================================================================================

    useEffect(() => {
        if (user) fetchContextData();
    }, [user]);

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase
                .from('expert_profiles')
                .select('id, name, niche')
                .eq('user_id', user?.id);
            if (exp) setExperts(exp.map(e => ({ id: e.id, name: e.name || e.niche || "Experto" })));

            const { data: av } = await supabase
                .from('avatars')
                .select('id, name')
                .eq('user_id', user?.id);
            if (av) setAvatars(av);

            const { data: kb } = await supabase
                .from('documents')
                .select('id, title, filename')
                .eq('user_id', user?.id);
            if (kb) {
                setKnowledgeBases(kb.map((k: any) => ({ 
                    id: k.id, 
                    title: k.title || k.filename || "Documento" 
                })));
            }

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) {
            console.error('[CopyExpert] Error cargando contexto:', e);
        }
    };

    // ==================================================================================
    // 📁 SUBIDA DE ARCHIVO
    // ==================================================================================

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
            
            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, file);
            
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
            if (!data.publicUrl) throw new Error("No se pudo generar el enlace del archivo.");

            setUrl(data.publicUrl);
            setUploadedFileName(file.name);
            alert("✅ Archivo subido exitosamente. Se transcribirá y optimizará el copy.");
        } catch (e: any) {
            console.error("Upload error:", e);
            alert("Error al subir el archivo: " + e.message);
        } finally {
            setIsUploading(false);
        }
    };

    // ==================================================================================
    // 🚀 PROCESAMIENTO PRINCIPAL
    // ==================================================================================

    const handleGenerate = async () => {
        if (!contenidoOriginal.trim() && !url) {
            setError("⚠️ Ingresa el contenido, URL o sube un archivo.");
            return;
        }

        if (!user || !userProfile) return;

        // Verificar créditos
        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < COPY_COST) {
            if (confirm(`💰 Saldo insuficiente. Costo: ${COPY_COST} créditos. ¿Recargar?`)) {
                navigate('/dashboard/settings');
            }
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'copy_expert',
                    text: contenidoOriginal.trim(),
                    url: url || null,
                    uploadedVideo: uploadedFile,
                    uploadedFileName: uploadedFileName,
                    expertId: selectedExpertId || undefined,
                    avatarId: selectedAvatarId || undefined,
                    knowledgeBaseId: selectedKbId || undefined,
                    settings: {
                        red_social: selectedRed,
                        formato: selectedFormato,
                        objetivo: selectedObjetivo
                    },
                    estimatedCost: COPY_COST
                }
            });

            if (apiError) throw new Error(apiError.message || 'Error al conectar con el backend');
            if (!data?.success && !data?.generatedData) {
                throw new Error(data?.error || 'El backend devolvió un error desconocido');
            }

            const finalResult = data.generatedData || data;
            setResult(finalResult);

            // Refrescar créditos
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error('[CopyExpert] Error:', e);
            setError(e.message || "Error inesperado al generar el copy.");
        } finally {
            setIsProcessing(false);
        }
    };

    // ==================================================================================
    // 🎨 FUNCIONES DE UI
    // ==================================================================================

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("✅ Copiado al portapapeles"))
            .catch(() => alert("❌ Error al copiar"));
    };

    // ==================================================================================
    // 🎨 RENDERIZADO
    // ==================================================================================

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* ==================== HEADER ==================== */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-gray-800 rounded-full transition-all text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={24}/>
                </button>
                
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Wand2 size={12} /> Copy Expert V400
                    </div>
                    <h1 className="text-3xl font-black flex items-center justify-center gap-3">
                        <Sparkles size={32} className="text-purple-500" /> 
                        COPY MULTIPLATAFORMA
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Traductor Cognitivo | Adaptación Estratégica por Plataforma
                    </p>
                </div>

                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <Wallet size={16} className="text-yellow-500"/>
                    <span className="text-xs font-bold text-gray-400">Créditos:</span>
                    <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ==================== PANEL IZQUIERDO: CONFIGURACIÓN ==================== */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 1️⃣ RED SOCIAL */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            1. Red Social Destino
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {REDES_SOCIALES.map((red) => (
                                <button
                                    key={red.id}
                                    onClick={() => setSelectedRed(red.id)}
                                    className={`p-3 rounded-xl border text-center transition-all ${
                                        selectedRed === red.id
                                            ? `${red.bg} ${red.border} ${red.color}`
                                            : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{red.icon}</div>
                                    <span className="text-[10px] font-bold">{red.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2️⃣ FORMATO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            2. Formato del Contenido
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {FORMATOS.map((formato) => (
                                <button
                                    key={formato.id}
                                    onClick={() => setSelectedFormato(formato.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        selectedFormato === formato.id
                                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                            : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <formato.icon size={16} />
                                        <span className="text-sm font-bold">{formato.label}</span>
                                    </div>
                                    <p className="text-[9px] opacity-70">{formato.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3️⃣ OBJETIVO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            3. Objetivo Estratégico
                        </label>
                        <select
                            value={selectedObjetivo}
                            onChange={(e) => setSelectedObjetivo(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl p-3 focus:border-purple-500 outline-none appearance-none"
                        >
                            {OBJETIVOS.map((obj) => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.label} - {obj.desc}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4️⃣ CONTEXTO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                            <Info size={14} /> 4. Contexto (Opcional)
                        </label>
                        
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                                <User size={14}/>
                            </div>
                            <select 
                                value={selectedExpertId} 
                                onChange={(e) => setSelectedExpertId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-2.5 pl-9 outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="">-- Experto (Voz) --</option>
                                {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                                <Users size={14}/>
                            </div>
                            <select 
                                value={selectedAvatarId} 
                                onChange={(e) => setSelectedAvatarId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-2.5 pl-9 outline-none focus:border-pink-500 appearance-none"
                            >
                                <option value="">-- Avatar (Audiencia) --</option>
                                {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
                                <BookOpen size={14}/>
                            </div>
                            <select 
                                value={selectedKbId} 
                                onChange={(e) => setSelectedKbId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-2.5 pl-9 outline-none focus:border-yellow-500 appearance-none"
                            >
                                <option value="">-- Base de Conocimiento --</option>
                                {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 5️⃣ CONTENIDO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col" style={{ minHeight: '350px' }}>
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            5. Contenido Original
                        </label>
                        
                        {/* Opción de URL */}
                        <div className="mb-3">
                            <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl p-3">
                                <LinkIcon className="text-gray-500" size={18}/>
                                <input 
                                    type="text" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="URL del video (opcional)" 
                                    className="bg-transparent border-none focus:outline-none text-white text-sm w-full"
                                />
                            </div>
                        </div>

                        {/* Opción de Upload */}
                        <div className="mb-3 p-3 border border-dashed border-gray-700 hover:border-purple-500 rounded-xl bg-gray-900/30 text-center transition-all group">
                            <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center py-2">
                                <div className="p-2 bg-gray-800 rounded-full group-hover:bg-purple-600 transition-colors">
                                    {isUploading ? <RefreshCw className="animate-spin text-white" size={16}/> : <Upload size={16} className="text-white"/>}
                                </div>
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white">
                                    {isUploading ? "Subiendo..." : "Subir video para transcribir"}
                                </span>
                                <input 
                                    type="file" 
                                    accept="video/mp4,audio/*" 
                                    className="hidden" 
                                    onChange={handleFileUpload} 
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {/* Textarea de contenido */}
                        <textarea 
                            value={contenidoOriginal}
                            onChange={(e) => setContenidoOriginal(e.target.value)}
                            placeholder="O pega aquí tu guion, idea, caption o cualquier texto..."
                            className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none font-medium placeholder:text-gray-700 leading-relaxed"
                        />
                        
                        <div className="flex justify-between mt-2 items-center">
                            <span className="text-xs text-gray-500">{contenidoOriginal.length} caracteres</span>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-yellow-900/20 border-yellow-500/30 text-yellow-400">
                                <Wallet size={14}/>
                                <span className="text-xs font-bold">{COPY_COST} Créditos</span>
                            </div>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-2">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 🚀 BOTÓN PRINCIPAL */}
                    <button 
                        onClick={handleGenerate} 
                        disabled={(!contenidoOriginal.trim() && !url) || isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="animate-spin" size={20}/>
                                TRADUCIENDO A {selectedRed.toUpperCase()}...
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} className="group-hover:rotate-12 transition-transform"/>
                                GENERAR COPY MULTIPLATAFORMA
                            </>
                        )}
                    </button>
                </div>

                {/* ==================== PANEL DERECHO: RESULTADOS ==================== */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in slide-in-from-right-10 max-h-[1000px] overflow-y-auto custom-scrollbar">
                            
                            {/* HEADER DEL RESULTADO */}
                            <div className="flex justify-between items-start pb-6 border-b border-gray-800">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">
                                        Copy Optimizado
                                    </span>
                                    <h2 className="text-2xl font-black text-white">
                                        {selectedRed} • {selectedFormato}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Objetivo: {selectedObjetivo}
                                    </p>
                                </div>
                                
                                <div className="text-right">
                                    <div className={`text-5xl font-black ${getScoreColor(result.validacion_interna?.score_calidad || 0)}`}>
                                        {result.validacion_interna?.score_calidad || 0}
                                        <span className="text-lg text-gray-600">/100</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase mt-1">Score de Calidad</p>
                                </div>
                            </div>

                            {/* COPY PRINCIPAL */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 p-6 rounded-2xl relative group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                                
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={16}/> Copy Principal
                                    </h4>
                                    <button 
                                        onClick={() => copyToClipboard(result.copy_principal?.texto || '')} 
                                        className="text-[10px] bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1 rounded-lg transition-colors font-bold uppercase flex items-center gap-1"
                                    >
                                        <Copy size={10}/> Copiar
                                    </button>
                                </div>
                                
                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm mb-3">
                                    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                                        {result.copy_principal?.texto || 'No se pudo generar el copy'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{result.copy_principal?.longitud_caracteres || 0} caracteres</span>
                                    <span>Hook: "{result.copy_principal?.hook_textual?.substring(0, 30)}..."</span>
                                </div>
                            </div>

                            {/* VARIANTES ALTERNATIVAS */}
                            {result.variantes_alternativas && result.variantes_alternativas.length > 0 && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Layers size={14}/> Variantes Alternativas
                                        </h3>
                                        <button
                                            onClick={() => setShowVariantes(!showVariantes)}
                                            className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-3 py-1 rounded-lg transition-colors font-bold uppercase flex items-center gap-1"
                                        >
                                            {showVariantes ? 'Ocultar' : 'Ver'}
                                            <ChevronDown size={12} className={`transition-transform ${showVariantes ? 'rotate-180' : ''}`}/>
                                        </button>
                                    </div>

                                    {showVariantes && (
                                        <div className="space-y-3 animate-in slide-in-from-top-2">
                                            {result.variantes_alternativas.map((variante: any, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-black/40 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/30 transition-colors group"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] text-indigo-400 uppercase font-bold">
                                                            {variante.version}
                                                        </span>
                                                        <button
                                                            onClick={() => copyToClipboard(variante.texto)}
                                                            className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-2 py-1 rounded transition-all font-bold"
                                                        >
                                                            <Copy size={10} className="inline mr-1"/> Copiar
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-2">{variante.texto}</p>
                                                    <p className="text-xs text-gray-500 italic">💡 {variante.por_que_funciona}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SUGERENCIAS INTELIGENTES */}
                            {result.sugerencias_inteligentes && (
                                <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-2xl">
                                    <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap size={14}/> Sugerencias Inteligentes
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {result.sugerencias_inteligentes.mejor_red_social !== selectedRed && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
                                                <p className="text-xs text-yellow-300 font-bold mb-1">
                                                    💡 Mejor red: {result.sugerencias_inteligentes.mejor_red_social}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {result.sugerencias_inteligentes.razon_red}
                                                </p>
                                            </div>
                                        )}

                                        {result.sugerencias_inteligentes.riesgos_detectados && 
                                         result.sugerencias_inteligentes.riesgos_detectados.length > 0 && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-red-500/20">
                                                <p className="text-xs text-red-400 font-bold mb-2">⚠️ Riesgos Detectados:</p>
                                                <ul className="space-y-1">
                                                    {result.sugerencias_inteligentes.riesgos_detectados.map((riesgo: string, idx: number) => (
                                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                                            <span className="text-red-500 mt-0.5">•</span>
                                                            {riesgo}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.sugerencias_inteligentes.oportunidades_debate && 
                                         result.sugerencias_inteligentes.oportunidades_debate.length > 0 && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-green-500/20">
                                                <p className="text-xs text-green-400 font-bold mb-2">💬 Oportunidades de Debate:</p>
                                                <ul className="space-y-1">
                                                    {result.sugerencias_inteligentes.oportunidades_debate.map((frase: string, idx: number) => (
                                                        <li key={idx} className="text-xs text-gray-400">
                                                            "{frase}"
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ANÁLISIS DEL CONTENIDO */}
                            {result.analisis_contenido && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                    <h4 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">
                                        📊 Análisis del Contenido
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Mensaje Central:</span>
                                            <p className="text-xs text-gray-300">{result.analisis_contenido.mensaje_central}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Tipo:</span>
                                            <p className="text-xs text-gray-300">{result.analisis_contenido.tipo_contenido}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Estructura:</span>
                                            <p className="text-xs text-gray-300">{result.analisis_contenido.estructura_detectada}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Tono:</span>
                                            <p className="text-xs text-gray-300">{result.analisis_contenido.tono_original}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        // ESTADO VACÍO
                        <div className="h-full min-h-[700px] border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/10">
                            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                <Wand2 size={32} className="text-gray-700" />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2">Copy Multiplataforma Vacío</h3>
                            <p className="text-gray-600 text-sm max-w-[300px] leading-relaxed">
                                Configura tu red social, formato y objetivo, luego pega tu contenido para generar el copy optimizado.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* SCROLLBAR CUSTOM */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
            `}</style>
        </div>
    );
};