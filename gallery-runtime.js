(function () {
  const data = window.menuDesign;
  const images = new Map(data.pages.map(p => [p.name, p]));
  const routes = new Map(data.routes.map(p => [p.id, p]));
  let current = '01-items';
  let equippedState = 'equipment';
  let trashOrigin = 'backpack';
  let upgradeOrigin = 'backpack';
  let peopleOrigin = '04-people';
  let profileOrigin = 'person-detail';
  let masteryOrigin = 'skill-levels';
  let mapState = null;
  let islandAccess = true; // Sample design context, not a game progression flag.
  const imageCache = new Map();
  const el = id => document.getElementById(id);
  function notice(text) { el('notice').textContent = text; }
  function show(name) {
    if (!images.has(name)) return;
    current = name;
    const page = images.get(name);
    el('screen').src = name + '.png';
    el('title').textContent = page.label;
    el('note').textContent = page.note;
    const view = data.mapViews.find(v => v.name === name);
    mapState = view ? {region:view.region, zoom:view.zoom, viewport:view.viewport.slice(), index:0} : null;
    el('mapcanvas').hidden = !mapState;
    document.querySelectorAll('[data-image]').forEach(b => b.setAttribute('aria-pressed', b.dataset.image === name));
    notice(name === '01-items' ? 'Combined Items/Backpack. Farmer equipment is under the Farmer & Skills tab.' : 'Click illustrated slots/actions, or use A and B. Unrendered routes are explicitly blocked.');
    if (mapState) updateMap();
  }
  function open(id) {
    const route = routes.get(id);
    if (!route) return;
    if (!route.render) { notice(route.title + ': mapped, but still needs a mockup before implementation. ' + route.notes); return; }
    if(id==='backpack-upgrades')upgradeOrigin=current;
    if(id==='person-detail' && ['04-people','people-official'].includes(current))peopleOrigin=current;
    if(id==='gift-tastes' && ['person-detail','person-birthday-unknown','person-location-unknown'].includes(current))profileOrigin=current;
    if(id==='mastery' || id==='mastery-locked')masteryOrigin=current;
    if (id === 'equipment-swapped') equippedState = 'equipment-after-swap';
    const tier=current.startsWith('inventory-trash-')?Number(current.split('-').pop()):0;
    const trashImage=tier?'trash-confirm-'+['basic','copper','steel','gold','iridium'][tier]:'trash-confirm';
    show(id==='trash'?trashImage:id === 'equipment' ? equippedState : route.render);
  }
  function back() {
    if (current.startsWith('trash-confirm')) { show(trashOrigin); return; }
    if (current === 'backpack-upgrade-info') { show(upgradeOrigin); return; }
    if (current === 'person-detail') { show(peopleOrigin); return; }
    if (current === 'gift-log') { show(profileOrigin); return; }
    if (current === 'mastery' || current === 'mastery-locked') { show(masteryOrigin); return; }
    if (data.backOverrides[current]) { open(data.backOverrides[current]); return; }
    const route = data.routes.find(n => n.render === current);
    if (route && route.parent) open(route.parent);
    else notice('Return to the live HUD: mapped, but a live-HUD mockup is still needed. No game is running.');
  }
  function owner() {
    return data.owners[current] || 0;
  }
  function cycle(delta) {
    const tool = data.tools.indexOf(current);
    if (tool >= 0) show(data.tools[(tool + delta + data.tools.length) % data.tools.length]);
    else show(data.main[(owner() + delta + data.main.length) % data.main.length]);
  }
  function visibleLocations() {
    if (!mapState) return [];
    const [x,y,w,h]=mapState.viewport;
    return data.mapRegions[mapState.region].filter(p=>{
      if(p.condition || p.areaCondition) return false; // No guessed query evaluation.
      const r=p.pixelArea;
      return !mapState.zoom || (r.X<x+w && r.Y<y+h && r.X+r.Width>x && r.Y+r.Height>y);
    });
  }
  function currentLocation() { const locations=visibleLocations(); return locations.length ? locations[mapState.index%locations.length] : null; }
  function mapLabel(p) { return p ? (p.knownCondition ? '???' : p.label || p.id) : 'No visible locations'; }
  function loadImage(file) {
    if (imageCache.has(file)) return imageCache.get(file);
    const image=new Image(); image.onload=()=>{if(mapState)renderMap();};image.src=file;imageCache.set(file,image);return image;
  }
  function renderMap() {
    if (!mapState || typeof Image==='undefined') return;
    const ctx=el('mapcanvas').getContext('2d');ctx.clearRect(0,0,320,240);ctx.imageSmoothingEnabled=false;
    const tex=loadImage('map-source-'+mapState.region+'.png'),font=loadImage('map-font-source.png'),frame=loadImage('map-frame-source.png');
    if (!tex.complete || !font.complete || !frame.complete) return;
    const [x,y,w,h]=mapState.viewport;ctx.drawImage(tex,x,y,w,h,30,40,260,156);
    ctx.drawImage(frame,20,276,20,20,48,10,224,29);
    let label=mapLabel(currentLocation()).replace(/\s+/g,' ');if(label.length>28)label=label.slice(0,25)+'...';
    const offset=c=>',.'.includes(c)?-2:'!jli'.includes(c)?-1:c==='$'?1:0;
    const title=(mapState.region==='Valley'?'Valley':'Island')+(mapState.zoom?' / 2x':' / 1x');
    let titleWidth=8;for(let i=0;i<title.length-1;i++)titleWidth+=8+offset(title[i])+offset(title[i+1]);
    let titleX=Math.floor(160-titleWidth/2);
    for(let i=0;i<title.length;i++){
      const c=title[i],n=c.charCodeAt(0)-32;
      if(c!==' ')ctx.drawImage(font,n%16*8,Math.floor(n/16)*16,8,16,titleX,19-(/[A-Z]/.test(c)?3:0),8,16);
      if(i+1<title.length)titleX+=8+offset(c)+offset(title[i+1]);
    }
    let textWidth=8;for(let i=0;i<label.length-1;i++)textWidth+=8+offset(label[i])+offset(label[i+1]);
    const bw=Math.min(252,textWidth+12),bx=Math.floor(160-bw/2),by=170,bh=23,corner=3;
    for(let row=0;row<3;row++)for(let col=0;col<3;col++){
      const dx=bx+(col===0?0:col===1?corner:bw-corner),dy=by+(row===0?0:row===1?corner:bh-corner);
      ctx.drawImage(frame,col*20,256+row*20,20,20,dx,dy,col===1?bw-2*corner:corner,row===1?bh-2*corner:corner);
    }
    let tx=Math.floor(160-textWidth/2);
    for(let i=0;i<label.length;i++){
      let c=label[i];if(c.charCodeAt(0)<32 || c.charCodeAt(0)>126)c='?';const n=c.charCodeAt(0)-32;
      if(c!==' ')ctx.drawImage(font,n%16*8,Math.floor(n/16)*16,8,16,tx,177-1-(/[A-Z]/.test(c)?3:0),8,16);
      if(i+1<label.length)tx+=8+offset(c)+offset(label[i+1]);
    }
  }
  function updateMap() {
    const p=currentLocation(),locations=visibleLocations();
    el('title').textContent='Map / '+mapState.region+(mapState.zoom?' zoomed':' overview');
    notice(mapState.region+' | '+(mapState.zoom?'2x: visible locations only':'1x: all eligible locations')+' | '+(mapState.index%Math.max(1,locations.length)+1)+'/'+locations.length+' | '+mapLabel(p)+' | X/+ in, Y/- out, SELECT/tap title region, A/tap next; arrows pan while zoomed. Conditional game queries remain excluded; unknown names stay ???.');
    renderMap();
  }
  function mapNext() { if(mapState){mapState.index++;updateMap();} }
  function toggleZoom() {
    if(!mapState)return;
    if(mapState.zoom){mapState.zoom=false;mapState.viewport=[0,0,300,180];}
    else {
      const p=currentLocation(),r=p?p.pixelArea:{X:150,Y:90,Width:0,Height:0};
      mapState.zoom=true;mapState.viewport=[Math.max(0,Math.min(150,r.X+r.Width/2-75)),Math.max(0,Math.min(90,r.Y+r.Height/2-45)),150,90];
    }
    mapState.index=0;updateMap();
  }
  function pan(dx,dy) {
    if(!mapState || !mapState.zoom)return;
    mapState.viewport[0]=Math.max(0,Math.min(150,mapState.viewport[0]+dx));
    mapState.viewport[1]=Math.max(0,Math.min(90,mapState.viewport[1]+dy));mapState.index=0;updateMap();
  }
  function switchRegion() {
    if(!mapState)return;
    if(mapState.region==='Valley' && !islandAccess){show('map-island-locked');return;}
    show(mapState.region==='Valley'?'map-island':'05-map');
  }
  function secondary() {
    if(mapState){if(!mapState.zoom)toggleZoom();return;}
    const bundle=data.bundleViews.indexOf(current);
    if(bundle>=0){show(data.bundleViews[(bundle+1)%data.bundleViews.length]);return;}
    if(data.secondary[current])open(data.secondary[current]);else notice('Context action is mapped; its remaining state needs a mockup.');
  }
  function tertiary() {
    if(mapState){if(mapState.zoom)toggleZoom();return;}
    if(current==='01-items' || current.startsWith('backpack') || current.startsWith('inventory-trash-')){trashOrigin=current;open('trash');}
  }
  function act() { if(mapState)mapNext();else if(current.startsWith('trash-confirm'))notice('Design confirmation only: no item is discarded.');else if(data.primary[current])open(data.primary[current]);else notice('Selected action is mapped in the page catalog; this image is a design view.'); }
  function hit(x, y) {
    const layout=images.get(current).layout || data.layout;
    const navY=layout.nav==='bottom'?206:12;
    if (x >= 8 && x < 32 && y >= navY && y < navY+24) { cycle(-1); return; }
    if (x >= 288 && x < 312 && y >= navY && y < navY+24) { cycle(1); return; }
    if (y >= 230-layout.tabSize && y < 234) {
      const tool = data.tools.indexOf(current) >= 0;
      const bank = tool ? data.tools : data.main;
      for (let i = 0; i < bank.length; i++) {
        const left = tool ? 42 + i * 84 : layout.tabX + i * layout.tabPitch;
        if (x >= left && x < left + (tool ? 78 : layout.tabWidth || layout.tabSize)) { show(bank[i]); return; }
      }
    }
    if(mapState){
      if(x>=48 && x<272 && y>=12 && y<40){switchRegion();return;}
      if(x>=11 && x<30 && y>=40 && y<86)secondary();
      else if(x>=290 && x<309 && y>=40 && y<86)tertiary();
      else if(x>=30 && x<290 && y>=40 && y<196)mapNext();
      return;
    }
    for (const [left, top, width, height, target] of data.hotspots[current] || []) {
      if (x >= left && y >= top && x < left + width && y < top + height) { if(target==='trash')trashOrigin=current;open(target);return; }
    }
    notice('This region is not an active hotspot in the design prototype. See the page map for remaining layouts.');
  }
  document.querySelectorAll('[data-image]').forEach(b => b.addEventListener('click', () => show(b.dataset.image)));
  el('screen').addEventListener('click', e => { const r = el('screen').getBoundingClientRect(); hit((e.clientX - r.left) * 320 / r.width, (e.clientY - r.top) * 240 / r.height); });
  el('back').onclick = back; el('action').onclick = act;
  el('secondary').onclick=secondary;el('tertiary').onclick=tertiary;
  el('previous').onclick = () => cycle(-1); el('next').onclick = () => cycle(1);
  document.addEventListener('keydown', e => { const key=e.key.toLowerCase();if(mapState && key==='s'){switchRegion();return;}if(mapState && mapState.zoom && key.startsWith('arrow')){pan(key==='arrowleft'?-10:key==='arrowright'?10:0,key==='arrowup'?-10:key==='arrowdown'?10:0);e.preventDefault();return;}if(key==='a')act();else if(key==='x')secondary();else if(key==='y')tertiary();else if(key==='b' || key==='escape')back();else if(key==='l' || key==='arrowleft')cycle(-1);else if(key==='r' || key==='arrowright')cycle(1);});
  window.menuDesignPreview = { show,open,back,act,hit,cycle,secondary,tertiary,switchRegion,pan,visibleLocations,view:()=>mapState,setIslandAccess:value=>{islandAccess=value;},current:()=>current };
  show(current);
})();
