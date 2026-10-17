// One contextual help control per section: hover, keyboard focus, click/tap, Escape.
export function initContextHelp(){
  let active=null,pinned=false,timer;
  const cancel=()=>clearTimeout(timer);
  function close(){cancel();if(active){active.querySelector('[data-help]').setAttribute('aria-expanded','false');active.querySelector('.help-popover').hidden=true;}active=null;pinned=false;}
  function open(root){
    cancel();if(active!==root){close();active=root;}
    const trigger=root.querySelector('[data-help]'),panel=root.querySelector('.help-popover');
    panel.hidden=false;trigger.setAttribute('aria-expanded','true');
    position();
  }
  function position(){
    if(!active)return;
    const trigger=active.querySelector('[data-help]'),panel=active.querySelector('.help-popover');
    const box=trigger.getBoundingClientRect(),width=panel.offsetWidth,height=panel.offsetHeight;
    const left=Math.max(12,Math.min(box.left+box.width/2-width/2,innerWidth-width-12));
    const below=box.bottom+8;
    const preferred=below+height<=innerHeight-12?below:box.top-height-8;
    const top=Math.max(12,Math.min(preferred,innerHeight-height-12));
    panel.style.left=left+'px';panel.style.top=top+'px';
  }
  function later(){cancel();timer=setTimeout(()=>{if(active&&!pinned&&!active.matches(':hover')&&!active.contains(document.activeElement))close();},160);}
  document.addEventListener('pointerover',event=>{const root=event.target.closest('.context-help');if(root)open(root);});
  document.addEventListener('pointerout',event=>{if(active&&!active.contains(event.relatedTarget))later();});
  document.addEventListener('focusin',event=>{const root=event.target.closest('.context-help');if(root)open(root);else if(!pinned)close();});
  document.addEventListener('focusout',event=>{if(active&&!active.contains(event.relatedTarget))later();});
  document.addEventListener('click',event=>{const trigger=event.target.closest('[data-help]');if(trigger){const root=trigger.closest('.context-help');if(active===root&&pinned)close();else{open(root);pinned=true;}}else if(active&&!active.contains(event.target))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){const trigger=active.querySelector('[data-help]');const inPanel=active.querySelector('.help-popover').contains(document.activeElement);close();if(inPanel){trigger.focus();close();}}});
  document.addEventListener('varelyx:viewchange',close);document.addEventListener('varelyx:languagechange',close);
  // Focus and taps can finish a smooth scroll after opening the panel.
  // Follow its anchor instead of dismissing help on that delayed event.
  window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
  return {close};
}
