import express from 'express';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { APPS_DATA } from '../src/data/content';

export default async function nexoraHandler(req: express.Request, res: express.Response) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const { action, payload } = req.body;
  const genAI = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'chat': {
        const { message, history, character, image } = payload;
        
        const appsContext = APPS_DATA.map(app => `
App: ${app.title}
Description: ${app.description}
Character: ${app.character?.name} (${app.character?.role})
Character Details: ${app.character?.description}
Abilities: ${app.character?.abilities?.join(', ')}
`).join('\n');

        const systemInstruction = `You are ${character.name}, a ${character.role}. You must answer questions correctly and tell users about this website (SK Group of Company apps like SK STUDIO PRO, SK BODYBUILDING ARENA, etc.). 
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

        if (image) {
          // Multimodal content generation (handles images and audio)
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            throw new Error('Invalid media format');
          }

          const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{
              role: 'user',
              parts: [
                { text: message || "Analyze this media." },
                { inlineData: { mimeType: matches[1], data: matches[2] } }
              ]
            }],
            config: {
              systemInstruction: systemInstruction,
            }
          });

          return res.json({ text: result.text });
        } else {
          // Standard Chat
          const chat = genAI.chats.create({
            model: "gemini-3-flash-preview",
            config: {
              systemInstruction: systemInstruction,
              tools: [{ functionDeclarations: [generateImageTool, editImageTool] }, { googleSearch: {} }],
              toolConfig: { includeServerSideToolInvocations: true }
            },
            history: history || []
          });

          const result = await chat.sendMessage(message);
          
          if (result.functionCalls && result.functionCalls.length > 0) {
            return res.json({ functionCall: result.functionCalls[0], text: result.text });
          }

          return res.json({ text: result.text });
        }
      }

      case 'generateImage': {
        const { prompt, aspectRatio } = payload;
        
        const result = await genAI.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: { aspectRatio: aspectRatio || "1:1" }
          }
        });

        const parts = result.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            return res.json({ 
              imageUrl: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
              prompt
            });
          }
        }
        throw new Error('No image was generated');
      }

      case 'tts': {
        const { text, voice } = payload;
        
        const result = await genAI.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: text.substring(0, 800) }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Kore' } }
            }
          }
        });

        const audioBase64 = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return res.json({ audioBase64 });
      }

      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Nexora AI Error:', error);
    res.status(500).json({ error: error.message || 'AI processing failed' });
  }
}
