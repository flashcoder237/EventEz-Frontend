// src/components/payment/form/index.ts

// Exporter tous les composants depuis ce fichier pour faciliter les imports
export { default as PaymentPage } from './PaymentPage';
export { default as PaymentForm } from './PaymentForm';
export { default as PaymentMethodSelector } from './PaymentMethodSelector';
export { default as CreditCardForm } from './CreditCardForm';
export { default as MobilePaymentForm } from './MobilePaymentForm';
export { default as BankTransferInfo } from './BankTransferInfo';
export { default as OrderSummary } from './OrderSummary';
export { default as PaymentSuccessView } from './PaymentSuccessView';

// Exporter également les utilitaires d'animation
export * from './animationUtils';