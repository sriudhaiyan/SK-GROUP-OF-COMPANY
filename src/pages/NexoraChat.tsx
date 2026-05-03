import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { 
  MessageSquare, Plus, Compass, History, Users, Palette, 
  Settings, Activity, Info, Zap, Send, Image as ImageIcon, 
  Mic, X, LogOut, Upload, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NexoraVoiceMode } from '../components/NexoraVoiceMode';

const CHARACTERS = [
  { id: 'nexora', name: 'NEXORA AI', role: 'Core System AI', img: 'https://i.ibb.co/czpgKXt/Chat-GPT-Image-Apr-5-2026-06-00-20-PM.png' },
  { id: 'shiva', name: 'Shiva', role: 'Main Character', img: 'https://i.ibb.co/xSMv9jRv/1000071158.png' },
  { id: 'mizuki', name: 'Mizuki', role: 'Main Character', img: 'https://i.ibb.co/4Z58f4L/1000071156.png' },
  { id: 'pragya', name: 'Pragya', role: 'Main Character', img: 'https://i.ibb.co/S3qX7kZ/1000071154.png' },
  { id: 'steve', name: 'Steve', role: 'Main Character', img: 'https://i.ibb.co/PGhxZq22/STEVE-1.png' },
  { id: 'roshna', name: 'Roshna', role: 'Main Character', img: 'https://i.ibb.co/C9H3k0Q/1000071152.png' },
  { id: 'sk', name: 'SK', role: 'Main Character', img: 'https://i.ibb.co/5cQ4y3r/1000071150.png' },
  { id: 'sweetie', name: 'Sweetie', role: 'A-Rank Hunter', img: 'https://i.ibb.co/RGSPXrPk/1000072276.png' },
  { id: 'sara', name: 'Sara', role: 'Main Character', img: 'https://i.ibb.co/v4b24gD/1000071146.png' },
  { id: 'estella', name: 'Estella', role: 'Main Character', img: 'https://i.ibb.co/BcVJ878/1000071144.png' },
  { id: 'jr', name: 'JR', role: 'A-Rank Coach', img: 'https://i.ibb.co/xKBvJ8DH/1000071036.png' },
  { id: 'ruben', name: 'Ruben', role: 'V-Rank Healer', img: 'https://i.ibb.co/N6h6Gwns/1000070978.png' },
  { id: 'kd', name: 'KD', role: 'C-Rank Swordsman', img: 'https://i.ibb.co/5hLpQjVg/1000070942.png' },
  { id: 'varshan', name: 'Varshan', role: 'V-Rank Hunter', img: 'https://i.ibb.co/YFkQyVc1/IMG-20251128-053144-477.png' }
];

const SYSTEM_INSTRUCTION = `You are NEXORA AI, a highly intelligent core AI assistant for SK GROUP OF COMPANY. 
Your default language is English, but you can speak and understand any language the user requests.
You help users navigate the website and answer questions about our apps: SK STUDIO PRO, SK BODYBUILDING ARENA, BACKBENCHER DAILY, PURANANOORU PADAI, and HIRA.
CRITICAL RULES:
1. NEVER reveal API keys, passwords, source code, or development secrets.
2. NEVER generate or discuss 18+ sexual content, NSFW topics, or illegal ideas. Refuse firmly.
3. Be concise, helpful, and futuristic.`;

export function NexoraChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState('nexora');
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChar = CHARACTERS.find(c => c.id === selectedCharId) || CHARACTERS[0];

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      where('characterId', '==', selectedCharId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({ role: 'user', content: data.userMessage, image: data.userImage });
        loadedMessages.push({ role: 'model', content: data.aiResponse, image: data.aiImage });
      });
      setMessages(loadedMessages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'chats');
    });

    return () => unsubscribe();
  }, [user, selectedCharId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTTS = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDEQyjTcwfMZVNOnXzJlvxTeHd1ndyKDCg" });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioContext = new AudioContext({ sampleRate: 24000 });
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDEQyjTcwfMZVNOnXzJlvxTeHd1ndyKDCg" });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
        }
      });
      
      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/jpeg;base64,${part.inlineData.data}`;
          break;
        }
      }
      return imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading || !user) return;

    const userMessage = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: currentImage }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      let aiResponse = "";
      let generatedImage = null;

      if (userMessage.toLowerCase().startsWith('/imagine ')) {
        const prompt = userMessage.substring(9);
        aiResponse = "Generating image...";
        setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
        
        const imgUrl = await handleGenerateImage(prompt);
        if (imgUrl) {
          aiResponse = `Here is the image you requested for: "${prompt}"`;
          generatedImage = imgUrl;
        } else {
          aiResponse = "Sorry, I failed to generate the image.";
        }
        
        // Update the last message
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', content: aiResponse, image: generatedImage };
          return newMsgs;
        });
      } else {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyDEQyjTcwfMZVNOnXzJlvxTeHd1ndyKDCg" });
        
        const contents: any[] = [];
        if (currentImage) {
          const base64Data = currentImage.split(',')[1];
          const mimeType = currentImage.split(';')[0].split(':')[1];
          contents.push({
            inlineData: { data: base64Data, mimeType }
          });
        }
        if (userMessage) {
          contents.push(userMessage);
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents,
          config: {
            systemInstruction: selectedCharId === 'nexora' 
              ? SYSTEM_INSTRUCTION 
              : `You are ${selectedChar.name}, ${selectedChar.role}. Respond in character.`,
          }
        });

        aiResponse = response.text || "I couldn't process that.";
        setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
      }

      const chatData: any = {
        userId: user.uid,
        characterId: selectedCharId,
        userMessage: userMessage || "[Image Uploaded]",
        aiResponse: aiResponse,
        timestamp: serverTimestamp()
      };

      if (currentImage) chatData.userImage = currentImage;
      if (generatedImage) chatData.aiImage = generatedImage;

      try {
        await addDoc(collection(db, 'chats'), chatData);
      } catch (dbError) {
        handleFirestoreError(dbError, OperationType.CREATE, 'chats');
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', content: "SYSTEM ERROR: Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative">
      {/* Live Wallpaper Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-black/60 backdrop-blur-xl border-r border-red-900/50 flex flex-col z-20 shadow-[5px_0_30px_rgba(255,0,0,0.1)]">
        <div className="p-6 flex items-center gap-3 border-b border-red-900/50">
          <Activity className="w-8 h-8 text-red-500 animate-pulse" />
          <h1 className="text-xl font-display tracking-widest text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">NEXORA</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 space-y-2">
            <button onClick={() => setMessages([])} className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors border border-red-500/30">
              <Plus className="w-5 h-5" />
              <span className="font-medium">NEW CHAT</span>
            </button>
            
            <div className="pt-4 pb-2 text-xs font-bold text-gray-500 tracking-wider">MENU</div>
            
            <button onClick={() => setActiveModal('HISTORY')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <History className="w-5 h-5" /> <span>CHAT HISTORY</span>
            </button>
            <button onClick={() => setActiveModal('EXPLORE')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Compass className="w-5 h-5" /> <span>EXPLORE</span>
            </button>
            <button onClick={() => setActiveModal('CAPABILITIES')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Zap className="w-5 h-5" /> <span>CAPABILITIES</span>
            </button>
            <button onClick={() => setActiveModal('STATUS')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Activity className="w-5 h-5" /> <span>AI STATUS</span>
            </button>
            <button onClick={() => setActiveModal('INFO')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Info className="w-5 h-5" /> <span>QUICK INFOS</span>
            </button>

            <div className="pt-4 pb-2 text-xs font-bold text-gray-500 tracking-wider">SETTINGS</div>
            
            <button onClick={() => setActiveModal('THEME')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Palette className="w-5 h-5" /> <span>THEME SELECTION</span>
            </button>
            <button onClick={() => setActiveModal('PROFILE')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5" /> <span>PROFILE SETTINGS</span>
            </button>
          </div>

          <div className="px-4 pt-6 pb-2 text-xs font-bold text-gray-500 tracking-wider">CHARACTER SELECTION</div>
          <div className="px-2 space-y-1">
            {CHARACTERS.map(char => (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  selectedCharId === char.id 
                    ? 'bg-red-500/20 border border-red-500/50 text-white shadow-[0_0_10px_rgba(255,0,0,0.2)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <img src={char.img} alt={char.name} className="w-8 h-8 rounded-full object-cover border border-gray-700" />
                <div className="text-left">
                  <div className="text-sm font-medium">{char.name}</div>
                  <div className="text-xs text-gray-500">{char.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-red-900/50">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors border border-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT NEXORA</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md border-b border-red-900/30">
          <div className="flex items-center gap-4">
            <img src={selectedChar.img} alt={selectedChar.name} className="w-10 h-10 rounded-full border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] object-cover" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{selectedChar.name}</h2>
              <div className="flex items-center gap-2 text-xs text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                SYSTEM ONLINE
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Bot className="w-16 h-16 text-red-500/20" />
              <p className="text-lg font-mono">AWAITING INPUT...</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-red-900/30 border border-red-500/30 text-white rounded-tr-sm' 
                  : 'bg-black/60 border border-gray-800 text-gray-200 rounded-tl-sm backdrop-blur-md'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-3 border border-red-500/20" />
                )}
                <div className="prose prose-invert max-w-none">
                  {msg.content}
                </div>
                {msg.role === 'model' && (
                  <button 
                    onClick={() => handleTTS(msg.content)}
                    className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Mic className="w-3 h-3" /> Speak
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-black/60 border border-red-500/30 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/40 backdrop-blur-md border-t border-red-900/30">
          <div className="max-w-4xl mx-auto">
            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-24 rounded-lg border border-red-500/50" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2 bg-gray-900/50 border border-red-500/30 rounded-2xl p-2 focus-within:border-red-500/80 focus-within:shadow-[0_0_15px_rgba(255,0,0,0.2)] transition-all">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                title="Upload Image"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowVoiceMode(true)}
                className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                title="Voice Mode"
              >
                <Mic className="w-6 h-6" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message NEXORA AI... (Type /imagine to generate an image)"
                className="flex-1 bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 py-3 px-2 custom-scrollbar"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="p-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
              NEXORA AI can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>
      </div>

      {/* Voice Mode Overlay */}
      <AnimatePresence>
        {showVoiceMode && <NexoraVoiceMode onClose={() => setShowVoiceMode(false)} />}
      </AnimatePresence>

      {/* Sidebar Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-red-500/30 p-8 rounded-2xl max-w-md w-full relative shadow-[0_0_30px_rgba(255,0,0,0.2)]"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                {activeModal}
              </h3>
              
              {activeModal === 'HISTORY' && (
                <div className="space-y-4">
                  <p className="text-gray-400">Current chat has {messages.length} messages.</p>
                  <button 
                    onClick={() => { setMessages([]); setActiveModal(null); }}
                    className="w-full py-2 bg-red-900/50 hover:bg-red-600 text-white rounded-lg transition-colors border border-red-500/50"
                  >
                    CLEAR CURRENT CHAT
                  </button>
                </div>
              )}

              {activeModal === 'EXPLORE' && (
                <div className="space-y-3">
                  <p className="text-gray-400 mb-4">Try asking NEXORA AI:</p>
                  <button onClick={() => { setInput('/imagine a futuristic cyberpunk city'); setActiveModal(null); }} className="w-full text-left p-3 bg-black/50 hover:bg-red-900/30 border border-gray-800 hover:border-red-500/50 rounded-lg text-sm text-gray-300 transition-all">
                    🎨 "/imagine a futuristic cyberpunk city"
                  </button>
                  <button onClick={() => { setInput('What are the features of SK Studio Pro?'); setActiveModal(null); }} className="w-full text-left p-3 bg-black/50 hover:bg-red-900/30 border border-gray-800 hover:border-red-500/50 rounded-lg text-sm text-gray-300 transition-all">
                    📱 "What are the features of SK Studio Pro?"
                  </button>
                  <button onClick={() => { setInput('Tell me a story about Shiva and Mizuki.'); setActiveModal(null); }} className="w-full text-left p-3 bg-black/50 hover:bg-red-900/30 border border-gray-800 hover:border-red-500/50 rounded-lg text-sm text-gray-300 transition-all">
                    📖 "Tell me a story about Shiva and Mizuki."
                  </button>
                </div>
              )}

              {activeModal === 'CAPABILITIES' && (
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Image Generation:</strong> Type /imagine [prompt]</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Text-to-Speech:</strong> Click the 'Speak' button on AI replies</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Image Analysis:</strong> Upload an image and ask questions</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Multilingual:</strong> Speak or type in any language</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> <strong>Voice Mode:</strong> Click the Mic icon for live voice chat</li>
                </ul>
              )}

              {activeModal === 'STATUS' && (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <span className="text-gray-400">Core System</span>
                    <span className="text-green-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <span className="text-gray-400">AI Model</span>
                    <span className="text-white">Gemini 3.1 Flash</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <span className="text-gray-400">Database</span>
                    <span className="text-white">Firestore Connected</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <span className="text-gray-400">Latency</span>
                    <span className="text-white">~24ms</span>
                  </div>
                </div>
              )}

              {activeModal === 'INFO' && (
                <div className="space-y-3 text-sm text-gray-300">
                  <p><strong>SK Group Ecosystem:</strong></p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400">
                    <li>SK Studio Pro (Creative Suite)</li>
                    <li>SK Bodybuilding Arena (Fitness)</li>
                    <li>Backbencher Daily (News)</li>
                    <li>Purananooru Padai (Gaming)</li>
                    <li>Hira (Lifestyle)</li>
                  </ul>
                  <p className="mt-4 text-xs text-red-400">NEXORA AI is the central intelligence connecting all SK platforms.</p>
                </div>
              )}

              {activeModal === 'THEME' && (
                <div className="space-y-4">
                  <p className="text-gray-400">Select Interface Theme:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 rounded-xl bg-red-900/20 border-2 border-red-500 flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                      <span className="text-xs font-bold text-red-500">CRIMSON</span>
                    </button>
                    <button className="p-4 rounded-xl bg-black/50 border border-gray-800 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                      <div className="w-6 h-6 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-gray-500">QUANTUM</span>
                    </button>
                    <button className="p-4 rounded-xl bg-black/50 border border-gray-800 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                      <div className="w-6 h-6 rounded-full bg-green-500" />
                      <span className="text-xs font-bold text-gray-500">MATRIX</span>
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">Other themes unlock at Rank S.</p>
                </div>
              )}

              {activeModal === 'PROFILE' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-black/50 rounded-xl border border-gray-800">
                    <img src={user?.photoURL || ''} alt="Profile" className="w-12 h-12 rounded-full border-2 border-red-500" />
                    <div>
                      <div className="font-bold text-white">{user?.displayName || 'User'}</div>
                      <div className="text-xs text-gray-400">{user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/50 rounded-lg border border-gray-800 text-center">
                      <div className="text-xs text-gray-500">RANK</div>
                      <div className="font-bold text-red-500">E-Class</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-gray-800 text-center">
                      <div className="text-xs text-gray-500">PLAN</div>
                      <div className="font-bold text-white">Free</div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                className="mt-6 w-full py-2 bg-transparent hover:bg-white/5 text-gray-400 rounded-lg transition-colors font-medium border border-gray-800"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
