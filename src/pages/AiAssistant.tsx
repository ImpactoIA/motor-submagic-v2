import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Send, Save, User, Bot, RefreshCw, BrainCircuit, Rocket, Copy,
    Users, BookOpen // <--- Iconos para los selectores
} from 'lucide-react';

export const AiAssistant = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', content: 'Bienvenido a tu Sala de Estrategia. Selecciona un Experto, un Avatar y una Base de Conocimiento arriba para comenzar.' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS DE CONTEXTO (LO QUE FALTABA) ---
  const [experts, setExperts] = useState<any[]>([]);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]); 
  
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedKbId, setSelectedKbId] = useState<string>(''); 

  const COSTO_MENTOR = 2;

  // Scroll automático al fondo del chat
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- CARGAR PERFILES Y CONOCIMIENTOS (V30) ---
  useEffect(() => {
      const fetchContext = async () => {
          if (!user) return;
          try {
              // 1. Expertos
              const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user.id);
              if (exp) setExperts(exp);
              
              // 2. Avatares
              const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
              if (av) setAvatars(av);

              // 3. Base de Conocimiento (CORRECCIÓN: Busca nombre o titulo para que aparezcan tus PDFs)
              const { data: kb, error } = await supabase.from('knowledge_bases').select('*').eq('user_id', user.id);
              
              if (kb && kb.length > 0) {
                  setKnowledgeBases(kb.map((k: any) => ({
                      id: k.id,
                      title: k.title || k.name || k.filename || "Documento sin nombre"
                  })));
              } else {
                  // Fallback por si la tabla se llama 'documents'
                  const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user.id);
                  if (docs) {
                      setKnowledgeBases(docs.map((d: any) => ({
                          id: d.id,
                          title: d.title || d.name || d.filename || "Documento"
                      })));
                  }
              }

              // Defaults del perfil
              if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
              if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
          } catch (e) { console.error("Error loading context:", e); }
      };
      fetchContext();
  }, [user, userProfile]);

  // --- 🚀 ENVÍO DE MENSAJE (CON CEREBRO V30) ---
  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    // Validación de Saldo
    if (userProfile && userProfile.tier !== 'admin' && userProfile.credits < COSTO_MENTOR) {
        if(confirm(`Saldo insuficiente. El Mentor requiere ${COSTO_MENTOR} créditos. ¿Deseas recargar?`)) {
             // Redirigir si tienes configurada la ruta
        }
        return;
    }

    // Agregar mensaje del usuario a la UI
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
        // Enviar al Backend INCLUYENDO EL CONTEXTO SELECCIONADO
        const { data, error } = await supabase.functions.invoke('process-url', {
            body: {
                selectedMode: 'mentor_ia',
                transcript: currentInput, 
                platform: 'Consultor IA',
                url: '', 
                expertId: selectedExpertId,     // <--- V30: ID del Experto
                avatarId: selectedAvatarId,     // <--- V30: ID del Avatar
                knowledgeBaseId: selectedKbId,  // <--- V30: ID del PDF
                estimatedCost: COSTO_MENTOR
            },
        });

        if (error) throw new Error(error.message || 'Error al conectar con el cerebro de Titan.');

        let botReply = "No pude generar una respuesta estratégica.";
        
        if (data.generatedData) {
            const res = data.generatedData;
            botReply = res.answer || res.generated_content || "Análisis completado.";
            
            // Si la respuesta viene estructurada con pasos o insights
            if (res.action_steps && Array.isArray(res.action_steps)) {
                botReply += "\n\n**🚀 Pasos recomendados:**\n" + res.action_steps.map((step: string) => `- ${step}`).join("\n");
            }
            if (res.key_insight) {
                botReply += `\n\n**💡 Insight:** ${res.key_insight}`;
            }
        }

        setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        if (refreshProfile) refreshProfile();

    } catch (error: any) {
        console.error("Error en Titan:", error);
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${error.message}` }]);
    } finally {
        setLoading(false);
    }
  };

  // Guardar sesión en Historial
  const handleSaveSession = async () => {
      if (messages.length < 2) return alert("Inicia la sesión antes de archivar.");
      setSaving(true);
      try {
          const firstUserMsg = messages.find(m => m.role === 'user')?.content || "Sesión Estratégica";
          const title = firstUserMsg.length > 40 ? firstUserMsg.substring(0, 40) + "..." : firstUserMsg;

          const { error } = await supabase.from('mentor_chats').insert({
              user_id: user?.id,
              title: title,
              messages: messages
          });

          if (error) throw error;
          alert("✅ Sesión archivada en el Baúl.");
      } catch (e: any) {
          alert(`Error al guardar: ${e.message}`);
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col pb-20 animate-in fade-in">
      
      {/* HEADER + BOTÓN GUARDAR */}
      <div className="flex justify-between items-center mb-4 px-2 pt-2">
          <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
                    <BrainCircuit className="text-indigo-400" size={24}/>
                  </div>
                  Consultor Estratégico IA
              </h1>
              <p className="text-gray-400 text-xs mt-1 ml-14">Tu consejo de sabios personal (V30).</p>
          </div>
          
          <button 
            onClick={handleSaveSession} 
            disabled={messages.length < 2 || saving} 
            className="group flex items-center gap-2 bg-[#0B0E14] hover:bg-gray-900 border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-xl text-gray-300 text-xs font-medium transition-all"
          >
            {saving ? <RefreshCw className="animate-spin text-indigo-500" size={14}/> : <Save size={14} className="group-hover:text-indigo-400 transition-colors"/>} 
            {saving ? 'Archivando...' : 'Guardar Sesión'}
          </button>
      </div>

      {/* --- BARRA DE CONTEXTO V30 (AQUÍ ESTÁN LOS 3 BOTONES) --- */}
      <div className="bg-[#0B0E14] border border-gray-800 rounded-t-2xl p-3 flex gap-3 overflow-x-auto border-b-0 shadow-lg z-20">
          
          {/* SELECTOR EXPERTO */}
          <div className="flex items-center gap-2 min-w-[180px] bg-gray-900/50 rounded-lg border border-gray-700/50 p-1">
              <div className="p-1.5 bg-indigo-900/20 rounded-md"><User size={14} className="text-indigo-400"/></div>
              <select 
                  value={selectedExpertId} 
                  onChange={(e) => setSelectedExpertId(e.target.value)}
                  className="bg-transparent text-[11px] font-medium text-white w-full outline-none cursor-pointer"
              >
                  <option value="">Selecciona Experto</option>
                  {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
          </div>

          {/* SELECTOR AVATAR */}
          <div className="flex items-center gap-2 min-w-[180px] bg-gray-900/50 rounded-lg border border-gray-700/50 p-1">
              <div className="p-1.5 bg-pink-900/20 rounded-md"><Users size={14} className="text-pink-400"/></div>
              <select 
                  value={selectedAvatarId} 
                  onChange={(e) => setSelectedAvatarId(e.target.value)}
                  className="bg-transparent text-[11px] font-medium text-white w-full outline-none cursor-pointer"
              >
                  <option value="">Selecciona Avatar</option>
                  {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
          </div>

          {/* SELECTOR CONOCIMIENTO */}
          <div className="flex items-center gap-2 min-w-[180px] bg-gray-900/50 rounded-lg border border-gray-700/50 p-1">
              <div className="p-1.5 bg-yellow-900/20 rounded-md"><BookOpen size={14} className="text-yellow-400"/></div>
              <select 
                  value={selectedKbId} 
                  onChange={(e) => setSelectedKbId(e.target.value)}
                  className="bg-transparent text-[11px] font-medium text-white w-full outline-none cursor-pointer"
              >
                  <option value="">Selecciona Base Conoc.</option>
                  {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
              </select>
          </div>
      </div>

      {/* ÁREA DE CHAT */}
      <div className="flex-1 bg-[#0B0E14] border border-gray-800 rounded-b-2xl p-0 overflow-hidden relative shadow-2xl flex flex-col rounded-tr-2xl"> 
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <BrainCircuit size={300} className="text-white"/>
          </div>

          {/* LISTA DE MENSAJES */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
              {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border ${
                          msg.role === 'user' ? 'bg-indigo-600 border-indigo-400' : 'bg-[#1A1D24] border-gray-700'
                      }`}>
                          {msg.role === 'user' ? <User size={14} className="text-white"/> : <Bot size={14} className="text-indigo-400"/>}
                      </div>
                      
                      <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm leading-6 shadow-md transition-all ${
                          msg.role === 'user' 
                          ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-indigo-900/20' 
                          : 'bg-[#1A1D24] border border-gray-800 text-gray-200 rounded-tl-none shadow-black/40'
                      }`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                              msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-400 flex items-center gap-1'
                          }`}>
                              {msg.role === 'user' ? 'Tú' : <><Rocket size={10} className="animate-pulse"/> Consultor IA</>}
                          </span>
                          <div className="whitespace-pre-wrap font-light tracking-wide">
                              {msg.content}
                          </div>
                          {msg.role === 'assistant' && (
                                <div className="mt-2 pt-2 border-t border-gray-800 flex justify-end opacity-50 hover:opacity-100 transition-opacity">
                                    <button onClick={() => {navigator.clipboard.writeText(msg.content); alert("Copiado!")}} className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px]" title="Copiar"><Copy size={10}/> Copiar</button>
                                </div>
                          )}
                      </div>
                  </div>
              ))}
              
              {loading && (
                  <div className="flex gap-4 relative z-10 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-8 h-8 rounded-full bg-[#1A1D24] border border-gray-700 flex items-center justify-center"><Bot size={14} className="text-indigo-400"/></div>
                      <div className="p-3 rounded-2xl bg-[#1A1D24] border border-gray-800 text-gray-400 text-xs flex items-center gap-3 shadow-lg">
                          <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
                          </div>
                          Analizando estrategia con tus datos...
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-[#0B0E14]/95 backdrop-blur-md border-t border-gray-800 absolute bottom-0 left-0 right-0 z-20">
              <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
                  <div className="relative flex-1 group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregúntame algo sobre tu estrategia..."
                        className="relative w-full bg-[#0F1218] text-white border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-indigo-500 focus:bg-[#13161C] transition-all placeholder-gray-500 font-medium shadow-inner text-sm"
                        disabled={loading}
                      />
                  </div>
                  <button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()} 
                    className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none transform active:scale-95"
                  >
                      {loading ? <RefreshCw className="animate-spin" size={20}/> : <Send size={20} strokeWidth={2.5}/>}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};