import { useApp } from '@/context/AppContext';

export default function Reports() {
  const { t, apartments, payments } = useApp();
  const occupied = apartments.filter(a => a.status === 'occupied').length;
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0);

  const byType = (type: string) => payments.filter(p => p.type === type && p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">{t('report.title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-primary tabular-nums">{totalPaid.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('report.totalIncome')} ({t('common.etb')})</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-destructive tabular-nums">{totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('report.totalPending')} ({t('common.etb')})</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-foreground">{((occupied / 7) * 100).toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{t('report.occupancyRate')}</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-foreground mb-3">{t('report.byType')}</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {['rent', 'water', 'electricity'].map(type => (
              <tr key={type} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{t(`bill.${type}`)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">{byType(type).toFixed(2)} {t('common.etb')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
