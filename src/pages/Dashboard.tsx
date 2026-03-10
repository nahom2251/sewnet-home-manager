import { useApp } from '@/context/AppContext';
import ApartmentCard from '@/components/ApartmentCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t, apartments, tenants, payments, getNotifications } = useApp();
  const navigate = useNavigate();
  const notifications = getNotifications();
  const occupied = apartments.filter(a => a.status === 'occupied').length;
  const recentPayments = [...payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const unpaidCount = payments.filter(p => p.status === 'unpaid').length;

  // Group: floors 2-4 (pairs), floor 5 (single)
  const pairedApts = apartments.filter(a => a.floor <= 4);
  const singleApt = apartments.find(a => a.floor === 5);

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">{t('dash.welcome')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-foreground">7</p>
          <p className="text-xs text-muted-foreground mt-1">{t('dash.totalApartments')}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-primary">{occupied}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('dash.occupiedUnits')}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-destructive">{7 - occupied}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('dash.vacantUnits')}</p>
        </div>
      </div>

      {/* Notifications */}
      {(notifications.length > 0 || unpaidCount > 0) && (
        <div className="mb-8 space-y-2">
          <h2 className="text-sm font-semibold text-foreground mb-2">{t('dash.notifications')}</h2>
          {notifications.map((n, i) => (
            <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-md px-4 py-2.5 text-sm text-foreground">
              {n.message}
            </div>
          ))}
          {unpaidCount > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-md px-4 py-2.5 text-sm text-foreground">
              {t('dash.unpaidBills')}: {unpaidCount}
            </div>
          )}
        </div>
      )}

      {/* Apartment Grid */}
      <h2 className="text-sm font-semibold text-foreground mb-3">{t('dash.overview')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {pairedApts.map(apt => (
          <ApartmentCard key={apt.id} apartment={apt} onClick={() => navigate(`/billing?apt=${apt.id}`)} />
        ))}
      </div>
      {singleApt && (
        <div className="mb-8">
          <ApartmentCard apartment={singleApt} onClick={() => navigate(`/billing?apt=${singleApt.id}`)} />
        </div>
      )}

      {/* Recent Payments */}
      {recentPayments.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">{t('dash.recentPayments')}</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('common.date')}</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('tenant.apartment')}</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('pdf.item')}</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t('common.amount')}</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map(p => {
                  const apt = apartments.find(a => a.id === p.apartmentId);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 text-foreground">{p.date}</td>
                      <td className="px-4 py-2 text-foreground">{apt ? `${apt.floor}F` : '—'}</td>
                      <td className="px-4 py-2 text-foreground">{t(`bill.${p.type}`)}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-foreground">{p.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          p.status === 'paid' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {t(`common.${p.status}`)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
