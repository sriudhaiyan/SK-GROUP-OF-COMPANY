import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export function Auth() {
  const { signInWithGoogle, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    }
  };

  if (user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative h-screen grid items-center bg-black text-white justify-items-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center z-10"
        >
          <img src={user.photoURL || ''} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.displayName}</h2>
          <p className="text-gray-400 mb-6">You are authenticated with SK Group.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-colors"
          >
            Enter the Universe
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative h-screen grid items-center bg-black text-white overflow-hidden justify-items-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://i.ibb.co/93d7D3dZ/chiemseherin-milky-way-9767930.jpg"
          alt="Milky Way Background"
          className="absolute w-full h-full object-cover object-center"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 max-w-md w-full text-center"
      >
        <img src="https://i.ibb.co/MyJSD5dk/1763888185441.png" alt="SK Group" className="h-20 mx-auto mb-8" />
        <h1 className="text-3xl font-bold mb-2">SK GROUP</h1>
        <p className="text-gray-400 mb-8">Sign in to access the ecosystem</p>
        
        <button 
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm overflow-auto max-h-32">
            {error}
          </div>
        )}
        
        <div className="mt-8 text-xs text-gray-500">
          By signing in, you agree to our Terms & Policy and User Agreement.
        </div>
      </motion.div>
    </motion.div>
  );
}
