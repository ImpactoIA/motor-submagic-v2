import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    FileText, Lightbulb, Mic, Trash2, Eye, X, Copy, 
    Calendar, Briefcase, Database, RefreshCw, Zap, User
} from 'lucide-react';

interface HistoryItem {
    id: string | number;
    title: string;
    date: string;
    cost: number;
    type: 'GUION' | 'IDEA' | 'AUDITORÍA' | 'TRANSCRIPCIÓN' | 'RECREACIÓN' | 'BLUEPRINT' | 'EXPERTO' | 'AVATAR' | 'MENTOR';
    score?: number | string;
    data: any; 
}

type TabType = 'TODOS' | 'GUION' | 'IDEA' | 'AUDITORÍA' | 'TRANSCRIPCIÓN' | 'RECREACIÓN' | 'BLUEPRINT' | 'EXPERTO' | 'AVATAR';

const HISTORY_TABLES_MAP = [
    { name: 'scripts', type: 'GUION', titleKey: 'topic' },
    { name: 'ideas', type: 'IDEA', titleKey: 'topic' },
    { name: 'viral_analyses', type: 'AUDITORÍA', titleKey: 'title' },
    { name: 'transcriptions', type: 'TRANSCRIPCIÓN', titleKey: 'video_title' },
    { name: 'viral_recreations', type: 'RECREACIÓN', titleKey: 'original_url' },
    { name: 'expert_profiles', type: 'EXPERTO', titleKey: 'name' },
    { name: 'avatars', type: 'AVATAR', titleKey: 'name' },
];

export const History: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    
    const [activeTab, setActiveTab] = useState<TabType>('TODOS');
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        // 1. SI AUTH ESTÁ CARGANDO, ESPERAMOS (NO HACEMOS NADA)
        if (authLoading) return;

        // 2. SI YA NO HAY AUTH Y NO HAY USUARIO, APAGAMOS Y SALIMOS
        if (!user) {
            setLoading(false);
            return;
        }

        // 3. VÁLVULA DE SEGURIDAD: SI EN 4 SEGUNDOS NO CARGA, FORZAMOS EL APAGADO
        const safetyTimer = setTimeout(() => {
            if (isMounted.current) {
                console.warn("⚠️ History: Tiempo de espera agotado. Forzando visualización.");
                setLoading(false);
            }
        }, 4000);

        const fetchData = async () => {
            try {
                // Solo ponemos loading true si no hay items (para evitar parpadeo visual)
                if (items.length === 0) setLoading(true);

                const promises = HISTORY_TABLES_MAP.map(async (table) => {
                    // Protegemos cada llamada individualmente
                    try {
                        const { data } = await supabase
                            .from(table.name)
                            .select('*')
                            .eq('user_id', user.id)
                            .order('created_at', { ascending: false });
                        
                        return (data || []).map(item => ({
                            id: item.id,
                            title: item[table.titleKey] || item.video_title || item.title || item.topic || `Archivo sin nombre`,
                            date: new Date(item.created_at).toLocaleDateString(),
                            cost: item.cost_credits || 0,
                            type: table.type as HistoryItem['type'],
                            score: item.score || item.viralScore || 'N/A', 
                            data: item, 
                        }));
                    } catch (e) {
                        return []; // Si una tabla falla, retornamos array vacío y seguimos
                    }
                });

                const resultsArrays = await Promise.all(promises);
                const allResults = resultsArrays.flat().sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());
                
                if (isMounted.current) {
                    setItems(allResults);
                }
            } catch (error) {
                console.error("Error general historial:", error);
            } finally {
                // ESTO SE EJECUTA SIEMPRE, HAYA ERROR O NO
                if (isMounted.current) {
                    setLoading(false);
                    clearTimeout(safetyTimer); // Cancelamos el timer de seguridad porque ya terminó bien
                }
            }
        };

        fetchData();

        return () => { 
            isMounted.current = false;
            clearTimeout(safetyTimer);
        };
        // Dependencia vital: user?.id (String) para evitar bucles de objetos
    }, [user?.id, authLoading]); 
    
    const filteredByTab = activeTab === 'TODOS' ? items : items.filter(item => item.type === activeTab);

    const handleDelete = async (item: HistoryItem) => {
        if (!confirm(`¿Eliminar definitivamente este archivo?`)) return;
        const table = HISTORY_TABLES_MAP.find(t => t.type === item.type);
        if (!table) return;

        const { error } = await supabase.from(table.name).delete().eq('id', item.id);
        if (!error) {
            setItems(prev => prev.filter(i => i.id !== item.id)); 
            setSelectedItem(null);
        }
    };

    const renderModalContent = () => {
        if (!selectedItem) return null;
        const { type, data } = selectedItem;
        const parseContent = (c: any) => {
            if (typeof c === 'string') { try { return JSON.parse(c); } catch { return c; } }
            return c;
        };

        if (type === 'GUION') {
            const content = parseContent(data.content);
            const body = content.script_body || content.script || content;
            return (
                <div className="space-y-6">
                    <div className="bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20 grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-indigo-400 block font-bold">GANCHO</span><p>{data.hook_type || 'N/A'}</p></div>
                        <div><span className="text-indigo-400 block font-bold">FORMATO</span><p>{data.format_type || 'General'}</p></div>
                    </div>
                    <div className="bg-[#1A1D24] p-6 rounded-xl text-gray-300 leading-relaxed whitespace-pre-wrap border border-gray-800 font-mono text-sm">
                        {typeof body === 'string' ? body.replace(/\\n/g, '\n') : JSON.stringify(body, null, 2)}
                    </div>
                </div>
            );
        }
        if (type === 'IDEA') {
            const parsed = parseContent(data.content || data.generated_content);
            const ideas = Array.isArray(parsed) ? parsed : (parsed.ideas || []);
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
                        <span className="text-yellow-500 font-bold block">TEMA</span><p className="text-white font-bold">{data.topic}</p>
                    </div>
                    {ideas.map((idea: any, i: number) => (
                        <div key={i} className="bg-[#1A1D24] p-4 rounded-xl border border-gray-800">
                            <h5 className="text-indigo-400 font-bold mb-1">{idea.title}</h5>
                            <p className="text-gray-300 text-sm mb-3">{idea.angle || idea.description}</p>
                        </div>
                    ))}
                </div>
            );
        }
        if (type === 'EXPERTO' || type === 'AVATAR') {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 p-3 rounded-lg"><span className="text-gray-500 text-xs block">NOMBRE</span><p className="font-bold text-white">{data.name}</p></div>
                        <div className="bg-gray-900 p-3 rounded-lg"><span className="text-gray-500 text-xs block">NICHO</span><p className="font-bold text-white">{data.niche || data.edad || 'N/A'}</p></div>
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-[#1A1D24] p-4 rounded-xl text-gray-400 text-xs font-mono overflow-auto">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    if (loading && items.length === 0) {
         return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-white">
                <RefreshCw className="animate-spin mb-4 text-indigo-500" size={40}/> 
                <span className="font-bold tracking-widest uppercase text-xs text-indigo-400 animate-pulse">Sincronizando Baúl...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Database className="text-indigo-500"/> Baúl Creativo</h1>
                <p className="text-gray-400">Tu biblioteca centralizada de activos digitales.</p>
            </div>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-800 scrollbar-hide">
                {[
                    { id: 'TODOS', label: 'Todo', icon: Database },
                    { id: 'GUION', label: 'Guiones', icon: FileText },
                    { id: 'IDEA', label: 'Ideas', icon: Lightbulb },
                    { id: 'AUDITORÍA', label: 'Auditorías', icon: Zap },
                    { id: 'TRANSCRIPCIÓN', label: 'Textos', icon: Mic },
                    { id: 'EXPERTO', label: 'Perfiles', icon: Briefcase },
                    { id: 'AVATAR', label: 'Avatares', icon: User },
                ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#1A1D24] text-white border-b-2 border-indigo-500 shadow-lg' : 'text-gray-500 hover:text-gray-300'} text-sm font-bold`}>
                        <tab.icon size={16}/> {tab.label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredByTab.length === 0 ? (
                    <div className="col-span-full py-20 bg-[#0B0E14] rounded-2xl border-2 border-dashed border-gray-800 text-center text-gray-500 font-medium">Esta sección está vacía.</div>
                ) : (
                    filteredByTab.map((item) => (
                        <div key={item.id} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xl group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                                    <span className="text-[9px] px-2 py-1 rounded bg-gray-900 text-indigo-400 font-black border border-indigo-500/20">{item.type}</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-4 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                                <button onClick={() => handleDelete(item)} className="p-2 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                <button onClick={() => setSelectedItem(item)} className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2"><Eye size={14}/> ABRIR ACTIVO</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {selectedItem && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0B0E14] border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                            <div>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">{selectedItem.type}</span>
                                <h2 className="text-xl font-bold text-white truncate max-w-lg">{selectedItem.title}</h2>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white bg-gray-800 p-2.5 rounded-xl transition-all"><X size={20}/></button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#0B0E14]">{renderModalContent()}</div>
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                             <button onClick={() => { const node = document.querySelector('.custom-scrollbar'); if(node && node.textContent) { navigator.clipboard.writeText(node.textContent); alert("Copiado al portapapeles 🚀"); }}} className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 font-black text-xs px-8 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95"><Copy size={16}/> COPIAR CONTENIDO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};