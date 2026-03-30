import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Search, Filter, FileText, Video, Calendar, MoreVertical, 
    Plus, Download, Youtube, Linkedin, RefreshCw, Eye 
} from 'lucide-react';

interface ProjectItem {
    id: string | number;
    title: string;
    content: string;
    date: string;
    platform: string;
    status: string;
    raw_data: any;
}

export const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) fetchAllProjects();
    }, [user]);

    // --- 💾 CARGA DE DATOS REALES (UNIFICACIÓN) ---
    const fetchAllProjects = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Consultamos las 3 tablas principales de creación
            const [scriptsRes, ideasRes, analysisRes] = await Promise.all([
                supabase.from('scripts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                supabase.from('viral_analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
            ]);

            const allProjects: ProjectItem[] = [
                ...(scriptsRes.data || []).map(s => ({
                    id: s.id,
                    title: `Guion: ${s.topic || 'Sin título'}`,
                    content: s.content?.substring(0, 100) || '',
                    date: new Date(s.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                    platform: s.platform || 'TikTok',
                    status: 'Finalizado',
                    raw_data: s
                })),
                ...(ideasRes.data || []).map(i => ({
                    id: i.id,
                    title: `Idea: ${i.topic || 'Sin título'}`,
                    content: i.generated_content?.substring(0, 100) || '',
                    date: new Date(i.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                    platform: 'General',
                    status: 'Borrador',
                    raw_data: i
                })),
                ...(analysisRes.data || []).map(a => ({
                    id: a.id,
                    title: `Análisis: ${a.title || 'Video'}`,
                    content: a.analysis_data?.critique?.substring(0, 100) || 'Autopsia viral completada.',
                    date: new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                    platform: a.platform || 'YouTube',
                    status: 'Finalizado',
                    raw_data: a
                }))
            ];

            // Ordenar por fecha global
            setProjects(allProjects.sort((a, b) => new Date(b.raw_data.created_at).getTime() - new Date(a.raw_data.created_at).getTime()));
        } catch (error) {
            console.error("Error cargando proyectos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 📥 FUNCIÓN DE EXPORTACIÓN JSON ---
    const handleExport = (project: ProjectItem) => {
        const jsonContent = JSON.stringify(project.raw_data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_titan.json`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`Proyecto '${project.title}' exportado con éxito.`);
    };

    const getPlatformIcon = (p: string) => {
        const platform = p.toLowerCase();
        if (platform.includes('tiktok')) return <Video size={14} className="text-cyan-400" />;
        if (platform.includes('youtube')) return <Youtube size={14} className="text-red-500" />;
        if (platform.includes('linkedin')) return <Linkedin size={14} className="text-blue-400" />;
        return <FileText size={14} className="text-gray-400" />;
    };

    const getStatusColor = (status: string) => {
        if (status === 'Finalizado') return 'bg-green-500/10 text-green-400 border-green-500/20';
        if (status === 'Borrador') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4">
            
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white">Mis Proyectos</h1>
                    <p className="text-gray-400">Todo tu trabajo estratégico en un solo lugar.</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-900 px-2 py-1 rounded border border-gray-800 text-gray-500">
                    {projects.length} TOTAL
                </span>
            </div>

            {/* BUSCADOR */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por título o plataforma..." 
                        className="w-full bg-[#0B0E14] border border-gray-800 rounded-2xl p-4 pl-12 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                    />
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-500">
                        <RefreshCw className="animate-spin inline mr-2 text-indigo-500"/> Sincronizando proyectos...
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full py-20 bg-[#0B0E14] rounded-3xl border-2 border-dashed border-gray-800 text-center text-gray-500 font-medium">
                        No se encontraron proyectos.
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div key={project.id} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-xl relative group hover:border-indigo-500/50 transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-900 rounded-xl border border-gray-800 text-gray-500">
                                    <FileText size={20} />
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </div>
                            </div>
                            
                            <h3 className="text-white font-bold text-base mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 flex-grow leading-relaxed">{project.content}</p>

                            <div className="mt-5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider border-t border-gray-800/50 pt-4">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {project.date}</span>
                                <span className="flex items-center gap-1.5">{getPlatformIcon(project.platform)} {project.platform}</span>
                            </div>
                            
                            {/* OVERLAY DE ACCIONES EN HOVER */}
                            <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                                <button 
                                    onClick={() => handleExport(project)}
                                    className="w-32 bg-white text-black font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    <Download size={14} /> EXPORTAR
                                </button>
                                <button 
                                    className="w-32 bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all active:scale-95"
                                >
                                    <Eye size={14} /> VER MÁS
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* TARJETA DE ACCIÓN RÁPIDA */}
                {!loading && (
                    <button 
                        onClick={() => window.location.href = '/dashboard/script-generator'}
                        className="flex flex-col items-center justify-center p-6 bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-2xl h-full hover:border-indigo-500 transition-all text-gray-600 hover:text-indigo-400 group"
                    >
                        <div className="p-3 bg-gray-900 rounded-full mb-2 group-hover:bg-indigo-900/30 transition-all">
                            <Plus size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Nuevo Script</span>
                    </button>
                )}
            </div>
        </div>
    );
};