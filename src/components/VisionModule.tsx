import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { ai, MODELS } from '../lib/gemini';
import { cn } from '../lib/utils';

export const VisionModule = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);

    try {
      const base64Data = selectedImage.split(',')[1];
      const response = await ai.models.generateContent({
        model: MODELS.VISION,
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: "image/png" } },
            { text: "Analyze this image in detail. Identify objects, context, and potential semantic meaning. Provide a structured summary." }
          ]
        }
      });

      setAnalysis(response.text || "Analysis complete but no text returned.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error: Vision processing failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Camera className="w-5 h-5 text-brand-accent" />
        <h2 className="font-semibold tracking-tight">Computer Vision</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 cyber-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={cn(
              "aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group transition-all",
              selectedImage ? "border-brand-primary/50" : "hover:border-white/20"
            )}>
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-colors">
                      Change Image
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3 text-slate-400 hover:text-brand-primary transition-colors">
                  <Upload size={32} />
                  <span className="text-sm font-medium">Upload Image for Analysis</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>

            <button
              onClick={analyzeImage}
              disabled={!selectedImage || isAnalyzing}
              className="w-full bg-brand-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing Neural Nets...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Run Semantic Analysis
                </>
              )}
            </button>
          </div>

          <div className="glass-panel p-5 bg-black/40 min-h-[200px]">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              <ImageIcon size={14} />
              Analysis Output
            </div>
            {analysis ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap"
              >
                {analysis}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                Waiting for input...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
