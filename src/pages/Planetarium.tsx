import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Planetarium() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-50 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm self-start md:self-auto">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-sans tracking-widest text-sm uppercase">Back</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4 bg-black/50 px-4 md:px-6 py-2 rounded-full backdrop-blur-sm">
          <img src="https://i.ibb.co/KptDmbVD/SK-GROUP-OF-COMPANY.jpg" alt="SK Group Logo" className="h-8 md:h-10 object-contain rounded-full" />
          <h1 className="font-display text-lg md:text-2xl tracking-[0.1em] md:tracking-[0.2em] text-[#cc0000] uppercase drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]">
            SK PLANETARIUM
          </h1>
        </div>
      </div>

      {/* Iframe to load the user's planetarium files */}
      <iframe 
        src={`/planetarium/index.html?t=${Date.now()}`}
        className="w-full h-full flex-1 border-none relative z-10"
        title="SK Planetarium"
      />
    </motion.div>
  );
}
