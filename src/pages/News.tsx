import React from 'react';
import { APPS_DATA } from '../data/content';
import { motion } from 'motion/react';

export function News() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-display mb-16 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Release <span className="text-[#cc0000]">Timeline</span>
        </h1>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#cc0000]/50 before:to-transparent">
          {APPS_DATA.filter(app => app.id !== 'intro' && app.type !== 'character').map((app, index) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#cc0000] bg-black text-white shadow-[0_0_20px_rgba(204,0,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-3 h-3 bg-[#cc0000] rounded-full" />
              </div>
              
              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-white/10 bg-black/50 backdrop-blur-sm hover:border-[#cc0000]/50 transition-colors duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <img src={app.logo} alt={app.title} className="w-12 h-12 object-contain" />
                  <div>
                    <h3 className="font-display text-xl tracking-widest uppercase">{app.title}</h3>
                    <p className="text-[#cc0000] font-sans text-xs tracking-[0.2em] mt-1">{app.releaseDate}</p>
                  </div>
                </div>
                <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
                  {app.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
