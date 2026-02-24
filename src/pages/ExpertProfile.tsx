import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
    Save, Plus, Trash2, MessageSquare, Zap, Search, RefreshCw, Send,
    User, Users, BookOpen, Fingerprint, Mic, Globe, ShieldCheck, Activity,
    AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Award,
    Star, Target, Trophy, Sparkles, Lightbulb, Eye, Brain, Rocket,
    TrendingUp, DollarSign, Crown, Flame, Crosshair, Sliders, Wifi,
    Map, BarChart2, Network
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

const ExpertAuditReportV2 = ({ data }: { data: any }) => {
  if (!data || !data.auditoria_calidad) {
    return (
        <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-200 text-xs">
            <p className="font-bold mb-1">Resultado recibido</p>
            <pre className="text-[10px] opacity-70 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
  }

  const { auditoria_calidad, analisis_campo_por_campo, perfil_experto_optimizado, analisis_mercado, analisis_competencia, diagnostico_posicionamiento, sistema_diferenciacion, score_estrategico, plan_accion_90_dias, siguiente_paso } = data;

  const getStatusColor = (status: string) => {
    if (status?.includes('Magnética') || status?.includes('Único') || status?.includes('🟢'))
        return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (status?.includes('Común') || status?.includes('🟡'))
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    if (status?.includes('Débil') || status?.includes('🔴'))
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const getScoreColor = (score: number) => {
    if (score >= 96) return 'text-purple-400';
    if (score >= 86) return 'text-cyan-400';
    if (score >= 71) return 'text-green-400';
    if (score >= 51) return 'text-yellow-400';
    if (score >= 31) return 'text-orange-400';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/20 to-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                <Award size={12}/> NIVEL DE AUTORIDAD
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-5xl font-black ${getScoreColor(auditoria_calidad.score_global)}`}>
                  {auditoria_calidad.score_global}
                </span>
                <span className="text-gray-600 text-xl font-bold">/100</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown size={16} className={getScoreColor(auditoria_calidad.score_global)}/>
                <p className="text-white font-black text-sm tracking-wide">{auditoria_calidad.nivel_autoridad}</p>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl max-w-[200px] backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1 mb-2 text-indigo-400">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Titan Strategy</span>
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">"{auditoria_calidad.veredicto_brutal}"</p>
            </div>
          </div>
          {auditoria_calidad.desglose_puntos && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                { label: 'Historia', key: 'historia', max: 25, color: 'text-cyan-400' },
                { label: 'Mecanismo', key: 'mecanismo', max: 30, color: 'text-purple-400' },
                { label: 'Proof', key: 'proof', max: 20, color: 'text-green-400' },
                { label: 'Enemigo', key: 'enemigo', max: 15, color: 'text-red-400' },
                { label: 'Promesa', key: 'promesa', max: 10, color: 'text-yellow-400' },
              ].map(item => (
                <div key={item.key} className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                  <span className="text-[9px] text-gray-500 uppercase block mb-1">{item.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-black ${item.color}`}>{auditoria_calidad.desglose_puntos[item.key]}</span>
                    <span className="text-[10px] text-gray-600">/{item.max}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {auditoria_calidad.penalizaciones_aplicadas?.length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-3">
              <h4 className="text-red-400 text-[10px] font-black uppercase mb-2">⚠️ Penalizaciones</h4>
              <ul className="space-y-1">
                {auditoria_calidad.penalizaciones_aplicadas.map((pen: string, i: number) => (
                  <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                    <XCircle size={12} className="shrink-0 mt-0.5"/><span>{pen}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest pl-1">
          <Activity size={12}/> Auditoría Táctica
        </h4>
        {analisis_campo_por_campo?.map((item: any, idx: number) => (
          <div key={idx} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-bold text-white text-xs">{item.campo}</h5>
              <div className="flex items-center gap-2">
                {item.score_numerico !== undefined && <span className="text-xs font-black text-gray-400">{item.score_numerico}/10</span>}
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getStatusColor(item.calificacion)}`}>
                  {item.calificacion?.split(' ')[1] || item.calificacion}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {item.lo_que_escribio && (
                <div className="relative pl-3 border-l-2 border-red-500/20">
                  <span className="text-[9px] text-red-400 font-bold block mb-0.5 uppercase">Lo que escribiste</span>
                  <p className="text-gray-400 text-[10px] italic">"{item.lo_que_escribio}"</p>
                </div>
              )}
              <div className="relative pl-3 border-l-2 border-orange-500/20 bg-orange-900/5 py-1 rounded-r-lg">
                <span className="text-[9px] text-orange-400 font-bold block mb-0.5 uppercase">Debilidad Detectada</span>
                <p className="text-[10px] text-orange-300 flex items-start gap-1 leading-relaxed">
                  <XCircle size={10} className="shrink-0 mt-0.5"/> {item.critica}
                </p>
              </div>
              <div className="relative pl-3 border-l-2 border-green-500/40 bg-green-500/5 py-2 px-1 rounded-r-lg">
                <span className="text-[9px] text-green-400 font-bold block mb-1 uppercase">✨ Estrategia High-Ticket</span>
                <p className="text-gray-200 text-[10px] font-medium leading-relaxed">"{item.correccion_maestra}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCORE ESTRATÉGICO */}
      {score_estrategico && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest">
            <BarChart2 size={12}/> Score Estratégico
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'claridad_posicionamiento', label: 'Claridad', color: 'text-cyan-400' },
              { key: 'diferenciacion', label: 'Diferenciación', color: 'text-purple-400' },
              { key: 'autoridad_percibida', label: 'Autoridad', color: 'text-green-400' },
              { key: 'ventaja_competitiva', label: 'Ventaja', color: 'text-yellow-400' },
              { key: 'coherencia_estrategica', label: 'Coherencia', color: 'text-indigo-400' },
              { key: 'nivel_dominancia', label: 'Dominancia', color: 'text-red-400' },
            ].map(item => (
              <div key={item.key} className="bg-black/40 p-2.5 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-[9px] text-gray-500 uppercase">{item.label}</span>
                <span className={`text-sm font-black ${score_estrategico[item.key] >= 70 ? item.color : 'text-red-400'}`}>
                  {score_estrategico[item.key]}/100
                </span>
              </div>
            ))}
          </div>
          {score_estrategico.mejoras_urgentes?.length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-3 space-y-2">
              <span className="text-[9px] text-red-400 font-black uppercase">⚡ Mejoras Urgentes</span>
              {score_estrategico.mejoras_urgentes.map((m: any, i: number) => (
                <div key={i} className="text-[10px] text-gray-300">
                  <span className="text-red-400 font-bold">{m.dimension}: </span>{m.accion_concreta}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANÁLISIS DE MERCADO */}
      {analisis_mercado && (
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-2 tracking-widest">
            <TrendingUp size={12}/> Análisis de Mercado
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] text-gray-500 uppercase">Saturación:</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${analisis_mercado.nivel_saturacion === 'crítico' ? 'bg-red-500/20 text-red-400' : analisis_mercado.nivel_saturacion === 'alto' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {analisis_mercado.nivel_saturacion?.toUpperCase()}
            </span>
          </div>
          {analisis_mercado.vacios_estrategicos?.length > 0 && (
            <div>
              <span className="text-[9px] text-green-400 font-black uppercase block mb-1">✅ Vacíos Estratégicos Disponibles</span>
              {analisis_mercado.vacios_estrategicos.map((v: string, i: number) => (
                <p key={i} className="text-[10px] text-gray-300 flex items-start gap-1 mb-1"><CheckCircle2 size={10} className="text-green-500 shrink-0 mt-0.5"/>{v}</p>
              ))}
            </div>
          )}
          {analisis_mercado.mensajes_saturados?.length > 0 && (
            <div>
              <span className="text-[9px] text-red-400 font-black uppercase block mb-1">🚫 Mensajes Saturados (Evitar)</span>
              {analisis_mercado.mensajes_saturados.map((m: string, i: number) => (
                <p key={i} className="text-[10px] text-gray-400 flex items-start gap-1 mb-1"><XCircle size={10} className="text-red-500 shrink-0 mt-0.5"/>{m}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIFERENCIACIÓN ESTRATÉGICA */}
      {sistema_diferenciacion && (
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-2 tracking-widest">
            <Crosshair size={12}/> Sistema de Diferenciación
          </h4>
          {[
            { key: 'angulo_unico_ataque', label: '⚡ Ángulo Único de Ataque', color: 'text-yellow-300' },
            { key: 'promesa_optimizada', label: '🎯 Promesa Optimizada', color: 'text-green-300' },
            { key: 'enemigo_estrategico_optimo', label: '🔥 Enemigo Estratégico', color: 'text-red-300' },
            { key: 'postura_distintiva', label: '🏛️ Postura Distintiva', color: 'text-cyan-300' },
          ].map(item => sistema_diferenciacion[item.key] && (
            <div key={item.key} className="bg-black/40 p-3 rounded-lg border border-white/5">
              <span className={`text-[9px] font-black uppercase block mb-1 ${item.color}`}>{item.label}</span>
              <p className="text-gray-200 text-[10px] leading-relaxed">{sistema_diferenciacion[item.key]}</p>
            </div>
          ))}
        </div>
      )}

      {perfil_experto_optimizado && (
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-5">
          <h4 className="text-center text-xs font-black text-indigo-300 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Crown size={14}/> MARCA PERSONAL OPTIMIZADA
          </h4>
          <div className="space-y-3">
            {perfil_experto_optimizado?.elevator_pitch && (
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Elevator Pitch (15seg)</span>
                <p className="text-white text-xs font-bold leading-relaxed">{perfil_experto_optimizado.elevator_pitch}</p>
              </div>
            )}
            {perfil_experto_optimizado?.bio_magnetica && (
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Bio Magnética</span>
                <p className="text-gray-300 text-[10px] leading-relaxed whitespace-pre-line">{perfil_experto_optimizado.bio_magnetica}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {siguiente_paso && (
        <div className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 border border-yellow-500/20 rounded-xl p-5 text-center">
          <h4 className="text-yellow-400 text-xs font-black uppercase mb-3 flex items-center justify-center gap-2">
            <ArrowRight size={14}/> Tu Siguiente Paso HOY
          </h4>
          <p className="text-sm text-white font-medium leading-relaxed">{siguiente_paso}</p>
        </div>
      )}
    </div>
  );
};

const ExpertChatHistory = ({ messages }: { messages: any[] }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
        <MessageSquare size={48} className="mb-4"/>
        <p className="text-sm text-center font-medium max-w-[240px] leading-relaxed">
          Prueba la voz de tu experto
          <span className="block mt-2 text-xs text-gray-700">Haz preguntas técnicas a tu audiencia</span>
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg">
              <p className="text-xs font-medium leading-relaxed">{msg.question}</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint size={12} className="text-indigo-400"/>
                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider">Experto IA</span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Slider component
const SliderField = ({ label, value, min = 1, max = 5, onChange, colorClass = 'accent-indigo-500', hint }: {
  label: string; value: number; min?: number; max?: number;
  onChange: (v: number) => void; colorClass?: string; hint?: string;
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="text-[10px] font-black text-gray-500 uppercase">{label}</label>
      <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded">{value}/{max}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${colorClass}`}
    />
    {hint && <p className="text-[10px] text-gray-600 mt-1 italic">{hint}</p>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

type TabType = 'identity' | 'transformation' | 'expert_authority' | 'adn_verbal' | 'proof' | 'mechanism' | 'networks';

const DEFAULT_NETWORK_CONFIG = {
  instagram: { tone: 'auto', depth: 'auto', aggressiveness: 'auto', close_type: 'auto' },
  tiktok: { tone: 'auto', depth: 'auto', aggressiveness: 'auto', close_type: 'auto' },
  youtube: { tone: 'auto', depth: 'auto', aggressiveness: 'auto', close_type: 'auto' },
  linkedin: { tone: 'auto', depth: 'auto', aggressiveness: 'auto', close_type: 'auto' },
};

const DEFAULT_FORM = {
  // IDENTIDAD
  name: '',
  niche: '',
  sub_niche: '',
  market_sophistication: 'aware',
  market_awareness: 'aware',
  mission: '',
  origin_story: '',
  unique_positioning: '',
  enemy: '',
  main_objective: 'autoridad',

  // TRANSFORMACIÓN
  transformation_promise: '',
  point_a: '',
  point_b: '',
  tangible_result: '',
  emotional_result: '',

  // AUTORIDAD
  authority_level: 'practicante',
  authority_type: 'practica',
  depth_level: 'media',
  proof_type: 'casos_reales',
  mental_territory: '',
  prohibitions: JSON.stringify({
    promesas_rapidas: false,
    simplificaciones_extremas: false,
    ataques_personales: false,
    opinion_sin_prueba: false,
    contenido_superficial: false,
  }),
  max_controversy: 3,
  max_personal_exposure: 3,
  confrontation_level: 3,
  polarization_level: 2,

  // ADN VERBAL
  verbal_aggressiveness: 2,
  lexical_sophistication: 3,
  storytelling_ratio: 50,
  narrative_rhythm: 'medio',
  phrase_type: 'mixtas',
  metaphor_level: 2,
  forcefulness_level: 3,
  emotionality_level: 3,
  technicality_level: 2,

  // VOZ
  tone: '',
  key_vocabulary: '',
  personality_archetype: '',
  content_pillar_1: '',
  content_pillar_2: '',

  // PROOF
  case_studies: '',
  certifications: '',
  media_appearances: '',
  client_results: '',
  testimonials: '',

  // MECANISMO
  framework: '',
  mechanism_name: '',
  methodology_steps: '',

  // REDES
  network_config: JSON.stringify(DEFAULT_NETWORK_CONFIG),
};

export const ExpertProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();

    const [expertsList, setExpertsList] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [aiMode, setAiMode] = useState<'test' | 'xray' | 'amplify'>('test');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [auditResult, setAuditResult] = useState<any>(null);
    const [contentIdeas, setContentIdeas] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedTestAvatarId, setSelectedTestAvatarId] = useState<string>('');
    const [selectedTestKbId, setSelectedTestKbId] = useState<string>('');

    const [activeTab, setActiveTab] = useState<TabType>('identity');

    const COSTO_XRAY = 2;
    const COSTO_TEST = 1;
    const COSTO_AMPLIFY = 3;

    const [formData, setFormData] = useState({ ...DEFAULT_FORM });

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const getPlanLimit = () => {
        const tier = userProfile?.tier || 'free';
        if (tier === 'esencial') return 1;
        if (tier === 'pro') return 3;
        if (tier === 'agency') return 10;
        return 1;
    };

    const updateForm = (fields: Partial<typeof DEFAULT_FORM>) =>
        setFormData(prev => ({ ...prev, ...fields }));

    const parseProhibitions = () => {
        try { return JSON.parse(formData.prohibitions || '{}'); }
        catch { return {}; }
    };

    const parseNetworkConfig = () => {
        try { return JSON.parse(formData.network_config || '{}'); }
        catch { return { ...DEFAULT_NETWORK_CONFIG }; }
    };

    // ── Effects ─────────────────────────────────────────────────────────────────
    useEffect(() => {
    if (user?.id) { fetchExperts(); fetchContextData(); }
}, [user?.id]);

    // ── Data fetchers ────────────────────────────────────────────────────────────
    const fetchExperts = async (forceSelect = false) => {
        try {
            const { data } = await supabase.from('expert_profiles').select('*').eq('user_id', user?.id);
            if (data) {
                setExpertsList(data);
                // Solo seleccionar automáticamente si NO hay un experto ya seleccionado
                // o si se fuerza (ej: después de guardar)
                const yaHaySeleccionado = selectedExpertId !== null;
                if (!yaHaySeleccionado || forceSelect) {
                    if (userProfile?.active_expert_id) {
                        const active = data.find(e => e.id === userProfile.active_expert_id);
                        if (active) selectExpert(active);
                    } else if (data.length > 0) {
                        selectExpert(data[0]);
                    }
                }
            }
        } catch (e) { console.error(e); }
    };

    const fetchContextData = async () => {
        try {
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if (av) setAvatars(av);
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));
            if (userProfile?.active_avatar_id) setSelectedTestAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    // ── Select expert ────────────────────────────────────────────────────────────
    const selectExpert = (expert: any) => {
        setSelectedExpertId(expert.id);
        setChatHistory([]);
        setAuditResult(null);
        setContentIdeas(null);

        const netConfig = (() => {
            try {
                const raw = expert.network_config;
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                return JSON.stringify(parsed || DEFAULT_NETWORK_CONFIG);
            } catch { return JSON.stringify(DEFAULT_NETWORK_CONFIG); }
        })();

        const prohibitions = (() => {
            try {
                const raw = expert.prohibitions;
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                return JSON.stringify(parsed || {
                    promesas_rapidas: false, simplificaciones_extremas: false,
                    ataques_personales: false, opinion_sin_prueba: false, contenido_superficial: false,
                });
            } catch { return DEFAULT_FORM.prohibitions; }
        })();

        setFormData({
            name: expert.name || '',
            niche: expert.niche || '',
            sub_niche: expert.sub_niche || '',
            market_sophistication: expert.market_sophistication || 'aware',
            market_awareness: expert.market_awareness || 'aware',
            mission: expert.mission || '',
            origin_story: expert.origin_story || '',
            unique_positioning: expert.unique_positioning || '',
            enemy: expert.enemy || '',
            main_objective: expert.main_objective || 'autoridad',
            transformation_promise: expert.transformation_promise || '',
            point_a: expert.point_a || '',
            point_b: expert.point_b || '',
            tangible_result: expert.tangible_result || '',
            emotional_result: expert.emotional_result || '',
            authority_level: expert.authority_level || 'practicante',
            authority_type: expert.authority_type || 'practica',
            depth_level: expert.depth_level || 'media',
            proof_type: expert.proof_type || 'casos_reales',
            mental_territory: expert.mental_territory || '',
            prohibitions,
            max_controversy: expert.max_controversy ?? 3,
            max_personal_exposure: expert.max_personal_exposure ?? 3,
            confrontation_level: expert.confrontation_level ?? 3,
            polarization_level: expert.polarization_level ?? 2,
            verbal_aggressiveness: expert.verbal_aggressiveness ?? 2,
            lexical_sophistication: expert.lexical_sophistication ?? 3,
            storytelling_ratio: expert.storytelling_ratio ?? 50,
            narrative_rhythm: expert.narrative_rhythm || 'medio',
            phrase_type: expert.phrase_type || 'mixtas',
            metaphor_level: expert.metaphor_level ?? 2,
            forcefulness_level: expert.forcefulness_level ?? 3,
            emotionality_level: expert.emotionality_level ?? 3,
            technicality_level: expert.technicality_level ?? 2,
            tone: expert.tone || '',
            key_vocabulary: expert.key_vocabulary || '',
            personality_archetype: expert.personality_archetype || '',
            content_pillar_1: expert.content_pillar_1 || '',
            content_pillar_2: expert.content_pillar_2 || '',
            case_studies: expert.case_studies || '',
            certifications: expert.certifications || '',
            media_appearances: expert.media_appearances || '',
            client_results: expert.client_results || '',
            testimonials: expert.testimonials || '',
            framework: expert.framework || '',
            mechanism_name: expert.mechanism_name || '',
            methodology_steps: expert.methodology_steps || '',
            network_config: netConfig,
        });
    };

    const handleNewExpert = () => {
        const limit = getPlanLimit();
        if (expertsList.length >= limit) return alert(`⚠️ Límite de ${limit} expertos alcanzado.`);
        setSelectedExpertId(null);
        setChatHistory([]);
        setAuditResult(null);
        setContentIdeas(null);
        setFormData({ ...DEFAULT_FORM });
    };

    // ── Save ─────────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        // VALIDACIÓN OLIMPO
        const errors: string[] = [];
        if (!formData.name) errors.push('Nombre de marca');
        if (!formData.niche) errors.push('Nicho específico');
        if (!formData.mission) errors.push('Misión única (UVP)');
        if (!formData.unique_positioning) errors.push('Posicionamiento único diferenciador');
        if (!formData.transformation_promise && !formData.tangible_result)
            errors.push('Promesa de transformación o resultado tangible');
        if (!formData.mechanism_name && !formData.framework)
            errors.push('Mecanismo propietario o framework');

        if (errors.length > 0) {
            return alert(`⚠️ Perfil incompleto. Completa antes de guardar:\n\n• ${errors.join('\n• ')}`);
        }

        setLoading(true);
        try {
            const dataToSave = { ...formData, user_id: user?.id };
            let result;
            if (selectedExpertId) {
                result = await supabase.from('expert_profiles').update(dataToSave).eq('id', selectedExpertId).select().single();
            } else {
                result = await supabase.from('expert_profiles').insert(dataToSave).select().single();
            }
            if (result.error) throw result.error;

            await supabase.from('profiles').update({ active_expert_id: result.data.id }).eq('id', user?.id);
            if (refreshProfile) refreshProfile();
            await fetchExperts(true);
            alert('✅ Perfil de experto guardado exitosamente');
        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!selectedExpertId || !confirm("¿Borrar este perfil?")) return;
        try {
            if (userProfile?.active_expert_id === selectedExpertId) {
                await supabase.from('profiles').update({ active_expert_id: null }).eq('id', user?.id);
            }
            await supabase.from('expert_profiles').delete().eq('id', selectedExpertId);
            handleNewExpert();
            await fetchExperts();
            if (refreshProfile) refreshProfile();
        } catch (e) { console.error(e); }
    };

    // ── AI Actions ───────────────────────────────────────────────────────────────
    const handleXRayAuthority = async () => {
        if (!formData.niche || !formData.mission) return alert("Define Nicho y Misión.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_XRAY) return alert("Saldo insuficiente.");
        setIsProcessing(true);
        setAuditResult(null);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: { selectedMode: 'audit_expert', transcript: JSON.stringify(formData), avatarId: selectedTestAvatarId, estimatedCost: COSTO_XRAY },
            });
            if (error) throw error;
            setAuditResult(data.generatedData || data);
            if (refreshProfile) refreshProfile();
        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsProcessing(false); }
    };

    const handleVoiceTest = async () => {
        if (!chatInput) return;
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_TEST) return alert("Saldo insuficiente.");
        setIsProcessing(true);
        const userMsg = chatInput;
        setChatInput('');
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_expert',
                    transcript: `Usuario pregunta: "${userMsg}". \nContexto del Experto: ${JSON.stringify(formData)}`,
                    avatarId: selectedTestAvatarId,
                    knowledgeBaseId: selectedTestKbId,
                    estimatedCost: COSTO_TEST,
                },
            });
            if (error) throw error;
            const answer = data.generatedData?.answer || data.generatedData?.text_output || "Sin respuesta";
            setChatHistory(prev => [...prev, { question: userMsg, answer }]);
            if (refreshProfile) refreshProfile();
        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsProcessing(false); }
    };

    const handleContentAmplifier = async () => {
        if (!formData.name) return alert("Define el nombre del experto.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AMPLIFY) return alert("Saldo insuficiente.");
        setIsProcessing(true);
        setContentIdeas(null);
        try {
            const contentPrompt = `
Genera ideas de contenido viral para este perfil de experto OLIMPO:
OBJETIVO PRINCIPAL: ${formData.main_objective}
NICHO: ${formData.niche} / ${formData.sub_niche}
POSICIONAMIENTO: ${formData.unique_positioning}
PUNTO A → B: "${formData.point_a}" → "${formData.point_b}"
SOFISTICACIÓN DEL MERCADO: ${formData.market_sophistication}
NIVEL DE AUTORIDAD: ${formData.authority_level}
CONFRONTACIÓN: ${formData.confrontation_level}/5
POLARIZACIÓN: ${formData.polarization_level}/5
MECANISMO: ${formData.mechanism_name}

Responde con JSON: { "titulos_virales": [], "frameworks_ensenanza": [], "hooks_por_objetivo": [], "ideas_por_red": {"instagram":[],"tiktok":[],"linkedin":[]} }
            `;
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: { selectedMode: 'chat_expert', transcript: contentPrompt, avatarId: selectedTestAvatarId, knowledgeBaseId: selectedTestKbId, estimatedCost: COSTO_AMPLIFY },
            });
            if (error) throw error;
            let ideas;
            try {
                const rawAnswer = data.generatedData?.answer || data.generatedData?.text_output || JSON.stringify(data.generatedData);
                ideas = JSON.parse(rawAnswer);
            } catch {
                ideas = { raw: data.generatedData?.answer || "No se generaron ideas" };
            }
            setContentIdeas(ideas);
            if (refreshProfile) refreshProfile();
        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsProcessing(false); }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════════

    const tabs: { id: TabType; label: string; icon: any; color: string }[] = [
        { id: 'identity',       label: 'Identidad',     icon: Globe,      color: 'bg-indigo-600' },
        { id: 'transformation', label: 'Transform.',    icon: Map,        color: 'bg-cyan-600' },
        { id: 'expert_authority',label:'Autoridad',     icon: ShieldCheck, color: 'bg-red-600' },
        { id: 'adn_verbal',     label: 'ADN Verbal',    icon: Sliders,    color: 'bg-violet-600' },
        { id: 'proof',          label: 'Prueba',        icon: Trophy,     color: 'bg-green-600' },
        { id: 'mechanism',      label: 'Mecanismo',     icon: Zap,        color: 'bg-yellow-600' },
        { id: 'networks',       label: 'Redes',         icon: Network,    color: 'bg-pink-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
                        <Crown className="text-indigo-500" fill="currentColor" size={36}/>
                        AUTHORITY FORGE
                    </h1>
                    <p className="text-gray-400 text-base font-medium mt-1">
                        Sistema OLIMPO — Marca personal magnética que atrae clientes premium
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        onChange={(e) => { const s = expertsList.find(ex => ex.id === e.target.value); if(s) selectExpert(s); }}
                        value={selectedExpertId || ""}
                        className="flex-1 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                        <option value="" disabled>Cargar Experto...</option>
                        {expertsList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <button onClick={handleNewExpert} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20">
                        <Plus size={20}/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── LEFT: Form ──────────────────────────────────────────────── */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Tab nav */}
                    <div className="flex gap-1.5 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                                    activeTab === tab.id ? `${tab.color} text-white shadow-lg` : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <tab.icon size={10}/> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[520px]">

                        {/* ── TAB: IDENTIDAD ────────────────────────────────────── */}
                        {activeTab === 'identity' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Globe size={20} className="text-indigo-400"/> Posicionamiento de Mercado
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nombre de Marca *</label>
                                        <input type="text" value={formData.name} onChange={e => updateForm({ name: e.target.value })} className="input-viral" placeholder="Ej: Dr. Finanzas"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nicho Principal *</label>
                                        <input type="text" value={formData.niche} onChange={e => updateForm({ niche: e.target.value })} className="input-viral" placeholder="Ej: Finanzas personales para médicos"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block">Sub-nicho específico</label>
                                    <input type="text" value={formData.sub_niche} onChange={e => updateForm({ sub_niche: e.target.value })} className="input-viral border-indigo-500/20" placeholder="Ej: Inversión inmobiliaria para residentes de primer año"/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Sofisticación del Mercado</label>
                                        <select value={formData.market_sophistication} onChange={e => updateForm({ market_sophistication: e.target.value })} className="input-viral">
                                            <option value="unaware">🌑 No saben que tienen el problema</option>
                                            <option value="aware">🌓 Saben el problema, no soluciones</option>
                                            <option value="solution_aware">🌔 Conocen soluciones, no te conocen</option>
                                            <option value="sophisticated">🌕 Lo han visto todo. Exige diferenciación extrema</option>
                                        </select>
                                        <p className="text-[10px] text-gray-600 mt-1 italic">Altera el ángulo de tus hooks automáticamente</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Conciencia del Avatar</label>
                                        <select value={formData.market_awareness} onChange={e => updateForm({ market_awareness: e.target.value })} className="input-viral">
                                            <option value="unaware">❓ Inconsciente (no sabe que te necesita)</option>
                                            <option value="aware">💡 Consciente del problema</option>
                                            <option value="solution_aware">🔍 Buscando solución activamente</option>
                                            <option value="sophisticated">🎯 Listo para comprar si confía en ti</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block flex items-center gap-2">
                                        <ShieldCheck size={12}/> Misión Única (UVP) *
                                    </label>
                                    <textarea value={formData.mission} onChange={e => updateForm({ mission: e.target.value })} className="textarea-viral h-24 border-indigo-500/20" placeholder="Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN] mediante [MÉTODO]..."/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Posicionamiento Único *</label>
                                        <input type="text" value={formData.unique_positioning} onChange={e => updateForm({ unique_positioning: e.target.value })} className="input-viral" placeholder="Ej: El único coach de fitness que odia el gym"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">Enemigo Común</label>
                                        <input type="text" value={formData.enemy} onChange={e => updateForm({ enemy: e.target.value })} className="input-viral border-red-500/20" placeholder="Ej: Los gurús que venden humo sin resultados"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-cyan-400 uppercase mb-2 block">🎯 Objetivo Principal de Contenido</label>
                                    <select value={formData.main_objective} onChange={e => updateForm({ main_objective: e.target.value })} className="input-viral border-cyan-500/20">
                                        <option value="autoridad">🏛️ Autoridad — Reforzar credibilidad y posicionamiento</option>
                                        <option value="leads">🧲 Captación — Generar leads y suscriptores</option>
                                        <option value="ventas">💰 Ventas — Mover hacia decisión de compra</option>
                                        <option value="comunidad">🤝 Comunidad — Engagement, preguntas, conversación</option>
                                        <option value="viralidad">🚀 Viralidad — Máximo alcance y shares</option>
                                    </select>
                                    <p className="text-[10px] text-gray-600 mt-1 italic">Modifica tipo de hook, CTA y cierre en todos los guiones</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Historia de Origen</label>
                                    <textarea value={formData.origin_story} onChange={e => updateForm({ origin_story: e.target.value })} className="textarea-viral h-28" placeholder="Tu crisis → Tu descubrimiento → Tu transformación. Sé específico."/>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: TRANSFORMACIÓN ───────────────────────────────── */}
                        {activeTab === 'transformation' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Map size={20} className="text-cyan-400"/> Mapa de Transformación del Experto
                                </h3>
                                <p className="text-xs text-gray-500">Define el viaje completo de tu avatar. El generador usa estos datos para construir narrativa con propósito.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4">
                                        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">📍 PUNTO A — De donde viene el avatar</label>
                                        <textarea value={formData.point_a} onChange={e => updateForm({ point_a: e.target.value })} className="textarea-viral h-24 border-red-500/20" placeholder="Ej: Trabaja 60h semanales, sin tiempo para familia, sueldo fijo sin crecimiento, siente que el dinero nunca alcanza..."/>
                                    </div>
                                    <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                                        <label className="text-[10px] font-black text-green-400 uppercase mb-2 block">🎯 PUNTO B — A donde lo llevas</label>
                                        <textarea value={formData.point_b} onChange={e => updateForm({ point_b: e.target.value })} className="textarea-viral h-24 border-green-500/20" placeholder="Ej: Ingresos pasivos de €5k/mes, trabaja 20h/semana, tiempo de calidad con familia, dinero creciendo sin él..."/>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">🏆 Resultado Tangible</label>
                                        <input type="text" value={formData.tangible_result} onChange={e => updateForm({ tangible_result: e.target.value })} className="input-viral border-yellow-500/20" placeholder="Ej: €5.000/mes adicionales en 6 meses"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-purple-400 uppercase mb-2 block">💜 Resultado Emocional</label>
                                        <input type="text" value={formData.emotional_result} onChange={e => updateForm({ emotional_result: e.target.value })} className="input-viral border-purple-500/20" placeholder="Ej: Seguridad financiera, dormir tranquilo, no depender de jefes"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-green-400 uppercase mb-2 block">Promesa de Transformación Principal *</label>
                                    <input type="text" value={formData.transformation_promise} onChange={e => updateForm({ transformation_promise: e.target.value })} className="input-viral border-green-500/20" placeholder="Ej: €10k/mes en 90 días o devuelvo el doble"/>
                                </div>

                                <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
                                    <h4 className="text-indigo-400 text-xs font-black uppercase mb-3 flex items-center gap-2">
                                        <Lightbulb size={14}/> Coherencia con motores
                                    </h4>
                                    <ul className="space-y-1.5 text-[11px] text-gray-400">
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5"/>El <strong className="text-white">Generador de Guiones</strong> usa A→B para construir narrativa de transformación</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5"/>La <strong className="text-white">Ingeniería Inversa</strong> adapta promesas virales sin romper identidad</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5"/>El <strong className="text-white">Juez Viral</strong> evalúa coherencia con esta transformación antes de aprobar</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: AUTORIDAD ────────────────────────────────────── */}
                        {activeTab === 'expert_authority' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-red-400"/> Posicionamiento de Autoridad
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-red-400 uppercase mb-2 block flex items-center gap-2">
                                        <Trophy size={12}/> Nivel de Autoridad
                                    </label>
                                    <select value={formData.authority_level} onChange={e => updateForm({ authority_level: e.target.value })} className="input-viral border-red-500/20">
                                        <option value="aprendiz">🌱 Aprendiz (Comparto mi viaje de aprendizaje)</option>
                                        <option value="practicante">⚙️ Practicante (Tengo experiencia aplicada)</option>
                                        <option value="experto">🎯 Experto (Domino profundamente el tema)</option>
                                        <option value="referente">👑 Referente (Soy LA voz del nicho)</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1 italic">Define la profundidad y seguridad con la que hablas</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Autoridad</label>
                                        <select value={formData.authority_type} onChange={e => updateForm({ authority_type: e.target.value })} className="input-viral">
                                            <option value="academica">📚 Académica (Datos, estudios, ciencia)</option>
                                            <option value="practica">🛠️ Práctica (Experiencia, casos reales, resultados)</option>
                                            <option value="estrategica">🧠 Estratégica (Sistemas, frameworks, visión)</option>
                                            <option value="disruptiva">💥 Disruptiva (Rompo paradigmas, anti-sistema)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Profundidad Máxima</label>
                                        <select value={formData.depth_level} onChange={e => updateForm({ depth_level: e.target.value })} className="input-viral">
                                            <option value="superficial">☁️ Superficial (Tips rápidos, viral corto)</option>
                                            <option value="media">📊 Media (Explicaciones claras, ejemplos)</option>
                                            <option value="profunda">🔬 Profunda (Análisis detallado, matices)</option>
                                            <option value="tecnica">⚙️ Técnica (Jerga, implementación exacta)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Prueba Preferida</label>
                                        <select value={formData.proof_type} onChange={e => updateForm({ proof_type: e.target.value })} className="input-viral">
                                            <option value="datos">📊 Datos y Estadísticas</option>
                                            <option value="casos_reales">💼 Casos de Estudio Reales</option>
                                            <option value="analogias">🎭 Analogías y Metáforas</option>
                                            <option value="opinion_razonada">💭 Opinión Razonada (Thought Leadership)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">Territorio Mental™</label>
                                    <textarea value={formData.mental_territory} onChange={e => updateForm({ mental_territory: e.target.value })} className="textarea-viral h-20 border-yellow-500/20" placeholder="¿En qué ideas QUIERES SER CONOCIDO? Ej: simplicidad, anti-mitos, procesos escalables..."/>
                                    <p className="text-xs text-gray-500 mt-1 italic">Define tu marca registrada conceptual. Ej: Alex Hormozi = "Value First"</p>
                                </div>

                                {/* SLIDERS DE CONFRONTACIÓN */}
                                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5 space-y-5">
                                    <h4 className="text-red-400 text-xs font-black uppercase flex items-center gap-2">
                                        <Crosshair size={14}/> Control de Intensidad y Límites
                                    </h4>
                                    <SliderField
                                        label="Nivel de Confrontación"
                                        value={formData.confrontation_level}
                                        onChange={v => updateForm({ confrontation_level: v })}
                                        colorClass="accent-red-500"
                                        hint="1=Nunca confrontes • 3=Confronta ideas con respaldo • 5=Di lo que otros callan"
                                    />
                                    <SliderField
                                        label="Nivel de Polarización"
                                        value={formData.polarization_level}
                                        onChange={v => updateForm({ polarization_level: v })}
                                        colorClass="accent-orange-500"
                                        hint="1=Habla a todos • 3=Define tu bando • 5=Obliga a elegir bando"
                                    />
                                    <SliderField
                                        label="Polémica Máxima Permitida"
                                        value={formData.max_controversy}
                                        onChange={v => updateForm({ max_controversy: v })}
                                        colorClass="accent-orange-400"
                                        hint="El Juez Viral bloquea contenido que supere este nivel"
                                    />
                                    <SliderField
                                        label="Exposición Personal Máxima"
                                        value={formData.max_personal_exposure}
                                        onChange={v => updateForm({ max_personal_exposure: v })}
                                        colorClass="accent-pink-500"
                                        hint="1=Nunca cuentes nada personal • 5=Historias íntimas permitidas"
                                    />
                                </div>

                                {/* PROHIBICIONES */}
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                    <h4 className="text-gray-300 text-xs font-black uppercase mb-3">⚠️ Líneas Rojas de Credibilidad (Hard Stop)</h4>
                                    <p className="text-xs text-gray-500 mb-3">El generador bloquea automáticamente el contenido que viole estas reglas:</p>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'promesas_rapidas', label: 'Promesas de resultados rápidos sin esfuerzo' },
                                            { key: 'simplificaciones_extremas', label: 'Simplificar en exceso temas complejos' },
                                            { key: 'ataques_personales', label: 'Atacar personas (en vez de ideas)' },
                                            { key: 'opinion_sin_prueba', label: 'Opiniones sin respaldo o experiencia' },
                                            { key: 'contenido_superficial', label: 'Contenido viral sin valor real' }
                                        ].map(item => {
                                            const prohibitionsObj = parseProhibitions();
                                            return (
                                                <label key={item.key} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={prohibitionsObj[item.key] || false}
                                                        onChange={(e) => {
                                                            const updated = { ...prohibitionsObj, [item.key]: e.target.checked };
                                                            updateForm({ prohibitions: JSON.stringify(updated) });
                                                        }}
                                                        className="w-4 h-4 accent-red-500"
                                                    />
                                                    <span>{item.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
                                    <h4 className="text-indigo-400 text-xs font-black uppercase mb-2">💡 Coherencia Avatar ↔ Experto</h4>
                                    <p className="text-xs text-gray-300">
                                        {formData.authority_level === 'aprendiz' && "✅ Como aprendiz, comparte tu viaje. Usa historias personales de fracaso → aprendizaje."}
                                        {formData.authority_level === 'practicante' && "✅ Como practicante, muestra resultados reales sin exagerar. Prueba social es clave."}
                                        {formData.authority_level === 'experto' && "✅ Como experto, profundiza sin perder claridad. Tu audiencia espera frameworks y sistemas."}
                                        {formData.authority_level === 'referente' && "⚠️ Como referente, cada palabra importa. Tu opinión ES la verdad para tu audiencia."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: ADN VERBAL ───────────────────────────────────── */}
                        {activeTab === 'adn_verbal' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Sliders size={20} className="text-violet-400"/> ADN Verbal Configurable
                                </h3>
                                <p className="text-xs text-gray-500">Estos parámetros diferencian tu voz de cualquier otro experto. Si todos los guiones suenan igual, el ADN no está activo.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tono de Voz</label>
                                        <input type="text" value={formData.tone} onChange={e => updateForm({ tone: e.target.value })} className="input-viral" placeholder="Ej: Disruptivo, Académico, Hermano Mayor"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Arquetipo de Personalidad</label>
                                        <select value={formData.personality_archetype} onChange={e => updateForm({ personality_archetype: e.target.value })} className="input-viral">
                                            <option value="">Seleccionar...</option>
                                            <option>Maverick (Gary Vee)</option>
                                            <option>Mentor (Tony Robbins)</option>
                                            <option>Disruptor (Grant Cardone)</option>
                                            <option>Científico (Neil Patel)</option>
                                            <option>Hermano Mayor (Alex Hormozi)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Palabras de Poder / Jerga Propietaria</label>
                                    <textarea value={formData.key_vocabulary} onChange={e => updateForm({ key_vocabulary: e.target.value })} className="textarea-viral h-20" placeholder="Ej: Matrix, Cashflow, Libertad, Sistema, Escalabilidad..."/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Ritmo Narrativo</label>
                                        <select value={formData.narrative_rhythm} onChange={e => updateForm({ narrative_rhythm: e.target.value })} className="input-viral">
                                            <option value="lento">🐢 Lento — Frases largas, reflexivo</option>
                                            <option value="medio">🚶 Medio — Equilibrado, fluido</option>
                                            <option value="rapido">🏃 Rápido — Frases cortas, urgente</option>
                                            <option value="staccato">⚡ Staccato — Golpes. Cinematográfico.</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Frases Dominante</label>
                                        <select value={formData.phrase_type} onChange={e => updateForm({ phrase_type: e.target.value })} className="input-viral">
                                            <option value="declarativas">💪 Declarativas ("X es Y." Seguridad total)</option>
                                            <option value="interrogativas">❓ Interrogativas (Generan reflexión)</option>
                                            <option value="exclamativas">❗ Exclamativas (Énfasis y emoción)</option>
                                            <option value="mixtas">🔀 Mixtas (Variedad según momento)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-violet-900/10 border border-violet-500/20 rounded-xl p-5 space-y-5">
                                    <h4 className="text-violet-400 text-xs font-black uppercase flex items-center gap-2">
                                        <Sliders size={14}/> Parámetros Cuantitativos de Voz
                                    </h4>

                                    <SliderField
                                        label="Agresividad Verbal"
                                        value={formData.verbal_aggressiveness}
                                        onChange={v => updateForm({ verbal_aggressiveness: v })}
                                        colorClass="accent-violet-500"
                                        hint="1=Suave, diplomático • 3=Directo, sin rodeos • 5=Crudo, impactante"
                                    />
                                    <SliderField
                                        label="Sofisticación Léxica"
                                        value={formData.lexical_sophistication}
                                        onChange={v => updateForm({ lexical_sophistication: v })}
                                        colorClass="accent-blue-500"
                                        hint="1=Vocabulario simple • 3=Profesional accesible • 5=Jerga experta del nicho"
                                    />
                                    <SliderField
                                        label="Metáforas y Analogías"
                                        value={formData.metaphor_level}
                                        onChange={v => updateForm({ metaphor_level: v })}
                                        colorClass="accent-cyan-500"
                                        hint="1=Sin metáforas • 3=Algunas • 5=Todo se explica con analogías"
                                    />
                                    <SliderField
                                        label="Contundencia"
                                        value={formData.forcefulness_level}
                                        onChange={v => updateForm({ forcefulness_level: v })}
                                        colorClass="accent-orange-500"
                                        hint="1=Sugerencias suaves • 3=Asertivo • 5=Verdades absolutas, sin disclaimers"
                                    />
                                    <SliderField
                                        label="Emocionalidad"
                                        value={formData.emotionality_level}
                                        onChange={v => updateForm({ emotionality_level: v })}
                                        colorClass="accent-pink-500"
                                        hint="1=Totalmente racional • 3=Mezcla razón+emoción • 5=Altamente emocional"
                                    />
                                    <SliderField
                                        label="Tecnicismo"
                                        value={formData.technicality_level}
                                        onChange={v => updateForm({ technicality_level: v })}
                                        colorClass="accent-green-500"
                                        hint="1=Nada técnico • 3=Algo de jerga • 5=Máxima jerga técnica del nicho"
                                    />

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase">
                                                Ratio Storytelling vs. Enseñanza Directa
                                            </label>
                                            <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded">
                                                {formData.storytelling_ratio}% / {100 - formData.storytelling_ratio}%
                                            </span>
                                        </div>
                                        <input
                                            type="range" min={0} max={100} step={10}
                                            value={formData.storytelling_ratio}
                                            onChange={(e) => updateForm({ storytelling_ratio: Number(e.target.value) })}
                                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-yellow-500"
                                        />
                                        <div className="flex justify-between text-[9px] text-gray-600 mt-1">
                                            <span>Instructor puro</span>
                                            <span>50/50</span>
                                            <span>Narrador puro</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pilar de Contenido #1</label>
                                        <input type="text" value={formData.content_pillar_1} onChange={e => updateForm({ content_pillar_1: e.target.value })} className="input-viral" placeholder="Tema principal (70% del contenido)"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pilar de Contenido #2</label>
                                        <input type="text" value={formData.content_pillar_2} onChange={e => updateForm({ content_pillar_2: e.target.value })} className="input-viral" placeholder="Tema secundario (30% del contenido)"/>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: PRUEBA ───────────────────────────────────────── */}
                        {activeTab === 'proof' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Trophy size={20} className="text-green-400"/> Proof Stack (Prueba Social)
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Resultados de Clientes (con números)</label>
                                    <textarea value={formData.client_results} onChange={e => updateForm({ client_results: e.target.value })} className="textarea-viral h-24" placeholder="Ej: He ayudado a 127 clientes a generar €2.3M en los últimos 18 meses..."/>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Casos de Estudio</label>
                                    <textarea value={formData.case_studies} onChange={e => updateForm({ case_studies: e.target.value })} className="textarea-viral h-24" placeholder="Ej: Cliente X: De €0 a €50k/mes en 6 meses aplicando el Sistema RAPID..."/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Certificaciones / Autoridad</label>
                                        <input type="text" value={formData.certifications} onChange={e => updateForm({ certifications: e.target.value })} className="input-viral" placeholder="Ej: MBA Harvard, Certificado Google..."/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Apariciones en Medios</label>
                                        <input type="text" value={formData.media_appearances} onChange={e => updateForm({ media_appearances: e.target.value })} className="input-viral" placeholder="Ej: Forbes, Podcast de Tim Ferriss..."/>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Testimonios (Mejores 3)</label>
                                    <textarea value={formData.testimonials} onChange={e => updateForm({ testimonials: e.target.value })} className="textarea-viral h-24" placeholder="'Gracias a [TU NOMBRE], pasé de X a Y en Z tiempo' - Nombre, Empresa"/>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: MECANISMO ────────────────────────────────────── */}
                        {activeTab === 'mechanism' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-400"/> Metodología Propietaria
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">Nombre del Mecanismo™ *</label>
                                    <input type="text" value={formData.mechanism_name} onChange={e => updateForm({ mechanism_name: e.target.value })} className="input-viral border-yellow-500/20" placeholder="Ej: Sistema RAPID™, Método SCALE™"/>
                                    <p className="text-[10px] text-gray-600 mt-1 italic">Este nombre diferencia tu método de todos los demás en el mercado</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Framework Completo</label>
                                    <textarea value={formData.framework} onChange={e => updateForm({ framework: e.target.value })} className="textarea-viral h-32" placeholder="Describe tu metodología completa: qué hace único tu proceso..."/>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pasos del Sistema (Numerados)</label>
                                    <textarea value={formData.methodology_steps} onChange={e => updateForm({ methodology_steps: e.target.value })} className="textarea-viral h-24" placeholder="Paso 1: [Acción]&#10;Paso 2: [Acción]&#10;Paso 3: [Acción]..."/>
                                </div>

                                <div className="bg-yellow-900/5 p-4 rounded-xl border border-yellow-500/10">
                                    <h4 className="text-yellow-400 text-xs font-black uppercase mb-2">💡 Tips para Mecanismos Únicos</h4>
                                    <ul className="space-y-1 text-xs text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-yellow-500 shrink-0">•</span><span>Usa acrónimos: RAPID, SCALE, MAGNET — memorables y protegibles</span></li>
                                        <li className="flex items-start gap-2"><span className="text-yellow-500 shrink-0">•</span><span>Tu mecanismo debe explicar POR QUÉ funciona lo que no funciona antes</span></li>
                                        <li className="flex items-start gap-2"><span className="text-yellow-500 shrink-0">•</span><span>El Juez Viral verifica coherencia entre guion y mecanismo</span></li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: REDES ────────────────────────────────────────── */}
                        {activeTab === 'networks' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Network size={20} className="text-pink-400"/> Configuración por Red Social
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Define ajustes específicos por plataforma. El generador aplica esta capa automáticamente sobre el ADN global.
                                    Deja en "Auto" para usar la configuración global del experto.
                                </p>

                                {(['instagram', 'tiktok', 'youtube', 'linkedin'] as const).map(net => {
                                    const netConfig = parseNetworkConfig();
                                    const cfg = netConfig[net] || { tone: 'auto', depth: 'auto', aggressiveness: 'auto', close_type: 'auto' };
                                    const icons: Record<string, string> = { instagram: '📸', tiktok: '🎵', youtube: '▶️', linkedin: '💼' };

                                    const updateNet = (field: string, value: string) => {
                                        const updated = { ...netConfig, [net]: { ...cfg, [field]: value } };
                                        updateForm({ network_config: JSON.stringify(updated) });
                                    };

                                    const isCustomized = cfg.tone !== 'auto' || cfg.depth !== 'auto' || cfg.aggressiveness !== 'auto' || cfg.close_type !== 'auto';

                                    return (
                                        <div key={net} className={`rounded-xl p-5 border ${isCustomized ? 'border-pink-500/30 bg-pink-900/5' : 'border-gray-800 bg-gray-900/30'}`}>
                                            <h4 className="text-white text-xs font-black uppercase mb-4 flex items-center gap-2">
                                                <span>{icons[net]}</span> {net.toUpperCase()}
                                                {isCustomized && <span className="text-[9px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-bold">PERSONALIZADO</span>}
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Tono</label>
                                                    <select value={cfg.tone} onChange={e => updateNet('tone', e.target.value)} className="input-viral text-[11px] p-2">
                                                        <option value="auto">Auto</option>
                                                        <option value="casual">Casual</option>
                                                        <option value="profesional">Profesional</option>
                                                        <option value="disruptivo">Disruptivo</option>
                                                        <option value="inspiracional">Inspiracional</option>
                                                        <option value="educativo">Educativo</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Profundidad</label>
                                                    <select value={cfg.depth} onChange={e => updateNet('depth', e.target.value)} className="input-viral text-[11px] p-2">
                                                        <option value="auto">Auto</option>
                                                        <option value="superficial">Superficial</option>
                                                        <option value="media">Media</option>
                                                        <option value="profunda">Profunda</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Agresividad</label>
                                                    <select value={cfg.aggressiveness} onChange={e => updateNet('aggressiveness', e.target.value)} className="input-viral text-[11px] p-2">
                                                        <option value="auto">Auto</option>
                                                        <option value="baja">Baja</option>
                                                        <option value="media">Media</option>
                                                        <option value="alta">Alta</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Tipo de Cierre</label>
                                                    <select value={cfg.close_type} onChange={e => updateNet('close_type', e.target.value)} className="input-viral text-[11px] p-2">
                                                        <option value="auto">Auto</option>
                                                        <option value="cta_link">CTA Link</option>
                                                        <option value="pregunta">Pregunta</option>
                                                        <option value="reflexion">Reflexión</option>
                                                        <option value="oferta">Oferta</option>
                                                        <option value="autoridad">Sello Autoridad</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
                                    <h4 className="text-indigo-400 text-xs font-black uppercase mb-2">⚡ Jerarquía de configuración</h4>
                                    <p className="text-xs text-gray-400">
                                        <strong className="text-white">Red Social</strong> (override) → <strong className="text-white">ADN Verbal Global</strong> → <strong className="text-white">Defaults del Experto</strong>.
                                        Cuando el generador crea un guion para Instagram, aplica primero la config de Instagram y solo usa el ADN global para los campos en "Auto".
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save/Delete bar */}
                    <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            {selectedExpertId && (
                                <button onClick={handleDelete} className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2">
                                    <Trash2 size={16}/> Eliminar
                                </button>
                            )}
                        </div>
                        <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg">
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>}
                            GUARDAR
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: AI Lab ────────────────────────────────────────── */}
                <div className="lg:col-span-4">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 sticky top-6 shadow-2xl flex flex-col h-[700px]">

                        <div className="border-b border-gray-800 pb-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-400"/> AI LAB
                                </h3>
                                <div className="bg-indigo-900/20 px-2 py-1 rounded text-[10px] text-indigo-400 font-bold border border-indigo-500/30">
                                    OLIMPO
                                </div>
                            </div>
                            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg">
                                <button onClick={() => setAiMode('test')} className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${aiMode === 'test' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                    <Mic size={12} className="inline mr-1"/> Voice
                                </button>
                                <button onClick={() => setAiMode('xray')} className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${aiMode === 'xray' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                    <Eye size={12} className="inline mr-1"/> X-Ray
                                </button>
                                <button onClick={() => setAiMode('amplify')} className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${aiMode === 'amplify' ? 'bg-yellow-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                    <Zap size={12} className="inline mr-1"/> Amplify
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 space-y-2">
                            <select value={selectedTestAvatarId} onChange={e => setSelectedTestAvatarId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none">
                                <option value="">🎯 Hablarle a (Avatar)</option>
                                {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <select value={selectedTestKbId} onChange={e => setSelectedTestKbId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none">
                                <option value="">📚 Usar Conocimiento (KB)</option>
                                {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800 mb-4 shadow-inner">

                            {aiMode === 'xray' && auditResult && <ExpertAuditReportV2 data={auditResult} />}

                            {aiMode === 'test' && <ExpertChatHistory messages={chatHistory} />}

                            {aiMode === 'amplify' && contentIdeas && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {contentIdeas.titulos_virales && (
                                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
                                            <h4 className="text-yellow-400 text-xs font-black uppercase mb-2 flex items-center gap-2"><Flame size={14}/> Títulos Virales</h4>
                                            <ul className="space-y-2">
                                                {contentIdeas.titulos_virales.map((t: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-yellow-500 shrink-0">{i + 1}.</span><span>{t}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {contentIdeas.hooks_por_objetivo && (
                                        <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
                                            <h4 className="text-cyan-400 text-xs font-black uppercase mb-2 flex items-center gap-2"><Target size={14}/> Hooks por Objetivo</h4>
                                            <ul className="space-y-2">
                                                {contentIdeas.hooks_por_objetivo.map((h: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-cyan-500 shrink-0">•</span><span>{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {contentIdeas.frameworks_ensenanza && (
                                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                                            <h4 className="text-purple-400 text-xs font-black uppercase mb-2 flex items-center gap-2"><Brain size={14}/> Frameworks de Enseñanza</h4>
                                            <ul className="space-y-2">
                                                {contentIdeas.frameworks_ensenanza.map((fw: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-purple-500 shrink-0">•</span><span>{fw}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {contentIdeas.raw && (
                                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{contentIdeas.raw}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {aiMode === 'xray' && !auditResult && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
                                    <Eye size={48} className="mb-4"/>
                                    <p className="text-sm text-center font-medium">Escaneo profundo de autoridad</p>
                                    <p className="text-xs text-center text-gray-700 mt-2">Encuentra puntos ciegos y optimiza</p>
                                </div>
                            )}

                            {aiMode === 'amplify' && !contentIdeas && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
                                    <Zap size={48} className="mb-4"/>
                                    <p className="text-sm text-center font-medium">Generador de contenido OLIMPO</p>
                                    <p className="text-xs text-center text-gray-700 mt-2">Ideas virales por objetivo y red</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {aiMode === 'xray' && (
                                <button onClick={handleXRayAuthority} disabled={isProcessing || !formData.niche} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/20">
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Eye size={14}/>}
                                    {isProcessing ? 'ESCANEANDO...' : `X-RAY AUTHORITY (${COSTO_XRAY} CR)`}
                                </button>
                            )}
                            {aiMode === 'amplify' && (
                                <button onClick={handleContentAmplifier} disabled={isProcessing || !formData.name} className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-xs font-black uppercase flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-yellow-900/20">
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Zap size={14}/>}
                                    {isProcessing ? 'GENERANDO...' : `CONTENT AMPLIFIER (${COSTO_AMPLIFY} CR)`}
                                </button>
                            )}
                            {aiMode === 'test' && (
                                <div className="relative mt-4">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleVoiceTest()}
                                        placeholder="Hazle una pregunta técnica..."
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm outline-none focus:border-indigo-500 transition-all"
                                    />
                                    <button onClick={handleVoiceTest} disabled={isProcessing || !chatInput} className="absolute right-2 top-2 p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50 shadow-lg shadow-green-900/20">
                                        {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .input-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; }
                .input-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); }
                .textarea-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; resize: none; transition: all 0.2s; }
                .textarea-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                input[type=range] { background: transparent; }
                input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.08); }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; margin-top: -5px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default ExpertProfile;