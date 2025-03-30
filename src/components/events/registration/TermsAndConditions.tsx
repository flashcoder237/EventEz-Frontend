// src/components/events/registration/TermsAndConditions.jsx
import { Info } from 'lucide-react';

const TermsAndConditions = ({ finalTotal }) => {
  return (
    <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            En cliquant sur "Continuer", vous acceptez nos conditions générales et notre politique de confidentialité.
            {finalTotal > 0 && " Vous serez redirigé vers l'écran de paiement pour finaliser votre achat."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;