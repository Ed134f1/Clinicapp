// ============================================================================
// api-supabase.js
// Conector reutilizable entre el sistema (HTML) y la base de datos real.
// Importa este archivo en cualquier pantalla con:
//   <script type="module" src="./api-supabase.js"></script>
// o (más simple para empezar) cópialo dentro de un <script type="module"> en
// el mismo HTML, como hicimos en expediente-paso1.html.
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --------- PON AQUÍ TUS DATOS DE SUPABASE (Project Settings → API) ---------
const SUPABASE_URL = 'https://obwzbzblcjvogvmvpyld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id3piemJsY2p2b2d2bXZweWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNjU1MzcsImV4cCI6MjA5OTc0MTUzN30.x2SoxxHRRj2VnKnNFcQs_B6H_yt548K1xm9rMCNu9Kg';
// -----------------------------------------------------------------------------

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// PACIENTES
// ============================================================================

export async function generarNumeroExpediente(){
  const año = new Date().getFullYear();
  const { count } = await supabase.from('pacientes').select('*', {count:'exact', head:true});
  const consecutivo = String((count||0)+1).padStart(6,'0');
  return `EXP-${año}-${consecutivo}`;
}

export async function guardarPaciente(datos){
  // datos = { nombre_completo, dni, fecha_nacimiento, sexo, estado_civil, telefono,
  //           ocupacion, empresa_id, lugar_residencia, nivel_educativo, correo,
  //           tipo_sangre, contacto_emergencia_nombre, contacto_emergencia_telefono,
  //           seguro_privado, numero_expediente }
  const { data, error } = await supabase.from('pacientes').insert(datos).select().single();
  if(error) throw error;
  return data;
}

export async function actualizarPaciente(id, cambios){
  const { data, error } = await supabase.from('pacientes').update(cambios).eq('id', id).select().single();
  if(error) throw error;
  return data;
}

export async function buscarPacientes(texto){
  const { data, error } = await supabase.from('pacientes')
    .select('*')
    .ilike('nombre_completo', `%${texto}%`)
    .limit(20);
  if(error) throw error;
  return data;
}

export async function obtenerPaciente(id){
  const { data, error } = await supabase.from('pacientes').select('*').eq('id', id).single();
  if(error) throw error;
  return data;
}

// ============================================================================
// ANTECEDENTES
// ============================================================================

export async function guardarAntecedentes(pacienteId, datos){
  const { data, error } = await supabase.from('antecedentes')
    .upsert({ paciente_id: pacienteId, ...datos, actualizado_en: new Date().toISOString() })
    .select().single();
  if(error) throw error;
  return data;
}

export async function obtenerAntecedentes(pacienteId){
  const { data, error } = await supabase.from('antecedentes').select('*').eq('paciente_id', pacienteId).maybeSingle();
  if(error) throw error;
  return data;
}

// ============================================================================
// EMPRESAS AFILIADAS
// ============================================================================

export async function listarEmpresas(){
  const { data, error } = await supabase.from('empresas').select('*').eq('activa', true).order('nombre');
  if(error) throw error;
  return data;
}

export async function crearEmpresa(datos){
  const { data, error } = await supabase.from('empresas').insert(datos).select().single();
  if(error) throw error;
  return data;
}

export async function generarNumeroPoliza(empresaId, codigoEmpresa){
  const { count } = await supabase.from('empleados_afiliados').select('*', {count:'exact', head:true}).eq('empresa_id', empresaId);
  return `${codigoEmpresa}-${String((count||0)+1).padStart(4,'0')}`;
}

export async function marcarPagoEmpresa(empresaId, periodo, monto){
  const { data, error } = await supabase.from('pagos_empresas')
    .upsert({ empresa_id:empresaId, periodo, monto, estado:'pagado', pagado_en:new Date().toISOString() },
            { onConflict:'empresa_id,periodo' })
    .select().single();
  if(error) throw error;
  return data;
}

// ============================================================================
// CONSULTAS
// ============================================================================

export async function crearConsulta(datos){
  // datos debe incluir paciente_id y medico_id como mínimo
  const { data, error } = await supabase.from('consultas').insert(datos).select().single();
  if(error) throw error;
  return data;
}

export async function actualizarConsulta(id, cambios, usuarioId){
  const { data, error } = await supabase.from('consultas')
    .update({ ...cambios, modificado_en:new Date().toISOString(), modificado_por:usuarioId })
    .eq('id', id).select().single();
  if(error) throw error;
  return data;
}

export async function cerrarConsulta(id){
  const { data, error } = await supabase.from('consultas').update({ cerrada:true }).eq('id', id).select().single();
  if(error) throw error;
  return data;
}

export async function listarConsultasDePaciente(pacienteId){
  const { data, error } = await supabase.from('consultas')
    .select('*').eq('paciente_id', pacienteId).order('fecha_hora', {ascending:false});
  if(error) throw error;
  return data;
}

// ============================================================================
// COBROS
// ============================================================================

export async function registrarCobro(datos){
  // datos = { paciente_id, consulta_id, tipo_cobro, valor, forma_pago, estado, registrado_por }
  const { data, error } = await supabase.from('cobros').insert(datos).select().single();
  if(error) throw error;

  // el cobro también se refleja como ingreso en contabilidad
  await supabase.from('movimientos_contables').insert({
    concepto: datos.tipo_cobro,
    categoria: 'Consultas',
    tipo: 'ingreso',
    monto: datos.valor,
    fecha: new Date().toISOString().slice(0,10),
    origen_cobro_id: data.id
  });
  return data;
}

export async function cobrosDelDia(fecha){
  const { data, error } = await supabase.from('cobros')
    .select('*')
    .gte('fecha_hora', `${fecha}T00:00:00`)
    .lte('fecha_hora', `${fecha}T23:59:59`);
  if(error) throw error;
  return data;
}

// ============================================================================
// CATÁLOGOS (CIE-10/11 y medicamentos) — importación masiva
// ============================================================================

export async function importarCatalogoCie(filas){
  // filas = [{codigo, nombre}, ...]
  const { error } = await supabase.from('catalogo_cie').upsert(filas, { onConflict:'codigo' });
  if(error) throw error;
}

export async function buscarCie(texto){
  const { data, error } = await supabase.from('catalogo_cie')
    .select('*').ilike('nombre', `%${texto}%`).limit(15);
  if(error) throw error;
  return data;
}

export async function importarCatalogoMedicamentos(filas){
  // filas = [{nombre, presentacion}, ...]
  const { error } = await supabase.from('catalogo_medicamentos').insert(filas);
  if(error) throw error;
}

export async function buscarMedicamentos(texto){
  const { data, error } = await supabase.from('catalogo_medicamentos')
    .select('*').ilike('nombre', `%${texto}%`).limit(15);
  if(error) throw error;
  return data;
}

// ============================================================================
// USUARIOS (login real)
// ============================================================================

export async function iniciarSesion(correo, password){
  const { data, error } = await supabase.auth.signInWithPassword({ email:correo, password });
  if(error) throw error;
  return data;
}

export async function cerrarSesion(){
  await supabase.auth.signOut();
}

export async function usuarioActual(){
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

// ============================================================================
// BITÁCORA — llama esto después de cualquier acción importante
// ============================================================================

export async function registrarBitacora(usuarioId, accion, entidad, entidadId, detalle){
  await supabase.from('bitacora').insert({ usuario_id:usuarioId, accion, entidad, entidad_id:entidadId, detalle });
}
