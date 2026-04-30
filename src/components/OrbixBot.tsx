import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Bot, X } from 'lucide-react';
import { APPS_DATA } from '../data/content';

export function OrbixBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSigmaMood, setIsSigmaMood] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const receivedAudioRef = useRef(false);
  const nextAudioTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    const handleOpen = () => {
      setIsVisible(true);
      if (!isListening && !isConnecting) {
        startListening();
      }
    };
    window.addEventListener('open-orbix', handleOpen);
    return () => window.removeEventListener('open-orbix', handleOpen);
  }, [isListening, isConnecting]);

  const startListening = async () => {
    setIsConnecting(true);
    setStatusMessage("INITIALIZING...");
    nextAudioTimeRef.current = 0;
    activeSourcesRef.current = [];
    try {
      const ai = new GoogleGenAI({ apiKey: "proxy_dummy_key", httpOptions: { baseUrl: window.location.protocol + "//" + window.location.host + "/api/proxy" } });
      
      const appsContext = APPS_DATA.map(app => `
App: ${app.title}
Description: ${app.description}
${app.character ? `Character: ${app.character.name} (${app.character.role})
Character Description: ${app.character.description}
Abilities: ${app.character.abilities?.join(', ')}
Utilities: ${app.character.utilities?.join(', ')}` : ''}
`).join('\n');

      const systemInstruction = `You are SK Orbix, a highly intelligent speech recognition bot and assistant for SK GROUP OF COMPANY. You help users navigate the website and answer questions about our apps and characters.
CRITICAL: You are fully bilingual in English and Tamil. If the user speaks to you in Tamil, or asks you to speak or reply in Tamil, you MUST respond fluently in Tamil.
CRITICAL: If the user asks you to sing, generate a song, or make music, you MUST call the generateSong function. DO NOT sing using your own voice. DO NOT output lyrics. JUST CALL THE TOOL.
CRITICAL: If the user asks you to act like a sigma, be a sigma, or go into sigma mood, you MUST call the setMood tool with 'sigma' and reply as a sigma male (confident, dominant, lone wolf, using sigma slang). To return to normal, they might ask you to be normal, then call setMood with 'normal'.
Here is the information about the apps and characters you know:
${appsContext}
Be concise, helpful, and slightly robotic but friendly, unless in sigma mood.`;

      const generateSongTool = {
        name: "generateSong",
        description: "Generate a short music clip or song based on a prompt.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "The detailed prompt describing the music to generate (e.g., 'A 30-second cinematic orchestral track' or 'An upbeat pop song about SK Orbix')."
            }
          },
          required: ["prompt"]
        }
      };

      const setMoodTool = {
        name: "setMood",
        description: "Change SK Orbix's visual mood and UI state based on user's request (e.g., 'sigma', 'normal').",
        parameters: {
          type: Type.OBJECT,
          properties: {
            mood: {
              type: Type.STRING,
              description: "The mood to set (e.g., 'sigma', 'normal')"
            }
          },
          required: ["mood"]
        }
      };

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [generateSongTool, setMoodTool] }]
        },
        callbacks: {
          onopen: () => {
            setIsListening(true);
            setIsConnecting(false);
            setStatusMessage("LISTENING...");
            // Setup microphone
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
                activeSourcesRef.current.forEach(source => {
                  try { source.stop(); } catch (e) {}
                });
                activeSourcesRef.current = [];
                if (audioContextRef.current) {
                  nextAudioTimeRef.current = audioContextRef.current.currentTime;
                }
                setTimeout(() => setStatusMessage("LISTENING..."), 2000);
                return;
              }

              if (message.serverContent?.modelTurn) {
                if (statusMessage !== "SPEAKING...") {
                  setStatusMessage("THINKING...");
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

                if (base64Audio && audioContextRef.current) {
                  receivedAudioRef.current = true;
                  setStatusMessage("SPEAKING...");
                  
                  if (audioContextRef.current.state === 'suspended') {
                    await audioContextRef.current.resume();
                  }

                  const binaryString = atob(base64Audio);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  
                  // Live API returns raw 16-bit PCM at 24kHz
                  // Ensure buffer length is even to avoid RangeError
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
                  
                  const currentTime = audioContextRef.current.currentTime;
                  if (nextAudioTimeRef.current < currentTime) {
                    nextAudioTimeRef.current = currentTime;
                  }
                  
                  source.onended = () => {
                    activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
                    if (activeSourcesRef.current.length === 0) {
                      setStatusMessage("LISTENING...");
                    }
                  };
                  
                  activeSourcesRef.current.push(source);
                  source.start(nextAudioTimeRef.current);
                  nextAudioTimeRef.current += audioBuffer.duration;
                }
              }

              if (message.toolCall) {
                for (const call of message.toolCall.functionCalls) {
                  if (call.name === 'setMood') {
                    const dict = (call.args as any);
                    const mood = dict && dict.mood ? String(dict.mood).toLowerCase() : '';
                    if (mood.includes('sigma')) setIsSigmaMood(true);
                    else setIsSigmaMood(false);
                    sessionPromise.then(session => session.sendToolResponse({
                      functionResponses: [{
                        id: call.id,
                        name: call.name,
                        response: { result: "Mood set successfully to " + mood }
                      }]
                    }));
                  }
                  else if (call.name === 'generateSong') {
                    setStatusMessage("GENERATING SONG...");
                    const prompt = (call.args as any).prompt;
                    
                    try {
                      const lyriaResponse = await ai.models.generateContentStream({
                        model: "lyria-3-clip-preview",
                        contents: prompt,
                      });

                      let audioBase64 = "";
                      let mimeType = "audio/wav";

                      for await (const chunk of lyriaResponse) {
                        const parts = chunk.candidates?.[0]?.content?.parts;
                        if (!parts) continue;
                        for (const part of parts) {
                          if (part.inlineData?.data) {
                            if (!audioBase64 && part.inlineData.mimeType) {
                              mimeType = part.inlineData.mimeType;
                            }
                            audioBase64 += part.inlineData.data;
                          }
                        }
                      }

                      if (audioBase64) {
                        const binary = atob(audioBase64);
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) {
                          bytes[i] = binary.charCodeAt(i);
                        }
                        
                        setStatusMessage("PLAYING SONG...");
                        if (audioContextRef.current) {
                          try {
                            const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
                            const source = audioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContextRef.current.destination);
                            source.start(0);
                            source.onended = () => setStatusMessage("LISTENING...");
                          } catch (e) {
                            const blob = new Blob([bytes], { type: mimeType });
                            const audioUrl = URL.createObjectURL(blob);
                            const audio = new Audio(audioUrl);
                            audio.play();
                            audio.onended = () => setStatusMessage("LISTENING...");
                          }
                        } else {
                          const blob = new Blob([bytes], { type: mimeType });
                          const audioUrl = URL.createObjectURL(blob);
                          const audio = new Audio(audioUrl);
                          audio.play();
                          audio.onended = () => setStatusMessage("LISTENING...");
                        }
                      }

                      sessionPromise.then(session => session.sendToolResponse({
                        functionResponses: [{
                          id: call.id,
                          name: call.name,
                          response: { result: "Song generated and playing successfully." }
                        }]
                      }));
                    } catch (err) {
                      console.error("Lyria generation error", err);
                      sessionPromise.then(session => session.sendToolResponse({
                        functionResponses: [{
                          id: call.id,
                          name: call.name,
                          response: { error: "Failed to generate song." }
                        }]
                      }));
                    }
                  }
                }
              }

              if (message.serverContent?.turnComplete) {
                if (!receivedAudioRef.current) {
                  setStatusMessage("I COULDN'T GET THAT");
                  setTimeout(() => setStatusMessage("LISTENING..."), 3000);
                }
                receivedAudioRef.current = false;
              }
            } catch (err) {
              console.error("Error processing message", err);
              setStatusMessage("ERROR PROCESSING RESPONSE");
              setTimeout(() => setStatusMessage("LISTENING..."), 3000);
            }
          },
          onclose: () => {
            setIsListening(false);
            setIsConnecting(false);
            setStatusMessage("STANDBY MODE");
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (error) {
      console.error("Failed to start Orbix", error);
      setIsConnecting(false);
      setStatusMessage("CONNECTION FAILED");
      setTimeout(() => setStatusMessage("STANDBY MODE"), 3000);
    }
  };

  const stopListening = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
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

  const handleClose = () => {
    stopListening();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Close Button positioned above the chat bot button (which is at bottom-6 left-6) */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClose}
            className="fixed bottom-24 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-105 border border-red-400/30"
          >
            <X className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider">CLOSE ORBIX</span>
          </motion.button>

          {/* Orbix Bot UI */}
          <motion.div 
            className="fixed bottom-6 right-6 z-50 w-64 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,100,255,0.2)]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsSigmaMood(prev => !prev)}
                title="Toggle Sigma Mood manually"
              >
                <Bot className={`w-6 h-6 transition-colors ${isSigmaMood ? 'text-purple-500' : 'text-blue-400'} group-hover:text-purple-400`} />
                <span className={`${isSigmaMood ? 'text-purple-200' : 'text-blue-100'} font-mono text-sm font-bold tracking-wider`}>SK ORBIX</span>
              </div>
              <button 
                onClick={isListening ? stopListening : startListening}
                disabled={isConnecting}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}
              >
                {isConnecting ? <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> : 
                 isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="h-32 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden relative">
              {/* Emo Robot Face */}
              <div className="flex gap-6 relative">
                <motion.div 
                  className="w-8 h-12 bg-blue-400 rounded-full"
                  animate={{ 
                    scaleY: isListening ? [1, 0.2, 1] : 1,
                    height: isListening ? ["3rem", "0.5rem", "3rem"] : "3rem"
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-8 h-12 bg-blue-400 rounded-full"
                  animate={{ 
                    scaleY: isListening ? [1, 0.2, 1] : 1,
                    height: isListening ? ["3rem", "0.5rem", "3rem"] : "3rem"
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                />
                
                <AnimatePresence>
                  {isSigmaMood && (
                    <>
                      {/* Robotic hands placing the glasses */}
                      <motion.div
                        initial={{ top: -50, left: -60, rotate: -45, opacity: 0 }}
                        animate={{ top: [-50, 10, -50], left: [-60, -10, -60], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                        className="absolute w-6 h-10 bg-gray-400 rounded-full border-2 border-gray-600 z-20 pointer-events-none"
                      />
                      <motion.div
                        initial={{ top: -50, right: -60, rotate: 45, opacity: 0 }}
                        animate={{ top: [-50, 10, -50], right: [-60, -10, -60], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                        className="absolute w-6 h-10 bg-gray-400 rounded-full border-2 border-gray-600 z-20 pointer-events-none"
                      />
                      {/* Thug Life Glasses */}
                      <motion.div
                        initial={{ y: '-200%', x: '-50%', opacity: 0 }}
                        animate={{ y: '-50%', x: '-50%', opacity: 1 }}
                        exit={{ y: '-200%', x: '-50%', opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="absolute top-1/2 left-1/2 w-[180px] z-10 pointer-events-none"
                      >
                        <img 
                          src="https://i.ibb.co/RrWX4YM/image-removebg-preview.png" 
                          alt="Thug Life" 
                          className="w-full"
                          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Audio Waveform visualizer when listening */}
              {isListening && (
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-1 opacity-50">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-blue-500 rounded-t-full"
                      animate={{ height: ["10%", "100%", "10%"] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: Math.random() * 0.5 }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3 text-xs text-center text-gray-400 font-mono">
              {statusMessage || (isConnecting ? "INITIALIZING..." : isListening ? "LISTENING..." : "STANDBY MODE")}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
