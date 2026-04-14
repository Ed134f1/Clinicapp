import { useState, useEffect } from "react";

// ── STORAGE ──────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// ── THEME ─────────────────────────────────────────────────────────
const C = {
  bg: "#0A0F1E", card: "#111827", cardHover: "#1a2235", sidebar: "#080D1A",
  accent: "#00D4FF", accentBg: "#00D4FF18",
  green: "#00E5A0", greenBg: "#00E5A018",
  amber: "#FFB800", amberBg: "#FFB80018",
  red: "#FF4D6A", redBg: "#FF4D6A18",
  purple: "#A78BFA", purpleBg: "#A78BFA18",
  text: "#F0F4FF", muted: "#6B7A99", dim: "#3D4F6E",
  border: "#1E2D45", borderLight: "#243350",
};

// ── HELPERS ───────────────────────────────────────────────────────
const avatarColors = [C.accent, C.green, C.amber, C.purple, C.red, "#F472B6", "#34D399"];
const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
const initials = (name) => name ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "?";
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtMoney = (n) => `RD$${Number(n || 0).toLocaleString("es-DO")}`;
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// ── STYLES ────────────────────────────────────────────────────────
const S = {
  app: { display: "flex", height: "100vh", width: "100vw", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text, overflow: "hidden" },
  sidebar: { width: 220, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 },
  logo: { padding: "0 20px 24px", borderBottom: `1px solid ${C.border}`, marginBottom: 12 },
  logoTitle: { fontSize: 18, fontWeight: 700, color: C.accent, letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: C.muted, marginTop: 2, letterSpacing: "0.5px", textTransform: "uppercase" },
  nav: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", color: active ? C.accent : C.muted, background: active ? C.accentBg : "transparent", borderLeft: `2px solid ${active ? C.accent : "transparent"}`, fontSize: 13.5, fontWeight: active ? 600 : 400, transition: "all 0.15s", userSelect: "none" }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 60, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between", background: C.sidebar, flexShrink: 0 },
  content: { flex: 1, overflow: "auto", padding: 28 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 },
  statCard: (color) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, borderTop: `3px solid ${color}` }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 },
  badge: (color, bg) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg }),
  btn: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: bg || C.accent, color: color || C.bg, fontSize: 13, fontWeight: 600, cursor: "pointer" }),
  btnGhost: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" },
  btnDanger: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "none", background: C.redBg, color: C.red, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  input: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  label: { fontSize: 12, color: C.muted, marginBottom: 4, display: "block" },
  avatar: (name) => ({ width: 36, height: 36, borderRadius: "50%", background: getColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }),
  divider: { height: 1, background: C.border, margin: "16px 0" },
  tableHeader: { display: "grid", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  tableRow: { display: "grid", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, alignItems: "center", cursor: "pointer", transition: "background 0.1s" },
  modal: { position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modalBox: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "90%", maxWidth: 520, maxHeight: "85vh", overflow: "auto" },
};

// ── INITIAL DATA ──────────────────────────────────────────────────
const initialPacientes = [
  { id: 1, nombre: "María González", fechaNac: "1991-03-15", telefono: "8095551234", sangre: "O+", alergias: "Ninguna", notas: "", creado: "2025-01-10" },
  { id: 2, nombre: "Carlos Méndez", fechaNac: "1973-07-22", telefono: "8295556789", sangre: "A+", alergias: "Penicilina", notas: "Hipertensión", creado: "2025-01-15" },
  { id: 3, nombre: "Ana Rodríguez", fechaNac: "1997-04-15", telefono: "8495553456", sangre: "B-", alergias: "Ninguna", notas: "", creado: "2025-02-01" },
  { id: 4, nombre: "Luis Peña", fechaNac: "1980-11-08", telefono: "8095557890", sangre: "AB+", alergias: "Ibuprofeno", notas: "DM2", creado: "2025-02-10" },
  { id: 5, nombre: "Sofia Castro", fechaNac: "1964-04-18", telefono: "8295552345", sangre: "O-", alergias: "Ninguna", notas: "Hipotiroidismo", creado: "2025-02-20" },
];

const initialCitas = [
  { id: 1, pacienteId: 1, fecha: today(), hora: "08:30", tipo: "Consulta general", estado: "Confirmada", notas: "" },
  { id: 2, pacienteId: 2, fecha: today(), hora: "09:00", tipo: "Control hipertensión", estado: "Pendiente", notas: "" },
  { id: 3, pacienteId: 4, fecha: today(), hora: "10:30", tipo: "Revisión exámenes", estado: "Confirmada", notas: "" },
  { id: 4, pacienteId: 5, fecha: today(), hora: "11:00", tipo: "Seguimiento DM2", estado: "Confirmada", notas: "" },
];

const initialConsultas = [
  { id: 1, pacienteId: 1, fecha: "2025-04-10", motivo: "Control rutinario", diagnostico: "HTA controlada", tratamiento: "Continúa enalapril 10mg", notas: "TA 120/80. Paciente estable.", peso: "65", talla: "162", ta: "120/80", fc: "72" },
  { id: 2, pacienteId: 2, fecha: "2025-04-05", motivo: "Control hipertensión", diagnostico: "HTA", tratamiento: "Ajuste de dosis losartán", notas: "TA 140/90. Ajuste de medicamento.", peso: "82", talla: "175", ta: "140/90", fc: "78" },
];

const initialCobros = [
  { id: 1, pacienteId: 1, fecha: "2025-04-10", monto: 1500, metodo: "Efectivo", concepto: "Consulta general", estado: "Pagado" },
  { id: 2, pacienteId: 2, fecha: "2025-04-05", monto: 2000, metodo: "Transferencia", concepto: "Control + receta", estado: "Pagado" },
  { id: 3, pacienteId: 4, fecha: "2025-04-12", monto: 1500, metodo: "Efectivo", concepto: "Consulta general", estado: "Pendiente" },
];

// ── MODAL FORM ────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={S.modal} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ ...S.btnGhost, padding: "4px 10px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({ pacientes, citas, cobros, consultas, setTab }) {
  const todayStr = today();
  const citasHoy = citas.filter(c => c.fecha === todayStr);
  const cobradoMes = cobros.filter(c => c.estado === "Pagado" && c.fecha?.startsWith(todayStr.slice(0, 7))).reduce((s, c) => s + Number(c.monto), 0);
  const pendienteCobro = cobros.filter(c => c.estado === "Pendiente").reduce((s, c) => s + Number(c.monto), 0);

  const inactivos = pacientes.filter(p => {
    const ult = consultas.filter(c => c.pacienteId === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    return !ult || daysBetween(ult.fecha, todayStr) > 90;
  });

  const cumples = pacientes.filter(p => {
    if (!p.fechaNac) return false;
    const bday = p.fechaNac.slice(5);
    const now = todayStr.slice(5);
    const diff = daysBetween(todayStr, todayStr.slice(0, 5) + bday) ;
    const d = (new Date(todayStr.slice(0,4) + "-" + bday) - new Date(todayStr)) / 86400000;
    return d >= 0 && d <= 14;
  }).map(p => {
    const bday = p.fechaNac.slice(5);
    const d = Math.round((new Date(todayStr.slice(0, 4) + "-" + bday) - new Date(todayStr)) / 86400000);
    return { ...p, dias: d };
  }).sort((a, b) => a.dias - b.dias);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Buenos días, Dr. Barahona 👋</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
          {new Date().toLocaleDateString("es-DO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · {citasHoy.length} citas hoy
        </div>
      </div>

      <div style={S.grid4}>
        {[
          { label: "Pacientes", value: pacientes.length, color: C.accent, icon: "👥" },
          { label: "Citas hoy", value: citasHoy.length, color: C.green, icon: "📅" },
          { label: `Ingresos ${new Date().toLocaleDateString("es-DO",{month:"short"})}`, value: fmtMoney(cobradoMes), color: C.amber, icon: "💰" },
          { label: "Por cobrar", value: fmtMoney(pendienteCobro), color: C.red, icon: "⚠️" },
        ].map((s, i) => (
          <div key={i} style={S.statCard(s.color)}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.grid2, marginTop: 20 }}>
        <div style={S.card}>
          <div style={S.sectionTitle}>📅 Citas de hoy</div>
          {citasHoy.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No hay citas programadas para hoy.</div>}
          {citasHoy.slice(0, 5).map((c, i) => {
            const p = pacientes.find(x => x.id === c.pacienteId);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < citasHoy.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={S.avatar(p?.nombre)}>{initials(p?.nombre)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p?.nombre || "—"}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{c.tipo}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{c.hora}</div>
                  <span style={S.badge(c.estado === "Confirmada" ? C.green : c.estado === "En sala" ? C.accent : C.amber, c.estado === "Confirmada" ? C.greenBg : c.estado === "En sala" ? C.accentBg : C.amberBg)}>{c.estado}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <div style={S.sectionTitle}>🎂 Cumpleaños próximos (14 días)</div>
            {cumples.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>Sin cumpleaños próximos.</div>}
            {cumples.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < cumples.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 13 }}>{p.nombre}</div>
                <span style={S.badge(C.purple, C.purpleBg)}>{p.dias === 0 ? "¡Hoy! 🎉" : `en ${p.dias}d`}</span>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.sectionTitle}>⚠️ Pacientes inactivos</div>
              <span style={S.badge(C.red, C.redBg)}>{inactivos.length}</span>
            </div>
            {inactivos.slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <div style={S.avatar(p.nombre)}>{initials(p.nombre)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Sin consultas recientes</div>
                </div>
                <a href={`https://wa.me/1${p.telefono?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                  style={{ ...S.btn(C.greenBg, C.green), fontSize: 11, padding: "5px 10px", textDecoration: "none" }}>
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PACIENTES ─────────────────────────────────────────────────────
function Pacientes({ pacientes, setPacientes, consultas, setConsultas, cobros }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", fechaNac: "", telefono: "", sangre: "", alergias: "", notas: "" });
  const [showConsultaForm, setShowConsultaForm] = useState(false);
  const [consultaForm, setConsultaForm] = useState({ fecha: today(), motivo: "", diagnostico: "", tratamiento: "", notas: "", peso: "", talla: "", ta: "", fc: "" });

  const filtered = pacientes.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.telefono?.includes(search));

  const calcEdad = (fechaNac) => {
    if (!fechaNac) return "—";
    const diff = new Date() - new Date(fechaNac);
    return Math.floor(diff / (365.25 * 86400000)) + " años";
  };

  const saveForm = () => {
    if (!form.nombre.trim()) return;
    if (form.id) {
      setPacientes(prev => prev.map(p => p.id === form.id ? { ...form } : p));
    } else {
      const nuevo = { ...form, id: Date.now(), creado: today() };
      setPacientes(prev => [...prev, nuevo]);
    }
    setShowForm(false);
    setForm({ nombre: "", fechaNac: "", telefono: "", sangre: "", alergias: "", notas: "" });
  };

  const saveConsulta = () => {
    if (!consultaForm.motivo.trim()) return;
    const nueva = { ...consultaForm, id: Date.now(), pacienteId: selected.id };
    setConsultas(prev => [...prev, nueva]);
    setShowConsultaForm(false);
    setConsultaForm({ fecha: today(), motivo: "", diagnostico: "", tratamiento: "", notas: "", peso: "", talla: "", ta: "", fc: "" });
  };

  const deletePaciente = (id) => {
    if (!confirm("¿Eliminar este paciente?")) return;
    setPacientes(prev => prev.filter(p => p.id !== id));
    setSelected(null);
  };

  if (selected) {
    const historial = consultas.filter(c => c.pacienteId === selected.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const pagos = cobros.filter(c => c.pacienteId === selected.id);
    const totalPagado = pagos.filter(c => c.estado === "Pagado").reduce((s, c) => s + Number(c.monto), 0);

    return (
      <div>
        {showConsultaForm && (
          <Modal title="Nueva consulta" onClose={() => setShowConsultaForm(false)}>
            <div style={S.grid2}>
              <Field label="Fecha"><input style={S.input} type="date" value={consultaForm.fecha} onChange={e => setConsultaForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
              <Field label="Motivo de consulta"><input style={S.input} placeholder="Motivo..." value={consultaForm.motivo} onChange={e => setConsultaForm(p => ({ ...p, motivo: e.target.value }))} /></Field>
            </div>
            <div style={S.grid4}>
              {[["peso","Peso (kg)"],["talla","Talla (cm)"],["ta","TA (mmHg)"],["fc","FC (lpm)"]].map(([k,l]) => (
                <Field key={k} label={l}><input style={S.input} placeholder={l} value={consultaForm[k]} onChange={e => setConsultaForm(p => ({ ...p, [k]: e.target.value }))} /></Field>
              ))}
            </div>
            <Field label="Diagnóstico"><input style={S.input} placeholder="CIE-10 o descripción..." value={consultaForm.diagnostico} onChange={e => setConsultaForm(p => ({ ...p, diagnostico: e.target.value }))} /></Field>
            <Field label="Tratamiento"><input style={S.input} placeholder="Medicamentos, indicaciones..." value={consultaForm.tratamiento} onChange={e => setConsultaForm(p => ({ ...p, tratamiento: e.target.value }))} /></Field>
            <Field label="Notas clínicas">
              <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="Observaciones..." value={consultaForm.notas} onChange={e => setConsultaForm(p => ({ ...p, notas: e.target.value }))} />
            </Field>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={S.btnGhost} onClick={() => setShowConsultaForm(false)}>Cancelar</button>
              <button style={S.btn()} onClick={saveConsulta}>Guardar consulta</button>
            </div>
          </Modal>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setSelected(null)} style={S.btnGhost}>← Volver</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.nombre}</div>
        </div>

        <div style={S.grid2}>
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ ...S.avatar(selected.nombre), width: 52, height: 52, fontSize: 18 }}>{initials(selected.nombre)}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.nombre}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{calcEdad(selected.fechaNac)} · Tipo {selected.sangre || "—"}</div>
                <a href={`https://wa.me/1${selected.telefono?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: C.green, textDecoration: "none" }}>📱 {selected.telefono}</a>
              </div>
            </div>
            <div style={S.divider} />
            <div style={S.grid2}>
              {[["Nacimiento", fmtDate(selected.fechaNac)], ["Alergias", selected.alergias || "Ninguna"], ["Consultas", historial.length], ["Total pagado", fmtMoney(totalPagado)]].map(([l, v]) => (
                <div key={l} style={{ background: "#0A0F1E", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.notas && <div style={{ marginTop: 12, fontSize: 13, color: C.muted, background: "#0A0F1E", borderRadius: 8, padding: 12 }}>📝 {selected.notas}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={S.btn()} onClick={() => { setForm({ ...selected }); setShowForm(true); }}>Editar</button>
              <button style={S.btnDanger} onClick={() => deletePaciente(selected.id)}>Eliminar</button>
            </div>
          </div>

          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.sectionTitle}>Historial clínico</div>
              <button style={S.btn(C.greenBg, C.green)} onClick={() => setShowConsultaForm(true)}>+ Consulta</button>
            </div>
            {historial.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>Sin consultas registradas.</div>}
            {historial.map((h, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < historial.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{h.diagnostico || h.motivo}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{fmtDate(h.fecha)}</span>
                </div>
                {(h.peso || h.ta) && <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Peso: {h.peso}kg · TA: {h.ta} · FC: {h.fc}lpm</div>}
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{h.tratamiento}</div>
                {h.notas && <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{h.notas}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showForm && (
        <Modal title={form.id ? "Editar paciente" : "Nuevo paciente"} onClose={() => setShowForm(false)}>
          <Field label="Nombre completo *"><input style={S.input} placeholder="Nombre..." value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} /></Field>
          <div style={S.grid2}>
            <Field label="Fecha de nacimiento"><input style={S.input} type="date" value={form.fechaNac} onChange={e => setForm(p => ({ ...p, fechaNac: e.target.value }))} /></Field>
            <Field label="Teléfono"><input style={S.input} placeholder="809..." value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))} /></Field>
            <Field label="Tipo de sangre">
              <select style={S.input} value={form.sangre} onChange={e => setForm(p => ({ ...p, sangre: e.target.value }))}>
                <option value="">—</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Alergias"><input style={S.input} placeholder="Alergias conocidas..." value={form.alergias} onChange={e => setForm(p => ({ ...p, alergias: e.target.value }))} /></Field>
          </div>
          <Field label="Notas"><textarea style={{ ...S.input, minHeight: 70, resize: "vertical" }} placeholder="Antecedentes, observaciones..." value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} /></Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={S.btn()} onClick={saveForm}>Guardar</button>
          </div>
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Pacientes</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{pacientes.length} registros</div>
        </div>
        <button style={S.btn()} onClick={() => { setForm({ nombre: "", fechaNac: "", telefono: "", sangre: "", alergias: "", notas: "" }); setShowForm(true); }}>+ Nuevo paciente</button>
      </div>
      <div style={{ marginBottom: 14 }}>
        <input style={S.input} placeholder="🔍  Buscar por nombre o teléfono..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={S.card}>
        <div style={{ ...S.tableHeader, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
          <span>Paciente</span><span>Edad</span><span>Teléfono</span><span>Tipo sangre</span>
        </div>
        {filtered.map((p, i) => (
          <div key={i} style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1fr 1fr" }} onClick={() => setSelected(p)}
            onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={S.avatar(p.nombre)}>{initials(p.nombre)}</div>
              <div style={{ fontWeight: 600 }}>{p.nombre}</div>
            </div>
            <span style={{ color: C.muted }}>{calcEdad(p.fechaNac)}</span>
            <span style={{ color: C.accent }}>{p.telefono}</span>
            <span style={{ color: C.muted }}>{p.sangre || "—"}</span>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 20, color: C.muted, fontSize: 13 }}>Sin resultados.</div>}
      </div>
    </div>
  );
}

// ── AGENDA ────────────────────────────────────────────────────────
function Agenda({ citas, setCitas, pacientes }) {
  const [fechaVista, setFechaVista] = useState(today());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ pacienteId: "", fecha: today(), hora: "08:00", tipo: "Consulta general", estado: "Pendiente", notas: "" });

  const citasDia = citas.filter(c => c.fecha === fechaVista).sort((a, b) => a.hora.localeCompare(b.hora));

  const saveCita = () => {
    if (!form.pacienteId || !form.hora) return;
    if (form.id) {
      setCitas(prev => prev.map(c => c.id === form.id ? { ...form, pacienteId: Number(form.pacienteId) } : c));
    } else {
      setCitas(prev => [...prev, { ...form, id: Date.now(), pacienteId: Number(form.pacienteId) }]);
    }
    setShowForm(false);
  };

  const updateEstado = (id, estado) => setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
  const deleteCita = (id) => setCitas(prev => prev.filter(c => c.id !== id));

  const estadoColor = { "Confirmada": [C.green, C.greenBg], "Pendiente": [C.amber, C.amberBg], "En sala": [C.accent, C.accentBg], "Atendida": [C.muted, C.border], "Cancelada": [C.red, C.redBg] };

  return (
    <div>
      {showForm && (
        <Modal title={form.id ? "Editar cita" : "Nueva cita"} onClose={() => setShowForm(false)}>
          <Field label="Paciente *">
            <select style={S.input} value={form.pacienteId} onChange={e => setForm(p => ({ ...p, pacienteId: e.target.value }))}>
              <option value="">Seleccionar...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Field>
          <div style={S.grid2}>
            <Field label="Fecha"><input style={S.input} type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
            <Field label="Hora"><input style={S.input} type="time" value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))} /></Field>
          </div>
          <Field label="Tipo de consulta"><input style={S.input} placeholder="Consulta general, control..." value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))} /></Field>
          <Field label="Estado">
            <select style={S.input} value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
              {Object.keys(estadoColor).map(e => <option key={e}>{e}</option>)}
            </select>
          </Field>
          <Field label="Notas"><input style={S.input} placeholder="Notas adicionales..." value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} /></Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={S.btn()} onClick={saveCita}>Guardar</button>
          </div>
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Agenda</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{citasDia.length} citas · {fmtDate(fechaVista)}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="date" style={{ ...S.input, width: "auto" }} value={fechaVista} onChange={e => setFechaVista(e.target.value)} />
          <button style={S.btn(C.accentBg, C.accent)} onClick={() => setFechaVista(today())}>Hoy</button>
          <button style={S.btn()} onClick={() => { setForm({ pacienteId: "", fecha: fechaVista, hora: "08:00", tipo: "Consulta general", estado: "Pendiente", notas: "" }); setShowForm(true); }}>+ Cita</button>
        </div>
      </div>

      <div style={S.card}>
        {citasDia.length === 0 && <div style={{ padding: 20, color: C.muted, fontSize: 13 }}>No hay citas para esta fecha.</div>}
        {citasDia.map((c, i) => {
          const p = pacientes.find(x => x.id === c.pacienteId);
          const [col, bg] = estadoColor[c.estado] || [C.muted, C.border];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < citasDia.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, minWidth: 50 }}>{c.hora}</div>
              <div style={S.avatar(p?.nombre)}>{initials(p?.nombre)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p?.nombre || "—"}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{c.tipo}</div>
              </div>
              <span style={S.badge(col, bg)}>{c.estado}</span>
              <select style={{ ...S.input, width: "auto", fontSize: 12, padding: "6px 10px" }} value={c.estado} onChange={e => updateEstado(c.id, e.target.value)}>
                {Object.keys(estadoColor).map(e => <option key={e}>{e}</option>)}
              </select>
              <button style={S.btnDanger} onClick={() => deleteCita(c.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── COBROS ────────────────────────────────────────────────────────
function Cobros({ cobros, setCobros, pacientes }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ pacienteId: "", fecha: today(), monto: "", metodo: "Efectivo", concepto: "Consulta general", estado: "Pagado" });

  const saveCobro = () => {
    if (!form.pacienteId || !form.monto) return;
    if (form.id) {
      setCobros(prev => prev.map(c => c.id === form.id ? { ...form, pacienteId: Number(form.pacienteId) } : c));
    } else {
      setCobros(prev => [...prev, { ...form, id: Date.now(), pacienteId: Number(form.pacienteId) }]);
    }
    setShowForm(false);
  };

  const mesActual = today().slice(0, 7);
  const cobradoMes = cobros.filter(c => c.estado === "Pagado" && c.fecha?.startsWith(mesActual)).reduce((s, c) => s + Number(c.monto), 0);
  const pendiente = cobros.filter(c => c.estado === "Pendiente").reduce((s, c) => s + Number(c.monto), 0);

  return (
    <div>
      {showForm && (
        <Modal title={form.id ? "Editar cobro" : "Registrar cobro"} onClose={() => setShowForm(false)}>
          <Field label="Paciente *">
            <select style={S.input} value={form.pacienteId} onChange={e => setForm(p => ({ ...p, pacienteId: e.target.value }))}>
              <option value="">Seleccionar...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Field>
          <div style={S.grid2}>
            <Field label="Fecha"><input style={S.input} type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
            <Field label="Monto (RD$) *"><input style={S.input} type="number" placeholder="1500" value={form.monto} onChange={e => setForm(p => ({ ...p, monto: e.target.value }))} /></Field>
            <Field label="Método de pago">
              <select style={S.input} value={form.metodo} onChange={e => setForm(p => ({ ...p, metodo: e.target.value }))}>
                {["Efectivo","Transferencia","Tarjeta","Seguro médico"].map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Estado">
              <select style={S.input} value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                <option>Pagado</option><option>Pendiente</option>
              </select>
            </Field>
          </div>
          <Field label="Concepto"><input style={S.input} placeholder="Consulta general, procedimiento..." value={form.concepto} onChange={e => setForm(p => ({ ...p, concepto: e.target.value }))} /></Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
            <button style={S.btn()} onClick={saveCobro}>Guardar</button>
          </div>
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Cobros</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{new Date().toLocaleDateString("es-DO", { month: "long", year: "numeric" })}</div>
        </div>
        <button style={S.btn()} onClick={() => { setForm({ pacienteId: "", fecha: today(), monto: "", metodo: "Efectivo", concepto: "Consulta general", estado: "Pagado" }); setShowForm(true); }}>+ Registrar cobro</button>
      </div>

      <div style={{ ...S.grid3, marginBottom: 20 }}>
        {[
          { label: "Cobrado este mes", value: fmtMoney(cobradoMes), color: C.green },
          { label: "Pendiente de cobro", value: fmtMoney(pendiente), color: C.amber },
          { label: "Total transacciones", value: cobros.length, color: C.accent },
        ].map((s, i) => (
          <div key={i} style={S.statCard(s.color)}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ ...S.tableHeader, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
          <span>Paciente</span><span>Fecha</span><span>Monto</span><span>Método</span><span>Estado</span>
        </div>
        {cobros.slice().reverse().map((c, i) => {
          const p = pacientes.find(x => x.id === c.pacienteId);
          return (
            <div key={i} style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={S.avatar(p?.nombre)}>{initials(p?.nombre)}</div>
                <div>
                  <div style={{ fontWeight: 500 }}>{p?.nombre || "—"}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{c.concepto}</div>
                </div>
              </div>
              <span style={{ color: C.muted }}>{fmtDate(c.fecha)}</span>
              <span style={{ color: C.green, fontWeight: 600 }}>{fmtMoney(c.monto)}</span>
              <span style={{ color: C.muted }}>{c.metodo}</span>
              <span style={S.badge(c.estado === "Pagado" ? C.green : C.amber, c.estado === "Pagado" ? C.greenBg : C.amberBg)}>{c.estado}</span>
            </div>
          );
        })}
        {cobros.length === 0 && <div style={{ padding: 20, color: C.muted, fontSize: 13 }}>Sin cobros registrados.</div>}
      </div>
    </div>
  );
}

// ── DOCUMENTOS ────────────────────────────────────────────────────
function Documentos({ pacientes }) {
  const [tipo, setTipo] = useState(null);
  const [form, setForm] = useState({ pacienteId: "", fecha: today(), contenido: "", diasReposo: "", especialidad: "", medico: "Dr. Edwin Barahona" });

  const plantillas = {
    receta: { titulo: "Receta Médica", icon: "💊", color: C.accent, campo: "Medicamentos y dosis" },
    constancia: { titulo: "Constancia Médica", icon: "📋", color: C.green, campo: "Texto de la constancia" },
    incapacidad: { titulo: "Incapacidad Laboral", icon: "🏥", color: C.amber, campo: "Diagnóstico y observaciones" },
    referimiento: { titulo: "Referimiento", icon: "↗️", color: C.purple, campo: "Motivo del referimiento" },
  };

  const imprimir = () => {
    const p = pacientes.find(x => x.id === Number(form.pacienteId));
    const t = plantillas[tipo];
    const html = `
      <html><head><style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #00D4FF; padding-bottom: 16px; margin-bottom: 24px; }
        .title { font-size: 22px; font-weight: bold; color: #00D4FF; }
        .sub { color: #666; font-size: 13px; }
        .field { margin-bottom: 12px; }
        .label { font-size: 11px; color: #666; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 2px; }
        .firma { margin-top: 60px; text-align: center; }
        .firma-line { border-top: 1px solid #111; width: 200px; margin: 0 auto 6px; }
      </style></head><body>
        <div class="header">
          <div class="title">Clínica Dr. Barahona</div>
          <div class="sub">${t.titulo} · ${new Date(form.fecha).toLocaleDateString("es-DO",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div class="field"><div class="label">Paciente</div><div class="value">${p?.nombre || "—"}</div></div>
        ${tipo === "incapacidad" ? `<div class="field"><div class="label">Días de reposo</div><div class="value">${form.diasReposo || "—"} días</div></div>` : ""}
        ${tipo === "referimiento" ? `<div class="field"><div class="label">Especialidad</div><div class="value">${form.especialidad || "—"}</div></div>` : ""}
        <div class="field"><div class="label">${t.campo}</div><div class="value" style="white-space:pre-wrap;min-height:80px">${form.contenido}</div></div>
        <div class="firma"><div class="firma-line"></div><div>${form.medico}</div><div style="font-size:12px;color:#666">Médico tratante</div></div>
      </body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };

  if (tipo) {
    const t = plantillas[tipo];
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setTipo(null)} style={S.btnGhost}>← Volver</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{t.icon} {t.titulo}</div>
        </div>
        <div style={{ ...S.card, maxWidth: 600 }}>
          <Field label="Paciente *">
            <select style={S.input} value={form.pacienteId} onChange={e => setForm(p => ({ ...p, pacienteId: e.target.value }))}>
              <option value="">Seleccionar paciente...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Field>
          <Field label="Fecha"><input style={S.input} type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field>
          {tipo === "incapacidad" && <Field label="Días de reposo"><input style={S.input} type="number" placeholder="3" value={form.diasReposo} onChange={e => setForm(p => ({ ...p, diasReposo: e.target.value }))} /></Field>}
          {tipo === "referimiento" && <Field label="Especialidad"><input style={S.input} placeholder="Cardiología, Neurología..." value={form.especialidad} onChange={e => setForm(p => ({ ...p, especialidad: e.target.value }))} /></Field>}
          <Field label={t.campo}>
            <textarea style={{ ...S.input, minHeight: 120, resize: "vertical" }} placeholder="Escriba aquí..." value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))} />
          </Field>
          <Field label="Médico firmante"><input style={S.input} value={form.medico} onChange={e => setForm(p => ({ ...p, medico: e.target.value }))} /></Field>
          <button style={{ ...S.btn(t.color, C.bg), marginTop: 8 }} onClick={imprimir}>🖨️ Imprimir / Guardar PDF</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Documentos Médicos</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Genera e imprime documentos oficiales</div>
      <div style={S.grid2}>
        {Object.entries(plantillas).map(([key, t]) => (
          <div key={key} style={{ ...S.card, borderLeft: `3px solid ${t.color}`, cursor: "pointer" }}
            onClick={() => setTipo(key)}
            onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
            onMouseLeave={e => e.currentTarget.style.background = C.card}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t.titulo}</div>
            <button style={{ ...S.btn(t.color, C.bg), fontSize: 12, padding: "6px 14px" }}>Generar →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "pacientes", label: "Pacientes", icon: "👥" },
  { id: "agenda", label: "Agenda", icon: "📅" },
  { id: "cobros", label: "Cobros", icon: "💰" },
  { id: "documentos", label: "Documentos", icon: "📄" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [pacientes, setPacientes] = useLocalStorage("clinica_pacientes", initialPacientes);
  const [citas, setCitas] = useLocalStorage("clinica_citas", initialCitas);
  const [consultas, setConsultas] = useLocalStorage("clinica_consultas", initialConsultas);
  const [cobros, setCobros] = useLocalStorage("clinica_cobros", initialCobros);

  const pages = {
    dashboard: <Dashboard pacientes={pacientes} citas={citas} cobros={cobros} consultas={consultas} setTab={setTab} />,
    pacientes: <Pacientes pacientes={pacientes} setPacientes={setPacientes} consultas={consultas} setConsultas={setConsultas} cobros={cobros} />,
    agenda: <Agenda citas={citas} setCitas={setCitas} pacientes={pacientes} />,
    cobros: <Cobros cobros={cobros} setCobros={setCobros} pacientes={pacientes} />,
    documentos: <Documentos pacientes={pacientes} />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.app}>
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoTitle}>ClinicApp</div>
            <div style={S.logoSub}>Dr. Barahona · v1.0</div>
          </div>
          {NAV.map(item => (
            <div key={item.id} style={S.nav(tab === item.id)} onClick={() => setTab(item.id)}>
              <span style={{ width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "0 16px" }}>
            <div style={{ background: C.accentBg, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>🤖 Automatizaciones</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>WhatsApp · Cumpleaños · Recordatorios</div>
            </div>
          </div>
        </div>
        <div style={S.main}>
          <div style={S.topbar}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{NAV.find(n => n.id === tab)?.label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Clínica Dr. Barahona</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 12, color: C.muted }}>Datos guardados localmente</span>
              <div style={{ ...S.avatar("DB"), width: 30, height: 30, fontSize: 11, marginLeft: 6 }}>DB</div>
            </div>
          </div>
          <div style={S.content}>{pages[tab]}</div>
        </div>
      </div>
    </>
  );
}
