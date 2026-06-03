export function formatPrice(value) {
  return Number(value || 0).toFixed(2);
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

export function capitalize(text = "") {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}