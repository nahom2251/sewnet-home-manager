import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

interface ElectricityResult {
  baseCost: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

interface Props {
  kwhUsed: number;
  ratePerKwh: number;
  onCalculated?: (result: ElectricityResult) => void;
}

const SERVICE_FEE = 16;
const TV_TAX = 10;
const TAX_RATE = 0.155;

export function calculateElectricity(kwh: number, rate: number): ElectricityResult {
  const baseCost = kwh * rate;
  const subtotal = baseCost + SERVICE_FEE + TV_TAX;
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;
  return { baseCost, subtotal, taxAmount, total };
}

export default function ElectricityCalculator({ kwhUsed, ratePerKwh, onCalculated }: Props) {
  const { t } = useApp();
  const [visible, setVisible] = useState({ base: false, sub: false, tax: false, total: false });
  const [result, setResult] = useState<ElectricityResult | null>(null);

  const animate = useCallback(() => {
    if (kwhUsed <= 0 || ratePerKwh <= 0) {
      setVisible({ base: false, sub: false, tax: false, total: false });
      setResult(null);
      return;
    }

    const calc = calculateElectricity(kwhUsed, ratePerKwh);
    setResult(calc);
    setVisible({ base: false, sub: false, tax: false, total: false });

    setTimeout(() => setVisible(v => ({ ...v, base: true })), 150);
    setTimeout(() => setVisible(v => ({ ...v, sub: true })), 300);
    setTimeout(() => setVisible(v => ({ ...v, tax: true })), 450);
    setTimeout(() => setVisible(v => ({ ...v, total: true })), 600);

    onCalculated?.(calc);
  }, [kwhUsed, ratePerKwh, onCalculated]);

  useEffect(() => {
    const timer = setTimeout(animate, 200);
    return () => clearTimeout(timer);
  }, [animate]);

  if (!result) return null;

  const rows = [
    { key: 'base', label: t('bill.baseCost'), value: result.baseCost, detail: `${kwhUsed} × ${ratePerKwh}`, show: visible.base },
    { key: 'sub', label: t('bill.subtotal'), value: result.subtotal, detail: `+ ${SERVICE_FEE} + ${TV_TAX}`, show: visible.sub },
    { key: 'tax', label: t('bill.taxAmount'), value: result.taxAmount, detail: `× 15.5%`, show: visible.tax },
    { key: 'total', label: t('bill.totalBill'), value: result.total, detail: '', show: visible.total },
  ];

  return (
    <div className="space-y-2 mt-4">
      {rows.map(row => (
        <div
          key={row.key}
          className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
            row.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          } ${row.key === 'total' ? 'bg-primary/10 font-semibold' : 'bg-secondary'}`}
        >
          <div>
            <span className="text-sm text-foreground">{row.label}</span>
            {row.detail && <span className="text-xs text-muted-foreground ml-2">{row.detail}</span>}
          </div>
          <span className="text-sm text-foreground tabular-nums">
            {row.value.toFixed(2)} {t('common.etb')}
          </span>
        </div>
      ))}
    </div>
  );
}
