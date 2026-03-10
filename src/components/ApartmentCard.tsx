import { useApp } from '@/context/AppContext';
import { Apartment } from '@/types';

interface ApartmentCardProps {
  apartment: Apartment;
  onClick?: () => void;
}

export default function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const { t, aptLabel, getTenantForApartment } = useApp();
  const tenant = getTenantForApartment(apartment.id);
  const label = aptLabel(apartment.floor, apartment.position);
  const isOccupied = apartment.status === 'occupied';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          isOccupied
            ? 'bg-primary/10 text-primary'
            : 'bg-destructive/10 text-destructive'
        }`}>
          {isOccupied ? t('common.occupied') : t('common.vacant')}
        </span>
      </div>
      {tenant ? (
        <div className="space-y-1">
          <p className="text-sm text-foreground">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">{tenant.phone}</p>
          <p className="text-xs text-muted-foreground">
            {t('tenant.nextDue')}: {tenant.nextRentDue || '—'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">{t('common.vacant')}</p>
      )}
    </button>
  );
}
