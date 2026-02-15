'use client'

export default function BackgroundMedia() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
            {/* Fallback Animated Starfield (Simple CSS) */}
            <div className="absolute inset-0 opacity-40">
                <div className="stars-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                width: `${Math.random() * 2}px`,
                                height: `${Math.random() * 2}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
        .stars-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: twinkle 3s infinite ease-in-out;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
        </div>
    )
}
