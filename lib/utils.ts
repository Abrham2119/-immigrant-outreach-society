
export function formatDate(dateInput: Date | string | number): string {
  try {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      console.warn('Invalid date input provided to formatDate:', dateInput);
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
} 