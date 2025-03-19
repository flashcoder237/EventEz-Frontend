// src/lib/utils/imageUtils.ts
export function cleanImageUrl(url: string | null | undefined): string {
    if (!url) return '/placeholder-image.png'; // Image de secours
  
    // Supprime les préfixes en double
    const cleanedUrl = url
      .replace(/^https?:\/\/[^/]+\/media\//, '/media/')
      .replace(/^\/media\/http:\/\/[^/]+\/media\//, '/media/');
  
    // Vérifie si l'URL est absolue et commence par http
    if (cleanedUrl.startsWith('http')) {
      return cleanedUrl;
    }
  
    // Construit l'URL complète si nécessaire
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${cleanedUrl}`;
  }
  
  export function getImageUrl(path: string | null | undefined): string {
    if (!path) return '/placeholder-image.png';
    
    return cleanImageUrl(path);
  }