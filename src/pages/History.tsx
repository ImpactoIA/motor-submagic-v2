import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    FileText, Lightbulb, Zap, Trash2, Eye, X, Copy, 
    Calendar, User, MessageSquare, Database, RefreshCw, CheckCircle2
} from 'lucide-react';

interface HistoryItem {
    id: string;
    title: string;
    date: string;
    type: 'GUION' | 'MENTOR' | 'CALENDARIO' | 'VIRAL' | 'OTRO';
    data: any; 
}

export const History = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'GUION' | 'MENTOR' | 'CALENDARIO' | 'VIRAL'>('GUION');
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        if (user) fetchHistory();
    }, [user, activeTab]);

    const fetchHistory = async () => {
        setLoading(true);
        setItems([]);
        try {
            let data: any[] = [];
            
            // Lógica de Selección de Tablas V300
            if (activeTab === 'GUION') {
                const { data: scripts } = await supabase.from('scripts').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
                data = (scripts || []).map(s => ({ ...s, type: 'GUION', title: s.topic }));
            } 
            else if (activeTab === 'MENTOR') {
                const { data: chats } = await supabase.from('mentor_chats').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
                data = (chats || []).map(c => ({ ...c, type: 'MENTOR', title: c.title || 'Sesión de Mentoría' }));
            } 
            else if (activeTab === 'CALENDARIO') {
                const { data: events } = await supabase.from('calendar_events').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
                data = (events || []).map(e => ({ ...e, type: 'CALENDARIO', title: e.title }));
            }
            else if (activeTab === 'VIRAL') {
                // Viral Analyses & Recreations
                const { data: viral } = await supabase.from('viral_analyses').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
                data = (viral || []).map(v => ({ ...v, type: 'VIRAL', title: v.title || 'Análisis Viral' }));
            }

            // Normalizar para la UI
            const formattedItems: HistoryItem[] = data.map(item => ({
                id: item.id,
                title: item.title || "Sin Título",
                date: new Date(item.created_at).toLocaleDateString(),
                type: activeTab,
                data: item
            }));

            setItems(formattedItems);

        } catch (error) {
            console.error("Error historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar permanentemente?")) return;
        
        let table = '';
        if (activeTab === 'GUION') table = 'scripts';
        if (activeTab === 'MENTOR') table = 'mentor_chats';
        if (activeTab === 'CALENDARIO') table = 'calendar_events';
        if (activeTab === 'VIRAL') table = 'viral_analyses';

        if(table) {
            await supabase.from(table).delete().eq('id', id);
            setItems(prev => prev.filter(i => i.id !== id));
            setSelectedItem(null);
        }
    };

    // --- RENDERIZADO INTELIGENTE ---
    const renderModalContent = () => {
        if (!selectedItem) return null;
        const { type, data } = selectedItem;

        // Helper seguro para JSON
        const safeParse = (content: any) => {
            if (typeof content === 'object') return content;
            try { return JSON.parse(content); } catch { return null; }
        };

        // 1. GUION (SCRIPT)
        if (type === 'GUION') {
            const content = safeParse(data.content) || {};
            const structure = content.script_structure || content; // Soporte legacy
            return (
                <div className="space-y-6">
                    <div className="bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Gancho (0-3s)</span>
                        <p className="text-xl font-bold text-white leading-snug">{structure.hook || "Sin gancho detectado"}</p>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Cuerpo del Guion</span>
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-sm">{structure.body || structure.script_body || "Sin contenido"}</div>
                    </div>
                    <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20">
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block mb-2">Call to Action</span>
                        <p className="text-white font-bold">{structure.cta || "Sígueme para más."}</p>
                    </div>
                </div>
            );
        }

        // 2. MENTOR (CHAT)
        if (type === 'MENTOR') {
            const messages = safeParse(data.messages) || [];
            if (!Array.isArray(messages)) return <div className="text-red-400">Error: Formato de chat no válido.</div>;

            return (
                <div className="space-y-4">
                    {messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700'}`}>
                                <strong className="block text-[9px] uppercase mb-1 opacity-50 tracking-widest">{msg.role === 'user' ? 'TÚ' : 'MENTOR TITAN'}</strong>
                                {typeof msg.content === 'string' ? (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <div>
                                        <p className="mb-3">{msg.content.answer}</p>
                                        {msg.content.action_steps && (
                                            <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
                                                {msg.content.action_steps.map((step: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2 text-xs"><CheckCircle2 size={12} className="mt-0.5 text-green-400 shrink-0"/> {step}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // 3. CALENDARIO
        if (type === 'CALENDARIO') {
            return (
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
                    <span className="text-6xl mb-4 block">📅</span>
                    <h3 className="text-2xl font-black text-white mb-2">{data.title}</h3>
                    <div className="inline-flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-gray-800 rounded text-xs font-bold text-gray-400 border border-gray-700">{data.platform}</span>
                        <span className="px-3 py-1 bg-purple-900/20 rounded text-xs font-bold text-purple-400 border border-purple-500/20">{data.type}</span>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg text-left border border-gray-800">
                        <span className="text-[10px] uppercase text-gray-500 font-bold block mb-2">Notas Estratégicas</span>
                        <p className="text-gray-300 text-sm italic">"{data.notes}"</p>
                    </div>
                </div>
            );
        }

        // Default: JSON Viewer
        return <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-xs text-green-400 font-mono">{JSON.stringify(data, null, 2)}</pre>;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <Database className="text-yellow-500"/> BAÚL CREATIVO
                </h1>
                <p className="text-gray-400 text-sm">Tu repositorio de activos digitales.</p>
            </div>

            {/* TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800 scrollbar-hide">
                {[
                    { id: 'GUION', label: 'Guiones', icon: FileText },
                    { id: 'MENTOR', label: 'Mentoría', icon: MessageSquare },
                    { id: 'CALENDARIO', label: 'Estrategia', icon: Calendar },
                    { id: 'VIRAL', label: 'Análisis Viral', icon: Zap },
                ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl whitespace-nowrap transition-all font-black text-xs uppercase tracking-wider ${activeTab === tab.id ? 'bg-[#1A1D24] text-white border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}>
                        <tab.icon size={14}/> {tab.label}
                    </button>
                ))}
            </div>

            {/* LISTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center text-indigo-500"><RefreshCw className="animate-spin"/></div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-20 bg-[#0B0E14] border-2 border-dashed border-gray-800 rounded-2xl text-center text-gray-600 font-bold uppercase tracking-widest text-sm">
                        Vacío
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer group hover:bg-gray-900/30">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">{item.date}</span>
                                <span className="bg-indigo-900/20 text-indigo-400 text-[9px] font-black px-2 py-1 rounded border border-indigo-500/20 uppercase">{item.type}</span>
                            </div>
                            <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                            <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                                <button className="p-2 text-gray-600 hover:text-white"><Eye size={14}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#0f1115] border border-gray-800 w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-3xl">
                            <div>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">{selectedItem.type}</span>
                                <h2 className="text-lg font-bold text-white line-clamp-1">{selectedItem.title}</h2>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"><X size={18}/></button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            {renderModalContent()}
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex justify-end rounded-b-3xl">
                            <button onClick={() => { 
                                const content = document.querySelector('.custom-scrollbar')?.textContent;
                                if(content) { navigator.clipboard.writeText(content); alert("Copiado"); }
                            }} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-gray-200 transition-all uppercase tracking-wide">
                                <Copy size={14}/> Copiar Todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};