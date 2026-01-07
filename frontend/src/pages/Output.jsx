import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Particles from '@/components/Particles';
import Footer from '../components/Footer';

const Output = ({ data }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  const downloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "video-analysis-report.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white/50 font-instrument text-2xl">Waiting for analysis...</p>
      </div>
    );
  }

  const { timeline = [], insertions = [] } = data.result || data || {};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="bg-black min-h-screen relative text-gray-100 p-6 md:p-12 font-sans selection:bg-teal-500/30 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={600}
          particleSpread={7}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-instrument text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
                Analysis Report
              </h1>
              <p className="text-gray-400 font-light text-lg">
                Review your generated video structure and individual insertions.
              </p>
            </div>
            
            <button 
              onClick={downloadJSON}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-teal-400 font-medium transition-all flex items-center gap-2 group hover:border-teal-500/30"
            >
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JSON
            </button>
          </div>

          <div className="flex gap-8 border-b border-gray-800">
             {['timeline', 'insertions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xl font-medium transition-all duration-300 relative ${
                    activeTab === tab 
                      ? 'text-teal-400' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400"
                    />
                  )}
                </button>
             ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-400 font-mono pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              A-Roll Segments: <span className="text-white">{timeline.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              B-Roll Insertions: <span className="text-white">{insertions.length}</span>
            </div>
          </div>
        </header>

        <div className="min-h-[500px]">
          {activeTab === 'timeline' ? (
            <div className="relative border-l-2 border-gray-800 ml-4 md:ml-12 space-y-12 pb-20">
              {timeline.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-8 md:pl-12"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-600 group-hover:border-teal-400 transition-colors z-10 box-content" />
                  
                  <div className="relative group">
                    <div className={`transition-all duration-300 rounded-2xl p-6 border ${
                      item.type && item.type.toLowerCase().startsWith('b') 
                        ? 'bg-orange-900/20 border-orange-500/30 hover:bg-orange-900/30 hover:border-orange-500/50' 
                        : 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/40 hover:border-teal-500/30'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-mono rounded-full border ${
                            item.type && item.type.toLowerCase().startsWith('b')
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                              : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                          }`}>
                            {item.type ? item.type.replace(/_/g, ' ').toUpperCase() : 'SEGMENT'}
                          </span>
                          <h3 className="text-2xl font-instrument text-white">
                            {formatTime(item.start)} <span className="text-gray-600 text-lg mx-2">to</span> {formatTime(item.end)}
                          </h3>
                        </div>
                        {item.confidence && (
                          <div className="flex items-center gap-2" title={`Confidence: ${item.confidence}`}>
                            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-orange-400" 
                                style={{ width: `${item.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 font-mono">{(item.confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>

                      {item.context && item.context.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.context.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700/50">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insertions.length > 0 ? (
                insertions.map((ins, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:bg-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
                        B-Roll Clip
                      </span>
                      <span className="font-mono text-sm text-orange-200">
                        @ {formatTime(ins.insert_at)}
                      </span>
                    </div>

                    <h3 className="text-xl font-instrument text-white mb-2 truncate" title={ins.b_roll}>
                      {ins.b_roll}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] uppercase text-gray-500 mb-1">Duration</p>
                        <p className="text-lg font-mono text-gray-200">{ins.duration}s</p>
                      </div>
                      <div>
                         <p className="text-[10px] uppercase text-gray-500 mb-1">Confidence</p>
                         <p className="text-lg font-mono text-orange-400">{(ins.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-white/30 italic font-instrument text-2xl">
                  No independent B-roll insertions found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 w-full mt-12">
        <Footer />
      </div>
    </div>
  );
}

export default Output;