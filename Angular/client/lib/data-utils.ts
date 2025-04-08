/**
 * Formats a rating value from 0-50 scale to a 0-5 scale with one decimal place
 * @param rating Rating value from 0-50
 * @returns Formatted rating string (e.g. "4.5")
 */
export function formatRating(rating: number): string {
  const ratingOutOf5 = rating / 10;
  return ratingOutOf5.toFixed(1);
}
