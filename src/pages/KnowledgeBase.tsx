import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Database, Upload, FileText, Link as LinkIcon, X, Trash2, 
    Save, Loader2, CheckCircle2, FileType 
} from 'lucide-react';

// --- MOTOR DE LECTURA PDF ---
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del Worker para leer PDFs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Resource {
    id: string;
    title: string;
    type: 'text' | 'url' | 'file';
    content?: string;
    file_size?: string; 
    created_at: string;
}

const BUCKET_NAME = 'Conocimientos del Usuario-TITAN APPS'; 

export const KnowledgeBase = () => {
    // Traemos 'isLoading' del Auth renombrado a 'authLoading'
    const { user, isLoading: authLoading } = useAuth();
    
    // --- ESTADOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputModalType, setInputModalType] = useState<'text' | 'url' | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); 
    const [resources, setResources] = useState<Resource[]>([]);

    // --- INPUTS ---
    const [titleValue, setTitleValue] = useState('');
    const [textInputValue, setTextInputValue] = useState('');
    const [urlInputValue, setUrlInputValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(true);

    // --- EFECTO PRINCIPAL BLINDADO (MODO SEGURO) ---
    useEffect(() => {
        isMounted.current = true;

        // 1. SI EL AUTH AÚN ESTÁ CARGANDO, NO HACEMOS NADA
        if (authLoading) return;

        // 2. SI YA TERMINÓ Y NO HAY USUARIO, APAGAMOS CARGA Y SALIMOS
        if (!user) {
            setIsLoading(false);
            return;
        }

        // 3. VÁLVULA DE SEGURIDAD: SI EN 4 SEGUNDOS NO CARGA, SE ABRE A LA FUERZA
        const safetyTimer = setTimeout(() => {
            if (isMounted.current && isLoading) {
                console.warn("⚠️ KnowledgeBase: Tiempo agotado. Forzando apertura.");
                setIsLoading(false);
            }
        }, 4000);

        const loadData = async () => {
            try {
                // Solo activamos spinner si la lista está vacía visualmente
                if (resources.length === 0) setIsLoading(true);
                
                const { data } = await supabase
                    .from('knowledge_base')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (isMounted.current) {
                    setResources(data || []);
                }
            } catch (error) { 
                console.error("Error cargando conocimientos:", error); 
            } finally {
                // SIEMPRE APAGAMOS AL TERMINAR (ÉXITO O ERROR)
                if (isMounted.current) {
                    setIsLoading(false);
                    clearTimeout(safetyTimer); // Cancelamos la válvula porque ya cargó bien
                }
            }
        };

        loadData();

        return () => { 
            isMounted.current = false;
            clearTimeout(safetyTimer);
        };
        // Dependencia segura: user?.id (String)
    }, [user?.id, authLoading]); 


    // --- 🧠 UTILIDAD: EXTRAER TEXTO DE PDF ---
    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `[Página ${i}]: ${pageText}\n\n`;
        }
        return fullText;
    };

    // --- GUARDAR TEXTO O URL ---
    const handleSaveInput = async () => {
        if (!titleValue || !user) return alert("Por favor, ponle un título.");
        const content = inputModalType === 'text' ? textInputValue : urlInputValue;
        if (!content) return alert("El contenido no puede estar vacío.");

        setIsUploading(true);
        try {
            const newResource = {
                user_id: user.id,
                title: titleValue,
                type: inputModalType,
                content: content,
                file_size: inputModalType === 'text' ? `${content.length} chars` : 'Enlace Web'
            };

            const { data, error } = await supabase.from('knowledge_base').insert(newResource).select().single();
            if (error) throw error;
            
            setResources([data, ...resources]);
            setIsModalOpen(false);
            resetForm();
            alert("✅ Conocimiento guardado.");
        } catch (error: any) { 
            alert(`Error: ${error.message}`); 
        } finally {
            setIsUploading(false);
        }
    };

    // --- BORRAR RECURSO ---
    const handleDelete = async (id: string) => {
        if(!confirm("¿Borrar este recurso?")) return;
        try {
            await supabase.from('knowledge_base').delete().eq('id', id);
            setResources(resources.filter(r => r.id !== id));
        } catch (error) { console.error(error); }
    };

    // --- CONTROL MODAL ---
    const openModal = (type: 'text' | 'url') => {
        setInputModalType(type);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setTitleValue('');
        setTextInputValue('');
        setUrlInputValue('');
    };

    // --- SUBIDA DE ARCHIVOS ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        
        if (file.size > 10 * 1024 * 1024) return alert("Máximo 10MB.");

        setIsUploading(true);
        setUploadStatus('Subiendo archivo...');
        
        try {
            let extractedContent = "";
            
            if (file.type === 'application/pdf') {
                setUploadStatus('Leyendo PDF (IA)...');
                try {
                    extractedContent = await extractTextFromPDF(file);
                } catch (readError) {
                    alert("No pudimos extraer el texto. Se guardará solo la referencia.");
                }
            } else if (file.type === 'text/plain') {
                extractedContent = await file.text();
            }

            // 1. Subir al Storage
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${user.id}/${Date.now()}-${safeName}`;
            
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME) 
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Guardar en DB
            const finalContent = extractedContent 
                ? `[FUENTE: ${file.name}]\n${extractedContent}` 
                : `Referencia de Archivo: ${filePath}`;

            const newResource = {
                user_id: user.id,
                title: file.name,
                type: 'file' as const, 
                content: finalContent, 
                file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB` 
            };

            const { data, error: dbError } = await supabase.from('knowledge_base').insert(newResource).select().single();
            if (dbError) throw dbError;

            setResources([data, ...resources]);
            alert("✅ Archivo guardado.");
            
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadStatus('');
            if (fileInputRef.current) fileInputRef.current.value = ''; 
        }
    };

    // --- RENDERIZADO DE CARGA ---
    // Solo mostramos el spinner si ESTÁ CARGANDO y ADEMÁS la lista está vacía.
    if (isLoading && resources.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin mb-4 text-indigo-500" size={40}/> 
                <span className="font-bold tracking-widest uppercase text-xs text-indigo-400 animate-pulse">
                    Sincronizando Cerebro Digital...
                </span>
            </div>
        );
    }

    // --- INTERFAZ PRINCIPAL ---
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4">
            
            {/* HEADER */}
            <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-indigo-600/10 rounded-2xl mb-2 border border-indigo-500/20">
                    <Database className="text-indigo-500" size={36}/>
                </div>
                <h1 className="text-3xl font-black text-white">Cerebro Digital</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Alimenta tu inteligencia artificial con PDFs, guías y notas estratégicas.
                </p>
                <div className="inline-block bg-green-900/20 border border-green-500/30 px-4 py-1.5 rounded-full mt-2">
                    <p className="text-green-400 font-bold text-xs flex items-center gap-2">
                        <CheckCircle2 size={14}/> Extracción automática de texto activada
                    </p>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* BOTÓN NOTA */}
                <div onClick={() => openModal('text')} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all text-gray-400 shadow-inner">
                        <FileText size={28} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Añadir Nota</h3>
                    <p className="text-xs text-gray-500 mt-2">Copys, bios o ideas rápidas.</p>
                </div>
                
                {/* BOTÓN SUBIR ARCHIVO */}
                <div onClick={() => fileInputRef.current?.click()} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-green-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-all text-gray-400 shadow-inner">
                        {isUploading ? <Loader2 className="animate-spin" size={28}/> : <Upload size={28}/>}
                    </div>
                    <h3 className="font-bold text-white text-lg">
                        {isUploading ? 'Procesando...' : 'Subir PDF / TXT'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {uploadStatus || 'La IA leerá el contenido.'}
                    </p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.txt" />
                </div>
                
                {/* BOTÓN URL */}
                <div onClick={() => openModal('url')} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all text-gray-400 shadow-inner">
                        <LinkIcon size={28}/>
                    </div>
                    <h3 className="font-bold text-white text-lg">Añadir URL</h3>
                    <p className="text-xs text-gray-500 mt-1">Webs y fuentes externas.</p>
                </div>
            </div>

            {/* LISTA DE RECURSOS */}
            <div className="space-y-4 pt-8 border-t border-gray-800">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Database size={20} className="text-indigo-500"/> Biblioteca de Conocimiento
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        {resources.length} Activos
                    </span>
                </div>
                
                {resources.length === 0 ? (
                    <div className="text-center py-24 bg-[#0B0E14] rounded-3xl border-2 border-dashed border-gray-800 text-gray-500 flex flex-col items-center">
                        <Database size={48} className="opacity-10 mb-4"/>
                        <p className="font-medium text-sm">Aún no has subido conocimientos.</p>
                        <p className="text-xs mt-1">Empieza subiendo un PDF con tu metodología.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {resources.map((res) => (
                            <div key={res.id} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 flex justify-between items-center hover:border-gray-600 transition-all group shadow-lg">
                                <div className="flex items-center gap-5 overflow-hidden">
                                    <div className={`p-3 rounded-2xl shrink-0 shadow-inner ${
                                        res.type === 'url' ? 'bg-purple-900/10 text-purple-400' : 
                                        res.type === 'file' ? 'bg-indigo-900/10 text-indigo-400' : 
                                        'bg-green-900/10 text-green-400'
                                    }`}>
                                        {res.type === 'url' ? <LinkIcon size={22}/> : res.type === 'file' ? <FileType size={22}/> : <FileText size={22}/>}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-bold text-base truncate pr-4">{res.title}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                            <span>{new Date(res.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                            <span>{res.file_size}</span>
                                            
                                            {/* Etiqueta especial si es contenido indexado por IA */}
                                            {res.type === 'file' && res.content?.startsWith('[FUENTE:') && (
                                                <span className="text-indigo-400 flex items-center gap-1.5 bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-500/20">
                                                    <CheckCircle2 size={10}/> IA INDEXED
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(res.id)} className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0B0E14] border border-gray-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {inputModalType === 'text' ? 'Añadir Nota Maestro' : 'Anclar URL Externa'}
                                </h2>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                    Knowledge Injection
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-gray-800 p-2 rounded-xl transition-all"><X size={20}/></button>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-black text-indigo-400 mb-2 uppercase tracking-tighter">Título del Recurso</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none font-bold placeholder-gray-600 transition-all shadow-inner" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} placeholder="Ej: Metodología Rocket 2025" autoFocus />
                            </div>
                            {inputModalType === 'text' ? (
                                <div>
                                    <label className="block text-xs font-black text-indigo-400 mb-2 uppercase tracking-tighter">Cuerpo de la Nota</label>
                                    <textarea className="w-full h-56 bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none resize-none font-medium placeholder-gray-600 shadow-inner" value={textInputValue} onChange={(e) => setTextInputValue(e.target.value)} placeholder="Pega aquí el texto que quieres que la IA aprenda..." />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-black text-indigo-400 mb-2 uppercase tracking-tighter">URL de Referencia</label>
                                    <input type="url" className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none font-bold placeholder-gray-600 shadow-inner" value={urlInputValue} onChange={(e) => setUrlInputValue(e.target.value)} placeholder="https://tupagina.com/blog-post" />
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 hover:text-white text-sm font-bold transition-all">Cancelar</button>
                            <button onClick={handleSaveInput} disabled={isUploading || !titleValue} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-95">
                                {isUploading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} GUARDAR CONOCIMIENTO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};