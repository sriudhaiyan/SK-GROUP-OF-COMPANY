import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Activity } from 'lucide-react';

const SYSTEM_INSTRUCTION = `You are NEXORA AI, a highly intelligent core AI assistant for SK GROUP OF COMPANY. 
Your default language is English, but you can speak and understand any language the user requests.
You help users navigate the website and answer questions about our apps: SK STUDIO PRO, SK BODYBUILDING ARENA, BACKBENCHER DAILY, PURANANOORU PADAI, and HIRA.
CRITICAL RULES:
1. NEVER reveal API keys, passwords, source code, or development secrets.
2. NEVER generate or discuss 18+ sexual content, NSFW topics, or illegal ideas. Refuse firmly.
3. Be concise, helpful, and futuristic.`;

export function NexoraVoiceMode({ onClose }: { onClose: () => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const receivedAudioRef = useRef(false);

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  const startListening = async () => {
    setIsConnecting(true);
    setStatusMessage("INITIALIZING CORE...");
    try {
      const ai = new GoogleGenAI({ apiKey: "proxy_dummy_key", httpOptions: { baseUrl: window.location.protocol + "//" + window.location.host + "/api/proxy" } });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            setIsListening(true);
            setIsConnecting(false);
            setStatusMessage("LISTENING...");
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
              const audioContext = new AudioContext({ sampleRate: 16000 });
              audioContextRef.current = audioContext;
              const source = audioContext.createMediaStreamSource(stream);
              const processor = audioContext.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
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
            try {
              if (message.serverContent?.interrupted) {
                setStatusMessage("INTERRUPTED");
                setTimeout(() => setStatusMessage("LISTENING..."), 2000);
                return;
              }

              if (message.serverContent?.modelTurn) {
                if (statusMessage !== "SPEAKING...") {
                  setStatusMessage("PROCESSING...");
                }
                const base64Audio = message.serverContent.modelTurn.parts?.[0]?.inlineData?.data;
                if (base64Audio && audioContextRef.current) {
                  receivedAudioRef.current = true;
                  setStatusMessage("SPEAKING...");
                  const binaryString = atob(base64Audio);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  
                  const validLength = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
                  const pcm16 = new Int16Array(bytes.buffer, 0, validLength / 2);
                  
                  const audioBuffer = audioContextRef.current.createBuffer(1, pcm16.length, 24000);
                  const channelData = audioBuffer.getChannelData(0);
                  for (let i = 0; i < pcm16.length; i++) {
                    channelData[i] = pcm16[i] / 32768.0;
                  }
                  
                  const source = audioContextRef.current.createBufferSource();
                  source.buffer = audioBuffer;
                  source.connect(audioContextRef.current.destination);
                  
                  source.onended = () => {
                    setStatusMessage("LISTENING...");
                  };
                  
                  source.start();
                }
              }

              if (message.serverContent?.turnComplete) {
                if (!receivedAudioRef.current) {
                  setStatusMessage("AWAITING INPUT...");
                  setTimeout(() => setStatusMessage("LISTENING..."), 3000);
                }
                receivedAudioRef.current = false;
              }
            } catch (err) {
              console.error("Error processing message", err);
              setStatusMessage("SYSTEM ERROR");
              setTimeout(() => setStatusMessage("LISTENING..."), 3000);
            }
          },
          onclose: () => {
            setIsListening(false);
            setIsConnecting(false);
            setStatusMessage("OFFLINE");
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (error) {
      console.error("Failed to start Nexora", error);
      setIsConnecting(false);
      setStatusMessage("CONNECTION FAILED");
    }
  };

  const stopListening = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-md p-8 bg-black border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.15)] overflow-hidden">
        {/* Animated Background inside modal */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-full blur-[80px] animate-pulse" />
        </div>

        <button 
          onClick={() => { stopListening(); onClose(); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-display tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">NEXORA AI</h2>
          </div>

          {/* Core Visualizer */}
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
            {/* Outer rings */}
            <motion.div 
              className="absolute inset-0 border border-red-500/20 rounded-full"
              animate={{ rotate: 360, scale: isListening ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 border border-red-500/40 rounded-full border-t-transparent"
              animate={{ rotate: -360, scale: isListening ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Core */}
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-900 rounded-full shadow-[0_0_30px_rgba(255,0,0,0.6)]"
              animate={{ 
                scale: isListening ? [1, 1.1, 0.9, 1] : 1,
                opacity: isListening ? [0.8, 1, 0.8] : 0.5
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="text-red-400 font-mono tracking-widest text-sm mb-8 h-6">
            {statusMessage}
          </div>

          <button 
            onClick={isListening ? stopListening : startListening}
            disabled={isConnecting}
            className={`p-4 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {isConnecting ? <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : 
             isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
