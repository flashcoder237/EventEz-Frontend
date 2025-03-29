// src/context/TicketSelectionContext.tsx
// Note: Vous devrez ajouter ce contexte à votre fichier layout.tsx ou providers.tsx pour le rendre disponible
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TicketInfo {
  ticketId: string;
  quantity: number;
  price: number;
  name: string;
}

interface TicketSelectionContextType {
  selectedTickets: Record<string, TicketInfo>;
  updateTicketSelection: (ticketId: string, quantity: number, price: number, name: string) => void;
  totalSelectedTickets: number;
  totalPrice: number;
  clearSelection: () => void;
}

const defaultContext: TicketSelectionContextType = {
  selectedTickets: {},
  updateTicketSelection: () => {},
  totalSelectedTickets: 0,
  totalPrice: 0,
  clearSelection: () => {}
};

const TicketSelectionContext = createContext<TicketSelectionContextType>(defaultContext);

export function useTicketSelection() {
  return useContext(TicketSelectionContext);
}

interface ProviderProps {
  children: ReactNode;
}

export function TicketSelectionProvider({ children }: ProviderProps) {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, TicketInfo>>({});
  const [totalSelectedTickets, setTotalSelectedTickets] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Mise à jour de la sélection de tickets
  const updateTicketSelection = (ticketId: string, quantity: number, price: number, name: string) => {
    setSelectedTickets(prev => {
      // Si quantité est 0, supprimer le ticket
      if (quantity <= 0) {
        const newSelection = { ...prev };
        delete newSelection[ticketId];
        return newSelection;
      }
      
      // Sinon, ajouter ou mettre à jour le ticket
      return {
        ...prev,
        [ticketId]: {
          ticketId,
          quantity,
          price,
          name
        }
      };
    });
  };

  // Réinitialiser la sélection
  const clearSelection = () => {
    setSelectedTickets({});
  };

  // Recalculer les totaux lorsque la sélection change
  useEffect(() => {
    const ticketCount = Object.values(selectedTickets).reduce(
      (sum, ticket) => sum + ticket.quantity, 
      0
    );
    
    const priceTotal = Object.values(selectedTickets).reduce(
      (sum, ticket) => sum + (ticket.price * ticket.quantity), 
      0
    );
    
    setTotalSelectedTickets(ticketCount);
    setTotalPrice(priceTotal);
  }, [selectedTickets]);

  // Restaurer la sélection depuis le stockage local au chargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelection = localStorage.getItem('eventTicketSelection');
      if (savedSelection) {
        try {
          const parsedSelection = JSON.parse(savedSelection);
          setSelectedTickets(parsedSelection);
        } catch (error) {
          console.error('Erreur lors de la restauration de la sélection de tickets:', error);
          localStorage.removeItem('eventTicketSelection');
        }
      }
    }
  }, []);

  // Sauvegarder la sélection dans le stockage local
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventTicketSelection', JSON.stringify(selectedTickets));
    }
  }, [selectedTickets]);

  const contextValue = {
    selectedTickets,
    updateTicketSelection,
    totalSelectedTickets,
    totalPrice,
    clearSelection
  };

  return (
    <TicketSelectionContext.Provider value={contextValue}>
      {children}
    </TicketSelectionContext.Provider>
  );
}