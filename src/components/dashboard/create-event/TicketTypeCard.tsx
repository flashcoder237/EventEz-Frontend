import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { FaTrashAlt } from 'react-icons/fa';

interface TicketTypeCardProps {
  ticket: any;
  index: number;
  updateTicketType: (index: number, field: string, value: any) => void;
  removeTicketType: (index: number) => void;
}

export default function TicketTypeCard({
  ticket,
  index,
  updateTicketType,
  removeTicketType
}: TicketTypeCardProps) {
  return (
    <motion.div 
      className="border border-gray-200 rounded-lg p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {/* Décoration visuelle */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -ml-20 -mb-20"></div>
      </div>
      
      <div className="flex justify-between items-center mb-4 relative">
        <h4 className="font-medium text-lg">Type de billet #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeTicketType(index)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <FaTrashAlt className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <Input
          label="Nom du billet *"
          value={ticket.name}
          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
          placeholder="Ex: Standard, VIP, Early Bird, etc."
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            label="Prix (XAF) *"
            value={ticket.price}
            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
            min={0}
            required
          />
          
          <Input
            type="number"
            label="Quantité totale *"
            value={ticket.quantity_total}
            onChange={(e) => updateTicketType(index, 'quantity_total', parseInt(e.target.value))}
            min={1}
            required
          />
        </div>
        
        <Textarea
          label="Description"
          value={ticket.description}
          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
          placeholder="Décrivez ce type de billet et ses avantages"
        />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Min. par commande"
              value={ticket.min_per_order}
              onChange={(e) => updateTicketType(index, 'min_per_order', parseInt(e.target.value))}
              min={1}
            />
            
            <Input
              type="number"
              label="Max. par commande"
              value={ticket.max_per_order}
              onChange={(e) => updateTicketType(index, 'max_per_order', parseInt(e.target.value))}
              min={1}
            />
          </div>
          
          <div className="flex items-center mt-4">
            <label className="flex items-center cursor-pointer">
              <Switch
                checked={ticket.is_visible}
                onCheckedChange={(checked) => 
                  updateTicketType(index, 'is_visible', checked)
                }
              />
              <span className="ml-2">Visible sur la page de l'événement</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <h5 className="font-medium mb-3">Période de vente</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Date de début"
              value={ticket.sales_start_date}
              onChange={(e) => updateTicketType(index, 'sales_start_date', e.target.value)}
            />
            
            <Input
              type="time"
              label="Heure de début"
              value={ticket.sales_start_time}
              onChange={(e) => updateTicketType(index, 'sales_start_time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Date de fin"
              value={ticket.sales_end_date}
              onChange={(e) => updateTicketType(index, 'sales_end_date', e.target.value)}
            />
            
            <Input
              type="time"
              label="Heure de fin"
              value={ticket.sales_end_time}
              onChange={(e) => updateTicketType(index, 'sales_end_time', e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}