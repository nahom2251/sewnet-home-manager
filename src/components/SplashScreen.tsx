import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 splash-gradient flex flex-col items-center justify-center z-50">
      {/* Subtle building silhouette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 opacity-[0.04]">
        <div className="w-full h-full bg-foreground" style={{ clipPath: 'polygon(20% 100%, 20% 30%, 35% 30%, 35% 20%, 65% 20%, 65% 30%, 80% 30%, 80% 100%)' }} />
      </div>

      {/* Logo */}
      <div className="mb-6">
        <span className="text-7xl font-light italic text-splash-accent tracking-tight select-none" style={{ fontFamily: "'Noto Serif', serif" }}>
          AS
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3 text-center px-4">
        Alehegne Sewnet Apartment
      </h1>

      {/* Tagline */}
      <p className="text-xs tracking-[0.3em] uppercase text-splash-accent font-medium mb-4">
        Sophistication & Excellence
      </p>

      <p className="text-sm text-muted-foreground mb-10">
        Welcome to the pinnacle of luxury living
      </p>

      {/* Progress */}
      <div className="w-64 md:w-80">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span className="uppercase tracking-widest">Initializing</span>
          <span className="text-splash-accent font-medium">{progress}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-splash-accent rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-xs text-muted-foreground tracking-wide">
        Powered by NUN Technologies ©️ {new Date().getFullYear()}
      </div>
    </div>
  );
}
