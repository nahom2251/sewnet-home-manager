import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Apartment, Tenant, Payment, Language, RentCycle } from '@/types';
import { getTranslation, getApartmentLabel } from '@/lib/i18n';
import {
  loadApartments, saveApartments,
  loadTenants, saveTenants,
  loadPayments, savePayments,
  loadLanguage, saveLanguage,
} from '@/lib/store';
import { addMonths, format } from 'date-fns';

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  aptLabel: (floor: number, position: string) => string;
  apartments: Apartment[];
  tenants: Tenant[];
  payments: Payment[];
  addTenant: (t: Omit<Tenant, 'id'>) => void;
  updateTenant: (t: Tenant) => void;
  removeTenant: (id: string) => void;
  addPayment: (p: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  updateApartment: (a: Apartment) => void;
  getTenantForApartment: (aptId: string) => Tenant | undefined;
  getPaymentsForApartment: (aptId: string) => Payment[];
  getNotifications: () => { message: string; aptId: string }[];
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

function calcNextDue(from: string, cycle: RentCycle): string {
  const d = new Date(from);
  return format(addMonths(d, cycle), 'yyyy-MM-dd');
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(loadLanguage);
  const [apartments, setApartments] = useState<Apartment[]>(loadApartments);
  const [tenants, setTenants] = useState<Tenant[]>(loadTenants);
  const [payments, setPayments] = useState<Payment[]>(loadPayments);

  useEffect(() => { saveApartments(apartments); }, [apartments]);
  useEffect(() => { saveTenants(tenants); }, [tenants]);
  useEffect(() => { savePayments(payments); }, [payments]);

  const setLanguage = useCallback((l: Language) => {
    setLang(l);
    saveLanguage(l);
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string>) => {
    return getTranslation(key, language, replacements);
  }, [language]);

  const aptLabel = useCallback((floor: number, position: string) => {
    return getApartmentLabel(floor, position, language);
  }, [language]);

  const addTenant = useCallback((data: Omit<Tenant, 'id'>) => {
    const id = crypto.randomUUID();
    const tenant: Tenant = { ...data, id };
    setTenants(prev => [...prev, tenant]);
    setApartments(prev => prev.map(a =>
      a.id === data.apartmentId ? { ...a, tenantId: id, status: 'occupied' as const } : a
    ));
  }, []);

  const updateTenant = useCallback((tenant: Tenant) => {
    setTenants(prev => prev.map(t => t.id === tenant.id ? tenant : t));
  }, []);

  const removeTenant = useCallback((id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (tenant) {
      setApartments(prev => prev.map(a =>
        a.id === tenant.apartmentId ? { ...a, tenantId: undefined, status: 'vacant' as const } : a
      ));
    }
    setTenants(prev => prev.filter(t => t.id !== id));
  }, [tenants]);

  const addPayment = useCallback((data: Omit<Payment, 'id'>) => {
    const id = crypto.randomUUID();
    setPayments(prev => [...prev, { ...data, id }]);
    // If rent payment marked as paid, update next due date
    if (data.type === 'rent' && data.status === 'paid') {
      const tenant = tenants.find(t => t.id === data.tenantId);
      if (tenant) {
        const nextDue = calcNextDue(data.date, tenant.rentCycle);
        updateTenant({ ...tenant, nextRentDue: nextDue });
      }
    }
  }, [tenants, updateTenant]);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const updateApartment = useCallback((apt: Apartment) => {
    setApartments(prev => prev.map(a => a.id === apt.id ? apt : a));
  }, []);

  const getTenantForApartment = useCallback((aptId: string) => {
    const apt = apartments.find(a => a.id === aptId);
    return apt?.tenantId ? tenants.find(t => t.id === apt.tenantId) : undefined;
  }, [apartments, tenants]);

  const getPaymentsForApartment = useCallback((aptId: string) => {
    return payments.filter(p => p.apartmentId === aptId).sort((a, b) => b.date.localeCompare(a.date));
  }, [payments]);

  const getNotifications = useCallback(() => {
    const today = new Date();
    const notes: { message: string; aptId: string }[] = [];
    tenants.forEach(tenant => {
      if (tenant.nextRentDue) {
        const due = new Date(tenant.nextRentDue);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 5 && diff >= 0) {
          const apt = apartments.find(a => a.id === tenant.apartmentId);
          if (apt) {
            notes.push({
              message: t('dash.rentDueSoon', { days: String(diff) }),
              aptId: apt.id,
            });
          }
        }
      }
    });
    return notes;
  }, [tenants, apartments, t]);

  return (
    <AppContext.Provider value={{
      language, setLanguage, t, aptLabel,
      apartments, tenants, payments,
      addTenant, updateTenant, removeTenant,
      addPayment, updatePayment, updateApartment,
      getTenantForApartment, getPaymentsForApartment,
      getNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}
