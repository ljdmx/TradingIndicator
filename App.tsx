import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ModuleView from './components/ModuleView';
import { modules } from './data';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(modules[0]?.id || '');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Progress State
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedModules');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist progress
  useEffect(() => {
    localStorage.setItem('completedModules', JSON.stringify(completedModules));
  }, [completedModules]);

  // Scroll to top when module changes
  useEffect(() => {
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeModuleId]);

  const toggleModuleCompletion = (id: string) => {
    setCompletedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const activeModuleIndex = modules.findIndex(m => m.id === activeModuleId);
  // Ensure we have a valid module, fallback to first if not found
  const activeModule = modules[activeModuleIndex] || modules[0];
  const prevModule = modules[activeModuleIndex - 1];
  const nextModule = modules[activeModuleIndex + 1];

  const handleNext = () => { if(nextModule) setActiveModuleId(nextModule.id); }
  const handlePrev = () => { if(prevModule) setActiveModuleId(prevModule.id); }

  if (!activeModule) return <div className="p-10 text-white">Loading modules...</div>;

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans text-gray-100">
      
      {/* Sidebar */}
      <Sidebar 
        activeModuleId={activeModule.id} 
        onSelectModule={setActiveModuleId}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        completedModules={completedModules}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center px-4 bg-gray-950 border-b border-gray-800 flex-shrink-0 z-30">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-white truncate">{activeModule.title}</span>
        </div>

        {/* Scrollable Content */}
        <div 
            id="main-content"
            className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth relative"
        >
            
            {/* Background Decor - Optional Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-accent-900/10 blur-[100px] pointer-events-none -z-10" />

            <ModuleView 
                module={activeModule}
                moduleIndex={activeModuleIndex}
                isCompleted={completedModules.includes(activeModule.id)}
                onToggleCompletion={() => toggleModuleCompletion(activeModule.id)}
                onNext={nextModule ? handleNext : undefined}
                onPrev={prevModule ? handlePrev : undefined}
                nextModuleTitle={nextModule?.title}
                prevModuleTitle={prevModule?.title}
            />

            {/* Content Footer */}
            <footer className="max-w-4xl mx-auto pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between text-sm text-gray-500 mt-12 gap-4">
                <div>© 2024 技术分析实战手册</div>
                <div className="flex gap-4">
                    <span>仅供学习参考</span>
                    <span>v1.2.0</span>
                </div>
            </footer>
        </div>
      </main>
    </div>
  );
};

export default App;