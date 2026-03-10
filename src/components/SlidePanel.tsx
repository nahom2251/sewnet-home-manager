import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlidePanel({ open, onClose, title, children }: SlidePanelProps) {
  const { t } = useApp();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-card border-l border-border shadow-lg overflow-y-auto"
        style={{ animation: 'slideInRight 0.25s ease-out' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-secondary transition-colors">
            {t('common.close')}
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
