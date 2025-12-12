import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || ''; 

// We initialize this lazily to allow for potential key injection if it wasn't there at start,
// though per instructions we assume process.env.API_KEY is valid.
let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

// Helper for Audio Decoding
const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // The API returns raw PCM or encoded audio. 
  // For 'gemini-2.5-flash-preview-tts', it usually returns a format that requires standard decoding.
  // However, pure PCM decoding manual implementation is complex. 
  // We will try standard decodeAudioData first which works for many formats wrapped in containers,
  // If the API returns raw PCM without headers, we might need the manual approach shown in docs.
  // For the TTS model specifically, the docs example uses a manual decoder for raw PCM 24kHz.
  
  return manualDecodePCM(bytes, audioContext);
};

// Manual PCM decoder for Gemini TTS (24kHz, mono)
async function manualDecodePCM(
    data: Uint8Array,
    ctx: AudioContext,
): Promise<AudioBuffer> {
    const sampleRate = 24000;
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert Int16 to Float32 [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


export const playTextToSpeech = async (text: string, speaker: string): Promise<void> => {
  if (!API_KEY) {
    console.warn("No API Key found for TTS. Using browser fallback.");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
    return;
  }

  try {
    const client = getAI();
    
    // Select voice based on character
    let voiceName = 'Puck'; // Default (Sister/Generic)
    if (speaker === 'Jeff') voiceName = 'Kore'; // Male-ish/Deeper
    if (speaker === 'Mom') voiceName = 'Fenrir'; // Different tone
    // Note: Available voices in preview: Puck, Charon, Kore, Fenrir, Zephyr.
    // Mapping purely for distinction.

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(base64Audio, audioContext);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    // Fallback to browser TTS if API fails
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};
