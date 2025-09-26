export function usePagination(pageNum: number, totalPages: number, maxVisible = 5) {
  const pages = [];
  const start = Math.max(1, pageNum - 2);
  const end = Math.min(totalPages, start + maxVisible - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
