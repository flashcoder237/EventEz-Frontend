'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // TODO: Remplacer par votre logique d'envoi de formulaire
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-purple-100">
            Nous sommes là pour répondre à toutes vos questions et vous aider
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                required
              />
              <Input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre adresse email"
                required
              />
              <Input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Votre numéro de téléphone (optionnel)"
              />
              <Input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Objet de votre message"
                required
              />
              <Textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Votre message"
                rows={5}
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded">
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Nos coordonnées
            </h2>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 text-purple-600 rounded-full p-3">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">contact@eventez.cm</p>
                  <p className="text-gray-600">support@eventez.cm</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 text-purple-600 rounded-full p-3">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Téléphone</h3>
                  <p className="text-gray-600">+237 670 000 000</p>
                  <p className="text-gray-600">+237 696 000 000</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 text-purple-600 rounded-full p-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Adresse</h3>
                  <p className="text-gray-600">Immeuble Nko'o, Rue des Écoles</p>
                  <p className="text-gray-600">Yaoundé, Cameroun</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Horaires de support
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-gray-700">
                  <span>Lundi - Vendredi</span>
                  <span>8h00 - 18h00</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                  <span>Samedi</span>
                  <span>9h00 - 13h00</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}