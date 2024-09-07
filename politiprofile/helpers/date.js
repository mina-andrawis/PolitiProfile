import { parseISO, format } from 'date-fns';

export default function Date({ dateString }) {
  try {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, 'MMMM d, yyyy')}</time>;
  } catch (error) {
    console.error("Error parsing date:", error);
    return <span>Invalid Date</span>;  // Fallback for invalid date formats
  }
}