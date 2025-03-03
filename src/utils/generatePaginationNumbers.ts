export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // If totalPages are 7 or less then we will show all the pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // If the current page is between the 3 first pages, show the 3 first pages and the last 2 pages
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  //   If the current page is between the last 3 pages, show the first 2 pages and the 3 last pages
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  //   If the current page is in other page in the middle, show the first page, 3 dots, the current page and neighboring pages
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
