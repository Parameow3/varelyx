// Dated display references; never used by the BDT planner or proof engine.
export const REFERENCE_RATES = Object.freeze({bdtPerUsd:123.45,khrPerUsd:4067});
export const CURRENCIES = Object.freeze(['USD','BDT','KHR']);
const KEY='varelyx-display-currency', RATE_KEY='varelyx-display-rates';
let currency='BDT',rates={...REFERENCE_RATES},custom=false;
export function validRates(value){return value&&['bdtPerUsd','khrPerUsd'].every(key=>typeof value[key]==='number'&&Number.isFinite(value[key])&&value[key]>0&&value[key]<=1_000_000);}
export function convertBdt(amount,code=currency,fx=rates){
  if(!Number.isFinite(amount)||!CURRENCIES.includes(code)||!validRates(fx))throw Error('Invalid display conversion');
  return code==='BDT'?amount:amount/fx.bdtPerUsd*(code==='KHR'?fx.khrPerUsd:1);
}
export function money(amount,{code=currency,withCode=true,fx=rates}={}){
  const value=convertBdt(amount,code,fx);
  const digits=code==='USD'?2:0;
  return (withCode?code+' ':'')+new Intl.NumberFormat('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
}
export const getCurrency=()=>currency;
export const getRates=()=>({...rates});
export const hasCustomRates=()=>custom;
export function setCurrency(value){currency=CURRENCIES.includes(value)?value:'BDT';try{localStorage.setItem(KEY,currency);}catch{}document.dispatchEvent(new CustomEvent('varelyx:currencychange'));}
export function setRates(value){if(!validRates(value))return false;rates={bdtPerUsd:value.bdtPerUsd,khrPerUsd:value.khrPerUsd};custom=true;try{localStorage.setItem(RATE_KEY,JSON.stringify(rates));}catch{}document.dispatchEvent(new CustomEvent('varelyx:currencychange'));return true;}
export function resetRates(){rates={...REFERENCE_RATES};custom=false;try{localStorage.removeItem(RATE_KEY);}catch{}document.dispatchEvent(new CustomEvent('varelyx:currencychange'));}
export function initCurrency(){
  try{const saved=localStorage.getItem(KEY);if(CURRENCIES.includes(saved))currency=saved;const stored=JSON.parse(localStorage.getItem(RATE_KEY));if(validRates(stored)){rates={bdtPerUsd:stored.bdtPerUsd,khrPerUsd:stored.khrPerUsd};custom=true;}}catch{}
  document.querySelector('#currencySelect').addEventListener('change',e=>setCurrency(e.target.value));
  document.querySelector('#currencyForm').addEventListener('submit',e=>{e.preventDefault();const valid=setRates({bdtPerUsd:Number(document.querySelector('#bdtRate').value),khrPerUsd:Number(document.querySelector('#khrRate').value)});document.querySelector('#currencyError').hidden=valid;});
  document.querySelector('#resetRates').addEventListener('click',resetRates);
}
