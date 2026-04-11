import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface GalaxyViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ isOpen, onClose }) => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newStars = Array.from({ length: 200 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      }));
      setStars(newStars);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md"
          >
            <X size={32} />
          </button>

          {/* Stars Background */}
          <div className="absolute inset-0 pointer-events-none">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute bg-white rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </div>

          {/* Galaxy Core */}
          <div className="relative w-full h-full flex items-center justify-center perspective-[2000px]">
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="relative w-[800px] h-[800px] flex items-center justify-center transform-style-3d rotate-x-60"
            >
              {/* Sun/Core */}
              <div className="absolute w-32 h-32 rounded-full bg-[radial-gradient(circle,#fff,#fcd34d,#f59e0b,#b45309)] shadow-[0_0_100px_#fcd34d,0_0_200px_#f59e0b] animate-pulse" />

              {/* Orbits and Planets */}
              {[
                { size: 250, color: '#60a5fa', speed: 10, planetSize: 12 },
                { size: 400, color: '#f87171', speed: 15, planetSize: 16 },
                { size: 550, color: '#34d399', speed: 20, planetSize: 20 },
                { size: 700, color: '#c084fc', speed: 25, planetSize: 24 },
              ].map((orbit, index) => (
                <div
                  key={index}
                  className="absolute rounded-full border border-white/10"
                  style={{
                    width: orbit.size,
                    height: orbit.size,
                  }}
                >
                  <motion.div
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: orbit.speed, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full relative"
                  >
                    <div
                      className="absolute rounded-full shadow-[0_0_20px_currentColor]"
                      style={{
                        width: orbit.planetSize,
                        height: orbit.planetSize,
                        backgroundColor: orbit.color,
                        color: orbit.color,
                        top: -orbit.planetSize / 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <h2 className="text-4xl font-display text-white tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              SK Universe
            </h2>
            <p className="text-white/50 tracking-[0.5em] text-sm mt-2 uppercase">
              S-Rank Capabilities
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
