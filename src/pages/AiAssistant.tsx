import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Send, Save, User, Bot, RefreshCw, BrainCircuit, Rocket, Copy,
    Users, BookOpen, Trash2, History, MessageSquare, Sparkles
} from 'lucide-react';

export const AiAssistant = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  
// --- ESTADOS ---
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', content: 'Bienvenido a tu Sala de Guerra. Selecciona tus activos estratégicos arriba para comenzar.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 🔥 NUEVO: Estado para la Memoria del Mentor V500 (Ideas/Guiones previos)
  const [previousData, setPreviousData] = useState<any>({});

  // Historial de Chats
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- CONTEXTO V30 ---
  const [experts, setExperts] = useState<any[]>([]);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]); 
  
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedKbId, setSelectedKbId] = useState<string>(''); 

  const COSTO_MENTOR = 2;

  // Scroll automático
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 🔥 NUEVO: Cargar Memoria Local (Conexión V500)
  // Esto permite que el Mentor "vea" lo que acabas de generar en otras pestañas
  useEffect(() => {
      try {
          const ideas = localStorage.getItem('last_ideas_generated');
          const guion = localStorage.getItem('last_script_generated');
          const juez = localStorage.getItem('last_analysis_result'); // Si tienes Juez Viral

          const loadedData: any = {};
          
          if (ideas) loadedData.ideas_generadas = JSON.parse(ideas);
          if (guion) loadedData.guion_generado = JSON.parse(guion);
          if (juez) loadedData.analisis_juez = JSON.parse(juez);
          
          setPreviousData(loadedData);
          
          if (Object.keys(loadedData).length > 0) {
              console.log("🧠 [MENTOR] Memoria activa cargada:", loadedData);
          }
      } catch (e) {
          console.error("Error leyendo memoria local:", e);
      }
  }, []);

  // --- CARGA INICIAL (Contexto y Historial) ---
  useEffect(() => {
      const init = async () => {
          if (!user) return;
          await fetchContext();
          await fetchHistory();
      };
      init();
  }, [user]);
  
  const fetchContext = async () => {
      try {
          const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
          if (exp) setExperts(exp);
          
          const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
          if (av) setAvatars(av);

          const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
          if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));

          if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
          if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
      } catch (e) { console.error(e); }
  };

  const fetchHistory = async () => {
      try {
          const { data } = await supabase.from('mentor_chats').select('id, title, created_at').eq('user_id', user?.id).order('created_at', { ascending: false });
          if (data) setChatHistory(data);
      } catch (e) { console.error(e); }
  };

  // --- CARGAR CHAT ANTIGUO ---
  const loadChat = async (chatId: string) => {
      try {
          const { data } = await supabase.from('mentor_chats').select('messages').eq('id', chatId).single();
          if (data) {
              setMessages(data.messages);
              setShowHistory(false);
          }
      } catch (e) { console.error(e); }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    // Validar Saldo
    if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_MENTOR) {
        if(!confirm(`Saldo insuficiente (${COSTO_MENTOR} créditos). ¿Recargar?`)) return;
        return;
    }

    const currentInput = input;
    const userMsg = { role: 'user', content: currentInput };
    
    // Actualizamos UI visualmente rápido
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const { data, error } = await supabase.functions.invoke('process-url', {
            body: {
                // 🔥 CAMBIO CRÍTICO 1: El modo correcto para V500
                selectedMode: 'chat_mentor', 
                userInput: currentInput, 

                // 🔥 CAMBIO CRÍTICO 2: Enviamos el perfil completo + selecciones
                context: {
                    ...userProfile,
                    active_expert_id: selectedExpertId,
                    active_avatar_id: selectedAvatarId
                },

                // 🔥 CAMBIO CRÍTICO 3: La Memoria (Ideas/Guiones previos)
                // Asegúrate de haber agregado el estado 'previousData' como vimos antes
                previousData: previousData, 
                
                // Extras
                knowledgeBaseId: selectedKbId, 
                estimatedCost: COSTO_MENTOR
            },
        });

        if (error) throw error;

        const res = data.generatedData;
        
        // 🔥 CAMBIO CRÍTICO 4: Leemos el nuevo formato JSON del Mentor
        let botReply = res.respuesta_mentor || res.answer || "Análisis estratégico completado.";

        // Si el Mentor nos da un "Siguiente Paso" claro, lo mostramos bonito
        if (res.siguiente_paso?.accion_inmediata) {
            botReply += `\n\n🚀 **TU SIGUIENTE PASO:** ${res.siguiente_paso.accion_inmediata}`;
        }
        
        // Si hay advertencias de riesgo para la marca
        if (res.advertencias && res.advertencias.length > 0) {
            botReply += `\n\n⚠️ **ADVERTENCIA:** ${res.advertencias[0]}`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        if (refreshProfile) refreshProfile();

    } catch (error: any) {
        console.error("Error Mentor:", error);
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error de conexión: ${error.message}` }]);
    } finally {
        setLoading(false);
    }
  };

  // --- GUARDAR SESIÓN ---
  const handleSaveSession = async () => {
      if (messages.length < 2) return;
      setSaving(true);
      try {
          const firstUserMsg = messages.find(m => m.role === 'user')?.content || "Nueva Sesión";
          const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? "..." : "");

          await supabase.from('mentor_chats').insert({
              user_id: user?.id,
              title: title,
              messages: messages
          });
          
          await fetchHistory();
          alert("✅ Sesión guardada en el historial.");
      } catch (e: any) { alert(`Error: ${e.message}`); } 
      finally { setSaving(false); }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(!confirm("¿Borrar chat?")) return;
      await supabase.from('mentor_chats').delete().eq('id', id);
      await fetchHistory();
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex gap-6 pb-4 animate-in fade-in p-4">
      
      {/* SIDEBAR HISTORIAL (Opcional en móvil) */}
      <div className={`w-64 flex-shrink-0 bg-[#0B0E14] border border-gray-800 rounded-2xl flex flex-col overflow-hidden transition-all ${showHistory ? 'translate-x-0' : '-translate-x-full absolute z-30 h-full md:relative md:translate-x-0'}`}>
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <History size={14}/> Historial
              </span>
              <button onClick={() => setMessages([{ role: 'system', content: 'Nueva sesión iniciada.' }])} className="p-1.5 hover:bg-white/10 rounded-lg text-white" title="Nuevo Chat">
                  <PlusIcon size={14}/>
              </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {chatHistory.map(chat => (
                  <div key={chat.id} onClick={() => loadChat(chat.id)} className="p-3 hover:bg-gray-800/50 rounded-xl cursor-pointer group flex justify-between items-center transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <MessageSquare size={14} className="text-indigo-500 flex-shrink-0"/>
                          <span className="text-xs text-gray-300 truncate">{chat.title}</span>
                      </div>
                      <button onClick={(e) => handleDeleteChat(chat.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-opacity">
                          <Trash2 size={12}/>
                      </button>
                  </div>
              ))}
              {chatHistory.length === 0 && <div className="text-center text-xs text-gray-600 mt-10">Sin historial</div>}
          </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col bg-[#0B0E14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* HEADER CONTEXTO */}
          <div className="p-3 border-b border-gray-800 bg-[#0F1218] flex flex-col md:flex-row gap-3 items-center justify-between z-20">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                  
                  {/* Toggle History Mobile */}
                  <button onClick={() => setShowHistory(!showHistory)} className="md:hidden p-2 text-gray-400"><History size={18}/></button>

                  <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1.5 border border-gray-700/50">
                      <User size={12} className="text-indigo-400 ml-1"/>
                      <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="bg-transparent text-[10px] text-white w-24 outline-none cursor-pointer"><option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1.5 border border-gray-700/50">
                      <Users size={12} className="text-pink-400 ml-1"/>
                      <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="bg-transparent text-[10px] text-white w-24 outline-none cursor-pointer"><option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1.5 border border-gray-700/50">
                      <BookOpen size={12} className="text-yellow-400 ml-1"/>
                      <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="bg-transparent text-[10px] text-white w-24 outline-none cursor-pointer"><option value="">Conocimiento</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}</select>
                  </div>
              </div>
              
              <button onClick={handleSaveSession} disabled={saving} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                  {saving ? <RefreshCw size={12} className="animate-spin"/> : <Save size={12}/>} Guardar
              </button>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gradient-to-b from-[#0B0E14] to-[#080a0f] relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                  <BrainCircuit size={400} className="text-white"/>
              </div>

              {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 relative z-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-400' : 'bg-gray-800 border-gray-600'}`}>
                          {msg.role === 'user' ? <User size={14} className="text-white"/> : <Sparkles size={14} className="text-indigo-400"/>}
                      </div>
                      
                      <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
                          msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-[#1A1D24] border border-gray-700 text-gray-200 rounded-tl-none'
                      }`}>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          {msg.role === 'assistant' && (
                              <button onClick={() => navigator.clipboard.writeText(msg.content)} className="mt-3 text-[10px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                  <Copy size={10}/> Copiar
                              </button>
                          )}
                      </div>
                  </div>
              ))}
              
              {loading && (
                  <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center"><RefreshCw size={14} className="animate-spin text-indigo-400"/></div>
                      <div className="p-3 rounded-2xl bg-[#1A1D24] border border-gray-700 text-gray-400 text-xs">
                          Analizando estrategia...
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-[#0B0E14] border-t border-gray-800">
              <div className="relative flex items-center max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Haz una pregunta estratégica..."
                    className="w-full bg-[#13161C] text-white border border-gray-700 rounded-xl px-5 py-4 pr-16 outline-none focus:border-indigo-500 transition-all placeholder-gray-600 shadow-inner text-sm"
                    disabled={loading}
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()} 
                    className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
                  >
                      {loading ? <RefreshCw className="animate-spin" size={18}/> : <Send size={18}/>}
                  </button>
              </div>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                  Titan V300 puede cometer errores. Verifica la información importante.
              </p>
          </div>
      </div>
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
    </div>
  );
};

// Icono Helper
const PlusIcon = ({size}: {size: number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;