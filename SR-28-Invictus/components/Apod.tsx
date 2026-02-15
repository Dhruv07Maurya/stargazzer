'use client';

interface ApodData {
    title: string;
    url: string;
    hdurl?: string;
    explanation: string;
    date: string;
    media_type: string;
}

interface ApodProps {
    data: ApodData;
}

export default function Apod({ data }: ApodProps) {
    return (
        <section className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-video md:aspect-auto h-full min-h-[400px]">
                        {data.media_type === 'image' ? (
                            <img
                                src={data.url}
                                alt={data.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <iframe
                                src={data.url}
                                title={data.title}
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-xs font-semibold text-primary-foreground border border-primary/30 uppercase tracking-widest mb-2 inline-block">
                                Astronomy Picture of the Day
                            </span>
                            <h2 className="text-3xl font-bold text-white mb-1">{data.title}</h2>
                            <p className="text-white/60 text-sm">{data.date}</p>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-white/80 leading-relaxed mb-6 italic">
                                "{data.explanation.substring(0, 500)}..."
                            </p>
                            <div className="flex gap-4 items-center">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-xs uppercase tracking-widest text-white/40">Raw Data from NASA</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
