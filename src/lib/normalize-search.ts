/** Case- and accent-insensitive search text: "Đầu phun" and "dau phun" compare equal. Shared by the server-side
 * catalogue filter and the client-side search suggestions, so both find the same products. */
export function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}
