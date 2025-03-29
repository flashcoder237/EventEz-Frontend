import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

interface EventLocationTimeFormProps {
  eventData: any;
  setEventData: React.Dispatch<React.SetStateAction<any>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function EventLocationTimeForm({
  eventData,
  setEventData,
  goToNextStep,
  goToPreviousStep
}: EventLocationTimeFormProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-xl font-semibold flex items-center"
        variants={itemVariants}
      >
        <FaMapMarkerAlt className="mr-2 text-primary" />
        Lieu et horaires
      </motion.h2>
      
      <div className="space-y-8">
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            Date et heure
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de début *"
                type="date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Heure de début *"
                type="time"
                name="start_time"
                value={eventData.start_time}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de fin *"
                type="date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Heure de fin *"
                type="time"
                name="end_time"
                value={eventData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <motion.h4 
              className="text-sm font-medium mb-2"
              variants={itemVariants}
            >
              Date limite d'inscription
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date limite"
                  type="date"
                  name="registration_deadline_date"
                  value={eventData.registration_deadline_date}
                  onChange={handleChange}
                />
                
                <Input
                  label="Heure limite"
                  type="time"
                  name="registration_deadline_time"
                  value={eventData.registration_deadline_time}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center">
                <p className="text-sm text-gray-500 italic">
                  Si non spécifié, les inscriptions seront possibles jusqu'au début de l'événement
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-green-500" />
            Lieu
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nom du lieu *"
              name="location_name"
              value={eventData.location_name}
              onChange={handleChange}
              placeholder="Ex: Palais des Congrès, Stade Ahmadou Ahidjo, etc."
              required
            />
            
            <Textarea
              label="Adresse *"
              name="location_address"
              value={eventData.location_address}
              onChange={handleChange}
              placeholder="Adresse complète du lieu"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ville *"
                name="location_city"
                value={eventData.location_city}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Pays *"
                name="location_country"
                value={eventData.location_country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex justify-between"
        variants={itemVariants}
      >
        <Button 
          type="button" 
          variant="outline" 
          onClick={goToPreviousStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Étape précédente
        </Button>
        <Button 
          type="button" 
          onClick={goToNextStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Étape suivante
        </Button>
      </motion.div>
    </motion.div>
  );
}