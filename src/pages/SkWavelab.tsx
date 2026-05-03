import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, List, Music, ChevronDown, Mic2 } from 'lucide-react';
import { songs } from '../data/songs';
import { useMusic } from '../contexts/MusicContext';

export function SkWavelab() {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    duration, 
    currentTime, 
    volume, 
    isMuted, 
    togglePlay, 
    nextSong, 
    prevSong, 
    seek, 
    setVolume, 
    setIsMuted,
    playSong
  } = useMusic();

  const [showLyrics, setShowLyrics] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const currentSongIndex = songs.findIndex(s => s.id === currentSong.id);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Art and Visuals */}
        <div className="relative flex flex-col items-center">
          <motion.div 
            key={currentSong.id}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(204,0,0,0.2)] group"
          >
            <img 
              src={currentSong.logo} 
              alt={currentSong.title} 
              className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
               <span className="text-[10px] tracking-[0.3em] font-medium text-[#cc0000] uppercase mb-2 block">Now Playing</span>
               <h1 className="text-3xl font-black tracking-tighter mb-1">{currentSong.title}</h1>
               <p className="text-gray-400 font-medium">{currentSong.artist}</p>
            </div>

            {/* Overlay Play State */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={togglePlay}
                 className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-transform"
               >
                 {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
               </button>
            </div>
          </motion.div>

          <div className="mt-12 flex items-center gap-8 text-gray-500">
             <button onClick={() => setShowLyrics(!showLyrics)} className={`flex items-center gap-2 transition-colors ${showLyrics ? 'text-[#cc0000]' : 'hover:text-white'}`}>
                <Mic2 size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">Lyrics</span>
             </button>
             <button className="flex items-center gap-2 hover:text-white transition-colors">
                <List size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">Queue</span>
             </button>
          </div>
        </div>

        {/* Right Side: Player Controls and Playlist */}
        <div className="flex flex-col gap-8">
           <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-medium tracking-widest text-gray-500 uppercase">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                 </div>
                 <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden group">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => seek(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#cc0000] to-[#ff4444]"
                      style={{ width: `${progress}%` }}
                    />
                 </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-10 md:gap-16">
                 <button onClick={prevSong} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <SkipBack size={28} />
                 </button>
                 <button 
                   onClick={togglePlay}
                   className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                 >
                   {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} className="ml-1" fill="black" />}
                 </button>
                 <button onClick={nextSong} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <SkipForward size={28} />
                 </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4 justify-center md:justify-start">
                 <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                 </button>
                 <div className="w-32 h-1 bg-white/10 rounded-full relative group">
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="h-full bg-white/40 group-hover:bg-[#cc0000]"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                 </div>
              </div>
           </div>

           {/* Lyrics Overlay / Playlist */}
           <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 h-[400px] overflow-hidden">
              <AnimatePresence mode="wait">
                {showLyrics ? (
                  <motion.div 
                    key="lyrics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-6 pr-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold tracking-[0.2em] text-[#cc0000] uppercase">Lyrics</h4>
                      <button onClick={() => setShowLyrics(false)} className="text-gray-500 hover:text-white transition-colors">
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    <pre className="font-sans text-lg md:text-xl font-medium leading-relaxed text-gray-300 whitespace-pre-wrap">
                      {currentSong.lyrics}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="playlist"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold tracking-[0.2em] text-[#cc0000] uppercase">Up Next</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 tracking-widest uppercase">
                         <Music size={12} />
                         <span>{songs.length} Tracks</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide pr-2">
                       {songs.map((s, idx) => (
                         <button 
                           key={s.id}
                           onClick={() => playSong(idx)}
                           className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${idx === currentSongIndex ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                         >
                           <img src={s.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                           <div className="text-left flex-1 overflow-hidden">
                              <p className={`font-bold truncate ${idx === currentSongIndex ? 'text-white' : 'text-gray-400'}`}>{s.title}</p>
                              <p className="text-[10px] text-gray-500 tracking-wider uppercase">{s.artist}</p>
                           </div>
                           {idx === currentSongIndex && isPlaying && (
                             <div className="flex gap-0.5 items-end h-3">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-[#cc0000]" />
                                <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#cc0000]" />
                                <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#cc0000]" />
                             </div>
                           )}
                         </button>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.15, 0.1]
           }} 
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#cc0000] blur-[150px] rounded-full" 
         />
         <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>
    </div>
  );
}
