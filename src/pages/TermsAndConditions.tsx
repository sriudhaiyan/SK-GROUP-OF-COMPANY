import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function TermsAndConditions() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/terms-and-conditions.html')
      .then(res => res.text())
      .then(text => {
        // Replace hardcoded Termly colors with theme colors
        const themedHtml = text
          .replace(/#000000/g, '#ffffff')
          .replace(/#595959/g, '#a1a1aa')
          .replace(/background:\s*#ffffff/gi, 'background: transparent');
        setHtmlContent(themedHtml);
      })
      .catch(err => console.error('Failed to load terms and conditions:', err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 bg-zinc-900/50 p-8 rounded-2xl border border-white/10">
        <h1 className="text-4xl font-display mb-8 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Terms & <span className="text-[#cc0000]">Conditions</span>
        </h1>
        
        <div className="p-8 rounded-xl overflow-hidden">
          {htmlContent ? (
            <div 
              className="termly-terms-conditions prose prose-invert max-w-none prose-headings:font-display prose-headings:text-[#cc0000] prose-a:text-blue-400 hover:prose-a:text-blue-300"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#cc0000]"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
