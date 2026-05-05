import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export function Auth() {
  const { signInWithGoogle, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [videoStage, setVideoStage] = useState(1); // 1: Video 1, 2: Video 2

  // Orientation Logic
  React.useEffect(() => {
    if (user) {
      const lockOrientation = async () => {
        try {
          if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
            if (document.documentElement.requestFullscreen) {
              await document.documentElement.requestFullscreen().catch(() => {});
            }
            await (window.screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch (e) {
          console.warn('Orientation lock failed:', e);
        }
      };
      lockOrientation();
    }
  }, [user]);

  const handleEnterPortal = async () => {
    try {
      if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
        await (window.screen.orientation as any).unlock().catch(() => {});
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Orientation unlock failed:', e);
    }
    window.location.href = '/';
  };

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      let message = "Failed to sign in";
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {
        message = err.message || message;
      }
      setError(message);
    }
  };

  if (user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              src={videoStage === 1 
                ? "https://go.screenpal.com/player/cOhhhXntc8n?ff=1&ahc=1&dcc=1&tl=1&bg=transparent&share=1&download=1&embed=1&cl=1&autoplay=1"
                : "https://www.youtube.com/embed/9nnDMMmlI78?si=OHthx6gTcJtrhQdH&controls=0&autoplay=1&mute=1&loop=1&vq=hd2160&rel=0&modestbranding=1"
              }
              className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              title={videoStage === 1 ? "SHIVA LATE ARRIVAL" : "DREAMFORGE PRODUCTIONS"}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={videoStage}
            transition={{ delay: 1 }}
            className="w-full max-w-lg"
          >
            {videoStage === 1 ? (
              <button 
                onClick={() => setVideoStage(2)}
                className="w-full px-8 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-display text-lg tracking-[0.2em] uppercase transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group"
              >
                Next Video
                <div className="w-8 h-[1px] bg-white/40 group-hover:w-12 transition-all duration-500" />
              </button>
            ) : (
              <button 
                onClick={handleEnterPortal}
                className="w-full px-8 py-6 bg-gradient-to-r from-[#cc0000] to-[#660000] rounded-2xl font-display text-xl tracking-[0.3em] uppercase transition-all duration-700 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(204,0,0,0.4)] flex flex-col items-center gap-1 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10">Enter Portal</span>
                <span className="relative z-10 text-[10px] opacity-50 tracking-[0.5em]">Gate Authorized</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Global Protection Overlay */}
        <div 
          className="absolute inset-0 z-[100] pointer-events-none select-none" 
          onContextMenu={(e) => e.preventDefault()}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative h-screen grid items-center bg-black text-white overflow-hidden justify-items-center"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="https://i.ibb.co/27shk6Fs/take-2.png"
          alt="Shiva Background"
          className="absolute w-full h-full object-cover object-center opacity-60"
          draggable={false}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="relative mb-8 group">
          <img 
            src="https://i.ibb.co/KptDmbVD/SK-GROUP-OF-COMPANY.jpg" 
            alt="SK Group Logo" 
            className="h-24 w-24 mx-auto rounded-full border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-500 marquee-logo"
            draggable={false}
          />
        </div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent tracking-tighter">SK GROUP</h1>
        <p className="text-gray-400 text-sm font-medium mb-10 tracking-widest uppercase opacity-60">Digital Ecosystem</p>
        
        <button 
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all transform active:scale-95 shadow-xl"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Access Universe
        </button>
        
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-100 text-sm font-medium animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              AUTHENTICATION ERROR
            </div>
            {error}
          </div>
        )}
        
        <div className="mt-8 text-[10px] text-gray-500 font-medium tracking-tight uppercase opacity-40">
          Secured Gateway • Authorized Personnel Only
        </div>
      </motion.div>
    </motion.div>
  );
}
