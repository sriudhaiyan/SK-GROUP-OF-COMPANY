import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export function CharacterChat() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/nexora')}
      className="fixed bottom-6 left-6 z-50 p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-transform hover:scale-110"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
}
