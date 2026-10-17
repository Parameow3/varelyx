import {t, ui} from './i18n.mjs';
const viewForHash=hash=>({
  '#commandCenter':'evidence','#evidenceWorkspace':'evidence','#evidenceScout':'evidence',
  '#scenarioWorkspace':'plan','#selectedCandidate':'plan','#shadowMode':'plan',
  '#proofWorkspace':'review','#approvalSummary':'review',
  '#actionWorkspace':'saved','#auditWorkspace':'audit','#setupWarning':'evidence'
})[hash]??'evidence';
const titles={evidence:'Review supplier evidence',plan:'Compare recovery plans',review:'Verify and approve',saved:'Saved sandbox actions',audit:'Decision audit'};

export function initWorkspace(){
  const shell=document.querySelector('#appShell');
  const sidebar=document.querySelector('#workspaceNavigation');
  const toggle=document.querySelector('#sidebarToggle');
  const menu=document.querySelector('#mobileMenuBtn');
  const backdrop=document.querySelector('#navigationBackdrop');
  const mobile=matchMedia('(max-width:800px)');
  let collapsed=false;
  try{collapsed=localStorage.getItem('varelyx-sidebar-collapsed')==='true';}catch{}
  let drawerOpen=false;
  function navigation(){
    shell.classList.toggle('sidebar-collapsed',collapsed);
    document.body.classList.toggle('navigation-open',mobile.matches&&drawerOpen);
    backdrop.hidden=!(mobile.matches&&drawerOpen);
    toggle.setAttribute('aria-expanded',String(mobile.matches?drawerOpen:!collapsed));
    toggle.setAttribute('aria-label',ui(mobile.matches?'Close navigation':collapsed?'Expand navigation':'Collapse navigation'));
    toggle.textContent=mobile.matches?'×':collapsed?'›':'‹';
    menu.setAttribute('aria-expanded',String(drawerOpen));
    menu.setAttribute('aria-label',ui(drawerOpen?'Close navigation':'Open navigation'));
    sidebar.inert=mobile.matches&&!drawerOpen;
  }
  function closeDrawer(returnFocus=false){drawerOpen=false;navigation();if(returnFocus)menu.focus();}
  toggle.addEventListener('click',()=>{if(mobile.matches)closeDrawer(true);else{collapsed=!collapsed;try{localStorage.setItem('varelyx-sidebar-collapsed',String(collapsed));}catch{}navigation();}});
  menu.addEventListener('click',()=>{drawerOpen=!drawerOpen;navigation();if(drawerOpen)toggle.focus();});
  backdrop.addEventListener('click',()=>closeDrawer(true));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&drawerOpen){closeDrawer(true);return;}
    if(event.key==='Tab'&&mobile.matches&&drawerOpen){const controls=[...sidebar.querySelectorAll('a,button')];const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  mobile.addEventListener('change',()=>{drawerOpen=false;navigation();});
  function show(hash,{focus=false,replace=false}={}){
    const view=viewForHash(hash);
    document.querySelector('#mainWorkspace').dataset.activeView=view;
    document.querySelectorAll('[data-view]').forEach(section=>{section.hidden=section.dataset.view!==view;});
    document.querySelector('#proofControls').hidden=!['plan','review'].includes(view);
    document.querySelector('#viewTitle').textContent=t(titles[view]);
    const activeNav=view==='saved'?'#actionWorkspace':view==='audit'?'#auditWorkspace':'#evidenceWorkspace';
    document.querySelectorAll('.sidebar .nav-link').forEach(link=>{link.classList.toggle('active',link.hash===activeNav);if(link.hash===activeNav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.querySelectorAll('[data-workflow]').forEach(link=>{const active=link.dataset.workflow===(hash==='#approvalSummary'?'approval':view);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
    if(location.hash!==hash){history[replace?'replaceState':'pushState'](null,'',hash);}
    closeDrawer();
    if(focus){document.querySelector('#viewTitle').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
    if(hash==='#evidenceScout'&&focus)document.querySelector('#capacityInput').focus({preventScroll:true});
    if(hash==='#approvalSummary'&&focus)document.querySelector('#approvalSummary').scrollIntoView({block:'nearest'});
    document.dispatchEvent(new CustomEvent('varelyx:viewchange',{detail:{view,hash}}));
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const hash=link.getAttribute('href');if(!document.querySelector(hash))return;
    event.preventDefault();show(hash,{focus:true});
    if(link.id==='nextStepBtn'&&hash==='#evidenceWorkspace'){document.querySelector('#signalPanel').open=true;document.querySelector('#disruptionInput').focus({preventScroll:true});}
  });
  window.addEventListener('popstate',()=>show(location.hash||'#evidenceWorkspace'));
  document.addEventListener('varelyx:languagechange',()=>{navigation();document.querySelector('#viewTitle').textContent=t(titles[viewForHash(location.hash)]);});
  navigation();show(location.hash||'#evidenceWorkspace',{replace:true});
  const header=document.querySelector('.topbar');new ResizeObserver(()=>document.documentElement.style.setProperty('--header-height',header.offsetHeight+'px')).observe(header);
  return {show,get view(){return viewForHash(location.hash);}};
}
