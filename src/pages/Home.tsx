import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Fireworks } from '@fireworks-js/react';
import { FortuneCandle } from '../components/FortuneCandle';

const ProtectedImage = ({ src, alt, wrapperClassName, imageClassName }: { src: string, alt: string, wrapperClassName?: string, imageClassName?: string }) => {
  return (
    <div 
      className={`relative select-none overflow-hidden ${wrapperClassName || ''}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
    >
      <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover pointer-events-none ${imageClassName || ''}`} 
        draggable="false"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const GallerySection = () => {
  return (
    <div className="w-full py-24 px-4 md:px-8 relative z-20 bg-black/80 backdrop-blur-md border-t border-[#cc0000]/20">
      <div className="max-w-7xl mx-auto">
        {/* Disclaimer */}
        <div className="mb-20 p-6 md:p-8 border border-[#cc0000]/30 bg-[#cc0000]/5 rounded-xl text-center shadow-[0_0_30px_rgba(204,0,0,0.1)]">
          <h3 className="text-[#cc0000] font-display text-2xl mb-4 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]">Disclaimer</h3>
          <div className="text-gray-300 font-sans text-sm md:text-base tracking-wide leading-relaxed max-w-3xl mx-auto text-left md:text-center space-y-4">
            <p>1. If any misuse of these images leads to a problem and restricted to do or download</p>
            <p className="text-[#cc0000] font-bold">2. Action: don't allow to screen shot and download the images.</p>
          </div>
        </div>

        {/* Profile Logos */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-5xl font-display text-white mb-12 text-center tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Profile Logos</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              "https://i.ibb.co/FLmfwZf9/Gemini-Generated-Image-wok8bjwok8bjwok8-1.png",
              "https://i.ibb.co/rgyGmzy/Gemini-Generated-Image-b4wz91b4wz91b4wz-1.png",
              "https://i.ibb.co/NdK4JxB9/Gemini-Generated-Image-wvp8zewvp8zewvp8.png",
              "https://i.ibb.co/wrLjmS7t/Gemini-Generated-Image-vr7qzfvr7qzfvr7q.png",
              "https://i.ibb.co/prnbzpqt/Gemini-Generated-Image-s2jjdus2jjdus2jj.png"
            ].map((img, i) => (
              <ProtectedImage 
                key={i} 
                src={img} 
                alt={`Profile Logo ${i+1}`} 
                wrapperClassName="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-white/20 hover:border-[#cc0000] transition-colors duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(204,0,0,0.3)]" 
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-5xl font-display text-white mb-12 text-center tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { title: "As certificate for ranked up", img: "https://i.ibb.co/fYz2RXsh/1766169615638.png" },
              { title: "Life of a man", img: "https://i.ibb.co/vxZKPjRj/1763905904828.png" },
              { title: "Parallel universe character", img: "https://i.ibb.co/8nHpgnJH/1765094377255.png" },
              { title: "SK BODYBUILDING", img: "https://i.ibb.co/KzfvkQYF/1761049114562.png" }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden border border-white/10 hover:border-[#cc0000]/50 transition-colors duration-500 rounded-lg shadow-2xl">
                <ProtectedImage 
                  src={feature.img} 
                  alt={feature.title} 
                  wrapperClassName="w-full h-64 md:h-96"
                  imageClassName="opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6 md:p-8 pointer-events-none">
                  <h3 className="text-white font-display text-xl md:text-3xl tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Our King */}
        <div>
          <h2 className="text-3xl md:text-5xl font-display text-white mb-12 text-center tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">About Our King</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              "https://i.ibb.co/ns4XqtY8/1762185195420.png",
              "https://i.ibb.co/mFycfPBm/Generated-Image-October-20-2025-10-40-PM-1.png",
              "https://i.ibb.co/hJy7WL8f/Generated-Image-October-20-2025-10-42-PM-1.png",
              "https://i.ibb.co/fGNWpHwp/Generated-Image-September-17-2025-9-23-PM.png"
            ].map((img, i) => (
              <div key={i} className="border border-white/10 overflow-hidden rounded-lg group shadow-xl">
                <ProtectedImage 
                  src={img} 
                  alt={`About Our King ${i+1}`} 
                  wrapperClassName="w-full h-80 md:h-96"
                  imageClassName="group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-center justify-center text-center">
            <p className="text-gray-300 font-sans text-lg md:text-xl tracking-wide leading-relaxed max-w-3xl mx-auto mb-16 italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              "This website is just the beginning. Curious about the full mastery behind the craft? Explore the S-Rank capabilities that set SK apart by clicking below."
            </p>
            <Link to="/planetarium" className="block">
              <div className="portal">
                <div className="ring ring1"></div>
                <div className="ring ring2"></div>
                <div className="ring ring3"></div>
                <div className="core"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SECTIONS = [
  {
    id: 'intro',
    title: 'SK GROUP OF COMPANY',
    subtitle: 'Enter the Multimodal AI Universe',
    logo: 'https://i.ibb.co/MyJSD5dk/1763888185441.png',
    content: 'Scroll to explore reality bending applications.',
    character: {
      name: 'Shiva',
      role: 'Main Character',
      img: 'https://i.ibb.co/xSMv9jRv/1000071158.png',
      quote: "I am Shiva, the main character. Welcome to the SK Group Universe. Scroll down to explore our reality-bending applications.",
      side: 'left'
    }
  },
  {
    id: 'bodybuilding',
    title: 'SK BODYBUILDING ARENA',
    subtitle: 'Release Date: 11.11.2026',
    logo: 'https://i.ibb.co/4w7MrCHq/1759155401800.png',
    content: '1. Food Scanner | 2. Daily & Weekly Quests | 3. Special Quest | 4. Chatbot | 5. SK Orbix Bot | 6. Spotify & YT Music | 7. Deep Sleep Alarm | 8. Rank Progress (E to S, V, K) | 9. Rank Progress | 10. Workout Goal | 11. Diet Plan Generator | 12. Anime Characters as Coach | 13. Health Connect | 14. Theme Changing by Gender | 15. Look Maxing Workout with Face Analysis',
    pricing: 'Premium (Razorpay): 1 Mo: ₹15 | 3 Mo: ₹50 | 6 Mo: ₹110 | 1 Yr: ₹250 (First 5 Days). Regular: ₹99 | ₹289 | ₹599 | ₹1199',
    character: {
      name: 'SK',
      role: 'K-Rank Hunter & Doctor',
      img: 'https://i.ibb.co/ZzYwXvLt/1000074123-1.png',
      quote: "I'm SK. Welcome to the Bodybuilding Arena. Let's level up your physical stats and crush those daily quests!",
      side: 'right'
    }
  },
  {
    id: 'studio',
    title: 'SK STUDIO PRO',
    subtitle: 'Release Date: 14.4.2026',
    logo: 'https://i.ibb.co/sJMGChww/1775207249012.png',
    content: '1. Image Quotes with Trending Hashtags | 2. Image Generation Scheduler | 3. Studio for Own Quotes | 4. Gallery | 5. Modes: Paper, Anime Trap, Cinematic | 6. Moods: Sad, Maturity, God, Love, Happy, Attitude, Cameraman | 7. Fonts Selection | 8. Image to Video Generator with Runway | 9. SK Orbix Support',
    pricing: 'Free: 3 Imgs/day | Starter: ₹199/mo (15 Imgs) | Pro: ₹499/mo (Unlimited) | Studio: Highest Tier',
    character: {
      name: 'Mizz.Mizuki',
      role: 'Guide',
      img: 'https://i.ibb.co/fG14TvVK/1000071154.png',
      quote: "Mizz.Mizuki here! Step into SK Studio Pro. Let's create cinematic masterpieces and aesthetic quotes together.",
      side: 'left'
    }
  },
  {
    id: 'backbencher',
    title: 'BACKBENCHER DAILY',
    subtitle: 'Release Date: 25.4.2026',
    logo: 'https://i.ibb.co/9mQ2V8C6/Gemini-Generated-Image-h8zxd9h8zxd9h8zx.png',
    content: '1. Tamil & English E-News | 2. Translate with ANA AI | 3. Convert into Cheat Sheet | 4. AI Memes for Students | 5. News Viewer by Date | 6. SK Orbix Chatbot',
    character: {
      name: 'Roshna',
      role: 'A-Rank Spy',
      img: 'https://i.ibb.co/mVDKKyLV/1000072145.png',
      quote: "Roshna, A-Rank Spy. I gather the best intel for Backbencher Daily. Stay informed and ahead of the class.",
      side: 'right'
    }
  },
  {
    id: 'purananooru',
    title: 'PURANANOORU PADAI',
    subtitle: 'Release Date: 1.5.2026',
    logo: 'https://i.ibb.co/7NVxmKDV/file-00000000475471fd9f3acf96db5ab062.png',
    content: '1. Student Rebel Team | 2. Group Chats | 3. Historical Heroes Library | 4. SK Orbix Intelligence to detect misuse | 5. Team Meeting Planner',
    character: {
      name: 'Estella',
      role: 'B-Rank Dungeon Rider',
      img: 'https://i.ibb.co/CKqYMhHV/1000074128.png',
      quote: "Estella, B-Rank Dungeon Rider. Join the Purananooru Padai rebel team. Let's conquer history together.",
      side: 'left'
    }
  },
  {
    id: 'hira',
    title: 'HIRA [AN AI GIRLFRIEND]',
    subtitle: 'Commencing soon...',
    logo: 'https://i.ibb.co/9m86dGrp/1775205330513.png',
    content: '1. An AI Girlfriend | 2. Caring & Lovable | 3. Multimodal AI with SmartHome Access, Food Order, Ticket Booking, Video/Voice Call, Chatting, Device Control. The Smart Bodybuilding Senorita.',
    character: {
      name: 'Pragya',
      role: 'Heroine',
      img: 'https://i.ibb.co/HDmC1cYm/1000071155.png',
      quote: "I'm Pragya, the Heroine. Prepare to meet Hira, your ultimate AI companion and smart home manager.",
      side: 'right'
    }
  }
];

const SectionItem = ({ section, index, total }: { section: any, index: number, total: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 60,
    mass: 0.8
  });

  // When section is in center (0.5), rotate is 0, opacity is 1
  // When entering (0 to 0.5), rotate from 45 to 0
  // When leaving (0.5 to 1), rotate from 0 to -45
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [index % 2 === 0 ? 45 : -45, 0, index % 2 === 0 ? -45 : 45]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [index % 2 === 0 ? -30 : 30, 0, index % 2 === 0 ? 30 : -30]);
  const opacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
  const z = useTransform(smoothProgress, [0, 0.5, 1], [1500, 0, -1500]);

  // Internal Parallax (Foreground/Midground relative to section)
  const watermarkY = useTransform(smoothProgress, [0, 1], [300, -300]); // Moves fastest
  const charY = useTransform(smoothProgress, [0, 1], [100, -100]); // Moves medium
  const textY = useTransform(smoothProgress, [0, 1], [-50, 50]); // Moves opposite slightly

  const charOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const charXLeft = useTransform(smoothProgress, [0.2, 0.5, 0.8], [-200, 0, -200]);
  const charXRight = useTransform(smoothProgress, [0.2, 0.5, 0.8], [200, 0, 200]);
  const charScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const bubbleScale = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0.8, 1, 0.8]);
  const bubbleOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 0]);

  const theme = section.theme || {
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
    <div ref={ref} className={`absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center perspective-[1500px] ${theme.bg} transition-colors duration-1000`}>
      {section.id === 'intro' && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
          <Fireworks
            options={{
              opacity: 0.3,
              particles: 30,
              explosion: 4,
              intensity: 15,
            }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
        </div>
      )}
      <motion.div
        style={{ z, opacity, rotateX, rotateY }}
        className="relative z-10 p-8 md:p-16 max-w-6xl w-full pointer-events-auto flex flex-col items-center justify-center group"
      >
        
        {/* Japanese Aesthetic Watermark (Deep Background) */}
        <motion.div 
          style={{ y: watermarkY, writingMode: 'vertical-rl', color: theme.primary }}
          className={`absolute left-0 md:left-12 top-1/2 -translate-y-1/2 ${theme.fontDisplay} text-7xl md:text-9xl tracking-widest pointer-events-none select-none opacity-10`}
        >
          {section.title.split(' ')[0]}
        </motion.div>

        {/* Character Overlay (Midground) */}
        {section.character && (
          <motion.div 
            style={{ 
              y: charY,
              opacity: charOpacity, 
              x: section.character.side === 'left' ? charXLeft : charXRight,
              scale: charScale
            }}
            className={`absolute top-1/2 -translate-y-1/2 ${section.character.side === 'left' ? '-left-10 md:left-32' : '-right-10 md:right-32'} flex flex-col items-center gap-8 pointer-events-none z-0 md:z-20`}
          >
            <div className="relative group/char">
              <div 
                className="absolute -inset-3 border scale-95 group-hover/char:scale-100 transition-transform duration-1000 ease-out hidden md:block" 
                style={{ borderColor: theme.primary, opacity: 0.3 }}
              />
              <div className="absolute -inset-1 border border-white/10 hidden md:block" />
              <img 
                src={section.character.img} 
                alt={section.character.name} 
                className="w-40 h-64 md:w-64 md:h-[22rem] object-cover opacity-20 md:opacity-90 group-hover/char:opacity-100 transition-all duration-1000 ease-out"
              />
              <div 
                className={`absolute -bottom-4 -left-4 bg-black border text-white px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-xs ${theme.fontSans} font-light tracking-[0.3em] uppercase shadow-2xl`}
                style={{ borderColor: theme.primary, opacity: 0.8 }}
              >
                {section.character.name}
              </div>

              {/* Animated Speech Bubble */}
              <motion.div 
                style={{ 
                  scale: bubbleScale, 
                  opacity: bubbleOpacity,
                  borderColor: theme.primary 
                }}
                className={`absolute left-1/2 -translate-x-1/2 bottom-[100%] md:bottom-[105%] mb-2 md:mb-4 w-48 md:w-64 bg-black/90 backdrop-blur-xl border p-4 md:p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 origin-bottom`}
              >
                <div 
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 border-b border-r w-3 h-3 md:w-4 md:h-4 bg-black/90 rotate-45`}
                  style={{ borderColor: theme.primary }}
                />
                <p className={`text-[10px] md:text-sm text-gray-200 ${theme.fontDisplay} italic leading-relaxed tracking-wide relative z-10`}>
                  "{section.character.quote}"
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Text Content (Foreground) */}
        <motion.div style={{ y: textY }} className="relative z-10 flex flex-col items-center max-w-3xl">
          {section.logo && (
            <motion.img 
              src={section.logo} 
              alt={section.title} 
              className="h-20 md:h-28 mx-auto mb-12 object-contain" 
              style={{ filter: `drop-shadow(0 0 30px ${theme.shadow})` }}
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
          <h2 className={`text-4xl md:text-6xl lg:text-7xl ${theme.fontDisplay} font-normal mb-6 tracking-[0.15em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
            {section.title}
          </h2>
          <div 
            className="w-px h-16 my-4" 
            style={{ backgroundImage: `linear-gradient(to bottom, ${theme.primary}, transparent)` }}
          />
          <h3 
            className={`text-xs md:text-sm ${theme.fontSans} font-light mb-8 tracking-[0.4em] uppercase`}
            style={{ color: theme.primary }}
          >
            {section.subtitle}
          </h3>
          <p className={`text-sm md:text-base text-gray-400 leading-loose max-w-2xl mx-auto mb-10 ${theme.fontSans} font-light tracking-wide`}>
            {section.content}
          </p>
          {section.pricing && (
            <div className={`mt-4 px-8 py-4 border border-white/10 text-xs text-gray-500 ${theme.fontSans} font-light tracking-[0.2em] uppercase relative overflow-hidden group/price`}>
              <div 
                className="absolute inset-0 translate-x-[-100%] group-hover/price:translate-x-[100%] transition-transform duration-1000" 
                style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.primary}20, transparent)` }}
              />
              {section.pricing}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        try {
          navigator.clipboard.writeText(''); // Clear clipboard
        } catch (err) {}
      }
      // Prevent Ctrl+S / Cmd+S / Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Butter smooth momentum (Cinematic Flow)
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 60,
    mass: 0.8
  });

  const { user, logout } = useAuth();

  // Global Parallax Layers
  const bgRotate = useTransform(smoothProgress, [0, 1], [0, 90]);
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.5, 1]);
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '30%']); // Slow background move
  
  const fgY1 = useTransform(smoothProgress, [0, 1], ['0%', '-200%']); // Fast foreground
  const fgY2 = useTransform(smoothProgress, [0, 1], ['0%', '-400%']); // Very fast foreground

  return (
    <div className="wrapper">
      <motion.div 
        ref={containerRef} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-black text-white relative"
      >
        <div className="scrollElement" />
        <svg className="parallax-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M 0 0 L 100 100 M 100 0 L 0 100" 
            stroke="rgba(204,0,0,0.15)" 
            strokeWidth="0.2" 
            fill="none" 
            style={{ pathLength: smoothProgress }} 
          />
        </svg>

        {/* Deep Background Layer (Slow Parallax) */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 z-0 pointer-events-none bg-black">
        {/* Deep red glow in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,0,0,0.4)_0%,black_100%)]" />
        
        {/* Shifting Infinity Castle Geometry */}
        <div className="absolute inset-0 perspective-[2000px] flex items-center justify-center opacity-40">
          <motion.div style={{ rotateZ: bgRotate, scale: bgScale }} className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[150vw] h-[150vh] border-[1px] border-[#cc0000]/20 rotate-45 transition-transform duration-1000" />
            <div className="absolute w-[120vw] h-[120vh] border-[1px] border-white/5 -rotate-12 transition-transform duration-1000" />
            <div className="absolute w-[200vw] h-[50vh] border-y-[1px] border-[#cc0000]/10 rotate-90 transition-transform duration-1000" />
            {/* Moving grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          </motion.div>
        </div>
      </motion.div>

      {/* 3D Scrolling Content (Midground) */}
      <div className="relative z-10 perspective-[1500px]">
        {/* Add an extra invisible div at the top to allow scrolling to start */}
        <div className="h-[1px] w-full" />
        {SECTIONS.map((section, index) => (
          <div key={section.id} className="h-screen w-full snap-center relative">
            <SectionItem 
              section={section} 
              index={index} 
              total={SECTIONS.length} 
            />
          </div>
        ))}

        <div className="snap-center relative w-full">
          <GallerySection />
        </div>
        
        <div className="snap-center relative w-full">
          <FortuneCandle />
        </div>
      </div>

      {/* Foreground Parallax Layer (Fast Moving Particles/Streaks) */}
      <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
        <motion.div style={{ y: fgY1 }} className="absolute inset-0">
          {/* Floating dust/particles */}
          <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-[#cc0000] rounded-full blur-[1px] opacity-50" />
          <div className="absolute top-[40%] left-[80%] w-2 h-2 bg-white rounded-full blur-[2px] opacity-30" />
          <div className="absolute top-[70%] left-[30%] w-1.5 h-1.5 bg-[#cc0000] rounded-full blur-[1px] opacity-40" />
          <div className="absolute top-[90%] left-[70%] w-1 h-1 bg-white rounded-full blur-[1px] opacity-60" />
          {/* Fast moving light streak */}
          <div className="absolute top-[50%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#cc0000]/20 to-transparent -rotate-12" />
        </motion.div>
        
        <motion.div style={{ y: fgY2 }} className="absolute inset-0">
          <div className="absolute top-[20%] left-[60%] w-3 h-3 bg-white rounded-full blur-[3px] opacity-20" />
          <div className="absolute top-[60%] left-[10%] w-2 h-2 bg-[#cc0000] rounded-full blur-[2px] opacity-40" />
          <div className="absolute top-[80%] left-[90%] w-1 h-1 bg-white rounded-full blur-[1px] opacity-50" />
          {/* Another streak */}
          <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45" />
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
}
