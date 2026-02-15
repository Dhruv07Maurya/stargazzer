'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const planet = params.planet as string;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!planet) return;
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ planet })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate quiz');
                }

                const data = await response.json();
                setQuestions(data.questions);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [planet]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 animate-pulse" />
                    <div className="h-24 w-24 border-b-2 border-blue-500 rounded-full animate-spin mb-8" />
                </div>
                <h1 className="text-xl font-black uppercase tracking-[0.3em] animate-pulse text-center">
                    Generating {planet} Quiz...
                </h1>
                <p className="text-white/40 text-xs mt-4 uppercase tracking-widest">Consulting Star Charts</p>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
                <div className="text-red-500 mb-6 flex flex-col items-center">
                    <XCircle className="h-12 w-12 mb-4" />
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Transmission Failed</h1>
                </div>
                <p className="text-white/40 mb-8 text-center">{error || 'No questions received from deep space.'}</p>
                <Link
                    href="/solar-system"
                    className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all text-center"
                >
                    Back to Solar System
                </Link>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {planet} Quiz
                        </h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">AI-Generated Challenge</p>
                    </div>
                    <div className="w-20" />
                </div>

                {!showResult ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={isAnswered}
                                    className={`
                    w-full flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left
                    ${!isAnswered
                                            ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                                            : option === currentQuestion.correctAnswer
                                                ? 'border-green-500/50 bg-green-500/10'
                                                : option === selectedOption
                                                    ? 'border-red-500/50 bg-red-500/10'
                                                    : 'border-white/5 bg-white/2 opacity-50'
                                        }
                  `}
                                >
                                    <span className="text-lg font-medium">{option}</span>
                                    {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 className="text-green-500 h-6 w-6" />}
                                    {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <XCircle className="text-red-500 h-6 w-6" />}
                                </button>
                            ))}
                        </div>

                        {isAnswered && (
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex gap-4">
                                    <Info className="h-6 w-6 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Observation Details</h4>
                                        <p className="text-white/70 leading-relaxed text-sm">{currentQuestion.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isAnswered && (
                            <button
                                onClick={handleNext}
                                className="w-full py-4 mt-8 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                            >
                                {currentQuestionIndex < questions.length - 1 ? "Advance Course" : "Finalize Mission"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center space-y-8 animate-in zoom-in-95 fade-in duration-500">
                        <div className="py-12">
                            <div className="inline-block relative">
                                <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20" />
                                <h2 className="text-8xl md:text-9xl font-black tracking-tighter relative">
                                    {Math.round((score / questions.length) * 100)}<span className="text-3xl text-white/40">%</span>
                                </h2>
                            </div>
                            <p className="text-white/60 mt-4 uppercase tracking-[0.4em] text-xs font-bold">Mission Completion Rate</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                                {score === questions.length ? "Astronomy Master!" : score > questions.length / 2 ? "Well done, explorer!" : "Study the charts!"}
                            </h3>
                            <p className="text-white/40 max-w-xs mx-auto text-sm text-center">
                                You correctly categorized {score} out of {questions.length} cosmic anomalies for planet {planet}.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 pt-8 max-w-md mx-auto">
                            <Link href="/solar-system" className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all text-center">
                                Return to System
                            </Link>
                            <button
                                onClick={() => {
                                    setCurrentQuestionIndex(0);
                                    setScore(0);
                                    setShowResult(false);
                                    setIsAnswered(false);
                                    setSelectedOption(null);
                                }}
                                className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                            >
                                Download New Mission
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
                <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
