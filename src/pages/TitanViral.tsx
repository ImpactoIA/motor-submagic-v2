import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Video, Zap, Brain, Activity, 
  Globe, Loader2, ArrowRightLeft, 
  Clapperboard, User, Users,
  Laptop, UploadCloud, MonitorPlay, Music, ArrowRight, Camera, Image as ImageIcon, Layers
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// --- NORMALIZADOR DE DATOS ---
const normalizeResult = (data: any) => {
  const raw = data.generatedData || data;
  return {
    viral_score: raw.viral_score || 85,
    adaptation_metadata: raw.adaptation_metadata || { 
      original_niche: "Detectado",
      target_niche: "Tu Nicho",
      core_mechanism: "Estructura Viral"
    },
    translation_engine: Array.isArray(raw.translation_engine) ? raw.translation_engine : [],
    script_structure: raw.script_structure || { hook: "...", body: "...", cta: "..." },
    desglose_temporal: raw.desglose_temporal || [], 
    thumbnail_concept: raw.thumbnail_concept || {}, 
    produccion_deconstruida: raw.produccion_deconstruida || {},
    adn_extraido: raw.adn_extraido || { idea_ganadora: "Idea Viral", formula_gancho: "Gancho" }
  };
};

export const TitanViral = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Estados UI
  const [activeTab, setActiveTab] = useState<'forensics' | 'production' | 'thumbnail'>('forensics');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  
  // Inputs
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contexto V300
  const [experts, setExperts] = useState<any[]>([]);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedKbId, setSelectedKbId] = useState<string>('');

  const COSTO_RECREATE = 5;

  // --- CARGA INICIAL ---
  useEffect(() => {
      const fetchData = async () => {
          if (!user) return;
          try {
              const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user.id);
              if(exp) setExperts(exp);
              
              const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
              if(av) setAvatars(av);

              const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user.id);
              if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename || "Documento" })));

              if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
              if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
          } catch (e) { console.error(e); }
      };
      fetchData();
  }, [user, userProfile]);

  const checkCredits = () => {
      if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_RECREATE) {
          if(confirm(`💰 Saldo insuficiente (${COSTO_RECREATE} Cr). ¿Deseas recargar?`)) navigate('/settings');
          return false;
      }
      return true;
  };

  // --- ANÁLISIS POR URL ---
  const handleUrlAnalyze = async () => {
    if (!urlInput) return alert("Ingresa una URL válida");
    if (!user || !checkCredits()) return;

    setLoading(true);
    setResult(null);
    setActiveTab('forensics');

    try {
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: { 
            url: urlInput, 
            selectedMode: 'recreate', 
            expertId: selectedExpertId,
            avatarId: selectedAvatarId,
            knowledgeBaseId: selectedKbId,
            estimatedCost: COSTO_RECREATE
        } 
      });

      if (error) throw error;
      const genData = data?.generatedData;
      // Normalizamos la respuesta, ya sea que venga plana o anidada
      setResult(normalizeResult(genData.autopsia_viral || genData));
      
      if(refreshProfile) refreshProfile();

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- ANÁLISIS POR ARCHIVO (FALLBACK INTELIGENTE) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user || !checkCredits()) return;

    try {
        setLoading(true);
        setResult(null);
        setActiveTab('forensics');
        setUploadProgress(10);

        const fileExt = file.name.split('.').pop();
        const fileName = `viral-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Intentamos subir a 'videos-analisis', si falla usamos 'knowledge-files' como fallback
        let bucketName = 'videos-analisis';
        
        // 1. Subir
        let { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
        
        if (uploadError && (uploadError.message.includes('not found') || uploadError.message.includes('permission'))) {
             // Fallback a bucket conocido
             bucketName = 'knowledge-files';
             const { error: retryError } = await supabase.storage.from(bucketName).upload(filePath, file);
             if (retryError) throw retryError;
        } else if (uploadError) {
            throw uploadError;
        }
        
        setUploadProgress(50);

        // 2. URL Pública
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        // 3. Procesar
        const { data, error } = await supabase.functions.invoke('process-url', {
            body: { 
                url: publicUrl, 
                selectedMode: 'recreate',
                expertId: selectedExpertId,
                avatarId: selectedAvatarId,
                knowledgeBaseId: selectedKbId,
                estimatedCost: COSTO_RECREATE
            } 
        });

        if (error) throw error;
        setUploadProgress(100);

        const genData = data?.generatedData;
        setResult(normalizeResult(genData.autopsia_viral || genData));
        
        if(refreshProfile) refreshProfile();

    } catch (err: any) {
        console.error(err);
        alert("Error en análisis: " + err.message);
    } finally {
        setLoading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-fuchsia-400 border-fuchsia-500 shadow-fuchsia-500/20";
    if (score >= 75) return "text-emerald-400 border-emerald-500 shadow-emerald-500/20";
    return "text-amber-400 border-amber-500 shadow-amber-500/20";
  };

  const renderContent = () => {
    if (!result) return null;

    if (activeTab === 'forensics') return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className={`md:col-span-3 bg-[#0a0a0a] border rounded-3xl p-8 flex flex-col justify-center items-center relative overflow-hidden ${getScoreColor(result.viral_score)}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-current opacity-50"></div>
                    <Activity size={32} className="mb-4 opacity-80" />
                    <div className="text-6xl font-black tracking-tighter mb-1">{result.viral_score}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Potencial</div>
                </div>

                <div className="md:col-span-9 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Brain size={120}/></div>
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Mecanismo Viral Detectado</h3>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">"{result.adaptation_metadata?.core_mechanism}"</h2>
                    <div className="flex gap-4">
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                            <span className="text-[10px] text-gray-500 uppercase block">Origen</span>
                            <span className="text-sm font-bold text-gray-300">{result.adaptation_metadata?.original_niche}</span>
                        </div>
                        <div className="flex items-center text-gray-600"><ArrowRightLeft size={16}/></div>
                        <div className="bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
                            <span className="text-[10px] text-indigo-400 uppercase block">Tu Adaptación</span>
                            <span className="text-sm font-bold text-indigo-200">{result.adaptation_metadata?.target_niche}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <ArrowRightLeft className="text-fuchsia-500" />
                    <h2 className="text-lg font-black uppercase tracking-tighter">Traducción de Nicho (El Espejo)</h2>
                </div>
                {result.translation_engine?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-11 gap-4 bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl group hover:border-indigo-500/30 transition-all">
                        <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                            <span className="text-[10px] font-black text-gray-500 -rotate-90 whitespace-nowrap">{item.phase}</span>
                        </div>
                        <div className="md:col-span-4 bg-red-900/5 p-4 rounded-2xl border border-red-500/10 opacity-60 grayscale group-hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2 mb-2"><Video size={14} className="text-red-400"/><span className="text-[10px] font-bold text-red-400 uppercase">Video Original</span></div>
                            <p className="text-sm text-gray-300 font-medium">"{item.original_action}"</p>
                        </div>
                        <div className="md:col-span-1 flex items-center justify-center"><ArrowRightLeft size={20} className="text-gray-600 group-hover:text-indigo-400" /></div>
                        <div className="md:col-span-5 bg-green-900/10 p-5 rounded-2xl border border-green-500/20 shadow-lg shadow-green-900/5">
                            <div className="flex items-center gap-2 mb-2"><Clapperboard size={14} className="text-green-400"/><span className="text-[10px] font-black text-green-400 uppercase tracking-wider">Tu Instrucción</span></div>
                            <p className="text-lg text-white font-bold leading-snug">"{item.your_action}"</p>
                            <div className="mt-3 pt-3 border-t border-green-500/10"><p className="text-[10px] text-green-600 font-bold uppercase">Principio: {item.principle}</p></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (activeTab === 'production') return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 relative">
                <div className="absolute top-4 right-4 opacity-10"><Clapperboard size={60} className="text-white"/></div>
                <h3 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                    <Camera size={24} className="text-green-400"/> Lista de Tomas (Shot List)
                </h3>
                <div className="space-y-4">
                    {(result.desglose_temporal || []).map((step: any, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center shrink-0 mt-1 cursor-pointer hover:bg-green-500 hover:border-green-500 transition-colors">
                                <div className="w-3 h-3 bg-transparent rounded-full"></div>
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-green-400 uppercase mb-1 block">TOMA {i + 1} ({step.segundo}s)</span>
                                <p className="text-white font-bold text-sm mb-1">{step.instruccion_rodaje || step.que_pasa}</p>
                                <p className="text-xs text-gray-400 italic mt-1">Por qué: {step.porque_funciona}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <h4 className="text-xs font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><Music size={12}/> Audio</h4>
                    <p className="text-sm text-white font-medium">{result.produccion_deconstruida?.musica_sonido}</p>
                </div>
            </div>
        </div>
    );

    if (activeTab === 'thumbnail') {
        const thumb = result.thumbnail_concept || {};
        return (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 relative">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-full md:w-1/3 aspect-[9/16] bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-600 group hover:border-purple-500 transition-colors">
                            <ImageIcon size={40} className="text-gray-600 group-hover:text-purple-500 transition-colors"/>
                            <div className="absolute bottom-4 left-0 w-full text-center px-2">
                                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase shadow-lg block truncate">{thumb.texto_en_imagen || "TEXTO"}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <h3 className="text-white font-black text-lg flex items-center gap-2"><MonitorPlay size={20} className="text-purple-400"/> Arquitectura de Miniatura</h3>
                            <div className="space-y-3">
                                <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                                    <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Visual</span>
                                    <p className="text-sm text-white leading-snug">{thumb.elemento_visual}</p>
                                </div>
                                <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                                    <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Texto (Copy)</span>
                                    <p className="text-sm text-white leading-snug">"{thumb.texto_en_imagen}"</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-purple-900/10 p-3 rounded-xl border border-purple-500/20"><span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Color</span><p className="text-xs text-gray-300">{thumb.color_psicologia}</p></div>
                                    <div className="bg-purple-900/10 p-3 rounded-xl border border-purple-500/20"><span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Layout</span><p className="text-xs text-gray-300">{thumb.composicion}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 font-sans text-white">
      
      {/* HEADER */}
      <div className="text-center space-y-4 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-pulse">
          <Brain size={12} /> Titan V300 - Full Access
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
          RECREAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">VIRAL</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl mx-auto">
          Copia la estructura viral y adáptala a tu <span className="text-white font-bold">Base de Conocimiento</span>.
        </p>
      </div>

      {/* INPUT & CONTEXTO */}
      <div className="max-w-4xl mx-auto mb-16 space-y-6">
        
        {/* SELECTORES CONTEXTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={14}/></div>
                <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 pl-9 text-xs text-gray-300 outline-none focus:border-indigo-500 transition-colors cursor-pointer hover:bg-gray-900">
                    <option value="">Tu Perfil (Experto)</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
            </div>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-400"><Users size={14}/></div>
                <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 pl-9 text-xs text-gray-300 outline-none focus:border-fuchsia-500 transition-colors cursor-pointer hover:bg-gray-900">
                    <option value="">Tu Audiencia (Avatar)</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
            </div>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"><Globe size={14}/></div>
                <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 pl-9 text-xs text-gray-300 outline-none focus:border-emerald-500 transition-colors cursor-pointer hover:bg-gray-900">
                    <option value="">Tu Conocimiento (Cerebro)</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                </select>
            </div>
        </div>

        {/* INPUTS DUALES: URL + UPLOAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. URL INPUT */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-widest"><Globe size={14}/> Opción A: Link</div>
                    <input 
                        type="text" 
                        placeholder="Pega link de TikTok / YT..."
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleUrlAnalyze} 
                    disabled={loading || !urlInput}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading && urlInput ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16}/>} ANALIZAR LINK
                </button>
            </div>

            {/* 2. UPLOAD INPUT */}
            <div 
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all cursor-pointer relative overflow-hidden group"
                onClick={() => !loading && fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="video/*" />
                
                <div className="mb-4 relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-fuchsia-400 font-bold text-xs uppercase tracking-widest"><Laptop size={14}/> Opción B: Archivo</div>
                    <div className="w-full bg-black border border-white/10 rounded-xl px-4 py-8 text-center border-dashed group-hover:border-fuchsia-500/50 transition-all">
                        <UploadCloud size={24} className="mx-auto text-gray-500 mb-2 group-hover:text-fuchsia-400"/>
                        <span className="text-xs text-gray-400">Click para subir MP4/MOV</span>
                    </div>
                </div>
                
                {loading && uploadProgress > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-fuchsia-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                )}
            </div>
        </div>
        
        <div className="text-center">
            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Costo por operación: {COSTO_RECREATE} créditos
            </span>
        </div>
      </div>

      {/* --- RESULTADOS --- */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* TABS NAVIGATION */}
            <div className="flex p-1 bg-gray-900/50 rounded-2xl border border-gray-800 max-w-2xl mx-auto">
                <button onClick={() => setActiveTab('forensics')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'forensics' ? 'bg-[#0B0E14] text-cyan-400 shadow-lg border border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Layers size={14}/> Análisis
                </button>
                <button onClick={() => setActiveTab('production')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'production' ? 'bg-[#0B0E14] text-green-400 shadow-lg border border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Camera size={14}/> Rodaje
                </button>
                <button onClick={() => setActiveTab('thumbnail')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'thumbnail' ? 'bg-[#0B0E14] text-purple-400 shadow-lg border border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}>
                    <ImageIcon size={14}/> Miniatura
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[400px]">
                {renderContent()}
            </div>

            {/* BOTON FINAL */}
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate('/dashboard/script-generator', { state: { topic: result.adn_extraido?.idea_ganadora || "Video Recreado", hook: result.adn_extraido?.formula_gancho || "Gancho Viral" } })}
                    className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 hover:border-indigo-500/50 text-white rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-xl hover:shadow-indigo-900/20"
                >
                    <span className="font-black text-sm uppercase tracking-widest">Llevar al Generador de Guiones</span>
                    <ArrowRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>

        </div>
      )}
    </div>
  );
};