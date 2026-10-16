export function isValidEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function cleanRut(rut) {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .trim()
    .toUpperCase();
}

export function formatRut(rut) {
  const cleaned = cleanRut(rut);

  if (cleaned.length < 2) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let formattedBody = "";
  let i = body.length;
  let count = 0;

  while (i > 0) {
    formattedBody = body.charAt(i - 1) + formattedBody;
    count++;
    if (count === 3 && i > 1) {
      formattedBody = "." + formattedBody;
      count = 0;
    }
    i--;
  }

  return `${formattedBody}-${dv}`;
}

export function isValidRut(rut) {
  const cleaned = cleanRut(rut);

  if (!/^\d{7,8}[0-9K]$/.test(cleaned)) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);

  let expectedDv = "";
  if (remainder === 11) expectedDv = "0";
  else if (remainder === 10) expectedDv = "K";
  else expectedDv = String(remainder);

  return dv === expectedDv;
}