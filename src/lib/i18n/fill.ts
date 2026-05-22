/** Substitui `{{chave}}` em strings do dicionário */
export function fill(
  template: string,
  vars: Record<string, string | number>
): string {
  let out = template
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, String(v))
  }
  return out
}
