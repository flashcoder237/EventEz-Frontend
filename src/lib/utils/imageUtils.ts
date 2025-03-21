/**
 * Nettoie et normalise une URL d'image
 * @param url - L'URL à nettoyer
 * @returns L'URL nettoyée ou une image par défaut si l'URL est invalide
 */
export function cleanImageUrl(url: string | null | undefined): string {
  // Image par défaut si aucune URL n'est fournie
  if (!url) return '/images/placeholder-image.png'; 
  
  try {
    // Si l'URL est déjà une URL complète, la retourner telle quelle
    if (url.match(/^https?:\/\//i)) {
      return url;
    }
    
    // Si l'URL est un chemin relatif commençant par /media/
    if (url.startsWith('/media/')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      return `${baseUrl}${url}`;
    }
    
    // Pour les autres chemins relatifs
    if (url.startsWith('/')) {
      return url;
    }
    
    // Si aucune des conditions ci-dessus n'est satisfaite, ajouter le préfixe de l'API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/${url}`;
  } catch (error) {
    console.error('Erreur lors du nettoyage de l\'URL de l\'image:', error);
    return '/images/placeholder-image.png';
  }
}

/**
 * Obtient l'URL complète d'une image à partir d'un chemin
 * @param path - Le chemin de l'image
 * @returns L'URL complète de l'image
 */
export function getImageUrl(path: string | null | undefined): string {
  return cleanImageUrl(path);
}