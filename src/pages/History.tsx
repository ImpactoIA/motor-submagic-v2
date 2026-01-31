import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    FileText, Lightbulb, Calendar as CalendarIcon, Search, 
    Trash2, Copy, Eye, X, Filter, Clock, ArrowRight, Video
} from 'lucide-react';

// ==================================================================================
// 1. TIPOS UNIFICADOS
// ==================================================================================

interface HistoryItem {
    id: string;
    source_table: 'viral_generations' | 'content_items';
    type: string; // 'script', 'idea', 'event'
    title: string;
    content: any; // El JSON completo
    created_at: string;
    platform: string;
}

export const History = () => {
    const { user } = useAuth();
    
    // --- ESTADOS ---
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'scripts' | 'ideas'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- ESTADOS DEL VISOR (MODAL) ---
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ==================================================================================
    // 2. CARGA DE DATOS (FUSIÓN DE TABLAS)
    // ==================================================================================
    
    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            // 1. Traer Guiones (viral_generations)
            const { data: scripts, error: err1 } = await supabase
                .from('viral_generations')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (err1) console.error("Error fetching scripts:", err1);

            // 2. Traer Ideas y Eventos (content_items)
            const { data: content, error: err2 } = await supabase
                .from('content_items')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (err2) console.error("Error fetching content:", err2);

            // 3. Normalizar y Unir Guiones
            const normalizedScripts: HistoryItem[] = (scripts || []).map(s => ({
                id: s.id,
                source_table: 'viral_generations',
                type: 'script',
                // Intentamos sacar el título del metadata, si no, del tema directo
                title: s.content?.metadata_guion?.tema_tratado || s.content?.topic || "Guion Sin Título",
                content: s.content,
                created_at: s.created_at,
                platform: s.platform || 'General'
            }));

            // 4. Normalizar y Unir Contenido
            const normalizedContent: HistoryItem[] = (content || []).map(c => ({
                id: c.id,
                source_table: 'content_items',
                type: c.type === 'idea' ? 'idea' : 'event',
                title: c.title || "Sin Título",
                content: c.content,
                created_at: c.created_at,
                platform: c.platform || 'General'
            }));

            // 5. Combinar y ordenar por fecha descendente
            const combined = [...normalizedScripts, ...normalizedContent].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setItems(combined);

        } catch (e) {
            console.error("Error general en historial:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // ==================================================================================
    // 3. ACCIONES
    // ==================================================================================

    const handleDelete = async (id: string, table: string) => {
        if (!confirm("¿Estás seguro de eliminar este ítem? No se puede deshacer.")) return;

        try {
            await supabase.from(table).delete().eq('id', id);
            // Actualizar estado local
            setItems(prev => prev.filter(item => item.id !== id));
            setIsModalOpen(false);
        } catch (e) {
            alert("Error al eliminar");
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado al portapapeles");
    };

    const openDetails = (item: HistoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Filtrado local
    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = 
            filter === 'all' ? true :
            filter === 'scripts' ? item.type === 'script' :
            filter === 'ideas' ? (item.type === 'idea' || item.type === 'event') : true;
        
        return matchesSearch && matchesType;
    });

    // ==================================================================================
    // 4. RENDERIZADO
    // ==================================================================================

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 font-sans text-white animate-in fade-in">
            
            {/* HEADER & CONTROLES */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2 text-white">
                        <Clock className="text-indigo-500" size={32}/> 
                        BAÚL CREATIVO
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Tu historial de viralidad. Todo lo que has creado está aquí.
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}>Todo</button>
                        <button onClick={() => setFilter('scripts')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'scripts' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>Guiones</button>
                        <button onClick={() => setFilter('ideas')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'ideas' ? 'bg-yellow-600 text-white' : 'text-gray-500 hover:text-white'}`}>Ideas</button>
                    </div>
                </div>
            </div>

            {/* LISTA DE ITEMS */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Recuperando archivos...</p>
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                            
                            {/* Icono de fondo decorativo */}
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                {item.type === 'script' ? <FileText size={100}/> : item.type === 'idea' ? <Lightbulb size={100}/> : <CalendarIcon size={100}/>}
                            </div>

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${
                                        item.type === 'script' ? 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30' : 
                                        item.type === 'idea' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 
                                        'bg-purple-900/30 text-purple-400 border-purple-500/30'
                                    }`}>
                                        {item.type === 'script' ? 'GUION IA' : item.type === 'idea' ? 'IDEA RÁPIDA' : 'EVENTO'}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-bold text-white mb-2 line-clamp-2 leading-tight min-h-[3rem]">
                                    {item.title}
                                </h3>
                                
                                <p className="text-xs text-gray-400 line-clamp-3 mb-4 min-h-[3rem]">
                                    {/* Preview inteligente del contenido */}
                                    {item.type === 'script' 
                                        ? (item.content?.guion_completo ? item.content.guion_completo.substring(0, 100) + "..." : "Guion generado.")
                                        : (item.content?.concepto || item.content?.description || "Sin descripción previa.")}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                                <button 
                                    onClick={() => openDetails(item)}
                                    className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Eye size={14}/> Ver Todo
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id, item.source_table)}
                                    className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
                    <Filter size={48} className="mx-auto text-gray-700 mb-4"/>
                    <h3 className="text-xl font-bold text-white mb-2">No se encontraron ítems</h3>
                    <p className="text-gray-500 text-sm">Prueba cambiando los filtros o genera nuevo contenido.</p>
                </div>
            )}

            {/* MODAL DETALLES */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
                        
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <span className="text-xs text-indigo-400 font-black uppercase tracking-widest block mb-1">
                                    {selectedItem.type === 'script' ? 'Detalle del Guion' : 'Detalle de la Idea'}
                                </span>
                                <h2 className="text-xl font-bold text-white max-w-md truncate">{selectedItem.title}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X size={24}/>
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            
                            {/* CONTENIDO DINÁMICO SEGÚN TIPO */}
                            {selectedItem.type === 'script' ? (
                                <>
                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-gray-500 block mb-1">Estructura</span>
                                                <span className="text-white font-bold">{selectedItem.content?.metadata_guion?.arquitectura || "N/A"}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block mb-1">Plataforma</span>
                                                <span className="text-white font-bold">{selectedItem.platform}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Guion Completo</label>
                                        <div className="bg-black p-6 rounded-xl border border-gray-800 text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                            {selectedItem.content?.guion_completo || "Contenido no disponible"}
                                        </div>
                                    </div>

                                    {selectedItem.content?.plan_visual && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Video size={12}/> Plan Visual</label>
                                            <div className="space-y-2">
                                                {selectedItem.content.plan_visual.map((sc: any, idx: number) => (
                                                    <div key={idx} className="flex gap-4 p-3 bg-gray-900/30 rounded border border-gray-800/50">
                                                        <span className="text-xs font-mono text-gray-500 w-12">{sc.tiempo}</span>
                                                        <span className="text-xs text-white">{sc.accion_en_pantalla}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // VISTA PARA IDEAS / EVENTOS
                                <div className="space-y-6">
                                    <div className="bg-yellow-900/10 p-6 rounded-xl border border-yellow-500/20">
                                        <h3 className="text-lg font-bold text-yellow-400 mb-2">Concepto Principal</h3>
                                        <p className="text-white text-lg leading-relaxed">
                                            {selectedItem.content?.concepto || selectedItem.content?.description || "Sin descripción"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                                            <span className="text-gray-500 text-xs block mb-1">Ángulo / Objetivo</span>
                                            <span className="text-white font-bold text-sm">
                                                {selectedItem.content?.angulo || selectedItem.content?.objetivo || "General"}
                                            </span>
                                        </div>
                                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                                            <span className="text-gray-500 text-xs block mb-1">Formato</span>
                                            <span className="text-white font-bold text-sm">
                                                {selectedItem.content?.formato || "Video Corto"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="p-6 border-t border-gray-800 bg-gray-900/30 flex justify-end gap-3">
                            <button 
                                onClick={() => handleCopy(
                                    selectedItem.type === 'script' 
                                    ? selectedItem.content?.guion_completo 
                                    : `${selectedItem.title}\n${selectedItem.content?.concepto || ''}`
                                )}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Copy size={18}/> Copiar Contenido
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #111; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }`}</style>
        </div>
    );
};