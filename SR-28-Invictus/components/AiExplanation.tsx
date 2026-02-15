'use client';

import { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';

interface AiExplanationProps {
  title: string;
  description: string;
}

export default function AiExplanation({ title, description }: AiExplanationProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error('Failed to fetch explanation');

      const data = await response.json();
      if (!data.explanation || !data.explanation.trim()) {
        throw new Error('No explanation returned');
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      console.error('AI Error:', err);
      setError("The AI couldn't generate an explanation right now.");
      setExplanation(
        "Try reading the NASA description above for details.|You can refresh to attempt again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (description) fetchExplanation();
  }, [description, title]);

  return (
    <section className="max-w-4xl mx-auto px-4 pb-20">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Astro Intelligence{' '}
              <span className="text-xs font-normal text-white/40 border border-white/10 px-2 py-0.5 rounded-full uppercase">
                Beta
              </span>
            </h3>
            {error && (
              <button
                onClick={fetchExplanation}
                className="ml-auto flex items-center gap-1 text-sm text-primary/70 hover:text-primary transition"
                title="Retry AI explanation"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-5 w-5 bg-white/10 rounded-full flex-shrink-0" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="space-y-4">
                {explanation.split('|').map((point, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_8px_rgba(138,43,226,0.8)]" />
                    <p className="text-xl text-white/90 leading-relaxed font-medium">{point}</p>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-primary/60 text-sm mt-8 pt-6 border-t border-white/5">
                <Sparkles className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
