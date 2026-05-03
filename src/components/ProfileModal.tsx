import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, LogOut, Edit2, Save, Mail, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout, updateDisplayName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await updateDisplayName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.href = '/auth';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-display tracking-widest uppercase text-white flex items-center gap-3">
                <User size={20} className="text-[#cc0000]" />
                Profile
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <img 
                    src={user.photoURL || ''} 
                    alt={user.displayName || ''} 
                    className="w-24 h-24 rounded-full border-2 border-[#cc0000]/50 shadow-[0_0_20px_rgba(204,0,0,0.3)]"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <User className="text-white" />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#cc0000] text-lg text-center"
                        autoFocus
                      />
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-[#cc0000] hover:text-[#ff0000] disabled:opacity-50"
                      >
                        <Save size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-2xl font-bold text-white">{user.displayName}</h3>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-500 flex items-center justify-center gap-2 mt-1">
                    <Mail size={14} />
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Stats/Badges */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#cc0000]/10 flex items-center justify-center text-[#cc0000]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rank</p>
                    <p className="font-bold text-white uppercase">S-Rank</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
                    <p className="font-bold text-white uppercase">Active</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 hover:bg-[#cc0000]/10 hover:border-[#cc0000]/30 text-white rounded-xl font-bold transition-all group"
              >
                <LogOut size={20} className="text-[#cc0000] group-hover:scale-110 transition-transform" />
                Logout Session
              </button>
            </div>
            
            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                SK GROUP SECURITY PROTOCOL • VERIFIED ACCESS
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
