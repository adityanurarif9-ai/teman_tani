import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PLAN } from './data.js';
import { addDays, dateKey, normalizePlan, validPlan } from './lib.js';

test('perkiraan panen melewati tahun dan Februari dengan benar',()=>{
  assert.equal(dateKey(addDays('2026-11-12',110)),'2027-03-02');
  assert.equal(dateKey(addDays('2028-02-28',2)),'2028-03-01');
});
test('rencana rusak dari localStorage ditolak',()=>{
  assert.ok(validPlan(DEFAULT_PLAN));
  assert.equal(validPlan({...DEFAULT_PLAN,date:'2026-02-30'}),false);
  assert.equal(validPlan({...DEFAULT_PLAN,area:'0'}),false);
  assert.equal(validPlan({...DEFAULT_PLAN,name:'   '}),false);
  assert.equal(validPlan({...DEFAULT_PLAN,crop:'toString',variety:'x'}),false);
});
test('umur varietas dihitung ulang dari pilihan saat menyimpan',()=>{
  const plan=normalizePlan({...DEFAULT_PLAN,name:' Sawah Utama ',days:999});
  assert.equal(plan.days,110);
  assert.equal(plan.name,'Sawah Utama');
});
