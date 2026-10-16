import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Download, Eye, Edit3, Columns, 
  Sun, Moon, BookOpen, HardDrive, Printer, List
} from 'lucide-react';
import { DocumentItem, ViewMode, ThemeMode } from './types';
import { db, createNewDocument, getAllDocuments, deleteDocument } from './db/database';
import { useAutosave } from './hooks/useAutosave';
import { useWordCount } from './hooks/useWordCount';
import { CodeEditor } from './components/Editor/CodeEditor';
import { LivePreview } from './components/Preview/LivePreview';
import { downloadMarkdownFile, exportAllBackupJSON, triggerPDFExport } from './utils/exportUtils';

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocumentItem | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function initDocs() {
      const docs = await getAllDocuments();
      if (docs.length === 0) {
        const firstDoc = await createNewDocument('Welcome to Draftmark', '# Welcome to Draftmark\n\nStart writing markdown locally!');
        setDocuments([firstDoc]);
        setCurrentDoc(firstDoc);
        setContent(firstDoc.content);
        setTitle(firstDoc.title);
      } else {
        setDocuments(docs);
        setCurrentDoc(docs[0]);
        setContent(docs[0].content);
        setTitle(docs[0].title);
      }
    }
    initDocs();
  }, []);

  const { status } = useAutosave(currentDoc?.id || null, content, title);
  const stats = useWordCount(content);

  const handleSelectDoc = (doc: DocumentItem) => {
    setCurrentDoc(doc);
    setContent(doc.content);
    setTitle(doc.title);
  };

  const handleCreateNew = async () => {
    const newDoc = await createNewDocument();
    const updated = await getAllDocuments();
    setDocuments(updated);
    handleSelectDoc(newDoc);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this document? This action cannot be undone.')) {
      await deleteDocument(id);
      const updated = await getAllDocuments();
      setDocuments(updated);
      if (currentDoc?.id === id && updated.length > 0) {
        handleSelectDoc(updated[0]);
      }
    }
  };

  const themeClasses = {
    light: 'bg-slate-50 text-slate-900',
    dark: 'bg-slate-950 text-slate-100',
    sepia: 'bg-[#fbf0d9] text-[#433422]'
  }[theme];

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden select-none ${themeClasses}`}>
      
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4 print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition"
            title="Toggle Sidebar"
          >
            <List size={18} />
          </button>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent font-medium text-base focus:outline-none focus:ring-1 focus:ring-rose-500 rounded px-1.5 py-0.5"
            placeholder="Document Title"
          />
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono">
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Error'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-lg gap-1">
            <button 
              onClick={() => setViewMode('edit')} 
              className={`p-1.5 rounded-md ${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
              title="Editor Only"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => setViewMode('split')} 
              className={`p-1.5 rounded-md ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
              title="Split View"
            >
              <Columns size={16} />
            </button>
            <button 
              onClick={() => setViewMode('preview')} 
              className={`p-1.5 rounded-md ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
              title="Preview Only"
            >
              <Eye size={16} />
            </button>
          </div>

          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-lg gap-1">
            <button onClick={() => setTheme('light')} className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-white shadow-sm text-slate-900' : ''}`}><Sun size={16} /></button>
            <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-slate-100' : ''}`}><Moon size={16} /></button>
            <button onClick={() => setTheme('sepia')} className={`p-1.5 rounded-md ${theme === 'sepia' ? 'bg-[#f4e3c1] shadow-sm text-[#433422]' : ''}`}><BookOpen size={16} /></button>
          </div>

          {currentDoc && (
            <button 
              onClick={() => downloadMarkdownFile({ ...currentDoc, title, content })}
              className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500"
              title="Export Markdown"
            >
              <Download size={18} />
            </button>
          )}
          <button 
            onClick={triggerPDFExport}
            className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500"
            title="Print to PDF"
          >
            <Printer size={18} />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 print:hidden bg-slate-100/40 dark:bg-slate-900/40">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-500">Documents</span>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-1 text-xs bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded-md transition"
              >
                <Plus size={14} /> New
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer transition ${
                    currentDoc?.id === doc.id 
                      ? 'bg-rose-500/10 text-rose-500 font-medium' 
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={16} />
                    <span className="truncate">{doc.title || 'Untitled'}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="hover:text-red-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => exportAllBackupJSON(documents)}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 py-1.5 rounded border border-slate-300 dark:border-slate-700"
              >
                <HardDrive size={14} /> Backup All
              </button>
            </div>
          </aside>
        )}

        <main className="flex-1 flex overflow-hidden">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2 border-r border-slate-200 dark:border-slate-800' : 'w-full'} print:hidden`}>
              <CodeEditor value={content} onChange={setContent} theme={theme} />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'} print:w-full print:block`}>
              <LivePreview content={content} />
            </div>
          )}
        </main>
      </div>

      {/* 3. STATUS BAR */}
      <footer className="h-8 border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-xs text-slate-500 print:hidden shrink-0">
        <div className="flex items-center gap-4">
          <span>Words: <strong>{stats.words}</strong></span>
          <span>Characters: <strong>{stats.characters}</strong></span>
          <span>Lines: <strong>{stats.lines}</strong></span>
        </div>
        <div>
          <span>Reading Time: <strong>~{stats.readingTimeMinutes} min</strong></span>
        </div>
      </footer>
    </div>
  );
}