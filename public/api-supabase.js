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
