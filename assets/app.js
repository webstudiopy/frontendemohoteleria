/* ==========================================================================
   Hotelería — Datos simulados y lógica compartida (demo frontend)
   ========================================================================== */

// Tasas de cambio de referencia (base: Guaraní)
const FX = {
  PYG: 1,
  USD: 7300,   // 1 USD = 7300 Gs (aprox.)
  BRL: 1350    // 1 BRL = 1350 Gs (aprox.)
};
const CUR_SYMBOL = { PYG: 'Gs', USD: 'US$', BRL: 'R$' };

function formatMoney(amountInPYG, currency){
  const val = amountInPYG / FX[currency];
  const decimals = currency === 'PYG' ? 0 : 2;
  const formatted = val.toLocaleString('es-PY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${CUR_SYMBOL[currency]} ${formatted}`;
}

function getCurrentCurrency(){
  return localStorage.getItem('hoteleria_currency') || 'PYG';
}
function setCurrentCurrency(cur){
  localStorage.setItem('hoteleria_currency', cur);
}

// ---------------------------------------------------------------------------
// Sucursales — cada una con su propia numeración de habitaciones y datos
// ---------------------------------------------------------------------------
const SUCURSALES = {
  centro: {
    id: 'centro',
    nombre: 'Hotelería · Sucursal Centro',
    corto: 'Sucursal Centro',
    direccion: 'Palma c/ 14 de Mayo, Asunción',
    pisos: 3,
    prefijoHabitacion: 1, // habitaciones 101-130
    totalHabitaciones: 30,
    ocupacionHoy: 0.78,
    tiposHabitacion: [
      { tipo:'Individual', precioPYG: 320000 },
      { tipo:'Doble',      precioPYG: 450000 },
      { tipo:'Suite',      precioPYG: 780000 },
    ]
  },
  este: {
    id: 'este',
    nombre: 'Hotelería · Sucursal Ciudad del Este',
    corto: 'Sucursal Ciudad del Este',
    direccion: 'Av. San Blas c/ Curupayty, Ciudad del Este',
    pisos: 2,
    prefijoHabitacion: 2, // habitaciones 201-222
    totalHabitaciones: 22,
    ocupacionHoy: 0.64,
    tiposHabitacion: [
      { tipo:'Individual', precioPYG: 290000 },
      { tipo:'Doble',      precioPYG: 410000 },
      { tipo:'Suite',      precioPYG: 690000 },
    ]
  }
};

function getSucursalActual(){
  const id = localStorage.getItem('hoteleria_sucursal') || 'centro';
  return SUCURSALES[id];
}
function setSucursalActual(id){
  localStorage.setItem('hoteleria_sucursal', id);
}

// ---------------------------------------------------------------------------
// Generación determinística de habitaciones por sucursal
// ---------------------------------------------------------------------------
function generarHabitaciones(sucursal){
  const estados = ['disponible','disponible','disponible','ocupada','ocupada','limpieza','mantenimiento'];
  const nombres = ['García','Benítez','Rodríguez','Fernández','Silva','Duarte','Martínez','Ortiz','Souza','Cáceres'];
  const habitaciones = [];
  const porPiso = Math.ceil(sucursal.totalHabitaciones / sucursal.pisos);

  for(let i=0; i<sucursal.totalHabitaciones; i++){
    const piso = Math.floor(i / porPiso) + 1;
    const numeroPiso = (i % porPiso) + 1;
    const numero = `${sucursal.prefijoHabitacion}${piso}${String(numeroPiso).padStart(2,'0')}`;
    const seed = (numero.charCodeAt(0) + i * 7 + sucursal.prefijoHabitacion * 13) % estados.length;
    const estado = estados[seed];
    const tipoIdx = i % sucursal.tiposHabitacion.length;
    const tipo = sucursal.tiposHabitacion[tipoIdx];
    habitaciones.push({
      numero,
      piso,
      tipo: tipo.tipo,
      precioPYG: tipo.precioPYG,
      estado,
      huesped: estado === 'ocupada' ? nombres[(i*3+sucursal.prefijoHabitacion) % nombres.length] : null
    });
  }
  return habitaciones;
}

// ---------------------------------------------------------------------------
// Reservas simuladas por sucursal
// ---------------------------------------------------------------------------
function generarReservas(sucursal){
  const habitaciones = generarHabitaciones(sucursal);
  const huespedes = ['Laura Benítez','Marcos Silva','Ana Fernández','Diego Ortiz','Julia Souza','Pedro Duarte','Camila Ríos','Hugo Martínez','Rosa Cáceres','Iván Gómez'];
  const estados = ['confirmada','confirmada','pendiente','confirmada','cancelada'];
  const reservas = [];
  const base = new Date();

  for(let i=0;i<12;i++){
    const hab = habitaciones[(i*3 + sucursal.prefijoHabitacion) % habitaciones.length];
    const checkin = new Date(base); checkin.setDate(base.getDate() + (i - 3));
    const noches = 1 + (i % 4);
    const checkout = new Date(checkin); checkout.setDate(checkin.getDate() + noches);
    reservas.push({
      id: `RES-${sucursal.prefijoHabitacion}${String(1000+i)}`,
      huesped: huespedes[(i + sucursal.prefijoHabitacion) % huespedes.length],
      habitacion: hab.numero,
      tipo: hab.tipo,
      checkin: checkin.toISOString().slice(0,10),
      checkout: checkout.toISOString().slice(0,10),
      noches,
      totalPYG: hab.precioPYG * noches,
      estado: estados[i % estados.length]
    });
  }
  return reservas;
}

// ---------------------------------------------------------------------------
// Huéspedes simulados por sucursal
// ---------------------------------------------------------------------------
function generarHuespedes(sucursal){
  const nombres = ['Laura Benítez','Marcos Silva','Ana Fernández','Diego Ortiz','Julia Souza','Pedro Duarte','Camila Ríos','Hugo Martínez','Rosa Cáceres','Iván Gómez','Nadia López','Sergio Aquino'];
  const paises = ['Paraguay','Brasil','Argentina','Paraguay','Uruguay','Paraguay','Brasil','Paraguay','Chile','Paraguay','Brasil','Paraguay'];
  const docs = ['CI','CPF','DNI','CI','CI','CI','CPF','CI','RUT','CI','CPF','CI'];
  return nombres.map((n,i)=>({
    id: `H-${sucursal.prefijoHabitacion}${String(200+i)}`,
    nombre: n,
    documento: `${docs[i]} ${1000000 + i*97531 + sucursal.prefijoHabitacion*1000}`,
    pais: paises[i],
    email: n.toLowerCase().replace(/\s+/g,'.').replace(/[áéíóúñ]/g, c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u',ñ:'n'}[c])) + '@correo.com',
    telefono: `+595 9${(70+i)}${String(100000+i*333).slice(0,6)}`,
    estadias: 1 + (i % 5),
    ultimaVisita: `2026-0${1 + (i % 7)}-1${i % 9}`
  }));
}

// ---------------------------------------------------------------------------
// Facturas simuladas
// ---------------------------------------------------------------------------
function generarFacturas(sucursal){
  const reservas = generarReservas(sucursal).filter(r => r.estado !== 'cancelada');
  return reservas.map((r,i)=>({
    id: `FC-${sucursal.prefijoHabitacion}${String(5000+i)}`,
    huesped: r.huesped,
    habitacion: r.habitacion,
    fecha: r.checkout,
    concepto: `Hospedaje ${r.tipo} · ${r.noches} noche(s)`,
    subtotalPYG: r.totalPYG,
    impuestoPYG: Math.round(r.totalPYG * 0.10),
    totalPYG: Math.round(r.totalPYG * 1.10),
    metodo: ['Efectivo','Tarjeta','Transferencia'][i % 3],
    estado: i % 5 === 0 ? 'pendiente' : 'pagada'
  }));
}

// ---------------------------------------------------------------------------
// Autenticación simulada
// ---------------------------------------------------------------------------
function requireAuth(){
  const logged = localStorage.getItem('hoteleria_auth');
  if(!logged){
    window.location.href = 'index.html';
  }
}
function logout(){
  localStorage.removeItem('hoteleria_auth');
  window.location.href = 'index.html';
}

// ---------------------------------------------------------------------------
// Helpers de UI compartidos
// ---------------------------------------------------------------------------
function initTopbarUser(){
  const auth = JSON.parse(localStorage.getItem('hoteleria_auth') || '{}');
  const nameEl = document.querySelector('[data-user-name]');
  const roleEl = document.querySelector('[data-user-role]');
  const avatarEl = document.querySelector('[data-user-avatar]');
  if(nameEl) nameEl.textContent = auth.nombre || 'Usuario';
  if(roleEl) roleEl.textContent = auth.rol || 'Recepción';
  if(avatarEl) avatarEl.textContent = (auth.nombre || 'US').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

function initSucursalPill(){
  const suc = getSucursalActual();
  const pillTxt = document.querySelector('[data-sucursal-pill]');
  if(pillTxt) pillTxt.innerHTML = `<b>${suc.corto}</b><small>${suc.direccion}</small>`;
}

function initCurrencyToggle(){
  const buttons = document.querySelectorAll('[data-currency]');
  const current = getCurrentCurrency();
  buttons.forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.currency === current);
    btn.addEventListener('click', ()=>{
      setCurrentCurrency(btn.dataset.currency);
      window.dispatchEvent(new CustomEvent('currencychange'));
      buttons.forEach(b=>b.classList.toggle('active', b === btn));
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTopbarUser();
  initSucursalPill();
  initCurrencyToggle();
});
