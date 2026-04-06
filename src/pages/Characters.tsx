import React from 'react';
import { APPS_DATA } from '../data/content';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Characters() {
  const charactersData = APPS_DATA.filter(app => app.character).map(app => ({
    ...app.character,
    appId: app.id
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-display mb-16 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          The <span className="text-[#cc0000]">Cast</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {charactersData.map((char, index) => (
            <motion.div 
              key={char?.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden border border-white/10 group-hover:border-[#cc0000]/50 transition-colors duration-500">
                <img 
                  src={char?.img} 
                  alt={char?.name} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="font-display text-2xl tracking-widest uppercase text-white drop-shadow-lg mb-1">{char?.name}</h2>
                  <p className="text-[#cc0000] text-xs font-sans tracking-[0.2em] uppercase">{char?.role}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 font-sans font-light leading-relaxed text-center max-w-sm mb-6">
                {char?.description}
              </p>
              
              <Link to={`/character/${char.appId}`}>
                <button className="px-6 py-2 border border-[#cc0000]/50 text-[#cc0000] hover:bg-[#cc0000] hover:text-white transition-colors duration-300 font-sans text-xs tracking-widest uppercase">
                  Explore Character
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
