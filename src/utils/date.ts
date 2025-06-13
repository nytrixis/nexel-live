export function formatToIST(utcString: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(utcString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options,
  });
}

// Returns YYYY-MM-DD string for IST "today"
export function getISTDateString(date?: Date) {
  const now = date ? new Date(date) : new Date();
  // Convert to IST by adding 5.5 hours (330 minutes)
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

// Returns ISO string for IST (for filtering, e.g., last 7 days)
export function getISTISOString(date: Date) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString();
}
