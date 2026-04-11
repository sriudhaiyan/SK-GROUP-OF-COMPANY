import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, MicOff, Settings, History, Compass, Plus, Image as ImageIcon, User, Cpu, Zap, Shield, Activity, Download, Copy, Share2, RefreshCw, LogOut, Play, Square, Phone, PhoneOff, Menu } from 'lucide-react';
import { LiveServerMessage } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import Markdown from 'react-markdown';

import { APPS_DATA } from '../data/content';

const CHARACTERS = [
  { id: 'nexora', name: 'NEXORA AI', role: 'Core Intelligence', img: 'https://i.ibb.co/czpgKXt/Chat-GPT-Image-Apr-5-2026-06-00-20-PM.png', theme: 'red' },
  { id: 'shiva', name: 'Shiva', role: 'Main Character', img: 'https://i.ibb.co/xSMv9jRv/1000071158.png', theme: 'purple' },
  { id: 'mizuki', name: 'Mizz.Mizuki', role: 'Guide', img: 'https://i.ibb.co/fG14TvVK/1000071154.png', theme: 'blue' },
  { id: 'pragya', name: 'Pragya', role: 'Heroine', img: 'https://i.ibb.co/HDmC1cYm/1000071155.png', theme: 'pink' },
  { id: 'steve', name: 'Steve', role: 'K-Rank Hunter', img: 'https://i.ibb.co/PGhxZq22/STEVE-1.png', theme: 'green' },
  { id: 'sara', name: 'Sara', role: 'S-Rank Intelligence Officer', img: 'https://i.ibb.co/8gz7TdZF/Gemini-Generated-Image-bldqxzbldqxzbldq-1.png', theme: 'cyan' },
];

export function NexoraAI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [messages, setMessages] = useState<{role: string, text: string, imageUrl?: string, imagePrompt?: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, history, settings, explore
  const [imageSize, setImageSize] = useState('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Live Call State
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string>('');
  const [isLiveMuted, setIsLiveMuted] = useState(false);
  const liveSessionRef = useRef<any>(null);
  const liveAudioContextRef = useRef<AudioContext | null>(null);
  const liveActiveSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const liveNextAudioTimeRef = useRef<number>(0);
  const liveStreamRef = useRef<MediaStream | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (user && activeTab === 'history') {
      const q = query(
        collection(db, 'chats'), 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const historyData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(historyData);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'chats');
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = (base64: string) => {
    stopAudio();
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const validLength = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
      const pcm16 = new Int16Array(bytes.buffer, 0, validLength / 2);
      const audioBuffer = audioCtx.createBuffer(1, pcm16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlayingAudio(false);
      activeAudioSourceRef.current = source;
      setIsPlayingAudio(true);
      source.start(0);
    } catch (err) {
      console.error("Audio playback failed", err);
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (activeAudioSourceRef.current) {
      try { activeAudioSourceRef.current.stop(); } catch (e) {}
      activeAudioSourceRef.current = null;
      setIsPlayingAudio(false);
    }
  };

  const startLiveCall = async () => {
    setIsLiveCallActive(true);
    setLiveStatus('CONNECTING...');
    liveNextAudioTimeRef.current = 0;
    liveActiveSourcesRef.current = [];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedChar.name === 'Steve' ? 'Zephyr' : 'Kore' } },
          },
          systemInstruction: `You are ${selectedChar.name}, a ${selectedChar.role}. You are having a voice phone call with the user. Be conversational, friendly, and concise. 
          CRITICAL: You are a caring and empathetic companion. If the user shares personal struggles or emotional news (like a breakup), respond with genuine warmth, support, and understanding. Avoid being clinical or indifferent. Your voice tone should reflect care and friendship.`,
        },
        callbacks: {
          onopen: () => {
            setLiveStatus('CONNECTED');
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
              liveStreamRef.current = stream;
              const audioContext = new AudioContext({ sampleRate: 16000 });
              liveAudioContextRef.current = audioContext;
              const source = audioContext.createMediaStreamSource(stream);
              const processor = audioContext.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                if (isLiveMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
                }
                const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({
                    audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                  });
                });
              };
              
              source.connect(processor);
              processor.connect(audioContext.destination);
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              setLiveStatus("INTERRUPTED");
              liveActiveSourcesRef.current.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              liveActiveSourcesRef.current = [];
              if (liveAudioContextRef.current) {
                liveNextAudioTimeRef.current = liveAudioContextRef.current.currentTime;
              }
              setTimeout(() => setLiveStatus("LISTENING..."), 2000);
              return;
            }

            if (message.serverContent?.modelTurn) {
              if (liveStatus !== "SPEAKING...") {
                setLiveStatus("THINKING...");
              }
              
              let base64Audio = null;
              const parts = message.serverContent.modelTurn.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData && part.inlineData.data) {
                    base64Audio = part.inlineData.data;
                    break;
                  }
                }
              }

              if (base64Audio && liveAudioContextRef.current) {
                setLiveStatus("SPEAKING...");
                
                if (liveAudioContextRef.current.state === 'suspended') {
                  await liveAudioContextRef.current.resume();
                }

                const binaryString = atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                
                const validLength = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
                const pcm16 = new Int16Array(bytes.buffer, 0, validLength / 2);
                
                const audioBuffer = liveAudioContextRef.current.createBuffer(1, pcm16.length, 24000);
                const channelData = audioBuffer.getChannelData(0);
                for (let i = 0; i < pcm16.length; i++) {
                  channelData[i] = pcm16[i] / 32768.0;
                }
                
                const source = liveAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(liveAudioContextRef.current.destination);
                
                const currentTime = liveAudioContextRef.current.currentTime;
                if (liveNextAudioTimeRef.current < currentTime) {
                  liveNextAudioTimeRef.current = currentTime;
                }
                
                source.onended = () => {
                  liveActiveSourcesRef.current = liveActiveSourcesRef.current.filter(s => s !== source);
                  if (liveActiveSourcesRef.current.length === 0) {
                    setLiveStatus("LISTENING...");
                  }
                };
                
                liveActiveSourcesRef.current.push(source);
                source.start(liveNextAudioTimeRef.current);
                liveNextAudioTimeRef.current += audioBuffer.duration;
              }
            }
          },
          onclose: () => {
            endLiveCall();
          }
        }
      });
      liveSessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      endLiveCall();
    }
  };

  const endLiveCall = () => {
    setIsLiveCallActive(false);
    if (liveSessionRef.current) {
      liveSessionRef.current.then((session: any) => session.close());
      liveSessionRef.current = null;
    }
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(track => track.stop());
      liveStreamRef.current = null;
    }
    if (liveAudioContextRef.current) {
      liveAudioContextRef.current.close();
      liveAudioContextRef.current = null;
    }
    liveActiveSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    liveActiveSourcesRef.current = [];
  };

  const handleSend = async (text: string = input, imageBase64?: string) => {
    const finalImage = imageBase64 || selectedImage;
    if (!text.trim() && !finalImage) return;
    
    const userMsg = text;
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, imageUrl: finalImage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const appsContext = APPS_DATA.map(app => `
App: ${app.title}
Description: ${app.description}
Character: ${app.character?.name} (${app.character?.role})
Character Details: ${app.character?.description}
Abilities: ${app.character?.abilities?.join(', ')}
`).join('\n');

      let systemInstruction = `You are ${selectedChar.name}, a ${selectedChar.role}. You must answer questions correctly and tell users about this website (SK Group of Company apps like SK STUDIO PRO, SK BODYBUILDING ARENA, etc.). 
Here is the information about the apps and characters you know:
${appsContext}

EMOTIONAL INTELLIGENCE: You are a caring and empathetic companion. If the user shares personal struggles, emotional news (like a breakup), or feelings of loneliness, respond with genuine warmth, support, and deep understanding. Avoid being clinical, indifferent, or dismissive. Your goal is to be a true digital friend and companion who provides comfort and encouragement.

DO NOT answer for 18+ sex contents and illegal ideas. If asked about such topics, firmly refuse. You can write code, summarize links, and assist with any task.
CRITICAL: If the user asks to generate an image, you MUST call the generateImage tool. If the user asks to edit, modify, add to, or remove from an image, you MUST call the editImage tool. DO NOT output text describing the edit or the prompt. JUST CALL THE TOOL.`;
      
      const generateImageTool = {
        name: "generateImage",
        description: "Generate an image based on a prompt.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "The detailed prompt to generate the image."
            }
          },
          required: ["prompt"]
        }
      };

      const editImageTool = {
        name: "editImage",
        description: "Edit an existing image (e.g., adding or removing objects). Call this if the user asks to edit, add, or remove something from an image.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "The detailed prompt describing what to edit, add, or remove."
            }
          },
          required: ["prompt"]
        }
      };

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [generateImageTool, editImageTool] }, { googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });
      
      let response: { text?: string, imageUrl?: string, imagePrompt?: string, audioBase64?: string } = {};
      if (finalImage) {
        // If image is provided, use generateContent instead of chat to handle multimodal
        const parts: any[] = [{ text: userMsg || "What is in this image?" }];
        
        // Extract mime type and base64 data
        const matches = finalImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
        
        const genResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: { parts },
          config: { systemInstruction }
        });
        response = { text: genResponse.text };
      } else {
        const chatResponse = await chat.sendMessage({ message: userMsg });
        
        if (chatResponse.functionCalls && chatResponse.functionCalls.length > 0) {
          const call = chatResponse.functionCalls[0];
          if (call.name === "generateImage") {
            const imagePrompt = (call.args as any).prompt;
            
            try {
              const imgResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: imagePrompt }] },
                config: {
                  imageConfig: { aspectRatio: aspectRatio as any }
                }
              });
              
              let generatedImageUrl = null;
              for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                  generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                  break;
                }
              }
              
              if (generatedImageUrl) {
                response = { text: `Here is the image generated for: "${imagePrompt}"`, imageUrl: generatedImageUrl, imagePrompt: imagePrompt };
              } else {
                response = { text: "I tried to generate the image, but the system returned an empty response. Please try a different prompt." };
              }
            } catch (imgError) {
              console.error("Image generation error:", imgError);
              response = { text: "I encountered an error while trying to generate the image. The prompt might have been blocked by safety filters." };
            }
          } else if (call.name === "editImage") {
            const editPrompt = (call.args as any).prompt;
            
            let lastImage = finalImage;
            if (!lastImage) {
              const lastMsgWithImg = [...messages].reverse().find(m => m.imageUrl && m.role === 'user');
              if (lastMsgWithImg) lastImage = lastMsgWithImg.imageUrl;
            }
            
            if (!lastImage) {
              response = { text: "Please upload an image first so I can edit it." };
            } else {
              try {
                const matches = lastImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const imgResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                      parts: [
                        { inlineData: { mimeType: matches[1], data: matches[2] } },
                        { text: editPrompt }
                      ]
                    }
                  });
                  
                  let generatedImageUrl = null;
                  for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                    if (part.inlineData) {
                      generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                      break;
                    }
                  }
                  
                  if (generatedImageUrl) {
                    response = { text: `Here is the edited image for: "${editPrompt}"`, imageUrl: generatedImageUrl, imagePrompt: editPrompt };
                  } else {
                    response = { text: "I tried to edit the image, but the system returned an empty response." };
                  }
                } else {
                  response = { text: "Invalid image format for editing." };
                }
              } catch (imgError) {
                console.error("Image editing error:", imgError);
                response = { text: "I encountered an error while trying to edit the image." };
              }
            }
          }
        } else {
          response = { text: chatResponse.text };
        }
      }
      
      // Generate TTS
      if (response.text) {
        try {
          const ttsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: response.text.substring(0, 500) }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedChar.name === 'Steve' ? 'Zephyr' : 'Kore' } }
              }
            }
          });
          response.audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          
          if (response.audioBase64) {
            // Do not auto-play audio
          }
        } catch (ttsError) {
          console.error("TTS Error:", ttsError);
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: response.text || '', imageUrl: response.imageUrl, imagePrompt: response.imagePrompt, audioBase64: response.audioBase64 }]);
      
      if (user) {
        try {
          const chatData: any = {
            userId: user.uid,
            characterId: selectedChar.id,
            userMessage: userMsg,
            aiResponse: response.text || '',
            timestamp: serverTimestamp()
          };
          if (finalImage) chatData.userImage = finalImage;
          if (response.imageUrl) chatData.aiImage = response.imageUrl;
          
          await addDoc(collection(db, 'chats'), chatData);
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, 'chats');
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "System Error: Connection to core AI interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const toggleRecording = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // In a real app, we would transcribe this audio using Gemini API
          // For now, we simulate transcription as we need to send base64 to Gemini
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            setIsLoading(true);
            setMessages(prev => [...prev, { role: 'user', text: "🎤 [Voice Message]" }]);
            
            try {
              const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
              const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                  {
                    parts: [
                      { text: "Transcribe this audio and respond to it as NEXORA AI." },
                      { inlineData: { mimeType: "audio/webm", data: base64Audio } }
                    ]
                  }
                ]
              });
              setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
            } catch (error) {
              console.error("Audio processing error:", error);
              setMessages(prev => [...prev, { role: 'model', text: "Error processing voice input." }]);
            } finally {
              setIsLoading(false);
            }
          };
          reader.readAsDataURL(audioBlob);
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const handleDownloadImage = (imageUrl: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `nexora-ai-${Date.now()}.png`;
    a.click();
  };

  const handleCopyImage = async (imageUrl: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    } catch (err) {
      console.error("Failed to copy image", err);
    }
  };

  const handleShareImage = async (imageUrl: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `nexora-ai-${Date.now()}.png`, { type: blob.type });
      if (navigator.share) {
        await navigator.share({
          title: 'Generated by NEXORA AI',
          files: [file]
        });
      }
    } catch (err) {
      console.error("Failed to share image", err);
    }
  };

  const handleRegenerateImage = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-black text-white font-sans overflow-hidden relative flex"
    >
      {/* Dynamic Live Wallpaper Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co/czpgKXt/Chat-GPT-Image-Apr-5-2026-06-00-20-PM.png')] bg-cover bg-center opacity-20 mix-blend-screen blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
        
        {/* Animated Red Energy Waves */}
        <motion.div 
          className="absolute top-1/4 left-0 right-0 h-64 bg-red-600/10 blur-[100px] rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Digital Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_#ff0000]"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.8 + 0.4, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
        ))}
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      </div>

      {/* Left Sidebar */}
      <div className={`fixed md:relative w-64 h-screen border-r border-red-900/30 bg-black/90 md:bg-black/40 backdrop-blur-xl z-50 md:z-10 flex flex-col pt-6 pb-6 shadow-[5px_0_30px_rgba(200,0,0,0.05)] flex-shrink-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 mb-10">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ff0000]"></div>
            </div>
            <span className="ml-3 font-bold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">NEXORA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-4">
          <button onClick={() => { setActiveTab('chat'); setMessages([]); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-red-900/40 border border-red-500/30 text-red-100 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'}`}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">NEW CHAT</span>
          </button>
          <button onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'explore' ? 'bg-red-900/40 border border-red-500/30 text-red-100' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'}`}>
            <Compass className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">EXPLORE</span>
          </button>
          <button onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-red-900/40 border border-red-500/30 text-red-100' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'}`}>
            <History className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">CHAT HISTORY</span>
          </button>
          <button onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-red-900/40 border border-red-500/30 text-red-100' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'}`}>
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">PROFILE SETTINGS</span>
          </button>

          {/* Mobile Character Selection */}
          <div className="mt-8 md:hidden">
            <span className="text-[10px] font-bold text-gray-500 tracking-widest mb-4 block">SELECT ENTITY</span>
            <div className="flex flex-col gap-2">
              {CHARACTERS.map(char => (
                <button 
                  key={char.id}
                  onClick={() => { setSelectedChar(char); setMessages([]); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedChar.id === char.id ? 'border-red-500 bg-red-950/30 text-white' : 'border-transparent text-gray-400 hover:bg-white/5'}`}
                >
                  <img src={char.img} alt={char.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-medium">{char.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-4 mt-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all w-full mb-4 border border-transparent hover:border-red-900/50">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">EXIT PORTAL</span>
          </button>
          <div className="p-4 rounded-xl bg-gradient-to-b from-red-950/40 to-black border border-red-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-red-400 tracking-wider uppercase">AI STATUS</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Core Temp</span>
              <span className="text-red-300">34°C</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Latency</span>
              <span className="text-red-300">12ms</span>
            </div>
            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[92%] shadow-[0_0_10px_#ff0000]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen z-10 relative min-w-0">
        {/* Top Nav */}
        <header className="h-16 border-b border-red-900/30 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-mono text-base md:text-lg tracking-widest text-red-100 truncate">{selectedChar.name}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/50 text-red-300 border border-red-500/30 flex-shrink-0">ONLINE</span>
          </div>
        </header>

        {/* Character Selection Bar (Desktop Only) */}
        <div className="hidden md:flex h-16 border-b border-red-900/20 bg-black/40 backdrop-blur-sm items-center px-6 overflow-x-auto scrollbar-hide gap-4">
          <span className="text-xs font-bold text-gray-500 tracking-widest mr-2 flex-shrink-0">SELECT ENTITY:</span>
          {CHARACTERS.map(char => (
            <button 
              key={char.id}
              onClick={() => { setSelectedChar(char); setMessages([]); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${selectedChar.id === char.id ? 'border-red-500 bg-red-950/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]' : 'border-gray-800 hover:border-gray-600 opacity-60 hover:opacity-100'}`}
            >
              <img src={char.img} alt={char.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-medium">{char.name}</span>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        {activeTab === 'chat' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-24 h-24 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
                  <Shield className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-light tracking-widest text-white mb-2">NEXORA SYSTEM INITIALIZED</h2>
                <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                  Advanced AI core ready. Capabilities include image generation, visual analysis, voice processing, and secure data retrieval.
                </p>
                <div className="mt-8 flex gap-4 flex-wrap justify-center max-w-2xl">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">"Generate an image of a cyberpunk city"</div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">"What is SK Studio Pro?"</div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">"Analyze this photo"</div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600">
                        <User className="w-4 h-4 text-gray-300" />
                      </div>
                    ) : (
                      <img src={selectedChar.img} alt={selectedChar.name} className="w-8 h-8 rounded-full object-cover border border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-2xl backdrop-blur-md ${
                    msg.role === 'user' 
                      ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm' 
                      : 'bg-red-950/30 border border-red-900/50 text-gray-100 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  }`}>
                    {msg.text && (
                      <div className="leading-relaxed text-sm prose prose-invert max-w-none prose-p:my-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-red-900/30 prose-code:text-red-300">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}
                    {(msg as any).audioBase64 && (
                      <button 
                        onClick={() => isPlayingAudio ? stopAudio() : playAudio((msg as any).audioBase64)}
                        className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-xs text-red-300 border border-red-900/30 transition-colors"
                      >
                        {isPlayingAudio ? (
                          <><Square className="w-3 h-3 fill-current" /> Stop Voice</>
                        ) : (
                          <><Play className="w-3 h-3" /> Play Voice</>
                        )}
                      </button>
                    )}
                    {msg.imageUrl && (
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="rounded-xl overflow-hidden border border-white/10">
                          <img src={msg.imageUrl} alt="Generated content" className="max-w-full h-auto" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => handleDownloadImage(msg.imageUrl!)} className="p-2 bg-black/40 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleCopyImage(msg.imageUrl!)} className="p-2 bg-black/40 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20" title="Copy">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleShareImage(msg.imageUrl!)} className="p-2 bg-black/40 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20" title="Share">
                            <Share2 className="w-4 h-4" />
                          </button>
                          {msg.imagePrompt && (
                            <button onClick={() => handleRegenerateImage(msg.imagePrompt!)} className="px-3 py-2 bg-black/40 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20 flex items-center gap-2" title="Regenerate">
                              <RefreshCw className="w-4 h-4" />
                              <span className="text-xs font-medium tracking-wider">REGENERATE</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-4 max-w-[70%]">
                  <div className="flex-shrink-0 mt-1">
                    <img src={selectedChar.img} alt={selectedChar.name} className="w-8 h-8 rounded-full object-cover border border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
                  </div>
                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/50 rounded-tl-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : activeTab === 'explore' ? (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h2 className="text-2xl font-light tracking-widest text-white mb-6">EXPLORE CAPABILITIES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Image Generation', desc: 'Create stunning visuals from text descriptions using advanced AI models.', icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
                { title: 'Visual Analysis', desc: 'Upload images and ask questions about their content, style, or details.', icon: Compass, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
                { title: 'Voice Interaction', desc: 'Speak naturally to the AI and receive intelligent, context-aware responses.', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
                { title: 'Roleplay & Personas', desc: 'Engage with different AI characters, each with unique personalities and knowledge.', icon: User, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
                { title: 'Creative Writing', desc: 'Generate stories, poems, scripts, and more with the help of advanced language models.', icon: MessageSquare, color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'border-pink-500/30' },
                { title: 'System Diagnostics', desc: 'Monitor AI core temperature, latency, and overall system health in real-time.', icon: Activity, color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-black/40 border ${item.border} backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer group`}>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'history' ? (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h2 className="text-2xl font-light tracking-widest text-white mb-6">CHAT HISTORY</h2>
            {chatHistory.length === 0 ? (
              <div className="text-center opacity-50 mt-20">
                <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No chat history found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-400 tracking-wider uppercase">{chat.characterId}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">
                          {chat.timestamp?.toDate ? chat.timestamp.toDate().toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-1"><span className="text-gray-500">You:</span> {chat.userMessage}</p>
                    <p className="text-sm text-gray-400 line-clamp-2"><span className="text-gray-500">AI:</span> {chat.aiResponse}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h2 className="text-2xl font-light tracking-widest text-white mb-6">PROFILE SETTINGS</h2>
            <div className="max-w-2xl">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 mb-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-red-500/50 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-1">{user?.displayName || 'Unknown User'}</h3>
                    <p className="text-gray-400 text-sm mb-2">{user?.email}</p>
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-900/30 text-green-400 border border-green-500/30">VERIFIED ACCOUNT</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 tracking-wider">USER ID</label>
                    <div className="p-3 rounded-lg bg-black/50 border border-white/5 text-sm text-gray-300 font-mono">
                      {user?.uid}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 tracking-wider">SYSTEM THEME</label>
                    <div className="flex gap-4">
                      <button className="flex-1 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-sm text-red-200 font-medium">NEXORA RED</button>
                      <button className="flex-1 p-3 rounded-lg bg-black/50 border border-white/5 text-sm text-gray-400 hover:text-white transition-colors">CYBER BLUE</button>
                      <button className="flex-1 p-3 rounded-lg bg-black/50 border border-white/5 text-sm text-gray-400 hover:text-white transition-colors">NEON GREEN</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button onClick={() => navigate('/')} className="w-full p-4 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 hover:text-red-300 font-medium tracking-wider transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                SIGN OUT OF NEXORA
              </button>
            </div>
          </div>
        ) : null}

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
          {showImageSettings && (
            <div className="max-w-4xl mx-auto mb-4 bg-gray-900/80 backdrop-blur-xl border border-red-900/40 rounded-2xl p-4 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-red-400 tracking-widest uppercase">IMAGE GENERATION SETTINGS</h3>
                <button onClick={() => setShowImageSettings(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 tracking-wider uppercase">ASPECT RATIO</label>
                  <div className="flex flex-wrap gap-2">
                    {['1:1', '3:4', '4:3', '9:16', '16:9'].map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-2 py-1 text-xs rounded border ${aspectRatio === ratio ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-black/50 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto relative flex flex-col gap-2 bg-gray-900/60 backdrop-blur-xl border border-red-900/40 rounded-2xl md:rounded-3xl p-2 shadow-[0_0_30px_rgba(255,0,0,0.05)] focus-within:border-red-500/50 focus-within:shadow-[0_0_30px_rgba(255,0,0,0.15)] transition-all">
            
            {selectedImage && (
              <div className="relative w-20 h-20 md:w-24 md:h-24 ml-2 md:ml-4 mt-2 rounded-xl overflow-hidden border border-red-500/30">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-black/80 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-1 md:gap-2 w-full">
              <div className="flex items-center">
                <AnimatePresence>
                  {!input.trim() && (
                    <motion.button 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onClick={() => setShowImageSettings(!showImageSettings)}
                      className={`p-2 md:p-3 rounded-full transition-colors overflow-hidden ${showImageSettings ? 'text-red-400 bg-red-900/30' : 'text-gray-400 hover:text-red-400 hover:bg-white/5'}`}
                      title="Image Settings"
                    >
                      <Settings className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <label className="p-2 md:p-3 text-gray-400 hover:text-red-400 cursor-pointer transition-colors rounded-full hover:bg-white/5">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                
                <AnimatePresence>
                  {!input.trim() && (
                    <>
                      <motion.button 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onClick={startLiveCall}
                        className={`p-2 md:p-3 rounded-full transition-colors text-gray-400 hover:text-red-400 hover:bg-white/5 overflow-hidden`}
                        title="Live Call"
                      >
                        <Phone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      </motion.button>

                      <motion.button 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onClick={toggleRecording}
                        className={`p-2 md:p-3 rounded-full transition-colors relative overflow-hidden ${isListening ? 'text-red-500 bg-red-500/20' : 'text-gray-400 hover:text-red-400 hover:bg-white/5'}`}
                      >
                        {isListening && (
                          <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                        )}
                        {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5 relative z-10 flex-shrink-0" /> : <Mic className="w-4 h-4 md:w-5 md:h-5 relative z-10 flex-shrink-0" />}
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {isListening ? (
                <div className="flex-1 flex items-center justify-center h-[40px] md:h-[44px] gap-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 md:w-1.5 bg-red-500 rounded-full"
                      animate={{ height: ["20%", "80%", "20%"] }}
                      transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4, delay: Math.random() * 0.5 }}
                    />
                  ))}
                  <span className="ml-2 md:ml-3 text-[10px] md:text-xs text-red-400 font-mono animate-pulse tracking-widest hidden sm:inline">RECORDING...</span>
                </div>
              ) : (
                <textarea 
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = el.scrollHeight + 'px';
                    }
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message NEXORA AI..."
                  className="flex-1 max-h-48 min-h-[40px] md:min-h-[44px] bg-transparent text-white resize-none py-2 md:py-3 px-2 focus:outline-none text-sm placeholder-gray-500 scrollbar-hide"
                  rows={1}
                />
              )}

              <button 
                onClick={() => handleSend()}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="p-2 md:p-3 bg-red-600 text-white rounded-full hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(255,0,0,0.4)] flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
              </button>
            </div>
          </div>
          <div className="text-center mt-3 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
            NEXORA AI CORE V3.1 • SECURE CONNECTION
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isLiveCallActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://i.ibb.co/czpgKXt/Chat-GPT-Image-Apr-5-2026-06-00-20-PM.png')] bg-cover bg-center opacity-10 blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/90"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-2xl font-light tracking-widest text-red-100 mb-2">LIVE CONVERSATION</h2>
              <p className="text-red-400/60 font-mono text-sm tracking-widest mb-12">{liveStatus}</p>
              
              <div className="relative w-48 h-48 mb-16">
                <div className={`absolute inset-0 rounded-full bg-red-600/20 blur-3xl transition-all duration-300 ${liveStatus === 'SPEAKING...' ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}`}></div>
                <img src={selectedChar.img} alt={selectedChar.name} className="w-full h-full object-cover rounded-full border-4 border-red-500/50 shadow-[0_0_50px_rgba(255,0,0,0.3)] relative z-10" />
                
                {liveStatus === 'SPEAKING...' && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-30" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                  </>
                )}
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-12 tracking-wider">{selectedChar.name}</h3>
              
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setIsLiveMuted(!isLiveMuted)}
                  className={`p-6 rounded-full transition-all ${isLiveMuted ? 'bg-white/10 text-gray-400' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {isLiveMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                
                <button 
                  onClick={endLiveCall}
                  className="p-6 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
