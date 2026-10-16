// Función para validar RUT Chileno (Algoritmo Módulo 11)
export const validateRut = (rut) => {
  const cleanRut = rut.replace(/\./g, ""); 
  if (!/^[0-9]+-[0-9kK]{1}$/.test(cleanRut)) return false;
  
  const [numero, dv] = cleanRut.split("-");
  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += numero[i] * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalc = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvCalc.toUpperCase() === dv.toUpperCase();
};

// Función para validar Email
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Función para formatear Rut
export const formatRut = (value) => {
  // 1. Limpiar todo lo que no sea número o K
  let clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  
  if (clean.length <= 1) return clean;

  // 2. Extraer el dígito verificador (último carácter) y el cuerpo
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);

  // 3. Formatear el cuerpo con puntos
  const formattedBody = body
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // 4. Unir con el guion
  return `${formattedBody}-${dv}`;
};

export const getNowLocalDateTime = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const toDateTimeLocal = (date) => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const addDaysToLocalDateTime = (dateTimeString, days) => {
  const date = new Date(dateTimeString);
  date.setDate(date.getDate() + days);
  return toDateTimeLocal(date);
};