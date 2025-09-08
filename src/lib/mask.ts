// Funções utilitárias de máscara para uso em formulários

export function maskCep(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

export function maskPhone(value: string) {
  let v = value.replace(/\D/g, "");
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
  return v.slice(0, 15);
}
