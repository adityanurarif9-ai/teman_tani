import { DEFAULT_PLAN, LOCATIONS, VARIETIES } from './data.js';

export const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
export function parseDate(value) { return new Date(`${value}T12:00:00`); }
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function addDays(value, days) {
  const result = parseDate(value);
  result.setDate(result.getDate() + days);
  return result;
}
export function formatDate(value, long = false) {
  const date = value instanceof Date ? value : parseDate(value);
  return date.toLocaleDateString('id-ID', { day:'numeric', month:long?'long':'short', year:'numeric' });
}
export function validPlan(plan) {
  if (!plan || typeof plan.name !== 'string' || !plan.name.trim() || plan.name.length > 80) return false;
  if (!LOCATIONS.includes(plan.location) || !Object.hasOwn(VARIETIES, plan.crop) || !Object.hasOwn(VARIETIES[plan.crop], plan.variety)) return false;
  if (typeof plan.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(plan.date)) return false;
  const parsed = parseDate(plan.date);
  return Number.isFinite(parsed.getTime()) && dateKey(parsed) === plan.date && plan.date >= '2000-01-01' && plan.date <= '2100-12-31' && Number(plan.area) >= 0.01 && Number(plan.area) <= 100000;
}
export function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
export function loadPlan() {
  const plan = readStorage('temantani.plan', null);
  // The original localStorage key remains compatible with the HTML version.
  return validPlan(plan) ? { ...plan, days:VARIETIES[plan.crop][plan.variety] } : null;
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function normalizePlan(plan = DEFAULT_PLAN) {
  return { ...plan, name:plan.name.trim(), days:VARIETIES[plan.crop][plan.variety] };
}
