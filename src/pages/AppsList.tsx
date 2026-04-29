import React from 'react';
import { APPS_DATA } from '../data/content';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SpaceShuttleButton } from '../components/SpaceShuttleButton';

export function AppsList() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-display mb-8 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Our <span className="text-[#cc0000]">Applications</span>
        </h1>

        <div className="flex justify-center mb-16">
          <SpaceShuttleButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APPS_DATA.filter(app => app.id !== 'intro' && app.type !== 'character').map((app, index) => (
            <Link to={`/app/${app.id}`} key={app.id}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[500px] border border-white/10 overflow-hidden bg-black flex flex-col items-center justify-end p-8 hover:border-[#cc0000]/50 transition-colors duration-500"
              >
                {/* Background Image (Character) */}
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
                  <img 
                    src={app.character?.img} 
                    alt={app.character?.name} 
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Logo */}
                <div className="absolute top-8 right-8 z-10">
                  <img src={app.logo} alt={app.title} className="h-12 object-contain drop-shadow-[0_0_15px_rgba(204,0,0,0.3)]" />
                </div>

                {/* Animated Details */}
                <div className="details text-left w-[calc(100%-40px)] !left-6 md:!left-[60px] !top-auto !bottom-8 md:!top-[240px] md:!bottom-auto">
                  <div className="content-title-1 uppercase tracking-widest truncate">{app.title}</div>
                  <div className="content-title-2 text-[#cc0000] uppercase tracking-widest mt-1">Application</div>
                  <div className="place-box">
                    <div className="content-place transition-transform duration-500 group-hover:-translate-y-[40px]">
                      <div className="text-gray-400 truncate h-[40px] leading-[40px] max-w-[220px]">{app.description}</div>
                      <div className="text-[#cc0000] h-[40px] leading-[40px] flex items-center gap-2">
                        EXPLORE APP <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
