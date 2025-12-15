import React from 'react';
import { modules } from '../data';
import { Module } from '../types';
import { BookOpen, CheckCircle, Circle } from 'lucide-react';

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
  completedModules: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
    activeModuleId, 
    onSelectModule, 
    isMobileOpen, 
    setIsMobileOpen,
    completedModules 
}) => {
  
  const progressPercentage = Math.round((completedModules.length / modules.length) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-gray-950 border-r border-gray-800
        transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static flex flex-col
      `}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 flex-shrink-0">
          <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-accent-900/50">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">技术分析实战</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
            <span>课程目录</span>
            <span className="text-[10px] bg-gray-900 px-1.5 py-0.5 rounded text-gray-400">
                {completedModules.length}/{modules.length}
            </span>
          </div>
          {modules.map((module: Module) => {
            const Icon = module.icon;
            const isActive = activeModuleId === module.id;
            const isCompleted = completedModules.includes(module.id);

            return (
              <button
                key={module.id}
                onClick={() => {
                  onSelectModule(module.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-accent-900/40 text-accent-400 border border-accent-900/50' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200 hover:border-transparent border border-transparent'}
                `}
              >
                <div className="relative mr-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-accent-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    {isCompleted && (
                        <div className="absolute -bottom-1 -right-1 bg-gray-950 rounded-full">
                            <CheckCircle className="w-3 h-3 text-accent-500 fill-accent-900/50" />
                        </div>
                    )}
                </div>
                
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-medium text-sm truncate ${isCompleted && !isActive ? 'text-gray-500' : ''}`}>
                    {module.title}
                  </div>
                  <div className="text-xs text-gray-500 opacity-80 truncate max-w-[160px]">{module.subtitle}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400 font-medium">学习进度</div>
                <div className="text-xs font-bold text-accent-400">{progressPercentage}%</div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-accent-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {progressPercentage === 100 && (
                <div className="mt-2 text-[10px] text-center text-accent-400 font-medium animate-pulse">
                    🎉 恭喜你完成所有课程！
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;