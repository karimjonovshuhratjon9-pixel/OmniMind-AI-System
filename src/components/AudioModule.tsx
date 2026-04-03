import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Play, Square, Loader2, Mic, Music } from 'lucide-react';
import { ai, MODELS } from '../lib/gemini';
import { Modality } from "@google/genai";

export const AudioModule = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voice, setVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Zephyr');

  const generateSpeech = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const response = await ai.models.generateContent({
        model: MODELS.AUDIO,
        contents: [{ parts: [{ text: `Say clearly and professionally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-brand-secondary" />
        <h2 className="font-semibold tracking-tight">Audio Synthesis</h2>
      </div>

      <div className="flex-1 p-6 space-y-8 cyber-grid">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to synthesize into speech..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-secondary/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  voice === v 
                    ? 'bg-brand-secondary border-brand-secondary text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={generateSpeech}
            disabled={!text.trim() || isGenerating}
            className="w-full bg-brand-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-secondary/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-secondary/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Synthesizing Waveforms...
              </>
            ) : (
              <>
                <Mic size={20} />
                Generate Voice Output
              </>
            )}
          </button>

          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 flex flex-col items-center gap-4 bg-brand-secondary/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center animate-pulse">
                  <Play className="text-white fill-current" size={20} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Synthesis Complete</div>
                  <div className="text-xs text-slate-400">Voice: {voice} | Format: WAV</div>
                </div>
              </div>
              <audio controls src={audioUrl} className="w-full h-10 opacity-80" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
