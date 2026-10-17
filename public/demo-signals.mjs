import {getLocale} from './i18n.mjs';

// Equivalent synthetic inputs, with capacity deliberately unknown in every language.
export const DEMO_SIGNALS=Object.freeze({
  en:"Supplier B has informed us that Thursday's scheduled delivery will arrive approximately 48 hours late due to a vehicle breakdown and warehouse congestion. The delay affects 2 distribution routes serving Dhaka North and Gazipur. Current stock is expected to cover only part of Thursday demand. Supplier B has not yet confirmed how many replacement cases can be supplied on Thursday. Operations should assess transfer, emergency supply, and cash constraints before any replenishment decision is approved.",
  bn:'Supplier B জানিয়েছে যে গাড়ি নষ্ট হওয়া এবং গুদামে জটের কারণে বৃহস্পতিবারের নির্ধারিত ডেলিভারি প্রায় 48 ঘণ্টা দেরি হবে। এই বিলম্বে Dhaka North ও Gazipur এলাকার 2 রুট প্রভাবিত হবে। বর্তমান মজুত বৃহস্পতিবারের চাহিদার কেবল একটি অংশ পূরণ করতে পারবে। বৃহস্পতিবার কত কেস বিকল্প পণ্য সরবরাহ করা যাবে, Supplier B এখনও তা নিশ্চিত করেনি। কোনো পুনঃসরবরাহ সিদ্ধান্ত অনুমোদনের আগে অপারেশনস দলকে স্টোর ট্রান্সফার, জরুরি সরবরাহ এবং নগদ অর্থের সীমা যাচাই করতে হবে।',
  km:'Supplier B បានជូនដំណឹងថា ការដឹកជញ្ជូនថ្ងៃព្រហស្បតិ៍នឹងយឺតប្រហែល 48 ម៉ោង ដោយសាររថយន្តខូច និងការកកស្ទះនៅឃ្លាំង។ ការយឺតនេះប៉ះពាល់ដល់ផ្លូវដឹកជញ្ជូនចំនួន 2 ផ្លូវ សម្រាប់តំបន់ Dhaka North និង Gazipur។ ស្តុកបច្ចុប្បន្នអាចបំពេញតម្រូវការថ្ងៃព្រហស្បតិ៍បានតែមួយផ្នែក។ Supplier B មិនទាន់បញ្ជាក់បរិមាណជំនួសដែលអាចផ្គត់ផ្គង់នៅថ្ងៃព្រហស្បតិ៍បានទេ។ មុនអនុម័តការផ្គត់ផ្គង់បន្ថែម ក្រុមប្រតិបត្តិការត្រូវវាយតម្លៃការផ្ទេររវាងហាង ការផ្គត់ផ្គង់បន្ទាន់ និងកម្រិតថវិកា។'
});
export function demoSignal(locale){return DEMO_SIGNALS[locale]??DEMO_SIGNALS.en;}
export function initDemoSignal(input,canReplace){
  let edited=false;
  const samples=new Set(Object.values(DEMO_SIGNALS));
  function sync(){if(!edited&&canReplace()&&(!input.value||samples.has(input.value.trim())))input.value=demoSignal(getLocale());}
  input.addEventListener('input',()=>{edited=true;});
  document.addEventListener('varelyx:languagechange',sync);
  sync();
  return {sync,reset(){edited=false;input.value=demoSignal(getLocale());}};
}
