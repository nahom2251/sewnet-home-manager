import { useApp } from '@/context/AppContext';

export default function Settings() {
  const { t, language, setLanguage } = useApp();

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">{t('settings.title')}</h1>

      <div className="bg-card border border-border rounded-lg p-5 max-w-md">
        <h2 className="text-sm font-semibold text-foreground mb-1">{t('settings.language')}</h2>
        <p className="text-xs text-muted-foreground mb-4">{t('settings.languageDesc')}</p>

        <div className="space-y-2">
          <button
            onClick={() => setLanguage('en')}
            className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors border ${
              language === 'en'
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border text-foreground hover:bg-secondary'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('am')}
            className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors border ${
              language === 'am'
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border text-foreground hover:bg-secondary'
            }`}
          >
            አማርኛ (Amharic)
          </button>
        </div>
      </div>
    </div>
  );
}
