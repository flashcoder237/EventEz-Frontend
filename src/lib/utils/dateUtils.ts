// lib/utils/date-utils.ts

/**
 * Format a date to a localized French string
 * @param date Date or date string to format
 * @param options Intl.DateTimeFormatOptions to customize formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string, 
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Date(date).toLocaleDateString('fr-FR', mergedOptions);
}

/**
 * Calculate the number of days until a given date
 * @param targetDate The date to calculate days until
 * @returns Number of days until the target date
 */
export function getDaysUntil(targetDate: Date | string): number {
  const today = new Date();
  const target = new Date(targetDate);
  
  // Calculate the difference in milliseconds
  const diffMs = target.getTime() - today.getTime();
  
  // Convert milliseconds to days
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Calculate the duration between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Human-readable duration string
 */
export function calculateEventDuration(
  startDate: Date | string, 
  endDate: Date | string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0 && diffHours > 0) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''} et ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays > 0) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }
  
  return 'Moins d\'une heure';
}

/**
 * Check if an event is upcoming, ongoing, or past
 * @param startDate Event start date
 * @param endDate Event end date
 * @returns 'upcoming' | 'ongoing' | 'past'
 */
export function getEventStatus(
  startDate: Date | string, 
  endDate: Date | string
): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

/**
 * Format price with FCFA currency
 * @param price Number to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()} FCFA`;
}

/**
 * Generate a readable time range for an event
 * @param startDate Start date of the event
 * @param endDate End date of the event
 * @returns Formatted time range string
 */
export function formatEventTimeRange(
  startDate: Date | string, 
  endDate: Date | string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormat = start.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const endFormat = end.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${startFormat} - ${endFormat}`;
}