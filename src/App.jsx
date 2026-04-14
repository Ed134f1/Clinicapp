import { useState, useEffect } from “react”;

function useLS(key, init) {
const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
useEffect(() => { localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
return [v, setV];
}

const C = { bg:”#0A0F1E”,card:”#111827”,cardHover:”#1a2235”,sidebar:”#080D1A”,accent:”#00D4FF”,accentBg:”#00D4FF15”,green:”#00E5A0”,greenBg:”#00E5A015”,amber:”#FFB800”,amberBg:”#FFB80015”,red:”#FF4D6A”,redBg:”#FF4D6A15”,purple:”#A78BFA”,purpleBg:”#A78BFA15”,pink:”#F472B6”,pinkBg:”#F472B615”,text:”#F0F4FF”,muted:”#6B7A99”,dim:”#2D3F5E”,border:”#1E2D45” };
const avatarColors=[C.accent,C.green,C.amber,C.purple,C.red,C.pink];
const getColor=n=>avatarColors[(n?.charCodeAt(0)||0)%avatarColors.length];
const ini=n=>n?n.split(” “).map(w=>w[0]).slice(0,2).join(””).toUpperCase():”?”;
const todayStr=()=>new Date().toISOString().split(“T”)[0];
const nowStr=()=>{const n=new Date();return n.toISOString().split(“T”)[0]+” “+n.toTimeString().slice(0,5);};
const fmtDate=d=>d?new Date(d+“T12:00:00”).toLocaleDateString(“es-HN”,{day:“numeric”,month:“short”,year:“numeric”}):”—”;
const fmtLps=n=>`Lps. ${Number(n||0).toLocaleString("es-HN",{minimumFractionDigits:2})}`;
const calcEdad=fn=>{if(!fn)return”—”;const h=new Date(),na=new Date(fn+“T12:00:00”);let y=h.getFullYear()-na.getFullYear(),m=h.getMonth()-na.getMonth(),d=h.getDate()-na.getDate();if(d<0){m–;d+=new Date(h.getFullYear(),h.getMonth(),0).getDate();}if(m<0){y–;m+=12;}return`${y} años, ${m} meses y ${d} días`;};
const calcIMC=(p,t)=>{if(!p||!t||isNaN(p)||isNaN(t)||Number(t)===0)return””;return(Number(p)/(Number(t)*Number(t))).toFixed(1);};
const clasNut=imc=>{const v=parseFloat(imc);if(!v)return””;if(v<18.5)return”Bajo peso”;if(v<25)return”Normal”;if(v<30)return”Sobrepeso”;if(v<35)return”Obesidad I”;if(v<40)return”Obesidad II”;return”Obesidad III”;};
const calcPAM=(s,d)=>(!s||!d)?””:((Number(s)+2*Number(d))/3).toFixed(1);

const S={
app:{display:“flex”,height:“100vh”,width:“100vw”,background:C.bg,fontFamily:”‘DM Sans’,sans-serif”,color:C.text,overflow:“hidden”},
sidebar:{width:210,background:C.sidebar,borderRight:`1px solid ${C.border}`,display:“flex”,flexDirection:“column”,padding:“20px 0”,flexShrink:0,overflowY:“auto”},
logo:{padding:“0 16px 18px”,borderBottom:`1px solid ${C.border}`,marginBottom:10},
main:{flex:1,display:“flex”,flexDirection:“column”,overflow:“hidden”},
topbar:{height:54,borderBottom:`1px solid ${C.border}`,display:“flex”,alignItems:“center”,padding:“0 24px”,justifyContent:“space-between”,background:C.sidebar,flexShrink:0},
content:{flex:1,overflow:“auto”,padding:22},
card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18},
statCard:c=>({background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,borderTop:`3px solid ${c}`}),
g2:{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:12},
g3:{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:12},
g4:{display:“grid”,gridTemplateColumns:“repeat(4,1fr)”,gap:12},
nav:a=>({display:“flex”,alignItems:“center”,gap:8,padding:“9px 16px”,cursor:“pointer”,color:a?C.accent:C.muted,background:a?C.accentBg:“transparent”,borderLeft:`2px solid ${a?C.accent:"transparent"}`,fontSize:12,fontWeight:a?700:400,userSelect:“none”}),
secTitle:{fontSize:11,fontWeight:700,color:C.muted,textTransform:“uppercase”,letterSpacing:“0.8px”,marginBottom:12},
badge:(c,bg)=>({display:“inline-block”,padding:“3px 9px”,borderRadius:20,fontSize:11,fontWeight:600,color:c,background:bg}),
btn:(bg,c)=>({display:“inline-flex”,alignItems:“center”,gap:5,padding:“7px 13px”,borderRadius:7,border:“none”,background:bg||C.accent,color:c||C.bg,fontSize:12,fontWeight:600,cursor:“pointer”,whiteSpace:“nowrap”}),
btnSm:(bg,c)=>({display:“inline-flex”,alignItems:“center”,gap:4,padding:“4px 9px”,borderRadius:6,border:“none”,background:bg||C.accent,color:c||C.bg,fontSize:11,fontWeight:600,cursor:“pointer”}),
ghost:{display:“inline-flex”,alignItems:“center”,gap:5,padding:“7px 13px”,borderRadius:7,border:`1px solid ${C.border}`,background:“transparent”,color:C.muted,fontSize:12,cursor:“pointer”},
danger:{display:“inline-flex”,alignItems:“center”,gap:3,padding:“4px 9px”,borderRadius:6,border:“none”,background:C.redBg,color:C.red,fontSize:11,fontWeight:600,cursor:“pointer”},
input:{background:”#0A0F1E”,border:`1px solid ${C.border}`,borderRadius:7,padding:“8px 11px”,color:C.text,fontSize:12,outline:“none”,width:“100%”,boxSizing:“border-box”},
label:{fontSize:11,color:C.muted,marginBottom:3,display:“block”,fontWeight:500},
th:(cols)=>({display:“grid”,gridTemplateColumns:cols,padding:“8px 13px”,borderBottom:`1px solid ${C.border}`,color:C.muted,fontSize:10,fontWeight:700,textTransform:“uppercase”,letterSpacing:“0.4px”}),
tr:(cols)=>({display:“grid”,gridTemplateColumns:cols,padding:“10px 13px”,borderBottom:`1px solid ${C.border}`,fontSize:12,alignItems:“center”,transition:“background 0.1s”}),
modal:{position:“fixed”,inset:0,background:”#000000AA”,display:“flex”,alignItems:“center”,justifyContent:“center”,zIndex:200},
modalBox:(w)=>({background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:“95%”,maxWidth:w||620,maxHeight:“90vh”,overflow:“auto”}),
tab:a=>({padding:“7px 14px”,cursor:“pointer”,fontSize:12,fontWeight:a?700:500,color:a?C.accent:C.muted,borderBottom:`2px solid ${a?C.accent:"transparent"}`,whiteSpace:“nowrap”,userSelect:“none”}),
divider:{height:1,background:C.border,margin:“12px 0”},
};

function Modal({title,onClose,children,wide}){return(<div style={S.modal} onClick={onClose}><div style={S.modalBox(wide?880:620)} onClick={e=>e.stopPropagation()}><div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:16}}><div style={{fontSize:14,fontWeight:700}}>{title}</div><button onClick={onClose} style={{…S.ghost,padding:“3px 9px”}}>✕</button></div>{children}</div></div>);}
function F({label,children,span}){return <div style={{marginBottom:10,gridColumn:span?`span ${span}`:undefined}}><label style={S.label}>{label}</label>{children}</div>;}
function Av({name,size=34}){return <div style={{width:size,height:size,borderRadius:“50%”,background:getColor(name),display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:size*0.35,fontWeight:700,color:”#fff”,flexShrink:0}}>{ini(name)}</div>;}

const initPacientes=[
{id:1,nombre:“MALENY NICOLLE VALLADARES AGUILAR”,dni:“0801200014912”,fechaNac:“2000-06-30”,sexo:“M”,estadoCivil:“Soltero(a)”,telefono:“50495839879”,ocupacion:“Operaciones”,residencia:“Colonia Villeda Morales”,nivelEdu:“Universitaria Incompleta”,email:””,fechaReg:“2024-03-08 15:20”,antPersonales:””,antFamiliares:””,antQuirurgicos:””},
{id:2,nombre:“JOSÉ RAMÓN CASTRILLO VALLADARES”,dni:“0801197912345”,fechaNac:“1979-03-30”,sexo:“H”,estadoCivil:“Casado(a)”,telefono:“50498765432”,ocupacion:“Comerciante”,residencia:“Col. Kennedy”,nivelEdu:“Secundaria”,email:””,fechaReg:“2024-04-10 14:56”,antPersonales:“HTA”,antFamiliares:””,antQuirurgicos:””},
];
const initConsultas=[
{id:1,pacienteId:1,fechaHora:“2026-04-13 18:20”,historia:“PACIENTE QUIERE PERDER DE PESO. REFIERE QUE HA SUBIDO DE PESO EN LOS ÚLTIMOS 5 MESES.”,peso:””,talla:””,temp:””,pSistolica:””,pDiastolica:””,fc:””,fr:””,dx:””,cie11:””,farmacos:””,tratamiento:””,laboratorio:””,incapacidad:””,constancia:””,hta:””,diabetes:””,tiroides:””,nefrologia:””,depresion:””,tipoIngreso:“Consulta”,valorIngreso:“300”,formaPago:“Efectivo”,banco:””,recuperada:true},
];
const initIngresos=[
{id:1,pacienteId:1,tipo:“Consulta”,valor:300,fecha:“2026-04-13”,hora:“18:40”,recuperada:true,formaPago:“Efectivo”,banco:””},
{id:2,pacienteId:null,tipo:“Aplicación”,valor:50,fecha:“2026-04-13”,hora:“16:54”,recuperada:true,formaPago:“Efectivo”,banco:””,nombreLibre:””},
];
const initCitas=[{id:1,pacienteId:1,fechaHora:“2026-04-14 09:00”,motivo:“Control de peso”,recordatorio:false,guardado:false}];
const initFarmacos=[{id:1,nombre:“Metformina”,presentacion:“500mg”,dosis:“1 tab c/12h”},{id:2,nombre:“Enalapril”,presentacion:“10mg”,dosis:“1 tab c/24h”},{id:3,nombre:“Losartán”,presentacion:“50mg”,dosis:“1 tab c/24h”},{id:4,nombre:“Atorvastatina”,presentacion:“20mg”,dosis:“1 tab en la noche”},{id:5,nombre:“Ceftriaxona”,presentacion:“1g IV”,dosis:“1g c/24h x 7 días”},{id:6,nombre:“Amoxicilina”,presentacion:“500mg”,dosis:“1 cap c/8h x 7 días”}];
const initPatologias=[{id:1,nombre:“HTA”,descripcion:“Hipertensión Arterial”},{id:2,nombre:“Diabetes”,descripcion:“Diabetes Mellitus Tipo 2”},{id:3,nombre:“Tiroides”,descripcion:“Hipotiroidismo / Hipertiroidismo”},{id:4,nombre:“Nefrología”,descripcion:“Enfermedad Renal”},{id:5,nombre:“Depresión”,descripcion:“Trastorno Depresivo Mayor”}];
const initCIE=[{id:1,codigo:“E11”,descripcion:“Diabetes mellitus tipo 2”},{id:2,codigo:“I10”,descripcion:“Hipertensión esencial”},{id:3,codigo:“E03.9”,descripcion:“Hipotiroidismo, no especificado”},{id:4,codigo:“F32.9”,descripcion:“Episodio depresivo, no especificado”},{id:5,codigo:“N18.9”,descripcion:“Enfermedad renal crónica, no especificada”},{id:6,codigo:“E66.9”,descripcion:“Obesidad, no especificada”}];

// ── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({pacientes,ingresos,consultas,citas,setTab}){
const hoy=todayStr();
const ingHoy=ingresos.filter(i=>i.fecha===hoy);
const ingPend=ingresos.filter(i=>!i.recuperada);
const totalHoy=ingHoy.filter(i=>i.recuperada).reduce((s,i)=>s+Number(i.valor),0);
const cumpleHoy=pacientes.filter(p=>p.fechaNac&&p.fechaNac.slice(5)===hoy.slice(5));
const getPac=id=>pacientes.find(p=>p.id===id);
const tipoColor={“Consulta”:[C.red,C.redBg],“Aplicación”:[C.accent,C.accentBg],“Procedimiento”:[C.purple,C.purpleBg],“Laboratorio”:[C.amber,C.amberBg]};
return(
<div>
<div style={{marginBottom:18}}>
<div style={{fontSize:19,fontWeight:700}}>CLÍNICA DR. EDWIN BARAHONA</div>
<div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date().toLocaleDateString(“es-HN”,{weekday:“long”,year:“numeric”,month:“long”,day:“numeric”})}</div>
</div>
<div style={{display:“flex”,gap:8,marginBottom:18}}>
<button style={S.btn(C.accentBg,C.accent)} onClick={()=>setTab(“pacientes”)}>Registro</button>
<button style={S.btn(C.accentBg,C.accent)} onClick={()=>setTab(“ingresos”)}>Ingresos</button>
<button style={S.btn(C.accentBg,C.accent)} onClick={()=>setTab(“farmacos”)}>Fármacos</button>
<button style={S.btn(C.green,C.bg)} onClick={()=>setTab(“registro_nuevo”)}>Nuevo 💾</button>
</div>
<div style={{...S.card,marginBottom:14}}>
<div style={S.secTitle}>Ingresos</div>
<div style={S.th(“1fr 1fr 1fr 1fr 3fr 1fr 1fr”)}>
<span>Tipo de ingreso</span><span>Valor</span><span>Fecha</span><span>Hora</span><span>Nombre paciente</span><span>Recuperada</span><span>Forma de pago</span>
</div>
{ingHoy.length===0&&<div style={{padding:“12px 13px”,color:C.muted,fontSize:12}}>Sin ingresos hoy.</div>}
{ingHoy.map((ing,i)=>{
const p=getPac(ing.pacienteId);
const [col,bg]=tipoColor[ing.tipo]||[C.muted,C.dim];
return(<div key={i} style={{…S.tr(“1fr 1fr 1fr 1fr 3fr 1fr 1fr”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={S.badge(col,bg)}>{ing.tipo}</span>
<span style={{color:C.green,fontWeight:600}}>{fmtLps(ing.valor)}</span>
<span style={{color:C.muted}}>{fmtDate(ing.fecha)}</span>
<span style={{color:C.muted}}>{ing.hora}</span>
<span>{p?.nombre||ing.nombreLibre||”—”}</span>
<span style={S.badge(ing.recuperada?C.green:C.red,ing.recuperada?C.greenBg:C.redBg)}>{ing.recuperada?“Sí”:“No”}</span>
<span style={{color:C.muted}}>{ing.formaPago||”—”}</span>
</div>);
})}
{ingHoy.length>0&&<div style={{padding:“9px 13px”,display:“flex”,justifyContent:“flex-end”,borderTop:`1px solid ${C.border}`,fontWeight:700,color:C.green,fontSize:13}}>ΣTotal: {fmtLps(totalHoy)}</div>}
</div>
<div style={{...S.card,marginBottom:14}}>
<div style={S.secTitle}>Pagos pendientes</div>
<div style={S.th(“1fr 2fr 3fr 1fr 1fr”)}>
<span>Recuperada</span><span>Fecha</span><span>Nombre paciente</span><span>Valor</span><span>Banco</span>
</div>
{ingPend.length===0&&<div style={{padding:“12px 13px”,color:C.muted,fontSize:12}}>Sin pagos pendientes. ✅</div>}
{ingPend.map((ing,i)=>{
const p=getPac(ing.pacienteId);
return(<div key={i} style={{…S.tr(“1fr 2fr 3fr 1fr 1fr”),cursor:“default”}}>
<span style={S.badge(C.red,C.redBg)}>No</span>
<span style={{color:C.muted}}>{fmtDate(ing.fecha)}</span>
<span>{p?.nombre||”—”}</span>
<span style={{color:C.amber,fontWeight:600}}>{fmtLps(ing.valor)}</span>
<span style={{color:C.muted}}>{ing.banco||”—”}</span>
</div>);
})}
{ingPend.length>0&&<div style={{padding:“9px 13px”,display:“flex”,justifyContent:“flex-end”,borderTop:`1px solid ${C.border}`,fontWeight:700,color:C.amber,fontSize:13}}>ΣPendiente: {fmtLps(ingPend.reduce((s,i)=>s+Number(i.valor),0))}</div>}
</div>
<div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:“uppercase”,letterSpacing:“0.8px”,marginBottom:8}}>CUMPLEAÑEROS DEL DÍA</div>
{cumpleHoy.length===0
?<div style={{...S.card,color:C.muted,fontSize:13}}>Sin cumpleaños hoy.</div>
:<div style={{…S.card,background:C.accentBg,border:`1px solid ${C.accent}40`}}><div style={{textAlign:“center”,fontSize:15,fontWeight:700,color:C.accent}}>🎂 Hoy cumplen años: {cumpleHoy.map(p=>p.nombre).join(” · “)}</div></div>}
</div>
);
}

// ── REGISTRO LISTA ─────────────────────────────────────────────────
function Registro({pacientes,setTab,setSelPac}){
const [search,setSearch]=useState(””);
const [filtro,setFiltro]=useState(“active”);
let filtered=pacientes.filter(p=>{const q=search.toLowerCase();return p.nombre.toLowerCase().includes(q)||p.dni?.includes(q)||p.telefono?.includes(q);});
if(filtro===“Mujeres”)filtered=filtered.filter(p=>p.sexo===“M”);
if(filtro===“Hombres”)filtered=filtered.filter(p=>p.sexo===“H”);
return(
<div>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:14}}>
<div><div style={{fontSize:18,fontWeight:700}}>Registro</div><div style={{fontSize:11,color:C.muted}}># {pacientes.length} registros</div></div>
<button style={S.btn(C.green,C.bg)} onClick={()=>setTab(“registro_nuevo”)}>+ Nuevo paciente</button>
</div>
<div style={{display:“flex”,gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
{[“active”,“all”,“Mujeres”,“Hombres”].map(f=><div key={f} style={S.tab(filtro===f)} onClick={()=>setFiltro(f)}>{f===“active”?“Activos”:f===“all”?“Todos”:f}</div>)}
<div style={{flex:1}}/>
<input style={{…S.input,width:240,marginBottom:8}} placeholder=“🔍 Nombre, DNI, teléfono…” value={search} onChange={e=>setSearch(e.target.value)}/>
</div>
<div style={S.card}>
<div style={S.th(“40px 3fr 2fr 1fr 80px”)}><span>↺</span><span>Nombre</span><span>Edad</span><span>Fecha</span><span>Sexo</span></div>
{filtered.map((p,i)=>(
<div key={i} style={{…S.tr(“40px 3fr 2fr 1fr 80px”),cursor:“pointer”}} onClick={()=>{setSelPac(p);setTab(“ficha”);}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={{color:C.muted,fontSize:11}}>{i+1}</span>
<div style={{display:“flex”,alignItems:“center”,gap:9}}><Av name={p.nombre} size={30}/><span style={{fontWeight:500}}>{p.nombre}</span></div>
<span style={{color:C.muted,fontSize:11}}>{calcEdad(p.fechaNac)}</span>
<span style={{color:C.muted,fontSize:11}}>{p.fechaReg?fmtDate(p.fechaReg.slice(0,10)):”—”}</span>
<span style={S.badge(p.sexo===“M”?C.pink:C.accent,p.sexo===“M”?C.pinkBg:C.accentBg)}>{p.sexo===“M”?“♀ M”:“♂ H”}</span>
</div>
))}
{filtered.length===0&&<div style={{padding:“14px 13px”,color:C.muted,fontSize:12}}>Sin resultados.</div>}
</div>
</div>
);
}

// ── FICHA PACIENTE ─────────────────────────────────────────────────
function FichaPaciente({paciente,setPacientes,consultas,setConsultas,ingresos,setIngresos,farmacos,cieList,setTab}){
const [subTab,setSubTab]=useState(“datos”);
const [antTab,setAntTab]=useState(“personales”);
const [editando,setEditando]=useState(false);
const [form,setForm]=useState({…paciente});
const [showC,setShowC]=useState(false);
const [cTab,setCTab]=useState(“historia”);
const [cId,setCId]=useState(null);
const emptyC={fechaHora:nowStr(),historia:””,peso:””,talla:””,temp:””,pSistolica:””,pDiastolica:””,fc:””,fr:””,dx:””,cie11:””,farmacos:””,tratamiento:””,laboratorio:””,incapacidad:””,constancia:””,hta:””,diabetes:””,tiroides:””,nefrologia:””,depresion:””,tipoIngreso:“Consulta”,valorIngreso:“300”,formaPago:“Efectivo”,banco:””,recuperada:false};
const [cForm,setCForm]=useState(emptyC);
const misC=consultas.filter(c=>c.pacienteId===paciente.id).sort((a,b)=>b.fechaHora.localeCompare(a.fechaHora));
const savePac=()=>{setPacientes(prev=>prev.map(p=>p.id===paciente.id?{…form,id:paciente.id}:p));setEditando(false);};
const openC=c=>{setCForm({…c});setCId(c.id);setCTab(“historia”);setShowC(true);};
const newC=()=>{setCForm(emptyC);setCId(null);setCTab(“historia”);setShowC(true);};
const saveC=()=>{
if(cId)setConsultas(prev=>prev.map(c=>c.id===cId?{…cForm,id:cId,pacienteId:paciente.id}:c));
else{const nv={…cForm,id:Date.now(),pacienteId:paciente.id};setConsultas(prev=>[…prev,nv]);if(cForm.valorIngreso)setIngresos(prev=>[…prev,{id:Date.now()+1,pacienteId:paciente.id,tipo:cForm.tipoIngreso,valor:Number(cForm.valorIngreso),fecha:cForm.fechaHora.slice(0,10),hora:cForm.fechaHora.slice(11,16),recuperada:cForm.recuperada,formaPago:cForm.formaPago,banco:cForm.banco}]);}
setShowC(false);
};
const imc=calcIMC(cForm.peso,cForm.talla);
const pam=calcPAM(cForm.pSistolica,cForm.pDiastolica);

const imprimir=tipo=>{
const p=paciente,c=cForm;
const headerHtml=`<div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:2px solid #003366;padding-bottom:10px;margin-bottom:14px"><div><div style="font-size:20px;font-weight:900;color:#003366">Dr. Edwin E. Barahona Figueroa</div><div style="font-size:12px;color:#006699;font-style:italic">Medicina y Cirugía</div><div style="font-size:11px;color:#555;margin-top:2px">Cel.: +504 3215-5003 · dredwinbarahona@gmail.com</div><div style="font-size:11px;color:#555">Centro Comercial Novacentro, primer nivel · Horario: 1:00pm–7:00pm</div></div></div>`;
const pacHtml=`<div style="background:#f0f7ff;border-radius:6px;padding:9px 13px;margin-bottom:12px;font-size:12px"><strong>${p.nombre}</strong> · ${calcEdad(p.fechaNac)} · DNI: ${p.dni||"—"} · ${c.fechaHora}</div>`;
let html=””;
if(tipo===“expediente”){html=`<html><head><style>body{font-family:Arial,sans-serif;max-width:720px;margin:28px auto;font-size:12px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 8px}th{background:#f5f5f5;font-size:10px}.sec{font-weight:700;text-align:center;background:#e8eef8;padding:6px;border:1px solid #ccc;margin:8px 0 0}</style></head><body><div style="display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:10px"><div><strong>DR. EDWIN EDGARDO BARAHONA FIGUEROA</strong><br>No. Colegiación: 11869</div><div>Historias clínicas ${misC.length}</div></div><div style="text-align:center;font-weight:700;font-size:14px;margin-bottom:10px">Historia clínica</div><table><tr><td><strong>Nombre paciente:</strong> ${p.nombre}</td><td><strong>Fecha y hora:</strong> ${c.fechaHora}</td></tr><tr><td colspan="2"><strong>Edad:</strong> ${calcEdad(p.fechaNac)}</td></tr></table><div class="sec">HISTORIA DE LA ENFERMEDAD ACTUAL</div><div style="border:1px solid #ccc;padding:8px;min-height:60px">${c.historia}</div><table style="margin-top:8px"><tr><th>Tª</th><th>Presión Sistólica</th><th>Presión Diastólica</th><th>FC/min</th><th>FR/min</th></tr><tr><td>${c.temp}</td><td>${c.pSistolica}</td><td>${c.pDiastolica}</td><td>${c.fc}</td><td>${c.fr}</td></tr></table><div class="sec">DIAGNÓSTICO</div><table><tr><th>Código</th><th>Enfermedad</th></tr><tr><td>${c.cie11}</td><td>${c.dx}</td></tr></table><div style="border:1px solid #ccc;padding:6px"><strong>Diagnóstico:</strong> ${c.dx}</div><div class="sec">TRATAMIENTO</div><table><tr><th>Nombre</th><th>Dosis</th></tr><tr><td colspan="2">${c.farmacos}</td></tr></table><div style="border:1px solid #ccc;padding:6px"><strong>Tratamiento:</strong> ${c.tratamiento}</div><div style="border:1px solid #ccc;padding:6px;margin-top:6px"><strong>Incapacidad Médica:</strong> ${c.incapacidad}</div></body></html>`;}
else if(tipo===“constancia”){html=`<html><head><style>body{font-family:Arial,sans-serif;max-width:720px;margin:28px auto;font-size:12px}.firma{margin-top:70px}.firma-line{border-top:1px solid #000;width:200px;margin-bottom:4px}</style></head><body>${headerHtml}${pacHtml}<div style="text-align:center;font-weight:700;font-size:14px;border:1px solid #ccc;padding:7px;margin-bottom:14px">CONSTANCIA MÉDICA</div><div style="border:1px solid #ccc;min-height:200px;padding:12px;white-space:pre-wrap">${c.constancia}</div><div class="firma"><div class="firma-line"></div><strong>Dr. Edwin E. Barahona Figueroa</strong><br><span style="font-size:11px;color:#555">Médico tratante · Colegiación: 11869 · FIRMA Y SELLO</span></div></body></html>`;}
else if(tipo===“receta”){html=`<html><head><style>body{font-family:Arial,sans-serif;max-width:500px;margin:20px auto;font-size:12px}.firma{margin-top:60px;text-align:center}.fl{border-top:1px solid #000;width:180px;margin:0 auto 4px}</style></head><body><div style="display:flex;align-items:center;gap:12px;border-bottom:2px solid #003366;padding-bottom:10px;margin-bottom:12px"><div><div style="font-size:20px;font-weight:900;color:#003366">Dr. Edwin BARAHONA</div><div style="font-size:11px;color:#006699">— MEDICINA Y CIRUGÍA —</div><div style="font-size:10px;color:#555">Cel.: +504 3215-5003 · dredwinbarahona@gmail.com</div></div></div><div style="background:#f0f7ff;padding:8px;border-radius:4px;margin-bottom:12px"><strong>${p.nombre}</strong><br>${calcEdad(p.fechaNac)} · ${c.fechaHora}</div><div style="font-weight:700;margin-bottom:8px">Rx:</div><div style="white-space:pre-wrap;min-height:100px;border:1px solid #eee;padding:8px">${c.farmacos}</div>${c.tratamiento?`<div style="margin-top:8px"><strong>Indicaciones:</strong> ${c.tratamiento}</div>`:""}<div class="firma"><div class="fl"></div>Dr. Edwin E. Barahona Figueroa<br><span style="font-size:10px">Colegiación: 11869</span></div><div style="margin-top:16px;border-top:1px solid #eee;padding-top:6px;font-size:10px;color:#aaa;text-align:center">UNAH · Universidad Nacional Autónoma de Honduras</div></body></html>`;}
else if(tipo===“examenes”){html=`<html><head><style>body{font-family:Arial,sans-serif;max-width:720px;margin:28px auto;font-size:12px}</style></head><body>${headerHtml}${pacHtml}<div style="text-align:center;font-weight:700;font-size:14px;border:1px solid #ccc;padding:7px;margin-bottom:12px">ORDEN DE EXÁMENES</div><div style="border:1px solid #ccc;min-height:200px;padding:12px;white-space:pre-wrap">${c.laboratorio}</div><div style="margin-top:60px;text-align:center"><div style="border-top:1px solid #000;width:200px;margin:0 auto 4px"></div>Dr. Edwin E. Barahona Figueroa · Col. 11869</div></body></html>`;}
const w=window.open(””,”_blank”);w.document.write(html);w.document.close();w.print();
};

return(
<div>
{showC&&(
<Modal title={cId?“Editar consulta”:“Nueva consulta”} onClose={()=>setShowC(false)} wide>
<div style={{display:“flex”,gap:8,marginBottom:12,flexWrap:“wrap”}}>
{[“expediente”,“constancia”,“receta”,“examenes”].map(d=><button key={d} style={S.btnSm(C.accentBg,C.accent)} onClick={()=>imprimir(d)}>🖨️ {d.charAt(0).toUpperCase()+d.slice(1)}</button>)}
</div>
<div style={{…S.badge(C.accent,C.accentBg),display:“block”,textAlign:“center”,padding:“7px”,marginBottom:12,fontSize:13,fontWeight:600}}>{paciente.nombre} · {calcEdad(paciente.fechaNac)} · {cForm.fechaHora}</div>
<div style={{display:“flex”,gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:14,overflowX:“auto”}}>
{[“historia”,“hta”,“diabetes”,“tiroides”,“nefrologia”,“depresion”,“pago”].map(t=><div key={t} style={S.tab(cTab===t)} onClick={()=>setCTab(t)}>{t===“historia”?“Historia clínica”:t===“pago”?“Pago”:t.charAt(0).toUpperCase()+t.slice(1)}</div>)}
</div>
{cTab===“historia”&&(
<div>
<F label="Fecha y hora"><input style={S.input} value={cForm.fechaHora} onChange={e=>setCForm(p=>({…p,fechaHora:e.target.value}))}/></F>
<F label="📋 HISTORIA — Enfermedad actual"><textarea style={{…S.input,minHeight:80,resize:“vertical”}} value={cForm.historia} onChange={e=>setCForm(p=>({…p,historia:e.target.value}))}/></F>
<div style={{display:“grid”,gridTemplateColumns:“repeat(5,1fr)”,gap:8,marginBottom:8}}>
{[[“peso”,“Peso Kg”],[“talla”,“Talla mts”],[“temp”,“Tª”],[“pSistolica”,“P. Sistólica”],[“pDiastolica”,“P. Diastólica”],[“fc”,“FC/min”],[“fr”,“FR/min”]].map(([k,l])=>(
<F key={k} label={l}><input style={S.input} placeholder=“0” value={cForm[k]} onChange={e=>setCForm(p=>({…p,[k]:e.target.value}))}/></F>
))}
<F label="IMC"><input style={{...S.input,color:C.accent}} readOnly value={imc}/></F>
<F label="Clasif. nutricional"><input style={{...S.input,color:C.amber}} readOnly value={clasNut(imc)}/></F>
<F label="PAM"><input style={{...S.input,color:C.green}} readOnly value={pam}/></F>
</div>
<div style={S.g2}>
<F label="🩺 DIAGNÓSTICO (Dx)"><textarea style={{…S.input,minHeight:55,resize:“vertical”}} value={cForm.dx} onChange={e=>setCForm(p=>({…p,dx:e.target.value}))}/></F>
<F label="CIE-11"><input style={S.input} placeholder=“Código…” value={cForm.cie11} onChange={e=>setCForm(p=>({…p,cie11:e.target.value}))}/></F>
</div>
<F label="💊 FÁRMACOS"><textarea style={{…S.input,minHeight:65,resize:“vertical”}} placeholder=“Nombre · dosis · frecuencia…” value={cForm.farmacos} onChange={e=>setCForm(p=>({…p,farmacos:e.target.value}))}/></F>
<F label="Indicaciones / Tratamiento"><textarea style={{…S.input,minHeight:45,resize:“vertical”}} value={cForm.tratamiento} onChange={e=>setCForm(p=>({…p,tratamiento:e.target.value}))}/></F>
<div style={S.g2}>
<F label="🔬 LABORATORIO"><textarea style={{…S.input,minHeight:55,resize:“vertical”}} value={cForm.laboratorio} onChange={e=>setCForm(p=>({…p,laboratorio:e.target.value}))}/></F>
<F label="Incapacidad Médica"><textarea style={{…S.input,minHeight:55,resize:“vertical”}} value={cForm.incapacidad} onChange={e=>setCForm(p=>({…p,incapacidad:e.target.value}))}/></F>
</div>
<F label="Constancia Médica"><textarea style={{…S.input,minHeight:55,resize:“vertical”}} value={cForm.constancia} onChange={e=>setCForm(p=>({…p,constancia:e.target.value}))}/></F>
</div>
)}
{[“hta”,“diabetes”,“tiroides”,“nefrologia”,“depresion”].includes(cTab)&&(
<F label={`Notas — ${cTab.toUpperCase()}`}><textarea style={{…S.input,minHeight:180,resize:“vertical”}} placeholder={`Notas específicas de ${cTab}...`} value={cForm[cTab]||””} onChange={e=>setCForm(p=>({…p,[cTab]:e.target.value}))}/></F>
)}
{cTab===“pago”&&(
<div>
<div style={S.g2}>
<F label="Tipo de ingreso"><select style={S.input} value={cForm.tipoIngreso} onChange={e=>setCForm(p=>({…p,tipoIngreso:e.target.value}))}>{[“Consulta”,“Aplicación”,“Procedimiento”,“Laboratorio”].map(t=><option key={t}>{t}</option>)}</select></F>
<F label="Valor (Lps.)"><input style={S.input} type=“number” value={cForm.valorIngreso} onChange={e=>setCForm(p=>({…p,valorIngreso:e.target.value}))}/></F>
<F label="Forma de pago"><select style={S.input} value={cForm.formaPago} onChange={e=>setCForm(p=>({…p,formaPago:e.target.value}))}>{[“Efectivo”,“Transferencia”,“Tarjeta”,“Cheque”,“Seguro”].map(t=><option key={t}>{t}</option>)}</select></F>
<F label="Banco"><input style={S.input} value={cForm.banco} onChange={e=>setCForm(p=>({…p,banco:e.target.value}))}/></F>
</div>
<F label="Recuperada"><label style={{display:“flex”,alignItems:“center”,gap:8,cursor:“pointer”}}><input type=“checkbox” checked={cForm.recuperada} onChange={e=>setCForm(p=>({…p,recuperada:e.target.checked}))}/><span style={{fontSize:13,color:cForm.recuperada?C.green:C.muted}}>{cForm.recuperada?“✅ Sí”:“❌ No”}</span></label></F>
</div>
)}
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”,marginTop:14}}>
<button style={S.ghost} onClick={()=>setShowC(false)}>Cancelar</button>
<button style={S.btn(C.green,C.bg)} onClick={saveC}>💾 Guardar consulta</button>
</div>
</Modal>
)}

```
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
    <button style={S.ghost} onClick={()=>setTab("pacientes")}>← Volver</button>
    <Av name={paciente.nombre} size={38}/>
    <div><div style={{fontSize:15,fontWeight:700}}>{paciente.nombre}</div><div style={{fontSize:11,color:C.muted}}>{calcEdad(paciente.fechaNac)} · DNI: {paciente.dni}</div></div>
  </div>

  <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:16}}>
    {[["datos","Datos Generales"],["antecedentes","Antecedentes"],["consultas","Consultas"]].map(([t,l])=><div key={t} style={S.tab(subTab===t)} onClick={()=>setSubTab(t)}>{l}</div>)}
  </div>

  {subTab==="datos"&&(
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:C.accent}}>🛏 DATOS GENERALES</div>
        <div style={{display:"flex",gap:8}}>{editando?<><button style={S.btn(C.green,C.bg)} onClick={savePac}>💾 Guardar</button><button style={S.ghost} onClick={()=>setEditando(false)}>Cancelar</button></>:<button style={S.btn()} onClick={()=>setEditando(true)}>Editar</button>}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 1fr 1fr 80px",gap:10,marginBottom:8}}>
        <F label="Nombre Del paciente"><input style={S.input} readOnly={!editando} value={editando?form.nombre:paciente.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value.toUpperCase()}))}/></F>
        <F label="Id"><input style={S.input} readOnly={!editando} value={editando?form.dni:paciente.dni} onChange={e=>setForm(p=>({...p,dni:e.target.value}))}/></F>
        <F label="Fecha Nac."><input style={S.input} type={editando?"date":"text"} readOnly={!editando} value={editando?form.fechaNac:fmtDate(paciente.fechaNac)} onChange={e=>setForm(p=>({...p,fechaNac:e.target.value}))}/></F>
        <F label="Edad"><input style={{...S.input,color:C.green}} readOnly value={calcEdad(paciente.fechaNac)}/></F>
        <F label="Sexo">{editando?<select style={S.input} value={form.sexo} onChange={e=>setForm(p=>({...p,sexo:e.target.value}))}><option value="M">M</option><option value="H">H</option></select>:<span style={S.badge(paciente.sexo==="M"?C.pink:C.accent,paciente.sexo==="M"?C.pinkBg:C.accentBg)}>{paciente.sexo==="M"?"♀ M":"♂ H"}</span>}</F>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:8}}>
        <F label="Estado civil">{editando?<select style={S.input} value={form.estadoCivil} onChange={e=>setForm(p=>({...p,estadoCivil:e.target.value}))}>{["Soltero(a)","Casado(a)","Divorciado(a)","Viudo(a)","Unión libre"].map(o=><option key={o}>{o}</option>)}</select>:<input style={S.input} readOnly value={paciente.estadoCivil}/>}</F>
        <F label="Teléfono"><input style={S.input} readOnly={!editando} value={editando?form.telefono:paciente.telefono} onChange={e=>setForm(p=>({...p,telefono:e.target.value}))}/></F>
        <F label="Ocupación"><input style={S.input} readOnly={!editando} value={editando?form.ocupacion:paciente.ocupacion} onChange={e=>setForm(p=>({...p,ocupacion:e.target.value}))}/></F>
        <F label="Fecha y hora de Registro"><input style={S.input} readOnly value={paciente.fechaReg}/></F>
      </div>
      <F label="Lugar de Residencia"><input style={S.input} readOnly={!editando} value={editando?form.residencia:paciente.residencia} onChange={e=>setForm(p=>({...p,residencia:e.target.value}))}/></F>
      <div style={S.g2}>
        <F label="Nivel de educación">{editando?<select style={S.input} value={form.nivelEdu} onChange={e=>setForm(p=>({...p,nivelEdu:e.target.value}))}>{["Ninguno","Primaria","Secundaria","Universitaria Incompleta","Universitaria Completa","Postgrado"].map(o=><option key={o}>{o}</option>)}</select>:<input style={S.input} readOnly value={paciente.nivelEdu}/>}</F>
        <F label="Email"><input style={S.input} readOnly={!editando} value={editando?form.email:paciente.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></F>
      </div>
    </div>
  )}

  {subTab==="antecedentes"&&(
    <div style={S.card}>
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
        {[["personales","Antecedentes Personales"],["familiares","Antecedentes Familiares"],["quirurgicos","Antecedentes Quirúrgicos"]].map(([t,l])=><div key={t} style={S.tab(antTab===t)} onClick={()=>setAntTab(t)}>{l}</div>)}
      </div>
      {["personales","familiares","quirurgicos"].map(t=>antTab===t&&(
        <div key={t}>
          {t==="personales"&&<div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:8}}>ANTECEDENTES PERSONALES PATOLÓGICOS</div>}
          <textarea style={{...S.input,minHeight:120,resize:"vertical"}} placeholder={`Antecedentes ${t}...`} readOnly={!editando} value={editando?form[`ant${t.charAt(0).toUpperCase()+t.slice(1)}`]:paciente[`ant${t.charAt(0).toUpperCase()+t.slice(1)}`]} onChange={e=>setForm(p=>({...p,[`ant${t.charAt(0).toUpperCase()+t.slice(1)}`]:e.target.value}))}/>
          <div style={{display:"flex",gap:8,marginTop:10}}>{editando?<><button style={S.btn(C.green,C.bg)} onClick={savePac}>💾 Guardar</button><button style={S.ghost} onClick={()=>setEditando(false)}>Cancelar</button></>:<button style={S.btn()} onClick={()=>setEditando(true)}>Editar</button>}</div>
        </div>
      ))}
    </div>
  )}

  {subTab==="consultas"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:C.accent}}>Historias clínicas — {misC.length}</div>
        <button style={S.btn(C.green,C.bg)} onClick={newC}>+ Nueva consulta</button>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {misC.map((c,i)=><button key={i} style={{...S.btnSm(C.accentBg,C.accent),borderRadius:6,padding:"6px 12px",fontSize:11}} onClick={()=>openC(c)}>{c.fechaHora}</button>)}
      </div>
      {misC.length===0&&<div style={{color:C.muted,fontSize:12,marginTop:10}}>Sin consultas registradas. Usa "+ Nueva consulta".</div>}
    </div>
  )}
</div>
```

);
}

// ── NUEVO PACIENTE ─────────────────────────────────────────────────
function NuevoPaciente({setPacientes,setTab}){
const [form,setForm]=useState({nombre:””,dni:””,fechaNac:””,sexo:“M”,estadoCivil:“Soltero(a)”,telefono:””,ocupacion:””,residencia:””,nivelEdu:“Universitaria Incompleta”,email:””,antPersonales:””,antFamiliares:””,antQuirurgicos:””});
const save=()=>{if(!form.nombre.trim())return alert(“El nombre es requerido.”);setPacientes(prev=>[…prev,{…form,id:Date.now(),fechaReg:nowStr()}]);setTab(“pacientes”);};
return(
<div>
<div style={{display:“flex”,alignItems:“center”,gap:10,marginBottom:16}}><button style={S.ghost} onClick={()=>setTab(“pacientes”)}>← Volver</button><div style={{fontSize:16,fontWeight:700}}>Nuevo Paciente</div></div>
<div style={S.card}>
<div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:12}}>🛏 DATOS GENERALES</div>
<div style={{display:“grid”,gridTemplateColumns:“3fr 1fr 1fr 80px”,gap:10}}>
<F label="Nombre completo *"><input style={S.input} value={form.nombre} onChange={e=>setForm(p=>({…p,nombre:e.target.value.toUpperCase()}))}/></F>
<F label="DNI / Identidad"><input style={S.input} placeholder=“0801200000000” value={form.dni} onChange={e=>setForm(p=>({…p,dni:e.target.value}))}/></F>
<F label="Fecha de nacimiento"><input style={S.input} type=“date” value={form.fechaNac} onChange={e=>setForm(p=>({…p,fechaNac:e.target.value}))}/></F>
<F label="Sexo"><select style={S.input} value={form.sexo} onChange={e=>setForm(p=>({…p,sexo:e.target.value}))}><option value="M">Mujer (M)</option><option value="H">Hombre (H)</option></select></F>
</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:10}}>
<F label="Estado civil"><select style={S.input} value={form.estadoCivil} onChange={e=>setForm(p=>({…p,estadoCivil:e.target.value}))}>{[“Soltero(a)”,“Casado(a)”,“Divorciado(a)”,“Viudo(a)”,“Unión libre”].map(o=><option key={o}>{o}</option>)}</select></F>
<F label="Teléfono"><input style={S.input} placeholder=”+504…” value={form.telefono} onChange={e=>setForm(p=>({…p,telefono:e.target.value}))}/></F>
<F label="Ocupación"><input style={S.input} value={form.ocupacion} onChange={e=>setForm(p=>({…p,ocupacion:e.target.value}))}/></F>
</div>
<F label="Lugar de Residencia"><input style={S.input} value={form.residencia} onChange={e=>setForm(p=>({…p,residencia:e.target.value}))}/></F>
<div style={S.g2}>
<F label="Nivel de educación"><select style={S.input} value={form.nivelEdu} onChange={e=>setForm(p=>({…p,nivelEdu:e.target.value}))}>{[“Ninguno”,“Primaria”,“Secundaria”,“Universitaria Incompleta”,“Universitaria Completa”,“Postgrado”].map(o=><option key={o}>{o}</option>)}</select></F>
<F label="Email"><input style={S.input} type=“email” value={form.email} onChange={e=>setForm(p=>({…p,email:e.target.value}))}/></F>
</div>
<div style={S.divider}/>
<div style={{fontSize:12,fontWeight:700,color:C.amber,marginBottom:10}}>ANTECEDENTES</div>
<div style={S.g3}>
<F label="Personales"><textarea style={{…S.input,minHeight:65,resize:“vertical”}} value={form.antPersonales} onChange={e=>setForm(p=>({…p,antPersonales:e.target.value}))}/></F>
<F label="Familiares"><textarea style={{…S.input,minHeight:65,resize:“vertical”}} value={form.antFamiliares} onChange={e=>setForm(p=>({…p,antFamiliares:e.target.value}))}/></F>
<F label="Quirúrgicos"><textarea style={{…S.input,minHeight:65,resize:“vertical”}} value={form.antQuirurgicos} onChange={e=>setForm(p=>({…p,antQuirurgicos:e.target.value}))}/></F>
</div>
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”,marginTop:12}}>
<button style={S.ghost} onClick={()=>setTab(“pacientes”)}>Cancelar</button>
<button style={S.btn(C.green,C.bg)} onClick={save}>💾 Guardar paciente</button>
</div>
</div>
</div>
);
}

// ── INGRESOS ───────────────────────────────────────────────────────
function Ingresos({ingresos,setIngresos,pacientes}){
const [showForm,setShowForm]=useState(false);
const [mes,setMes]=useState(todayStr().slice(0,7));
const [form,setForm]=useState({pacienteId:””,nombreLibre:””,tipo:“Consulta”,valor:””,fecha:todayStr(),hora:new Date().toTimeString().slice(0,5),recuperada:false,formaPago:“Efectivo”,banco:””});
const del=id=>{if(confirm(”¿Eliminar ingreso?”))setIngresos(prev=>prev.filter(i=>i.id!==id));};
const toggle=id=>setIngresos(prev=>prev.map(i=>i.id===id?{…i,recuperada:!i.recuperada}:i));
const save=()=>{if(!form.valor)return;setIngresos(prev=>[…prev,{…form,id:Date.now(),pacienteId:form.pacienteId?Number(form.pacienteId):null,valor:Number(form.valor)}]);setShowForm(false);};
const filt=ingresos.filter(i=>i.fecha?.startsWith(mes)).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora));
const totalRec=filt.filter(i=>i.recuperada).reduce((s,i)=>s+Number(i.valor),0);
const tipoColor={“Consulta”:[C.red,C.redBg],“Aplicación”:[C.accent,C.accentBg],“Procedimiento”:[C.purple,C.purpleBg],“Laboratorio”:[C.amber,C.amberBg]};
return(
<div>
{showForm&&(
<Modal title=“Registrar ingreso” onClose={()=>setShowForm(false)}>
<F label="Paciente (opcional)"><select style={S.input} value={form.pacienteId} onChange={e=>setForm(p=>({…p,pacienteId:e.target.value}))}><option value="">— Sin vincular —</option>{pacientes.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select></F>
{!form.pacienteId&&<F label="Nombre libre"><input style={S.input} value={form.nombreLibre} onChange={e=>setForm(p=>({…p,nombreLibre:e.target.value}))}/></F>}
<div style={S.g2}>
<F label="Tipo"><select style={S.input} value={form.tipo} onChange={e=>setForm(p=>({…p,tipo:e.target.value}))}>{[“Consulta”,“Aplicación”,“Procedimiento”,“Laboratorio”].map(t=><option key={t}>{t}</option>)}</select></F>
<F label="Valor (Lps.)"><input style={S.input} type=“number” value={form.valor} onChange={e=>setForm(p=>({…p,valor:e.target.value}))}/></F>
<F label="Fecha"><input style={S.input} type=“date” value={form.fecha} onChange={e=>setForm(p=>({…p,fecha:e.target.value}))}/></F>
<F label="Hora"><input style={S.input} type=“time” value={form.hora} onChange={e=>setForm(p=>({…p,hora:e.target.value}))}/></F>
<F label="Forma de pago"><select style={S.input} value={form.formaPago} onChange={e=>setForm(p=>({…p,formaPago:e.target.value}))}>{[“Efectivo”,“Transferencia”,“Tarjeta”,“Cheque”,“Seguro”].map(t=><option key={t}>{t}</option>)}</select></F>
<F label="Banco"><input style={S.input} value={form.banco} onChange={e=>setForm(p=>({…p,banco:e.target.value}))}/></F>
</div>
<F label="Recuperada"><label style={{display:“flex”,alignItems:“center”,gap:8,cursor:“pointer”}}><input type=“checkbox” checked={form.recuperada} onChange={e=>setForm(p=>({…p,recuperada:e.target.checked}))}/><span style={{fontSize:13,color:form.recuperada?C.green:C.muted}}>{form.recuperada?“✅ Sí”:“❌ No”}</span></label></F>
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”}}><button style={S.ghost} onClick={()=>setShowForm(false)}>Cancelar</button><button style={S.btn(C.green,C.bg)} onClick={save}>💾 Guardar</button></div>
</Modal>
)}
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:14}}>
<div><div style={{fontSize:18,fontWeight:700}}>Ingresos</div><div style={{fontSize:11,color:C.muted}}>Total recuperado: <strong style={{color:C.green}}>{fmtLps(totalRec)}</strong></div></div>
<div style={{display:“flex”,gap:8,alignItems:“center”}}><input type=“month” style={{…S.input,width:“auto”}} value={mes} onChange={e=>setMes(e.target.value)}/><button style={S.btn(C.green,C.bg)} onClick={()=>setShowForm(true)}>+ Registrar</button></div>
</div>
<div style={{...S.g3,marginBottom:14}}>
{[[“Recuperado”,fmtLps(totalRec),C.green],[“Pendiente”,fmtLps(filt.filter(i=>!i.recuperada).reduce((s,i)=>s+Number(i.valor),0)),C.amber],[“Transacciones”,filt.length,C.accent]].map(([l,v,c],i)=>(
<div key={i} style={S.statCard(c)}><div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:10,color:C.muted,marginTop:3,textTransform:“uppercase”}}>{l}</div></div>
))}
</div>
<div style={S.card}>
<div style={S.th(“1fr 1fr 1fr 1fr 3fr 1fr 1fr 50px”)}><span>Tipo</span><span>Valor</span><span>Fecha</span><span>Hora</span><span>Paciente</span><span>Recuperada</span><span>Pago</span><span></span></div>
{filt.map((ing,i)=>{const p=pacientes.find(x=>x.id===ing.pacienteId);const [col,bg]=tipoColor[ing.tipo]||[C.muted,C.dim];return(
<div key={i} style={{…S.tr(“1fr 1fr 1fr 1fr 3fr 1fr 1fr 50px”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={S.badge(col,bg)}>{ing.tipo}</span>
<span style={{color:C.green,fontWeight:600}}>{fmtLps(ing.valor)}</span>
<span style={{color:C.muted,fontSize:11}}>{fmtDate(ing.fecha)}</span>
<span style={{color:C.muted,fontSize:11}}>{ing.hora}</span>
<span style={{fontSize:11}}>{p?.nombre||ing.nombreLibre||”—”}</span>
<button style={S.btnSm(ing.recuperada?C.greenBg:C.redBg,ing.recuperada?C.green:C.red)} onClick={()=>toggle(ing.id)}>{ing.recuperada?“✅ Sí”:“❌ No”}</button>
<span style={{color:C.muted,fontSize:11}}>{ing.formaPago}</span>
<button style={S.danger} onClick={()=>del(ing.id)}>✕</button>
</div>
);})}
{filt.length===0&&<div style={{padding:“14px 13px”,color:C.muted,fontSize:12}}>Sin ingresos para este período.</div>}
</div>
</div>
);
}

// ── AGENDAR CITA ───────────────────────────────────────────────────
function AgendarCita({citas,setCitas,pacientes}){
const [showForm,setShowForm]=useState(false);
const [form,setForm]=useState({pacienteId:””,fechaHora:””,motivo:””,recordatorio:false,guardado:false});
const hoy=todayStr();
const proximas=citas.filter(c=>c.fechaHora>=hoy).sort((a,b)=>a.fechaHora.localeCompare(b.fechaHora));
const save=()=>{if(!form.pacienteId||!form.fechaHora)return;if(form.id)setCitas(prev=>prev.map(c=>c.id===form.id?{…form,pacienteId:Number(form.pacienteId)}:c));else setCitas(prev=>[…prev,{…form,id:Date.now(),pacienteId:Number(form.pacienteId)}]);setShowForm(false);};
const del=id=>setCitas(prev=>prev.filter(c=>c.id!==id));
return(
<div>
{showForm&&(
<Modal title={form.id?“Editar cita”:“Nueva cita”} onClose={()=>setShowForm(false)}>
<F label="Paciente *"><select style={S.input} value={form.pacienteId} onChange={e=>setForm(p=>({…p,pacienteId:e.target.value}))}><option value="">Seleccionar…</option>{pacientes.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select></F>
<div style={S.g2}>
<F label="Fecha y hora *"><input style={S.input} type=“datetime-local” value={form.fechaHora?.replace(” “,“T”)} onChange={e=>setForm(p=>({…p,fechaHora:e.target.value.replace(“T”,” “)}))}/></F>
<F label="Motivo"><input style={S.input} value={form.motivo} onChange={e=>setForm(p=>({…p,motivo:e.target.value}))}/></F>
</div>
<div style={{display:“flex”,gap:20,marginBottom:12}}>
<label style={{display:“flex”,alignItems:“center”,gap:6,cursor:“pointer”,fontSize:12}}><input type=“checkbox” checked={form.guardado} onChange={e=>setForm(p=>({…p,guardado:e.target.checked}))}/> GUARD.</label>
<label style={{display:“flex”,alignItems:“center”,gap:6,cursor:“pointer”,fontSize:12}}><input type=“checkbox” checked={form.recordatorio} onChange={e=>setForm(p=>({…p,recordatorio:e.target.checked}))}/> RecordatorioCreado</label>
</div>
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”}}><button style={S.ghost} onClick={()=>setShowForm(false)}>Cancelar</button><button style={S.btn(C.green,C.bg)} onClick={save}>Crear cita</button></div>
</Modal>
)}
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:14}}>
<div style={{fontSize:18,fontWeight:700}}>Agendar Cita</div>
<button style={S.btn(C.green,C.bg)} onClick={()=>{setForm({pacienteId:””,fechaHora:””,motivo:””,recordatorio:false,guardado:false});setShowForm(true);}}>+ Nueva cita</button>
</div>
<div style={S.card}>
<div style={S.th(“3fr 1fr 1fr 1fr 1fr 80px”)}><span>Paciente</span><span>Fecha y hora</span><span>Motivo</span><span>GUARD.</span><span>Recordatorio</span><span></span></div>
{proximas.map((c,i)=>{const p=pacientes.find(x=>x.id===c.pacienteId);return(
<div key={i} style={{…S.tr(“3fr 1fr 1fr 1fr 1fr 80px”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<div style={{display:“flex”,alignItems:“center”,gap:8}}><Av name={p?.nombre} size={28}/><span style={{fontWeight:500}}>{p?.nombre||”—”}</span></div>
<span style={{color:C.accent,fontSize:11}}>{c.fechaHora}</span>
<span style={{color:C.muted,fontSize:11}}>{c.motivo||”—”}</span>
<span style={S.badge(c.guardado?C.green:C.muted,c.guardado?C.greenBg:C.dim)}>{c.guardado?“✅”:”—”}</span>
<span style={S.badge(c.recordatorio?C.accent:C.muted,c.recordatorio?C.accentBg:C.dim)}>{c.recordatorio?“✅”:”—”}</span>
<div style={{display:“flex”,gap:4}}><button style={S.btnSm(C.accentBg,C.accent)} onClick={()=>{setForm({…c});setShowForm(true);}}>✏️</button><button style={S.danger} onClick={()=>del(c.id)}>✕</button></div>
</div>
);})}
{proximas.length===0&&<div style={{padding:“14px 13px”,color:C.muted,fontSize:12}}>Sin citas próximas.</div>}
</div>
</div>
);
}

// ── FARMACOS ───────────────────────────────────────────────────────
function Farmacos({farmacos,setFarmacos}){
const [search,setSearch]=useState(””);
const [form,setForm]=useState({nombre:””,presentacion:””,dosis:””});
const [editId,setEditId]=useState(null);
const filtered=farmacos.filter(f=>f.nombre.toLowerCase().includes(search.toLowerCase()));
const save=()=>{if(!form.nombre.trim())return;if(editId){setFarmacos(prev=>prev.map(f=>f.id===editId?{…form,id:editId}:f));setEditId(null);}else setFarmacos(prev=>[…prev,{…form,id:Date.now()}]);setForm({nombre:””,presentacion:””,dosis:””});};
return(
<div>
<div style={{fontSize:18,fontWeight:700,marginBottom:4}}>Fármacos</div>
<div style={{fontSize:11,color:C.muted,marginBottom:14}}>Base de datos de medicamentos vinculada a consultas</div>
<div style={{...S.card,marginBottom:14}}>
<div style={{display:“grid”,gridTemplateColumns:“2fr 1fr 2fr auto”,gap:10,alignItems:“end”}}>
<F label="Nombre"><input style={S.input} value={form.nombre} onChange={e=>setForm(p=>({…p,nombre:e.target.value}))}/></F>
<F label="Presentación"><input style={S.input} placeholder=“500mg…” value={form.presentacion} onChange={e=>setForm(p=>({…p,presentacion:e.target.value}))}/></F>
<F label="Dosis habitual"><input style={S.input} placeholder=“1 tab c/8h…” value={form.dosis} onChange={e=>setForm(p=>({…p,dosis:e.target.value}))}/></F>
<button style={{...S.btn(C.green,C.bg),marginBottom:10}} onClick={save}>{editId?“Actualizar”:”+ Agregar”}</button>
</div>
</div>
<input style={{…S.input,marginBottom:10}} placeholder=“🔍 Buscar fármaco…” value={search} onChange={e=>setSearch(e.target.value)}/>
<div style={S.card}>
<div style={S.th(“2fr 1fr 2fr 80px”)}><span>Nombre</span><span>Presentación</span><span>Dosis habitual</span><span></span></div>
{filtered.map((f,i)=>(
<div key={i} style={{…S.tr(“2fr 1fr 2fr 80px”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={{fontWeight:500}}>{f.nombre}</span><span style={{color:C.accent}}>{f.presentacion}</span><span style={{color:C.muted}}>{f.dosis}</span>
<div style={{display:“flex”,gap:4}}><button style={S.btnSm(C.accentBg,C.accent)} onClick={()=>{setForm({nombre:f.nombre,presentacion:f.presentacion,dosis:f.dosis});setEditId(f.id);}}>✏️</button><button style={S.danger} onClick={()=>setFarmacos(prev=>prev.filter(x=>x.id!==f.id))}>✕</button></div>
</div>
))}
{filtered.length===0&&<div style={{padding:“12px 13px”,color:C.muted,fontSize:12}}>Sin resultados.</div>}
</div>
</div>
);
}

// ── PATOLOGIAS ─────────────────────────────────────────────────────
function Patologias({patologias,setPatologias}){
const [form,setForm]=useState({nombre:””,descripcion:””});
return(
<div>
<div style={{fontSize:18,fontWeight:700,marginBottom:14}}>Patologías</div>
<div style={{...S.card,marginBottom:14}}>
<div style={{display:“grid”,gridTemplateColumns:“1fr 2fr auto”,gap:10,alignItems:“end”}}>
<F label="Nombre"><input style={S.input} value={form.nombre} onChange={e=>setForm(p=>({…p,nombre:e.target.value}))}/></F>
<F label="Descripción"><input style={S.input} value={form.descripcion} onChange={e=>setForm(p=>({…p,descripcion:e.target.value}))}/></F>
<button style={{…S.btn(C.green,C.bg),marginBottom:10}} onClick={()=>{if(!form.nombre.trim())return;setPatologias(prev=>[…prev,{…form,id:Date.now()}]);setForm({nombre:””,descripcion:””});}}>+ Agregar</button>
</div>
</div>
<div style={S.card}>
{patologias.map((p,i)=>(
<div key={i} style={{…S.tr(“1fr 3fr 50px”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={S.badge(C.accent,C.accentBg)}>{p.nombre}</span><span style={{color:C.muted}}>{p.descripcion}</span>
<button style={S.danger} onClick={()=>setPatologias(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
</div>
))}
</div>
</div>
);
}

// ── CIE-11 ─────────────────────────────────────────────────────────
function CIE({cieList,setCieList}){
const [search,setSearch]=useState(””);
const [form,setForm]=useState({codigo:””,descripcion:””});
const filtered=cieList.filter(c=>c.codigo.toLowerCase().includes(search.toLowerCase())||c.descripcion.toLowerCase().includes(search.toLowerCase()));
return(
<div>
<div style={{fontSize:18,fontWeight:700,marginBottom:4}}>CIE-11</div>
<div style={{fontSize:11,color:C.muted,marginBottom:14}}>Clasificación Internacional de Enfermedades · Vinculada a consultas</div>
<div style={{...S.card,marginBottom:14}}>
<div style={{display:“grid”,gridTemplateColumns:“1fr 3fr auto”,gap:10,alignItems:“end”}}>
<F label="Código"><input style={S.input} placeholder=“E11, I10…” value={form.codigo} onChange={e=>setForm(p=>({…p,codigo:e.target.value}))}/></F>
<F label="Descripción"><input style={S.input} value={form.descripcion} onChange={e=>setForm(p=>({…p,descripcion:e.target.value}))}/></F>
<button style={{…S.btn(C.green,C.bg),marginBottom:10}} onClick={()=>{if(!form.codigo.trim())return;setCieList(prev=>[…prev,{…form,id:Date.now()}]);setForm({codigo:””,descripcion:””});}}>+ Agregar</button>
</div>
</div>
<input style={{…S.input,marginBottom:10}} placeholder=“🔍 Buscar código o descripción…” value={search} onChange={e=>setSearch(e.target.value)}/>
<div style={S.card}>
<div style={S.th(“1fr 4fr 50px”)}><span>Código</span><span>Descripción</span><span></span></div>
{filtered.map((c,i)=>(
<div key={i} style={{…S.tr(“1fr 4fr 50px”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<span style={S.badge(C.amber,C.amberBg)}>{c.codigo}</span><span>{c.descripcion}</span>
<button style={S.danger} onClick={()=>setCieList(prev=>prev.filter(x=>x.id!==c.id))}>✕</button>
</div>
))}
{filtered.length===0&&<div style={{padding:“12px 13px”,color:C.muted,fontSize:12}}>Sin resultados.</div>}
</div>
</div>
);
}

// ── LABORATORIO ────────────────────────────────────────────────────
function Laboratorio({pacientes,consultas}){
const labs=consultas.filter(c=>c.laboratorio).map(c=>({…c,paciente:pacientes.find(p=>p.id===c.pacienteId)}));
return(
<div>
<div style={{fontSize:18,fontWeight:700,marginBottom:14}}>LABORATORIO</div>
<div style={S.card}>
<div style={S.th(“2fr 1fr 3fr”)}><span>Paciente</span><span>Fecha</span><span>Exámenes solicitados</span></div>
{labs.map((l,i)=>(
<div key={i} style={{…S.tr(“2fr 1fr 3fr”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<div style={{display:“flex”,alignItems:“center”,gap:8}}><Av name={l.paciente?.nombre} size={28}/><span>{l.paciente?.nombre||”—”}</span></div>
<span style={{color:C.muted,fontSize:11}}>{l.fechaHora}</span>
<span style={{color:C.muted,fontSize:11}}>{l.laboratorio}</span>
</div>
))}
{labs.length===0&&<div style={{padding:“14px 13px”,color:C.muted,fontSize:12}}>Sin órdenes de laboratorio registradas.</div>}
</div>
</div>
);
}

// ── PACIENTES PSIQUIATRICOS ────────────────────────────────────────
function PacientesPsi({pacientesPsi,setPacientesPsi}){
const [showForm,setShowForm]=useState(false);
const [form,setForm]=useState({nombre:””,dni:””,fechaNac:””,sexo:“M”,telefono:””,diagnostico:””,medicacion:””,notas:””});
const save=()=>{if(!form.nombre.trim())return;setPacientesPsi(prev=>[…prev,{…form,id:Date.now(),fechaReg:nowStr()}]);setShowForm(false);setForm({nombre:””,dni:””,fechaNac:””,sexo:“M”,telefono:””,diagnostico:””,medicacion:””,notas:””});};
return(
<div>
{showForm&&(
<Modal title=“Nuevo paciente psiquiátrico” onClose={()=>setShowForm(false)}>
<div style={S.g2}>
<F label="Nombre *"><input style={S.input} value={form.nombre} onChange={e=>setForm(p=>({…p,nombre:e.target.value.toUpperCase()}))}/></F>
<F label="DNI"><input style={S.input} value={form.dni} onChange={e=>setForm(p=>({…p,dni:e.target.value}))}/></F>
<F label="Fecha Nac."><input style={S.input} type=“date” value={form.fechaNac} onChange={e=>setForm(p=>({…p,fechaNac:e.target.value}))}/></F>
<F label="Sexo"><select style={S.input} value={form.sexo} onChange={e=>setForm(p=>({…p,sexo:e.target.value}))}><option value="M">Mujer</option><option value="H">Hombre</option></select></F>
<F label="Teléfono"><input style={S.input} value={form.telefono} onChange={e=>setForm(p=>({…p,telefono:e.target.value}))}/></F>
<F label="Diagnóstico"><input style={S.input} value={form.diagnostico} onChange={e=>setForm(p=>({…p,diagnostico:e.target.value}))}/></F>
</div>
<F label="Medicación actual"><input style={S.input} value={form.medicacion} onChange={e=>setForm(p=>({…p,medicacion:e.target.value}))}/></F>
<F label="Notas"><textarea style={{…S.input,minHeight:70,resize:“vertical”}} value={form.notas} onChange={e=>setForm(p=>({…p,notas:e.target.value}))}/></F>
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”}}><button style={S.ghost} onClick={()=>setShowForm(false)}>Cancelar</button><button style={S.btn(C.green,C.bg)} onClick={save}>💾 Guardar</button></div>
</Modal>
)}
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:14}}>
<div style={{fontSize:18,fontWeight:700}}>Pacientes Psiquiátricos</div>
<button style={S.btn(C.green,C.bg)} onClick={()=>setShowForm(true)}>+ Nuevo</button>
</div>
<div style={S.card}>
<div style={S.th(“2fr 1fr 1fr 2fr”)}><span>Nombre</span><span>Edad</span><span>Teléfono</span><span>Diagnóstico</span></div>
{pacientesPsi.map((p,i)=>(
<div key={i} style={{…S.tr(“2fr 1fr 1fr 2fr”),cursor:“default”}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=“transparent”}>
<div style={{display:“flex”,alignItems:“center”,gap:8}}><Av name={p.nombre} size={28}/><span>{p.nombre}</span></div>
<span style={{color:C.muted,fontSize:11}}>{calcEdad(p.fechaNac)}</span>
<span style={{color:C.accent,fontSize:11}}>{p.telefono}</span>
<span style={{color:C.muted,fontSize:11}}>{p.diagnostico}</span>
</div>
))}
{pacientesPsi.length===0&&<div style={{padding:“14px 13px”,color:C.muted,fontSize:12}}>Sin pacientes registrados.</div>}
</div>
</div>
);
}

// ── NAV ─────────────────────────────────────────────────────────────
const NAV=[
{id:“dashboard”,label:“Dashboard”,icon:“⬡”},
{id:“pacientes”,label:“Registro”,icon:“🧑‍⚕️”},
{id:“farmacos”,label:“Fármacos”,icon:“💊”},
{id:“ingresos”,label:“Ingresos”,icon:“💰”},
{id:“patologias”,label:“PATOLOGIAS”,icon:“🦠”},
{id:“citas”,label:“Agendar cita”,icon:“📅”},
{id:“psiquiatricos”,label:“Pacientes Psiquiátricos”,icon:“🧠”},
{id:“laboratorio”,label:“LABORATORIO”,icon:“🔬”},
{id:“cie”,label:“CIE-11”,icon:“⚙️”},
];

// ── APP ROOT ─────────────────────────────────────────────────────────
export default function App(){
const [tab,setTab]=useState(“dashboard”);
const [selPac,setSelPac]=useState(null);
const [pacientes,setPacientes]=useLS(“eb_pacientes”,initPacientes);
const [consultas,setConsultas]=useLS(“eb_consultas”,initConsultas);
const [ingresos,setIngresos]=useLS(“eb_ingresos”,initIngresos);
const [citas,setCitas]=useLS(“eb_citas”,initCitas);
const [farmacos,setFarmacos]=useLS(“eb_farmacos”,initFarmacos);
const [patologias,setPatologias]=useLS(“eb_patologias”,initPatologias);
const [cieList,setCieList]=useLS(“eb_cie”,initCIE);
const [pacientesPsi,setPacientesPsi]=useLS(“eb_psi”,[]);
const goTab=t=>{setSelPac(null);setTab(t);};

let Page=null;
if(tab===“dashboard”)Page=<Dashboard pacientes={pacientes} ingresos={ingresos} consultas={consultas} citas={citas} setTab={goTab}/>;
else if(tab===“pacientes”)Page=<Registro pacientes={pacientes} setTab={setTab} setSelPac={setSelPac}/>;
else if(tab===“ficha”&&selPac)Page=<FichaPaciente paciente={selPac} setPacientes={setPacientes} consultas={consultas} setConsultas={setConsultas} ingresos={ingresos} setIngresos={setIngresos} farmacos={farmacos} cieList={cieList} setTab={setTab}/>;
else if(tab===“registro_nuevo”)Page=<NuevoPaciente setPacientes={setPacientes} setTab={setTab}/>;
else if(tab===“ingresos”)Page=<Ingresos ingresos={ingresos} setIngresos={setIngresos} pacientes={pacientes}/>;
else if(tab===“citas”)Page=<AgendarCita citas={citas} setCitas={setCitas} pacientes={pacientes}/>;
else if(tab===“farmacos”)Page=<Farmacos farmacos={farmacos} setFarmacos={setFarmacos}/>;
else if(tab===“patologias”)Page=<Patologias patologias={patologias} setPatologias={setPatologias}/>;
else if(tab===“cie”)Page=<CIE cieList={cieList} setCieList={setCieList}/>;
else if(tab===“laboratorio”)Page=<Laboratorio pacientes={pacientes} consultas={consultas}/>;
else if(tab===“psiquiatricos”)Page=<PacientesPsi pacientesPsi={pacientesPsi} setPacientesPsi={setPacientesPsi}/>;

const activeNav=[“ficha”,“registro_nuevo”].includes(tab)?“pacientes”:tab;

return(
<>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<div style={S.app}>
<div style={S.sidebar}>
<div style={S.logo}>
<div style={{fontSize:13,fontWeight:700,color:C.accent}}>DR EDWIN BARAHONA</div>
<div style={{fontSize:10,color:C.muted,marginTop:1}}>Medicina y Cirugía · v2.0</div>
</div>
{NAV.map(item=>(
<div key={item.id} style={S.nav(activeNav===item.id)} onClick={()=>goTab(item.id)}>
<span style={{width:16,textAlign:“center”,fontSize:12}}>{item.icon}</span>
<span>{item.label}</span>
</div>
))}
<div style={{flex:1}}/>
<div style={{padding:“0 12px”}}>
<div style={{background:C.accentBg,border:`1px solid ${C.accent}25`,borderRadius:8,padding:10}}>
<div style={{fontSize:10,color:C.accent,fontWeight:700,marginBottom:3}}>🤖 Automatizaciones</div>
<div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>WhatsApp · Recordatorios · Cumpleaños</div>
</div>
</div>
</div>
<div style={S.main}>
<div style={S.topbar}>
<div>
<div style={{fontSize:13,fontWeight:700}}>CLÍNICA DR. EDWIN BARAHONA</div>
<div style={{fontSize:10,color:C.muted}}>Centro Comercial Novacentro · Datos guardados localmente</div>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:8}}>
<div style={{width:7,height:7,borderRadius:“50%”,background:C.green}}/>
<span style={{fontSize:11,color:C.muted}}>En línea</span>
<div style={{width:30,height:30,borderRadius:“50%”,background:C.accentBg,border:`1px solid ${C.accent}40`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:11,fontWeight:700,color:C.accent,marginLeft:6}}>EB</div>
</div>
</div>
<div style={S.content}>{Page}</div>
</div>
</div>
</>
);
}
