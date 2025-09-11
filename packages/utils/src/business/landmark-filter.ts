/**
 * Utility to filter out monuments, landmarks, and non-contactable places
 * Used both in the sitemap generation and Google Places import
 */

export const EXCLUDED_LANDMARK_KEYWORDS = [
  // Monuments and statues
  'monumento', 'monument', 'estatua', 'statue',
  
  // Public spaces and plazas  
  'plaza', 'parque', 'park', 'malecon', 'camellon',
  
  // Religious and historical sites
  'museo', 'museum', 'catedral', 'cathedral', 'iglesia', 'church', 
  'basilica', 'convento', 'convent', 'castillo', 'castle', 
  'fortaleza', 'fort', 'murallas', 'walls', 'torre', 'tower',
  'puerta', 'gate', 'cementerio',
  
  // Geographic features
  'bahia', 'bay', 'muelle', 'puerto', 'port',
  
  // Specific Cartagena landmarks (monuments/plazas that aren't businesses)
  'getsemani', 'getsemaní', 'alcatraces', 'pegasos', 'aduana', 
  'india catalina', 'bolivar', 'bolívar', 'santo domingo',
  'los coches', 'san pedro claver', 'santa cruz', 'popa', 
  'oro zenu', 'zenú', 'martires', 'mártires', 'oceanos', 
  'océanos', 'union', 'unión', 'reloj', 'barajas'
];

/**
 * Check if a business/place should be filtered out as a non-contactable landmark
 * @param name - Business or place name
 * @param description - Business description (optional)
 * @param address - Business address (optional)
 * @returns true if this should be filtered out (is a landmark/monument)
 */
export function isLandmarkToFilter(
  name: string, 
  description?: string | null, 
  address?: string | null
): boolean {
  const nameText = name.toLowerCase();
  const descText = (description || '').toLowerCase();
  const addressText = (address || '').toLowerCase();
  
  return EXCLUDED_LANDMARK_KEYWORDS.some(keyword => 
    nameText.includes(keyword) || 
    descText.includes(keyword) || 
    addressText.includes(keyword)
  );
}

/**
 * Filter an array of businesses to remove landmarks/monuments
 * @param businesses - Array of business objects with name, description, address
 * @returns Filtered array without landmarks
 */
export function filterLandmarks<T extends { name: string; description?: string | null; address?: string | null }>(
  businesses: T[]
): T[] {
  return businesses.filter(business => 
    !isLandmarkToFilter(business.name, business.description, business.address)
  );
}

/**
 * Get excluded keywords for debugging/logging purposes
 */
export function getExcludedKeywords(): string[] {
  return [...EXCLUDED_LANDMARK_KEYWORDS];
}