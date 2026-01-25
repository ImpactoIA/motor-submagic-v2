// @ts-nocheck
// 🔥 VERSIÓN V102.2 FINAL - TITAN ENGINE (URL + LOCAL PC + SECURITY)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
    Video, Search, Instagram, Facebook, Linkedin,
    Copy, Save, Youtube, RefreshCw, Target,
    Brain, MonitorPlay, Clapperboard, Paperclip,
    SplitSquareHorizontal, Microscope, Image as ImageIcon, MousePointerClick, Layers,
    AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', brandColor: 'bg-cyan-900/20' },
    { id: 'Reels', icon: Instagram, label: 'Instagram Reels', color: 'text-pink-500', brandColor: 'bg-pink-900/20' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', brandColor: 'bg-red-900/20' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', brandColor: 'bg-blue-900/20' },
    { id: 'Facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', brandColor: 'bg-blue-900/20' }
];

export const TitanViral: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, userProfile, refreshProfile } = useAuth();

    // Estados
    const [url, setUrl] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('teleprompter');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [finalCost, setFinalCost] = useState(0);
    const [activeHookIndex, setActiveHookIndex] = useState(0);
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Contexto
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('');
    const [selectedKbId, setSelectedKbId] = useState('');

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            try {
                const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user.id);
                if (exp) setExperts(exp);
                const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if (av) setAvatars(av);
                const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user.id);
                if (docs) setKnowledgeBases(docs.map((d: any) => ({ id: d.id, title: d.title || "Doc" })));
                
                if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
                if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
            } catch (e) { console.error(e); }
        };
        fetchProfiles();
        console.log('🚀 TITAN ENGINE V102.2 - FULL POWER DEPLOYED');
    }, [user, userProfile]);

    const handleLocalVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setIsProcessing(true);
        setUploadProgress(10);
        try {
            const fileName = `${user.id}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage.from('videos-analisis').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('videos-analisis').getPublicUrl(fileName);
            setUploadProgress(100);
            setUrl(publicUrl);
            setTimeout(() => { setStep(2); setIsProcessing(false); setUploadProgress(0); }, 500);
        } catch (error: any) {
            alert("Error subiendo archivo: " + error.message);
            setIsProcessing(false);
        }
    };

    const handleScan = () => { if (url) setStep(2); };

    const normalizeBackendResponse = (rawData: any): any => {
        const data = rawData.generatedData || rawData;
        const ensureString = (val: any) => {
            if (!val) return "";
            if (typeof val === 'object') return val.content || val.script || val.text || JSON.stringify(val);
            return String(val);
        };

        let hooks = [];
        if (data.hook_variations && Array.isArray(data.hook_variations)) {
            hooks = data.hook_variations.map(h => ({ ...h, script: ensureString(h.script) }));
        } else {
            const s = ensureString(data.teleprompter_script || data.script_body || "Listo");
            hooks = [{ type: "Gancho Principal", script: s.split('\n')[0] }];
        }

        return {
            hook_variations: hooks,
            script_body: ensureString(data.script_body || data.teleprompter_script),
            thumbnail_concept: {
                visual_description: ensureString(data.thumbnail_concept?.visual_description || "Miniatura impactante"),
                text_overlay: ensureString(data.thumbnail_concept?.text_overlay || "STOP SCROLL")
            },
            visual_plan: data.visual_plan || [],
            viral_analysis: {
                winning_idea: ensureString(data.viral_analysis?.winning_idea || "Idea procesada"),
                viral_psychology: ensureString(data.viral_analysis?.viral_psychology || "Basada en retención emocional")
            },
            structural_breakdown: data.structural_breakdown || []
        };
    };

    const handleRecreate = async () => {
        if (!user) return;
        setIsProcessing(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url, selectedMode: 'recreate', platform: selectedPlatform.id.toLowerCase(),
                    expertId: selectedExpertId, avatarId: selectedAvatarId, knowledgeBaseId: selectedKbId, estimatedCost: 5
                },
            });
            if (error) throw error;
            setResult(normalizeBackendResponse(data));
            setFinalCost(data.finalCost || 5);
            if (refreshProfile) refreshProfile();
            setStep(3);
        } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.from('viral_recreations').insert({
                user_id: user?.id, original_url: url, platform: selectedPlatform.label, recreation_data: result
            });
            if (error) throw error;
            alert("✅ Guardado en tu historial.");
        } catch (e: any) { alert(e.message); } finally { setSaving(false); }
    };

    const getCurrentFullScript = () => `${result?.hook_variations[activeHookIndex]?.script}\n\n${result?.script_body}`;

    // --- RENDERIZADO ---
    if (step === 1) return (
        <div className="max-w-4xl mx-auto p-8 space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-black text-white text-center mb-8">Ingeniería Viral <span className="text-indigo-500">Master</span></h1>
            <div className="grid grid-cols-5 gap-4">
                {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => setSelectedPlatform(p)} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${selectedPlatform.id === p.id ? 'border-indigo-500 bg-indigo-900/20 text-white' : 'border-gray-800 text-gray-500'}`}>
                        <p.icon size={24}/> <span className="text-xs font-bold">{p.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Link de video o sube archivo..." className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 pr-12 text-white outline-none"/>
                    <button onClick={() => fileInputRef.current?.click()} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400"><Paperclip size={20}/></button>
                </div>
                <button onClick={handleScan} className="bg-indigo-600 text-white px-8 rounded-xl font-bold flex items-center gap-2">
                    {isProcessing ? <RefreshCw className="animate-spin"/> : <Search/>} SCAN
                </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleLocalVideoUpload} accept="video/*" className="hidden"/>
        </div>
    );

    if (step === 2) return (
        <div className="max-w-2xl mx-auto p-8 space-y-6 bg-gray-900/50 border border-gray-800 rounded-3xl mt-10">
            <h2 className="text-xl font-bold text-white text-center">Configura tu Recreación</h2>
            <div className="space-y-4">
                <select value={selectedExpertId} onChange={e => setSelectedExpertId(e.target.value)} className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none"><option value="">Experto (Voz)</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select value={selectedAvatarId} onChange={e => setSelectedAvatarId(e.target.value)} className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none"><option value="">Avatar (Público)</option>{avatars.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
            </div>
            <button onClick={handleRecreate} disabled={isProcessing} className="w-full bg-indigo-600 py-4 rounded-xl text-white font-black">
                {isProcessing ? "DESCODIFICANDO ADN..." : "RECONSTRUIR YA"}
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
            <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <h1 className="text-2xl font-black text-white">RESULTADO MAESTRO</h1>
                <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">Nuevo</button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"> <Save size={14}/> Guardar</button>
                </div>
            </div>

            <div className="flex gap-2 border-b border-gray-800">
                {[{id:'analysis', label:'Análisis', icon:Brain}, {id:'teleprompter', label:'Guion', icon:MonitorPlay}, {id:'visual', label:'Plan Visual', icon:Clapperboard}, {id:'structure', label:'Estructura', icon:SplitSquareHorizontal}].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-6 py-3 font-bold text-sm flex items-center gap-2 ${activeTab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                        <t.icon size={16}/> {t.label}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {activeTab === 'analysis' && result && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 rounded-3xl border border-indigo-500/30">
                            <h3 className="text-indigo-400 font-black text-xs uppercase mb-4 tracking-widest">Idea Ganadora</h3>
                            <p className="text-3xl font-bold text-white">"{result.viral_analysis.winning_idea}"</p>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
                            <h3 className="text-gray-500 font-black text-xs uppercase mb-4 tracking-widest">Psicología</h3>
                            <p className="text-gray-300 text-lg">{result.viral_analysis.viral_psychology}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'teleprompter' && result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.hook_variations.map((hook: any, idx: number) => (
                                <button key={idx} onClick={() => setActiveHookIndex(idx)} className={`p-5 rounded-xl text-left border ${activeHookIndex === idx ? 'bg-indigo-600 border-indigo-500' : 'bg-black border-gray-800'}`}>
                                    <div className="text-[10px] font-black uppercase text-gray-500 mb-2">{hook.type}</div>
                                    <div className="text-sm text-white">"{hook.script}"</div>
                                </button>
                            ))}
                        </div>
                        <div className="bg-black border border-gray-800 rounded-3xl p-10 relative">
                            <button onClick={() => {navigator.clipboard.writeText(getCurrentFullScript()); alert("✅");}} className="absolute top-6 right-6 text-gray-400 hover:text-white"><Copy size={14}/></button>
                            <div className="max-w-3xl mx-auto space-y-8">
                                <p className="text-indigo-400 text-2xl font-black">{result.hook_variations[activeHookIndex]?.script}</p>
                                <p className="text-gray-300 text-xl leading-loose whitespace-pre-wrap">{result.script_body}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visual' && result && (
                    <div className="space-y-6">
                        <div className="bg-pink-900/10 border border-pink-500/20 rounded-2xl p-8 flex gap-8 items-center">
                            <ImageIcon size={48} className="text-pink-400"/>
                            <div>
                                <h4 className="text-pink-300 font-bold text-xs uppercase mb-2">Miniatura</h4>
                                <p className="text-white text-lg mb-2">{result.thumbnail_concept.visual_description}</p>
                                <p className="text-pink-400 font-black text-xl">TEXTO: "{result.thumbnail_concept.text_overlay}"</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-black text-gray-500 text-xs">
                                    <tr><th className="p-5">Tiempo</th><th className="p-5">Visual</th><th className="p-5">Audio Ref</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {result.visual_plan.map((row: any, i: number) => (
                                        <tr key={i}>
                                            <td className="p-5 text-indigo-400 font-mono text-xs">{row.time}</td>
                                            <td className="p-5 text-white text-sm">{row.visual_instruction}</td>
                                            <td className="p-5 text-gray-500 text-xs italic">{row.audio_ref}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'structure' && result && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="grid grid-cols-2 bg-black p-5 text-xs text-gray-500">
                            <div>Video Original</div>
                            <div className="text-green-500">Tu Adaptación</div>
                        </div>
                        <div className="divide-y divide-gray-800">
                            {result.structural_breakdown.map((b: any, i: number) => (
                                <div key={i} className="grid grid-cols-2">
                                    <div className="p-6 text-sm text-gray-500 italic border-r border-gray-800">"{b.original_segment || b.original}"</div>
                                    <div className="p-6 text-sm text-white font-medium">{b.adapted_segment || b.adaptation}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};