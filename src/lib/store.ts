import { Apartment, Tenant, Payment, Language } from '@/types';

const KEYS = {
  apartments: 'as_apartments',
  tenants: 'as_tenants',
  payments: 'as_payments',
  language: 'as_language',
};

const INITIAL_APARTMENTS: Apartment[] = [
  { id: '2f', floor: 2, position: 'front', status: 'vacant' },
  { id: '2b', floor: 2, position: 'back', status: 'vacant' },
  { id: '3f', floor: 3, position: 'front', status: 'vacant' },
  { id: '3b', floor: 3, position: 'back', status: 'vacant' },
  { id: '4f', floor: 4, position: 'front', status: 'vacant' },
  { id: '4b', floor: 4, position: 'back', status: 'vacant' },
  { id: '5s', floor: 5, position: 'single', status: 'vacant' },
];

function load<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadApartments(): Apartment[] {
  return load(KEYS.apartments, INITIAL_APARTMENTS);
}

export function saveApartments(data: Apartment[]) {
  save(KEYS.apartments, data);
}

export function loadTenants(): Tenant[] {
  return load(KEYS.tenants, []);
}

export function saveTenants(data: Tenant[]) {
  save(KEYS.tenants, data);
}

export function loadPayments(): Payment[] {
  return load(KEYS.payments, []);
}

export function savePayments(data: Payment[]) {
  save(KEYS.payments, data);
}

export function loadLanguage(): Language {
  return load(KEYS.language, 'en');
}

export function saveLanguage(lang: Language) {
  save(KEYS.language, lang);
}
