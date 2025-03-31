// src/lib/services/paymentVerificationService.ts
/**
 * Service pour la vérification des paiements
 * Ce service permet de vérifier périodiquement le statut d'un paiement
 */

export class PaymentVerificationService {
    private intervalId: NodeJS.Timeout | null = null;
    private checkCount: number = 0;
    private maxChecks: number = 30; // Maximum 30 vérifications (5 minutes à 10s d'intervalle)
    
    /**
     * Démarrer la vérification du statut d'un paiement
     * @param paymentId Identifiant du paiement à vérifier
     * @param checkInterval Intervalle entre les vérifications (en ms)
     * @param onCheck Callback appelé à chaque vérification
     * @param onSuccess Callback appelé en cas de succès
     * @param onFailure Callback appelé en cas d'échec
     * @param onTimeout Callback appelé en cas de timeout
     */
    startVerification(
      paymentId: string,
      checkInterval: number = 10000,
      onCheck: () => void,
      onSuccess: () => void,
      onFailure: (error: any) => void,
      onTimeout: () => void
    ) {
      // Réinitialiser les compteurs
      this.checkCount = 0;
      
      // Arrêter toute vérification en cours
      this.stopVerification();
      
      // Démarrer les vérifications périodiques
      this.intervalId = setInterval(async () => {
        try {
          this.checkCount++;
          
          // Notifier de la vérification en cours
          onCheck();
          
          // Faire la requête pour vérifier le statut
          const response = await fetch(`/api/payments/process?id=${paymentId}`);
          const data = await response.json();
          
          console.log('Vérification du paiement:', data);
          
          // Analyser la réponse
          if (data.success) {
            if (data.data.status === 'completed') {
              // Paiement réussi
              this.stopVerification();
              onSuccess();
            } else if (data.data.status === 'failed') {
              // Paiement échoué
              this.stopVerification();
              onFailure(new Error(data.data.message || 'Paiement échoué'));
            } else if (this.checkCount >= this.maxChecks) {
              // Timeout après un certain nombre de vérifications
              this.stopVerification();
              onTimeout();
            }
          } else {
            // Erreur lors de la vérification
            console.error('Erreur lors de la vérification du paiement:', data.error);
            
            if (this.checkCount >= this.maxChecks) {
              this.stopVerification();
              onTimeout();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du paiement:', error);
          
          if (this.checkCount >= this.maxChecks) {
            this.stopVerification();
            onTimeout();
          }
        }
      }, checkInterval);
    }
    
    /**
     * Arrêter la vérification du statut d'un paiement
     */
    stopVerification() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    
    /**
     * Vérifier manuellement le statut d'un paiement
     * @param paymentId Identifiant du paiement à vérifier
     */
    async checkPaymentStatus(paymentId: string) {
      try {
        const response = await fetch(`/api/payments/process?id=${paymentId}`);
        const data = await response.json();
        
        return data;
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
        throw error;
      }
    }
  }
  
  // Exporter une instance unique du service
  export const paymentVerificationService = new PaymentVerificationService();