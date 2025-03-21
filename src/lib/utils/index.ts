import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Exporter les fonctions des autres modules d'utilitaires
export * from './dateUtils';

/**
 * Utilitaire pour combiner des classes conditionnelles avec Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en devise
 * @param amount - Le montant à formater
 * @param currency - La devise (par défaut 'XAF')
 * @returns Le montant formaté avec le symbole de devise
 */
export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  if (amount === undefined || amount === null) return '0 ' + currency;
  
  // Formater avec les séparateurs de milliers
  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount) + ' ' + currency;
}

/**
 * Tronque un texte s'il dépasse une certaine longueur
 * @param text - Le texte à tronquer
 * @param maxLength - La longueur maximale (par défaut 100)
 * @returns Le texte tronqué avec '...' si nécessaire
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Génère un slug à partir d'un texte
 * @param text - Le texte à transformer en slug
 * @returns Le slug généré
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}