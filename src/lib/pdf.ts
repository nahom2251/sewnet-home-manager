import jsPDF from 'jspdf';
import { Payment, Tenant, Language } from '@/types';
import { getTranslation, getApartmentLabel } from '@/lib/i18n';

interface BillData {
  tenant: Tenant;
  floor: number;
  position: string;
  month: string;
  payments: Payment[];
  language: Language;
}

export function generateBillPDF(data: BillData) {
  const { tenant, floor, position, month, payments, language } = data;
  const t = (key: string) => getTranslation(key, language);
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Alehegne Sewnet Apartment', w / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t('pdf.billTitle')} — ${month}`, w / 2, y, { align: 'center' });
  y += 12;

  // Apartment & Tenant info
  const aptLabel = getApartmentLabel(floor, position, language);
  doc.setFontSize(10);
  doc.text(`${t('tenant.apartment')}: ${aptLabel}`, 20, y);
  y += 6;
  doc.text(`${t('pdf.tenant')}: ${tenant.name}`, 20, y);
  y += 6;
  doc.text(`${t('common.phone')}: ${tenant.phone}`, 20, y);
  y += 12;

  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(234, 234, 234);
  doc.rect(20, y - 4, w - 40, 8, 'F');
  doc.text(t('pdf.item'), 22, y);
  doc.text(t('pdf.details'), 80, y);
  doc.text(t('common.amount'), 150, y);
  y += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  let total = 0;

  payments.forEach(p => {
    const typeLabel = t(`bill.${p.type}`);
    let detail = '';

    if (p.type === 'electricity' && p.details && 'kwhUsed' in p.details) {
      detail = `${p.details.kwhUsed} kWh × ${p.details.ratePerKwh} + fees + tax`;
    } else if (p.type === 'water') {
      detail = t('tenant.monthly');
    } else if (p.type === 'rent' && p.details && 'cycle' in p.details) {
      detail = t(`tenant.${p.details.cycle}`);
    }

    doc.text(typeLabel, 22, y);
    doc.text(detail, 80, y);
    doc.text(`${p.amount.toFixed(2)} ${t('common.etb')}`, 150, y);
    total += p.amount;
    y += 7;
  });

  // Total
  y += 4;
  doc.setDrawColor(0, 143, 122);
  doc.line(20, y, w - 20, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${t('pdf.totalDue')}: ${total.toFixed(2)} ${t('common.etb')}`, 22, y);
  y += 8;

  const statusText = payments.every(p => p.status === 'paid') ? t('common.paid') : t('common.unpaid');
  doc.setFontSize(10);
  doc.text(`${t('common.status')}: ${statusText}`, 22, y);
  y += 16;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${t('pdf.generatedOn')}: ${new Date().toLocaleDateString()}`, 22, y);
  y += 6;
  doc.text('Alehegne Sewnet Apartment', 22, y);
  y += 12;
  doc.text(`${t('pdf.signature')}: ____________________`, 22, y);

  doc.save(`bill_${aptLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${month}.pdf`);
}
