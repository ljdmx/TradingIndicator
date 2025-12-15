import React from 'react';
import { Module, SectionContent } from '../types';
import ConceptChart from './ConceptChart';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Circle,
  TrendingUp,
  TrendingDown,
  History,
  Terminal
} from 'lucide-react';

interface ModuleViewProps {
  module: Module;
  moduleIndex: number;
  isCompleted: boolean;
  onToggleCompletion: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  nextModuleTitle?: string;
  prevModuleTitle?: string;
}

const ModuleView: React.FC<ModuleViewProps> = ({ 
    module, 
    moduleIndex,
    isCompleted, 
    onToggleCompletion, 
    onNext, 
    onPrev,
    nextModuleTitle,
    prevModuleTitle
}) => {
  
  const renderSectionContent = (section: SectionContent) => {
    switch (section.type) {
      case 'real-world':
        return (
           <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl mt-4 mb-8">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-accent-400" />
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Historical Data Review</span>
                  </div>
                  <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
              </div>
              <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 border-b border-gray-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                          <History className="w-5 h-5 mr-2 text-gray-500" />
                          {section.title}
                      </h3>
                      <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-sm font-mono">
                          <span className="text-accent-400 bg-accent-950/50 px-2 py-1 rounded border border-accent-900">{section.asset}</span>
                          <span className="text-gray-500">{section.date}</span>
                      </div>
                  </div>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                      {section.content as string}
                  </div>
              </div>
           </div>
        );

      case 'list':
        const isSellSignal = section.title.includes('卖出') || section.title.includes('做空');
        return (
          <div className={`rounded-xl p-5 border ${isSellSignal ? 'bg-red-900/10 border-red-900/30' : 'bg-gray-900/50 border-gray-800'}`}>
             <ul className="space-y-4">
              {(section.content as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start text-gray-300 group">
                  {isSellSignal ? (
                    <TrendingDown className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="group-hover:text-white transition-colors text-sm md:text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'discipline':
        return (
          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-6">
             <ul className="space-y-4">
              {(section.content as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start text-red-200/80 group">
                  <AlertOctagon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="group-hover:text-red-100 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'process':
        return (
          <div className="relative pl-6 border-l-2 border-gray-800 space-y-10 my-8">
            {(section.content as string[]).map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gray-800 ring-4 ring-gray-950 group-hover:bg-accent-500 group-hover:ring-accent-900/50 transition-all duration-300" />
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 group-hover:border-gray-700 transition-all">
                    <p className="text-gray-300 font-medium group-hover:text-white transition-colors">{item}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'case-study':
        return (
          <div className="group relative bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-all"></div>
            <div className="p-6">
                <div className="flex items-center mb-4 text-blue-400 font-bold text-sm uppercase tracking-wide">
                    <ArrowRight className="w-4 h-4 mr-2" /> 理论推演
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line leading-relaxed mb-6">
                {section.content as string}
                </div>
                {section.chartType && <ConceptChart type={section.chartType} scenario={section.chartScenario} />}
            </div>
          </div>
        );

      case 'tips':
        return (
           <div className="bg-accent-950/30 border border-accent-900/30 rounded-xl p-6">
            <div className="flex items-center mb-4 text-accent-400 font-bold text-sm uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 mr-2" /> 交易员笔记
            </div>
            <ul className="space-y-3">
            {(section.content as string[]).map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-300 text-sm md:text-base">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          </div>
        );

      default:
        // Concept / General
        return (
          <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
             {section.content as string}
             {section.chartType && <ConceptChart type={section.chartType} scenario={section.chartScenario} />}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Module Header */}
      <header className="mb-12 border-b border-gray-800 pb-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-accent-500 bg-accent-950/30 px-3 py-1.5 rounded-lg border border-accent-900/50">
                <module.icon className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase">Chapter {moduleIndex}</span>
            </div>
            {isCompleted && (
                <div className="flex items-center text-accent-400 bg-accent-900/20 px-3 py-1 rounded-full text-xs font-bold border border-accent-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> 已完成
                </div>
            )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">{module.title}</h1>
        <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">{module.description}</p>
      </header>

      {/* Sections */}
      <div className="space-y-20">
        {module.sections.map((section, index) => (
          <section key={index} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              {section.type === 'discipline' && <AlertOctagon className="w-6 h-6 text-red-500 mr-3" />}
              {section.title}
            </h2>
            {renderSectionContent(section)}
          </section>
        ))}
      </div>

      {/* Action Bar */}
      <div className="mt-24 pt-10 border-t border-gray-800">
        
        {/* Completion Toggle */}
        <div className="flex justify-center mb-16">
            <button
                onClick={onToggleCompletion}
                className={`
                    flex items-center px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                    ${isCompleted 
                        ? 'bg-accent-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-accent-500' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'}
                `}
            >
                {isCompleted ? (
                    <>
                        <CheckCircle className="w-6 h-6 mr-3" />
                        标记为未完成
                    </>
                ) : (
                    <>
                        <Circle className="w-6 h-6 mr-3" />
                        标记为已学完
                    </>
                )}
            </button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                {onPrev ? (
                    <button 
                        onClick={onPrev}
                        className="w-full flex flex-col items-start p-6 rounded-2xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900 hover:border-gray-600 transition-all group text-left"
                    >
                        <span className="flex items-center text-xs font-bold text-gray-500 mb-2 group-hover:text-accent-500 transition-colors uppercase tracking-wider">
                            <ChevronLeft className="w-3 h-3 mr-1" /> Previous Chapter
                        </span>
                        <span className="text-gray-200 font-bold text-lg group-hover:text-white transition-colors line-clamp-1">
                            {prevModuleTitle}
                        </span>
                    </button>
                ) : <div />}
            </div>
            
            <div>
                {onNext ? (
                    <button 
                        onClick={onNext}
                        className="w-full flex flex-col items-end p-6 rounded-2xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900 hover:border-gray-600 transition-all group text-right"
                    >
                        <span className="flex items-center text-xs font-bold text-gray-500 mb-2 group-hover:text-accent-500 transition-colors uppercase tracking-wider">
                            Next Chapter <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                        <span className="text-gray-200 font-bold text-lg group-hover:text-white transition-colors line-clamp-1">
                            {nextModuleTitle}
                        </span>
                    </button>
                ) : (
                    isCompleted && (
                        <div className="w-full h-full flex items-center justify-center p-6 rounded-2xl border border-accent-900/30 bg-accent-900/10 text-center text-accent-400 text-lg font-bold">
                            🎉 课程圆满结束
                        </div>
                    )
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;