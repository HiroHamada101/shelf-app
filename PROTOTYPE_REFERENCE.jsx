import { useState, useRef, useEffect, createContext, useContext } from "react";

const THEMES={light:{bg:"#FAF9F7",card:"#FFFFFF",text:"#1A1A1A",sub:"#8C8C88",muted:"#C0C0BA",border:"#EEEDEA",accent:"#F9A602",accentLight:"#FFF8E8",urgent:"#D44332",warn:"#C08B1E",ok:"#2E8B44",urgentDot:"#E5453A",warnDot:"#D4A220",okDot:"#3DA854",shadow:"0 1px 2px rgba(0,0,0,0.03)",fabShadow:"0 6px 28px rgba(249,166,2,0.35),0 2px 8px rgba(249,166,2,0.15)",tabBar:"rgba(250,249,247,0.94)",statusFill:"#1A1A1A",inputBg:"#FFF"},dark:{bg:"#111110",card:"#1C1C1A",text:"#E8E8E4",sub:"#707068",muted:"#484844",border:"#2A2A28",accent:"#F9A602",accentLight:"#2A2210",urgent:"#E06050",warn:"#D4A840",ok:"#5AAA65",urgentDot:"#E06050",warnDot:"#D4A840",okDot:"#5AAA65",shadow:"0 1px 2px rgba(0,0,0,0.15)",fabShadow:"0 6px 28px rgba(249,166,2,0.25),0 2px 8px rgba(0,0,0,0.3)",tabBar:"rgba(17,17,16,0.94)",statusFill:"#E8E8E4",inputBg:"#1C1C1A"}};
const TC=createContext(THEMES.light);const U=()=>useContext(TC);
const F="'DM Sans',-apple-system,sans-serif";const FD="'Fraunces',Georgia,serif";const FB="'Montserrat',sans-serif";

const CATS=[{id:"all",label:"All"},{id:"food",label:"Food"},{id:"medicine",label:"Medicine"},{id:"beauty",label:"Beauty"},{id:"baby",label:"Baby"},{id:"household",label:"Household"},{id:"pet",label:"Pet"}];
const CAT_LABELS={food:"Food & Drink",medicine:"Medicine",beauty:"Beauty & Care",baby:"Baby & Kids",household:"Household",pet:"Pet Supplies"};
const STORES=[{id:"fridge",label:"Fridge"},{id:"freezer",label:"Freezer"},{id:"pantry",label:"Pantry"},{id:"bathroom",label:"Bathroom"},{id:"cabinet",label:"Cabinet"},{id:"other",label:"Other"}];
const ICON_OPTIONS={food:["milk","bread","egg","chicken","cheese","veggie","carrot","banana","jar","fish","tomato","butter","meat","avocado","rice"],medicine:["pill","syrup","drops","bandaid"],beauty:["tube","cream","soap"],baby:["bottle","milk"],household:["battery","extinguisher","sponge"],pet:["bone","paw"]};
const PH={food:"e.g. Amul Toned Milk, 500ml",medicine:"e.g. Crocin 650mg",beauty:"e.g. Lakme Sunscreen SPF 50",baby:"e.g. Cerelac Stage 1",household:"e.g. Duracell AA Batteries",pet:"e.g. Pedigree Chicken"};

function dfn(d){const dt=new Date();dt.setDate(dt.getDate()+d);return dt.toISOString().split("T")[0];}
function du(s){const a=new Date();a.setHours(0,0,0,0);const b=new Date(s+"T00:00:00");b.setHours(0,0,0,0);return Math.round((b-a)/864e5);}
function fd(s){return new Date(s+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"});}

/* ═══ SVG PRODUCT ICONS ═══ */
const ICONS={
  milk:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="10" y="14" width="20" height="22" rx="3" fill="#E3F2FD"/><rect x="10" y="14" width="20" height="8" fill="#1E88E5"/><rect x="14" y="4" width="12" height="10" rx="2" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1"/><text x="20" y="20" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fff" fontFamily="sans-serif">MILK</text></svg>,
  bread:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="16" rx="14" ry="8" fill="#FFCC80"/><rect x="6" y="16" width="28" height="16" rx="3" fill="#FFB74D"/><ellipse cx="14" cy="16" rx="3" ry="1.5" fill="#FFA726" opacity=".5"/></svg>,
  egg:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="10" ry="13" fill="#FFF3E0"/><ellipse cx="20" cy="22" rx="10" ry="13" fill="none" stroke="#FFCC80" strokeWidth="1"/><ellipse cx="18" cy="19" rx="3" ry="4" fill="#fff" opacity=".6"/></svg>,
  chicken:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="11" ry="10" fill="#FFCCBC"/><circle cx="18" cy="18" r="7" fill="#FF8A65"/><rect x="18" y="28" width="4" height="8" rx="2" fill="#FFAB91"/></svg>,
  cheese:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><polygon points="6,32 34,32 34,16 20,8" fill="#FFE082"/><polygon points="6,32 34,32 34,16 20,8" fill="none" stroke="#FFC107" strokeWidth="1"/><circle cx="18" cy="24" r="2.5" fill="#FFF8E1"/><circle cx="26" cy="20" r="2" fill="#FFF8E1"/></svg>,
  veggie:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="20" rx="10" fill="#A5D6A7"/><rect x="18" y="4" width="4" height="10" rx="2" fill="#66BB6A"/></svg>,
  carrot:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><path d="M20 36L12 14h16L20 36z" fill="#FF7043"/><ellipse cx="20" cy="14" rx="8" ry="3" fill="#FF8A65"/><path d="M17 14c-2-6 0-8 3-10" stroke="#66BB6A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M23 14c2-5 1-8-2-10" stroke="#66BB6A" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
  banana:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><path d="M10 28c4-16 14-20 22-16" stroke="#FFC107" strokeWidth="6" strokeLinecap="round" fill="none"/></svg>,
  jar:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="10" y="14" width="20" height="20" rx="4" fill="#FFAB91"/><rect x="12" y="8" width="16" height="6" rx="2" fill="#D7CCC8"/></svg>,
  fish:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="18" cy="20" rx="12" ry="8" fill="#80DEEA"/><polygon points="30,20 38,12 38,28" fill="#4DD0E1"/><circle cx="13" cy="18" r="2" fill="#fff"/><circle cx="13" cy="18" r="1" fill="#263238"/></svg>,
  tomato:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="22" r="12" fill="#EF5350"/><path d="M16 10c2 2 6 2 8 0" stroke="#66BB6A" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>,
  butter:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="6" y="16" width="28" height="16" rx="3" fill="#FFF9C4"/><rect x="6" y="16" width="28" height="6" rx="3" fill="#FFD54F"/></svg>,
  meat:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="13" ry="10" fill="#FFCDD2"/><ellipse cx="18" cy="20" rx="6" ry="5" fill="#EF9A9A"/><circle cx="24" cy="18" r="3" fill="#E57373"/></svg>,
  avocado:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="11" ry="14" fill="#8BC34A"/><ellipse cx="20" cy="24" rx="7" ry="8" fill="#C5E1A5"/><circle cx="20" cy="26" r="5" fill="#795548"/></svg>,
  rice:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="22" rx="3" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1"/><rect x="8" y="12" width="24" height="8" rx="3" fill="#FF7043"/><text x="20" y="19" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#fff" fontFamily="sans-serif">RICE</text></svg>,
  pill:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="8" y="14" width="24" height="12" rx="6" fill="#E8EAF6"/><rect x="8" y="14" width="12" height="12" rx="6" fill="#5C6BC0"/></svg>,
  syrup:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="12" y="14" width="16" height="20" rx="3" fill="#CE93D8"/><rect x="14" y="8" width="12" height="6" rx="2" fill="#BA68C8"/></svg>,
  drops:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="14" y="10" width="12" height="24" rx="4" fill="#B3E5FC"/><rect x="14" y="10" width="12" height="8" rx="4" fill="#4FC3F7"/></svg>,
  bandaid:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="4" y="14" width="32" height="12" rx="6" fill="#FFCDD2" transform="rotate(-30 20 20)"/><rect x="4" y="14" width="32" height="12" rx="6" fill="#FFCDD2" transform="rotate(30 20 20)"/><circle cx="20" cy="20" r="2" fill="#E57373"/></svg>,
  tube:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="12" y="16" width="16" height="18" rx="3" fill="#F8BBD0"/><rect x="16" y="10" width="8" height="6" rx="2" fill="#F48FB1"/></svg>,
  cream:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="24" r="12" fill="#F3E5F5"/><ellipse cx="20" cy="18" rx="10" ry="4" fill="#CE93D8"/></svg>,
  soap:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="8" y="16" width="24" height="16" rx="6" fill="#B2EBF2"/><rect x="8" y="16" width="24" height="6" rx="6" fill="#80DEEA"/><circle cx="28" cy="12" r="3" fill="#E0F7FA"/></svg>,
  bottle:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="14" y="14" width="12" height="20" rx="4" fill="#BBDEFB"/><rect x="16" y="8" width="8" height="6" rx="2" fill="#90CAF9"/><rect x="16" y="14" width="8" height="4" fill="#64B5F6"/></svg>,
  battery:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="10" y="12" width="20" height="24" rx="3" fill="#546E7A"/><rect x="16" y="8" width="8" height="4" rx="1" fill="#78909C"/><rect x="12" y="12" width="16" height="10" rx="1" fill="#78909C"/><text x="20" y="20" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="sans-serif">+</text></svg>,
  extinguisher:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="14" y="14" width="12" height="22" rx="4" fill="#EF5350"/><rect x="16" y="8" width="8" height="6" rx="2" fill="#E57373"/></svg>,
  sponge:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="6" y="14" width="28" height="18" rx="6" fill="#FFE082"/><rect x="6" y="14" width="28" height="6" rx="6" fill="#4DB6AC"/></svg>,
  bone:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><rect x="10" y="17" width="20" height="6" rx="3" fill="#D7CCC8"/><circle cx="10" cy="17" r="4" fill="#BCAAA4"/><circle cx="10" cy="23" r="4" fill="#BCAAA4"/><circle cx="30" cy="17" r="4" fill="#BCAAA4"/><circle cx="30" cy="23" r="4" fill="#BCAAA4"/></svg>,
  paw:(s=32)=><svg width={s} height={s} viewBox="0 0 40 40"><ellipse cx="20" cy="26" rx="8" ry="6" fill="#A1887F"/><circle cx="12" cy="18" r="4" fill="#8D6E63"/><circle cx="20" cy="14" r="4" fill="#8D6E63"/><circle cx="28" cy="18" r="4" fill="#8D6E63"/></svg>,
};
function PI({k,size=32}){const fn=ICONS[k];return fn?<div style={{width:size,height:size,flexShrink:0}}>{fn(size)}</div>:<div style={{width:size,height:size,borderRadius:8,background:"#eee",flexShrink:0}}/>;}

/* ── Logo: corrected — S curves right-to-left matching uploaded image ── */
const ShelfLogo=({size=28,bg="#F9A602",fg="#fff"})=><svg width={size} height={size} viewBox="128 128 1000 1000" fill="none">
  <path fill={bg} d="M978.5,128.4c38.6,3.1,71.7,17.8,99.3,44.2c32.6,31.3,49.4,69.8,49.4,115.1c0.2,122.8,0,245.6,0,368.5c0,104,0.1,208,0,312c-0.1,48.8-19.5,88.9-56.8,120.1c-29.8,25-64.5,37.7-103.5,37.7c-226.1,0.1-452.3,0.1-678.4,0c-79.6,0-146.9-57.7-158.9-136c-1.2-8-1.6-16.2-1.6-24.4c-0.1-225.5-0.1-451-0.1-676.4c0-82.4,60.9-150.4,142.8-159.8c9.7-1.1,19.6-1.1,29.4-1.1c221.6-0.1,443.3-0.1,664.9,0C969.4,128.1,973.7,128.2,978.5,128.4z"/>
  <path fill={fg} d="M673,351.5c-53.5,0-106.5,0.4-159.5-0.1c-59.4-0.6-107.3,43.2-115.6,102.2c-0.7,5.2-1,10.5-1.6,16.5c2.8,0,4.9,0,7,0c142.8,0,285.7,0,428.5,0c7.4,0,11.1,2.6,11.4,8.3c0.4,5.8-3.3,9.6-9.5,9.7c-14.3,0.1-28.7,0.1-43,0.1c-65,0-130,0-195,0c-2,0-4,0-6.4,0c0,39.7,0,78.9,0,118.6c1.9,0,3.6,0,5.4,0c49.5,0,99,0.8,148.5-0.2c58.8-1.2,111.5,37.8,128.8,96.1c7.1,24,7.1,48.4,5,72.9c-2.8,32.7-14.8,61.6-37.9,85.5c-24.7,25.5-55,38.7-90.2,38.8c-120,0.3-240,0.1-360,0.1c-8.8,0-13.7-6.9-9.7-13.7c2.2-3.8,5.8-4.3,9.9-4.3c80,0.1,160,0.1,240,0.1c11.6,0,23.3,0,35.6,0c0-2.3,0-4.1,0-5.9c0-37.3,0-74.7,0.2-112c0-4.1-1.4-4.9-5.1-4.9c-86,0.1-172,0.2-258,0.2c-6.3,0-10.4-3.2-10.3-9.1c0-5.9,4.1-9.1,11.2-9.1c150.2,0,300.3,0,450.5,0c2,0,3.9,0,6.3,0c0.2-12.5-1.6-24.1-5.4-35.3c-14.4-42.2-42.4-69.7-86.6-79.2c-6.8-1.5-13.9-1.8-20.8-1.9c-77.2-0.1-154.4-0.8-231.5,0.1c-70.7,0.8-130.9-52.7-136.3-127.7c-1.9-26.3-0.5-52.3,9.1-77.3c20.6-53.6,69-86.7,126.4-86.7c116.5,0.1,233,0,349.5,0c2,0,4,0.1,6,0.1c4.9,0.4,8.2,3.9,8.3,8.9c0.1,4.9-3.1,8.5-8.1,9c-2.3,0.2-4.7,0.2-7,0.2C799.8,351.5,736.7,351.5,673,351.5z"/>
  <path fill={bg} d="M746.9,882c-21.5,0-42.5,0-63.9,0c0-40.8,0-81.3,0-122.3c58.9,0,117.6,0,176.3,0C861.9,820.3,818.2,881,746.9,882z"/>
  <path fill={bg} d="M571,598.9c0,2.8,0,5,0,7.2c-1.1,0.3-1.5,0.6-2,0.6c-22.7-0.2-45.4,0.8-68-0.8c-44.9-3.1-85.7-37.7-97.9-82.3c-3.1-11.4-5.7-22.9-5.3-35.1c58.1,0,115.8,0,173.8,0C571,525.2,571,561.8,571,598.9z"/>
</svg>;

/* ── nav icons ── */
const IBack=()=><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 10H6M6 10l4-4M6 10l4 4"/></svg>;
const IPlus=()=><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 5v12M5 11h12"/></svg>;
const ICam=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IPen=()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2l3 3L6 15H3v-3z"/></svg>;
const ITrash=()=><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h12M6 4V2.5h4V4M4 4v9a1 1 0 001 1h6a1 1 0 001-1V4"/></svg>;
const ICheck=()=><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4"/></svg>;
const IHome=({on})=><svg width="20" height="20" viewBox="0 0 20 20" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5"><path d="M3 7.5l7-5.5 7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V7.5z"/></svg>;
const IBarI=()=><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="9" width="3" height="7" rx="1"/><rect x="8.5" y="6" width="3" height="10" rx="1"/><rect x="14" y="3" width="3" height="13" rx="1"/></svg>;
const ICart=({on})=><svg width="20" height="20" viewBox="0 0 20 20" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v11a1 1 0 001 1h12a1 1 0 001-1V6l-3-4z"/><path d="M3 6h14"/><path d="M13 9a3 3 0 01-6 0"/></svg>;
const IGear=()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="9" cy="9" r="2.2"/><path d="M14.7 11.3a1.2 1.2 0 00.24 1.3l.04.04a1.45 1.45 0 11-2.05 2.05l-.04-.04a1.2 1.2 0 00-1.3-.24 1.2 1.2 0 00-.73 1.1v.12a1.45 1.45 0 01-2.9 0v-.07a1.2 1.2 0 00-.79-1.1 1.2 1.2 0 00-1.3.24l-.04.04a1.45 1.45 0 11-2.05-2.05l.04-.04a1.2 1.2 0 00.24-1.3 1.2 1.2 0 00-1.1-.73H3.5a1.45 1.45 0 010-2.9h.07a1.2 1.2 0 001.1-.79 1.2 1.2 0 00-.24-1.3l-.04-.04a1.45 1.45 0 112.05-2.05l.04.04a1.2 1.2 0 001.3.24h.08a1.2 1.2 0 00.73-1.1V3.5a1.45 1.45 0 012.9 0v.07a1.2 1.2 0 00.73 1.1 1.2 1.2 0 001.3-.24l.04-.04a1.45 1.45 0 112.05 2.05l-.04.04a1.2 1.2 0 00-.24 1.3v.08a1.2 1.2 0 001.1.73h.12a1.45 1.45 0 010 2.9h-.07a1.2 1.2 0 00-1.1.73z"/></svg>;
const ISun=()=><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3"/></svg>;
const IMoon=()=><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9.5A6 6 0 116.5 2a4.8 4.8 0 007.5 7.5z"/></svg>;

function Toggle({on,fn}){const t=U();return <div onClick={fn} style={{width:44,height:26,borderRadius:13,padding:2,cursor:"pointer",background:on?t.accent:t.border,transition:"background 0.2s"}}><div style={{width:22,height:22,borderRadius:11,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",transform:on?"translateX(18px)":"translateX(0)",transition:"transform 0.2s cubic-bezier(.4,0,.2,1)"}}/></div>;}

/* ═══════════════════════════════════════
   SPLASH → PHONE → OTP → APP
   ═══════════════════════════════════════ */

function SplashScreen({onDone}){
  const [phase,setPhase]=useState(0); // 0=logo appearing, 1=text appearing, 2=fading out
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),600);
    const t2=setTimeout(()=>setPhase(2),2200);
    const t3=setTimeout(()=>onDone(),2800);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  return(
    <div style={{
      position:"absolute",inset:0,background:"#F9A602",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",zIndex:100,
      opacity:phase===2?0:1,transition:"opacity 0.6s ease",
    }}>
      <div style={{
        transform:phase>=1?"scale(1) translateY(0)":"scale(0.8) translateY(10px)",
        opacity:phase>=0?1:0,transition:"all 0.5s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <ShelfLogo size={72} bg="transparent" fg="#fff"/>
      </div>
      <div style={{
        fontFamily:FB,fontSize:36,fontWeight:800,color:"#fff",letterSpacing:"-0.03em",marginTop:16,
        opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(12px)",
        transition:"all 0.4s ease 0.1s",
      }}>Shelf<span style={{opacity:0.5}}>.</span></div>
      <div style={{
        fontSize:14,color:"rgba(255,255,255,0.6)",marginTop:8,fontWeight:500,
        opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(8px)",
        transition:"all 0.4s ease 0.2s",
      }}>Track it. Use it. Waste less.</div>
    </div>
  );
}

function PhoneScreen({onSubmit}){
  const [phone,setPhone]=useState("");
  const [countryCode]=useState("+91");
  const valid=phone.replace(/\D/g,"").length===10;
  return(
    <div style={{position:"absolute",inset:0,background:"#FAF9F7",display:"flex",flexDirection:"column",zIndex:90,animation:"slideUp 0.4s ease"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 32px"}}>
        <ShelfLogo size={44} bg="#F9A602" fg="#fff"/>
        <div style={{fontFamily:FB,fontSize:24,fontWeight:700,color:"#1A1A1A",marginTop:20,letterSpacing:"-0.02em"}}>Welcome to Shelf.</div>
        <div style={{fontSize:14,color:"#8C8C88",marginTop:6,lineHeight:1.6}}>Enter your phone number to get started. We'll send you a verification code.</div>

        <div style={{display:"flex",gap:8,marginTop:32}}>
          <div style={{width:64,height:52,borderRadius:14,border:"1px solid #EEEDEA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:600,color:"#1A1A1A",background:"#fff"}}>{countryCode}</div>
          <input
            value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
            placeholder="Phone number" type="tel" inputMode="numeric"
            style={{flex:1,height:52,borderRadius:14,border:"1px solid #EEEDEA",padding:"0 16px",fontSize:16,color:"#1A1A1A",background:"#fff",outline:"none",fontFamily:F,letterSpacing:"0.05em"}}
            onFocus={e=>e.target.style.borderColor="#F9A602"} onBlur={e=>e.target.style.borderColor="#EEEDEA"}
          />
        </div>

        <button onClick={()=>{if(valid)onSubmit(phone);}} style={{
          width:"100%",height:52,borderRadius:14,border:"none",marginTop:20,
          background:valid?"#F9A602":"#EEEDEA",color:valid?"#fff":"#C0C0BA",
          fontSize:16,fontWeight:600,cursor:valid?"pointer":"default",fontFamily:F,
          boxShadow:valid?"0 4px 16px rgba(249,166,2,0.3)":"none",
          transition:"all 0.2s",
        }}>Continue</button>

        <div style={{fontSize:12,color:"#C0C0BA",textAlign:"center",marginTop:20,lineHeight:1.6}}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}

function OTPScreen({phone,onVerify}){
  const [otp,setOtp]=useState(["","","","","",""]);
  const [verifying,setVerifying]=useState(false);
  const [verified,setVerified]=useState(false);
  const refs=[useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];

  const handleChange=(i,v)=>{
    if(!/^\d*$/.test(v))return;
    const n=[...otp];n[i]=v.slice(-1);setOtp(n);
    if(v&&i<5)refs[i+1].current?.focus();
    if(n.every(d=>d)){
      setTimeout(()=>{setVerifying(true);setTimeout(()=>{setVerifying(false);setVerified(true);setTimeout(onVerify,600);},1200);},300);
    }
  };
  const handleKey=(i,e)=>{if(e.key==="Backspace"&&!otp[i]&&i>0)refs[i-1].current?.focus();};

  return(
    <div style={{position:"absolute",inset:0,background:"#FAF9F7",display:"flex",flexDirection:"column",zIndex:90,animation:"slideUp 0.35s ease"}}>
      <div style={{padding:"16px 20px"}}><div onClick={()=>{}} style={{cursor:"pointer",color:"#1A1A1A",padding:4}}><IBack/></div></div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 32px",marginTop:-60}}>
        <div style={{fontFamily:FB,fontSize:22,fontWeight:700,color:"#1A1A1A",letterSpacing:"-0.02em"}}>Verify your number</div>
        <div style={{fontSize:14,color:"#8C8C88",marginTop:6}}>We sent a 6-digit code to +91 {phone}</div>

        <div style={{display:"flex",gap:8,marginTop:32,justifyContent:"center"}}>
          {otp.map((d,i)=>(
            <input key={i} ref={refs[i]} value={d}
              onChange={e=>handleChange(i,e.target.value)}
              onKeyDown={e=>handleKey(i,e)}
              type="tel" inputMode="numeric" maxLength={1}
              style={{
                width:46,height:56,borderRadius:14,border:`1.5px solid ${d?"#F9A602":"#EEEDEA"}`,
                textAlign:"center",fontSize:22,fontWeight:700,color:"#1A1A1A",
                background:d?"#FFF8E8":"#fff",outline:"none",fontFamily:F,
                transition:"all 0.15s",
              }}
              onFocus={e=>e.target.style.borderColor="#F9A602"}
              onBlur={e=>{if(!d)e.target.style.borderColor="#EEEDEA";}}
            />
          ))}
        </div>

        {verifying&&<div style={{textAlign:"center",marginTop:24,fontSize:14,color:"#F9A602",fontWeight:500,animation:"pulse 1s ease infinite"}}>Verifying...</div>}
        {verified&&<div style={{textAlign:"center",marginTop:24,fontSize:14,color:"#2E8B44",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><ICheck/> Verified</div>}

        <div style={{textAlign:"center",marginTop:32}}>
          <span style={{fontSize:13,color:"#8C8C88"}}>Didn't receive the code? </span>
          <span style={{fontSize:13,color:"#F9A602",fontWeight:600,cursor:"pointer"}}>Resend</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ ITEM ROW ═══ */
function ItemRow({item,onClick,onSwipe}){
  const t=U();const d=du(item.exp);
  const [sw,setSw]=useState(null);const [ox,setOx]=useState(0);const sx=useRef(0);const dr=useRef(false);
  const onS=x=>{sx.current=x;dr.current=true};const onM=x=>{if(dr.current)setOx(x-sx.current)};
  const onE=()=>{dr.current=false;if(ox<-70){setSw("t");setTimeout(()=>onSwipe(item.id,"tossed"),250);}else if(ox>70){setSw("u");setTimeout(()=>onSwipe(item.id,"consumed"),250);}else setOx(0);};
  let sc=t.ok,sl=`${d}d`;if(d<0){sc=t.urgent;sl=`${Math.abs(d)}d ago`;}else if(d===0){sc=t.urgent;sl="today";}else if(d<=3){sc=t.warn;sl=`${d}d`;}
  return(
    <div style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,display:"flex"}}><div style={{flex:1,background:t.ok,display:"flex",alignItems:"center",paddingLeft:20,color:"#fff",fontSize:12,fontWeight:600}}>Used</div><div style={{flex:1,background:t.urgent,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:20,color:"#fff",fontSize:12,fontWeight:600}}>Tossed</div></div>
      <div onTouchStart={e=>onS(e.touches[0].clientX)} onTouchMove={e=>onM(e.touches[0].clientX)} onTouchEnd={onE} onMouseDown={e=>onS(e.clientX)} onMouseMove={e=>onM(e.clientX)} onMouseUp={onE} onMouseLeave={()=>{if(dr.current)onE();}} onClick={()=>{if(Math.abs(ox)<5)onClick(item);}}
        style={{position:"relative",background:t.card,padding:"10px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transform:`translateX(${sw==="u"?400:sw==="t"?-400:ox}px)`,opacity:sw?0:1,transition:sw||!dr.current?"all 0.25s cubic-bezier(.4,0,.2,1)":"none",userSelect:"none",borderBottom:`0.5px solid ${t.border}`}}>
        <PI k={item.icon} size={36}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:500,color:t.text,lineHeight:1.3}}>{item.name}</div><div style={{fontSize:11,color:t.muted,marginTop:1}}>{item.sub} · {fd(item.exp)}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}><div style={{width:5,height:5,borderRadius:"50%",background:sc}}/><span style={{fontSize:12,fontWeight:600,color:sc}}>{sl}</span></div>
      </div>
    </div>
  );
}

/* ═══ TAB BAR ═══ */
function TabBar({active,onTab,buyCount}){const t=U();return(
  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-around",padding:"0 8px 20px",background:t.tabBar,backdropFilter:"blur(16px)",borderTop:`0.5px solid ${t.border}`,flexShrink:0,height:72}}>
    {[{id:"home",icon:<IHome on={active==="home"}/>,label:"Home"},{id:"buy",icon:<ICart on={active==="buy"}/>,label:"Buy",badge:buyCount},{id:"add",fab:true},{id:"stats",icon:<IBarI/>,label:"Stats"},{id:"settings",icon:<IGear/>,label:"Settings"}].map(tab=>{
      if(tab.fab)return <div key="add" onClick={()=>onTab("add")} style={{cursor:"pointer",marginBottom:8,width:56,height:56,borderRadius:18,background:t.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:t.fabShadow,transition:"transform 0.12s",position:"relative"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}><IPlus/><div style={{position:"absolute",bottom:-14,fontSize:9,fontWeight:600,color:t.sub}}>Add</div></div>;
      const isA=active===tab.id;return <div key={tab.id} onClick={()=>onTab(tab.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"8px 12px",color:isA?t.accent:t.muted,position:"relative",transition:"color 0.15s"}}>{tab.icon}<span style={{fontSize:9,fontWeight:600}}>{tab.label}</span>{tab.badge>0&&<div style={{position:"absolute",top:2,right:2,minWidth:16,height:16,borderRadius:8,background:t.accent,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{tab.badge}</div>}</div>;
    })}
  </div>
);}

/* ═══ HOME — with empty state onboarding ═══ */
function HomePage({items,onItem,onSwipe,onTab,buyCount}){
  const t=U();const [filter,setFilter]=useState("all");
  const all=[...items].sort((a,b)=>du(a.exp)-du(b.exp));const list=filter==="all"?all:all.filter(i=>i.cat===filter);
  const expired=list.filter(i=>du(i.exp)<0);const urgent=list.filter(i=>{const d=du(i.exp);return d>=0&&d<=3;});const fresh=list.filter(i=>du(i.exp)>3);
  const Section=({label,count,dot,children})=>(<div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:5,padding:"0 4px",marginBottom:6}}><div style={{width:4,height:4,borderRadius:2,background:dot}}/><span style={{fontSize:11,fontWeight:600,color:t.sub,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</span><span style={{fontSize:11,color:t.muted}}>{count}</span></div><div style={{borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>{children}</div></div>);
  const isEmpty=items.length===0;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 20px 0",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><ShelfLogo size={30}/><div style={{fontFamily:FB,fontSize:26,fontWeight:700,color:t.accent,letterSpacing:"-0.03em"}}>Shelf<span style={{color:t.muted}}>.</span></div></div>
        </div>
        {!isEmpty&&<>
          <div style={{display:"flex",gap:16,marginBottom:16,paddingLeft:2}}>
            {[{n:items.filter(i=>du(i.exp)<0).length,l:"expired",c:t.urgent},{n:items.filter(i=>{const d=du(i.exp);return d>=0&&d<=3;}).length,l:"expiring",c:t.warn},{n:items.filter(i=>du(i.exp)>3).length,l:"fresh",c:t.ok}].map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:FD}}>{s.n}</span><span style={{fontSize:11,color:t.muted}}>{s.l}</span></div>))}
            <div style={{marginLeft:"auto",display:"flex",alignItems:"baseline",gap:3}}><span style={{fontSize:18,fontWeight:700,color:t.accent,fontFamily:FD}}>{items.length}</span><span style={{fontSize:11,color:t.muted}}>total</span></div>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:2}}>{CATS.map(c=>(<div key={c.id} onClick={()=>setFilter(c.id)} style={{padding:"6px 13px",borderRadius:10,fontSize:12,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",background:filter===c.id?t.accent:"transparent",color:filter===c.id?"#fff":t.sub,transition:"all 0.15s"}}>{c.label}</div>))}</div>
        </>}
      </div>
      <div style={{flex:1,overflow:"auto",padding:"0 20px 8px"}}>
        {isEmpty?(
          /* ── Empty state: gentle onboarding ── */
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"0 12px",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:24,background:t.accentLight,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <ShelfLogo size={40} bg="transparent" fg={t.accent}/>
            </div>
            <div style={{fontSize:18,fontWeight:600,color:t.text,marginBottom:6}}>Your shelf is empty</div>
            <div style={{fontSize:14,color:t.sub,lineHeight:1.6,maxWidth:260,marginBottom:28}}>
              Start by adding your first item. Scan the expiry date or add it manually.
            </div>
            <div onClick={()=>onTab("add")} style={{
              display:"flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:14,
              background:t.accent,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",
              boxShadow:t.fabShadow,transition:"transform 0.12s",
            }} onMouseDown={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
              <IPlus/> Add your first item
            </div>
            <div style={{display:"flex",gap:20,marginTop:36}}>
              {[{icon:"🍚",label:"Food"},{icon:"💊",label:"Medicine"},{icon:"🧴",label:"Beauty"}].map((h,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:48,height:48,borderRadius:14,background:t.card,boxShadow:t.shadow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{h.icon}</div>
                  <span style={{fontSize:10,color:t.muted,fontWeight:500}}>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        ):(
          <>
            {expired.length>0&&<Section label="Expired" count={expired.length} dot={t.urgentDot}>{expired.map(i=><ItemRow key={i.id} item={i} onClick={onItem} onSwipe={onSwipe}/>)}</Section>}
            {urgent.length>0&&<Section label="Use soon" count={urgent.length} dot={t.warnDot}>{urgent.map(i=><ItemRow key={i.id} item={i} onClick={onItem} onSwipe={onSwipe}/>)}</Section>}
            {fresh.length>0&&<Section label="Fresh" count={fresh.length} dot={t.okDot}>{fresh.map(i=><ItemRow key={i.id} item={i} onClick={onItem} onSwipe={onSwipe}/>)}</Section>}
            <div style={{fontSize:10,color:t.muted,textAlign:"center",padding:"8px 0"}}>swipe right = used · swipe left = tossed</div>
          </>
        )}
      </div>
      <TabBar active="home" onTab={onTab} buyCount={buyCount}/>
    </div>
  );
}

/* ═══ BUY, ADD, DETAIL, STATS, SETTINGS — same as before (compact) ═══ */
function BuyPage({buyList,onRemove,onClear,onTab,buyCount}){const t=U();const [ck,setCk]=useState({});const tog=id=>setCk(p=>({...p,[id]:!p[id]}));const cc=Object.values(ck).filter(Boolean).length;
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div style={{padding:"12px 20px 0",flexShrink:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontFamily:FD,fontSize:22,fontWeight:400,color:t.text}}>Buy again</div>{buyList.length>0&&<div onClick={onClear} style={{fontSize:12,color:t.accent,fontWeight:600,cursor:"pointer"}}>Clear all</div>}</div><div style={{fontSize:12,color:t.muted,marginBottom:16}}>Auto-added when items expire or get tossed</div></div>
    <div style={{flex:1,overflow:"auto",padding:"0 20px 8px"}}>{buyList.length===0?(<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{opacity:0.3,marginBottom:12,fontSize:36}}>🛒</div><div style={{fontSize:14,color:t.sub}}>Nothing to buy yet</div><div style={{fontSize:12,color:t.muted,marginTop:4,lineHeight:1.6}}>When items expire or get tossed, they'll appear here.</div></div>):(<div style={{borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>{buyList.map((item,i)=>(<div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:t.card,borderBottom:i<buyList.length-1?`0.5px solid ${t.border}`:"none"}}><div onClick={()=>tog(item.id)} style={{width:22,height:22,borderRadius:7,border:`1.5px solid ${ck[item.id]?t.accent:t.muted}`,background:ck[item.id]?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s",color:"#fff",flexShrink:0}}>{ck[item.id]&&<ICheck/>}</div><PI k={item.icon} size={30}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:500,color:ck[item.id]?t.muted:t.text,textDecoration:ck[item.id]?"line-through":"none"}}>{item.name}</div><div style={{fontSize:11,color:t.muted}}>{item.reason==="expired"?"Expired":"Tossed"} · {fd(item.date)}</div></div><div onClick={()=>onRemove(item.id)} style={{cursor:"pointer",color:t.muted,padding:4}}><ITrash/></div></div>))}</div>)}{cc>0&&<div style={{marginTop:14,padding:"12px",borderRadius:12,background:t.accentLight,textAlign:"center"}}><span style={{fontSize:13,color:t.accent,fontWeight:600}}>{cc} checked off</span></div>}</div>
    <TabBar active="buy" onTab={onTab} buyCount={buyCount}/></div>);
}

function AddPage({onBack,onAdd}){const t=U();const [mode,setMode]=useState("choose");const [name,setName]=useState("");const [sub,setSub]=useState("");const [exp,setExp]=useState("");const [cat,setCat]=useState("food");const [store,setStore]=useState("fridge");const [icon,setIcon]=useState("milk");const [scanning,setScanning]=useState(false);const [scanned,setScanned]=useState(false);
  const sim=()=>{setScanning(true);setTimeout(()=>{setScanning(false);setScanned(true);setName("Amul Toned Milk");setSub("500 ml");setExp(dfn(8));setCat("food");setStore("fridge");setIcon("milk");},2000);};
  const submit=()=>{if(!name.trim()||!exp)return;onAdd({name,sub,exp,cat,store,icon});};const icons=ICON_OPTIONS[cat]||ICON_OPTIONS.food;
  if(mode==="choose")return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:t.bg}}><div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}><div onClick={onBack} style={{cursor:"pointer",padding:4,color:t.text}}><IBack/></div><span style={{fontSize:16,fontWeight:600,color:t.text}}>Add item</span></div><div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"0 32px"}}><div onClick={()=>{setMode("camera");sim();}} style={{width:"100%",padding:"28px 20px",borderRadius:18,background:t.accent,color:"#fff",textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,boxShadow:t.fabShadow,transition:"transform 0.12s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}><ICam/><div style={{fontSize:15,fontWeight:600}}>Scan expiry date</div><div style={{fontSize:12,opacity:0.6}}>Point camera at the label</div></div><div onClick={()=>setMode("manual")} style={{width:"100%",padding:"28px 20px",borderRadius:18,background:t.card,color:t.text,textAlign:"center",cursor:"pointer",boxShadow:t.shadow,display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"transform 0.12s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}><span style={{color:t.sub}}><IPen/></span><div style={{fontSize:15,fontWeight:600}}>Add manually</div><div style={{fontSize:12,color:t.sub}}>Type name and expiry date</div></div></div></div>);
  if(mode==="camera"&&!scanned)return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:"#000"}}><div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}><div onClick={onBack} style={{cursor:"pointer",padding:4,color:"#fff"}}><IBack/></div><span style={{fontSize:16,fontWeight:600,color:"#fff"}}>Scan expiry date</span></div><div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><div style={{width:240,height:150,border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{scanning&&<div style={{color:"#F9A602",fontSize:13,animation:"pulse 1.2s ease infinite"}}>Reading...</div>}</div></div></div>);
  const Lbl=({children})=><div style={{fontSize:11,fontWeight:600,color:t.muted,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>{children}</div>;const inpS={width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:14,color:t.text,background:t.inputBg,outline:"none",marginBottom:16,fontFamily:F};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:t.bg}}><div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}><div onClick={onBack} style={{cursor:"pointer",padding:4,color:t.text}}><IBack/></div><span style={{fontSize:16,fontWeight:600,color:t.text}}>{scanned?"Confirm details":"Add manually"}</span></div>
    <div style={{flex:1,overflow:"auto",padding:"0 20px 20px"}}>{scanned&&<div style={{padding:"10px 14px",borderRadius:12,marginBottom:16,fontSize:12,color:t.accent,fontWeight:500,background:t.accentLight,display:"flex",alignItems:"center",gap:6}}><ICheck/> Detected — confirm below</div>}
      <Lbl>Category</Lbl><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>{CATS.filter(c=>c.id!=="all").map(c=><div key={c.id} onClick={()=>{setCat(c.id);setIcon((ICON_OPTIONS[c.id]||ICON_OPTIONS.food)[0]);}} style={{padding:"7px 12px",borderRadius:10,fontSize:12,fontWeight:500,cursor:"pointer",background:cat===c.id?t.accent:"transparent",color:cat===c.id?"#fff":t.sub,transition:"all 0.12s"}}>{c.label}</div>)}</div>
      <Lbl>Icon</Lbl><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{icons.map(k=><div key={k} onClick={()=>setIcon(k)} style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:icon===k?t.accentLight:"transparent",border:icon===k?`2px solid ${t.accent}`:"2px solid transparent",transition:"all 0.12s"}}><PI k={k} size={30}/></div>)}</div>
      <Lbl>Product name</Lbl><input value={name} onChange={e=>setName(e.target.value)} placeholder={PH[cat]} style={inpS} onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=t.border}/>
      <Lbl>Quantity / size</Lbl><input value={sub} onChange={e=>setSub(e.target.value)} placeholder="e.g. 500 ml, 200 g" style={inpS} onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=t.border}/>
      <Lbl>Expiry date</Lbl><input type="date" value={exp} onChange={e=>setExp(e.target.value)} style={inpS} onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=t.border}/>
      <Lbl>Stored in</Lbl><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:24}}>{STORES.map(s=><div key={s.id} onClick={()=>setStore(s.id)} style={{padding:"10px 12px",borderRadius:12,fontSize:12,fontWeight:500,cursor:"pointer",background:store===s.id?t.accent:"transparent",color:store===s.id?"#fff":t.sub,transition:"all 0.12s"}}>{s.label}</div>)}</div>
      <button onClick={submit} disabled={!name.trim()||!exp} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:name.trim()&&exp?t.accent:t.border,color:name.trim()&&exp?"#fff":t.muted,fontSize:15,fontWeight:600,cursor:name.trim()&&exp?"pointer":"default",fontFamily:F,boxShadow:name.trim()&&exp?t.fabShadow:"none",transition:"all 0.15s"}}>Add to shelf</button>
    </div></div>);
}

function DetailPage({item,onBack,onDelete}){const t=U();const d=du(item.exp);let sc=t.ok,sl=`${d} days left`;if(d<0){sc=t.urgent;sl=`${Math.abs(d)} days overdue`;}else if(d===0){sc=t.urgent;sl="Expires today";}else if(d<=3){sc=t.warn;}const pct=Math.max(0,Math.min(100,d<0?100:d<=14?((14-d)/14)*100:5));
  return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:t.bg}}><div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><div onClick={onBack} style={{cursor:"pointer",padding:4,color:t.text}}><IBack/></div><div onClick={()=>onDelete(item.id)} style={{cursor:"pointer",color:t.urgent,fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:4}}><ITrash/> Remove</div></div>
    <div style={{flex:1,overflow:"auto",padding:"0 20px 20px"}}><div style={{textAlign:"center",marginBottom:28}}><div style={{display:"inline-block"}}><PI k={item.icon} size={56}/></div><div style={{fontFamily:FD,fontSize:22,fontWeight:400,color:t.text,marginTop:12}}>{item.name}</div>{item.sub&&<div style={{fontSize:13,color:t.sub,marginTop:2}}>{item.sub}</div>}<div style={{fontSize:12,color:t.muted,marginTop:4}}>{CAT_LABELS[item.cat]} · {STORES.find(s=>s.id===item.store)?.label}</div></div>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:32,fontWeight:700,color:sc,fontFamily:FD}}>{sl}</div><div style={{fontSize:13,color:t.sub,marginTop:4}}>Use by {fd(item.exp)}</div><div style={{marginTop:14,height:4,borderRadius:2,background:t.border,overflow:"hidden",maxWidth:200,margin:"0 auto"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:2,background:sc,transition:"width 0.4s"}}/></div></div>
      <div style={{borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>{[{l:"Added",v:fd(item.added)},{l:"Expires",v:fd(item.exp)},{l:"Category",v:CAT_LABELS[item.cat]},{l:"Storage",v:STORES.find(s=>s.id===item.store)?.label}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"13px 16px",background:t.card,borderBottom:i<3?`0.5px solid ${t.border}`:"none",fontSize:13}}><span style={{color:t.sub}}>{r.l}</span><span style={{color:t.text,fontWeight:500}}>{r.v}</span></div>))}</div></div></div>);
}

function StatsPage({items,consumed,tossed,onTab,buyCount}){const t=U();const tot=consumed+tossed;const pct=tot>0?Math.round((consumed/tot)*100):0;const cats=CATS.filter(c=>c.id!=="all").map(c=>({...c,n:items.filter(i=>i.cat===c.id).length})).filter(c=>c.n>0);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div style={{padding:"12px 20px 0",flexShrink:0}}><div style={{fontFamily:FD,fontSize:22,fontWeight:400,color:t.text,marginBottom:16}}>Stats</div></div>
    <div style={{flex:1,overflow:"auto",padding:"0 20px 8px"}}><div style={{padding:"28px 20px",borderRadius:18,background:t.accent,color:"#fff",textAlign:"center",marginBottom:14,boxShadow:t.fabShadow}}><div style={{fontSize:48,fontWeight:700,fontFamily:FD}}>{pct}%</div><div style={{fontSize:13,opacity:0.55,marginTop:4}}>used before expiry</div><div style={{display:"flex",gap:8,marginTop:18}}>{[{n:consumed,l:"Used"},{n:tossed,l:"Tossed"}].map((s,i)=>(<div key={i} style={{flex:1,padding:"12px",borderRadius:12,background:"rgba(255,255,255,0.15)"}}><div style={{fontSize:22,fontWeight:700}}>{s.n}</div><div style={{fontSize:10,opacity:0.5,marginTop:2}}>{s.l}</div></div>))}</div></div>
      <div style={{padding:"16px 18px",borderRadius:14,background:t.accentLight,marginBottom:14}}><div style={{fontSize:11,color:t.accent,fontWeight:600}}>EST. SAVINGS</div><div style={{fontSize:28,fontWeight:700,color:t.accent,fontFamily:FD,marginTop:2}}>${(consumed*4.5).toFixed(0)}</div></div>
      {cats.length>0&&<div style={{borderRadius:14,overflow:"hidden",boxShadow:t.shadow,marginBottom:14}}><div style={{padding:"12px 16px 6px",fontSize:10,color:t.muted,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",background:t.card}}>By category</div>{cats.map((c,i)=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",background:t.card,borderBottom:i<cats.length-1?`0.5px solid ${t.border}`:"none",fontSize:13}}><span style={{color:t.text}}>{c.label}</span><span style={{fontWeight:600,color:t.text}}>{c.n}</span></div>))}</div>}
      <div style={{padding:"20px",borderRadius:16,background:t.accent,color:"#fff",textAlign:"center",boxShadow:t.fabShadow}}><div style={{fontFamily:FD,fontSize:16,fontWeight:400}}>Shelf Premium</div><div style={{fontSize:11,opacity:0.5,marginTop:4,marginBottom:14}}>Unlimited · Custom alerts · Sharing</div><div style={{display:"inline-block",padding:"10px 24px",borderRadius:12,background:"#fff",color:t.accent,fontSize:13,fontWeight:700,cursor:"pointer"}}>$2.99/mo</div></div></div>
    <TabBar active="stats" onTab={onTab} buyCount={buyCount}/></div>);
}

function SettingsPage({onBack,dark,toggleDark}){const t=U();return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:t.bg}}><div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}><div onClick={onBack} style={{cursor:"pointer",padding:4,color:t.text}}><IBack/></div><span style={{fontSize:16,fontWeight:600,color:t.text}}>Settings</span></div>
  <div style={{flex:1,overflow:"auto",padding:"0 20px"}}>{[{section:"Appearance",items:[{l:"Dark mode",custom:<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:t.sub}}>{dark?<IMoon/>:<ISun/>}</span><Toggle on={dark} fn={toggleDark}/></div>}]},{section:"Notifications",items:[{l:"Before expiry",v:"3 days"},{l:"Daily summary",v:"9 AM"},{l:"Expired alert",v:"On"}]},{section:"Account",items:[{l:"Plan",v:"Free"},{l:"Export",v:"CSV"},{l:"Version",v:"1.0.0"}]}].map((s,si)=>(<div key={si} style={{marginBottom:22}}><div style={{fontSize:10,fontWeight:600,color:t.muted,letterSpacing:"0.06em",marginBottom:6,textTransform:"uppercase"}}>{s.section}</div><div style={{borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>{s.items.map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:t.card,borderBottom:i<s.items.length-1?`0.5px solid ${t.border}`:"none",fontSize:13}}><span style={{color:t.text}}>{it.l}</span>{it.custom||<span style={{color:t.muted}}>{it.v} ›</span>}</div>))}</div></div>))}</div></div>);}

/* ════════════ ROOT ════════════ */
export default function App(){
  const [authStage,setAuthStage]=useState("splash"); // splash → phone → otp → app
  const [phone,setPhone]=useState("");
  const [scr,setScr]=useState("home");
  const [items,setItems]=useState([]); // start empty for new user
  const [sel,setSel]=useState(null);
  const [used,setUsed]=useState(0);const [tossed,setTossed]=useState(0);
  const [dark,setDark]=useState(false);
  const [buyList,setBuyList]=useState([]);
  const theme=dark?THEMES.dark:THEMES.light;

  const addBuy=(item,reason)=>{setBuyList(prev=>{if(prev.find(b=>b.name===item.name))return prev;return[...prev,{id:Date.now(),name:item.name,sub:item.sub,icon:item.icon,reason,date:dfn(0)}];});};
  const swipe=(id,action)=>{const item=items.find(i=>i.id===id);setItems(p=>p.filter(i=>i.id!==id));if(action==="consumed"){setUsed(u=>u+1);if(item&&du(item.exp)<0)addBuy(item,"expired");}else{setTossed(t=>t+1);if(item)addBuy(item,"tossed");}};
  const del=id=>{const item=items.find(i=>i.id===id);setItems(p=>p.filter(i=>i.id!==id));if(item&&du(item.exp)<0)addBuy(item,"expired");setScr("home");};
  const add=n=>{setItems(p=>[...p,{...n,id:Date.now(),added:dfn(0)}]);setScr("home");};

  return(
    <TC.Provider value={theme}>
      <div style={{width:390,height:844,margin:"20px auto",borderRadius:44,overflow:"hidden",background:theme.bg,fontFamily:F,boxShadow:"0 0 0 0.5px rgba(0,0,0,0.05),0 4px 24px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",transition:"background 0.35s ease",position:"relative"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;700&family=Montserrat:wght@400;600;700;800&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}input{font-family:inherit}::-webkit-scrollbar{display:none}`}</style>

        {/* status bar */}
        <div style={{display:"flex",justifyContent:"space-between",padding:"14px 28px 8px",fontSize:13,fontWeight:600,color:authStage==="splash"?"#fff":theme.statusFill,flexShrink:0,transition:"color 0.35s",position:"relative",zIndex:110}}>
          <span>9:41</span>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="5" width="3" height="6" rx="1" fill={authStage==="splash"?"#fff":theme.statusFill}/><rect x="4.5" y="3" width="3" height="8" rx="1" fill={authStage==="splash"?"#fff":theme.statusFill}/><rect x="9" y="1" width="3" height="10" rx="1" fill={authStage==="splash"?"#fff":theme.statusFill}/><rect x="13.5" y="0" width="2.5" height="11" rx="1" fill={authStage==="splash"?"rgba(255,255,255,0.3)":theme.muted} opacity=".3"/></svg>
            <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 1.5C5.3 1.5 3.3 2.4 1.9 3.8L.3 2.2C2.1.6 4.7 0 7.5 0s5.4.6 7.2 2.2L13.1 3.8C11.7 2.4 9.7 1.5 7.5 1.5z" fill={authStage==="splash"?"#fff":theme.statusFill}/><circle cx="7.5" cy="9" r="1.8" fill={authStage==="splash"?"#fff":theme.statusFill}/></svg>
            <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0" y="0" width="19" height="11" rx="2.5" stroke={authStage==="splash"?"#fff":theme.statusFill} strokeWidth=".8" fill="none"/><rect x="1.2" y="1.2" width="14" height="8.6" rx="1.5" fill={authStage==="splash"?"#fff":theme.ok}/></svg>
          </div>
        </div>

        {/* auth flow overlays */}
        {authStage==="splash"&&<SplashScreen onDone={()=>setAuthStage("phone")}/>}
        {authStage==="phone"&&<PhoneScreen onSubmit={p=>{setPhone(p);setAuthStage("otp");}}/>}
        {authStage==="otp"&&<OTPScreen phone={phone} onVerify={()=>setAuthStage("app")}/>}

        {/* main app */}
        {authStage==="app"&&<>
          {scr==="home"&&<HomePage items={items} onItem={i=>{setSel(i);setScr("detail");}} onSwipe={swipe} onTab={t=>setScr(t==="add"?"add":t)} buyCount={buyList.length}/>}
          {scr==="buy"&&<BuyPage buyList={buyList} onRemove={id=>setBuyList(p=>p.filter(i=>i.id!==id))} onClear={()=>setBuyList([])} onTab={t=>setScr(t==="add"?"add":t)} buyCount={buyList.length}/>}
          {scr==="add"&&<AddPage onBack={()=>setScr("home")} onAdd={add}/>}
          {scr==="detail"&&sel&&<DetailPage item={sel} onBack={()=>setScr("home")} onDelete={del}/>}
          {scr==="stats"&&<StatsPage items={items} consumed={used} tossed={tossed} onTab={t=>setScr(t==="add"?"add":t)} buyCount={buyList.length}/>}
          {scr==="settings"&&<SettingsPage onBack={()=>setScr("home")} dark={dark} toggleDark={()=>setDark(d=>!d)}/>}
        </>}
      </div>
    </TC.Provider>
  );
}
