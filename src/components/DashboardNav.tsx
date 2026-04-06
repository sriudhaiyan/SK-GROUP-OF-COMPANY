import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { HelpModal } from './HelpModal';

export function DashboardNav() {
  const location = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navItems = [
    { name: 'TOP', path: '/' },
    { name: 'NEWS', path: '/news' },
    { name: 'APPS', path: '/apps' },
    { name: 'NEXORA AI', path: '/nexora' },
    { name: 'SK ORBIX', action: () => window.dispatchEvent(new CustomEvent('open-orbix')) },
    { name: 'CHARACTER', path: '/characters' },
    { name: 'OFFICIAL CHANNELS', path: '/channels' },
    { name: 'HELP', action: () => setIsHelpOpen(true) },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-6 flex justify-center items-center bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
        <nav className="flex items-center gap-4 md:gap-12 pointer-events-auto bg-black/50 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 border border-[#cc0000]/20 rounded-full shadow-[0_0_30px_rgba(204,0,0,0.1)] max-w-[95vw] overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.action) {
              return (
                <button 
                  key={item.name}
                  onClick={item.action}
                  className="text-[10px] md:text-xs font-sans font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-gray-400 hover:text-[#cc0000] transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                >
                  {item.name}
                </button>
              );
            }

            return (
              <Link 
                key={item.name} 
                to={item.path!}
                className={`relative text-[10px] md:text-xs font-sans font-light tracking-[0.2em] md:tracking-[0.3em] uppercase transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 hover:text-[#cc0000]'}`}
              >
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#cc0000] shadow-[0_0_10px_rgba(204,0,0,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
