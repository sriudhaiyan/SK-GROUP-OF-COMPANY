import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on auth page or home page
  if (location.pathname === '/auth' || location.pathname === '/') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-[60] flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-[#cc0000] hover:bg-[#cc0000]/10 transition-all duration-300 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-xs font-display tracking-widest uppercase">Back</span>
      </motion.button>
    </AnimatePresence>
  );
}
