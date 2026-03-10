import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import ElectricityCalculator from '@/components/ElectricityCalculator';
import { generateBillPDF } from '@/lib/pdf';
import { format } from 'date-fns';
import { ElectricityDetails } from '@/types';

export default function Billing() {
  const { t, apartments, aptLabel, getTenantForApartment, addPayment, getPaymentsForApartment, payments, updatePayment, language } = useApp();
  const [searchParams] = useSearchParams();
  const [selectedApt, setSelectedApt] = useState(searchParams.get('apt') || '');
  const [tab, setTab] = useState<'rent' | 'water' | 'electricity'>('rent');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Rent form
  const [rentAmount, setRentAmount] = useState('');

  // Water form
  const [waterAmount, setWaterAmount] = useState('');

  // Electricity form
  const [kwh, setKwh] = useState('');
  const [rate, setRate] = useState('');
  const [elecResult, setElecResult] = useState<ElectricityDetails | null>(null);

  const apt = apartments.find(a => a.id === selectedApt);
  const tenant = apt ? getTenantForApartment(apt.id) : null;
  const aptPayments = apt ? getPaymentsForApartment(apt.id) : [];

  const handleElecCalc = useCallback((result: { baseCost: number; subtotal: number; taxAmount: number; total: number }) => {
    setElecResult({
      kwhUsed: parseFloat(kwh) || 0,
      ratePerKwh: parseFloat(rate) || 0,
      baseCost: result.baseCost,
      serviceFee: 16,
      tvTax: 10,
      subtotal: result.subtotal,
      taxAmount: result.taxAmount,
      total: result.total,
    });
  }, [kwh, rate]);

  const addBill = (type: 'rent' | 'water' | 'electricity') => {
    if (!apt || !tenant) return;
    const today = format(new Date(), 'yyyy-MM-dd');

    if (type === 'rent') {
      const amount = parseFloat(rentAmount) || tenant.rentAmount;
      addPayment({ apartmentId: apt.id, tenantId: tenant.id, type: 'rent', amount, date: today, month, status: 'unpaid', details: { cycle: tenant.rentCycle, period: month } });
      setRentAmount('');
    } else if (type === 'water') {
      const amount = parseFloat(waterAmount) || 0;
      if (amount <= 0) return;
      addPayment({ apartmentId: apt.id, tenantId: tenant.id, type: 'water', amount, date: today, month, status: 'unpaid', details: { amount } });
      setWaterAmount('');
    } else if (type === 'electricity' && elecResult) {
      addPayment({ apartmentId: apt.id, tenantId: tenant.id, type: 'electricity', amount: elecResult.total, date: today, month, status: 'unpaid', details: elecResult });
      setKwh('');
      setRate('');
      setElecResult(null);
    }
  };

  const handleGeneratePDF = () => {
    if (!apt || !tenant) return;
    const monthPayments = aptPayments.filter(p => p.month === month);
    generateBillPDF({ tenant, floor: apt.floor, position: apt.position, month, payments: monthPayments, language });
  };

  const tabs = [
    { key: 'rent' as const, label: t('bill.rent') },
    { key: 'water' as const, label: t('bill.water') },
    { key: 'electricity' as const, label: t('bill.electricity') },
  ];

  const inputClass = "w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">{t('nav.billing')}</h1>

      {/* Apartment selector */}
      <div className="mb-6">
        <label className="text-xs text-muted-foreground block mb-1">{t('bill.selectApartment')}</label>
        <select className={inputClass} value={selectedApt} onChange={e => setSelectedApt(e.target.value)}>
          <option value="">{t('bill.selectApartment')}</option>
          {apartments.filter(a => a.status === 'occupied').map(a => (
            <option key={a.id} value={a.id}>{aptLabel(a.floor, a.position)}</option>
          ))}
        </select>
      </div>

      {apt && tenant && (
        <>
          {/* Tenant info */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground font-medium">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">{tenant.phone} · {t(`tenant.${tenant.rentCycle}`)} · {tenant.rentAmount.toFixed(2)} {t('common.etb')}</p>
          </div>

          {/* Month selector */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground block mb-1">{t('common.month')}</label>
            <input type="month" className={inputClass} value={month} onChange={e => setMonth(e.target.value)} />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-4">
            {tabs.map(tb => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-4 py-2 text-sm transition-colors ${
                  tab === tb.key
                    ? 'border-b-2 border-primary text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'rent' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t('tenant.rentAmount')} ({t('common.etb')})</label>
                <input type="number" className={inputClass} placeholder={String(tenant.rentAmount)} value={rentAmount} onChange={e => setRentAmount(e.target.value)} />
              </div>
              <Button onClick={() => addBill('rent')} size="sm">{t('bill.addPayment')}</Button>
            </div>
          )}

          {tab === 'water' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t('bill.waterAmount')} ({t('common.etb')})</label>
                <input type="number" className={inputClass} value={waterAmount} onChange={e => setWaterAmount(e.target.value)} />
              </div>
              <Button onClick={() => addBill('water')} size="sm">{t('bill.addPayment')}</Button>
            </div>
          )}

          {tab === 'electricity' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">{t('bill.kwhUsed')}</label>
                  <input type="number" className={inputClass} value={kwh} onChange={e => setKwh(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">{t('bill.ratePerKwh')} ({t('common.etb')})</label>
                  <input type="number" className={inputClass} value={rate} onChange={e => setRate(e.target.value)} />
                </div>
              </div>
              <ElectricityCalculator kwhUsed={parseFloat(kwh) || 0} ratePerKwh={parseFloat(rate) || 0} onCalculated={handleElecCalc} />
              {elecResult && (
                <Button onClick={() => addBill('electricity')} size="sm">{t('bill.addPayment')}</Button>
              )}
            </div>
          )}

          {/* Generate PDF */}
          <div className="mt-6">
            <Button variant="outline" onClick={handleGeneratePDF} size="sm">{t('common.generatePdf')}</Button>
          </div>

          {/* Payment history */}
          {aptPayments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground mb-3">{t('bill.paymentHistory')}</h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('common.date')}</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('pdf.item')}</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('common.month')}</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t('common.amount')}</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aptPayments.map(p => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 text-foreground">{p.date}</td>
                        <td className="px-4 py-2 text-foreground">{t(`bill.${p.type}`)}</td>
                        <td className="px-4 py-2 text-foreground">{p.month}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-foreground">{p.amount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => updatePayment(p.id, { status: p.status === 'paid' ? 'unpaid' : 'paid' })}
                            className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${
                              p.status === 'paid' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {t(`common.${p.status}`)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
