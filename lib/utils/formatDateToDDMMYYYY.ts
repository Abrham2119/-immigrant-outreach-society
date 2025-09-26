export function formatDateToDDMMYYYY(isoDate: string): string {
  if (!isoDate || isoDate === "N/A") return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return "N/A";
  }
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}
export function formatDateToDDMMYYYYHHMM(dateString?: string | null): string {
  if (!dateString) return "N/A"; 
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A"; 
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
}

