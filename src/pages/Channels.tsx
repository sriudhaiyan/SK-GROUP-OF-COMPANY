import React from 'react';
import { motion } from 'motion/react';
import { Youtube, Instagram, Mail, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Channels() {
  const channels = [
    {
      name: 'YouTube',
      icon: <Youtube className="w-12 h-12" />,
      link: 'https://www.youtube.com/@SKGROUPOFCOMPANY-p3f4p',
      desc: 'Subscribe for cinematic trailers and updates.'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-12 h-12" />,
      link: 'https://www.instagram.com/sk_group_of_company_28?igsh=YWVyZXM4dTduZzYw',
      desc: 'Follow us for behind-the-scenes and daily content.'
    },
    {
      name: 'Gmail',
      icon: <Mail className="w-12 h-12" />,
      link: 'mailto:skgroupofcompany28@gmail.com',
      desc: 'Contact us for business inquiries and support.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white pt-32 px-8 pb-20 relative overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#cc0000]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <h1 className="text-5xl md:text-7xl font-display mb-16 tracking-[0.15em] uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Official <span className="text-[#cc0000]">Channels</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((channel, index) => (
            <motion.a 
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              key={channel.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group flex flex-col items-center text-center p-12 border border-white/10 bg-black/50 backdrop-blur-sm hover:border-[#cc0000] hover:bg-[#cc0000]/5 transition-all duration-500"
            >
              <div className="text-gray-500 group-hover:text-[#cc0000] transition-colors duration-500 mb-6 transform group-hover:scale-110">
                {channel.icon}
              </div>
              <h2 className="font-display text-2xl tracking-widest uppercase mb-4">{channel.name}</h2>
              <div className="w-8 h-px bg-white/20 group-hover:bg-[#cc0000] transition-colors duration-500 mb-4" />
              <p className="text-sm text-gray-400 font-sans font-light">
                {channel.desc}
              </p>
            </motion.a>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link 
            to="/privacy-policy"
            className="group flex items-center gap-3 px-8 py-4 border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#cc0000] hover:bg-[#cc0000]/10 transition-all duration-500 rounded-full"
          >
            <ShieldAlert className="w-5 h-5 text-gray-400 group-hover:text-[#cc0000] transition-colors duration-500" />
            <span className="font-display tracking-[0.2em] uppercase text-sm text-gray-300 group-hover:text-white transition-colors duration-500">
              View Privacy Policy
            </span>
          </Link>
          <Link 
            to="/terms-and-conditions"
            className="group flex items-center gap-3 px-8 py-4 border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#cc0000] hover:bg-[#cc0000]/10 transition-all duration-500 rounded-full"
          >
            <ShieldAlert className="w-5 h-5 text-gray-400 group-hover:text-[#cc0000] transition-colors duration-500" />
            <span className="font-display tracking-[0.2em] uppercase text-sm text-gray-300 group-hover:text-white transition-colors duration-500">
              Terms & Conditions
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
