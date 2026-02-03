import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Dna, RefreshCw, Zap, Copy, Save, Link as LinkIcon, Upload, Trash2,
    Target, User, Briefcase, FileCode2, CheckCircle2, AlertCircle, Sparkles,
    Layout, AlignLeft, Video, Brain, BookOpen, ArrowRight, Percent, TrendingUp
} from 'lucide-react';

// ==================================================================================
// 💰 CONFIGURACIÓN DE COSTOS
// ==================================================================================
const COST_FULL_PROCESS = 10; // Autopsia (5) + Adaptación (5)
const COST_ONLY_SCRIPT = 5;   // Solo Adaptación (si ya vienes con el ADN listo)

export const TitanViral = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();

    // --- ESTADOS DE ENTRADA ---
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url'); // Switch URL/Archivo
    const [urlInput, setUrlInput] = useState('');
    const [uploadedVideoFile, setUploadedVideoFile] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    
    const [viralDNA, setViralDNA] = useState<any>(null);
    
    // --- ESTADOS DE ADAPTACIÓN ---
    const [myNiche, setMyNiche] = useState('');
    const [myTopic, setMyTopic] = useState(''); // Opcional (Auto-deducción)
    
    // --- CONTEXTO (PERFILES DE SUPABASE) ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [kbs, setKbs] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('');
    const [selectedKbId, setSelectedKbId] = useState('');

    // --- ESTADOS DEL PROCESO ---
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'adapting' | 'done'>('idle');
    const [resultScript, setResultScript] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'script' | 'visual' | 'analysis' | 'cloning'>('script');
    const [isSaving, setIsSaving] = useState(false);

    // ==================================================================================
    // 1. CARGA INICIAL DE DATOS (MANTIENE CONEXIONES)
    // ==================================================================================
    useEffect(() => {
        // A. Cargar datos si venimos de la herramienta AnalyzeViral
        if (location.state?.viralDNA) {
            setViralDNA(location.state.viralDNA);
            if(location.state.originalUrl) setUrlInput(location.state.originalUrl);
        } 
        
        // B. Cargar Perfiles de Supabase (Experto, Avatar, KB)
        if (user) {
            const loadData = async () => {
                // 1. Expertos
                const { data: exp } = await supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id);
                if(exp) {
                    setExperts(exp);
                    if(userProfile?.active_expert_id) {
                        const active = exp.find(e => e.id === userProfile.active_expert_id);
                        if (active) { setSelectedExpertId(active.id); setMyNiche(active.niche); }
                    }
                }

                // 2. Avatares
                const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if(av) { 
                    setAvatars(av); 
                    if(userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id); 
                }

                // 3. Bases de Conocimiento
                const { data: kb } = await supabase.from('documents').select('id, title').eq('user_id', user.id);
                if(kb) setKbs(kb);
            };
            loadData();
        }
    }, [location, user, userProfile]);

    // ==================================================================================
    // 📤 LÓGICA DE UPLOAD DE VIDEO
    // ==================================================================================
    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi', 'video/x-msvideo'];
        if (!validTypes.includes(file.type)) {
            alert('⚠️ Formato no válido. Solo: MP4, MOV, WEBM, AVI');
            return;
        }

        // Validar tamaño (máximo 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert(`⚠️ Video demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo: 100MB`);
            return;
        }

        // Convertir a base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setUploadedVideoFile(base64);
            setUploadedFileName(file.name);
            setUrlInput(''); // Limpiar URL si había una para evitar conflictos
            console.log('[UPLOAD] ✅ Video cargado:', file.name);
        };
        reader.onerror = () => alert('❌ Error al leer el archivo');
        reader.readAsDataURL(file);
    };

    const handleClearUpload = () => {
        setUploadedVideoFile(null);
        setUploadedFileName('');
    };

    // ==================================================================================
    // 🎯 PROCESADOR ELITE (SOPORTA ARCHIVOS Y URL)
    // ==================================================================================
    const handleProcess = async () => {
        // Validación básica
        if (!myNiche.trim()) {
            alert("⚠️ Define tu Nicho (Ej: Finanzas, Fitness, Marketing...)");
            return;
        }

        // Determinar si necesitamos autopsia (si no hay ADN previo)
        const needsAutopsy = !viralDNA; 
        
        // Si necesitamos autopsia, debe haber un input válido (URL o Archivo)
        if (needsAutopsy) {
            if (uploadMode === 'url' && !urlInput.trim()) {
                alert("⚠️ Ingresa una URL válida");
                return;
            }
            if (uploadMode === 'file' && !uploadedVideoFile) {
                alert("⚠️ Sube un archivo de video");
                return;
            }
        }

        const totalCost = needsAutopsy ? COST_FULL_PROCESS : COST_ONLY_SCRIPT;

        // Verificar créditos
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < totalCost) {
            if(confirm(`💰 Saldo insuficiente (${totalCost} créditos). ¿Recargar ahora?`)) {
                navigate('/settings');
            }
            return;
        }

        setResultScript(null);
        
        try {
            let dnaToUse = viralDNA;

            // ─────────────────────────────────────────────────────────────────
            // PASO A: EXTRAER ADN (Si no existe)
            // ─────────────────────────────────────────────────────────────────
            if (needsAutopsy) {
                setStatus('analyzing');
                console.log('[TITAN] 🔬 Iniciando autopsia del video viral...');
                
                const { data: autopsyData, error: autopsyError } = await supabase.functions.invoke('process-url', {
                    body: {
                        selectedMode: 'autopsia_viral',
                        
                        // Enviamos URL o Archivo según el modo
                        url: uploadMode === 'url' ? urlInput : null,
                        uploadedVideo: uploadMode === 'file' ? uploadedVideoFile : null,
                        uploadedFileName: uploadMode === 'file' ? uploadedFileName : null,
                        
                        platform: uploadMode === 'url' ? (
                            urlInput.includes('youtu') ? 'youtube' : 
                            urlInput.includes('tiktok') ? 'tiktok' : 
                            urlInput.includes('instagram') ? 'instagram' : 'general'
                        ) : 'upload',
                        
                        estimatedCost: 5
                    }
                });

                if (autopsyError) throw new Error(`Error en autopsia: ${autopsyError.message}`);
                if (!autopsyData?.generatedData) throw new Error("No se pudo extraer el ADN del video.");

                dnaToUse = autopsyData.generatedData;
                setViralDNA(dnaToUse);
                console.log('[TITAN] ✅ ADN extraído correctamente');
            }

            // ─────────────────────────────────────────────────────────────────
            // PASO B: CLONACIÓN AL NICHO
            // ─────────────────────────────────────────────────────────────────
            setStatus('adapting');
            console.log('[TITAN] 🧬 Iniciando clonación matemática al nicho...');

            // Lógica Auto-Deducción: Si está vacío, enviamos string vacío.
            const topicToSend = myTopic.trim() === "" ? "" : myTopic;

            const { data: scriptData, error: scriptError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'recreate', // Modo Ingeniería Inversa
                    
                    userInput: topicToSend,
                    
                    // Pasamos la referencia original para metadatos
                    url: uploadMode === 'url' ? urlInput : null,
                    uploadedVideo: uploadMode === 'file' ? uploadedVideoFile : null,
                    uploadedFileName: uploadMode === 'file' ? uploadedFileName : null,
                    
                    // Trigger del Clonador Matemático
                    viralDNA: dnaToUse,
                    
                    // Contexto
                    expertId: selectedExpertId || null,
                    avatarId: selectedAvatarId || null,
                    knowledgeBaseId: selectedKbId || null,
                    
                    settings: { 
                        structure: 'winner_rocket',
                        manual_niche: myNiche,
                        duration: 'medium'
                    },
                    
                    estimatedCost: 5
                }
            });

            if (scriptError) throw new Error(`Error en adaptación: ${scriptError.message}`);
            if (!scriptData?.generatedData) throw new Error("No se pudo generar la adaptación.");

            const finalResult = scriptData.generatedData;
            const adaptedScript = finalResult.guion_generado || finalResult;
            
            setResultScript(adaptedScript);
            setStatus('done');
            
            console.log('[TITAN] 🎉 Clonación completada exitosamente');
            
            if(refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error('[TITAN] ❌ Error:', e);
            alert(`Error: ${e.message}`);
            setStatus('idle');
        }
    };

    // ==================================================================================
    // 💾 GUARDAR EN BIBLIOTECA
    // ==================================================================================
    const handleSave = async () => {
        if (!resultScript || !user) return;
        setIsSaving(true);
        
        // Título inteligente
        const finalTitle = resultScript.metadata_guion?.tema_deducido || 
                           resultScript.metadata_guion?.tema_tratado || 
                           myTopic || 
                           "Clonación Viral";

        try {
            await supabase.from('content_items').insert({
                user_id: user.id,
                type: 'script',
                title: `CLON: ${finalTitle}`,
                content: resultScript,
                status: 'draft',
                platform: 'General'
            });
            alert("✅ Guardado en biblioteca exitosamente");
        } catch (e: any) {
            console.error('[SAVE] Error:', e);
            alert(`Error al guardar: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = () => {
        const textToCopy = resultScript?.guion_completo_adaptado || resultScript?.guion_completo || '';
        if (!textToCopy) return alert("⚠️ No hay guion para copiar");
        navigator.clipboard.writeText(textToCopy).then(() => alert("✅ Copiado"));
    };

    // ==================================================================================
    // 🎨 RENDERIZADO
    // ==================================================================================
    return (
        <div className="max-w-7xl mx-auto pb-20 p-4 font-sans text-white animate-in fade-in duration-500">
            
            {/* HEADER */}
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6 mb-8">
                <div className="p-3 bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 rounded-2xl border border-fuchsia-500/30">
                    <Dna size={32} className="text-fuchsia-400"/>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        INGENIERÍA INVERSA
                        <span className="text-xs font-bold bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-2 py-0.5 rounded">ELITE</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Clona estructuras virales matemáticamente y adáptalas a tu nicho.</p>
                </div>
                <div className="ml-auto bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                    <span className="text-xs font-bold text-gray-400">Créditos: </span>
                    <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 👈 IZQUIERDA: LABORATORIO */}
                <div className="space-y-6">
                    
                    {/* 1️⃣ FUENTE VIRAL (Con Tabs y Upload) */}
                    <div className={`border rounded-3xl p-6 relative overflow-hidden transition-all ${
                        viralDNA ? 'bg-cyan-900/10 border-cyan-500/30 shadow-lg shadow-cyan-500/5' : 'bg-[#0B0E14] border-gray-800'
                    }`}>
                        {viralDNA ? (
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                                        <CheckCircle2 size={12}/> ADN VIRAL DETECTADO
                                    </span>
                                    <button 
                                        onClick={() => {
                                            setViralDNA(null); 
                                            setUrlInput(''); 
                                            handleClearUpload();
                                        }} 
                                        className="text-[10px] text-gray-500 hover:text-white underline transition-colors"
                                    >
                                        Cambiar video
                                    </button>
                                </div>
                                
                                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                                    "{viralDNA.adn_extraido?.idea_ganadora || "Estructura Viral Capturada"}"
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <span className="block text-[8px] text-gray-500 uppercase mb-1">Patrón</span>
                                        <span className="text-xs text-cyan-200 font-bold">{viralDNA.patron_replicable?.nombre_patron || 'N/A'}</span>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <span className="block text-[8px] text-gray-500 uppercase mb-1">Trigger</span>
                                        <span className="text-xs text-cyan-200 font-bold">{viralDNA.adn_extraido?.disparador_psicologico || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">1. Fuente del Video</label>
                                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                                        <button 
                                            onClick={() => setUploadMode('url')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${uploadMode === 'url' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            URL
                                        </button>
                                        <button 
                                            onClick={() => setUploadMode('file')}
                                            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${uploadMode === 'file' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Subir Archivo
                                        </button>
                                    </div>
                                </div>

                                {uploadMode === 'url' ? (
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"><LinkIcon size={18}/></div>
                                        <input 
                                            type="text"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://tiktok.com/@user/video/..."
                                            className="w-full bg-black border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-gray-600"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-2">Soporta TikTok, Reels y YouTube Shorts</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {!uploadedVideoFile ? (
                                            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-6 text-center hover:border-cyan-500/50 transition-colors bg-black/20 group cursor-pointer relative">
                                                <input 
                                                    type="file" 
                                                    accept="video/*" 
                                                    onChange={handleVideoUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <Upload size={24} className="mx-auto text-gray-500 group-hover:text-cyan-400 mb-2 transition-colors"/>
                                                <p className="text-xs text-gray-400 font-medium">Haz clic para subir MP4, MOV o WEBM</p>
                                                <p className="text-[9px] text-gray-600 mt-1">Máximo 100MB</p>
                                            </div>
                                        ) : (
                                            <div className="bg-black border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                                        <Video size={16} className="text-green-400"/>
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-white truncate max-w-[180px]">{uploadedFileName}</p>
                                                        <p className="text-[9px] text-green-400">Listo para analizar</p>
                                                    </div>
                                                </div>
                                                <button onClick={handleClearUpload} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <FileCode2 size={100}/>
                        </div>
                    </div>

                    {/* 2️⃣ TU ADAPTACIÓN */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-600 to-indigo-600 rounded-l-3xl"></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles size={16} className="text-yellow-400"/> Tu Adaptación
                        </h3>

                        <div className="space-y-5">
                            {/* Contexto Inteligente (SELECTORES) */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative group">
                                    <select value={selectedExpertId} onChange={(e) => {
                                        const exp = experts.find(x => x.id === e.target.value);
                                        setSelectedExpertId(e.target.value);
                                        if(exp) setMyNiche(exp.niche);
                                    }} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer">
                                        <option value="">Experto</option>
                                        {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                    <User size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                                <div className="relative group">
                                    <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer">
                                        <option value="">Avatar</option>
                                        {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <Target size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                                <div className="relative group">
                                    <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer">
                                        <option value="">Base</option>
                                        {kbs.map(k => <option key={k.id} value={k.id}>{k.title}</option>)}
                                    </select>
                                    <BookOpen size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                            </div>

                            {/* Nicho Manual (OBLIGATORIO) */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tu Nicho (Obligatorio)</label>
                                <input 
                                    type="text" 
                                    value={myNiche} 
                                    onChange={(e) => setMyNiche(e.target.value)} 
                                    placeholder="Ej: Finanzas Personales, Fitness, Marketing..." 
                                    className="w-full bg-transparent border-b border-gray-800 py-2 text-sm text-white focus:border-fuchsia-500 outline-none transition-colors placeholder:text-gray-600"
                                />
                            </div>

                            {/* Nuevo Tema (OPCIONAL) */}
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest flex justify-between items-center">
                                    <span>Tu Nuevo Tema</span>
                                    <span className="text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded text-[9px] border border-fuchsia-500/20">OPCIONAL: AUTO-DEDUCIR</span>
                                </label>
                                <textarea 
                                    value={myTopic}
                                    onChange={(e) => setMyTopic(e.target.value)}
                                    placeholder="Déjalo vacío y la IA deducirá el tema matemáticamente (Ej: Si el video es sobre 'Dieta', la IA escribirá sobre 'Tu Nicho')."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-fuchsia-500 outline-none h-24 resize-none placeholder:text-gray-600"
                                />
                            </div>

                            {/* Botón de Acción */}
                            <button 
                                onClick={handleProcess} 
                                disabled={status !== 'idle' || !myNiche.trim()}
                                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black rounded-xl flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-fuchsia-500/20 transition-all active:scale-95 disabled:opacity-50 group mt-2"
                            >
                                {status === 'analyzing' && <><RefreshCw className="animate-spin" size={18}/> ESCANEANDO VIDEO...</>}
                                {status === 'adapting' && <><RefreshCw className="animate-spin" size={18}/> ADAPTANDO MATEMÁTICAMENTE...</>}
                                {status === 'idle' && <><Zap size={18} className="text-yellow-300 fill-yellow-300"/> {viralDNA ? 'CLONAR ESTRUCTURA' : 'ANALIZAR Y CLONAR'}</>}
                                {status === 'done' && <><CheckCircle2 size={18} /> CLONACIÓN COMPLETADA</>}
                            </button>
                            
                            <p className="text-center text-[10px] text-gray-500">
                                Costo: <span className="text-white font-bold">{viralDNA ? COST_ONLY_SCRIPT : COST_FULL_PROCESS} Créditos</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 👉 DERECHA: RESULTADO (GUION ADAPTADO) */}
                <div className="lg:col-span-8 h-full">
                    {resultScript ? (
                        <div className="bg-[#0B0E14] border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col animate-in slide-in-from-bottom-8">
                            
                            {/* Toolbar */}
                            <div className="p-6 border-b border-gray-800 bg-gray-900/30 flex justify-between items-center">
                                <div>
                                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit mb-2">
                                        <CheckCircle2 size={12}/> Adaptación Exitosa
                                    </span>
                                    <h2 className="text-xl font-black text-white leading-tight max-w-sm">
                                        {resultScript.metadata_guion?.tema_deducido || resultScript.metadata_guion?.tema_tratado || myTopic || "Clonación Finalizada"}
                                    </h2>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleCopy} className="p-2 bg-gray-800 rounded-lg hover:text-white text-gray-400 border border-gray-700" title="Copiar"><Copy size={18}/></button>
                                    <button onClick={handleSave} disabled={isSaving} className="p-2 bg-gray-800 rounded-lg hover:text-white text-gray-400 border border-gray-700" title="Guardar"><Save size={18}/></button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-800 bg-black/20">
                                <button onClick={() => setActiveTab('script')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'script' ? 'text-white border-b-2 border-fuchsia-500 bg-fuchsia-500/5' : 'text-gray-500 hover:text-gray-300'}`}><AlignLeft size={14}/> Teleprompter</button>
                                <button onClick={() => setActiveTab('visual')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'visual' ? 'text-white border-b-2 border-green-500 bg-green-500/5' : 'text-gray-500 hover:text-gray-300'}`}><Video size={14}/> Escenas</button>
                                <button onClick={() => setActiveTab('cloning')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'cloning' ? 'text-white border-b-2 border-cyan-500 bg-cyan-500/5' : 'text-gray-500 hover:text-gray-300'}`}><Dna size={14}/> Análisis</button>
                                <button onClick={() => setActiveTab('analysis')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'analysis' ? 'text-white border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}><Brain size={14}/> Psicología</button>
                            </div>

                            {/* Contenido */}
                            <div className="p-6 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                
                                {activeTab === 'script' && (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="bg-black/40 p-8 rounded-2xl border border-gray-800/50 shadow-inner">
                                            <p className="text-gray-200 whitespace-pre-wrap font-medium leading-relaxed font-mono text-lg">
                                                {resultScript.guion_completo || resultScript.guion_completo_adaptado}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'visual' && (
                                    <div className="space-y-3 animate-in fade-in">
                                        {(resultScript.plan_visual || resultScript.plan_visual_adaptado)?.map((scene: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:bg-gray-900 transition-colors">
                                                <span className="text-xs font-mono font-bold text-gray-500 w-16 text-right pt-1">{scene.tiempo}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-bold mb-1">{scene.accion_en_pantalla || scene.accion_adaptada}</p>
                                                    <div className="flex gap-3 mt-2">
                                                        <span className="text-[10px] bg-fuchsia-500/10 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-500/20">🎥 {scene.instruccion_produccion || "Visual"}</span>
                                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">🖥️ {scene.texto_pantalla || "Sin texto"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'cloning' && (
                                    <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-5 animate-in fade-in">
                                        <h4 className="text-xs font-black text-cyan-400 uppercase mb-4 flex items-center gap-2"><TrendingUp size={14}/> Métricas de Clonación</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-black/30 p-3 rounded-lg"><span className="block text-[8px] text-gray-500 uppercase mb-1">Nicho Original</span><span className="text-xs text-cyan-200 font-bold">{resultScript.metadata_clonacion?.video_original_nicho || 'N/A'}</span></div>
                                            <div className="bg-black/30 p-3 rounded-lg"><span className="block text-[8px] text-gray-500 uppercase mb-1">Nicho Destino</span><span className="text-xs text-green-300 font-bold">{resultScript.metadata_clonacion?.video_nuevo_nicho || myNiche}</span></div>
                                            <div className="bg-black/30 p-3 rounded-lg"><span className="block text-[8px] text-gray-500 uppercase mb-1">Fidelidad Estructural</span><span className="text-xs text-green-400 font-bold">{resultScript.metadata_clonacion?.nivel_fidelidad_estructural || 'N/A'}</span></div>
                                            <div className="bg-black/30 p-3 rounded-lg"><span className="block text-[8px] text-gray-500 uppercase mb-1">Arquitectura</span><span className="text-xs text-yellow-300 font-bold">{resultScript.metadata_clonacion?.arquitectura_replicada || 'Winner Rocket'}</span></div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'analysis' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                        <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Estrategia</span><p className="text-white font-medium">{resultScript.metadata_guion?.estrategia || "Clonación Matemática V700"}</p></div>
                                        <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tema Deducido</span><p className="text-white font-medium">{resultScript.metadata_guion?.tema_deducido || "Automático"}</p></div>
                                        
                                        <div className="col-span-2 mt-4 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                            <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Nota del Arquitecto V700</h4>
                                            <p className="text-sm text-blue-200">
                                                Este guion ha sido generado utilizando una arquitectura de clonación matemática. 
                                                Se han preservado los porcentajes, tiempos y estructura del video original, 
                                                adaptando los sustantivos a tu nicho: <strong>{myNiche}</strong>.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-800 flex justify-end">
                                <button onClick={() => navigate('/tools/script-generator', { state: { prefilledScript: resultScript } })} className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors">
                                    Abrir en Editor Avanzado <ArrowRight size={14}/>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-[#0B0E14]/50 min-h-[600px]">
                            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-2xl opacity-50 relative group">
                                <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
                                <Layout size={40} className="text-gray-700 relative z-10 group-hover:text-gray-500 transition-colors" />
                            </div>
                            <h3 className="text-white font-black text-xl mb-3 opacity-50">ESPERANDO DATOS</h3>
                            <p className="text-gray-500 text-sm max-w-[280px] font-medium leading-relaxed">
                                {viralDNA ? "ADN Viral listo. Completa los datos a la izquierda para fusionar." : "Ingresa una URL, sube un video o carga un ADN previamente extraído."}
                            </p>
                        </div>
                    )}
                </div>

            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};