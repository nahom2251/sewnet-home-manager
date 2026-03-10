import { useApp } from '@/context/AppContext';
import ApartmentCard from '@/components/ApartmentCard';
import SlidePanel from '@/components/SlidePanel';
import { useState } from 'react';
import { Apartment } from '@/types';

export default function Apartments() {
  const { t, apartments, aptLabel, getTenantForApartment, getPaymentsForApartment } = useApp();
  const [selected, setSelected] = useState<Apartment | null>(null);

  const pairedApts = apartments.filter(a => a.floor <= 4);
  const singleApt = apartments.find(a => a.floor === 5);
  const tenant = selected ? getTenantForApartment(selected.id) : null;
  const payments = selected ? getPaymentsForApartment(selected.id) : [];

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">{t('nav.apartments')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {pairedApts.map(apt => (
          <ApartmentCard key={apt.id} apartment={apt} onClick={() => setSelected(apt)} />
        ))}
      </div>
      {singleApt && (
        <ApartmentCard apartment={singleApt} onClick={() => setSelected(singleApt)} />
      )}

      <SlidePanel open={!!selected} onClose={() => setSelected(null)} title={selected ? aptLabel(selected.floor, selected.position) : ''}>
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('common.status')}</p>
              <p className={`text-sm font-medium ${selected.status === 'occupied' ? 'text-primary' : 'text-destructive'}`}>
                {t(`common.${selected.status}`)}
              </p>
            </div>
            {tenant && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('common.name')}</p>
                  <p className="text-sm text-foreground">{tenant.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('common.phone')}</p>
                  <p className="text-sm text-foreground">{tenant.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('tenant.rentAmount')}</p>
                  <p className="text-sm text-foreground">{tenant.rentAmount.toFixed(2)} {t('common.etb')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('tenant.nextDue')}</p>
                  <p className="text-sm text-foreground">{tenant.nextRentDue || '—'}</p>
                </div>
              </>
            )}
            {payments.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">{t('bill.paymentHistory')}</p>
                <div className="space-y-1">
                  {payments.slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between text-sm py-1 border-b border-border">
                      <span className="text-foreground">{t(`bill.${p.type}`)} — {p.date}</span>
                      <span className={p.status === 'paid' ? 'text-primary' : 'text-destructive'}>
                        {p.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
