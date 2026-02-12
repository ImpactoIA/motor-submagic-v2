import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, MessageSquare, Zap, Search, RefreshCw, Send, 
    User, Users, BookOpen, Fingerprint, Mic, Globe, ShieldCheck, Activity, 
    AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Award, 
    Star, Target, Trophy, Sparkles, Lightbulb, Eye, Brain, Rocket,
    TrendingUp, DollarSign, Crown, Flame, Crosshair
} from 'lucide-react';

// ==================================================================================
// 🎨 SUB-COMPONENTE: REPORTE DE AUDITORÍA V2 (MEJORADO)
// ==================================================================================
const ExpertAuditReportV2 = ({ data }: { data: any }) => {
  if (!data || !data.auditoria_calidad) {
    return (
        <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-200 text-xs">
            <p className="font-bold mb-1">Resultado recibido</p>
            <pre className="text-[10px] opacity-70 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
  }

  const { auditoria_calidad, analisis_campo_por_campo, perfil_experto_optimizado, analisis_competitivo, plan_accion_90_dias, siguiente_paso } = data;
  
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
      
      {/* Scoreboard V2 */}
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

          {/* Desglose de Puntos */}
          {auditoria_calidad.desglose_puntos && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase block mb-1">Historia</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-cyan-400">{auditoria_calidad.desglose_puntos.historia}</span>
                  <span className="text-[10px] text-gray-600">/25</span>
                </div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase block mb-1">Mecanismo</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-purple-400">{auditoria_calidad.desglose_puntos.mecanismo}</span>
                  <span className="text-[10px] text-gray-600">/30</span>
                </div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase block mb-1">Proof</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-green-400">{auditoria_calidad.desglose_puntos.proof}</span>
                  <span className="text-[10px] text-gray-600">/20</span>
                </div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase block mb-1">Enemigo</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-red-400">{auditoria_calidad.desglose_puntos.enemigo}</span>
                  <span className="text-[10px] text-gray-600">/15</span>
                </div>
              </div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase block mb-1">Promesa</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-yellow-400">{auditoria_calidad.desglose_puntos.promesa}</span>
                  <span className="text-[10px] text-gray-600">/10</span>
                </div>
              </div>
            </div>
          )}

          {/* Penalizaciones */}
          {auditoria_calidad.penalizaciones_aplicadas && auditoria_calidad.penalizaciones_aplicadas.length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-3">
              <h4 className="text-red-400 text-[10px] font-black uppercase mb-2">⚠️ Penalizaciones</h4>
              <ul className="space-y-1">
                {auditoria_calidad.penalizaciones_aplicadas.map((pen: string, i: number) => (
                  <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                    <XCircle size={12} className="shrink-0 mt-0.5"/>
                    <span>{pen}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Análisis Campo por Campo */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest pl-1">
          <Activity size={12}/> Auditoría Táctica
        </h4>
        
        {analisis_campo_por_campo?.map((item: any, idx: number) => (
          <div key={idx} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-bold text-white text-xs">{item.campo}</h5>
              <div className="flex items-center gap-2">
                {item.score_numerico !== undefined && (
                  <span className="text-xs font-black text-gray-400">{item.score_numerico}/10</span>
                )}
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getStatusColor(item.calificacion)}`}>
                  {item.calificacion?.split(' ')[1] || item.calificacion}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Input Usuario */}
              {item.lo_que_escribio && (
                <div className="relative pl-3 border-l-2 border-red-500/20">
                  <span className="text-[9px] text-red-400 font-bold block mb-0.5 uppercase">Lo que escribiste</span>
                  <p className="text-gray-400 text-[10px] italic">"{item.lo_que_escribio}"</p>
                </div>
              )}

              {/* Crítica */}
              <div className="relative pl-3 border-l-2 border-orange-500/20 bg-orange-900/5 py-1 rounded-r-lg">
                <span className="text-[9px] text-orange-400 font-bold block mb-0.5 uppercase">Debilidad Detectada</span>
                <p className="text-[10px] text-orange-300 flex items-start gap-1 leading-relaxed">
                    <XCircle size={10} className="shrink-0 mt-0.5"/> {item.critica}
                </p>
              </div>

              {/* Corrección Maestra */}
              <div className="relative pl-3 border-l-2 border-green-500/40 bg-green-500/5 py-2 px-1 rounded-r-lg">
                <span className="text-[9px] text-green-400 font-bold block mb-1 uppercase">✨ Estrategia High-Ticket</span>
                <p className="text-gray-200 text-[10px] font-medium leading-relaxed">"{item.correccion_maestra}"</p>
              </div>

              {/* Ejemplos de Referencia */}
              {item.ejemplos_referencia && item.ejemplos_referencia.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-2">
                  <span className="text-[9px] text-blue-400 font-bold uppercase block mb-1">📚 Ejemplos Legendarios</span>
                  <ul className="space-y-1">
                    {item.ejemplos_referencia.map((ej: string, i: number) => (
                      <li key={i} className="text-xs text-blue-200 flex items-start gap-2">
                        <span className="text-blue-500 shrink-0">•</span>
                        <span>{ej}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Perfil Optimizado */}
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

          {perfil_experto_optimizado?.mecanismo_comercial && (
            <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-lg">
              <span className="block text-[9px] text-purple-400 uppercase font-bold mb-1">🎯 Tu Mecanismo Único</span>
              <p className="text-purple-200 text-xs font-black mb-2">{perfil_experto_optimizado.mecanismo_comercial.nombre}</p>
              {perfil_experto_optimizado.mecanismo_comercial.pasos && (
                <ul className="space-y-1">
                  {perfil_experto_optimizado.mecanismo_comercial.pasos.map((paso: string, i: number) => (
                    <li key={i} className="text-[10px] text-purple-300 flex items-start gap-2">
                      <span className="text-purple-500 font-bold">{i + 1}.</span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {perfil_experto_optimizado?.proof_stack_ordenado && (
            <div className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg">
              <span className="block text-[9px] text-green-400 uppercase font-bold mb-2">🏆 Proof Stack</span>
              <ul className="space-y-1">
                {perfil_experto_optimizado.proof_stack_ordenado.map((proof: string, i: number) => (
                  <li key={i} className="text-xs text-green-200 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5"/>
                    <span>{proof}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Análisis Competitivo */}
      {analisis_competitivo && (
        <div className="bg-orange-900/10 border border-orange-500/20 rounded-xl p-4">
          <h4 className="text-orange-400 text-xs font-black uppercase mb-3 flex items-center gap-2">
            <Target size={14}/> Análisis Competitivo
          </h4>
          
          <div className="space-y-3">
            {analisis_competitivo.competidores_directos && (
              <div>
                <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Competidores Directos</span>
                <p className="text-xs text-gray-300">{analisis_competitivo.competidores_directos}</p>
              </div>
            )}

            {analisis_competitivo.tu_diferenciador_vs_ellos && (
              <div className="bg-green-900/10 border border-green-500/20 p-2 rounded">
                <span className="text-[9px] text-green-400 uppercase font-bold block mb-1">✅ Tu Ventaja</span>
                <p className="text-xs text-green-200">{analisis_competitivo.tu_diferenciador_vs_ellos}</p>
              </div>
            )}

            {analisis_competitivo.debilidad_competitiva && (
              <div className="bg-red-900/10 border border-red-500/20 p-2 rounded">
                <span className="text-[9px] text-red-400 uppercase font-bold block mb-1">⚠️ Tu Debilidad</span>
                <p className="text-xs text-red-200">{analisis_competitivo.debilidad_competitiva}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan de Acción 90 Días */}
      {plan_accion_90_dias && plan_accion_90_dias.length > 0 && (
        <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
          <h4 className="text-cyan-400 text-xs font-black uppercase mb-3 flex items-center gap-2">
            <Rocket size={14}/> Plan de Acción 90 Días
          </h4>
          
          <div className="space-y-3">
            {plan_accion_90_dias.map((mes: any, idx: number) => (
              <div key={idx} className="bg-black/40 p-3 rounded-lg border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-cyan-300">MES {mes.mes}</span>
                  <span className="text-[9px] text-cyan-500 uppercase">{mes.kpi}</span>
                </div>
                <p className="text-xs text-white font-bold mb-2">{mes.objetivo}</p>
                <ul className="space-y-1">
                  {mes.acciones.map((accion: string, i: number) => (
                    <li key={i} className="text-[10px] text-gray-300 flex items-start gap-2">
                      <span className="text-cyan-500 shrink-0">•</span>
                      <span>{accion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Siguiente Paso */}
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

// ==================================================================================
// 💬 SUB-COMPONENTE: CHAT HISTORY
// ==================================================================================
const ExpertChatHistory = ({ messages }: { messages: any[] }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
        <MessageSquare size={48} className="mb-4"/>
        <p className="text-sm text-center font-medium max-w-[240px] leading-relaxed">
          Prueba la voz de tu experto
          <span className="block mt-2 text-xs text-gray-700">
            Haz preguntas técnicas a tu audiencia
          </span>
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

// ==================================================================================
// 🧩 COMPONENTE PRINCIPAL: EXPERT AUTHORITY ENGINE
// ==================================================================================
export const ExpertProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    // Listas
    const [expertsList, setExpertsList] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estados IA
    const [aiMode, setAiMode] = useState<'test' | 'xray' | 'amplify'>('test');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [auditResult, setAuditResult] = useState<any>(null);
    const [contentIdeas, setContentIdeas] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Contexto
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedTestAvatarId, setSelectedTestAvatarId] = useState<string>('');
    const [selectedTestKbId, setSelectedTestKbId] = useState<string>('');

    // Tabs - ✅ AGREGADA LA PESTAÑA 'expert_authority'
    const [activeTab, setActiveTab] = useState<'identity' | 'authority' | 'proof' | 'mechanism' | 'expert_authority'>('identity');

    // Costos
    const COSTO_XRAY = 2;
    const COSTO_TEST = 1;
    const COSTO_AMPLIFY = 3;

    // ✅ FORMULARIO EXPANDIDO CON NUEVOS CAMPOS DE EXPERT AUTHORITY
    const [formData, setFormData] = useState({
        // Identidad Básica
        name: '',
        niche: '',
        mission: '',
        
        // Historia y Posicionamiento
        origin_story: '',
        unique_positioning: '',
        enemy: '',
        transformation_promise: '',
        
        // Voz y Autoridad
        tone: '',
        key_vocabulary: '',
        personality_archetype: '',
        
        // Mecanismo y Metodología
        framework: '',
        mechanism_name: '',
        methodology_steps: '',
        
        // Proof y Credibilidad
        case_studies: '',
        certifications: '',
        media_appearances: '',
        client_results: '',
        testimonials: '',
        
        // Pilares de Contenido
        content_pillar_1: '',
        content_pillar_2: '',
        
        // ✅ NUEVOS CAMPOS DE EXPERT AUTHORITY
        authority_level: 'practicante',        // aprendiz | practicante | experto | referente
        authority_type: 'practica',            // academica | practica | estrategica | disruptiva
        depth_level: 'media',                  // superficial | media | profunda | tecnica
        proof_type: 'casos_reales',            // datos | casos_reales | analogias | opinion_razonada
        mental_territory: '',                  // Texto libre
        prohibitions: JSON.stringify({         // JSON string
            promesas_rapidas: false,
            simplificaciones_extremas: false,
            ataques_personales: false,
            opinion_sin_prueba: false,
            contenido_superficial: false
        })
    });

    const getPlanLimit = () => {
        const tier = userProfile?.tier || 'free';
        if (tier === 'esencial') return 1;
        if (tier === 'pro') return 3;
        if (tier === 'agency') return 10;
        return 1;
    };

    useEffect(() => { 
        if (user) {
            fetchExperts();
            fetchContextData();
        }
    }, [user]);

    const fetchExperts = async () => {
        try {
            const { data } = await supabase.from('expert_profiles').select('*').eq('user_id', user?.id);
            if (data) {
                setExpertsList(data);
                if (userProfile?.active_expert_id) {
                    const active = data.find(e => e.id === userProfile.active_expert_id);
                    if (active) selectExpert(active);
                } else if (data.length > 0) {
                    selectExpert(data[0]);
                }
            }
        } catch (e) { console.error(e); }
    };

    const fetchContextData = async () => {
        try {
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));

            if (userProfile?.active_avatar_id) setSelectedTestAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    // ✅ ACTUALIZADA PARA CARGAR LOS NUEVOS CAMPOS
    const selectExpert = (expert: any) => {
        setSelectedExpertId(expert.id);
        setChatHistory([]);
        setAuditResult(null);
        setContentIdeas(null);
        
        setFormData({
            name: expert.name || '',
            niche: expert.niche || '',
            mission: expert.mission || '',
            origin_story: expert.origin_story || '',
            unique_positioning: expert.unique_positioning || '',
            enemy: expert.enemy || '',
            transformation_promise: expert.transformation_promise || '',
            tone: expert.tone || '',
            key_vocabulary: expert.key_vocabulary || '',
            personality_archetype: expert.personality_archetype || '',
            framework: expert.framework || '',
            mechanism_name: expert.mechanism_name || '',
            methodology_steps: expert.methodology_steps || '',
            case_studies: expert.case_studies || '',
            certifications: expert.certifications || '',
            media_appearances: expert.media_appearances || '',
            client_results: expert.client_results || '',
            testimonials: expert.testimonials || '',
            content_pillar_1: expert.content_pillar_1 || '',
            content_pillar_2: expert.content_pillar_2 || '',
            
            // ✅ CARGAR NUEVOS CAMPOS
            authority_level: expert.authority_level || 'practicante',
            authority_type: expert.authority_type || 'practica',
            depth_level: expert.depth_level || 'media',
            proof_type: expert.proof_type || 'casos_reales',
            mental_territory: expert.mental_territory || '',
            prohibitions: typeof expert.prohibitions === 'string' 
                ? expert.prohibitions 
                : JSON.stringify(expert.prohibitions || {
                    promesas_rapidas: false,
                    simplificaciones_extremas: false,
                    ataques_personales: false,
                    opinion_sin_prueba: false,
                    contenido_superficial: false
                })
        });
    };

    const handleNewExpert = () => {
        const limit = getPlanLimit();
        if (expertsList.length >= limit) return alert(`⚠️ Límite de ${limit} expertos alcanzado.`);
        
        setSelectedExpertId(null);
        setChatHistory([]);
        setAuditResult(null);
        setContentIdeas(null);
        
        setFormData({ 
            name: '', niche: '', mission: '', origin_story: '', unique_positioning: '',
            enemy: '', transformation_promise: '', tone: '', key_vocabulary: '',
            personality_archetype: '', framework: '', mechanism_name: '', methodology_steps: '',
            case_studies: '', certifications: '', media_appearances: '', client_results: '',
            testimonials: '', content_pillar_1: '', content_pillar_2: '',
            authority_level: 'practicante', authority_type: 'practica', depth_level: 'media',
            proof_type: 'casos_reales', mental_territory: '', 
            prohibitions: JSON.stringify({
                promesas_rapidas: false,
                simplificaciones_extremas: false,
                ataques_personales: false,
                opinion_sin_prueba: false,
                contenido_superficial: false
            })
        });
    };

    const handleSave = async () => {
        if (!formData.name) return alert("Ponle un nombre a tu Experto");
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
            if(refreshProfile) refreshProfile();
            
            await fetchExperts();
            selectExpert(result.data);
        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if(!selectedExpertId || !confirm("¿Borrar este perfil?")) return;
        try {
            if (userProfile?.active_expert_id === selectedExpertId) {
                await supabase.from('profiles').update({ active_expert_id: null }).eq('id', user?.id);
            }
            await supabase.from('expert_profiles').delete().eq('id', selectedExpertId);
            handleNewExpert();
            await fetchExperts();
            if(refreshProfile) refreshProfile();
        } catch (e) { console.error(e); }
    };

    // X-RAY AUTHORITY (Antes: Audit)
    const handleXRayAuthority = async () => {
        if (!formData.niche || !formData.mission) return alert("Define Nicho y Misión.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_XRAY) return alert("Saldo insuficiente.");

        setIsProcessing(true);
        setAuditResult(null);
        
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'audit_expert',
                    transcript: JSON.stringify(formData), 
                    avatarId: selectedTestAvatarId,
                    estimatedCost: COSTO_XRAY
                },
            });

            if (error) throw error;
            
            const result = data.generatedData || data;
            setAuditResult(result);
            if(refreshProfile) refreshProfile();

        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsProcessing(false); }
    };

    // VOICE TEST (Antes: Chat)
    const handleVoiceTest = async () => {
        if (!chatInput) return;
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_TEST) return alert("Saldo insuficiente.");
        
        setIsProcessing(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_expert', 
                    transcript: `Usuario pregunta: "${chatInput}". \nContexto del Experto: ${JSON.stringify(formData)}`,
                    avatarId: selectedTestAvatarId,
                    knowledgeBaseId: selectedTestKbId,
                    estimatedCost: COSTO_TEST
                },
            });
            if (error) throw error;
            
            const answer = data.generatedData?.answer || 
                          data.generatedData?.text_output || 
                          (typeof data.generatedData === 'string' ? data.generatedData : "Sin respuesta");
            
            setChatHistory(prev => [...prev, {
                question: chatInput,
                answer: answer
            }]);
            
            setChatInput('');
            if (refreshProfile) refreshProfile();
            
        } catch (e: any) { 
            setChatHistory(prev => [...prev, {
                question: chatInput,
                answer: `Error: ${e.message}`
            }]);
        }
        finally { setIsProcessing(false); }
    };

    // CONTENT AMPLIFIER (Nuevo - Antes: Insights)
    const handleContentAmplifier = async () => {
        if (!formData.name || !formData.niche) return alert("Completa Nombre y Nicho.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AMPLIFY) return alert("Saldo insuficiente.");

        setIsProcessing(true);
        setContentIdeas(null);
        
        try {
            const contentPrompt = `GENERA IDEAS DE CONTENIDO PARA ESTE EXPERTO:

${JSON.stringify(formData, null, 2)}

GENERA:
1. 5 títulos de contenido virales para ${formData.niche}
2. 3 frameworks únicos para explicar conceptos complejos
3. 2 controversias estratégicas para generar engagement
4. 1 serie de contenido de 30 días

Devuelve en formato JSON:
{
  "titulos_virales": ["titulo1", "titulo2", ...],
  "frameworks_ensenanza": ["framework1", "framework2", "framework3"],
  "controversias_estrategicas": ["controversia1", "controversia2"],
  "serie_30_dias": {
    "nombre": "Nombre de la serie",
    "temas_semanales": ["semana1", "semana2", "semana3", "semana4"]
  }
}`;

            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_expert',
                    transcript: contentPrompt,
                    avatarId: selectedTestAvatarId,
                    knowledgeBaseId: selectedTestKbId,
                    estimatedCost: COSTO_AMPLIFY
                },
            });
            
            if (error) throw error;
            
            let ideas;
            try {
                const rawAnswer = data.generatedData?.answer || 
                                 data.generatedData?.text_output || 
                                 JSON.stringify(data.generatedData);
                ideas = JSON.parse(rawAnswer);
            } catch {
                ideas = { 
                    raw: data.generatedData?.answer || "No se generaron ideas" 
                };
            }
            
            setContentIdeas(ideas);
            if (refreshProfile) refreshProfile();

        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsProcessing(false); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
                        <Crown className="text-indigo-500" fill="currentColor" size={36}/> 
                        AUTHORITY FORGE
                    </h1>
                    <p className="text-gray-400 text-base font-medium mt-1">
                        Diseña una marca personal magnética que atrae clientes premium
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        onChange={(e) => {
                            const selected = expertsList.find(ex => ex.id === e.target.value);
                            if(selected) selectExpert(selected);
                        }}
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
                
                {/* FORMULARIO IZQUIERDA (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* ✅ TABS DE NAVEGACIÓN - AGREGADO EXPERT AUTHORITY */}
                    <div className="flex gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('identity')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                activeTab === 'identity'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Globe size={12} className="inline mr-1"/> Identidad
                        </button>
                        <button
                            onClick={() => setActiveTab('expert_authority')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                activeTab === 'expert_authority'
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <ShieldCheck size={12} className="inline mr-1"/> Expert Authority
                        </button>
                        <button
                            onClick={() => setActiveTab('authority')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                activeTab === 'authority'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Mic size={12} className="inline mr-1"/> Voz
                        </button>
                        <button
                            onClick={() => setActiveTab('proof')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                activeTab === 'proof'
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Trophy size={12} className="inline mr-1"/> Prueba
                        </button>
                        <button
                            onClick={() => setActiveTab('mechanism')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                activeTab === 'mechanism'
                                    ? 'bg-yellow-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Zap size={12} className="inline mr-1"/> Mecanismo
                        </button>
                    </div>

                    {/* CONTENIDO DE TABS */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[500px]">
                        
                        {/* TAB: IDENTIDAD */}
                        {activeTab === 'identity' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Globe size={20} className="text-indigo-400"/> Posicionamiento de Mercado
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nombre de Marca *</label>
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Dr. Finanzas"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nicho Específico *</label>
                                        <input 
                                            type="text" 
                                            value={formData.niche} 
                                            onChange={(e) => setFormData({...formData, niche: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Inversiones inmobiliarias para médicos"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block flex items-center gap-2">
                                        <ShieldCheck size={12}/> Misión Única (UVP) *
                                    </label>
                                    <textarea 
                                        value={formData.mission} 
                                        onChange={(e) => setFormData({...formData, mission: e.target.value})} 
                                        className="textarea-viral h-24 border-indigo-500/20" 
                                        placeholder="Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN] mediante [MÉTODO]..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Historia de Origen</label>
                                    <textarea 
                                        value={formData.origin_story} 
                                        onChange={(e) => setFormData({...formData, origin_story: e.target.value})} 
                                        className="textarea-viral h-32" 
                                        placeholder="Tu crisis → Tu descubrimiento → Tu transformación. Ej: 'Perdí todo en 2008, descubrí X, ahora...'"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Posicionamiento Único</label>
                                        <input 
                                            type="text" 
                                            value={formData.unique_positioning} 
                                            onChange={(e) => setFormData({...formData, unique_positioning: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: El único coach de fitness que odia el gym"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">Enemigo Común</label>
                                        <input 
                                            type="text" 
                                            value={formData.enemy} 
                                            onChange={(e) => setFormData({...formData, enemy: e.target.value})} 
                                            className="input-viral border-red-500/20" 
                                            placeholder="Ej: Los gurús que venden humo"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-green-400 uppercase mb-2 block">Promesa de Transformación</label>
                                    <input 
                                        type="text" 
                                        value={formData.transformation_promise} 
                                        onChange={(e) => setFormData({...formData, transformation_promise: e.target.value})} 
                                        className="input-viral border-green-500/20" 
                                        placeholder="Ej: €10k/mes en 90 días o devuelvo el doble"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ✅ NUEVO TAB: EXPERT AUTHORITY */}
                        {activeTab === 'expert_authority' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-red-400"/> Posicionamiento de Autoridad
                                </h3>

                                {/* NIVEL DE AUTORIDAD */}
                                <div>
                                    <label className="text-[10px] font-black text-red-400 uppercase mb-2 block flex items-center gap-2">
                                        <Trophy size={12}/> Nivel de Autoridad (Cómo te ve el mercado)
                                    </label>
                                    <select 
                                        value={formData.authority_level} 
                                        onChange={(e) => setFormData({...formData, authority_level: e.target.value})}
                                        className="input-viral border-red-500/20"
                                    >
                                        <option value="aprendiz">🌱 Aprendiz (Comparto mi viaje de aprendizaje)</option>
                                        <option value="practicante">⚙️ Practicante (Tengo experiencia aplicada)</option>
                                        <option value="experto">🎯 Experto (Domino profundamente el tema)</option>
                                        <option value="referente">👑 Referente (Soy LA voz del nicho)</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1 italic">
                                        Esto define la profundidad y seguridad con la que hablas
                                    </p>
                                </div>

                                {/* TIPO DE AUTORIDAD */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Autoridad (Cómo convences)</label>
                                    <select 
                                        value={formData.authority_type} 
                                        onChange={(e) => setFormData({...formData, authority_type: e.target.value})}
                                        className="input-viral"
                                    >
                                        <option value="academica">📚 Académica (Datos, estudios, ciencia)</option>
                                        <option value="practica">🛠️ Práctica (Experiencia, casos reales, resultados)</option>
                                        <option value="estrategica">🧠 Estratégica (Sistemas, frameworks, visión)</option>
                                        <option value="disruptiva">💥 Disruptiva (Rompo paradigmas, anti-sistema)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* PROFUNDIDAD MÁXIMA */}
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Profundidad Máxima</label>
                                        <select 
                                            value={formData.depth_level} 
                                            onChange={(e) => setFormData({...formData, depth_level: e.target.value})}
                                            className="input-viral"
                                        >
                                            <option value="superficial">☁️ Superficial (Tips rápidos, viral corto)</option>
                                            <option value="media">📊 Media (Explicaciones claras, ejemplos)</option>
                                            <option value="profunda">🔬 Profunda (Análisis detallado, matices)</option>
                                            <option value="tecnica">⚙️ Técnica (Jerga, implementación exacta)</option>
                                        </select>
                                    </div>

                                    {/* TIPO DE PRUEBA */}
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Prueba Preferida</label>
                                        <select 
                                            value={formData.proof_type} 
                                            onChange={(e) => setFormData({...formData, proof_type: e.target.value})}
                                            className="input-viral"
                                        >
                                            <option value="datos">📊 Datos y Estadísticas</option>
                                            <option value="casos_reales">💼 Casos de Estudio Reales</option>
                                            <option value="analogias">🎭 Analogías y Metáforas</option>
                                            <option value="opinion_razonada">💭 Opinión Razonada (Thought Leadership)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* TERRITORIO MENTAL */}
                                <div>
                                    <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">Territorio Mental™</label>
                                    <textarea 
                                        value={formData.mental_territory} 
                                        onChange={(e) => setFormData({...formData, mental_territory: e.target.value})} 
                                        className="textarea-viral h-20 border-yellow-500/20" 
                                        placeholder="¿En qué ideas QUIERES SER CONOCIDO? Ej: simplicidad, anti-mitos, procesos escalables, verdad incómoda..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1 italic">
                                        Define tu "marca registrada" conceptual. Ej: Alex Hormozi = "Value First", Gary Vee = "Patience + Hustle"
                                    </p>
                                </div>

                                {/* PROHIBICIONES */}
                                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4">
                                    <h4 className="text-red-400 text-xs font-black uppercase mb-3">⚠️ Líneas Rojas de Credibilidad</h4>
                                    <p className="text-xs text-gray-400 mb-3">Marca lo que NUNCA harás (mantiene coherencia con tu posicionamiento):</p>
                                    
                                    <div className="space-y-2">
                                        {[
                                            { key: 'promesas_rapidas', label: 'Promesas de resultados rápidos sin esfuerzo' },
                                            { key: 'simplificaciones_extremas', label: 'Simplificar en exceso temas complejos' },
                                            { key: 'ataques_personales', label: 'Atacar personas (en vez de ideas)' },
                                            { key: 'opinion_sin_prueba', label: 'Opiniones sin respaldo o experiencia' },
                                            { key: 'contenido_superficial', label: 'Contenido viral sin valor real' }
                                        ].map(item => {
                                            const prohibitionsObj = JSON.parse(formData.prohibitions || '{}');
                                            return (
                                                <label key={item.key} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={prohibitionsObj[item.key] || false}
                                                        onChange={(e) => {
                                                            const updated = {...prohibitionsObj, [item.key]: e.target.checked};
                                                            setFormData({...formData, prohibitions: JSON.stringify(updated)});
                                                        }}
                                                        className="w-4 h-4 accent-red-500"
                                                    />
                                                    <span>{item.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* INDICADOR DE COHERENCIA */}
                                <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
                                    <h4 className="text-indigo-400 text-xs font-black uppercase mb-2">💡 Coherencia Avatar ↔ Experto</h4>
                                    <p className="text-xs text-gray-300">
                                        {formData.authority_level === 'aprendiz' && (
                                            "✅ Como aprendiz, puedes compartir tu viaje. Usa historias personales de fracaso → aprendizaje."
                                        )}
                                        {formData.authority_level === 'practicante' && (
                                            "✅ Como practicante, muestra resultados reales sin exagerar. Prueba social es clave."
                                        )}
                                        {formData.authority_level === 'experto' && (
                                            "✅ Como experto, profundiza sin perder claridad. Tu audiencia espera frameworks y sistemas."
                                        )}
                                        {formData.authority_level === 'referente' && (
                                            "⚠️ Como referente, cada palabra importa. Tu opinión ES la verdad para tu audiencia."
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB: VOZ Y AUTORIDAD (ORIGINAL) */}
                        {activeTab === 'authority' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Mic size={20} className="text-purple-400"/> Voz y Autoridad
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tono de Voz</label>
                                        <input 
                                            type="text" 
                                            value={formData.tone} 
                                            onChange={(e) => setFormData({...formData, tone: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Disruptivo, Académico, Hermano Mayor"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Arquetipo de Personalidad</label>
                                        <select 
                                            value={formData.personality_archetype} 
                                            onChange={(e) => setFormData({...formData, personality_archetype: e.target.value})}
                                            className="input-viral"
                                        >
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
                                    <textarea 
                                        value={formData.key_vocabulary} 
                                        onChange={(e) => setFormData({...formData, key_vocabulary: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: Matrix, Cashflow, Libertad, Sistema, Escalabilidad..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pilar de Contenido #1</label>
                                        <input 
                                            type="text" 
                                            value={formData.content_pillar_1} 
                                            onChange={(e) => setFormData({...formData, content_pillar_1: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Tema principal (70% del contenido)"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pilar de Contenido #2</label>
                                        <input 
                                            type="text" 
                                            value={formData.content_pillar_2} 
                                            onChange={(e) => setFormData({...formData, content_pillar_2: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Tema secundario (30% del contenido)"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PRUEBA */}
                        {activeTab === 'proof' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Trophy size={20} className="text-green-400"/> Proof Stack (Prueba Social)
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Resultados de Clientes (con números)</label>
                                    <textarea 
                                        value={formData.client_results} 
                                        onChange={(e) => setFormData({...formData, client_results: e.target.value})} 
                                        className="textarea-viral h-24" 
                                        placeholder="Ej: He ayudado a 127 clientes a generar €2.3M en los últimos 18 meses..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Casos de Estudio</label>
                                    <textarea 
                                        value={formData.case_studies} 
                                        onChange={(e) => setFormData({...formData, case_studies: e.target.value})} 
                                        className="textarea-viral h-24" 
                                        placeholder="Ej: Cliente X: De €0 a €50k/mes en 6 meses. Cliente Y: Escaló de 1 a 15 empleados..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Certificaciones / Autoridad</label>
                                        <input 
                                            type="text" 
                                            value={formData.certifications} 
                                            onChange={(e) => setFormData({...formData, certifications: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: MBA Harvard, Certificado Google..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Apariciones en Medios</label>
                                        <input 
                                            type="text" 
                                            value={formData.media_appearances} 
                                            onChange={(e) => setFormData({...formData, media_appearances: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Forbes, Podcast de Tim Ferriss..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Testimonios (Mejores 3)</label>
                                    <textarea 
                                        value={formData.testimonials} 
                                        onChange={(e) => setFormData({...formData, testimonials: e.target.value})} 
                                        className="textarea-viral h-24" 
                                        placeholder="'Gracias a [TU NOMBRE], pasé de X a Y en Z tiempo' - Nombre, Empresa"
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB: MECANISMO */}
                        {activeTab === 'mechanism' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-400"/> Metodología Propietaria
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">Nombre del Mecanismo™</label>
                                    <input 
                                        type="text" 
                                        value={formData.mechanism_name} 
                                        onChange={(e) => setFormData({...formData, mechanism_name: e.target.value})} 
                                        className="input-viral border-yellow-500/20" 
                                        placeholder="Ej: Sistema RAPID™, Método SCALE™, Framework MAGNET™"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Framework Completo (Paso a Paso)</label>
                                    <textarea 
                                        value={formData.framework} 
                                        onChange={(e) => setFormData({...formData, framework: e.target.value})} 
                                        className="textarea-viral h-32" 
                                        placeholder="Describe tu metodología completa. Ej: El Método 3C: 1) Captar (estrategia de adquisición), 2) Convertir (sistema de ventas), 3) Cerrar (fulfillment)"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Pasos del Sistema (Numerados)</label>
                                    <textarea 
                                        value={formData.methodology_steps} 
                                        onChange={(e) => setFormData({...formData, methodology_steps: e.target.value})} 
                                        className="textarea-viral h-24" 
                                        placeholder="Paso 1: [Acción]\nPaso 2: [Acción]\nPaso 3: [Acción]..."
                                    />
                                </div>

                                <div className="bg-yellow-900/5 p-4 rounded-xl border border-yellow-500/10">
                                    <h4 className="text-yellow-400 text-xs font-black uppercase mb-2">💡 Tips para Mecanismos Únicos</h4>
                                    <ul className="space-y-1 text-xs text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500 shrink-0">•</span>
                                            <span>Usa acrónimos: RAPID, SCALE, MAGNET</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500 shrink-0">•</span>
                                            <span>Registra tu trademark™</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500 shrink-0">•</span>
                                            <span>Haz que suene científico pero simple</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            {selectedExpertId && (
                                <button 
                                    onClick={handleDelete} 
                                    className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2"
                                >
                                    <Trash2 size={16}/> Eliminar
                                </button>
                            )}
                        </div>
                        
                        <button 
                            onClick={handleSave} 
                            disabled={loading} 
                            className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg"
                        >
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} 
                            GUARDAR
                        </button>
                    </div>
                </div>

                {/* PANEL IA DERECHA (4 Cols) */}
                <div className="lg:col-span-4">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 sticky top-6 shadow-2xl flex flex-col h-[700px]">
                        
                        {/* Header IA */}
                        <div className="border-b border-gray-800 pb-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-400"/> AI LAB
                                </h3>
                                <div className="bg-indigo-900/20 px-2 py-1 rounded text-[10px] text-indigo-400 font-bold border border-indigo-500/30">
                                    ULTRA
                                </div>
                            </div>

                            {/* Modos de IA */}
                            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setAiMode('test')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'test'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                    title="Prueba tu voz"
                                >
                                    <Mic size={12} className="inline mr-1"/> Voice
                                </button>
                                <button
                                    onClick={() => setAiMode('xray')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'xray'
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                    title="Escaneo de autoridad"
                                >
                                    <Eye size={12} className="inline mr-1"/> X-Ray
                                </button>
                                <button
                                    onClick={() => setAiMode('amplify')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'amplify'
                                            ? 'bg-yellow-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                    title="Generador de contenido"
                                >
                                    <Zap size={12} className="inline mr-1"/> Amplify
                                </button>
                            </div>
                        </div>

                        {/* Configuración */}
                        <div className="mb-4 space-y-2">
                            <select 
                                value={selectedTestAvatarId} 
                                onChange={(e) => setSelectedTestAvatarId(e.target.value)} 
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none"
                            >
                                <option value="">🎯 Hablarle a (Avatar)</option>
                                {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <select 
                                value={selectedTestKbId} 
                                onChange={(e) => setSelectedTestKbId(e.target.value)} 
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none"
                            >
                                <option value="">📚 Usar Conocimiento (KB)</option>
                                {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>

                        {/* Pantalla Resultados */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800 mb-4 shadow-inner">
                            
                            {aiMode === 'xray' && auditResult && (
                                <ExpertAuditReportV2 data={auditResult} />
                            )}

                            {aiMode === 'test' && (
                                <ExpertChatHistory messages={chatHistory} />
                            )}

                            {aiMode === 'amplify' && contentIdeas && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {contentIdeas.titulos_virales && (
                                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
                                            <h4 className="text-yellow-400 text-xs font-black uppercase mb-2 flex items-center gap-2">
                                                <Flame size={14}/> Títulos Virales
                                            </h4>
                                            <ul className="space-y-2">
                                                {contentIdeas.titulos_virales.map((titulo: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-yellow-500 shrink-0">{i + 1}.</span>
                                                        <span>{titulo}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {contentIdeas.frameworks_ensenanza && (
                                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                                            <h4 className="text-purple-400 text-xs font-black uppercase mb-2 flex items-center gap-2">
                                                <Brain size={14}/> Frameworks de Enseñanza
                                            </h4>
                                            <ul className="space-y-2">
                                                {contentIdeas.frameworks_ensenanza.map((fw: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-purple-500 shrink-0">•</span>
                                                        <span>{fw}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {contentIdeas.raw && (
                                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {contentIdeas.raw}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Estados Vacíos */}
                            {aiMode === 'xray' && !auditResult && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
                                    <Eye size={48} className="mb-4"/>
                                    <p className="text-sm text-center font-medium">
                                        Escaneo profundo de autoridad
                                    </p>
                                    <p className="text-xs text-center text-gray-700 mt-2">
                                        Encuentra puntos ciegos y optimiza
                                    </p>
                                </div>
                            )}

                            {aiMode === 'amplify' && !contentIdeas && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 p-6">
                                    <Zap size={48} className="mb-4"/>
                                    <p className="text-sm text-center font-medium">
                                        Generador de contenido
                                    </p>
                                    <p className="text-xs text-center text-gray-700 mt-2">
                                        Ideas virales para tu nicho
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="space-y-3">
                            {aiMode === 'xray' && (
                                <button 
                                    onClick={handleXRayAuthority} 
                                    disabled={isProcessing || !formData.niche} 
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/20"
                                >
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Eye size={14}/>} 
                                    {isProcessing ? 'ESCANEANDO...' : `X-RAY AUTHORITY (${COSTO_XRAY} CR)`}
                                </button>
                            )}

                            {aiMode === 'amplify' && (
                                <button 
                                    onClick={handleContentAmplifier} 
                                    disabled={isProcessing || !formData.name} 
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-xs font-black uppercase flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-yellow-900/20"
                                >
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Zap size={14}/>} 
                                    {isProcessing ? 'GENERANDO...' : `CONTENT AMPLIFIER (${COSTO_AMPLIFY} CR)`}
                                </button>
                            )}

                            {aiMode === 'test' && (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={chatInput} 
                                        onChange={(e) => setChatInput(e.target.value)} 
                                        onKeyPress={(e) => e.key === 'Enter' && handleVoiceTest()} 
                                        placeholder="Hazle una pregunta técnica..." 
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm outline-none"
                                    />
                                    <button 
                                        onClick={handleVoiceTest} 
                                        disabled={isProcessing || !chatInput} 
                                        className="absolute right-2 top-2 p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50 shadow-lg shadow-green-900/20"
                                    >
                                        {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        <style>{`
                .input-viral { 
                    width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; 
                    outline: none; transition: all 0.2s; 
                } 
                .input-viral:focus { 
                    border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); 
                } 
                .textarea-viral { 
                    width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; 
                    outline: none; resize: none; transition: all 0.2s; 
                } 
                .textarea-viral:focus { 
                    border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); 
                } 
                .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
            `}</style>
        </div>
    );
};