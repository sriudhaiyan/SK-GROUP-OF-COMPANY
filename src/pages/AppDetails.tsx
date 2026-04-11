import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { APPS_DATA } from '../data/content';
import { motion } from 'motion/react';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export function AppDetails() {
  const { id } = useParams();
  const app = APPS_DATA.find(a => a.id === id);

  if (!app) {
    return <Navigate to="/apps" />;
  }

  const theme = app.theme || {
    primary: '#cc0000',
    secondary: '#ff4444',
    bg: 'bg-black',
    textAccent: 'text-[#cc0000]',
    borderAccent: 'border-[#cc0000]',
    glow: 'bg-[#cc0000]/10',
    shadow: 'rgba(204,0,0,0.2)',
    fontDisplay: 'font-display',
    fontSans: 'font-sans'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen ${theme.bg} text-white pt-32 px-8 pb-20 relative overflow-hidden transition-colors duration-1000`}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000" 
        style={{ backgroundColor: theme.primary, opacity: 0.1 }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 items-center">
        
        {/* Character Side */}
        <motion.div 
          initial={{ opacity: 0, x: app.character?.side === 'left' ? -200 : 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: app.character?.side === 'left' ? -200 : 200 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`w-full md:w-1/2 flex flex-col items-center ${app.character?.side === 'right' ? 'md:order-last' : ''}`}
        >
          <div className="relative group">
            <div 
              className="absolute -inset-3 border scale-95 group-hover:scale-100 transition-all duration-1000 ease-out" 
              style={{ borderColor: theme.primary, opacity: 0.3 }}
            />
            <div className="absolute -inset-1 border border-white/10" />
            <img 
              src={app.character?.img} 
              alt={app.character?.name} 
              className="w-64 h-[28rem] object-cover transition-all duration-1000 ease-out"
            />
            <div 
              className={`absolute -bottom-4 -left-4 bg-black border text-white px-6 py-3 text-xs ${theme.fontSans} font-light tracking-[0.3em] uppercase shadow-2xl transition-colors duration-1000`}
              style={{ borderColor: theme.primary, opacity: 0.8 }}
            >
              {app.character?.name}
            </div>
          </div>
          
          {/* Animated Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.8, duration: 0.5, type: "spring" } }}
            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.3 } }}
            className="relative mt-8 bg-black/80 backdrop-blur-xl border p-5 rounded-2xl shadow-2xl max-w-sm"
            style={{ borderColor: theme.primary }}
          >
            <div 
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 border-t border-l rotate-45"
              style={{ borderColor: theme.primary }}
            />
            <p className={`text-sm text-gray-200 ${theme.fontDisplay} italic leading-relaxed tracking-wide text-center relative z-10`}>
              <TypewriterText text={`"${app.character?.quote}"`} delay={1.2} />
            </p>
          </motion.div>
        </motion.div>

        {/* Details Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <img 
            src={app.logo} 
            alt={app.title} 
            className="h-24 mb-8 object-contain transition-all duration-1000" 
            style={{ filter: `drop-shadow(0 0 30px ${theme.shadow})` }}
          />
          
          <h1 className={`text-4xl md:text-6xl ${theme.fontDisplay} font-normal mb-4 tracking-[0.15em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
            {app.title}
          </h1>
          
          <h3 
            className={`text-sm ${theme.fontSans} font-light mb-8 tracking-[0.4em] uppercase transition-colors duration-1000`}
            style={{ color: theme.primary }}
          >
            {app.subtitle}
          </h3>
          
          <div 
            className="w-16 h-px mb-8 transition-colors duration-1000" 
            style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, transparent)` }}
          />
          
          <p className={`text-base text-gray-300 leading-loose ${theme.fontSans} font-light tracking-wide mb-8`}>
            {app.description}
          </p>

          <div className="space-y-4 w-full">
            <h4 className={`text-xs text-gray-500 ${theme.fontSans} tracking-[0.3em] uppercase border-b border-white/10 pb-2`}>Features</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {app.content.split(' | ').map((feature, i) => (
                <li key={i} className={`text-sm text-gray-400 ${theme.fontSans} font-light flex items-start gap-2`}>
                  <span className="mt-1 transition-colors duration-1000" style={{ color: theme.primary }}>▸</span>
                  {feature.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ul>
          </div>

          {app.pricing && (
            <div className="mt-12 w-full p-6 border border-white/10 bg-white/[0.02]">
              <h4 
                className={`text-xs ${theme.fontSans} tracking-[0.3em] uppercase mb-4 transition-colors duration-1000`}
                style={{ color: theme.primary }}
              >
                Pricing
              </h4>
              <p className={`text-sm text-gray-400 ${theme.fontSans} font-light leading-relaxed`}>
                {app.pricing}
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
