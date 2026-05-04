import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Star, GitFork, Book, User } from 'lucide-react';

interface GitHubData {
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
  };
  repos: {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
  }[];
}

export function GithubShowcase() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to fetch GitHub data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHub();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Github size={40} className="text-[#cc0000]" />
        </motion.div>
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Initializing Secure Handshake...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <Github size={40} className="mx-auto text-gray-700 mb-4 opacity-50" />
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-2">Protocol Connection Refused</p>
        <p className="text-[#cc0000] text-sm">{error || "Please configure GITHUB_TOKEN in settings"}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative group rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#cc0000]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          <img 
            src={data.user.avatar_url} 
            alt={data.user.login} 
            className="w-32 h-32 rounded-3xl border-2 border-[#cc0000]/30 shadow-[0_0_30px_rgba(204,0,0,0.2)]"
          />
          <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-2 rounded-xl shadow-xl">
             <Github size={20} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-3xl font-black tracking-tighter italic text-white uppercase italic">{data.user.name || data.user.login}</h3>
          <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-xl">{data.user.bio}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <Book size={14} className="text-[#cc0000]" />
                <span className="text-[10px] font-bold tracking-widest">{data.user.public_repos} REPOS</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <User size={14} className="text-[#cc0000]" />
                <span className="text-[10px] font-bold tracking-widest">{data.user.followers} FOLLOWERS</span>
             </div>
             <a 
               href={data.user.html_url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="flex items-center gap-2 px-3 py-1 bg-[#cc0000] rounded-full text-white hover:bg-[#990000] transition-colors"
             >
                <span className="text-[10px] font-bold tracking-widest">VIEW PROFILE</span>
                <ExternalLink size={14} />
             </a>
          </div>
        </div>
      </motion.div>

      {/* Repos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.repos.map((repo, idx) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-all flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                 <h4 className="text-lg font-black tracking-tighter group-hover:text-[#cc0000] transition-colors line-clamp-1">{repo.name}</h4>
                 <Github size={18} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic font-serif">
                {repo.description || "No description provided for this repository."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-[10px] font-bold text-gray-400">{repo.stargazers_count}</span>
                </div>
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#cc0000]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{repo.language}</span>
                  </div>
                )}
              </div>
              <ExternalLink size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
