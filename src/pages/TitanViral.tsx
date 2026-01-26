import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, TrendingUp, Zap, Target, Brain, 
  CheckCircle2, BarChart3, Sparkles, Copy, 
  Upload, FileVideo, Loader2, Globe, Laptop,
  Clock, Eye, ShieldAlert, Layers, Download, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ajusta la ruta a tu cliente de Supabase

const TitanViralV103 = () => {
  // --- ESTADOS DEL SISTEMA ---
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeHook, setActiveHook] = useState(0);
  const [activeTab, setActiveTab] = useState('script');
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE COPIADO ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- PROCESAMIENTO: URL VIRAL ---
  const handleUrlAnalysis = async () => {
    if (!urlInput) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: { 
          url: urlInput, 
          selectedMode: 'recreate',
          estimatedCost: 10 
        }
      });
      if (error) throw error;
      setResult(data.generatedData || data);
    } catch (err: any) {
      alert("Error en análisis: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PROCESAMIENTO: SUBIDA DESDE PC (ORREO IMPACTOIA) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setUploadProgress(20);

      // 1. Subir a Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('videos-analisis')
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      setUploadProgress(60);

      // 2. Obtener URL y analizar
      const { data: { publicUrl } } = supabase.storage
        .from('videos-analisis')
        .getPublicUrl(fileName);
      
      const { data, error: funcError } = await supabase.functions.invoke('process-url', {
        body: { 
          url: publicUrl, 
          selectedMode: 'recreate',
          platform: 'archivo_directo'
        }
      });

      if (funcError) throw funcError;
      setResult(data.generatedData || data);
      setUploadProgress(100);
    } catch (err: any) {
      alert("Error en subida: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      
      {/* --- HEADER: BRANDING & IDENTITY (IMPACTOIA) --- */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">TITAN <span className="text-indigo-500">V103</span></h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">ImpactoIA Global Intelligence</p>
          </div>
        </div>

        {result && (
          <div className="flex gap-6 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-400">{result.viral_prediction?.score || 85}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Viral Score</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">
                {(result.viral_prediction?.confidence * 100 || 80).toFixed(0)}%
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Confidence</div>
            </div>
          </div>
        )}
      </div>

      {/* --- INGESTIÓN DUAL: URL + PC --- */}
      <div className="max-w-6xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opción Link */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-blue-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Analizar Link Viral</h3>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="TikTok, Reels, YouTube URL..."
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button 
              onClick={handleUrlAnalysis}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        {/* Opción PC */}
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          className="relative overflow-hidden bg-purple-500/5 border border-purple-500/20 p-6 rounded-3xl cursor-pointer hover:bg-purple-500/10 transition-all group"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="video/*" />
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 p-4 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Laptop size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Subir desde Ordenador</h3>
              <p className="text-xs text-gray-500">Soporta MP4, MOV y WebM</p>
            </div>
          </div>
          {loading && uploadProgress > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-purple-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          )}
        </div>
      </div>

      {/* --- RESULTADOS V103 --- */}
      {result && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Columna Principal (Script y Visuales) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SELECTOR DE HOOKS CON MÉTRICAS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={14} className="text-indigo-400" /> Hook Variations (Forensic DNA)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.hook_variations?.map((hook: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setActiveHook(i)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      activeHook === i ? 'bg-indigo-600 border-indigo-400' : 'bg-black border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase opacity-60 mb-2">{hook.type}</div>
                    <p className="text-xs font-bold leading-tight line-clamp-3 mb-3">"{hook.script}"</p>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="opacity-60">Retention</span>
                      <span className="text-green-400">{hook.predicted_retention}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ÁREA DE TRABAJO (TABS) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="flex bg-black/50 border-b border-white/10">
                {['script', 'visuals', 'analysis'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === 'script' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl group relative">
                      <button onClick={() => copyToClipboard(result.hook_variations[activeHook].script)} className="absolute top-4 right-4 p-2 bg-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={16} />
                      </button>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Hook Adaptado</span>
                      <p className="text-2xl font-black italic mt-2">"{result.hook_variations[activeHook].script}"</p>
                    </div>
                    <div className="relative group">
                      <button onClick={() => copyToClipboard(result.script_body)} className="absolute top-0 right-0 p-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={16} />
                      </button>
                      <p className="text-xl text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{result.script_body}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'visuals' && (
                  <div className="space-y-4">
                    {result.visual_plan?.map((shot: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold p-2 rounded-lg h-fit">{shot.time}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-200">{shot.visual_instruction}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">Audio: {shot.audio_ref}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.viral_prediction?.key_strengths?.map((s: string, i: number) => (
                      <div key={i} className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-green-400" />
                        <span className="text-sm font-medium text-gray-300">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha (Insights & QA) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" /> Viral Forensic DNA
              </h3>
              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-indigo-400 uppercase mb-1">Niche Strategy</div>
                  <p className="text-sm font-bold leading-tight">{result.adaptation_metadata?.niche_translation || "Cargando..."}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-indigo-400 uppercase mb-1">Psychological Trigger</div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{result.viral_prediction?.strengths?.[0] || "Universal Mechanism"}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} /> Optimization
              </h3>
              <ul className="space-y-3">
                {result.viral_prediction?.optimization_tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-xs font-medium text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-500">⚡</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5">
              <Download size={20} /> EXPORTAR PLAN
            </button>
          </div>

        </div>
      )}

      {/* NOTIFICACIÓN DE COPIADO */}
      {copied && (
        <div className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl animate-bounce z-50">
          ¡Copiado con éxito!
        </div>
      )}
    </div>
  );
};

export default TitanViralV103;