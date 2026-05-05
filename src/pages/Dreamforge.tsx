import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { Play, Film, User, Star, ChevronDown, Mail, Send, ShieldCheck, ExternalLink } from 'lucide-react';
import { ProtectedImage } from '../components/ProtectedImage';
import { GithubShowcase } from '../components/GithubShowcase';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Dreamforge() {
  const { user } = useAuth();
  
  // Ref for segments
  const portalRef = useRef(null);
  const premiereRef = useRef(null);
  const kingRef = useRef(null);
  const charactersRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 25, stiffness: 50 });
  
  // Parallax Values
  const y1 = useTransform(smoothProgress, [0, 1], [0, -500]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -300]);
  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 45]);
  
  const opacityHero = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const scaleHero = useTransform(smoothProgress, [0, 0.15], [1, 0.85]);

  // Specific Parallax for Premiere
  const { scrollYProgress: premProgress } = useScroll({
    target: premiereRef,
    offset: ["start end", "end start"]
  });
  const premY = useTransform(premProgress, [0, 1], [100, -100]);
  const premRotate = useTransform(premProgress, [0, 1], [-5, 5]);

  // Specific Parallax for King
  const { scrollYProgress: kingProgress } = useScroll({
    target: kingRef,
    offset: ["start end", "end start"]
  });
  const kingScale = useTransform(kingProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        source: 'Dreamforge Productions'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWatchFeature = async (videoId: string, quality: 'hd1080' | 'hd2160') => {
    try {
      const videoElement = document.getElementById(`video-${videoId}`);
      if (videoElement) {
        if (videoElement.requestFullscreen) {
          await videoElement.requestFullscreen();
          if (window.screen.orientation && (window.screen.orientation as any).lock) {
            await (window.screen.orientation as any).lock('landscape').catch(() => {});
          }
        }
      }
    } catch (e) {
      console.log('Cinematic transition failed:', e);
    }
  };

  const portalData = [
    {
      title: "SK GROUP OF COMPANY",
      desc: "A comprehensive digital gateway serving as the central hub for all upcoming software, applications, and innovative web releases from the SK Group ecosystem.",
      logo: "https://i.ibb.co/KptDmbVD/SK-GROUP-OF-COMPANY.jpg",
      link: "https://sk-group-of-company.vercel.app"
    },
    {
      title: "SK DREAMFORGE PRODUCTIONS",
      desc: "The elite animation and cinematic wing of SK Group, dedicated to forging high-quality digital narratives and visual spectacles through cutting-edge technology.",
      logo: "https://i.ibb.co/bM71X4s8/Gemini-Generated-Image-1.png",
      link: "#"
    },
    {
      title: "SPIEOH PICTURES",
      desc: "A premium motion picture division under SK Group, focusing on feature-length visual storytelling, cinematic distribution, and groundbreaking film techniques.",
      logo: "https://i.ibb.co/8Z1knTf/1777355413875-2.jpg",
      link: "#"
    }
  ];

  const characters = [
    {
      name: "SHIVA",
      role: "Protagonist",
      img: "https://i.ibb.co/CsSyMLr0/SHIVA-TRANS.png",
      description: "The beacon of hope and strength in the Dreamforge Universe, embodying terminal resilience."
    },
    {
      name: "RYUZEN KANZORO",
      role: "Villian",
      img: "https://i.ibb.co/fYN4G8DS/RYUZEN-KENZORO.png",
      description: "A formidable strategist whose presence marks the dawn of a new, complex conflict."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#cc0000] selection:text-white overflow-x-hidden font-sans">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#cc0000]/20 via-transparent to-[#050505] z-10 pointer-events-none" />
          <div className="sp-embed-player h-full w-full">
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, objectFit: 'cover' }} 
              scrolling="no" 
              src="https://go.screenpal.com/player/cOhVb2nONgy?ff=1&ahc=1&dcc=1&tl=1&bg=transparent&share=1&download=1&embed=1&cl=1&autoplay=1&loop=1" 
              allowFullScreen={true}
              title="Identity Animation"
              allow="autoplay; fullscreen"
            />
          </div>
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProtectedImage 
              src="https://i.ibb.co/bM71X4s8/Gemini-Generated-Image-1.png"
              alt="SK Dreamforge Logo"
              wrapperClassName="w-48 h-48 md:w-64 md:h-64 mx-auto mb-12 rounded-full border-4 border-[#cc0000]/30 shadow-[0_0_50px_rgba(204,0,0,0.4)]"
              imageClassName="object-contain p-4"
            />
            <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-4 italic">
              SK DREAMFORGE
              <span className="block text-[#cc0000] non-italic text-2xl md:text-4xl tracking-[0.3em] mt-4">PRODUCTIONS</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-gray-400">Authenticated Secured Access</span>
            </div>
            <div className="animate-bounce p-3 rounded-full border border-white/10 mt-8">
              <ChevronDown size={28} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Portals Section */}
      <section ref={portalRef} className="py-32 px-4 md:px-8 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative overflow-hidden">
        <motion.div style={{ y: y2, rotate: rotate1 }} className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#cc0000]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-4">THE PORTALS</h2>
            <p className="text-gray-500 tracking-[0.4em] uppercase text-xs">SK Group Central Ecosystem</p>
            <div className="w-32 h-[2px] bg-[#cc0000] mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {portalData.map((portal, i) => (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative h-full flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500"
              >
                <div className="relative mb-8 group-hover:scale-110 transition-transform duration-700">
                  <div className="absolute inset-0 bg-[#cc0000]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ProtectedImage 
                    src={portal.logo}
                    alt={portal.title}
                    wrapperClassName="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10"
                    imageClassName="object-contain"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-4 italic group-hover:text-[#cc0000] transition-colors">{portal.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                  {portal.desc}
                </p>
                {portal.link !== "#" && (
                  <a 
                    href={portal.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#cc0000] font-bold text-xs tracking-widest border-b border-[#cc0000]/20 pb-1 hover:border-[#cc0000] transition-all"
                  >
                    VISIT PORTAL <ExternalLink size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Premiere Style Section */}
      <section ref={premiereRef} className="relative min-h-screen py-32 flex flex-col items-center justify-center bg-black overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#cc0000]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" 
        />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div
                style={{ y: premY }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-[1px] bg-[#cc0000]" />
                  <span className="text-[#cc0000] font-bold tracking-[0.4em] uppercase text-[10px]">EXCLUSIVE PREMIERE</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
                  SHIVA <br/> 
                  <span className="text-white non-italic flex items-center gap-4">
                    <Star size={40} className="text-[#cc0000]" />
                    LATE
                  </span>
                  <span className="text-[#cc0000]">ARRIVAL</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  Experience the defining moment of the SK Group Universe. 
                  A cinematic study of entry, power, and the weight of legacy.
                  This feature marks the beginning of our ambitious feature-length journey.
                </p>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleWatchFeature('Qd-Ma0xfETA', 'hd1080')}
                    className="flex items-center gap-3 bg-[#cc0000] hover:bg-[#990000] px-8 py-4 rounded-full font-black tracking-widest text-xs transition-transform active:scale-95 shadow-[0_10px_30px_rgba(204,0,0,0.3)]"
                  >
                    <Play fill="white" size={16} /> WATCH FEATURE
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Production Stage</span>
                    <span className="text-white font-bold text-sm tracking-wider">COMPLETED • V1.0</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2">
              <motion.div 
                style={{ rotate: premRotate }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group h-full w-full aspect-video rounded-2xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(204,0,0,0.15)] bg-black"
                id="video-Qd-Ma0xfETA"
              >
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/Qd-Ma0xfETA?si=DuWeIup7CLuEGj0e&autoplay=0&controls=1&modestbranding=1&vq=hd1080&rel=0" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
                  allowFullScreen 
                  className="absolute inset-0 w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Showcase Section */}
      <section className="py-24 md:py-32 px-0 md:px-8 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20 px-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-4">CINEMATIC <span className="text-[#cc0000]">FEATURE</span></h2>
            <p className="text-gray-500 tracking-[0.4em] uppercase text-xs">SK Dreamforge Motion Works</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video md:rounded-[2rem] overflow-hidden border-y md:border border-white/10 shadow-2xl bg-black"
            id="video-9nnDMMmlI78"
          >
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/9nnDMMmlI78?si=OHthx6gTcJtrhQdH&modestbranding=1&vq=hd2160&rel=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
              allowFullScreen 
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
          <div className="mt-8 text-center px-4 md:hidden">
             <p className="text-[10px] tracking-[0.3em] font-bold text-gray-500 uppercase italic">Rotate device for cinematic landscape view</p>
          </div>
        </div>
      </section>

      {/* About Our King Section */}
      <section ref={kingRef} className="py-32 px-4 md:px-8 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative overflow-hidden">
        <motion.div style={{ y: y2 }} className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-[#cc0000]/10 blur-[150px] rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              style={{ scale: kingScale }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative grid grid-cols-2 gap-4"
            >
              <ProtectedImage 
                src="https://i.ibb.co/KjQ0FNs1/Generated-Image-October-20-2025-10-42-PM-1-2.jpg"
                alt="Sri Udhaiyan King Edition 1"
                wrapperClassName="rounded-3xl border border-[#cc0000]/20 shadow-2xl aspect-[4/5]"
                imageClassName="hover:scale-105 transition-transform duration-700"
              />
              <ProtectedImage 
                src="https://i.ibb.co/ZpKD0xrP/Generated-Image-September-21-2025-12-59-PM-2.jpg"
                alt="Sri Udhaiyan King Edition 2"
                wrapperClassName="rounded-3xl border border-[#cc0000]/20 shadow-2xl aspect-[4/5] mt-12"
                imageClassName="hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 italic">ABOUT OUR <span className="text-[#cc0000] non-italic">KING</span></h2>
                <div className="w-24 h-1 bg-[#cc0000] mx-auto md:mx-0 mb-12" />
              </div>
              
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-medium">
                <p>
                  <strong className="text-white">SRI UDHAIYAN</strong> is the visionary architect and lead developer behind the SK Group's expansive digital landscape.
                </p>
                <p>
                  From the cinematic depths of Dreamforge to the innovative community hubs like Velora, his leadership drives the technological and creative evolution of our entire ecosystem.
                </p>
                <p>
                  With expertise spanning across SK Bodybuilding, SK Studio Pro, and our next-generation AI platforms, SRI UDHAIYAN transforms complex imagination into immersive reality. 
                  Across the network, people call him <strong className="text-[#cc0000]">THE SK</strong> — the digital sovereign driving the future of animation and application design.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg md:text-xl font-black text-white">SK GROUP</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Ownership</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg md:text-xl font-black text-[#cc0000]">DREAMFORGE</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Creation</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg md:text-xl font-black text-white">SPIEOH</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Vision</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Identity Reveal Section (Added Missing Video) */}
      <section className="py-24 md:py-32 px-0 md:px-8 border-y border-white/5 bg-black overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-12"
          >
            <div className="px-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic uppercase">Identity & Logo Canvas</h2>
              <p className="text-gray-500 tracking-[0.4em] uppercase text-[10px]">CRAFTING THE BRAND VISION</p>
            </div>
            
            <div className="relative aspect-video md:rounded-[3rem] overflow-hidden border-y md:border border-white/10 shadow-[0_0_100px_rgba(204,0,0,0.1)] group bg-black">
              <div className="sp-embed-player h-full w-full">
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                  scrolling="no" 
                  src="https://go.screenpal.com/player/cOhVb2nONgy?ff=1&ahc=1&dcc=1&tl=1&bg=transparent&share=1&download=1&embed=1&cl=1" 
                  allowFullScreen={true}
                  title="Logo Reveal Cinematic"
                  allow="autoplay; fullscreen"
                />
              </div>
              <div className="absolute inset-0 bg-[#cc0000]/5 pointer-events-none group-hover:opacity-0 transition-opacity" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Character Dossiers */}
      <section ref={charactersRef} className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cc0000]/5 blur-[100px] rounded-full" />
          <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#cc0000]/5 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-4">PERSONNEL LOGS</h2>
            <div className="w-24 h-1 bg-[#cc0000] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
            {characters.map((char, i) => (
              <motion.div 
                key={char.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group w-full max-w-md mx-auto"
              >
                <div className="relative mb-12">
                  <div className="absolute -inset-4 bg-[#cc0000]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <ProtectedImage 
                    src={char.img} 
                    alt={char.name}
                    wrapperClassName="w-full aspect-[4/5] rounded-[2.5rem] bg-black border border-white/10 overflow-hidden shadow-2xl" 
                    imageClassName="object-contain p-8 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                    <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                      "{char.description}"
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-4xl font-black tracking-tighter mb-2 italic group-hover:text-[#cc0000] transition-colors">{char.name}</h3>
                  <span className="text-red-500/60 uppercase tracking-[0.4em] text-[10px] font-bold">{char.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secret Clip Teaser */}
      <section className="py-32 px-4 md:px-8 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-[#cc0000]/20 text-[#cc0000] text-[10px] tracking-widest uppercase font-bold mb-6 italic">Classified Content</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">SECRET <span className="text-[#cc0000] non-italic text-sm md:text-2xl align-top">01</span> CLIP</h2>
            <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">From Upcoming Animation Film</p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(204,0,0,0.1)] group border border-white/10 mx-auto"
          >
            <ProtectedImage 
              src="https://i.ibb.co/TMkMBGvh/SHIVA-11-11-11.png" 
              alt="Secret Clip Teaser" 
              wrapperClassName="w-full h-full"
              imageClassName="transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="flex flex-col items-center gap-4">
                <Play fill="white" size={64} className="text-white hover:scale-110 transition-transform cursor-pointer" />
                <span className="font-display text-xs tracking-[0.5em] uppercase">Fragment Detected</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Secure Contact Form */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-t from-black to-[#050505]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Mail size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[#cc0000]/20 text-[#cc0000]">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic">Collaborate</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Dreamforge Inquiry System</p>
                </div>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <Send className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-black italic mb-2 tracking-tighter">MESSAGE RELAYED</h3>
                  <p className="text-gray-400">Your inquiry has been stored in the SK Dreamforge secure database. We will respond soon.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-xs font-bold tracking-[0.3em] uppercase text-[#cc0000]"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#cc0000]/50 transition-colors"
                        placeholder="Project Lead / Creator"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#cc0000]/50 transition-colors"
                        placeholder="contact@vision.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Message / Proposal</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#cc0000]/50 transition-colors resize-none"
                      placeholder="Describe your creative vision..."
                    />
                  </div>
                  <button 
                    disabled={isSubmitting || !user}
                    className="w-full bg-[#cc0000] hover:bg-[#990000] py-6 rounded-2xl font-black tracking-[0.4em] uppercase text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_50px_rgba(204,0,0,0.2)] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? 'PROCESSING...' : (
                      <>
                        <Send size={18} /> INITIALIZE TRANSMISSION
                      </>
                    )}
                  </button>
                  {!user && <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest mt-4">Sign in required to submit inquiries</p>}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GitHub Integration Section */}
      <section className="py-32 px-4 md:px-8 border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-4">OPEN SOURCE <span className="text-[#cc0000]">ECOSYSTEM</span></h2>
            <p className="text-gray-500 tracking-[0.4em] uppercase text-xs">SK Digital Infrastructure & Assets</p>
          </div>
          <GithubShowcase />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-24 border-t border-white/5 text-center px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex justify-center gap-12 opacity-30">
            <img src="https://i.ibb.co/KptDmbVD/SK-GROUP-OF-COMPANY.jpg" alt="SK Group" className="h-8 grayscale" />
            <img src="https://i.ibb.co/bM71X4s8/Gemini-Generated-Image-1.png" alt="Dreamforge" className="h-8 grayscale" />
            <img src="https://i.ibb.co/8Z1knTf/1777355413875-2.jpg" alt="Spieoh" className="h-8 grayscale" />
          </div>
          <h2 className="text-xl font-bold tracking-[1em] uppercase mb-8 opacity-20">SPIEOH PICTURES • DREAMFORGE</h2>
          <p className="text-gray-500 text-[10px] tracking-widest uppercase font-bold">ALL RIGHTS RESERVED • BY SK GROUP OF COMPANY</p>
          <div className="mt-16 flex justify-center gap-8 opacity-20">
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"><Star size={20} /></div>
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"><Film size={20} /></div>
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"><User size={20} /></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
