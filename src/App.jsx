import { useState, useEffect, useRef, useCallback } from "react"

const GF='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Dancing+Script:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Italiana&family=Jost:wght@200;300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&family=IM+Fell+English:ital@0;1&display=swap'

const TEMPLATES=[
  {id:1,name:'Scarlet Royale',tagline:'Regal Romance, Reimagined',type:'wedding',price:1999,col:'#100004',file:'scarlet-royale.html'},
  {id:2,name:'Garden Romance',tagline:'Bloom Where Love Grows',type:'wedding',price:1499,col:'#FAF7F0',file:'garden-romance.html'},
  {id:3,name:'Ink & Press',tagline:'Bold. Stark. Unforgettable.',type:'wedding',price:999,col:'#FFFFFF',file:'ink-press.html'},
  {id:4,name:'Golden Hour',tagline:'When the Light Finds You',type:'engagement',price:1499,col:'#FFF4E0',file:'golden-hour.html'},
  {id:5,name:'Modern Vow',tagline:'Contemporary. Confident. Yours.',type:'engagement',price:999,col:'#F0F5F4',file:'modern-vow.html'},
  {id:6,name:'Velvet Noir',tagline:'Dark. Dreamy. Decadent.',type:'engagement',price:1799,col:'#0D0018',file:'velvet-noir.html'},
  {id:7,name:'Celestial',tagline:'Written in the Stars',type:'save_the_date',price:799,col:'#020918',file:'celestial.html'},
  {id:8,name:'Vintage Post',tagline:'Old World Charm, New Love',type:'save_the_date',price:699,col:'#FEF9ED',file:'vintage-post.html'},
  {id:9,name:'Pure Type',tagline:'Nothing But the Truth',type:'save_the_date',price:499,col:'#FAFAFA',file:'pure-type.html'},
  {id:11,name:'Azure Shores',tagline:'Where the Ocean Meets Forever',type:'wedding',price:0,col:'#1a4a5e',file:'azure-shores.html'},
  {id:10,name:'Upload Your Template',tagline:'Bring your own HTML design',type:'custom',price:499,col:'#F5F5F5',isUpload:true},
]
const TYPES=[{v:'all',l:'All'},{v:'wedding',l:'Wedding'},{v:'engagement',l:'Engagement'},{v:'save_the_date',l:'Save the Date'}]
const ICONS=['🔥','🌿','🎶','✨','💍','🌸','🌼','💫','⭐','🎊','🙏','🥂']
const RSVP_FIELDS_LIST=[{k:'fullName',l:'Full Name'},{k:'phone',l:'Phone / WhatsApp'},{k:'email',l:'Email'},{k:'attendance',l:'Attendance'},{k:'functions',l:'Functions Attending'},{k:'guests',l:'No. of Guests'},{k:'guestNames',l:'Guest Names'},{k:'dietary',l:'Dietary Preferences'},{k:'message',l:'Message for the couple'}]

const mkD=()=>({
  bride:'Ananya Sharma',groom:'Arjun Mehta',story:'We met at a rainy Mumbai evening — both reaching for the same umbrella.',hashtag:'#AnanyaWedArjun',
  familyMode:'both',
  brideParents:'Mr. Suresh & Mrs. Priya Sharma',brideGP:'Late Shri Ram Sharma & Smt. Savitri Devi',
  groomParents:'Mr. Ashok & Mrs. Kamini Mehta',groomGP:'Late Shri Gopal Mehta & Smt. Pushpa Devi',
  mainVenue:'Taj Mahal Palace',mainAddress:'Apollo Bunder, Colaba, Mumbai',mainMaps:'',
  ceremonies:[
    {id:1,enabled:true,name:'Mehendi',icon:'🌿',date:'2025-11-19',time:'16:00',venue:'Mehta Residence',address:'Bandra West, Mumbai',maps:''},
    {id:2,enabled:true,name:'Sangeet',icon:'🎶',date:'2025-11-20',time:'19:00',venue:'Taj Lands End',address:'Bandstand, Bandra, Mumbai',maps:''},
    {id:3,enabled:true,name:'Wedding',icon:'🔥',date:'2025-11-21',time:'20:30',venue:'Taj Mahal Palace',address:'Apollo Bunder, Colaba, Mumbai',maps:''},
    {id:4,enabled:true,name:'Reception',icon:'✨',date:'2025-11-22',time:'19:00',venue:'Taj Mahal Palace',address:'Apollo Bunder, Colaba, Mumbai',maps:''},
  ],
  rsvpEnabled:true,rsvpDeadline:'2025-11-01',
  rsvpFields:{fullName:true,phone:true,email:false,attendance:true,functions:true,guests:true,guestNames:false,dietary:false,message:true},
  welcome:'With hearts full of joy, we invite you to witness this beautiful union.',
  dressCode:'Ethnic Wear',contactName:'Ananya Sharma',contactPhone:'+91 98765 43210',
  customHTML:null,
})

// Helpers
const fD=(s)=>{try{return new Date(s+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}catch{return s||'TBD'}}
const fT=(s)=>{if(!s)return '';const[h,m]=s.split(':').map(Number);return `${h>12?h-12:h||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
const fns=(d)=>d.ceremonies.filter(c=>c.enabled)
const famLines=(d)=>{
  const m=d.familyMode
  const sp=(m==='parents'||m==='both'), sg=(m==='grandparents'||m==='both')
  return {sp,sg,bp:sp?d.brideParents:'',bg:sg?d.brideGP:'',gp:sp?d.groomParents:'',gg:sg?d.groomGP:''}
}

// Watermark — very light, just visible enough to indicate preview
const WM=`<svg style="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999"><defs><pattern id="wmpt" x="0" y="0" width="400" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><text x="0" y="55" font-size="11" fill="rgba(120,120,120,0.055)" font-family="Arial,sans-serif" font-weight="600" letter-spacing="4">PREVIEW · TEAL MEDIA WORKS · PREVIEW · TEAL MEDIA WORKS</text></pattern></defs><rect width="100%" height="100%" fill="url(#wmpt)"/></svg>`
const injectWM=(html)=>html.replace('</body>',WM+'</body>')

// Custom HTML placeholder replacement
const PLACEHOLDER_MAP=(d)=>{
  const active=fns(d),f=famLines(d)
  const cerHtml=active.map(c=>`<div class="cer-item"><div class="cer-name">${c.icon} ${c.name}</div><div class="cer-date">${fD(c.date)} · ${fT(c.time)}</div><div class="cer-venue">${c.venue}, ${c.address}</div>${c.maps?`<a href="${c.maps}" class="cer-map">📍 View Map</a>`:''}</div>`).join('\n')
  const rsvpHtml=d.rsvpEnabled?`<div class="rsvp-section"><h3>RSVP</h3>${d.rsvpDeadline?`<p>Confirm by ${fD(d.rsvpDeadline)}</p>`:''}<form class="rsvp-form">${RSVP_FIELDS_LIST.filter(f=>d.rsvpFields[f.k]).map(f=>`<input type="text" placeholder="${f.l}" />`).join('')}<button type="button" onclick="this.parentElement.style.display='none';document.getElementById('rsvp-thanks').style.display='block'">Confirm Attendance</button><div id="rsvp-thanks" style="display:none">🌸 We cannot wait to celebrate with you!</div></form></div>`:''
  return {
    '{{BRIDE}}':d.bride,'{{GROOM}}':d.groom,
    '{{BRIDE_FIRST}}':d.bride.split(' ')[0],'{{GROOM_FIRST}}':d.groom.split(' ')[0],
    '{{DATE}}':fD(active.find(c=>c.name==='Wedding')?.date||active[0]?.date||d.ceremonies[0]?.date||''),
    '{{TIME}}':fT(active.find(c=>c.name==='Wedding')?.time||active[0]?.time||''),
    '{{VENUE}}':d.mainVenue,'{{ADDRESS}}':d.mainAddress,'{{MAPS_LINK}}':d.mainMaps||'#',
    '{{BRIDE_PARENTS}}':f.bp,'{{GROOM_PARENTS}}':f.gp,
    '{{BRIDE_GP}}':f.bg,'{{GROOM_GP}}':f.gg,
    '{{WELCOME}}':d.welcome,'{{HASHTAG}}':d.hashtag||'','{{STORY}}':d.story||'',
    '{{DRESS_CODE}}':d.dressCode||'','{{CONTACT_NAME}}':d.contactName||'','{{CONTACT_PHONE}}':d.contactPhone||'',
    '{{CEREMONIES}}':cerHtml,'{{RSVP}}':rsvpHtml,
  }
}
function applyPlaceholders(html,d){
  const map=PLACEHOLDER_MAP(d)
  return Object.entries(map).reduce((h,[k,v])=>h.replaceAll(k,v||''),html)
}

// RSVP form HTML for generator use
const rsvpFormHTML=(d,fgColor,accColor,bgInput)=>{
  if(!d.rsvpEnabled)return ''
  const fields=RSVP_FIELDS_LIST.filter(f=>d.rsvpFields[f.k])
  const active=fns(d)
  const ist=`style="width:100%;background:${bgInput};border:none;border-bottom:1px solid ${accColor}55;color:${fgColor};font-size:14px;padding:10px 3px;margin-bottom:12px;outline:none;display:block;font-family:inherit"`
  const rows=fields.map(f=>{
    if(f.k==='attendance')return `<select ${ist}><option value="">Will you attend?</option><option>Yes, with pleasure!</option><option>Regretfully declining</option></select>`
    if(f.k==='functions')return `<select ${ist}><option value="">Which ceremonies?</option>${active.map(c=>`<option>${c.name}</option>`).join('')}<option>All of them!</option></select>`
    if(f.k==='message')return `<textarea ${ist.replace('display:block','display:block;resize:none')} rows="3" placeholder="${f.l}"></textarea>`
    return `<input type="${f.k==='email'?'email':f.k==='phone'?'tel':'text'}" placeholder="${f.l}" ${ist}/>`
  }).join('')
  return `<div style="max-width:440px;margin:0 auto;text-align:left">${rows}<button onclick="this.style.display='none';document.getElementById('rsvp-ok').style.display='block'" style="width:100%;padding:13px;background:transparent;border:1px solid ${accColor}66;color:${accColor};font-family:inherit;font-size:11px;letter-spacing:5px;text-transform:uppercase;cursor:pointer;margin-top:4px">Confirm Attendance</button><div id="rsvp-ok" style="display:none;font-size:18px;font-style:italic;color:${accColor};text-align:center;margin-top:12px">🌸 We cannot wait to celebrate with you!</div></div>`
}


// ────────────────────────────────────────────────────────────────────────────
// GENERATORS — each completely distinct visually
// ────────────────────────────────────────────────────────────────────────────
function genScarlet(d,dk=true){
  const bg=dk?'#100004':'#F8EEE8',fg=dk?'#FBF0E8':'#1A0A0A',fg2=dk?'rgba(251,240,232,0.55)':'rgba(26,10,10,0.5)',acc='#C9A84C',pri=dk?'#E8A0B0':'#8B2020',sec=dk?'rgba(180,220,210,1)':'#1A5C52'
  const fl=famLines(d),crs=fns(d)
  const cCards=crs.map(c=>`<div style="width:calc(100%/${crs.length});flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:14px 20px;box-sizing:border-box"><div style="max-width:400px;width:100%;padding:28px 24px;border:1px solid rgba(201,168,76,0.3);background:${dk?'rgba(60,0,15,0.82)':'rgba(255,242,235,0.88)'};position:relative"><div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${acc},transparent)"></div><div style="font-size:36px;margin-bottom:8px">${c.icon||'✦'}</div><div style="font-family:'Italiana',serif;font-size:38px;color:${fg};line-height:1">${c.name}</div><div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:4px;color:${acc};text-transform:uppercase;margin:8px 0">${fD(c.date)}</div><div style="font-size:14px;color:${fg2};font-style:italic">${fT(c.time)}</div><div style="margin-top:10px;padding-top:10px;border-top:1px solid ${acc}22"><div style="display:flex;align-items:flex-start;gap:5px"><span style="color:${acc};font-size:14px;flex-shrink:0">📍</span><div><div style="font-size:13px;font-weight:600;color:${fg};line-height:1.4">${c.venue||'Venue TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:2px;line-height:1.5">${c.address}</div>`:''}</div></div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="display:inline-block;margin-top:10px;font-size:9px;color:${acc};letter-spacing:3px;text-transform:uppercase;text-decoration:none;border:1px solid ${acc}44;padding:5px 10px">📍 Map</a>`:''}</div></div>`).join('')
  const famBlock=fl.familyMode!=='none'?`<div style="margin-top:12px">${fl.bp?`<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:${acc}88;text-transform:uppercase;margin-top:10px">Daughter of</div><div style="font-size:13px;color:${fg2};font-style:italic;line-height:1.7">${fl.bp}</div>`:''} ${fl.bg?`<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:${acc}77;text-transform:uppercase;margin-top:8px">Granddaughter of</div><div style="font-size:12px;color:${fg2};opacity:.8;font-style:italic;line-height:1.7">${fl.bg}</div>`:''}</div>`:''
  const famBlockG=fl.familyMode!=='none'?`<div style="margin-top:12px">${fl.gp?`<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:${acc}88;text-transform:uppercase;margin-top:10px">Son of</div><div style="font-size:13px;color:${fg2};font-style:italic;line-height:1.7">${fl.gp}</div>`:''} ${fl.gg?`<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:${acc}77;text-transform:uppercase;margin-top:8px">Grandson of</div><div style="font-size:12px;color:${fg2};opacity:.8;font-style:italic;line-height:1.7">${fl.gg}</div>`:''}</div>`:''
  const N=crs.length
  const CHS=['c0','c1','c2','c3',d.rsvpEnabled&&'c4','c5'].filter(Boolean)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:${bg};font-family:'Cormorant Garamond',serif;color:${fg}}canvas{position:fixed;inset:0;pointer-events:none;z-index:0}#wrap{position:fixed;inset:0;z-index:20;overflow:hidden}.ch{position:absolute;inset:0;display:none;align-items:center;justify-content:center}.ch.fi{animation:fi .9s ease forwards}.ch.fo{animation:fo .7s ease forwards}@keyframes fi{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}@keyframes fo{from{opacity:1}to{opacity:0;transform:scale(1.03)}}#dots{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:99;display:flex;flex-direction:column;gap:8px}.dot{width:5px;height:5px;border-radius:50%;background:${acc}33;border:none;cursor:pointer;transition:all .3s}.dot.on{background:${acc};height:18px;border-radius:3px}@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}@media(max-width:640px){#c1{flex-direction:column!important;overflow-y:auto!important;align-items:stretch!important}#c1 .sl{border-right:none!important;border-bottom:1px solid rgba(201,168,76,0.2)!important;padding:36px 22px 28px!important;flex:0 0 auto!important;min-height:0!important}#c1 .uc{width:100%!important;height:54px!important;flex-direction:row!important;border-left:none!important;border-right:none!important;border-top:1px solid rgba(201,168,76,0.2)!important;border-bottom:1px solid rgba(201,168,76,0.2)!important;padding:0 22px!important;flex:0 0 54px!important;flex-shrink:0!important}#c1 .ucl{display:none!important}#c1 .wv{writing-mode:horizontal-tb!important;letter-spacing:6px!important;font-size:17px!important;margin:0!important}#c1 .sr{padding:28px 22px 36px!important;flex:0 0 auto!important;min-height:0!important}#dots{right:8px!important}}</style></head><body>
<canvas id="pc"></canvas><div id="dots"></div>
<button id="nxt" onclick="go(cur+1)" style="position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99;background:transparent;border:1px solid ${acc}66;color:${acc};font-family:'Cinzel',serif;font-size:9px;letter-spacing:5px;padding:11px 26px;cursor:pointer;display:none;text-transform:uppercase;border-radius:100px;backdrop-filter:blur(8px);transition:all .3s">Continue ↓</button>
<div id="wrap">
<div class="ch" id="c0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;cursor:pointer" onclick="go(1)">
  <div style="position:relative;width:160px;height:160px;margin-bottom:20px"><div style="position:absolute;inset:0;border-radius:50%;border:1px solid ${acc}44;animation:breathe 4s ease-in-out infinite"></div><div style="position:absolute;inset:14px;border-radius:50%;border:1px solid ${acc}22;animation:breathe 4s ease-in-out infinite;animation-delay:1s"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 80 80" style="width:52px;height:52px;opacity:0.85"><text y="62" x="8" font-size="64" font-family="serif" fill="${acc}">ॐ</text></svg></div></div>
  <div style="font-family:'Italiana',serif;font-size:20px;letter-spacing:3px;color:${fg2};margin-bottom:6px">${d.bride} &nbsp;♡&nbsp; ${d.groom}</div>
  <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:7px;color:${acc}99;text-transform:uppercase;margin-bottom:12px">${fD(crs[0]?.date||'')?.split(',').slice(1).join(',').trim()}</div>
  <div style="font-style:italic;font-size:13px;color:${acc}66;animation:glow 2.5s ease-in-out infinite">Tap to begin</div>
</div>
<div class="ch" id="c1" style="flex-direction:row;align-items:stretch;overflow:hidden">
  <div class="sl" style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:50px 38px;background:${dk?'linear-gradient(135deg,rgba(20,2,8,.97),rgba(80,5,25,.3))':'linear-gradient(135deg,rgba(255,248,245,0.97),rgba(255,235,230,0.95))'};border-right:1px solid ${acc}22;overflow:hidden">
    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:6px;color:${acc}88;text-transform:uppercase;margin-bottom:10px">The Bride</div>
    <div style="font-family:'Italiana',serif;font-size:clamp(36px,6vw,72px);line-height:1;color:${pri}">${d.bride}</div>
    ${famBlock}
  </div>
  <div class="uc" style="width:70px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${dk?'rgba(5,2,5,.97)':'rgba(250,245,235,0.97)'};border-left:1px solid ${acc}22;border-right:1px solid ${acc}22;position:relative">
    <div class="ucl" style="position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(180deg,transparent,${acc}44 20%,${acc}44 80%,transparent)"></div>
    <div class="wv" style="writing-mode:vertical-rl;font-family:'Italiana',serif;font-size:20px;color:${acc};letter-spacing:4px">weds</div>
  </div>
  <div class="sr" style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:50px 38px;background:${dk?'linear-gradient(225deg,rgba(2,10,12,.97),rgba(5,25,20,.3))':'linear-gradient(225deg,rgba(240,252,250,0.97),rgba(235,250,248,0.95))'};overflow:hidden">
    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:6px;color:${acc}88;text-transform:uppercase;margin-bottom:10px">The Groom</div>
    <div style="font-family:'Italiana',serif;font-size:clamp(36px,6vw,72px);line-height:1;color:${sec}">${d.groom}</div>
    ${famBlockG}
  </div>
</div>
<div class="ch" id="c2" style="flex-direction:column;text-align:center;align-items:center">
  <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:8px;color:${acc}88;text-transform:uppercase;margin-bottom:14px">Save the Date</div>
  <div style="font-family:'Italiana',serif;font-size:clamp(44px,10vw,116px);line-height:.88;background:linear-gradient(180deg,${fg},${acc});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')}</div>
  <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:6px;color:${fg2};margin-top:8px;text-transform:uppercase">2025 · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
  ${d.mainMaps?`<a href="${d.mainMaps}" target="_blank" style="margin-top:14px;display:inline-block;font-size:9px;color:${acc};letter-spacing:4px;text-transform:uppercase;text-decoration:none;border:1px solid ${acc}44;padding:7px 14px">📍 ${d.mainVenue}</a>`:''} 
  ${d.welcome?`<div style="font-size:14px;font-style:italic;color:${fg2};max-width:420px;margin:16px auto 0;line-height:1.9">${d.welcome}</div>`:''}
</div>
<div class="ch" id="c3" style="flex-direction:column;overflow:hidden;position:relative">
  <div style="text-align:center;padding:22px 20px 10px;flex-shrink:0"><div style="font-family:'Italiana',serif;font-size:32px;color:${fg}">The Celebrations</div><div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px"><span style="font-size:14px;color:${acc}66">&#8592;</span><span style="font-size:8px;letter-spacing:4px;color:${acc}77;font-family:'Cinzel',serif;text-transform:uppercase">Tap arrows or swipe</span><span style="font-size:14px;color:${acc}66">&#8594;</span></div></div>
  <div style="flex:1;overflow:hidden;position:relative">

    <div id="ct" style="display:flex;width:${N*100}%;height:100%;transition:transform .7s cubic-bezier(.77,0,.175,1)">${cCards}</div>

  </div>
  <div id="cDots" style="display:flex;gap:10px;justify-content:center;align-items:center;padding:10px 0 18px;flex-shrink:0"></div>
  <!-- Arrow buttons at chapter level — not inside overflow:hidden -->
  <button onclick="mC(-1)" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);z-index:30;background:${dk?'rgba(180,80,20,0.22)':'rgba(180,80,20,0.1)'};border:2px solid ${acc};color:${acc};font-size:22px;width:52px;height:52px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.35);transition:background .2s" onmouseover="this.style.background='${dk?'rgba(201,168,76,0.35)':'rgba(201,168,76,0.25)'}'" onmouseout="this.style.background='${dk?'rgba(180,80,20,0.22)':'rgba(180,80,20,0.1)'}'">&#8592;</button>
  <button onclick="mC(1)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);z-index:30;background:${dk?'rgba(180,80,20,0.22)':'rgba(180,80,20,0.1)'};border:2px solid ${acc};color:${acc};font-size:22px;width:52px;height:52px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.35);transition:background .2s" onmouseover="this.style.background='${dk?'rgba(201,168,76,0.35)':'rgba(201,168,76,0.25)'}'" onmouseout="this.style.background='${dk?'rgba(180,80,20,0.22)':'rgba(180,80,20,0.1)'}'">&#8594;</button>
</div>
${d.rsvpEnabled?`<div class="ch" id="c4" style="flex-direction:column;align-items:center;justify-content:center;overflow-y:auto"><div style="max-width:460px;width:100%;padding:36px 24px;text-align:center"><div style="font-family:'Italiana',serif;font-size:clamp(44px,9vw,86px);line-height:.9;background:linear-gradient(180deg,${fg},${acc});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:14px">R.S.V.P.</div>${d.rsvpDeadline?`<div style="font-size:13px;font-style:italic;color:${fg2};margin-bottom:18px">Kindly confirm by <em style="color:${acc}cc">${fD(d.rsvpDeadline)}</em></div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)')}</div></div>`:''}
<div class="ch" id="c5" style="flex-direction:column;text-align:center;align-items:center">
  <div style="font-family:'Italiana',serif;font-size:clamp(38px,8vw,82px);line-height:1;color:${pri}">${d.bride.split(' ')[0]}</div>
  <div style="font-family:'Cinzel',serif;font-size:clamp(18px,3vw,26px);color:${acc};letter-spacing:6px;margin:4px 0">♡</div>
  <div style="font-family:'Italiana',serif;font-size:clamp(38px,8vw,82px);line-height:1;color:${sec}">${d.groom.split(' ')[0]}</div>
  <div style="width:48px;height:1px;background:${acc};margin:18px auto"></div>
  ${d.story?`<div style="font-size:15px;font-style:italic;color:${fg2};max-width:420px;line-height:1.9">${d.story}</div>`:''}
  ${d.hashtag?`<div style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:4px;color:${acc}88;margin-top:12px;text-transform:uppercase">${d.hashtag}</div>`:''}
  ${d.dressCode?`<div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:4px;color:${fg2};margin-top:14px;text-transform:uppercase">Dress Code: ${d.dressCode}</div>`:''}
  ${d.contactPhone?`<div style="font-size:12px;color:${acc}88;margin-top:6px">${d.contactName} · ${d.contactPhone}</div>`:''}
</div>
</div>
<script>
const CHS=${JSON.stringify(CHS)};let cur=0,busy=false;
function go(n){if(n<0||n>=CHS.length||n===cur||busy)return;busy=true;
  const f=document.getElementById(CHS[cur]),t=document.getElementById(CHS[n]);
  if(!f||!t){busy=false;return;}
  f.style.transition='opacity 0.5s ease';f.style.opacity='0';
  setTimeout(()=>{try{
    f.style.transition='';f.style.display='none';f.style.opacity='1';
    t.style.display='flex';
    t.style.opacity='0';void t.offsetWidth;
    t.style.transition='opacity 0.8s ease';t.style.opacity='1';
    cur=n;bDots();uNxt();
  }catch(e){console.warn(e);}finally{busy=false;}},520);}
function uNxt(){const e=document.getElementById('nxt');if(e)e.style.display=cur>0&&cur<CHS.length-1?'block':'none';}
function bDots(){const el=document.getElementById('dots');if(!el)return;el.innerHTML='';CHS.forEach((_,i)=>{const b=document.createElement('button');b.className='dot'+(i===cur?' on':'');b.onclick=()=>go(i);el.appendChild(b);});}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(cur+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(cur-1);});
let tx=0;document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});document.addEventListener('touchend',e=>{if(CHS[cur]==='c3')return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>55)(dx<0?go(cur+1):go(cur-1));},{passive:true});const carEl=document.getElementById('c3');if(carEl){let ctx=0;carEl.addEventListener('touchstart',e=>{ctx=e.touches[0].clientX;},{passive:true});carEl.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-ctx;if(Math.abs(dx)>40)sC(ci+(dx<0?1:-1));},{passive:true});}
const CV=${N};let ci=0;function sC(i){ci=Math.max(0,Math.min(CV-1,i));document.getElementById('ct').style.transform='translateX(calc(-'+ci+' * (100%/'+CV+')))';bCDots();}
function mC(d){sC(ci+d);}
function bCDots(){const el=document.getElementById('cDots');if(!el)return;el.innerHTML='';for(let i=0;i<CV;i++){const b=document.createElement('button');b.style.cssText='width:'+(i===ci?'20':'7')+'px;height:7px;border-radius:100px;background:'+(i===ci?'${acc}':'${acc}44')+';cursor:pointer;border:none;transition:all .35px;padding:0';b.onclick=()=>sC(i);el.appendChild(b);}}
const pc=document.getElementById('pc'),cx=pc.getContext('2d');function rs(){pc.width=innerWidth;pc.height=innerHeight;}rs();window.addEventListener('resize',rs);
const pts=Array.from({length:18},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight+innerHeight,vx:(Math.random()-.5)*.3,vy:-(0.2+Math.random()*.5),sz:4+Math.random()*7,life:0,ml:250+Math.random()*350}));
function loop(){cx.clearRect(0,0,pc.width,pc.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life++;const pr=p.life/p.ml;const a=pr<.1?pr*10*.3:pr>.7?.3*(1-(pr-.7)/.3):.3;if(p.life>p.ml){p.x=Math.random()*pc.width;p.y=pc.height+20;p.life=0;}cx.save();cx.globalAlpha=a;cx.fillStyle='rgba(201,168,76,'+a+')';cx.font=p.sz+'px serif';cx.fillText('✦',p.x,p.y);cx.restore();});requestAnimationFrame(loop);}
bDots();uNxt();sC(0);loop();
</script></body></html>`
}


function genGarden(d,dk=false){
  const bg=dk?'#1A1208':'#FAF7F0',fg=dk?'#F5EDE0':'#1A1208',fg2=dk?'rgba(245,237,224,0.6)':'rgba(26,18,8,0.55)',acc=dk?'#C9A84C':'#8B7355',pri=dk?'#E8C0A0':'#7A6042',sec=dk?'#90C090':'#4A7A4A'
  const fl=famLines(d),crs=fns(d)
  const stem=`<svg viewBox="0 0 60 500" style="width:52px;height:100%;opacity:${dk?'.3':'.4'}" preserveAspectRatio="xMidYMid meet"><line x1="30" y1="0" x2="30" y2="500" stroke="${acc}" stroke-width=".8"/><g fill="none" stroke="${acc}" stroke-width=".9"><ellipse cx="30" cy="70" rx="14" ry="7" transform="rotate(-30,30,70)" fill="${acc}22"/><ellipse cx="30" cy="70" rx="14" ry="7" transform="rotate(30,30,70)" fill="${acc}22"/><circle cx="30" cy="70" r="3" fill="${acc}66" stroke="none"/><ellipse cx="30" cy="160" rx="16" ry="8" transform="rotate(-45,30,160)" fill="${pri}22"/><ellipse cx="30" cy="160" rx="16" ry="8" transform="rotate(45,30,160)" fill="${pri}22"/><circle cx="30" cy="160" r="3.5" fill="${pri}55" stroke="none"/><ellipse cx="30" cy="260" rx="13" ry="7" transform="rotate(-20,30,260)" fill="${sec}22"/><ellipse cx="30" cy="260" rx="13" ry="7" transform="rotate(20,30,260)" fill="${sec}22"/><circle cx="30" cy="260" r="3" fill="${sec}55" stroke="none"/><ellipse cx="30" cy="360" rx="15" ry="8" transform="rotate(-38,30,360)" fill="${acc}22"/><ellipse cx="30" cy="360" rx="15" ry="8" transform="rotate(38,30,360)" fill="${acc}22"/><circle cx="30" cy="360" r="3" fill="${acc}55" stroke="none"/><ellipse cx="30" cy="450" rx="12" ry="6" transform="rotate(-50,30,450)" fill="${pri}22"/><ellipse cx="30" cy="450" rx="12" ry="6" transform="rotate(50,30,450)" fill="${pri}22"/><circle cx="30" cy="450" r="2.5" fill="${pri}44" stroke="none"/></g></svg>`
  const cCards=crs.map(c=>`<div class="rv" style="padding:18px 20px;margin-bottom:10px;background:${dk?'rgba(255,255,255,.06)':'rgba(255,255,255,.75)'};border:1px solid ${acc}33;border-top:2px solid ${acc}"><div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${pri},${acc},${sec})"></div><div style="font-family:'Dancing Script',cursive;font-size:22px;color:${pri}">${c.icon||'✦'} ${c.name}</div><div style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:2px;color:${acc};text-transform:uppercase;margin:4px 0 8px;font-weight:400">${fD(c.date)} · ${fT(c.time)}</div><div style="margin-top:8px;padding-top:8px;border-top:1px solid ${acc}22;display:flex;align-items:flex-start;gap:5px"><span style="color:${acc};font-size:12px;flex-shrink:0">📍</span><div><div style="font-size:13px;color:${fg};font-weight:500">${c.venue||'Venue TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:1px">${c.address}</div>`:''}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;margin-top:6px;display:inline-block;border-bottom:1px solid ${acc}44">📍 Map</a>`:''}</div>`).join('')
  const famSection=fl.familyMode!=='none'?`<section style="padding:72px 80px;max-width:920px;margin:0 auto;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;overflow:hidden">${stem}</div><div style="position:absolute;right:0;top:0;bottom:0;overflow:hidden;transform:scaleX(-1)">${stem}</div><div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:7px;color:${acc};text-transform:uppercase;margin-bottom:10px;opacity:.75">The Families</div><div class="rv" style="font-family:'Dancing Script',cursive;font-size:38px;color:${pri};margin-bottom:22px">Two Families, One Joy</div><div style="display:grid;grid-template-columns:1fr 40px 1fr;gap:0 16px;align-items:start"><div class="rv">${fl.bp?`<div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}88;text-transform:uppercase;margin-bottom:6px">Daughter of</div><div style="font-family:'Dancing Script',cursive;font-size:22px;color:${pri};margin-bottom:4px">${d.bride}</div><div style="font-size:13px;color:${fg2};font-style:italic;line-height:1.7">${fl.bp}</div>`:''} ${fl.bg?`<div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}77;text-transform:uppercase;margin-top:8px;margin-bottom:4px">Granddaughter of</div><div style="font-size:12px;color:${fg2};font-style:italic;line-height:1.7;opacity:.8">${fl.bg}</div>`:''}</div><div style="width:1px;background:linear-gradient(180deg,transparent,${acc}44,${acc}66,${acc}44,transparent);margin-top:16px"></div><div class="rv">${fl.gp?`<div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}88;text-transform:uppercase;margin-bottom:6px">Son of</div><div style="font-family:'Dancing Script',cursive;font-size:22px;color:${sec};margin-bottom:4px">${d.groom}</div><div style="font-size:13px;color:${fg2};font-style:italic;line-height:1.7">${fl.gp}</div>`:''} ${fl.gg?`<div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}77;text-transform:uppercase;margin-top:8px;margin-bottom:4px">Grandson of</div><div style="font-size:12px;color:${fg2};font-style:italic;line-height:1.7;opacity:.8">${fl.gg}</div>`:''}</div></div></section>`:'';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${bg};color:${fg};font-family:'Playfair Display',serif;line-height:1.7}.rv{opacity:0;transform:translateY(22px);transition:opacity .85s ease,transform .85s ease}.rv.vis{opacity:1;transform:none}section{padding:72px 80px;max-width:920px;margin:0 auto;position:relative}</style></head><body>
<section style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 80px;position:relative">
  <div style="position:absolute;left:0;top:0;bottom:0;overflow:hidden">${stem}</div>
  <div style="position:absolute;right:0;top:0;bottom:0;overflow:hidden;transform:scaleX(-1)">${stem}</div>
  <div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:8px;color:${acc};text-transform:uppercase;margin-bottom:18px;opacity:.8">A Wedding Invitation</div>
  <div class="rv" style="font-family:'Dancing Script',cursive;font-size:clamp(50px,12vw,108px);line-height:1;color:${pri}">${d.bride}</div>
  <div class="rv" style="font-family:'Playfair Display',serif;font-size:clamp(20px,3.5vw,32px);color:${acc};margin:2px 0">&amp;</div>
  <div class="rv" style="font-family:'Dancing Script',cursive;font-size:clamp(50px,12vw,108px);line-height:1;color:${sec}">${d.groom}</div>
  <div class="rv" style="display:flex;align-items:center;gap:12px;margin:16px 0;justify-content:center"><div style="flex:1;max-width:80px;height:1px;background:linear-gradient(90deg,transparent,${acc}55)"></div><span style="color:${acc};font-size:13px">✦ ${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'').replace(/,\s*\d{4}$/,'')} ✦</span><div style="flex:1;max-width:80px;height:1px;background:linear-gradient(90deg,${acc}55,transparent)"></div></div>
  <div class="rv" style="font-family:'Jost',sans-serif;font-size:11px;letter-spacing:4px;color:${fg2};text-transform:uppercase">${d.mainAddress.split(',').pop()?.trim()||''}</div>
  ${d.welcome?`<div class="rv" style="max-width:420px;font-size:15px;font-style:italic;color:${fg2};line-height:1.9;margin-top:16px">${d.welcome}</div>`:''}
  <div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:3px;color:${fg2};text-transform:uppercase;margin-top:24px;opacity:.6">↓ Scroll to explore</div>
</section>
${famSection}
<section style="background:${dk?'rgba(255,255,255,0.02)':'rgba(200,170,120,0.05)'};padding:72px 80px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;overflow:hidden">${stem}</div><div style="position:absolute;right:0;top:0;bottom:0;overflow:hidden;transform:scaleX(-1)">${stem}</div><div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:7px;color:${acc};text-transform:uppercase;margin-bottom:10px;opacity:.75">Our Celebrations</div><div class="rv" style="font-family:'Dancing Script',cursive;font-size:38px;color:${pri};margin-bottom:22px">The Ceremonies</div><div style="max-width:760px;margin:0 auto">${cCards}</div></section>
${d.rsvpEnabled?`<section style="text-align:center;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;overflow:hidden">${stem}</div><div style="position:absolute;right:0;top:0;bottom:0;overflow:hidden;transform:scaleX(-1)">${stem}</div><div class="rv" style="font-family:'Dancing Script',cursive;font-size:38px;color:${pri};margin-bottom:6px">Will You Join Us?</div>${d.rsvpDeadline?`<div class="rv" style="font-size:14px;font-style:italic;color:${fg2};margin-bottom:20px">Confirm by <em style="color:${acc}">${fD(d.rsvpDeadline)}</em></div>`:''}${rsvpFormHTML(d,fg,acc,dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)')}</section>`:''}
<section style="text-align:center;padding-bottom:100px;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;overflow:hidden">${stem}</div><div style="position:absolute;right:0;top:0;bottom:0;overflow:hidden;transform:scaleX(-1)">${stem}</div><div class="rv" style="font-family:'Dancing Script',cursive;font-size:clamp(40px,9vw,80px);line-height:1.15;color:${pri}">${d.bride.split(' ')[0]}</div><div class="rv" style="font-size:28px;color:${acc};margin:4px 0">♡</div><div class="rv" style="font-family:'Dancing Script',cursive;font-size:clamp(40px,9vw,80px);line-height:1.15;color:${sec}">${d.groom.split(' ')[0]}</div>${d.story?`<div class="rv" style="max-width:400px;margin:16px auto;font-size:15px;font-style:italic;color:${fg2};line-height:1.9">${d.story}</div>`:''} ${d.hashtag?`<div class="rv" style="font-family:'Dancing Script',cursive;font-size:24px;color:${acc}88;margin-top:8px">${d.hashtag}</div>`:''} ${d.dressCode?`<div class="rv" style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:4px;color:${fg2};text-transform:uppercase;margin-top:12px">Dress Code · ${d.dressCode}</div>`:''} ${d.contactPhone?`<div class="rv" style="font-size:12px;color:${acc}88;margin-top:6px">${d.contactName} · ${d.contactPhone}</div>`:''}</section>
<script>const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target);}});},{threshold:.1});document.querySelectorAll('.rv').forEach(el=>io.observe(el));</script></body></html>`
}

function genInkPress(d,dk=false){
  const bg=dk?'#0A0906':'#FFFFFF',fg=dk?'#F2EFE8':'#0A0906',fg2=dk?'rgba(242,239,232,0.5)':'rgba(10,9,6,0.45)',acc='#B84520'
  const fl=famLines(d),crs=fns(d)
  const CHS=['i0','i1','i2',d.rsvpEnabled&&'i3','i4'].filter(Boolean)
  const evRows=crs.map((c,i)=>`<div style="display:flex;align-items:baseline;gap:20px;padding:12px 0;border-bottom:1px solid ${fg}10;flex-wrap:wrap"><div style="font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:${acc};min-width:20px;opacity:.6">${String(i+1).padStart(2,'0')}</div><div style="font-size:18px;flex-shrink:0">${c.icon||'✦'}</div><div style="flex:1;min-width:100px"><div style="font-family:'Syne',sans-serif;font-size:clamp(15px,2.2vw,20px);font-weight:700;letter-spacing:.5px;color:${fg}">${c.name.toUpperCase()}</div><div style="display:flex;align-items:flex-start;gap:4px;margin-top:3px"><span style="color:${acc};font-size:11px;flex-shrink:0">📍</span><div><div style="font-size:12px;color:${fg2}">${c.venue||'TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};opacity:.7">${c.address}</div>`:''}</div></div></div><div style="text-align:right;flex-shrink:0;font-family:'DM Sans',sans-serif"><div style="font-size:12px;font-weight:500;color:${fg2}">${fD(c.date).replace(/\w+,\s*/,'').replace(/,\s*\d{4}$/,'').toUpperCase()}</div><div style="font-size:11px;color:${fg2};opacity:.7">${fT(c.time)}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44;white-space:nowrap">Map →</a>`:''}</div>`).join('')
  const famCols=fl.familyMode!=='none'?`<div style="display:flex;gap:0;border:1px solid ${fg}10"><div style="flex:1;padding:22px;border-right:1px solid ${fg}10"><div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:4px;color:${acc};text-transform:uppercase;margin-bottom:8px">Bride</div><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:${acc};margin-bottom:6px">${d.bride}</div>${fl.bp?`<div style="font-size:12px;color:${fg2};line-height:1.7;font-weight:300">${fl.bp}</div>`:''} ${fl.bg?`<div style="font-size:11px;color:${fg2};opacity:.7;margin-top:4px;line-height:1.6">${fl.bg}</div>`:''}</div><div style="flex:1;padding:22px"><div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:4px;color:${acc};text-transform:uppercase;margin-bottom:8px">Groom</div><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:${fg}55;margin-bottom:6px">${d.groom}</div>${fl.gp?`<div style="font-size:12px;color:${fg2};line-height:1.7;font-weight:300">${fl.gp}</div>`:''} ${fl.gg?`<div style="font-size:11px;color:${fg2};opacity:.7;margin-top:4px;line-height:1.6">${fl.gg}</div>`:''}</div></div>`:'';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:${bg};font-family:'DM Sans',sans-serif;color:${fg}}#prog{position:fixed;top:0;left:0;height:2px;background:${acc};z-index:99;transition:width .4s ease}#wrap{position:fixed;inset:0;overflow:hidden}.ch{position:absolute;inset:0;display:none;overflow:hidden}.ch.fi{animation:fi .8s ease forwards}.ch.fo{animation:fo .6s ease forwards}@keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes fo{from{opacity:1}to{opacity:0;transform:translateY(-14px)}}#pnav{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:99;display:flex;gap:5px;background:${dk?'rgba(10,9,6,.85)':'rgba(255,255,255,.9)'};padding:8px 14px;border-radius:100px;border:1px solid ${fg}12;backdrop-filter:blur(8px)}.pnd{width:22px;height:3px;border-radius:2px;background:${fg}18;cursor:pointer;border:none;transition:all .3s}.pnd.on{background:${acc};width:34px}select option{background:${dk?'#111':'#fff'};color:${fg}}</style></head><body>
<div id="prog"></div><div id="pnav"></div>
<button id="nxt" onclick="go(cur+1)" style="position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99;background:transparent;border:1px solid ${acc}66;color:${acc};font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:4px;padding:10px 24px;cursor:pointer;display:none;text-transform:uppercase;border-radius:100px;transition:all .3s">Next →</button>
<div id="wrap">
<div class="ch" id="i0" style="display:flex" style="align-items:flex-start;justify-content:center;padding:clamp(32px,6vw,70px)">
  <div style="width:100%"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:6px;text-transform:uppercase;color:${acc};margin-bottom:18px;opacity:.8">— The Wedding of</div>
  <div style="font-family:'Syne',sans-serif;font-size:clamp(48px,10vw,128px);font-weight:800;line-height:.88;letter-spacing:-2px;color:${fg};max-width:80vw">${d.bride.split(' ')[0].toUpperCase()}</div>
  <div style="width:clamp(40px,7vw,80px);height:3px;background:${acc};margin:12px 0"></div>
  <div style="font-family:'Syne',sans-serif;font-size:clamp(48px,10vw,128px);font-weight:800;line-height:.88;letter-spacing:-2px;color:${fg}22;max-width:80vw">${d.groom.split(' ')[0].toUpperCase()}</div>
  <div style="margin-top:26px;display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div style="font-size:12px;letter-spacing:3px;color:${fg2};text-transform:uppercase">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')}</div><div style="width:28px;height:1px;background:${fg}22"></div><div style="font-size:12px;letter-spacing:3px;color:${fg2};text-transform:uppercase">${d.mainAddress.split(',').pop()?.trim()||''}</div></div>
  ${d.welcome?`<div style="margin-top:16px;max-width:400px;font-size:14px;color:${fg2};line-height:1.8;font-style:italic">${d.welcome}</div>`:''}
  <button onclick="go(1)" style="margin-top:20px;padding:10px 22px;background:transparent;border:1px solid ${fg}22;color:${fg2};font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;cursor:pointer;transition:all .3s" onmouseover="this.style.borderColor='${acc}';this.style.color='${acc}'" onmouseout="this.style.borderColor='${fg}22';this.style.color='${fg2}'">Begin →</button>
  <div style="position:absolute;bottom:30px;right:clamp(20px,5vw,60px);font-family:'Syne',sans-serif;font-size:clamp(28px,7vw,76px);font-weight:800;color:${acc}07;line-height:1;pointer-events:none;user-select:none">2025</div></div>
</div>
<div class="ch" id="i1" style="flex-direction:column;padding:clamp(28px,5vw,60px);overflow:hidden">
  <div style="width:100%;max-width:680px">
    <div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:18px">The Families</div>
    ${famCols}
    ${d.welcome&&fl.familyMode==='none'?`<div style="margin-top:18px;font-size:14px;color:${fg2};line-height:1.8;font-style:italic">${d.welcome}</div>`:''}
  </div>
</div>
<div class="ch" id="i2" style="flex-direction:column;overflow:hidden">
  <div style="padding:clamp(22px,4vw,44px) clamp(24px,5vw,60px) 14px;flex-shrink:0;border-bottom:1px solid ${fg}10">
    <div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:6px">Programme</div>
    <div style="font-family:'Syne',sans-serif;font-size:clamp(22px,4vw,36px);font-weight:700;color:${fg}">The Celebrations</div>
  </div>
  <div style="flex:1;overflow-y:auto;padding:0 clamp(24px,5vw,60px)">${evRows}</div>
  ${d.mainMaps?`<div style="padding:0 clamp(24px,5vw,60px) 14px"><a href="${d.mainMaps}" target="_blank" style="font-size:11px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 ${d.mainVenue} — View on Maps</a></div>`:''}
</div>
${d.rsvpEnabled?`<div class="ch" id="i3" style="align-items:center;justify-content:center;overflow-y:auto"><div style="max-width:500px;width:100%;padding:clamp(24px,5vw,50px)"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:10px">RSVP</div><div style="font-family:'Syne',sans-serif;font-size:clamp(30px,6vw,52px);font-weight:700;color:${fg};line-height:1;margin-bottom:6px">Will You<br/>Join Us?</div><div style="width:44px;height:2px;background:${acc};margin-bottom:18px"></div>${d.rsvpDeadline?`<div style="font-size:12px;color:${fg2};margin-bottom:18px;letter-spacing:1px">Confirm by ${fD(d.rsvpDeadline).toUpperCase()}</div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)')}</div></div>`:''}
<div class="ch" id="i4" style="align-items:center;justify-content:center">
  <div style="text-align:center;padding:40px 28px"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:7px;color:${acc};text-transform:uppercase;margin-bottom:14px">We are getting married</div>
  <div style="font-family:'Syne',sans-serif;font-size:clamp(40px,9vw,100px);font-weight:800;line-height:.87;letter-spacing:-2px;color:${fg}">${d.bride.split(' ')[0].toUpperCase()}<span style="color:${acc}"> &amp; </span>${d.groom.split(' ')[0].toUpperCase()}</div>
  <div style="width:48px;height:2px;background:${acc};margin:18px auto"></div>
  <div style="font-size:13px;color:${fg2};letter-spacing:2px;text-transform:uppercase">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')} · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
  ${d.story?`<div style="max-width:380px;margin:16px auto;font-size:14px;color:${fg2};line-height:1.8;font-style:italic">${d.story}</div>`:''}
  ${d.hashtag?`<div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:${acc}77;margin-top:12px;letter-spacing:2px">${d.hashtag.toUpperCase()}</div>`:''}
  ${d.contactPhone?`<div style="font-size:12px;color:${fg2};margin-top:12px">${d.contactName} · ${d.contactPhone}</div>`:''}
  </div>
</div>
</div>
<script>
const CHS=${JSON.stringify(CHS)};let cur=0,busy=false;
function go(n){if(n<0||n>=CHS.length||n===cur||busy)return;busy=true;
  const f=document.getElementById(CHS[cur]),t=document.getElementById(CHS[n]);
  if(!f||!t){busy=false;return;}
  f.style.transition='opacity 0.5s ease';f.style.opacity='0';
  setTimeout(()=>{try{
    f.style.transition='';f.style.display='none';f.style.opacity='1';
    t.style.display='flex';
    t.style.opacity='0';void t.offsetWidth;
    t.style.transition='opacity 0.75s ease';t.style.opacity='1';
    cur=n;upd();
  }catch(e){console.warn(e);}finally{busy=false;}},520);}
function uNxt(){const e=document.getElementById('nxt');if(e)e.style.display=cur>0&&cur<CHS.length-1?'block':'none';}
function upd(){const pg=document.getElementById('prog');if(pg)pg.style.width=((cur/(CHS.length-1))*100)+'%';const el=document.getElementById('pnav');if(!el)return;el.innerHTML='';CHS.forEach((_,i)=>{const b=document.createElement('button');b.className='pnd'+(i===cur?' on':'');b.onclick=()=>go(i);el.appendChild(b);});uNxt();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(cur+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(cur-1);});
let tx=0;document.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>55)(dx<0?go(cur+1):go(cur-1));},{passive:true});
upd();
</script></body></html>`
}


function genGoldenHour(d,dk=false){
  const bg=dk?'radial-gradient(ellipse at 50% 20%,#2A1400,#0E0800)':'linear-gradient(160deg,#FFF8EC 0%,#FFE8C0 50%,#FFF0D8 100%)',fg=dk?'#FBF0D8':'#1A0E00',fg2=dk?'rgba(251,240,216,0.55)':'rgba(26,14,0,0.5)',acc=dk?'#E8A030':'#C07820',pri=dk?'#F0C880':'#A06010'
  const fl=famLines(d),crs=fns(d)
  const cC=crs.map(c=>`<div class="rv" style="border-left:2px solid ${acc}55;padding:12px 18px;margin-bottom:12px;background:${dk?'rgba(232,160,48,.07)':'rgba(255,255,255,.6)'}"><div style="font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:${pri};margin-bottom:3px">${c.icon||''} ${c.name}</div><div style="font-size:10px;letter-spacing:2px;color:${acc};font-family:'Jost',sans-serif;text-transform:uppercase;margin-bottom:6px;font-weight:400">${fD(c.date)} · ${fT(c.time)}</div><div style="margin-top:8px;display:flex;align-items:flex-start;gap:5px"><span style="color:${acc};font-size:12px;flex-shrink:0">📍</span><div><div style="font-size:13px;color:${fg};font-weight:500">${c.venue||'Venue TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:1px">${c.address}</div>`:''}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;margin-top:4px;display:inline-block;border-bottom:1px solid ${acc}44">📍 Map</a>`:''}</div>`).join('')
  const famS=fl.familyMode!=='none'?`<section class="sec"><div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:7px;color:${acc};text-transform:uppercase;margin-bottom:10px;font-weight:300">The Families</div><div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,42px);font-style:italic;color:${fg};margin-bottom:24px">Together we celebrate</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">${[['Bride',d.bride,fl.bp,fl.bg,'Daughter of','Granddaughter of'],['Groom',d.groom,fl.gp,fl.gg,'Son of','Grandson of']].map(([role,name,par,gp,rel,grel])=>`<div class="rv" style="padding:18px;border:1px solid ${acc}22;background:${dk?'rgba(232,160,48,.06)':'rgba(255,255,255,.6)'}"><div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}88;text-transform:uppercase;margin-bottom:6px">${role}</div>${par?`<div style="font-size:10px;color:${acc}88;letter-spacing:3px;text-transform:uppercase;font-family:'Jost',sans-serif;margin-bottom:4px">${rel}</div><div style="font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:${fg2};line-height:1.7">${par}</div>`:''} ${gp?`<div style="font-size:10px;color:${acc}77;letter-spacing:3px;text-transform:uppercase;font-family:'Jost',sans-serif;margin-top:6px;margin-bottom:4px">${grel}</div><div style="font-family:'Cormorant Garamond',serif;font-size:13px;font-style:italic;color:${fg2};opacity:.8;line-height:1.6">${gp}</div>`:''}</div>`).join('')}</div></section>`:''
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${bg};min-height:100vh;color:${fg};font-family:'Cormorant Garamond',serif;background-attachment:fixed}.rv{opacity:0;transform:translateY(20px);transition:opacity .9s ease,transform .9s ease}.rv.vis{opacity:1;transform:none}.sec{padding:72px max(56px,7vw);max-width:860px;margin:0 auto}@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}</style></head><body>
<section class="sec" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div class="rv" style="position:relative;width:180px;height:180px;margin-bottom:22px"><div style="position:absolute;inset:0;border-radius:50%;background:${dk?'rgba(232,160,48,.12)':'rgba(192,120,32,.1)'};animation:pulse 5s ease-in-out infinite"></div><div style="position:absolute;inset:20px;border-radius:50%;background:${dk?'rgba(232,160,48,.1)':'rgba(192,120,32,.08)'};animation:pulse 5s ease-in-out infinite;animation-delay:.8s"></div><div style="position:absolute;inset:40px;border-radius:50%;background:${dk?'rgba(232,160,48,.08)':'rgba(192,120,32,.06)'};animation:pulse 5s ease-in-out infinite;animation-delay:1.6s"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:60px">💍</div></div>
  <div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:8px;color:${acc};text-transform:uppercase;margin-bottom:14px;font-weight:300">An Engagement Invitation</div>
  <div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(46px,11vw,104px);font-style:italic;font-weight:300;line-height:.95;color:${pri}">${d.bride}</div>
  <div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(22px,4vw,38px);color:${acc};margin:4px 0;font-style:italic">&amp;</div>
  <div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(46px,11vw,104px);font-style:italic;font-weight:300;line-height:.95;color:${dk?'rgba(180,220,180,1)':'#2A6A3A'}">${d.groom}</div>
  <div class="rv" style="margin-top:18px;font-size:13px;letter-spacing:3px;color:${fg2};font-family:'Jost',sans-serif;text-transform:uppercase;font-weight:300">${fD(crs[0]?.date||'').replace(/\w+,\s*/,'')}</div>
  ${d.welcome?`<div class="rv" style="max-width:400px;font-size:16px;font-style:italic;color:${fg2};line-height:2;margin-top:14px">${d.welcome}</div>`:''}
</section>
${famS}
<section class="sec"><div class="rv" style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:7px;color:${acc};text-transform:uppercase;margin-bottom:10px;font-weight:300">Our Celebrations</div><div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4.5vw,44px);font-style:italic;color:${fg};margin-bottom:22px">The Ceremonies</div>${cC}${d.mainMaps?`<div style="margin-top:12px"><a href="${d.mainMaps}" target="_blank" style="font-size:11px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 ${d.mainVenue} on Maps</a></div>`:''}</section>
${d.rsvpEnabled?`<section class="sec" style="text-align:center"><div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(36px,6vw,58px);font-style:italic;font-weight:300;color:${fg};margin-bottom:14px">Will you join us?</div>${d.rsvpDeadline?`<div class="rv" style="font-size:14px;font-style:italic;color:${fg2};margin-bottom:20px">Confirm by <em style="color:${acc}">${fD(d.rsvpDeadline)}</em></div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(232,160,48,.06)':'rgba(255,255,255,.7)')}</section>`:''}
<section class="sec" style="text-align:center;padding-bottom:90px">
  <div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(38px,8vw,80px);font-style:italic;font-weight:300;line-height:1.1;color:${pri}">${d.bride.split(' ')[0]}</div>
  <div class="rv" style="font-size:26px;color:${acc};margin:4px 0">♡</div>
  <div class="rv" style="font-family:'Cormorant Garamond',serif;font-size:clamp(38px,8vw,80px);font-style:italic;font-weight:300;line-height:1.1;color:${dk?'rgba(180,220,180,1)':'#2A6A3A'}">${d.groom.split(' ')[0]}</div>
  ${d.story?`<div class="rv" style="max-width:380px;margin:16px auto;font-size:16px;font-style:italic;color:${fg2};line-height:1.9">${d.story}</div>`:''}
  ${d.hashtag?`<div class="rv" style="font-family:'Jost',sans-serif;font-size:13px;letter-spacing:3px;color:${acc}88;margin-top:8px;font-weight:300">${d.hashtag}</div>`:''}
  ${d.dressCode?`<div class="rv" style="font-size:12px;color:${fg2};margin-top:10px;font-style:italic">Dress Code · ${d.dressCode}</div>`:''}
  ${d.contactPhone?`<div class="rv" style="font-size:12px;color:${acc}88;margin-top:8px">${d.contactName} · ${d.contactPhone}</div>`:''}
</section>
<script>const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target);}});},{threshold:.1});document.querySelectorAll('.rv').forEach(el=>io.observe(el));</script></body></html>`
}

// Generators 5-9 and dispatcher (compact, similar pattern)
function genModernVow(d,dk=false){
  const bg=dk?'#0A0F0E':'#F0F5F4',fg=dk?'#E8F5F3':'#0A0F0E',fg2=dk?'rgba(232,245,243,.5)':'rgba(10,15,14,.45)',acc=dk?'#00C9B4':'#006B5E'
  const fl=famLines(d),crs=fns(d)
  const CHS=['mv0','mv1','mv2',d.rsvpEnabled&&'mv3','mv4'].filter(Boolean)
  const evL=crs.map((c,i)=>`<div style="display:flex;gap:18px;align-items:flex-start;padding:11px 0;border-bottom:1px solid ${fg}12"><span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:12px;color:${acc};min-width:20px;margin-top:2px">${String(i+1).padStart(2,'0')}</span><div style="flex:1"><div style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;letter-spacing:.5px;color:${fg}">${c.name}</div><div style="font-size:12px;color:${fg2};margin-top:2px;font-weight:300">${c.venue} · ${fD(c.date).replace(/\w+,\s*/,'')} · ${fT(c.time)}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44;white-space:nowrap;flex-shrink:0">Map →</a>`:''}</div>`).join('')
  const famG=fl.familyMode!=='none'?`<div style="border:1px solid ${fg}12"><div style="display:flex">${[['Bride',d.bride,fl.bp,fl.bg],['Groom',d.groom,fl.gp,fl.gg]].map(([r,nm,p,g],idx)=>`<div style="flex:1;padding:20px;${idx===0?`border-right:1px solid ${fg}12`:''}"><div style="font-size:9px;letter-spacing:4px;color:${fg2};text-transform:uppercase;margin-bottom:8px;font-weight:500">${r}</div><div style="font-family:'DM Sans',sans-serif;font-size:20px;font-weight:300;color:${idx===0?acc:`${fg}55`};margin-bottom:6px">${nm}</div>${p?`<div style="font-size:12px;color:${fg2};line-height:1.7;font-weight:300">${p}</div>`:''} ${g?`<div style="font-size:11px;color:${fg2};opacity:.7;margin-top:4px;line-height:1.6">${g}</div>`:''}</div>`).join('')}</div></div>`:'';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:${bg};color:${fg};font-family:'DM Sans',sans-serif}#wrap{position:fixed;inset:0;overflow:hidden}.ch{position:absolute;inset:0;display:none;align-items:center;justify-content:center}.ch.fi{animation:ci .7s ease forwards}.ch.fo{animation:co .55s ease forwards}@keyframes ci{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}@keyframes co{from{opacity:1}to{opacity:0;transform:translateX(-20px)}}#mnv{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:99;display:flex;gap:5px}.mnd{width:24px;height:3px;border-radius:2px;background:${fg}18;cursor:pointer;border:none;transition:all .3s}.mnd.on{background:${acc};width:36px}@keyframes rs{to{transform:rotate(360deg)}}select option{background:${dk?'#0A0F0E':'#fff'};color:${fg}}</style></head><body>
<button id="nxt" onclick="go(cur+1)" style="position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99;background:transparent;border:1px solid ${acc}66;color:${acc};font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:4px;padding:10px 24px;cursor:pointer;display:none;text-transform:uppercase;border-radius:100px;transition:all .3s">Next →</button>
<div id="wrap">
<div class="ch" id="mv0" style="display:flex" style="padding:clamp(28px,5vw,60px)">
  <div style="width:100%;max-width:640px">
    <div style="position:relative;margin-bottom:32px"><svg width="100" height="100" style="position:absolute;top:-18px;left:-18px;opacity:.1;animation:rs 28s linear infinite"><circle cx="50" cy="50" r="46" fill="none" stroke="${acc}" stroke-width="1"/><circle cx="50" cy="50" r="34" fill="none" stroke="${acc}" stroke-width=".5"/><line x1="4" y1="50" x2="96" y2="50" stroke="${acc}" stroke-width=".5"/><line x1="50" y1="4" x2="50" y2="96" stroke="${acc}" stroke-width=".5"/></svg>
    <div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:6px;color:${acc};text-transform:uppercase;margin-bottom:14px;font-weight:500">Engagement Invitation</div></div>
    <div style="font-family:'DM Sans',sans-serif;font-size:clamp(40px,9vw,96px);font-weight:300;line-height:.9;color:${fg};letter-spacing:-2px">${d.bride}</div>
    <div style="display:flex;align-items:center;gap:14px;margin:12px 0"><div style="flex:1;height:1px;background:${acc}"></div><span style="font-size:20px;color:${acc}">&amp;</span><div style="flex:1;height:1px;background:${fg}18"></div></div>
    <div style="font-family:'DM Sans',sans-serif;font-size:clamp(40px,9vw,96px);font-weight:300;line-height:.9;color:${fg2};letter-spacing:-2px">${d.groom}</div>
    <div style="margin-top:24px;font-size:12px;letter-spacing:3px;color:${fg2};text-transform:uppercase;font-weight:300">${fD(crs[0]?.date||'').replace(/\w+,\s*/,'')} · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
    ${d.welcome?`<div style="margin-top:14px;font-size:14px;color:${fg2};line-height:1.8;font-weight:300;font-style:italic">${d.welcome}</div>`:''}
    <button onclick="go(1)" style="margin-top:20px;display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border:1px solid ${acc}55;background:transparent;color:${acc};font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;font-weight:500">View Invite →</button>
  </div>
</div>
<div class="ch" id="mv1" style="flex-direction:column;padding:clamp(28px,5vw,60px);align-items:flex-start;justify-content:center">
  <div style="max-width:640px;width:100%"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:18px;font-weight:500">The Families</div>${famG}</div>
</div>
<div class="ch" id="mv2" style="flex-direction:column;padding:clamp(28px,5vw,60px);align-items:flex-start;overflow:hidden">
  <div style="max-width:640px;width:100%;overflow:hidden;display:flex;flex-direction:column;max-height:100%">
    <div style="flex-shrink:0;margin-bottom:16px"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:6px;font-weight:500">Programme</div><div style="font-family:'DM Sans',sans-serif;font-size:clamp(22px,3.5vw,34px);font-weight:300;color:${fg}">The Ceremonies</div></div>
    <div style="overflow-y:auto;flex:1">${evL}</div>
    ${d.mainMaps?`<div style="flex-shrink:0;margin-top:12px"><a href="${d.mainMaps}" target="_blank" style="font-size:11px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 ${d.mainVenue}</a></div>`:''}
  </div>
</div>
${d.rsvpEnabled?`<div class="ch" id="mv3" style="flex-direction:column;padding:clamp(28px,5vw,60px);align-items:flex-start;overflow-y:auto;justify-content:center"><div style="max-width:540px;width:100%"><div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:5px;color:${acc};text-transform:uppercase;margin-bottom:10px;font-weight:500">RSVP</div><div style="font-family:'DM Sans',sans-serif;font-size:clamp(26px,4vw,40px);font-weight:300;color:${fg};margin-bottom:6px">Will You Join Us?</div><div style="width:36px;height:1px;background:${acc};margin-bottom:16px"></div>${d.rsvpDeadline?`<div style="font-size:12px;color:${fg2};margin-bottom:16px">Confirm by ${fD(d.rsvpDeadline)}</div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(255,255,255,.06)':'rgba(0,0,0,.03)')}</div></div>`:''}
<div class="ch" id="mv4" style="padding:clamp(28px,5vw,60px);align-items:flex-start;justify-content:center">
  <div style="max-width:640px;width:100%;position:relative">
    <div style="position:absolute;top:-20px;right:-20px;opacity:.06;animation:rs 22s linear infinite"><svg width="200" height="200"><circle cx="100" cy="100" r="95" fill="none" stroke="${acc}" stroke-width="1.5"/><circle cx="100" cy="100" r="70" fill="none" stroke="${acc}" stroke-width="1"/></svg></div>
    <div style="font-family:'DM Sans',sans-serif;font-size:clamp(36px,7vw,78px);font-weight:300;line-height:.9;color:${fg};letter-spacing:-2px">${d.bride.split(' ')[0]}<br/><span style="font-size:.42em;letter-spacing:6px;color:${acc};font-weight:400">&amp;</span><br/>${d.groom.split(' ')[0]}</div>
    <div style="width:36px;height:1px;background:${acc};margin:16px 0"></div>
    <div style="font-size:12px;letter-spacing:3px;color:${fg2};text-transform:uppercase;font-weight:300">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')} · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
    ${d.story?`<div style="margin-top:14px;font-size:14px;color:${fg2};line-height:1.8;font-weight:300;font-style:italic;max-width:360px">${d.story}</div>`:''}
    ${d.hashtag?`<div style="margin-top:12px;font-size:13px;letter-spacing:3px;color:${acc}77;font-weight:500">${d.hashtag}</div>`:''}
    ${d.dressCode?`<div style="margin-top:10px;font-size:11px;color:${fg2};letter-spacing:2px;text-transform:uppercase">Dress Code · ${d.dressCode}</div>`:''}
  </div>
</div>
</div><div id="mnv"></div>
<script>
const CHS=${JSON.stringify(CHS)};let cur=0,busy=false;
function go(n){if(n<0||n>=CHS.length||n===cur||busy)return;busy=true;
  const f=document.getElementById(CHS[cur]),t=document.getElementById(CHS[n]);
  if(!f||!t){busy=false;return;}
  f.style.transition='opacity 0.45s ease';f.style.opacity='0';
  setTimeout(()=>{try{
    f.style.transition='';f.style.display='none';f.style.opacity='1';
    t.style.display='flex';
    t.style.opacity='0';void t.offsetWidth;
    t.style.transition='opacity 0.7s ease';t.style.opacity='1';
    cur=n;upd();
  }catch(e){console.warn(e);}finally{busy=false;}},480);}
function uNxt(){const e=document.getElementById('nxt');if(e)e.style.display=cur>0&&cur<CHS.length-1?'block':'none';}
function upd(){const el=document.getElementById('mnv');if(!el)return;el.innerHTML='';CHS.forEach((_,i)=>{const b=document.createElement('button');b.className='mnd'+(i===cur?' on':'');b.onclick=()=>go(i);el.appendChild(b);});uNxt();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(cur+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(cur-1);});
let tx=0;document.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>55)(dx<0?go(cur+1):go(cur-1));},{passive:true});
upd();
</script></body></html>`
}

function genVelvet(d,dk=true){
  const bg=dk?'#0D0018':'#FAF5FF',fg=dk?'#F0E8FF':'#1A0028',fg2=dk?'rgba(240,232,255,.55)':'rgba(26,0,40,.5)',acc=dk?'#D4AF37':'#A07820',pri=dk?'#E0B0FF':'#6B2A9A'
  const fl=famLines(d),crs=fns(d)
  const fil=`<svg viewBox="0 0 280 50" style="width:clamp(180px,45vw,280px);height:auto;opacity:${dk?'.5':'.35'}" fill="none" stroke="${acc}" stroke-width=".8"><path d="M140,25 L8,25"/><path d="M140,25 L272,25"/><path d="M8,25 Q8,8 22,8 Q36,8 36,25 Q36,42 22,42 Q8,42 8,25"/><path d="M272,25 Q272,8 258,8 Q244,8 244,25 Q244,42 258,42 Q272,42 272,25"/><path d="M36,25 Q58,12 80,18 Q102,24 100,25 Q102,26 80,32 Q58,38 36,25"/><path d="M244,25 Q222,12 200,18 Q178,24 180,25 Q178,26 200,32 Q222,38 244,25"/><circle cx="140" cy="25" r="7" fill="${acc}33"/><circle cx="140" cy="25" r="3" fill="${acc}99"/><circle cx="140" cy="25" r="1" fill="${acc}"/></svg>`
  const CHS=['vn0','vn1','vn2',d.rsvpEnabled&&'vn3','vn4'].filter(Boolean)
  const cC=crs.map(c=>`<div style="padding:18px 20px;border:1px solid ${acc}22;background:${dk?'rgba(212,175,55,.07)':'rgba(255,255,255,.6)'};margin-bottom:9px;position:relative"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${acc}55,transparent)"></div><div style="font-family:'Fraunces',serif;font-size:21px;color:${pri};margin-bottom:3px">${c.icon||'✦'} ${c.name}</div><div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:3px;color:${acc}99;text-transform:uppercase;margin-bottom:6px">${fD(c.date)} · ${fT(c.time)}</div><div style="margin-top:8px;display:flex;align-items:flex-start;gap:5px"><span style="color:${acc};font-size:12px;flex-shrink:0">📍</span><div><div style="font-size:13px;color:${fg};font-weight:500">${c.venue||'Venue TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:1px">${c.address}</div>`:''}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44;margin-top:4px;display:inline-block">📍 Map</a>`:''}</div>`).join('')
  const famG=fl.familyMode!=='none'?`<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:0 20px;max-width:660px;width:100%;text-align:left;align-items:start">${[['Bride',d.bride,fl.bp,fl.bg,'Daughter of','Granddaughter of',pri],['Groom',d.groom,fl.gp,fl.gg,'Son of','Grandson of',`${fg2}`]].map(([role,name,p,g,rel,grel,col])=>`<div><div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:5px;color:${acc}88;text-transform:uppercase;margin-bottom:7px">${role}</div><div style="font-family:'Fraunces',serif;font-size:24px;font-style:italic;color:${col};margin-bottom:5px">${name}</div>${p?`<div style="font-size:10px;letter-spacing:3px;color:${acc}77;text-transform:uppercase;font-family:'DM Sans',sans-serif;margin-bottom:3px">${rel}</div><div style="font-size:13px;color:${fg2};font-style:italic;line-height:1.7">${p}</div>`:''} ${g?`<div style="font-size:10px;letter-spacing:3px;color:${acc}66;text-transform:uppercase;font-family:'DM Sans',sans-serif;margin-top:6px;margin-bottom:3px">${grel}</div><div style="font-size:12px;color:${fg2};opacity:.75;font-style:italic;line-height:1.6">${g}</div>`:''}</div>`).join(`<div style="width:1px;background:linear-gradient(180deg,transparent,${acc}44,${acc}66,${acc}44,transparent);margin-top:12px"></div>`)}</div>`:'';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:${bg}}#wrap{position:fixed;inset:0;overflow:hidden}.ch{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center}.ch.fi{animation:ci .95s ease forwards}.ch.fo{animation:co .7s ease forwards}@keyframes ci{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes co{from{opacity:1}to{opacity:0;transform:translateY(-16px)}}#vnv{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:99;display:flex;flex-direction:column;gap:8px}.vnd{width:5px;height:5px;border-radius:50%;background:${acc}33;cursor:pointer;border:none;transition:all .3s}.vnd.on{background:${acc};height:18px;border-radius:3px}@keyframes shim{0%,100%{opacity:.6}50%{opacity:1}}select option{background:${dk?'#0D0018':'#fff'};color:${fg}}</style></head><body>
<button id="nxt" onclick="go(cur+1)" style="position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99;background:transparent;border:1px solid ${acc}66;color:${acc};font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:4px;padding:10px 24px;cursor:pointer;display:none;text-transform:uppercase;border-radius:100px;transition:all .3s">Next →</button>
<div id="vnv"></div>
<div id="wrap">
<div class="ch" id="vn0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center" style="padding:clamp(28px,5vw,60px)">
  <div style="margin-bottom:16px;animation:shim 4s ease-in-out infinite">${fil}</div>
  <div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:8px;color:${acc}99;text-transform:uppercase;margin-bottom:12px">With great joy, we announce</div>
  <div style="font-family:'Fraunces',serif;font-size:clamp(42px,10vw,98px);font-style:italic;font-weight:300;line-height:.92;color:${pri}">${d.bride}</div>
  <div style="font-family:'Fraunces',serif;font-size:clamp(18px,3vw,30px);color:${acc};margin:7px 0">&amp;</div>
  <div style="font-family:'Fraunces',serif;font-size:clamp(42px,10vw,98px);font-style:italic;font-weight:300;line-height:.92;color:${fg}66">${d.groom}</div>
  <div style="transform:rotate(180deg);margin-top:16px;animation:shim 4s ease-in-out infinite;animation-delay:2s">${fil}</div>
  <div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:4px;color:${fg2};text-transform:uppercase;margin-top:10px;font-weight:300">${fD(crs[0]?.date||'').replace(/\w+,\s*/,'')} · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
</div>
<div class="ch" id="vn1" style="padding:clamp(28px,5vw,60px)">
  <div style="margin-bottom:18px">${fil}</div>
  <div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:7px;color:${acc}99;text-transform:uppercase;margin-bottom:14px">The Families</div>
  ${famG}
  ${d.welcome?`<div style="margin-top:18px;font-size:14px;font-style:italic;color:${fg2};max-width:420px;line-height:1.9">${d.welcome}</div>`:''}
</div>
<div class="ch" id="vn2" style="padding:clamp(20px,4vw,44px);overflow:hidden">
  <div style="width:100%;max-width:660px;overflow:hidden;display:flex;flex-direction:column;max-height:100%">
    <div style="margin-bottom:14px;flex-shrink:0;text-align:center"><div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:7px;color:${acc}99;text-transform:uppercase;margin-bottom:6px">Our Celebrations</div><div style="font-family:'Fraunces',serif;font-size:clamp(26px,4.5vw,40px);font-style:italic;font-weight:300;color:${fg}">The Ceremonies</div></div>
    <div style="overflow-y:auto;flex:1">${cC}</div>
    ${d.mainMaps?`<div style="flex-shrink:0;padding-top:10px;text-align:center"><a href="${d.mainMaps}" target="_blank" style="font-size:11px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 ${d.mainVenue}</a></div>`:''}
  </div>
</div>
${d.rsvpEnabled?`<div class="ch" id="vn3" style="padding:clamp(24px,4vw,48px);overflow-y:auto"><div style="max-width:460px;width:100%"><div style="text-align:center;margin-bottom:16px">${fil}</div><div style="font-family:'Fraunces',serif;font-size:clamp(32px,5.5vw,52px);font-style:italic;font-weight:300;color:${fg};text-align:center;margin-bottom:14px">Will you join us?</div>${d.rsvpDeadline?`<div style="font-size:13px;font-style:italic;color:${fg2};text-align:center;margin-bottom:18px">Confirm by <em style="color:${acc}">${fD(d.rsvpDeadline)}</em></div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(212,175,55,.07)':'rgba(255,255,255,.7)')}</div></div>`:''}
<div class="ch" id="vn4" style="padding:clamp(28px,5vw,60px)">
  <div style="margin-bottom:16px">${fil}</div>
  <div style="font-family:'Fraunces',serif;font-size:clamp(38px,8vw,84px);font-style:italic;font-weight:300;line-height:1.1;color:${pri}">${d.bride.split(' ')[0]}</div>
  <div style="font-size:30px;color:${acc};margin:5px 0">♡</div>
  <div style="font-family:'Fraunces',serif;font-size:clamp(38px,8vw,84px);font-style:italic;font-weight:300;line-height:1.1;color:${fg2}">${d.groom.split(' ')[0]}</div>
  <div style="transform:rotate(180deg);margin-top:16px;animation:shim 4s ease-in-out infinite">${fil}</div>
  ${d.story?`<div style="max-width:380px;margin-top:14px;font-size:15px;font-style:italic;color:${fg2};line-height:1.9">${d.story}</div>`:''}
  ${d.hashtag?`<div style="font-family:'DM Sans',sans-serif;font-size:13px;letter-spacing:3px;color:${acc}77;margin-top:10px">${d.hashtag}</div>`:''}
</div>
</div>
<script>
const CHS=${JSON.stringify(CHS)};let cur=0,busy=false;
function go(n){if(n<0||n>=CHS.length||n===cur||busy)return;busy=true;
  const f=document.getElementById(CHS[cur]),t=document.getElementById(CHS[n]);
  if(!f||!t){busy=false;return;}
  f.style.transition='opacity 0.55s ease';f.style.opacity='0';
  setTimeout(()=>{try{
    f.style.transition='';f.style.display='none';f.style.opacity='1';
    t.style.display='flex';
    t.style.opacity='0';void t.offsetWidth;
    t.style.transition='opacity 0.85s ease';t.style.opacity='1';
    cur=n;upd();
  }catch(e){console.warn(e);}finally{busy=false;}},560);}
function uNxt(){const e=document.getElementById('nxt');if(e)e.style.display=cur>0&&cur<CHS.length-1?'block':'none';}
function upd(){const el=document.getElementById('vnv');if(!el)return;el.innerHTML='';CHS.forEach((_,i)=>{const b=document.createElement('button');b.className='vnd'+(i===cur?' on':'');b.onclick=()=>go(i);el.appendChild(b);});uNxt();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(cur+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(cur-1);});
let tx=0;document.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>55)(dx<0?go(cur+1):go(cur-1));},{passive:true});
upd();
</script></body></html>`
}

function genCelestial(d,dk=true){
  const bg=dk?'#020918':'#EFF5FF',fg=dk?'#E8F2FF':'#020918',acc=dk?'#7EB8F7':'#1A4A9A',fg2=dk?'rgba(232,242,255,.55)':'rgba(2,9,24,.5)'
  const crs=fns(d)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:${bg}}canvas{position:fixed;inset:0;pointer-events:none}#ui{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(24px,5vw,60px);overflow-y:auto}</style></head><body>
<canvas id="st"></canvas>
<div id="ui">
  <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:8px;color:${acc}77;text-transform:uppercase;margin-bottom:18px">Save the Date</div>
  <div style="display:flex;align-items:center;justify-content:center;gap:clamp(20px,5vw,56px);margin-bottom:14px;flex-wrap:wrap">
    <div style="text-align:right"><div style="font-family:'Cinzel',serif;font-size:clamp(22px,5vw,48px);font-weight:400;line-height:1.1;letter-spacing:3px;color:${fg};text-transform:uppercase">${d.bride.split(' ')[0].toUpperCase()}</div><div style="font-size:10px;letter-spacing:3px;color:${acc}77;text-transform:uppercase;margin-top:4px;font-family:'DM Sans',sans-serif">The Bride</div></div>
    <canvas id="cnx" width="50" height="130" style="flex-shrink:0"></canvas>
    <div style="text-align:left"><div style="font-family:'Cinzel',serif;font-size:clamp(22px,5vw,48px);font-weight:400;line-height:1.1;letter-spacing:3px;color:${fg};text-transform:uppercase">${d.groom.split(' ')[0].toUpperCase()}</div><div style="font-size:10px;letter-spacing:3px;color:${acc}77;text-transform:uppercase;margin-top:4px;font-family:'DM Sans',sans-serif">The Groom</div></div>
  </div>
  <div style="width:1px;height:28px;background:linear-gradient(180deg,${acc}55,transparent);margin:4px auto"></div>
  <div style="font-family:'Cinzel',serif;font-size:clamp(10px,1.8vw,13px);letter-spacing:6px;color:${acc};text-transform:uppercase;margin:8px 0">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')}</div>
  <div style="font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:3px;color:${fg2};text-transform:uppercase;margin-bottom:12px;font-weight:300">${d.mainVenue} · ${d.mainAddress.split(',').pop()?.trim()||''}</div>
  ${d.mainMaps?`<a href="${d.mainMaps}" target="_blank" style="font-size:9px;color:${acc};letter-spacing:4px;text-transform:uppercase;text-decoration:none;border:1px solid ${acc}44;padding:6px 12px;margin-bottom:14px;display:inline-block">📍 View Venue</a>`:''} 
  <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:${fg2};max-width:360px;line-height:2;font-style:italic">${d.welcome}</div>
  ${crs.length>0?`<div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${crs.map(c=>`<span style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:2px;color:${acc}77;text-transform:uppercase">${c.name}</span><span style="color:${acc}44;margin:0 2px">·</span>`).join('')}</div>`:''} 
  ${d.hashtag?`<div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:4px;color:${acc}55;margin-top:12px;text-transform:uppercase">${d.hashtag}</div>`:''}
</div>
<script>
const cv=document.getElementById('st'),cx=cv.getContext('2d');
function rs(){cv.width=innerWidth;cv.height=innerHeight;}rs();window.addEventListener('resize',rs);
const stars=Array.from({length:${dk?220:70}},()=>({x:Math.random(),y:Math.random(),r:Math.random()*${dk?1.5:.8}+.3,a:Math.random()*.${dk?7:25}+.${dk?2:5},ph:Math.random()*Math.PI*2,sp:.005+Math.random()*.015}));
const clines=[[.08,.15,.16,.08,.25,.14,.35,.06,.42,.13],[.62,.08,.7,.16,.77,.1,.85,.05,.8,.17],[.06,.68,.14,.63,.2,.70,.28,.66],[.72,.62,.8,.68,.87,.6,.82,.73]];
function draw(){const t=Date.now()*.001;cx.clearRect(0,0,cv.width,cv.height);${dk?`const g=cx.createRadialGradient(cv.width*.5,cv.height*.5,0,cv.width*.5,cv.height*.5,cv.width*.8);g.addColorStop(0,'#020918');g.addColorStop(1,'rgba(0,0,0,.98)');cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);`:''}
stars.forEach(s=>{const a=s.a*(0.4+0.6*Math.sin(t*s.sp+s.ph));cx.beginPath();cx.arc(s.x*cv.width,s.y*cv.height,s.r,0,Math.PI*2);cx.fillStyle='rgba(${dk?'180,210,255':'20,60,150'},'+a+')';cx.fill();});
cx.strokeStyle='rgba(${dk?'126,184,247':'26,74,154'},0.1)';cx.lineWidth=.8;
clines.forEach(pts=>{if(pts.length<4)return;cx.beginPath();for(let i=0;i<pts.length;i+=2)i===0?cx.moveTo(pts[i]*cv.width,pts[i+1]*cv.height):cx.lineTo(pts[i]*cv.width,pts[i+1]*cv.height);cx.stroke();});
requestAnimationFrame(draw);}
draw();
const cc=document.getElementById('cnx'),ccx=cc.getContext('2d');
function drawC(){ccx.clearRect(0,0,50,130);const pts=[[25,5],[18,28],[8,50],[14,70],[25,90],[36,70],[42,50],[32,28],[25,5]];ccx.strokeStyle='rgba(${dk?'126,184,247':'26,74,154'},.5)';ccx.lineWidth=.8;ccx.beginPath();pts.forEach((p,i)=>i===0?ccx.moveTo(p[0],p[1]):ccx.lineTo(p[0],p[1]));ccx.stroke();pts.forEach(p=>{ccx.beginPath();ccx.arc(p[0],p[1],1.5,0,Math.PI*2);ccx.fillStyle='rgba(${dk?'126,184,247':'26,74,154'},.9)';ccx.fill();});}
drawC();
</script></body></html>`
}

function genVintage(d,dk=false){
  const bg=dk?'#1A1208':'#FEF9ED',fg=dk?'#F5E8C8':'#1A1208',fg2=dk?'rgba(245,232,200,.55)':'rgba(26,18,8,.5)',acc=dk?'#C9A050':'#8B4513',pri=dk?'#D4804A':'#8B1A1A',brd=dk?'rgba(201,160,80,.25)':'rgba(212,184,150,.7)'
  const crs=fns(d),fl=famLines(d)
  const evR=crs.map(c=>`<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px dashed ${brd}"><div style="font-family:'IM Fell English',serif;font-size:12px;color:${acc};min-width:72px;flex-shrink:0;padding-top:1px">${fD(c.date).replace(/\w+,\s*/,'').replace(/,\s*\d{4}$/,'').trim()}</div><div><div style="font-family:'IM Fell English',serif;font-size:14px;color:${fg}">${c.icon||''} ${c.name}</div><div style="display:flex;align-items:flex-start;gap:5px;margin-top:4px"><span style="color:${acc};font-size:11px;flex-shrink:0">&#128205;</span><div><div style="font-size:12px;color:${fg};font-weight:500">${c.venue||'TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:1px">${c.address}</div>`:''}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 Map</a>`:''}</div></div>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${dk?'#0E0C08':'#E8DCC8'};min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:32px 16px;font-family:'IM Fell English',serif}.card{background:${bg};max-width:680px;width:100%}.perf{height:16px;background:${dk?'#0E0C08':'#E8DCC8'};background-image:radial-gradient(circle,${dk?'#0E0C08':'#E8DCC8'} 50%,transparent 51%);background-size:18px 16px;background-repeat:repeat-x}.inner{padding:clamp(24px,4vw,48px)}.rv{opacity:0;transform:translateY(14px);transition:opacity .8s ease,transform .8s ease}.rv.vis{opacity:1;transform:none}</style></head><body>
<div class="card">
  <div class="perf"></div>
  <div class="inner">
    <div class="rv" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div style="font-size:10px;letter-spacing:3px;color:${acc}88;text-transform:uppercase">Wedding Invitation</div>
      <div style="display:flex;gap:8px;align-items:center">
        <div style="width:80px;height:80px;border-radius:50%;border:2px solid ${acc}44;display:flex;align-items:center;justify-content:center;transform:rotate(-25deg);opacity:.55;flex-shrink:0"><div style="font-size:7px;color:${acc};line-height:1.5;letter-spacing:1px;text-transform:uppercase;text-align:center;">${d.mainAddress.split(',').pop()?.trim()||'India'}<br/>${new Date(crs[0]?.date||'').getFullYear()||'2025'}</div></div>
        <div style="width:60px;height:76px;border:2px solid ${brd};display:flex;flex-direction:column;align-items:center;justify-content:center;background:${dk?'rgba(201,160,80,.06)':'rgba(255,255,255,.5)'};flex-shrink:0"><div style="font-size:18px;margin-bottom:3px">💌</div><div style="font-size:7px;color:${acc};letter-spacing:1px;text-transform:uppercase">India</div></div>
      </div>
    </div>
    <div style="height:1px;background:${brd};margin-bottom:20px"></div>
    <div class="rv" style="text-align:center;margin-bottom:24px">
      <div style="font-size:10px;letter-spacing:5px;color:${acc}99;text-transform:uppercase;margin-bottom:12px">Together with their families</div>
      <div style="font-family:'IM Fell English',serif;font-size:clamp(36px,9vw,76px);font-style:italic;line-height:1;color:${pri}">${d.bride}</div>
      <div style="font-size:clamp(16px,3vw,26px);color:${acc};margin:5px 0;font-style:italic">&amp;</div>
      <div style="font-family:'IM Fell English',serif;font-size:clamp(36px,9vw,76px);font-style:italic;line-height:1;color:${fg}55">${d.groom}</div>
    </div>
    <div style="height:1px;background:repeating-linear-gradient(90deg,${brd} 0,${brd} 5px,transparent 5px,transparent 10px);margin-bottom:20px"></div>
    ${fl.familyMode!=='none'?`<div class="rv" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px">${[['Daughter of',fl.bp,fl.bg,'Granddaughter of'],['Son of',fl.gp,fl.gg,'Grandson of']].map(([rel,p,g,grel])=>`<div>${p?`<div style="font-size:9px;letter-spacing:3px;color:${acc}88;text-transform:uppercase;margin-bottom:6px">${rel}</div><div style="font-size:13px;font-style:italic;color:${fg2};line-height:1.7">${p}</div>`:''} ${g?`<div style="font-size:9px;letter-spacing:3px;color:${acc}77;text-transform:uppercase;margin-top:8px;margin-bottom:4px">${grel}</div><div style="font-size:12px;font-style:italic;color:${fg2};opacity:.8;line-height:1.6">${g}</div>`:''}</div>`).join('')}</div>`:''}
    <div class="rv" style="text-align:center;padding:16px;border:1px solid ${brd};margin-bottom:18px;background:${dk?'rgba(201,160,80,.05)':'rgba(255,255,255,.5)'}">
      <div style="font-size:10px;letter-spacing:4px;color:${acc}88;text-transform:uppercase;margin-bottom:7px">The Main Ceremony</div>
      <div style="font-size:clamp(16px,3.5vw,24px);font-style:italic;color:${fg};margin-bottom:5px">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'')}</div>
      <div style="font-size:13px;color:${fg2};font-style:italic">${fT(crs.find(c=>c.name==='Wedding')?.time||crs[0]?.time||'')} · ${d.mainVenue}</div>
      <div style="font-size:12px;color:${fg2};margin-top:3px;font-style:italic">${d.mainAddress}</div>
      ${d.mainMaps?`<a href="${d.mainMaps}" target="_blank" style="display:inline-block;margin-top:8px;font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 View on Maps</a>`:''}
    </div>
    <div class="rv">${evR}</div>
    <div style="height:1px;background:${brd};margin:20px 0"></div>
    ${d.rsvpEnabled?`<div class="rv" style="margin-bottom:20px"><div style="text-align:center;margin-bottom:14px"><div style="font-size:10px;letter-spacing:4px;color:${acc}88;text-transform:uppercase;margin-bottom:6px">RSVP</div>${d.rsvpDeadline?`<div style="font-size:13px;font-style:italic;color:${fg2}">Kindly confirm by ${fD(d.rsvpDeadline)}</div>`:''}</div>${rsvpFormHTML(d,fg,acc,dk?'rgba(201,160,80,.06)':'rgba(255,255,255,.7)')}</div><div style="height:1px;background:${brd};margin-bottom:20px"></div>`:''}
    <div class="rv" style="text-align:center;padding-bottom:8px">
      <div style="font-size:13px;font-style:italic;color:${fg2};line-height:1.9;margin-bottom:8px">${d.welcome}</div>
      ${d.dressCode?`<div style="font-size:11px;letter-spacing:2px;color:${acc}88;text-transform:uppercase;margin-bottom:5px">Dress Code · ${d.dressCode}</div>`:''}
      ${d.hashtag?`<div style="font-size:13px;letter-spacing:2px;color:${acc}77;font-style:italic">${d.hashtag}</div>`:''}
      ${d.contactPhone?`<div style="font-size:12px;color:${fg2};margin-top:8px">${d.contactName} · ${d.contactPhone}</div>`:''}
    </div>
  </div>
  <div class="perf"></div>
</div>
<script>const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target);}});},{threshold:.08});document.querySelectorAll('.rv').forEach(el=>io.observe(el));</script></body></html>`
}

function genPureType(d,dk=false){
  const bg=dk?'#0A0A0A':'#FAFAFA',fg=dk?'#F5F5F3':'#0A0A0A',fg2=dk?'rgba(245,245,243,.45)':'rgba(10,10,10,.38)',acc=dk?'#E8714A':'#C24B22'
  const crs=fns(d),fl=famLines(d)
  const evL=crs.map((c,i)=>`<div class="rv" style="display:flex;align-items:baseline;gap:18px;padding:10px 0;border-bottom:1px solid ${fg}0D;flex-wrap:wrap"><div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:${acc};min-width:18px;opacity:.7">${String(i+1).padStart(2,'0')}</div><div style="flex:1;min-width:100px"><div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:${fg}">${c.name}</div><div style="display:flex;align-items:flex-start;gap:5px;margin-top:4px"><span style="color:${acc};font-size:11px;flex-shrink:0">&#128205;</span><div><div style="font-size:12px;color:${fg};font-weight:500">${c.venue||'TBD'}</div>${c.address?`<div style="font-size:11px;color:${fg2};margin-top:1px">${c.address}</div>`:''}</div></div></div><div style="text-align:right;font-family:'DM Sans',sans-serif;flex-shrink:0"><div style="font-size:12px;color:${fg2};font-weight:300">${fD(c.date).replace(/\w+,\s*/,'').replace(/,\s*\d{4}$/,'')}</div><div style="font-size:11px;color:${fg2};opacity:.7">${fT(c.time)}</div></div>${c.maps?`<a href="${c.maps}" target="_blank" style="font-size:10px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44;flex-shrink:0">Map →</a>`:''}</div>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.bride} ♡ ${d.groom}</title><link href="${GF}" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${bg};color:${fg};min-height:100vh;font-family:'DM Sans',sans-serif}.rv{opacity:0;transform:translateY(16px);transition:opacity .8s ease,transform .8s ease}.rv.vis{opacity:1;transform:none}section{padding:clamp(56px,9vw,110px) clamp(28px,8vw,96px)}</style></head><body>
<section style="min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:clamp(44px,7vw,76px)">
  <div class="rv" style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:6px;color:${fg2};text-transform:uppercase;margin-bottom:clamp(20px,3.5vw,36px);font-weight:400">Save the Date</div>
  <div class="rv" style="font-family:'Syne',sans-serif;font-size:clamp(52px,14vw,164px);font-weight:800;line-height:.84;letter-spacing:-4px;color:${fg}">${d.bride.split(' ')[0].toUpperCase()}</div>
  <div class="rv" style="font-family:'Syne',sans-serif;font-size:clamp(14px,2.8vw,26px);font-weight:400;letter-spacing:4px;color:${acc};margin:clamp(5px,1.2vw,10px) 0">&amp;</div>
  <div class="rv" style="font-family:'Syne',sans-serif;font-size:clamp(52px,14vw,164px);font-weight:800;line-height:.84;letter-spacing:-4px;color:${fg}22">${d.groom.split(' ')[0].toUpperCase()}</div>
  <div class="rv" style="margin-top:clamp(24px,4.5vw,44px);display:flex;align-items:center;gap:clamp(10px,2.5vw,24px);flex-wrap:wrap">
    <div style="font-family:'Syne',sans-serif;font-size:clamp(12px,1.8vw,16px);font-weight:400;color:${fg2}">${fD(crs.find(c=>c.name==='Wedding')?.date||crs[0]?.date||'').replace(/\w+,\s*/,'')}</div>
    <div style="width:20px;height:1px;background:${fg}18"></div>
    <div style="font-family:'Syne',sans-serif;font-size:clamp(12px,1.8vw,16px);font-weight:400;color:${fg2}">${d.mainAddress.split(',').pop()?.trim()||''}</div>
    ${d.mainMaps?`<a href="${d.mainMaps}" target="_blank" style="font-size:11px;color:${acc};text-decoration:none;border-bottom:1px solid ${acc}44">📍 Map</a>`:''}
  </div>
</section>
<section style="padding-top:0">
  <div class="rv" style="width:100%;height:1px;background:${fg}08;margin-bottom:clamp(36px,5.5vw,60px)"></div>
  ${fl.familyMode!=='none'?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(18px,4vw,44px);margin-bottom:clamp(36px,5.5vw,60px)">${[['Bride',d.bride,fl.bp,fl.bg,acc],['Groom',d.groom,fl.gp,fl.gg,`${fg}44`]].map(([role,name,p,g,col])=>`<div class="rv"><div style="font-family:'Syne',sans-serif;font-size:9px;letter-spacing:5px;color:${fg2};text-transform:uppercase;margin-bottom:10px">${role}</div><div style="font-family:'Syne',sans-serif;font-size:clamp(16px,2.8vw,24px);font-weight:700;color:${col};margin-bottom:7px">${name}</div>${p?`<div style="font-size:11px;color:${fg2};letter-spacing:3px;text-transform:uppercase;font-family:'DM Sans',sans-serif;margin-bottom:4px">Daughter/Son of</div><div style="font-size:13px;color:${fg2};line-height:1.7;font-weight:300">${p}</div>`:''} ${g?`<div style="font-size:11px;color:${fg2};opacity:.7;margin-top:6px;line-height:1.6;font-size:12px">${g}</div>`:''}</div>`).join('')}</div>`:''}
  ${d.welcome?`<div class="rv" style="font-size:clamp(14px,2vw,17px);color:${fg2};line-height:1.8;font-weight:300;max-width:520px;font-style:italic;margin-bottom:clamp(36px,5.5vw,60px)">${d.welcome}</div>`:''}
</section>
<section>
  <div class="rv" style="width:100%;height:1px;background:${fg}08;margin-bottom:clamp(24px,4vw,44px)"></div>
  <div class="rv" style="font-family:'Syne',sans-serif;font-size:9px;letter-spacing:5px;color:${fg2};text-transform:uppercase;margin-bottom:clamp(14px,2.5vw,24px)">Programme</div>
  <div>${evL}</div>
</section>
${d.rsvpEnabled?`<section><div class="rv" style="width:100%;height:1px;background:${fg}08;margin-bottom:clamp(24px,4vw,44px)"></div><div class="rv" style="font-family:'Syne',sans-serif;font-size:clamp(28px,6vw,56px);font-weight:800;line-height:.92;letter-spacing:-1.5px;color:${fg};margin-bottom:clamp(10px,2vw,18px)">RSVP</div>${d.rsvpDeadline?`<div class="rv" style="font-size:12px;color:${fg2};margin-bottom:18px;letter-spacing:2px;text-transform:uppercase">Confirm by ${fD(d.rsvpDeadline)}</div>`:''} ${rsvpFormHTML(d,fg,acc,dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.03)')}</section>`:''}
<section style="padding-bottom:clamp(80px,12vw,130px)">
  <div class="rv" style="width:100%;height:1px;background:${fg}08;margin-bottom:clamp(24px,4vw,44px)"></div>
  <div class="rv" style="font-family:'Syne',sans-serif;font-size:clamp(30px,6.5vw,68px);font-weight:800;line-height:.9;letter-spacing:-2px;color:${fg}">${d.bride.split(' ')[0].toUpperCase()}<span style="color:${acc}"> &amp;</span><br/>${d.groom.split(' ')[0].toUpperCase()}</div>
  ${d.story?`<div class="rv" style="margin-top:clamp(14px,2.5vw,24px);font-size:14px;color:${fg2};line-height:1.8;font-weight:300;max-width:460px;font-style:italic">${d.story}</div>`:''}
  ${d.hashtag?`<div class="rv" style="margin-top:12px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:${fg}18;letter-spacing:2px">${d.hashtag.toUpperCase()}</div>`:''}
  ${d.dressCode?`<div class="rv" style="margin-top:10px;font-size:11px;color:${fg2};letter-spacing:3px;text-transform:uppercase">Dress Code · ${d.dressCode}</div>`:''}
  ${d.contactPhone?`<div class="rv" style="margin-top:8px;font-size:12px;color:${acc}77">${d.contactName} · ${d.contactPhone}</div>`:''}
</section>
<script>const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target);}});},{threshold:.06});document.querySelectorAll('.rv').forEach(el=>io.observe(el));</script></body></html>`
}

function genCustom(d,customHTML){
  return injectWM(applyPlaceholders(customHTML,d))
}

function generateHTML(id,data,darkMode){
  const h=(fn,dk)=>fn(data,dk)
  switch(id){
    case 1:return h(genScarlet,darkMode)
    case 2:return h(genGarden,darkMode)
    case 3:return h(genInkPress,darkMode)
    case 4:return h(genGoldenHour,darkMode)
    case 5:return h(genModernVow,darkMode)
    case 6:return h(genVelvet,darkMode)
    case 7:return h(genCelestial,darkMode)
    case 8:return h(genVintage,darkMode)
    case 9:return h(genPureType,darkMode)
    case 10:return data.customHTML?genCustom(data,data.customHTML):'<html><body style="font:20px sans-serif;padding:40px;color:#999;text-align:center"><br/><br/>Upload your HTML template to see preview</body></html>'
    default:return h(genScarlet,darkMode)
  }
}


// ─── THUMBNAILS — fixed aspect ratio, no overlapping ──────────────────────
function Thumb({t}){
  // Always: outer = aspect ratio box (paddingTop trick), inner = absolute fill
  const wrap={position:'relative',paddingTop:'177%',width:'100%',overflow:'hidden'}
  const fill={position:'absolute',inset:0,overflow:'hidden'}

  if(t.isUpload) return(
    <div style={wrap}><div style={{...fill,background:'#F5F5F5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px'}}>
      <div style={{fontSize:'32px'}}>📤</div>
      <div style={{fontFamily:'system-ui',fontSize:'12px',color:'#999',textAlign:'center',padding:'0 16px',lineHeight:1.5}}>Upload<br/>Your HTML</div>
    </div></div>
  )

  const renders = {
    1:()=>( // Scarlet Royale — crimson + stars + arch + Italiana
      <div style={{...fill,background:'radial-gradient(ellipse at 50% 85%,#3D0010,#100004)'}}>
        {[...Array(14)].map((_,i)=><div key={i} style={{position:'absolute',width:'2px',height:'2px',borderRadius:'50%',background:'rgba(201,168,76,0.75)',top:`${4+Math.sin(i*1.7)*38+i*6}%`,left:`${6+Math.cos(i*1.3)*30+i*6}%`}}/>)}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',opacity:.12}}>
          <svg viewBox="0 0 100 40" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMidYMax meet">
            <path d="M0,40 L0,24 L7,24 L7,20 L9,20 L9,24 L16,24 L16,12 Q16,0 22,0 Q28,0 28,12 L28,24 L37,24 L37,13 Q37,2 50,2 Q63,2 63,13 L63,24 L72,24 L72,12 Q72,0 78,0 Q84,0 84,12 L84,24 L91,24 L91,20 L93,20 L93,24 L100,24 L100,40 Z" fill="rgba(251,240,232,0.9)"/>
          </svg>
        </div>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'16px 12px'}}>
          <div style={{width:'40px',height:'40px',borderRadius:'50%',border:'1px solid rgba(201,168,76,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',marginBottom:'10px'}}>ॐ</div>
          <div style={{fontFamily:'Italiana,serif',fontSize:'16px',color:'#FBF0E8',lineHeight:1.1,marginBottom:'5px'}}>Ananya</div>
          <div style={{fontFamily:'Cinzel,serif',fontSize:'8px',letterSpacing:'3px',color:'rgba(201,168,76,0.9)',marginBottom:'5px'}}>WEDS</div>
          <div style={{fontFamily:'Italiana,serif',fontSize:'16px',color:'rgba(180,220,210,0.95)',lineHeight:1.1}}>Arjun</div>
          <div style={{width:'22px',height:'1px',background:'rgba(201,168,76,0.6)',margin:'8px auto'}}/>
          <div style={{fontFamily:'Cinzel,serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(201,168,76,0.6)'}}>NOV 2025</div>
        </div>
      </div>
    ),
    2:()=>( // Garden Romance — cream + botanical stems
      <div style={{...fill,background:'#FAF7F0'}}>
        <svg style={{position:'absolute',left:0,top:0,width:'20px',height:'100%',opacity:.45}} viewBox="0 0 20 120" preserveAspectRatio="none"><line x1="10" y1="0" x2="10" y2="120" stroke="#8B7355" strokeWidth=".8"/><ellipse cx="10" cy="22" rx="7" ry="4" transform="rotate(-30,10,22)" fill="#8B735530"/><ellipse cx="10" cy="22" rx="7" ry="4" transform="rotate(30,10,22)" fill="#8B735530"/><circle cx="10" cy="22" r="2.5" fill="#8B735566"/><ellipse cx="10" cy="56" rx="8" ry="4.5" transform="rotate(-42,10,56)" fill="#7A9E7E30"/><circle cx="10" cy="56" r="3" fill="#7A9E7E55"/><ellipse cx="10" cy="92" rx="7" ry="4" transform="rotate(-20,10,92)" fill="#8B735530"/><circle cx="10" cy="92" r="2.5" fill="#8B735566"/></svg>
        <svg style={{position:'absolute',right:0,top:0,width:'20px',height:'100%',opacity:.45,transform:'scaleX(-1)'}} viewBox="0 0 20 120" preserveAspectRatio="none"><line x1="10" y1="0" x2="10" y2="120" stroke="#8B7355" strokeWidth=".8"/><ellipse cx="10" cy="22" rx="7" ry="4" transform="rotate(-30,10,22)" fill="#8B735530"/><ellipse cx="10" cy="22" rx="7" ry="4" transform="rotate(30,10,22)" fill="#8B735530"/><circle cx="10" cy="22" r="2.5" fill="#8B735566"/><ellipse cx="10" cy="56" rx="8" ry="4.5" transform="rotate(-42,10,56)" fill="#7A9E7E30"/><circle cx="10" cy="56" r="3" fill="#7A9E7E55"/><ellipse cx="10" cy="92" rx="7" ry="4" transform="rotate(-20,10,92)" fill="#8B735530"/><circle cx="10" cy="92" r="2.5" fill="#8B735566"/></svg>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'14px 24px',textAlign:'center'}}>
          <div style={{fontFamily:'Dancing Script,cursive',fontSize:'21px',color:'#7A6042',lineHeight:1}}>Ananya</div>
          <div style={{fontSize:'14px',color:'#8B7355',margin:'3px 0'}}>&amp;</div>
          <div style={{fontFamily:'Dancing Script,cursive',fontSize:'21px',color:'#4A7A4A',lineHeight:1}}>Arjun</div>
          <div style={{width:'18px',height:'1px',background:'#8B735566',margin:'7px auto'}}/>
          <div style={{fontFamily:'Jost,sans-serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(26,18,8,0.45)',textTransform:'uppercase'}}>Nov 2025</div>
        </div>
      </div>
    ),
    3:()=>( // Ink & Press — pure white, Syne 800 massive
      <div style={{...fill,background:'#FFFFFF'}}>
        <div style={{position:'absolute',inset:0,padding:'14px 12px',display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:'18px'}}>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'6px',letterSpacing:'3px',color:'rgba(184,69,32,0.75)',textTransform:'uppercase',marginBottom:'7px'}}>— THE WEDDING OF</div>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'24px',fontWeight:'800',lineHeight:.85,letterSpacing:'-0.5px',color:'#0A0906'}}>ANANYA</div>
          <div style={{width:'16px',height:'2px',background:'#B84520',margin:'5px 0'}}/>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'24px',fontWeight:'800',lineHeight:.85,letterSpacing:'-0.5px',color:'rgba(10,9,6,0.18)'}}>ARJUN</div>
          <div style={{marginTop:'9px',fontFamily:'DM Sans,sans-serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(10,9,6,0.38)',textTransform:'uppercase'}}>21 NOV 2025</div>
        </div>
        <div style={{position:'absolute',bottom:'12px',right:'12px',fontFamily:'Syne,sans-serif',fontSize:'30px',fontWeight:'800',color:'rgba(184,69,32,0.05)',lineHeight:1}}>25</div>
      </div>
    ),
    4:()=>( // Golden Hour — warm amber gradient + italic Cormorant
      <div style={{...fill,background:'linear-gradient(160deg,#FFF8EC,#FFE0A0)'}}>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'18px 12px',textAlign:'center'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(192,120,32,0.12)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}><div style={{width:'30px',height:'30px',borderRadius:'50%',background:'rgba(192,120,32,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>💍</div></div>
          <div style={{fontFamily:'Jost,sans-serif',fontSize:'7px',letterSpacing:'4px',color:'rgba(192,120,32,0.85)',textTransform:'uppercase',marginBottom:'8px',fontWeight:'300'}}>An Engagement</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',fontStyle:'italic',fontWeight:'300',color:'#A06010',lineHeight:1}}>Ananya</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'13px',color:'#C07820',margin:'3px 0',fontStyle:'italic'}}>&amp;</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',fontStyle:'italic',fontWeight:'300',color:'rgba(26,14,0,0.45)',lineHeight:1}}>Arjun</div>
          <div style={{width:'18px',height:'1px',background:'rgba(192,120,32,0.5)',margin:'8px auto'}}/>
          <div style={{fontFamily:'Jost,sans-serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(26,14,0,0.45)',textTransform:'uppercase',fontWeight:'300'}}>Nov 2025</div>
        </div>
      </div>
    ),
    5:()=>( // Modern Vow — sage + geometric circle + ultra-thin
      <div style={{...fill,background:'#F0F5F4'}}>
        <div style={{position:'absolute',inset:0,padding:'14px 12px'}}>
          <div style={{position:'absolute',top:'-6px',left:'-6px',opacity:.08}}><svg viewBox="0 0 80 80" style={{width:'80px',height:'80px'}}><circle cx="40" cy="40" r="36" fill="none" stroke="#006B5E" strokeWidth="1"/><circle cx="40" cy="40" r="24" fill="none" stroke="#006B5E" strokeWidth=".5"/><line x1="4" y1="40" x2="76" y2="40" stroke="#006B5E" strokeWidth=".4"/><line x1="40" y1="4" x2="40" y2="76" stroke="#006B5E" strokeWidth=".4"/></svg></div>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'7px',letterSpacing:'4px',color:'#006B5E',textTransform:'uppercase',marginBottom:'10px',fontWeight:'500',marginTop:'4px'}}>Engagement</div>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'20px',fontWeight:'300',lineHeight:.9,color:'#0A0F0E',letterSpacing:'-0.5px'}}>Ananya</div>
          <div style={{display:'flex',alignItems:'center',gap:'5px',margin:'5px 0'}}><div style={{flex:1,height:'1px',background:'#006B5E'}}/><span style={{fontSize:'10px',color:'#006B5E'}}>&</span><div style={{flex:1,height:'1px',background:'rgba(10,15,14,0.1)'}}/></div>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'20px',fontWeight:'300',lineHeight:.9,color:'rgba(10,15,14,0.25)',letterSpacing:'-0.5px'}}>Arjun</div>
          <div style={{marginTop:'10px',fontFamily:'DM Sans,sans-serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(10,15,14,0.38)',textTransform:'uppercase',fontWeight:'300'}}>Nov 2025</div>
        </div>
      </div>
    ),
    6:()=>( // Velvet Noir — deep purple + gold filigree
      <div style={{...fill,background:'radial-gradient(ellipse at 50% 30%,#1D0A35,#0D0018)'}}>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'14px 10px',textAlign:'center'}}>
          <svg style={{width:'80px',height:'auto',opacity:.5,marginBottom:'10px'}} viewBox="0 0 160 28" fill="none" stroke="#D4AF37" strokeWidth=".7"><path d="M80,14 L5,14"/><path d="M80,14 L155,14"/><path d="M5,14 Q5,4 15,4 Q25,4 25,14 Q25,24 15,24 Q5,24 5,14"/><path d="M155,14 Q155,4 145,4 Q135,4 135,14 Q135,24 145,24 Q155,24 155,14"/><circle cx="80" cy="14" r="4" fill="#D4AF3730"/><circle cx="80" cy="14" r="1.5" fill="#D4AF37AA"/></svg>
          <div style={{fontFamily:'Fraunces,serif',fontSize:'20px',fontStyle:'italic',fontWeight:'300',color:'#E0B0FF',lineHeight:1,marginBottom:'4px'}}>Ananya</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:'12px',color:'#D4AF37',margin:'3px 0'}}>&amp;</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:'20px',fontStyle:'italic',fontWeight:'300',color:'rgba(240,232,255,0.38)',lineHeight:1}}>Arjun</div>
          <svg style={{width:'80px',height:'auto',opacity:.45,margin:'10px auto 7px',transform:'rotate(180deg)'}} viewBox="0 0 160 28" fill="none" stroke="#D4AF37" strokeWidth=".7"><path d="M80,14 L5,14"/><path d="M80,14 L155,14"/><circle cx="80" cy="14" r="4" fill="#D4AF3730"/><circle cx="80" cy="14" r="1.5" fill="#D4AF37AA"/></svg>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'7px',letterSpacing:'3px',color:'rgba(212,175,55,0.55)',textTransform:'uppercase'}}>NOV 2025</div>
        </div>
      </div>
    ),
    7:()=>( // Celestial — navy + stars + constellation
      <div style={{...fill,background:'#020918'}}>
        {[...Array(20)].map((_,i)=><div key={i} style={{position:'absolute',width:`${0.8+Math.random()*1.2}px`,height:`${0.8+Math.random()*1.2}px`,borderRadius:'50%',background:`rgba(180,210,255,${0.25+Math.random()*0.65})`,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`}}/>)}
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'18px 12px',textAlign:'center'}}>
          <div style={{fontFamily:'Cinzel,serif',fontSize:'7px',letterSpacing:'5px',color:'rgba(126,184,247,0.6)',textTransform:'uppercase',marginBottom:'12px'}}>SAVE THE DATE</div>
          <div style={{fontFamily:'Cinzel,serif',fontSize:'15px',fontWeight:'400',letterSpacing:'2px',color:'#E8F2FF',textTransform:'uppercase',lineHeight:1.1}}>ANANYA</div>
          <svg style={{width:'16px',height:'36px',opacity:.6,margin:'4px 0'}} viewBox="0 0 16 36"><line x1="8" y1="0" x2="8" y2="36" stroke="#7EB8F7" strokeWidth=".7"/><circle cx="8" cy="4" r="1.5" fill="#7EB8F7"/><circle cx="8" cy="18" r="2.5" fill="rgba(126,184,247,0.5)"/><circle cx="8" cy="32" r="1.5" fill="#7EB8F7"/></svg>
          <div style={{fontFamily:'Cinzel,serif',fontSize:'15px',fontWeight:'400',letterSpacing:'2px',color:'rgba(232,242,255,0.42)',textTransform:'uppercase',lineHeight:1.1}}>ARJUN</div>
          <div style={{width:'14px',height:'1px',background:'rgba(126,184,247,0.4)',margin:'9px auto'}}/>
          <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'7px',letterSpacing:'2px',color:'rgba(126,184,247,0.45)',textTransform:'uppercase',fontWeight:'300'}}>NOV 2025</div>
        </div>
      </div>
    ),
    8:()=>( // Vintage Post — aged cream + perforated edges + stamp
      <div style={{...fill,background:'#E8DCC8',display:'flex',alignItems:'center',justifyContent:'center',padding:'6px'}}>
        <div style={{width:'100%',background:'#FEF9ED',position:'relative'}}>
          <div style={{height:'10px',background:'#E8DCC8',backgroundImage:'radial-gradient(circle,#E8DCC8 50%,transparent 51%)',backgroundSize:'10px 10px',backgroundRepeat:'repeat-x'}}/>
          <div style={{padding:'10px 10px 8px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
              <div style={{fontSize:'6px',letterSpacing:'2px',color:'rgba(139,69,19,0.55)',textTransform:'uppercase'}}>Wedding Invite</div>
              <div style={{width:'18px',height:'22px',border:'1px solid rgba(139,69,19,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px'}}>💌</div>
            </div>
            <div style={{height:'1px',background:'rgba(139,69,19,0.18)',marginBottom:'7px'}}/>
            <div style={{fontFamily:'IM Fell English,serif',fontSize:'16px',fontStyle:'italic',color:'#8B1A1A',lineHeight:1,textAlign:'center'}}>Ananya</div>
            <div style={{fontSize:'11px',color:'rgba(139,69,19,0.55)',textAlign:'center',fontStyle:'italic',margin:'2px 0'}}>&amp;</div>
            <div style={{fontFamily:'IM Fell English,serif',fontSize:'16px',fontStyle:'italic',color:'rgba(26,18,8,0.42)',lineHeight:1,textAlign:'center'}}>Arjun</div>
            <div style={{height:'1px',background:'repeating-linear-gradient(90deg,rgba(139,69,19,0.22) 0,rgba(139,69,19,0.22) 3px,transparent 3px,transparent 6px)',margin:'7px 0'}}/>
            <div style={{fontSize:'6px',letterSpacing:'1px',color:'rgba(26,18,8,0.4)',textAlign:'center',textTransform:'uppercase'}}>Nov 2025 · Mumbai</div>
          </div>
          <div style={{height:'10px',background:'#E8DCC8',backgroundImage:'radial-gradient(circle,#E8DCC8 50%,transparent 51%)',backgroundSize:'10px 10px',backgroundRepeat:'repeat-x'}}/>
        </div>
      </div>
    ),
    9:()=>( // Pure Type — pure white, Syne 800 bottom-aligned, zero decoration
      <div style={{...fill,background:'#FAFAFA',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'14px'}}>
        <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'6px',letterSpacing:'3px',color:'rgba(10,10,10,0.32)',textTransform:'uppercase',marginBottom:'10px'}}>Save the Date</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'28px',fontWeight:'800',lineHeight:.84,letterSpacing:'-1px',color:'#0A0A0A'}}>ANANYA</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'11px',fontWeight:'400',letterSpacing:'4px',color:'#C24B22',margin:'4px 0'}}>&amp;</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'28px',fontWeight:'800',lineHeight:.84,letterSpacing:'-1px',color:'rgba(10,10,10,0.17)'}}>ARJUN</div>
        <div style={{width:'100%',height:'1px',background:'rgba(10,10,10,0.06)',margin:'10px 0'}}/>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'7px',fontWeight:'400',color:'rgba(10,10,10,0.32)',letterSpacing:'2px'}}>21 NOV 2025 · MUMBAI</div>
      </div>
    ),
  }
  const C = renders[t.id]
  return <div style={wrap}>{C ? <C/> : <div style={{...fill,background:t.col}}/>}</div>
}

function PhoneCard({t, onClick}){
  const[h,sH]=useState(false)
  return(
    <div onClick={()=>onClick(t)} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{cursor:'pointer',transition:'transform .25s, opacity .2s',transform:h?'translateY(-5px)':'none'}}>
      {/* Phone frame */}
      <div style={{background:'#1C1C1E',borderRadius:'32px',padding:'10px',
        boxShadow:h?'0 28px 70px rgba(0,0,0,0.22)':'0 8px 32px rgba(0,0,0,0.12)',
        transition:'box-shadow .25s',position:'relative'}}>
        {/* Speaker notch */}
        <div style={{position:'absolute',top:'10px',left:'50%',transform:'translateX(-50%)',
          width:'44px',height:'9px',background:'#0A0A0A',borderRadius:'0 0 7px 7px',zIndex:2}}/>
        {/* Screen */}
        <div style={{borderRadius:'24px',overflow:'hidden',position:'relative'}}>
          <Thumb t={t}/>
          {/* Hover overlay */}
          {h&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.26)',
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'rgba(255,255,255,0.95)',padding:'7px 16px',
              borderRadius:'100px',fontSize:'13px',fontWeight:'600',color:'#111'}}>
              {t.isUpload?'Upload':'Preview'}
            </div>
          </div>}
        </div>
        {/* Home indicator */}
        <div style={{height:'4px',width:'32px',background:'rgba(255,255,255,0.3)',
          borderRadius:'2px',margin:'8px auto 2px'}}/>
      </div>
      {/* Label */}
      <div style={{marginTop:'14px',textAlign:'center'}}>
        <div style={{fontSize:'15px',fontWeight:'600',color:'#111',marginBottom:'3px',
          fontFamily:'system-ui,sans-serif'}}>{t.name}</div>
        <div style={{fontSize:'13px',color:'#888',fontFamily:'system-ui,sans-serif'}}>{t.tagline}</div>
      </div>
    </div>
  )
}


// ─── GALLERY ──────────────────────────────────────────────────────────────
function Gallery({onPreview,onUpload}){
  const[filter,setFilter]=useState('all')
  const filtered=TEMPLATES.filter(t=>filter==='all'||t.isUpload||(t.type===filter))
  return(
    <div style={{minHeight:'100vh',background:'#EBEBEB',fontFamily:'system-ui,sans-serif'}}>
      <style>{`@import url('${GF}');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <nav style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 40px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontSize:'14px',color:'#333',cursor:'pointer'}}>Templates</div>
        <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'#111',letterSpacing:'.5px'}}>Teal Media Works</div>
        <div style={{fontSize:'14px',color:'#333',cursor:'pointer'}}>Contact Us</div>
      </nav>
      <div style={{textAlign:'center',padding:'64px 24px 44px'}}>
        <h1 style={{fontSize:'clamp(24px,4vw,38px)',fontWeight:'700',color:'#111',marginBottom:'14px',letterSpacing:'-.5px'}}>Discover Featured Designs</h1>
        <p style={{fontSize:'15px',color:'#666',lineHeight:1.8,maxWidth:'460px',margin:'0 auto'}}>Beautiful wedding invitations, crafted to last forever. Preview any design, then customise it to make it yours.</p>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:'7px',padding:'0 24px 44px',flexWrap:'wrap'}}>
        {TYPES.map(tp=>(
          <button key={tp.v} onClick={()=>setFilter(tp.v)} style={{padding:'8px 20px',borderRadius:'100px',border:`1px solid ${filter===tp.v?'#111':'#ccc'}`,background:filter===tp.v?'#111':'#fff',color:filter===tp.v?'#fff':'#555',fontSize:'14px',cursor:'pointer',fontWeight:filter===tp.v?'500':'400',transition:'all .2s'}}>{tp.l}</button>
        ))}
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 clamp(20px,5vw,56px) 100px',
        display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
        gap:'48px 28px',alignItems:'start'}}>
        {filtered.map(t=>(
          <PhoneCard key={t.id} t={t} onClick={t.isUpload?onUpload:onPreview}/>
        ))}
      </div>
    </div>
  )
}

// ─── PREVIEW MODAL ────────────────────────────────────────────────────────
function PreviewModal({t,onClose,onCustomise}){
  const[dark,setDark]=useState(t.id===1||t.id===6||t.id===7||t.id===11)
  const[loading,setLoading]=useState(true)
  const[html,setHtml]=useState('')
  useEffect(()=>{
    setLoading(true)
    if(t.file){
      fetch('/templates/'+t.file)
        .then(r=>r.text())
        .then(h=>setHtml(injectWM(h)))
        .catch(()=>setHtml('<html><body style="font:16px sans-serif;padding:40px;color:#999;text-align:center"><br/><br/>Template file not found — add public/templates/'+t.file+'</body></html>'))
    } else {
      setHtml(injectWM(generateHTML(t.id,mkD(),dark)))
    }
  },[t.id,t.file,dark])
  return(
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,.78)',display:'flex',flexDirection:'column',backdropFilter:'blur(6px)'}}>
      <div style={{background:'#fff',height:'52px',display:'flex',alignItems:'center',padding:'0 20px',gap:'12px',flexShrink:0,borderBottom:'1px solid #eee'}}>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:'20px',color:'#888',lineHeight:1,padding:'2px 6px'}}>←</button>
        <span style={{fontWeight:'600',color:'#111',flex:1,fontSize:'15px'}}>{t.name}</span>
        <span style={{fontSize:'13px',color:'#999',fontStyle:'italic',display:'none'}} className="hide-sm">{t.tagline}</span>
        <div style={{display:'flex',alignItems:'center',gap:'7px',padding:'5px 12px',border:'1px solid #e0e0e0',borderRadius:'100px',background:'#f8f8f8',cursor:'pointer'}} onClick={()=>setDark(x=>!x)}>
          <span style={{fontSize:'12px',color:dark?'#aaa':'#111'}}>☀️ Light</span>
          <div style={{width:'36px',height:'20px',borderRadius:'10px',background:dark?'#1A1815':'#ddd',position:'relative',transition:'background .25s'}}>
            <div style={{position:'absolute',top:'3px',left:dark?'19px':'3px',width:'14px',height:'14px',borderRadius:'50%',background:'#fff',transition:'left .25s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
          </div>
          <span style={{fontSize:'12px',color:dark?'#111':'#aaa'}}>🌙 Dark</span>
        </div>
      </div>
      <div style={{flex:1,overflow:'hidden',position:'relative',background:'#111'}}>
        {loading&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:2,background:'#111',gap:'12px'}}><div style={{width:'30px',height:'30px',border:'3px solid rgba(255,255,255,.15)',borderTopColor:'rgba(255,255,255,.6)',borderRadius:'50%',animation:'sp .7s linear infinite'}}/><div style={{fontSize:'13px',color:'rgba(255,255,255,.35)',letterSpacing:'2px'}}>Rendering…</div></div>}
        <iframe srcDoc={html} style={{width:'100%',height:'100%',border:'none'}} onLoad={()=>setLoading(false)} title="Preview"/>
        <div style={{position:'absolute',bottom:'16px',left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,.65)',color:'rgba(255,255,255,.6)',fontSize:'11px',padding:'5px 14px',borderRadius:'100px',whiteSpace:'nowrap',pointerEvents:'none',backdropFilter:'blur(4px)'}}>Preview only · watermark removed after payment</div>
      </div>
      <div style={{background:'#fff',borderTop:'1px solid #eee',padding:'14px 20px',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
        <div><div style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{fontSize:'22px',fontWeight:'700',color:'#111'}}>₹{t.price}</span><span style={{padding:'3px 10px',borderRadius:'100px',background:'#FEF3C7',color:'#92400E',fontSize:'11px',fontWeight:'600'}}>🎉 Launch Offer</span></div><div style={{fontSize:'11px',color:'#999',marginTop:'1px'}}>One-time · Unlimited edits · Shareable link</div></div>
        <div style={{flex:1}}/>
        <button onClick={onClose} style={{padding:'10px 18px',border:'1px solid #e0e0e0',background:'transparent',borderRadius:'4px',cursor:'pointer',fontSize:'14px',color:'#666'}}>← Back</button>
        <button onClick={()=>onCustomise(t,dark)} style={{padding:'12px 24px',background:'#111',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>Customise This Template →</button>
      </div>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}


// ─── BUILDER ─────────────────────────────────────────────────────────────
const G={bg:'#FAFAF8',surface:'#FFFFFF',border:'#E4E0D6',text:'#1A1815',textSec:'#5A5650',textMuted:'#9E9A94',gold:'#B8912A',goldLight:'#FBF5E6',goldBorder:'#E0D098',radius:'4px',shadow:'0 1px 4px rgba(0,0,0,.07)'}

function Inp({label,value,onChange,type='text',placeholder='',multi,rows=3,hint}){
  const[f,sF]=useState(false)
  const base={width:'100%',padding:'9px 11px',border:`1px solid ${f?G.gold:G.border}`,borderRadius:G.radius,background:'#fff',color:G.text,fontSize:'14px',outline:'none',transition:'border-color .2s',fontFamily:'inherit'}
  return(
    <div style={{marginBottom:'16px'}}>
      {label&&<div style={{fontSize:'12px',fontWeight:'600',color:G.textSec,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div>}
      {multi?<textarea value={value||''} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...base,resize:'vertical',lineHeight:1.6}} onFocus={()=>sF(true)} onBlur={()=>sF(false)}/>
            :<input type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={()=>sF(true)} onBlur={()=>sF(false)}/>}
      {hint&&<div style={{fontSize:'11px',color:G.textMuted,marginTop:'3px'}}>{hint}</div>}
    </div>
  )
}
function Tog({label,checked,onChange,desc}){
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${G.border}`}}>
      <div><div style={{fontSize:'14px',color:G.text}}>{label}</div>{desc&&<div style={{fontSize:'11px',color:G.textMuted,marginTop:'1px'}}>{desc}</div>}</div>
      <div onClick={()=>onChange(!checked)} style={{width:'38px',height:'22px',borderRadius:'11px',background:checked?G.gold:G.border,cursor:'pointer',position:'relative',transition:'background .25s',flexShrink:0,marginLeft:'14px'}}>
        <div style={{position:'absolute',top:'3px',left:checked?'19px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .25s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
      </div>
    </div>
  )
}
function Sec({label}){return <div style={{fontSize:'11px',fontWeight:'600',color:G.textMuted,textTransform:'uppercase',letterSpacing:'1px',margin:'20px 0 10px',paddingBottom:'6px',borderBottom:`1px solid ${G.border}`}}>{label}</div>}

function Builder({t,initDark,onBack,onPay,customHTML:initCustom}){
  const[dark,setDark]=useState(initDark)
  const[d,setD]=useState(()=>{const base=mkD();if(initCustom)base.customHTML=initCustom;return base})
  const[step,setStep]=useState(0)
  const[fullPrev,setFP]=useState(false)
  const upd=(k,v)=>setD(p=>({...p,[k]:v}))
  const updC=(id,k,v)=>setD(p=>({...p,ceremonies:p.ceremonies.map(c=>c.id===id?{...c,[k]:v}:c)}))
  const updRF=(k,v)=>setD(p=>({...p,rsvpFields:{...p.rsvpFields,[k]:v}}))
  const addCer=()=>setD(p=>({...p,ceremonies:[...p.ceremonies,{id:Date.now(),enabled:true,name:'Event',icon:'⭐',date:'',time:'',venue:'',address:'',maps:''}]}))
  const delCer=(id)=>setD(p=>({...p,ceremonies:p.ceremonies.filter(c=>c.id!==id)}))
  const html=generateHTML(t.id,d,dark)

  const steps=[
    {l:'Couple',icon:'💑',form:(
      <div>
        <Inp label="Bride's Full Name" value={d.bride} onChange={v=>upd('bride',v)} placeholder="Ananya Sharma"/>
        <Inp label="Groom's Full Name" value={d.groom} onChange={v=>upd('groom',v)} placeholder="Arjun Mehta"/>
        <Inp label="Your Story (optional)" value={d.story} onChange={v=>upd('story',v)} multi rows={3} placeholder="How you met…"/>
        <Inp label="Hashtag (optional)" value={d.hashtag} onChange={v=>upd('hashtag',v)} placeholder="#AnanyaWedArjun"/>
      </div>
    )},
    {l:'Family',icon:'👨‍👩‍👧',form:(
      <div>
        <Sec label="Show family section as"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px',marginBottom:'18px'}}>
          {[['none','Hide'],['parents','Parents Only'],['grandparents','Grandparents Only'],['both','Both']].map(([v,l])=>(
            <div key={v} onClick={()=>upd('familyMode',v)} style={{padding:'9px 12px',border:`1px solid ${d.familyMode===v?G.gold:G.border}`,borderRadius:G.radius,cursor:'pointer',background:d.familyMode===v?G.goldLight:'#fff',fontSize:'13px',color:d.familyMode===v?G.gold:G.textSec,textAlign:'center',fontWeight:d.familyMode===v?'500':'400',transition:'all .2s'}}>{l}</div>
          ))}
        </div>
        {d.familyMode!=='none'&&<>
          {(d.familyMode==='parents'||d.familyMode==='both')&&<><Inp label="Bride's Parents" value={d.brideParents} onChange={v=>upd('brideParents',v)} placeholder="Mr. Suresh & Mrs. Priya Sharma"/><Inp label="Groom's Parents" value={d.groomParents} onChange={v=>upd('groomParents',v)} placeholder="Mr. Ashok & Mrs. Kamini Mehta"/></>}
          {(d.familyMode==='grandparents'||d.familyMode==='both')&&<><Inp label="Bride's Grandparents" value={d.brideGP} onChange={v=>upd('brideGP',v)} placeholder="Late Shri Ram Sharma & Smt. Savitri Devi"/><Inp label="Groom's Grandparents" value={d.groomGP} onChange={v=>upd('groomGP',v)} placeholder="Late Shri Gopal Mehta & Smt. Pushpa Devi"/></>}
        </>}
      </div>
    )},
    {l:'Events',icon:'📅',form:(
      <div>
        <div style={{marginBottom:'12px',fontSize:'13px',color:G.textMuted}}>Toggle events on/off. Not all functions will appear if disabled.</div>
        {d.ceremonies.map((c,i)=>(
          <div key={c.id} style={{border:`1px solid ${c.enabled?G.border:'#eee'}`,borderRadius:'6px',marginBottom:'10px',overflow:'hidden',background:c.enabled?'#fff':'#fafafa',opacity:c.enabled?1:.7,transition:'all .2s'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 12px',background:c.enabled?G.goldLight:'#f5f5f5',borderBottom:`1px solid ${G.border}`}}>
              <span style={{fontSize:'16px'}}>{c.icon}</span>
              <span style={{fontWeight:'600',fontSize:'13px',color:G.text,flex:1}}>{c.name}</span>
              <div onClick={()=>updC(c.id,'enabled',!c.enabled)} style={{width:'34px',height:'19px',borderRadius:'9.5px',background:c.enabled?G.gold:G.border,cursor:'pointer',position:'relative',transition:'background .25s',flexShrink:0}}>
                <div style={{position:'absolute',top:'2.5px',left:c.enabled?'17px':'2.5px',width:'14px',height:'14px',borderRadius:'50%',background:'#fff',transition:'left .25s'}}/>
              </div>
              {d.ceremonies.length>1&&<button onClick={()=>delCer(c.id)} style={{background:'none',border:'none',color:'#EF4444',cursor:'pointer',fontSize:'15px',padding:'0 2px',lineHeight:1}}>✕</button>}
            </div>
            {c.enabled&&<div style={{padding:'12px'}}>
              <div style={{display:'flex',gap:'8px'}}>
                {ICONS.map(ic=><button key={ic} onClick={()=>updC(c.id,'icon',ic)} style={{fontSize:'16px',background:c.icon===ic?G.goldLight:'transparent',border:`1px solid ${c.icon===ic?G.gold:'transparent'}`,borderRadius:'4px',cursor:'pointer',padding:'3px',lineHeight:1}}>{ic}</button>)}
              </div>
              <div style={{height:'8px'}}/>
              <Inp label="Event Name" value={c.name} onChange={v=>updC(c.id,'name',v)} placeholder="Sangeet"/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <Inp label="Date" value={c.date} onChange={v=>updC(c.id,'date',v)} type="date"/>
                <Inp label="Time" value={c.time} onChange={v=>updC(c.id,'time',v)} type="time"/>
              </div>
              <Inp label="Venue Name" value={c.venue} onChange={v=>updC(c.id,'venue',v)} placeholder="Taj Mahal Palace"/>
              <Inp label="Full Address" value={c.address} onChange={v=>updC(c.id,'address',v)} placeholder="Apollo Bunder, Colaba, Mumbai"/>
              <Inp label="Google Maps Link (optional)" value={c.maps} onChange={v=>updC(c.id,'maps',v)} placeholder="https://maps.google.com/..." hint="Guests can tap to navigate directly"/>
            </div>}
          </div>
        ))}
        <button onClick={addCer} style={{width:'100%',padding:'9px',border:`1px dashed ${G.border}`,borderRadius:G.radius,background:'transparent',cursor:'pointer',fontSize:'13px',color:G.textSec}}>+ Add Event</button>
        <Sec label="Main Venue"/>
        <Inp label="Venue Name" value={d.mainVenue} onChange={v=>upd('mainVenue',v)} placeholder="Taj Mahal Palace"/>
        <Inp label="Full Address" value={d.mainAddress} onChange={v=>upd('mainAddress',v)} placeholder="Apollo Bunder, Colaba, Mumbai"/>
        <Inp label="Google Maps Link" value={d.mainMaps} onChange={v=>upd('mainMaps',v)} placeholder="https://maps.google.com/..."/>
      </div>
    )},
    {l:'RSVP',icon:'✉️',form:(
      <div>
        <Tog label="Enable RSVP" desc="Add a response form for guests" checked={d.rsvpEnabled} onChange={v=>upd('rsvpEnabled',v)}/>
        {d.rsvpEnabled&&<>
          <div style={{height:'14px'}}/>
          <Inp label="RSVP Deadline" value={d.rsvpDeadline} onChange={v=>upd('rsvpDeadline',v)} type="date"/>
          <Sec label="Fields to collect"/>
          {RSVP_FIELDS_LIST.map(f=><Tog key={f.k} label={f.l} checked={d.rsvpFields[f.k]||false} onChange={v=>updRF(f.k,v)}/>)}
        </>}
      </div>
    )},
    {l:'Content',icon:'📝',form:(
      <div>
        <Inp label="Welcome Message" value={d.welcome} onChange={v=>upd('welcome',v)} multi rows={3} placeholder="With hearts full of joy…"/>
        <Inp label="Dress Code" value={d.dressCode} onChange={v=>upd('dressCode',v)} placeholder="Ethnic Wear"/>
        <Inp label="Contact Name" value={d.contactName} onChange={v=>upd('contactName',v)} placeholder="Ananya Sharma"/>
        <Inp label="Contact Phone" value={d.contactPhone} onChange={v=>upd('contactPhone',v)} type="tel" placeholder="+91 98765 43210"/>
        {t.id===10&&<>
          <Sec label="Custom HTML Template"/>
          <div style={{fontSize:'12px',color:G.textMuted,marginBottom:'10px',lineHeight:1.6}}>Use placeholders like <code style={{background:'#f0f0f0',padding:'1px 5px',borderRadius:'3px',fontSize:'11px'}}>{'{{BRIDE}}'}</code>, <code style={{background:'#f0f0f0',padding:'1px 5px',borderRadius:'3px',fontSize:'11px'}}>{'{{GROOM}}'}</code>, <code style={{background:'#f0f0f0',padding:'1px 5px',borderRadius:'3px',fontSize:'11px'}}>{'{{CEREMONIES}}'}</code>, <code style={{background:'#f0f0f0',padding:'1px 5px',borderRadius:'3px',fontSize:'11px'}}>{'{{RSVP}}'}</code> etc. in your HTML.</div>
          <div style={{padding:'12px',border:`2px dashed ${G.border}`,borderRadius:G.radius,textAlign:'center',cursor:'pointer',background:'#fafafa'}} onClick={()=>document.getElementById('htmlUpload').click()}>
            {d.customHTML?<div style={{fontSize:'13px',color:'#10B981',fontWeight:'600'}}>✓ Template uploaded — {(d.customHTML.length/1024).toFixed(1)}KB</div>:<div style={{fontSize:'13px',color:G.textMuted}}>📄 Click to upload HTML file</div>}
            <input id="htmlUpload" type="file" accept=".html,.htm" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>upd('customHTML',ev.target.result);r.readAsText(f);}}}/>
          </div>
        </>}
      </div>
    )},
  ]

  return(
    <div style={{display:'flex',height:'100vh',fontFamily:'DM Sans,sans-serif',overflow:'hidden',background:G.bg}}>
      <style>{`@import url('${GF}');*{box-sizing:border-box;margin:0;padding:0}@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      {/* Sidebar icons */}
      <div style={{width:'60px',background:'#111',display:'flex',flexDirection:'column',alignItems:'center',padding:'14px 0',gap:'2px',flexShrink:0}}>
        <div style={{fontSize:'16px',marginBottom:'12px',cursor:'pointer',color:'rgba(255,255,255,.6)',padding:'6px'}} onClick={onBack} title="Back to Gallery">←</div>
        {steps.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} title={s.l} style={{width:'44px',height:'44px',borderRadius:'8px',border:'none',background:step===i?'rgba(255,255,255,.15)':'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2px',transition:'background .2s'}}>
            <span style={{fontSize:'15px'}}>{s.icon}</span>
            <span style={{fontSize:'7px',color:step===i?'#fff':'rgba(255,255,255,.35)',letterSpacing:'.3px',textTransform:'uppercase'}}>{s.l.slice(0,5)}</span>
          </button>
        ))}
      </div>
      {/* Form panel */}
      <div style={{width:'320px',background:'#fff',borderRight:`1px solid ${G.border}`,display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'14px 18px',borderBottom:`1px solid ${G.border}`,display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
          <span style={{fontSize:'16px'}}>{steps[step].icon}</span>
          <span style={{fontWeight:'600',color:G.text,fontSize:'15px'}}>{steps[step].l}</span>
          <span style={{marginLeft:'auto',fontSize:'11px',color:G.textMuted}}>{step+1}/{steps.length}</span>
        </div>
        <div style={{flex:1,overflow:'auto',padding:'18px'}}>{steps[step].form}</div>
        <div style={{padding:'12px 18px',borderTop:`1px solid ${G.border}`,display:'flex',gap:'7px',flexShrink:0}}>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{padding:'9px 14px',border:`1px solid ${G.border}`,background:'transparent',borderRadius:G.radius,cursor:'pointer',fontSize:'13px',color:G.textSec}}>←</button>}
          <div style={{flex:1}}/>
          {step<steps.length-1
            ?<button onClick={()=>setStep(s=>s+1)} style={{padding:'9px 20px',background:'#111',color:'#fff',border:'none',borderRadius:G.radius,cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>Next →</button>
            :<button onClick={()=>{
  const doDownload=(rawHtml)=>{
    const clean=rawHtml.replace(/<div id="tmw-watermark"[\s\S]*?<\/div>/,'')
    const final=applyPlaceholders(clean,d)
    const b=new Blob([final],{type:"text/html"})
    const a=document.createElement("a")
    a.href=URL.createObjectURL(b)
    a.download=`${d.bride.replace(/ .*/,"")}_${d.groom.replace(/ .*/,"")}_invite.html`
    document.body.appendChild(a);a.click();document.body.removeChild(a)
  }
  if(t.file){fetch('/templates/'+t.file).then(r=>r.text()).then(doDownload)}
  else{doDownload(generateHTML(t.id,d,dark))}
}} style={{padding:"9px 20px",background:"#006B5E",color:"#fff",border:"none",borderRadius:G.radius,cursor:"pointer",fontSize:"13px",fontWeight:"600"}}>📥 Download Invite</button>
          }
        </div>
      </div>
      {/* Live preview */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#1a1a1a'}}>
        <div style={{background:'#222',height:'44px',display:'flex',alignItems:'center',padding:'0 14px',gap:'10px',flexShrink:0}}>
          <span style={{fontSize:'10px',color:'rgba(255,255,255,.35)',letterSpacing:'.5px',textTransform:'uppercase'}}>Live Preview</span>
          <div style={{flex:1}}/>
          <span style={{fontSize:'10px',color:'rgba(255,255,255,.35)'}}>Light</span>
          <div onClick={()=>setDark(x=>!x)} style={{width:'32px',height:'18px',borderRadius:'9px',background:dark?'rgba(255,255,255,.25)':'rgba(255,255,255,.1)',cursor:'pointer',position:'relative',transition:'background .25s'}}>
            <div style={{position:'absolute',top:'2px',left:dark?'16px':'2px',width:'14px',height:'14px',borderRadius:'50%',background:'#fff',transition:'left .25s'}}/>
          </div>
          <span style={{fontSize:'10px',color:'rgba(255,255,255,.35)'}}>Dark</span>
          <button onClick={()=>setFP(true)} style={{padding:'4px 10px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.55)',borderRadius:'4px',cursor:'pointer',fontSize:'11px',marginLeft:'4px'}}>⛶</button>
        </div>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',overflow:'hidden'}}>
          <div style={{width:'min(88%,420px)',height:'min(88%,740px)',borderRadius:'8px',overflow:'hidden',boxShadow:'0 18px 56px rgba(0,0,0,.5)'}}>
            <iframe srcDoc={html} style={{width:'100%',height:'100%',border:'none'}} title="Live Preview"/>
          </div>
        </div>
      </div>
      {fullPrev&&<div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,.9)',display:'flex',flexDirection:'column'}}>
        <div style={{background:'#fff',height:'46px',display:'flex',alignItems:'center',padding:'0 16px',gap:'12px',flexShrink:0,borderBottom:'1px solid #eee'}}>
          <button onClick={()=>setFP(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#888'}}>✕</button>
          <span style={{fontWeight:'600',color:'#111'}}>{t.name}</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'7px'}}>
            <span style={{fontSize:'12px',color:'#666'}}>Light</span>
            <div onClick={()=>setDark(x=>!x)} style={{width:'36px',height:'20px',borderRadius:'10px',background:dark?'#1A1815':'#ddd',cursor:'pointer',position:'relative',transition:'background .25s'}}><div style={{position:'absolute',top:'3px',left:dark?'19px':'3px',width:'14px',height:'14px',borderRadius:'50%',background:'#fff',transition:'left .25s'}}/></div>
            <span style={{fontSize:'12px',color:'#666'}}>Dark</span>
          </div>
        </div>
        <iframe srcDoc={html} style={{flex:1,border:'none'}} title="Full Preview"/>
      </div>}
    </div>
  )
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────
function PayModal({t,d,onClose}){
  const[st,setSt]=useState('qr')
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[wa,setWa]=useState('')
  const bFirst=d?.bride?.split(' ')[0]?.toLowerCase()||'bride'
  const gFirst=d?.groom?.split(' ')[0]?.toLowerCase()||'groom'
  const slug=`${bFirst}-${gFirst}-wedding`
  const link=`https://${slug}.netlify.app`
  const upi=`upi://pay?pa=tealmediaworks@paytm&pn=Teal+Media+Works&am=${t.price}&cu=INR&tn=Wedding+Invite`

  const downloadInvite=()=>{
    const html=generateHTML(t.id,d||mkD(),false)
    const blob=new Blob([html],{type:'text/html'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url
    a.download=`${bFirst}_${gFirst}_invite.html`
    document.body.appendChild(a);a.click()
    document.body.removeChild(a);URL.revokeObjectURL(url)
  }

  const confirmPay=()=>{
    if(!name.trim()||!email.trim()||!wa.trim())return
    setSt('v')
    setTimeout(()=>{setSt('d');setTimeout(()=>setSt('done'),2800)},1800)
  }

  const inp=(label,val,set,type='text',ph='')=>(
    <div style={{marginBottom:'14px'}}>
      <div style={{fontSize:'12px',fontWeight:'600',color:'#555',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div>
      <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph}
        style={{width:'100%',padding:'10px 12px',border:'1px solid #e0e0e0',borderRadius:'6px',fontSize:'14px',outline:'none',color:'#111'}}
        onFocus={e=>e.target.style.borderColor='#006B5E'} onBlur={e=>e.target.style.borderColor='#e0e0e0'}/>
    </div>
  )

  return(
    <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',backdropFilter:'blur(6px)'}}>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}@keyframes pk{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
      <div style={{background:'#fff',borderRadius:'16px',padding:'34px 30px',maxWidth:'440px',width:'100%',textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,.28)',maxHeight:'90vh',overflowY:'auto'}}>

        {st==='qr'&&<>
          <div style={{fontSize:'30px',marginBottom:'10px'}}>💳</div>
          <div style={{fontSize:'20px',fontWeight:'700',color:'#111',marginBottom:'4px'}}>Complete Payment</div>
          <div style={{fontSize:'14px',color:'#888',marginBottom:'20px'}}>{t.name} · ₹{t.price} one-time</div>
          <div style={{border:'1px solid #eee',borderRadius:'12px',padding:'18px',marginBottom:'14px',background:'#fafafa'}}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upi)}`} alt="UPI QR" style={{width:'170px',height:'170px',display:'block',margin:'0 auto 10px',borderRadius:'8px'}} onError={e=>e.target.style.display='none'}/>
            <div style={{fontSize:'11px',color:'#aaa',marginBottom:'7px'}}>Scan with PhonePe, GPay, Paytm or any UPI app</div>
            <div style={{fontFamily:'monospace',fontSize:'13px',color:'#006B5E',padding:'5px 12px',background:'#e8f5f3',borderRadius:'6px',display:'inline-block'}}>tealmediaworks@paytm</div>
          </div>
          <div style={{fontSize:'12px',color:'#aaa',marginBottom:'18px'}}>After paying, click below to enter your details and deploy your site</div>
          <button onClick={()=>setSt('details')} style={{width:'100%',padding:'13px',background:'#006B5E',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:'pointer',marginBottom:'10px'}}>I've Paid — Enter My Details →</button>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#aaa',cursor:'pointer',fontSize:'13px'}}>Cancel</button>
        </>}

        {st==='details'&&<>
          <div style={{fontSize:'26px',marginBottom:'10px'}}>📋</div>
          <div style={{fontSize:'20px',fontWeight:'700',color:'#111',marginBottom:'4px'}}>Almost There!</div>
          <div style={{fontSize:'14px',color:'#888',marginBottom:'22px',lineHeight:1.6}}>Enter your details — we'll send your site login and credentials to these.</div>
          {inp('Your Full Name',name,setName,'text','Priya Sharma')}
          {inp('Email Address',email,setEmail,'email','you@email.com')}
          {inp('WhatsApp Number',wa,setWa,'tel','+91 98765 43210')}
          <div style={{background:'#f0f9f7',border:'1px solid #a7d8d0',borderRadius:'8px',padding:'12px',marginBottom:'18px',textAlign:'left'}}>
            <div style={{fontSize:'12px',color:'#006B5E',fontWeight:'600',marginBottom:'4px'}}>Your site will be live at:</div>
            <div style={{fontFamily:'monospace',fontSize:'12px',color:'#111',wordBreak:'break-all'}}>{link}</div>
          </div>
          <button onClick={confirmPay} disabled={!name.trim()||!email.trim()||!wa.trim()} style={{width:'100%',padding:'13px',background:(!name.trim()||!email.trim()||!wa.trim())?'#ccc':'#006B5E',color:'#fff',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:'600',cursor:(!name.trim()||!email.trim()||!wa.trim())?'not-allowed':'pointer',marginBottom:'10px'}}>Deploy My Invite →</button>
          <button onClick={()=>setSt('qr')} style={{background:'none',border:'none',color:'#aaa',cursor:'pointer',fontSize:'13px'}}>← Back</button>
        </>}

        {st==='v'&&<><div style={{width:'46px',height:'46px',border:'4px solid #e0e0e0',borderTopColor:'#006B5E',borderRadius:'50%',animation:'sp .8s linear infinite',margin:'0 auto 18px'}}/><div style={{fontSize:'18px',fontWeight:'600',color:'#111',marginBottom:'6px'}}>Verifying Payment…</div><div style={{fontSize:'14px',color:'#888'}}>Checking with payment gateway</div></>}

        {st==='d'&&<><div style={{width:'46px',height:'46px',border:'4px solid #e0e0e0',borderTopColor:'#006B5E',borderRadius:'50%',animation:'sp .8s linear infinite',margin:'0 auto 18px'}}/><div style={{fontSize:'18px',fontWeight:'600',color:'#111',marginBottom:'16px'}}>Deploying to Netlify…</div>{['✓ Payment confirmed','✓ Removing watermark','✓ Building your invite',`→ Deploying to ${link}…`].map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid #f5f5f5',textAlign:'left',animation:`pk .8s ${i*.25}s ease-in-out infinite`}}><span style={{color:s[0]==='✓'?'#10B981':'#006B5E',fontWeight:'700',fontSize:'14px'}}>{s[0]}</span><span style={{fontSize:'13px',color:'#555'}}>{s.slice(2)}</span></div>)}</>}

        {st==='done'&&<>
          <div style={{fontSize:'46px',marginBottom:'14px'}}>🎉</div>
          <div style={{fontSize:'20px',fontWeight:'700',color:'#111',marginBottom:'8px'}}>Your Invite is Live!</div>
          <div style={{background:'#e8f5f3',border:'1px solid #a7d8d0',borderRadius:'8px',padding:'13px',marginBottom:'14px'}}>
            <div style={{fontFamily:'monospace',fontSize:'12px',color:'#006B5E',wordBreak:'break-all',marginBottom:'4px'}}>{link}</div>
            <div style={{fontSize:'11px',color:'#888'}}>Login credentials sent to {email} and {wa}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px',marginBottom:'14px'}}>
            {[['📋 Copy Link',()=>navigator.clipboard?.writeText(link)],['📱 WhatsApp',()=>window.open(`https://wa.me/?text=You're invited! ${link}`)],['📧 Email',()=>window.open(`mailto:?subject=You're Invited!&body=${link}`)],['🔗 Open Site',()=>window.open(link,'_blank')]].map(([l,fn])=>(
              <button key={l} onClick={fn} style={{padding:'9px',border:'1px solid #e0e0e0',background:'#fff',borderRadius:'6px',cursor:'pointer',fontSize:'13px',color:'#555'}}>{l}</button>
            ))}
          </div>
          <button onClick={downloadInvite} style={{width:'100%',padding:'12px',background:'#1A1815',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'14px',fontWeight:'600',marginBottom:'10px'}}>📥 Download Invite HTML</button>
          <button onClick={onClose} style={{padding:'10px 20px',background:'transparent',border:'1px solid #e0e0e0',borderRadius:'6px',cursor:'pointer',fontSize:'13px',color:'#666'}}>Done ✓</button>
        <div style={{marginTop:'14px',padding:'12px 14px',background:'#e8f5f3',borderRadius:'8px',fontSize:'12px',color:'#006B5E',textAlign:'left',lineHeight:1.7}}><strong>📊 RSVP Dashboard:</strong><br/>Visit <a href="#/dashboard" style={{color:'#006B5E',fontWeight:'600'}} onClick={onClose}>tealmediaworks.in/#/dashboard</a><br/>to see guest responses in real time.</div>
        </>}

      </div>
    </div>
  )
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────
function UploadModal({onClose,onUse}){
  const[file,setFile]=useState(null),[html,setHtml]=useState(null)
  const load=e=>{const f=e.target.files[0];if(f){setFile(f);const r=new FileReader();r.onload=ev=>{setHtml(ev.target.result)};r.readAsText(f);}}
  return(
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',backdropFilter:'blur(6px)'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'32px 28px',maxWidth:'480px',width:'100%',boxShadow:'0 24px 80px rgba(0,0,0,.28)'}}>
        <div style={{fontWeight:'700',fontSize:'20px',color:'#111',marginBottom:'6px'}}>Upload Your HTML Template</div>
        <div style={{fontSize:'14px',color:'#888',marginBottom:'20px',lineHeight:1.7}}>Add placeholders in your HTML and we'll auto-fill them with your event details.</div>
        <div style={{background:'#f8f8f8',borderRadius:'8px',padding:'14px',marginBottom:'18px',fontFamily:'monospace',fontSize:'12px',color:'#555',lineHeight:2}}>
          {`{{BRIDE}} {{GROOM}} {{DATE}} {{VENUE}}`}<br/>
          {`{{ADDRESS}} {{MAPS_LINK}}`}<br/>
          {`{{BRIDE_PARENTS}} {{GROOM_PARENTS}}`}<br/>
          {`{{BRIDE_GP}} {{GROOM_GP}}`}<br/>
          {`{{WELCOME}} {{HASHTAG}} {{STORY}}`}<br/>
          {`{{CEREMONIES}} {{RSVP}}`}
        </div>
        <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px',padding:'24px',border:'2px dashed #ddd',borderRadius:'8px',cursor:'pointer',marginBottom:'18px',background:html?'#e8f5e9':'#fafafa'}}>
          <span style={{fontSize:'28px'}}>{html?'✅':'📄'}</span>
          <span style={{fontSize:'14px',color:html?'#10B981':'#888',fontWeight:html?'600':'400'}}>{html?`${file.name} (${(html.length/1024).toFixed(1)}KB)`:'Click to select your HTML file'}</span>
          <input type="file" accept=".html,.htm" style={{display:'none'}} onChange={load}/>
        </label>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={onClose} style={{flex:1,padding:'11px',border:'1px solid #e0e0e0',background:'transparent',borderRadius:'6px',cursor:'pointer',fontSize:'14px',color:'#666'}}>Cancel</button>
          <button disabled={!html} onClick={()=>onUse(html)} style={{flex:2,padding:'11px',background:html?'#111':'#ccc',color:'#fff',border:'none',borderRadius:'6px',cursor:html?'pointer':'not-allowed',fontSize:'14px',fontWeight:'600'}}>Customise This Template →</button>
        </div>
      </div>
    </div>
  )
}


// ─── CONFIG ──────────────────────────────────────────────────────────────────
// TO CONNECT TO REAL BACKEND: replace these with your Supabase/Firebase config
const CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseKey: 'YOUR_ANON_KEY',
  useLocalData: true, // set false when backend is connected
}

// ─── SAMPLE DATA (replace with real API calls) ────────────────────────────────
const SAMPLE_RSVPS = [
  { id:'1', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-12T09:14:00Z', fullName:'Priya Sharma', phone:'+91 98765 11001', email:'priya@email.com', attendance:'Yes, with pleasure!', functions:['Mehendi','Sangeet','Wedding','Reception'], guests:2, guestNames:'Rahul Sharma', dietary:'Vegetarian', message:'Cannot wait! So happy for you both 🌸' },
  { id:'2', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-12T11:30:00Z', fullName:'Amit Kapoor', phone:'+91 97654 22002', email:'', attendance:'Yes, with pleasure!', functions:['Wedding','Reception'], guests:3, guestNames:'Neha Kapoor, Om Kapoor', dietary:'Non-Vegetarian', message:'' },
  { id:'3', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-13T08:05:00Z', fullName:'Priya Sharma', phone:'+91 98765 11001', email:'priya.s@gmail.com', attendance:'Yes, with pleasure!', functions:['Wedding'], guests:1, guestNames:'', dietary:'Vegetarian', message:'Already sent one but just confirming!' },
  { id:'4', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-13T14:22:00Z', fullName:'Deepika Nair', phone:'+91 90001 33003', email:'deepika@email.com', attendance:'Regretfully declining', functions:[], guests:0, guestNames:'', dietary:'', message:'So sorry, will be out of town. Sending lots of love!' },
  { id:'5', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-14T10:18:00Z', fullName:'Rohan Mehta', phone:'+91 88002 44004', email:'rohan@email.com', attendance:'Yes, with pleasure!', functions:['Mehendi','Wedding','Reception'], guests:2, guestNames:'Sonal Mehta', dietary:'Jain', message:'Uncle says congratulations too!' },
  { id:'6', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-14T16:45:00Z', fullName:'Sunita Verma', phone:'+91 87003 55005', email:'', attendance:'Yes, with pleasure!', functions:['Sangeet','Wedding'], guests:4, guestNames:'Vikas, Pooja, Dev, Riya', dietary:'Vegetarian', message:'' },
  { id:'7', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-15T09:00:00Z', fullName:'Karan Joshi', phone:'+91 99004 66006', email:'karan@email.com', attendance:'Yes, with pleasure!', functions:['Wedding','Reception'], guests:1, guestNames:'Tanya Joshi', dietary:'', message:'See you there!' },
  { id:'8', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-15T13:20:00Z', fullName:'Amit Kapoor', phone:'+91 97654 22002', email:'a.kapoor@company.com', attendance:'Yes, with pleasure!', functions:['Reception'], guests:2, guestNames:'Neha, Om', dietary:'', message:'Sent from office email.' },
  { id:'9', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-16T08:40:00Z', fullName:'Meera Pillai', phone:'+91 81005 77007', email:'meera@email.com', attendance:'Regretfully declining', functions:[], guests:0, guestNames:'', dietary:'', message:'Wish I could make it, have my cousin\'s wedding same day!' },
  { id:'10', inviteId:'ananya-arjun-wedding', submittedAt:'2025-10-16T15:00:00Z', fullName:'Suresh Iyer', phone:'+91 92006 88008', email:'suresh@email.com', attendance:'Yes, with pleasure!', functions:['Mehendi','Sangeet','Wedding','Reception'], guests:3, guestNames:'Lata Iyer, Anand Iyer', dietary:'Vegetarian', message:'The whole family is coming!' },
]

// ─── DUPLICATE DETECTION ────────────────────────────────────────────────────
function detectDuplicates(rsvps) {
  const phoneMap = {}
  rsvps.forEach(r => {
    const phone = r.phone?.replace(/\s/g, '')
    if (phone) {
      if (!phoneMap[phone]) phoneMap[phone] = []
      phoneMap[phone].push(r.id)
    }
  })
  const dupIds = new Set()
  Object.values(phoneMap).forEach(ids => { if (ids.length > 1) ids.forEach(id => dupIds.add(id)) })
  return dupIds
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  try { return new Date(dateStr).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) }
  catch { return dateStr }
}
function csvEscape(val) {
  const s = String(val ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s
}
function downloadCSV(rsvps) {
  const headers = ['Name','Phone','Email','Attendance','Functions','Guests','Guest Names','Dietary','Message','Submitted At']
  const rows = rsvps.map(r => [
    r.fullName, r.phone, r.email, r.attendance,
    Array.isArray(r.functions) ? r.functions.join(' | ') : r.functions,
    r.guests, r.guestNames, r.dietary, r.message, fmt(r.submittedAt)
  ].map(csvEscape).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'rsvp-responses.csv'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── THEME ──────────────────────────────────────────────────────────────────
const T = {
  teal: '#006B5E', tealDark: '#004D44', tealLight: '#E8F5F3',
  gold: '#B8912A', goldLight: '#FBF5E6',
  text: '#111827', textSec: '#6B7280', textMuted: '#9CA3AF',
  bg: '#F9FAFB', surface: '#FFFFFF',
  border: '#E5E7EB', borderMed: '#D1D5DB',
  danger: '#EF4444', dangerLight: '#FEF2F2',
  warn: '#F59E0B', warnLight: '#FFFBEB',
  success: '#10B981', successLight: '#ECFDF5',
  shadow: '0 1px 3px rgba(0,0,0,.08)', shadowMd: '0 4px 16px rgba(0,0,0,.1)',
}

// ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    if (!user || !pass) { setErr('Please enter both fields'); return }
    setLoading(true); setErr('')
    // DEMO: accept any non-empty credentials
    // REAL: POST /auth/login → check against stored hash
    setTimeout(() => {
      setLoading(false)
      if (pass.length >= 4) onLogin({ username: user, inviteId: 'ananya-arjun-wedding', coupleName: 'Ananya & Arjun' })
      else setErr('Incorrect password')
    }, 800)
  }

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg,${T.tealDark},${T.teal})`, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:T.surface, borderRadius:'16px', padding:'44px 40px', maxWidth:'400px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,.25)' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'36px', marginBottom:'8px' }}>💍</div>
          <div style={{ fontSize:'22px', fontWeight:'700', color:T.text }}>Teal Media Works</div>
          <div style={{ fontSize:'13px', color:T.textSec, marginTop:'4px' }}>RSVP Dashboard</div>
        </div>

        <div style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'600', color:T.textSec, marginBottom:'5px', textTransform:'uppercase', letterSpacing:'.5px' }}>Email / Username</div>
          <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="ananya@email.com" type="email"
            style={{ width:'100%', padding:'11px 13px', border:`1px solid ${T.border}`, borderRadius:'8px', fontSize:'14px', outline:'none', color:T.text }}
            onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
        </div>
        <div style={{ marginBottom:'22px' }}>
          <div style={{ fontSize:'12px', fontWeight:'600', color:T.textSec, marginBottom:'5px', textTransform:'uppercase', letterSpacing:'.5px' }}>Password</div>
          <input value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Your dashboard password" type="password"
            style={{ width:'100%', padding:'11px 13px', border:`1px solid ${T.border}`, borderRadius:'8px', fontSize:'14px', outline:'none', color:T.text }}
            onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
        </div>

        {err && <div style={{ background:T.dangerLight, border:`1px solid ${T.danger}33`, borderRadius:'6px', padding:'10px 12px', fontSize:'13px', color:T.danger, marginBottom:'16px' }}>{err}</div>}

        <button onClick={submit} disabled={loading} style={{ width:'100%', padding:'13px', background:T.teal, color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:loading?'wait':'pointer' }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        <div style={{ marginTop:'24px', padding:'14px', background:T.tealLight, borderRadius:'8px', fontSize:'12px', color:T.teal, lineHeight:1.7 }}>
          <strong>Demo:</strong> Enter any email + any password (4+ chars) to log in.<br/>
          Real credentials are sent via WhatsApp after payment.
        </div>
      </div>
    </div>
  )
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background:T.surface, borderRadius:'12px', padding:'20px 22px', border:`1px solid ${T.border}`, boxShadow:T.shadow, flex:1, minWidth:'140px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'13px', color:T.textSec, marginBottom:'8px', fontWeight:'500' }}>{label}</div>
          <div style={{ fontSize:'32px', fontWeight:'700', color: color || T.text, lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:'12px', color:T.textMuted, marginTop:'5px' }}>{sub}</div>}
        </div>
        <div style={{ fontSize:'24px', opacity:.7 }}>{icon}</div>
      </div>
    </div>
  )
}

// ─── RSVP ROW ────────────────────────────────────────────────────────────────
function RSVPRow({ r, isDup, dupCount, onMarkDup, markedDup }) {
  const [open, setOpen] = useState(false)
  const attending = r.attendance === 'Yes, with pleasure!'
  const declining = r.attendance === 'Regretfully declining'

  return (
    <>
      <tr style={{ background: markedDup ? '#fff7ed' : isDup ? T.warnLight : 'transparent', borderBottom:`1px solid ${T.border}`, cursor:'pointer' }} onClick={()=>setOpen(o=>!o)}>
        <td style={{ padding:'12px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {isDup && !markedDup && <span title={`Possible duplicate — ${dupCount} entries with this phone`} style={{ background:T.warn, color:'#fff', borderRadius:'100px', fontSize:'10px', fontWeight:'700', padding:'2px 7px', flexShrink:0 }}>DUP</span>}
            {markedDup && <span style={{ background:'#D97706', color:'#fff', borderRadius:'100px', fontSize:'10px', fontWeight:'700', padding:'2px 7px', flexShrink:0 }}>MARKED</span>}
            <div>
              <div style={{ fontWeight:'600', color:T.text, fontSize:'14px' }}>{r.fullName}</div>
              <div style={{ fontSize:'12px', color:T.textMuted }}>{r.phone}</div>
            </div>
          </div>
        </td>
        <td style={{ padding:'12px 16px' }}>
          <span style={{ display:'inline-block', padding:'4px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:'600', background: attending?T.successLight:declining?T.dangerLight:'#f3f4f6', color: attending?T.success:declining?T.danger:T.textSec }}>
            {attending ? '✓ Attending' : declining ? '✗ Declining' : '?'}
          </span>
        </td>
        <td style={{ padding:'12px 16px', fontSize:'13px', color:T.textSec }}>
          {Array.isArray(r.functions) && r.functions.length > 0 ? r.functions.join(', ') : '—'}
        </td>
        <td style={{ padding:'12px 16px', textAlign:'center' }}>
          <span style={{ fontWeight:'600', fontSize:'14px', color:T.text }}>{r.guests || 0}</span>
        </td>
        <td style={{ padding:'12px 16px', fontSize:'12px', color:T.textMuted, whiteSpace:'nowrap' }}>{fmt(r.submittedAt)}</td>
        <td style={{ padding:'12px 16px' }}>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={e=>{e.stopPropagation();onMarkDup(r.id)}} title={markedDup?'Unmark duplicate':'Mark as duplicate'}
              style={{ padding:'5px 10px', fontSize:'11px', border:`1px solid ${markedDup?T.teal:T.border}`, background:markedDup?T.tealLight:'#fff', color:markedDup?T.teal:T.textSec, borderRadius:'6px', cursor:'pointer', fontWeight:'500' }}>
              {markedDup ? 'Unmark' : 'Mark Dup'}
            </button>
            <span style={{ padding:'5px 8px', fontSize:'14px', color:T.textSec }}>{open?'▲':'▼'}</span>
          </div>
        </td>
      </tr>
      {open && (
        <tr style={{ background: markedDup?'#fffbeb':isDup?'#fffef0':'#fafafa', borderBottom:`1px solid ${T.border}` }}>
          <td colSpan={6} style={{ padding:'16px 24px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'14px' }}>
              {[
                ['Email', r.email || '—'],
                ['Guest Names', r.guestNames || '—'],
                ['Dietary', r.dietary || '—'],
                ['Message', r.message || '—'],
              ].map(([label, val]) => (
                <div key={label} style={{ background:'#fff', borderRadius:'8px', padding:'12px 14px', border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:'10px', fontWeight:'600', color:T.textMuted, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'4px' }}>{label}</div>
                  <div style={{ fontSize:'13px', color:T.text, lineHeight:1.6 }}>{val}</div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
function MainDash({ user, onLogout }) {
  const [rsvps, setRsvps] = useState(SAMPLE_RSVPS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [markedDups, setMarkedDups] = useState(new Set())
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const dupIds = detectDuplicates(rsvps)

  // Phone → count map for tooltip
  const phoneCount = {}
  rsvps.forEach(r => {
    const p = r.phone?.replace(/\s/g,'')
    if (p) phoneCount[p] = (phoneCount[p]||0)+1
  })

  const toggleMarkDup = useCallback((id) => {
    setMarkedDups(prev => { const s = new Set(prev); s.has(id)?s.delete(id):s.add(id); return s })
  }, [])

  const refresh = () => {
    setRefreshing(true)
    // REAL: fetch from Supabase: supabase.from('rsvps').select('*').eq('invite_id', user.inviteId)
    setTimeout(() => { setRefreshing(false); setLastRefresh(new Date()) }, 1000)
  }

  const filtered = rsvps.filter(r => {
    if (filter === 'attending') return r.attendance === 'Yes, with pleasure!'
    if (filter === 'declining') return r.attendance === 'Regretfully declining'
    if (filter === 'duplicates') return dupIds.has(r.id) || markedDups.has(r.id)
    return true
  }).filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.fullName?.toLowerCase().includes(q) || r.phone?.includes(q) || r.email?.toLowerCase().includes(q)
  })

  const attending = rsvps.filter(r => r.attendance === 'Yes, with pleasure!')
  const totalGuests = attending.reduce((s,r) => s + (r.guests||0) + 1, 0)
  const declining = rsvps.filter(r => r.attendance === 'Regretfully declining')
  const dupCount = new Set([...dupIds, ...markedDups]).size

  const FILTERS = [
    { v:'all', l:`All (${rsvps.length})` },
    { v:'attending', l:`Attending (${attending.length})` },
    { v:'declining', l:`Declining (${declining.length})` },
    { v:'duplicates', l:`Duplicates (${dupCount})`, warn: dupCount > 0 },
  ]

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:'system-ui,sans-serif', color:T.text }}>
      {/* Header */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:'0 24px', height:'58px', display:'flex', alignItems:'center', gap:'14px', position:'sticky', top:0, zIndex:50, boxShadow:T.shadow }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'20px' }}>💍</span>
          <div>
            <div style={{ fontWeight:'700', fontSize:'15px', color:T.text }}>Teal Media Works</div>
            <div style={{ fontSize:'11px', color:T.textMuted }}>RSVP Dashboard</div>
          </div>
        </div>
        <div style={{ width:'1px', height:'28px', background:T.border, margin:'0 4px' }}/>
        <div>
          <div style={{ fontWeight:'600', fontSize:'14px', color:T.teal }}>{user.coupleName}</div>
          <div style={{ fontSize:'11px', color:T.textMuted }}>{user.inviteId}.netlify.app</div>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:'11px', color:T.textMuted, display:'flex', alignItems:'center', gap:'6px' }}>
          <span>Last refreshed {fmt(lastRefresh)}</span>
          <button onClick={refresh} style={{ padding:'5px 12px', border:`1px solid ${T.border}`, background:'#fff', borderRadius:'6px', cursor:'pointer', fontSize:'12px', color:T.textSec }}>
            {refreshing ? '↻ …' : '↻ Refresh'}
          </button>
        </div>
        <button onClick={() => downloadCSV(filtered)} style={{ padding:'8px 16px', background:T.teal, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>
          📥 Export CSV
        </button>
        <button onClick={onLogout} style={{ padding:'8px 14px', border:`1px solid ${T.border}`, background:'#fff', borderRadius:'8px', cursor:'pointer', fontSize:'13px', color:T.textSec }}>
          ← Builder
        </button>
        <button onClick={onLogout} style={{ padding:'8px 14px', border:`1px solid ${T.border}`, background:'#fff', borderRadius:'8px', cursor:'pointer', fontSize:'13px', color:T.textSec }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth:'1300px', margin:'0 auto', padding:'28px 24px' }}>
        {/* Stats */}
        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'28px' }}>
          <StatCard label="Total Responses" value={rsvps.length} icon="📋" color={T.text} sub={`Last: ${fmt(rsvps[rsvps.length-1]?.submittedAt)}`} />
          <StatCard label="Attending" value={attending.length} icon="✅" color={T.success} sub={`~${totalGuests} total guests`} />
          <StatCard label="Declining" value={declining.length} icon="❌" color={T.danger} sub="Cannot make it" />
          <StatCard label="Possible Duplicates" value={dupCount} icon="⚠️" color={dupCount>0?T.warn:T.textMuted} sub={dupCount>0?'Review needed':'All clear'} />
        </div>

        {/* Invite link banner */}
        <div style={{ background:T.tealLight, border:`1px solid ${T.teal}33`, borderRadius:'12px', padding:'14px 18px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
          <span style={{ fontSize:'16px' }}>🔗</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:'600', color:T.teal, fontSize:'14px' }}>Your live invite link</div>
            <div style={{ fontFamily:'monospace', fontSize:'13px', color:T.teal, marginTop:'2px' }}>https://{user.inviteId}.netlify.app</div>
          </div>
          <button onClick={()=>navigator.clipboard?.writeText(`https://${user.inviteId}.netlify.app`)} style={{ padding:'7px 14px', background:T.teal, color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>Copy Link</button>
          <button onClick={()=>window.open(`https://${user.inviteId}.netlify.app`,'_blank')} style={{ padding:'7px 14px', background:'transparent', border:`1px solid ${T.teal}`, color:T.teal, borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>Open Site</button>
        </div>

        {/* Duplicate alert */}
        {dupIds.size > 0 && (
          <div style={{ background:T.warnLight, border:`1px solid ${T.warn}66`, borderRadius:'12px', padding:'14px 18px', marginBottom:'24px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
            <span style={{ fontSize:'18px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight:'600', color:'#92400E', fontSize:'14px' }}>Possible duplicate responses detected</div>
              <div style={{ fontSize:'13px', color:'#A16207', marginTop:'3px', lineHeight:1.6 }}>
                {dupIds.size} responses share a phone number with another entry. These are highlighted in yellow — review and mark duplicates manually. The system does not auto-merge to avoid accidental data loss.
              </div>
            </div>
          </div>
        )}

        {/* Filters + Search */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.v} onClick={()=>setFilter(f.v)} style={{ padding:'7px 16px', borderRadius:'100px', border:`1px solid ${filter===f.v?T.teal:T.border}`, background:filter===f.v?T.teal:'#fff', color:filter===f.v?'#fff':f.warn?T.warn:T.textSec, fontSize:'13px', cursor:'pointer', fontWeight:filter===f.v?'600':'400', transition:'all .15s' }}>
                {f.l}
              </button>
            ))}
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:T.textMuted, fontSize:'14px' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or phone…"
              style={{ padding:'8px 12px 8px 32px', border:`1px solid ${T.border}`, borderRadius:'8px', fontSize:'13px', outline:'none', width:'220px', color:T.text }}
              onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
          </div>
          <div style={{ fontSize:'13px', color:T.textMuted }}>{filtered.length} response{filtered.length!==1?'s':''}</div>
        </div>

        {/* Table */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:'12px', overflow:'hidden', boxShadow:T.shadow }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
              <thead>
                <tr style={{ background:'#F9FAFB', borderBottom:`2px solid ${T.border}` }}>
                  {['Guest Name','Attendance','Ceremonies','+Guests','Submitted','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:'600', color:T.textSec, fontSize:'12px', textTransform:'uppercase', letterSpacing:'.5px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', color:T.textMuted }}>No responses match your filter</td></tr>
                ) : filtered.map(r => {
                  const phone = r.phone?.replace(/\s/g,'')
                  return (
                    <RSVPRow key={r.id} r={r} isDup={dupIds.has(r.id)} dupCount={phone?phoneCount[phone]:1} onMarkDup={toggleMarkDup} markedDup={markedDups.has(r.id)} />
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'12px 16px', borderTop:`1px solid ${T.border}`, background:'#FAFAFA', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
            <div style={{ fontSize:'12px', color:T.textMuted }}>
              Showing {filtered.length} of {rsvps.length} total responses
              {markedDups.size > 0 && <span style={{ marginLeft:'12px', color:T.warn, fontWeight:'600' }}> · {markedDups.size} marked as duplicate</span>}
            </div>
            <button onClick={()=>downloadCSV(filtered)} style={{ padding:'7px 14px', background:T.surface, border:`1px solid ${T.border}`, borderRadius:'6px', cursor:'pointer', fontSize:'12px', color:T.textSec }}>
              📥 Download CSV ({filtered.length} rows)
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop:'24px', padding:'16px 20px', background:T.surface, border:`1px solid ${T.border}`, borderRadius:'12px', fontSize:'13px', color:T.textSec, lineHeight:1.7 }}>
          <strong style={{ color:T.text }}>ℹ️ About duplicates:</strong> Responses sharing a phone number are flagged automatically. The system never auto-merges — use "Mark Dup" to tag entries you want to ignore. All original data is preserved. Export CSV to get a clean sheet.
        </div>
      </div>
    </div>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
function RSVPDashboardApp({ onGoBuilder }) {
  const [user, setUser] = useState(null)

  // Persist login in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('tmw_user')
    if (saved) try { setUser(JSON.parse(saved)) } catch {}
  }, [])

  const handleLogin = (u) => { setUser(u); sessionStorage.setItem('tmw_user', JSON.stringify(u)) }
  const handleLogout = () => { setUser(null); sessionStorage.removeItem('tmw_user') }

  if (!user) return <Login onLogin={handleLogin} />
  return <MainDash user={user} onLogout={handleLogout} />
}


// ─── ROUTE DETECTION ────────────────────────────────────────────────────────
function useRoute(){
  const[route,setRoute]=useState(()=>window.location.hash.includes('dashboard')?'dashboard':'builder')
  useEffect(()=>{
    const handler=()=>setRoute(window.location.hash.includes('dashboard')?'dashboard':'builder')
    window.addEventListener('hashchange',handler)
    return()=>window.removeEventListener('hashchange',handler)
  },[])
  return[route,(r)=>{window.location.hash=r==='dashboard'?'/dashboard':'';setRoute(r)}]
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App(){
  const[route,navigate]=useRoute()

  // Builder state
  const[page,setPage]=useState('gallery')
  const[preview,setPreview]=useState(null)
  const[builder,setBuilder]=useState(null)
  const[builderDark,setBD]=useState(false)
  const[upload,setUpload]=useState(false)
  const[customHTML,setCustom]=useState(null)

  const handleCustomise=(t,dk)=>{setBuilder(t);setBD(dk);setPreview(null);setPage('builder')}
  const handleUploadUse=(html)=>{setCustom(html);setUpload(false);setBuilder(TEMPLATES[9]);setBD(false);setPage('builder')}

  // Dashboard navigates here
  if(route==='dashboard') return <RSVPDashboardApp onGoBuilder={()=>navigate('builder')}/>

  return(
    <>
      {page==='gallery'&&<Gallery onPreview={t=>setPreview(t)} onUpload={()=>setUpload(true)}/>}
      {page==='builder'&&builder&&<Builder t={builder} initDark={builderDark} onBack={()=>{setPage('gallery');setBuilder(null)}} onPay={()=>{}} customHTML={customHTML}/>}
      {preview&&<PreviewModal t={preview} onClose={()=>setPreview(null)} onCustomise={handleCustomise}/>}
      {upload&&<UploadModal onClose={()=>setUpload(false)} onUse={handleUploadUse}/>}
    </>
  )
}
