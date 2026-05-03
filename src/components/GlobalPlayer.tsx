import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Music, X } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { Link, useLocation } from 'react-router-dom';

export function GlobalPlayer() {
  const { currentSong, isPlaying, togglePlay, nextSong } = useMusic();
  const location = useLocation();

  // Don't show on the main wavelab page to avoid redundancy
  if (location.pathname === '/wavelab') return null;

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-32 md:w-80 z-50 pointer-events-auto"
        >
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 flex items-center gap-4 shadow-2xl overflow-hidden group">
            <Link to="/wavelab" className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
              <img src={currentSong.logo} alt="" className="w-full h-full object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex gap-0.5 items-end h-3">
                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-[#cc0000]" />
                    <motion.div animate={{ height: [10, 4, 10] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#cc0000]" />
                    <motion.div animate={{ height: [6, 8, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#cc0000]" />
                  </div>
                </div>
              )}
            </Link>
            
            <div className="flex-1 min-w-0 pr-2">
              <Link to="/wavelab" className="block truncate font-bold text-sm hover:text-[#cc0000] transition-colors tracking-tight">
                {currentSong.title}
              </Link>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{currentSong.artist}</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} className="ml-0.5" fill="black" />}
              </button>
              <button 
                onClick={nextSong}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Visualizer streak */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#cc0000] to-transparent" 
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
