import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import SlidePanel from '@/components/SlidePanel';
import { Button } from '@/components/ui/button';
import { Tenant, RentCycle, PaymentStatus } from '@/types';
import { format, addMonths } from 'date-fns';

export default function Tenants() {
  const { t, tenants, apartments, addTenant, updateTenant, removeTenant, aptLabel } = useApp();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);

  const vacantApts = apartments.filter(a => a.status === 'vacant');

  const [form, setForm] = useState({
    name: '', phone: '', moveInDate: format(new Date(), 'yyyy-MM-dd'),
    apartmentId: '', rentAmount: '', rentCycle: 1 as RentCycle, rentStatus: 'unpaid' as PaymentStatus,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', phone: '', moveInDate: format(new Date(), 'yyyy-MM-dd'), apartmentId: '', rentAmount: '', rentCycle: 1, rentStatus: 'unpaid' });
    setPanelOpen(true);
  };

  const openEdit = (tenant: Tenant) => {
    setEditing(tenant);
    setForm({
      name: tenant.name, phone: tenant.phone, moveInDate: tenant.moveInDate,
      apartmentId: tenant.apartmentId, rentAmount: String(tenant.rentAmount), rentCycle: tenant.rentCycle, rentStatus: tenant.rentStatus,
    });
    setPanelOpen(true);
  };

  const handleSave = () => {
    const rentAmount = parseFloat(form.rentAmount) || 0;
    const months = form.rentCycle;
    const nextRentDue = format(addMonths(new Date(form.moveInDate), months), 'yyyy-MM-dd');

    if (editing) {
      updateTenant({ ...editing, name: form.name, phone: form.phone, moveInDate: form.moveInDate, rentAmount, rentCycle: form.rentCycle, rentStatus: form.rentStatus });
    } else {
      if (!form.apartmentId) return;
      addTenant({ name: form.name, phone: form.phone, moveInDate: form.moveInDate, apartmentId: form.apartmentId, rentAmount, rentCycle: form.rentCycle, rentStatus: form.rentStatus, nextRentDue });
    }
    setPanelOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">{t('nav.tenants')}</h1>
        <Button onClick={openAdd} size="sm">{t('tenant.add')}</Button>
      </div>

      {tenants.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('common.name')}</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('common.phone')}</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden sm:table-cell">{t('tenant.apartment')}</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden sm:table-cell">{t('tenant.rentCycle')}</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => {
                const apt = apartments.find(a => a.id === tenant.apartmentId);
                return (
                  <tr key={tenant.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-foreground">{tenant.name}</td>
                    <td className="px-4 py-2.5 text-foreground">{tenant.phone}</td>
                    <td className="px-4 py-2.5 text-foreground hidden sm:table-cell">
                      {apt ? aptLabel(apt.floor, apt.position) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-foreground hidden sm:table-cell">{form.rentCycle} {t('tenant.months')}</td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button onClick={() => openEdit(tenant)} className="text-xs text-primary hover:underline">{t('common.edit')}</button>
                      <button onClick={() => { if (confirm('Remove tenant?')) removeTenant(tenant.id); }} className="text-xs text-destructive hover:underline">{t('common.delete')}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editing ? t('tenant.edit') : t('tenant.add')}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t('common.name')}</label>
            <input className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t('common.phone')}</label>
            <input className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t('tenant.moveInDate')}</label>
            <input type="date" className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.moveInDate} onChange={e => setForm(f => ({ ...f, moveInDate: e.target.value }))} />
          </div>
          {!editing && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t('tenant.apartment')}</label>
              <select className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.apartmentId} onChange={e => setForm(f => ({ ...f, apartmentId: e.target.value }))}>
                <option value="">{t('bill.selectApartment')}</option>
                {vacantApts.map(a => (
                  <option key={a.id} value={a.id}>{aptLabel(a.floor, a.position)}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t('tenant.rentAmount')} ({t('common.etb')})</label>
            <input type="number" className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.rentAmount} onChange={e => setForm(f => ({ ...f, rentAmount: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t('tenant.rentCycle')}</label>
            <input type="number" min={1} max={12} className="w-full border border-input bg-card rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={form.rentCycle} onChange={e => setForm(f => ({ ...f, rentCycle: Math.min(12, Math.max(1, parseInt(e.target.value) || 1)) as RentCycle }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">{t('common.save')}</Button>
            <Button variant="outline" onClick={() => setPanelOpen(false)} className="flex-1">{t('common.cancel')}</Button>
          </div>
        </div>
      </SlidePanel>
    </div>
  );
}
