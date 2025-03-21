/**
 * Formate une chaîne de date en format plus lisible
 * @param dateString - La chaîne de date à formater
 * @param format - Format optionnel (par défaut 'readable')
 * @returns Chaîne de date formatée
 */
export function formatDate(dateString: string, format: 'readable' | 'short' | 'long' | 'yyyy-MM-dd' | 'HH:mm' = 'readable'): string {
  // Gérer les entrées invalides
  if (!dateString) return 'Date invalide';
  
  const date = new Date(dateString);
  
  // Gérer les dates invalides
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  // Formats personnalisés
  if (format === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  }
  
  if (format === 'HH:mm') {
    return date.toTimeString().slice(0, 5);
  }

  // Localisation en français
  const options: Intl.DateTimeFormatOptions = {
    'readable': { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    },
    'short': { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    },
    'long': { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
  }[format] || { day: 'numeric', month: 'long', year: 'numeric' };

  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

/**
* Vérifie si une date est dans le futur
* @param dateString - La date à vérifier
* @returns true si la date est dans le futur, false sinon
*/
export function isDateInFuture(dateString: string): boolean {
const date = new Date(dateString);
const now = new Date();
return date > now;
}

/**
* Calcule les jours restants jusqu'à une date
* @param dateString - La date cible
* @returns Nombre de jours restants
*/
export function getDaysUntil(dateString: string): number {
const targetDate = new Date(dateString);
const now = new Date();

// Réinitialiser l'heure pour une comparaison précise des jours
now.setHours(0, 0, 0, 0);
targetDate.setHours(0, 0, 0, 0);

const timeDiff = targetDate.getTime() - now.getTime();
const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

return daysDiff > 0 ? daysDiff : 0;
}