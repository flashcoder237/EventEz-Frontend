options={[
    { value: '', label: 'Sélectionnez une catégorie' },
    ...categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }))
  ]}
  required
/>

<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">Tags</label>
  <div className="flex flex-wrap gap-2">
    {tags.map(tag => (
      <button
        key={tag.id}
        type="button"
        onClick={() => handleTagToggle(tag.id)}
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          selectedTags.includes(tag.id)
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {tag.name}
      </button>
    ))}
  </div>
</div>
</div>
</TabsContent>

<TabsContent value="location" className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-6">
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Date et heure</h3>
    <p className="text-sm text-gray-500">
      Définissez quand votre événement aura lieu
    </p>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date de début *"
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      required
    />
    
    <Input
      label="Heure de début *"
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      required
    />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date de fin *"
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      required
    />
    
    <Input
      label="Heure de fin *"
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      required
    />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date limite d'inscription"
      type="date"
      value={registrationDeadlineDate}
      onChange={(e) => setRegistrationDeadlineDate(e.target.value)}
    />
    
    <Input
      label="Heure limite d'inscription"
      type="time"
      value={registrationDeadlineTime}
      onChange={(e) => setRegistrationDeadlineTime(e.target.value)}
    />
  </div>
</div>

<div className="space-y-6">
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Lieu</h3>
    <p className="text-sm text-gray-500">
      Indiquez où votre événement aura lieu
    </p>
  </div>
  
  <Input
    label="Nom du lieu *"
    value={locationName}
    onChange={(e) => setLocationName(e.target.value)}
    placeholder="Ex: Salle de conférence, Stade, etc."
    required
  />
  
  <Input
    label="Adresse *"
    value={locationAddress}
    onChange={(e) => setLocationAddress(e.target.value)}
    placeholder="Ex: 123 Rue Principale"
    required
  />
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Ville *"
      value={locationCity}
      onChange={(e) => setLocationCity(e.target.value)}
      placeholder="Ex: Douala"
      required
    />
    
    <Input
      label="Pays *"
      value={locationCountry}
      onChange={(e) => setLocationCountry(e.target.value)}
      placeholder="Ex: Cameroun"
      required
    />
  </div>
</div>
</div>
</TabsContent>

<TabsContent value="tickets" className="space-y-6">
<div className="space-y-4">
<div className="flex justify-between items-center">
  <div>
    <h3 className="text-lg font-medium">Types de billets</h3>
    <p className="text-sm text-gray-500">
      Définissez les différents types de billets disponibles pour votre événement
    </p>
  </div>
  
  <Button
    type="button"
    onClick={addTicketType}
    variant="outline"
  >
    <FaPlus className="mr-2" />
    Ajouter un type de billet
  </Button>
</div>

{ticketTypes.length === 0 ? (
  <div className="bg-gray-50 p-8 rounded-lg text-center">
    <FaTicketAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
    <h4 className="text-lg font-medium text-gray-900">Aucun type de billet</h4>
    <p className="mt-1 text-sm text-gray-500">
      Commencez par ajouter un type de billet pour votre événement
    </p>
    <Button
      type="button"
      onClick={addTicketType}
      className="mt-4"
    >
      Ajouter un type de billet
    </Button>
  </div>
) : (
  <div className="space-y-4">
    {ticketTypes.map((ticket, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Type de billet #{index + 1}</h4>
          <button
            type="button"
            onClick={() => removeTicketType(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom du billet *"
            value={ticket.name}
            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
            placeholder="Ex: Standard, VIP, Early Bird"
            required
          />
          
          <Input
            label="Prix (XAF) *"
            type="number"
            value={ticket.price}
            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
            min={0}
            required
          />
          
          <Input
            label="Quantité totale *"
            type="number"
            value={ticket.quantity_total}
            onChange={(e) => updateTicketType(index, 'quantity_total', parseInt(e.target.value))}
            min={1}
            required
          />
          
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={ticket.description}
              onChange={(e) => updateTicketType(index, 'description', e.target.value)}
              placeholder="Décrivez ce type de billet"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date de début des ventes"
              type="date"
              value={ticket.sales_start_date}
              onChange={(e) => updateTicketType(index, 'sales_start_date', e.target.value)}
            />
            
            <Input
              label="Heure de début"
              type="time"
              value={ticket.sales_start_time}
              onChange={(e) => updateTicketType(index, 'sales_start_time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date de fin des ventes"
              type="date"
              value={ticket.sales_end_date}
              onChange={(e) => updateTicketType(index, 'sales_end_date', e.target.value)}
            />
            
            <Input
              label="Heure de fin"
              type="time"
              value={ticket.sales_end_time}
              onChange={(e) => updateTicketType(index, 'sales_end_time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min. par commande"
              type="number"
              value={ticket.min_per_order}
              onChange={(e) => updateTicketType(index, 'min_per_order', parseInt(e.target.value))}
              min={1}
            />
            
            <Input
              label="Max. par commande"
              type="number"
              value={ticket.max_per_order}
              onChange={(e) => updateTicketType(index, 'max_per_order', parseInt(e.target.value))}
              min={1}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}
</div>
</TabsContent>

<TabsContent value="form" className="space-y-6">
<div className="space-y-4">
<div className="flex justify-between items-center">
  <div>
    <h3 className="text-lg font-medium">Champs du formulaire d'inscription</h3>
    <p className="text-sm text-gray-500">
      Créez un formulaire personnalisé pour recueillir les informations des participants
    </p>
  </div>
  
  <Button
    type="button"
    onClick={addFormField}
    variant="outline"
  >
    <FaPlus className="mr-2" />
    Ajouter un champ
  </Button>
</div>

{formFields.length === 0 ? (
  <div className="bg-gray-50 p-8 rounded-lg text-center">
    <FaClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
    <h4 className="text-lg font-medium text-gray-900">Aucun champ de formulaire</h4>
    <p className="mt-1 text-sm text-gray-500">
      Commencez par ajouter des champs pour personnaliser votre formulaire d'inscription
    </p>
    <Button
      type="button"
      onClick={addFormField}
      className="mt-4"
    >
      Ajouter un champ
    </Button>
  </div>
) : (
  <div className="space-y-4">
    {formFields.map((field, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Champ #{index + 1}</h4>
          <button
            type="button"
            onClick={() => removeFormField(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Intitulé du champ *"
            value={field.label}
            onChange={(e) => updateFormField(index, 'label', e.target.value)}
            placeholder="Ex: Nom, Email, Téléphone"
            required
          />
          
          <Select
            label="Type de champ *"
            value={field.field_type}
            onChange={(e) => updateFormField(index, 'field_type', e.target.value)}
            options={[
              { value: 'text', label: 'Texte' },
              { value: 'textarea', label: 'Zone de texte' },
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Téléphone' },
              { value: 'number', label: 'Nombre' },
              { value: 'date', label: 'Date' },
              { value: 'select', label: 'Liste déroulante' },
              { value: 'checkbox', label: 'Cases à cocher' },
              { value: 'radio', label: 'Boutons radio' }
            ]}
            required
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={field.required}
              onChange={(e) => updateFormField(index, 'required', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor={`required-${index}`}
              className="ml-2 block text-sm text-gray-900"
            >
              Champ obligatoire
            </label>
          </div>
          
          <Input
            label="Texte d'aide"
            value={field.help_text}
            onChange={(e) => updateFormField(index, 'help_text', e.target.value)}
            placeholder="Instructions ou informations supplémentaires"
          />
          
          <Input
            label="Placeholder"
            value={field.placeholder}
            onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
            placeholder="Texte indicatif dans le champ"
          />
          
          {['select', 'checkbox', 'radio'].includes(field.field_type) && (
            <div className="md:col-span-2">
              <Textarea
                label="Options (séparées par des virgules)"
                value={field.options}
                onChange={(e) => updateFormField(index, 'options', e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
                required
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}
</div>
</TabsContent>

<TabsContent value="media" className="space-y-6">
<div className="space-y-4">
<div>
  <h3 className="text-lg font-medium">Image de bannière</h3>
  <p className="text-sm text-gray-500">
    Téléchargez une image attrayante qui représente votre événement
  </p>
</div>

<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
  {bannerImagePreview ? (
    <div className="space-y-4 w-full">
      <div className="relative h-48 w-full">
        <Image
          src={bannerImagePreview}
          alt="Aperçu de la bannière"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Cliquez sur parcourir pour changer l'image
        </p>
        
        <button
          type="button"
          onClick={() => {
            setBannerImage(null);
            setBannerImagePreview(null);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : (
    <>
      <FaImage className="h-12 w-12 text-gray-300 mb-4" />
      <p className="text-sm text-gray-500 mb-4">
        Glissez-déposez une image ou cliquez pour parcourir
      </p>
      <p className="text-xs text-gray-400">
        PNG, JPG ou JPEG. Taille recommandée : 1200 x 600 pixels.
      </p>
    </>
  )}
  
  <input
    type="file"
    id="banner-image"
    accept="image/*"
    onChange={handleBannerImageChange}
    className={`mt-4 ${bannerImagePreview ? '' : 'w-full'}`}
  />
</div>
</div>
</TabsContent>
</Tabs>

{error && (
<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
{error}
</div>
)}

<div className="mt-8 flex justify-end space-x-4">
<Button
type="button"
variant="ghost"
onClick={() => router.push('/dashboard/my-events')}
>
Annuler
</Button>

<Button
type="submit"
disabled={isSubmitting}
>
{isSubmitting
? 'Enregistrement...'
: mode === 'create'
? 'Créer l\'événement'
: 'Enregistrer les modifications'}
</Button>
</div>
</div>
</form>
</div>
);
}

// components/dashboard/AnalyticsChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select } from '../ui/Select';
import { analyticsAPI } from '@/lib/api';

interface AnalyticsChartProps {
eventId?: string;
chartType: 'revenue' | 'registrations' | 'visitors';
title: string;
}

export default function AnalyticsChart({ eventId, chartType, title }: AnalyticsChartProps) {
const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [interval, setInterval] = useState<'day' | 'week' | 'month'>('day');
const [periods, setPeriods] = useState(30);

useEffect(() => {
const fetchData = async () => {
setLoading(true);
try {
let response;

switch (chartType) {
case 'revenue':
response = await analyticsAPI.getRevenueAnalytics({
analysis_type: 'trends',
interval,
periods,
event_id: eventId
});
break;
case 'registrations':
// TODO: Appel API pour les inscriptions
break;
case 'visitors':
// TODO: Appel API pour les visiteurs
break;
}

if (response) {
setData(response.data);
}
} catch (error) {
console.error(`Error fetching ${chartType} data:`, error);
} finally {
setLoading(false);
}
};

fetchData();
}, [chartType, eventId, interval, periods]);

if (loading) {
return (
<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-base font-medium">{title}</CardTitle>
<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
</CardHeader>
<CardContent className="pt-4">
<div className="h-64 bg-gray-100 rounded animate-pulse"></div>
</CardContent>
</Card>
);
}

return (
<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-base font-medium">{title}</CardTitle>
<Select
options={[
{ value: 'day', label: 'Quotidien' },
{ value: 'week', label: 'Hebdomadaire' },
{ value: 'month', label: 'Mensuel' }
]}
value={interval}
onChange={(e) => setInterval(e.target.value as 'day' | 'week' | 'month')}
className="w-32"
/>
</CardHeader>
<CardContent className="pt-4">
{/* Placeholder pour le graphique - à implémenter avec recharts */}
<div className="h-64 bg-gray-100 rounded flex items-center justify-center">
<p className="text-gray-500">Graphique {chartType} à implémenter</p>
</div>
</CardContent>
</Card>
);
}// components/dashboard/DashboardStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { analyticsAPI } from '@/lib/api';
import { AnalyticsDashboardSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

export default function DashboardStats() {
const [stats, setStats] = useState<AnalyticsDashboardSummary | null>(null);
const [loading, setLoading] = useState(true);
const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

useEffect(() => {
const fetchStats = async () => {
setLoading(true);
try {
const response = await analyticsAPI.getDashboardSummary({ period });
setStats(response.data);
} catch (error) {
console.error('Error fetching dashboard stats:', error);
} finally {
setLoading(false);
}
};

fetchStats();
}, [period]);

if (loading) {
return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
{[...Array(4)].map((_, index) => (
<div key={index} className="h-32 bg-white rounded-lg shadow-sm animate-pulse"></div>
))}
</div>
);
}

if (!stats) return null;

return (
<>
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-semibold">Vue d'ensemble</h2>

<div className="flex space-x-2">
<Button 
variant={period === 'week' ? 'default' : 'outline'} 
size="sm"
onClick={() => setPeriod('week')}
>
Semaine
</Button>
<Button 
variant={period === 'month' ? 'default' : 'outline'} 
size="sm" 
onClick={() => setPeriod('month')}
>
Mois
</Button>
<Button 
variant={period === 'year' ? 'default' : 'outline'} 
size="sm" 
onClick={() => setPeriod('year')}
>
Année
</Button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-sm font-medium">Événements totaux</CardTitle>
<div className="p-2 bg-primary/10 rounded-full">
<FaCalendarAlt className="h-4 w-4 text-primary" />
</div>
</CardHeader>
<CardContent>
<div className="text-2xl font-bold">{stats.event_summary.total_events}</div>
<p className="text-xs text-muted-foreground mt-1">
<span className="text-green-500">{stats.event_summary.upcoming_events}</span> à venir
{stats.event_summary.ongoing_events > 0 && (
<span> · <span className="text-blue-500">{stats.event_summary.ongoing_events}</span> en cours</span>
)}
</p>
</CardContent>
</Card>

<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
<div className="p-2 bg-blue-100 rounded-full">
<FaUsers className="h-4 w-4 text-blue-500" />
</div>
</CardHeader>
<CardContent>
<div className="text-2xl font-bold">{stats.registration_summary.summary.total_registrations}</div>
<p className="text-xs text-muted-foreground mt-1">
Taux de conversion: <span className="text-green-500">{stats.registration_summary.summary.conversion_rate}%</span>
</p>
</CardContent>
</Card>

<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-sm font-medium">Revenu total</CardTitle>
<div className="p-2 bg-green-100 rounded-full">
<FaMoneyBillWave className="h-4 w-4 text-green-500" />
</div>
</CardHeader>
<CardContent>
<div className="text-2xl font-bold">{formatCurrency(stats.revenue_summary.total_revenue, 'XAF')}</div>
<p className="text-xs text-muted-foreground mt-1">
Moy. par transaction: {formatCurrency(stats.revenue_summary.avg_transaction, 'XAF')}
</p>
</CardContent>
</Card>

<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-sm font-medium">Taux de remplissage</CardTitle>
<div className="p-2 bg-purple-100 rounded-full">
<FaChartLine className="h-4 w-4 text-purple-500" />
</div>
</CardHeader>
<CardContent>
<div className="text-2xl font-bold">{stats.event_summary.avg_fill_rate}%</div>
<p className="text-xs text-muted-foreground mt-1">
Moyenne de tous les événements
</p>
</CardContent>
</Card>
</div>
</>
);
}

// components/dashboard/EventList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { eventsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FaCalendarAlt, FaEdit, FaEye, FaCopy, FaTrash, FaUsers, FaChartLine } from 'react-icons/fa';

export default function EventList() {
const [events, setEvents] = useState<Event[]>([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

useEffect(() => {
const fetchEvents = async () => {
setLoading(true);
try {
const response = await eventsAPI.getEvents({ organizer: 'me' });
setEvents(response.data.results || []);
} catch (error) {
console.error('Error fetching events:', error);
} finally {
setLoading(false);
}
};

fetchEvents();
}, []);

const filteredEvents = events.filter(event => {
const eventDate = new Date(event.start_date);
const today = new Date();

if (activeTab === 'upcoming') {
return eventDate > today;
} else if (activeTab === 'past') {
return eventDate < today;
}

return true;
});

const getStatusBadge = (status: string) => {
switch (status) {
case 'draft':
return <Badge variant="outline">Brouillon</Badge>;
case 'published':
return <Badge variant="secondary">Publié</Badge>;
case 'validated':
return <Badge variant="success">Validé</Badge>;
case 'completed':
return <Badge variant="default">Terminé</Badge>;
case 'cancelled':
return <Badge variant="destructive">Annulé</Badge>;
default:
return <Badge variant="outline">{status}</Badge>;
}
};

if (loading) {
return (
<div className="space-y-4">
{[...Array(3)].map((_, index) => (
<div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
<div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
<div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
))}
</div>
);
}

return (
<div>
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-semibold">Mes événements</h2>

<Button href="/dashboard/create-event">
Créer un événement
</Button>
</div>

<div className="bg-white rounded-lg shadow-sm overflow-hidden">
<div className="border-b border-gray-200">
<div className="flex">
<button
className={`px-4 py-3 text-sm font-medium ${
activeTab === 'all'
  ? 'border-b-2 border-primary text-primary'
  : 'text-gray-500 hover:text-gray-700'
}`}
onClick={() => setActiveTab('all')}
>
Tous ({events.length})
</button>
<button
className={`px-4 py-3 text-sm font-medium ${
activeTab === 'upcoming'
  ? 'border-b-2 border-primary text-primary'
  : 'text-gray-500 hover:text-gray-700'
}`}
onClick={() => setActiveTab('upcoming')}
>
À venir
</button>
<button
className={`px-4 py-3 text-sm font-medium ${
activeTab === 'past'
  ? 'border-b-2 border-primary text-primary'
  : 'text-gray-500 hover:text-gray-700'
}`}
onClick={() => setActiveTab('past')}
>
Passés
</button>
</div>
</div>

{filteredEvents.length === 0 ? (
<div className="p-6 text-center">
<FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
<h3 className="text-lg font-medium text-gray-900">Aucun événement trouvé</h3>
<p className="mt-1 text-sm text-gray-500">
{activeTab === 'all'
? "Vous n'avez pas encore créé d'événement."
: activeTab === 'upcoming'
? "Vous n'avez pas d'événements à venir."
: "Vous n'avez pas d'événements passés."}
</p>
<div className="mt-6">
<Button href="/dashboard/create-event">
Créer un événement
</Button>
</div>
</div>
) : (
<div className="divide-y divide-gray-200">
{filteredEvents.map((event) => (
<div key={event.id} className="p-4 hover:bg-gray-50">
<div className="sm:flex sm:items-center sm:justify-between">
  <div className="sm:flex sm:items-center">
    <div className="relative h-16 w-16 flex-shrink-0">
      {event.banner_image ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${event.banner_image}`}
          alt={event.title}
          fill
          className="rounded-md object-cover"
        />
      ) : (
        <div className="h-16 w-16 rounded-md bg-primary/20 flex items-center justify-center">
          <FaCalendarAlt className="h-6 w-6 text-primary/40" />
        </div>
      )}
    </div>
    
    <div className="mt-4 sm:mt-0 sm:ml-4">
      <div className="flex items-center">
        <h3 className="text-base font-medium text-gray-900 truncate max-w-md">
          {event.title}
        </h3>
        <div className="ml-2">
          {getStatusBadge(event.status)}
        </div>
      </div>
      
      <div className="mt-1 flex items-center text-sm text-gray-500">
        <span>{formatDate(event.start_date)}</span>
        <span className="mx-1">•</span>
        <span>{event.location_city}</span>
        <span className="mx-1">•</span>
        <Badge variant={event.event_type === 'billetterie' ? 'info' : 'success'} className="text-xs">
          {event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
        </Badge>
      </div>
    </div>
  </div>
  
  <div className="mt-4 flex sm:mt-0">
    <Link 
      href={`/dashboard/event/${event.id}/analytics`}
      className="mr-3 text-gray-400 hover:text-gray-500"
    >
      <FaChartLine className="h-5 w-5" />
    </Link>
    
    <Link 
      href={`/dashboard/event/${event.id}/registrations`}
      className="mr-3 text-gray-400 hover:text-gray-500"
    >
      <FaUsers className="h-5 w-5" />
    </Link>
    
    <Link 
      href={`/events/${event.id}`} 
      className="mr-3 text-gray-400 hover:text-gray-500"
      target="_blank"
    >
      <FaEye className="h-5 w-5" />
    </Link>
    
    <Link 
      href={`/dashboard/event/${event.id}/edit`}
      className="mr-3 text-gray-400 hover:text-gray-500"
    >
      <FaEdit className="h-5 w-5" />
    </Link>
    
    <button 
      className="mr-3 text-gray-400 hover:text-gray-500"
      title="Dupliquer"
    >
      <FaCopy className="h-5 w-5" />
    </button>
    
    <button 
      className="text-red-400 hover:text-red-500"
      title="Supprimer"
    >
      <FaTrash className="h-5 w-5" />
    </button>
  </div>
</div>

<div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
  <div className="col-span-1">
    <div className="flex items-center">
      <FaUsers className="mr-2 h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-500">
        {event.registration_count || 0} inscriptions
      </span>
    </div>
  </div>
</div>
</div>
))}
</div>
)}
</div>
</div>
);
}

// components/dashboard/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Event, Category, Tag } from '@/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { eventsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FaCalendarAlt, FaMapMarkerAlt, FaImage, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';

interface EventFormProps {
event?: Event;
categories: Category[];
tags: Tag[];
mode: 'create' | 'edit';
}

export default function EventForm({ event, categories, tags, mode }: EventFormProps) {
const router = useRouter();
const { data: session } = useSession();

// États pour les différents champs du formulaire
const [title, setTitle] = useState(event?.title || '');
const [description, setDescription] = useState(event?.description || '');
const [shortDescription, setShortDescription] = useState(event?.short_description || '');
const [eventType, setEventType] = useState(event?.event_type || 'billetterie');
const [categoryId, setCategoryId] = useState(event?.category?.id.toString() || '');
const [selectedTags, setSelectedTags] = useState<number[]>(event?.tags?.map(tag => tag.id) || []);
const [startDate, setStartDate] = useState(event?.start_date ? formatDate(event.start_date, 'yyyy-MM-dd') : '');
const [startTime, setStartTime] = useState(event?.start_date ? formatDate(event.start_date, 'HH:mm') : '');
const [endDate, setEndDate] = useState(event?.end_date ? formatDate(event.end_date, 'yyyy-MM-dd') : '');
const [endTime, setEndTime] = useState(event?.end_date ? formatDate(event.end_date, 'HH:mm') : '');
const [registrationDeadlineDate, setRegistrationDeadlineDate] = useState(
event?.registration_deadline ? formatDate(event.registration_deadline, 'yyyy-MM-dd') : ''
);
const [registrationDeadlineTime, setRegistrationDeadlineTime] = useState(
event?.registration_deadline ? formatDate(event.registration_deadline, 'HH:mm') : ''
);
const [locationName, setLocationName] = useState(event?.location_name || '');
const [locationAddress, setLocationAddress] = useState(event?.location_address || '');
const [locationCity, setLocationCity] = useState(event?.location_city || '');
const [locationCountry, setLocationCountry] = useState(event?.location_country || 'Cameroun');
const [bannerImage, setBannerImage] = useState<File | null>(null);
const [bannerImagePreview, setBannerImagePreview] = useState(
event?.banner_image ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${event.banner_image}` : null
);
const [activeTab, setActiveTab] = useState('general');

// États pour le formulaire personnalisé
const [formFields, setFormFields] = useState<any[]>([]);

// États pour la billetterie
const [ticketTypes, setTicketTypes] = useState<any[]>([]);

// État pour la soumission du formulaire
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

// Effets secondaires
useEffect(() => {
// Initialiser les champs de formulaire ou les types de billets si on est en mode édition
if (mode === 'edit' && event) {
// TODO: Charger les champs de formulaire ou les types de billets depuis l'API
}
}, [mode, event]);

// Gérer le changement de l'image de bannière
const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = e.target.files;
if (files && files.length > 0) {
const file = files[0];
setBannerImage(file);

// Prévisualiser l'image
const reader = new FileReader();
reader.onload = () => {
setBannerImagePreview(reader.result as string);
};
reader.readAsDataURL(file);
}
};

// Gérer la sélection/désélection des tags
const handleTagToggle = (tagId: number) => {
if (selectedTags.includes(tagId)) {
setSelectedTags(selectedTags.filter(id => id !== tagId));
} else {
setSelectedTags([...selectedTags, tagId]);
}
};

// Ajouter un type de billet (pour les événements avec billetterie)
const addTicketType = () => {
setTicketTypes([
...ticketTypes,
{
id: `temp-${Date.now()}`,
name: '',
description: '',
price: 0,
quantity_total: 50,
sales_start_date: startDate,
sales_start_time: '00:00',
sales_end_date: registrationDeadlineDate || startDate,
sales_end_time: '23:59',
is_visible: true,
max_per_order: 10,
min_per_order: 1
}
]);
};

// Supprimer un type de billet
const removeTicketType = (index: number) => {
setTicketTypes(ticketTypes.filter((_, i) => i !== index));
};

// Mettre à jour un type de billet
const updateTicketType = (index: number, field: string, value: any) => {
const updatedTypes = [...ticketTypes];
updatedTypes[index] = {
...updatedTypes[index],
[field]: value
};
setTicketTypes(updatedTypes);
};

// Ajouter un champ de formulaire (pour les événements avec inscription personnalisée)
const addFormField = () => {
setFormFields([
...formFields,
{
id: `temp-${Date.now()}`,
label: '',
field_type: 'text',
required: false,
placeholder: '',
help_text: '',
options: '',
order: formFields.length
}
]);
};

// Supprimer un champ de formulaire
const removeFormField = (index: number) => {
setFormFields(formFields.filter((_, i) => i !== index));
};

// Mettre à jour un champ de formulaire
const updateFormField = (index: number, field: string, value: any) => {
const updatedFields = [...formFields];
updatedFields[index] = {
...updatedFields[index],
[field]: value
};
setFormFields(updatedFields);
};

// Valider le formulaire
const validateForm = () => {
if (!title) {
setError('Le titre est requis');
return false;
}

if (!description) {
setError('La description est requise');
return false;
}

if (!categoryId) {
setError('La catégorie est requise');
return false;
}

if (!startDate || !startTime) {
setError('La date et l\'heure de début sont requises');
return false;
}

if (!endDate || !endTime) {
setError('La date et l\'heure de fin sont requises');
return false;
}

if (new Date(`${startDate}T${startTime}`) >= new Date(`${endDate}T${endTime}`)) {
setError('La date de fin doit être après la date de début');
return false;
}

if (!locationName || !locationAddress || !locationCity) {
setError('Les informations de lieu sont requises');
return false;
}

if (eventType === 'billetterie' && ticketTypes.length === 0) {
setError('Vous devez créer au moins un type de billet');
return false;
}

if (eventType === 'inscription' && formFields.length === 0) {
setError('Vous devez créer au moins un champ de formulaire');
return false;
}

return true;
};

// Soumettre le formulaire
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

if (!validateForm()) return;

setIsSubmitting(true);
setError(null);

try {
// Construire l'objet d'événement
const eventData = {
title,
description,
short_description: shortDescription,
event_type: eventType,
category: parseInt(categoryId),
tags: selectedTags,
start_date: `${startDate}T${startTime}:00`,
end_date: `${endDate}T${endTime}:00`,
registration_deadline: registrationDeadlineDate && registrationDeadlineTime 
? `${registrationDeadlineDate}T${registrationDeadlineTime}:00` 
: null,
location_name: locationName,
location_address: locationAddress,
location_city: locationCity,
location_country: locationCountry
};

let eventId;

if (mode === 'create') {
// Créer l'événement
const response = await eventsAPI.createEvent(eventData);
eventId = response.data.id;
} else {
// Mettre à jour l'événement
await eventsAPI.updateEvent(event!.id, eventData);
eventId = event!.id;
}

// Télécharger l'image de bannière si nécessaire
if (bannerImage) {
const formData = new FormData();
formData.append('banner_image', bannerImage);

await eventsAPI.updateEvent(eventId, formData);
}

// Ajouter les types de billets ou les champs de formulaire
if (eventType === 'billetterie') {
// TODO: Ajouter les types de billets via l'API
} else {
// TODO: Ajouter les champs de formulaire via l'API
}

// Rediriger vers la page de l'événement
router.push(`/dashboard/my-events`);
} catch (error: any) {
console.error('Error submitting event:', error);
setError(error.response?.data?.detail || 'Une erreur est survenue lors de la soumission du formulaire');
} finally {
setIsSubmitting(false);
}
};

return (
<div className="bg-white rounded-lg shadow-md overflow-hidden">
<form onSubmit={handleSubmit}>
<div className="p-6">
<h2 className="text-2xl font-semibold mb-6">
{mode === 'create' ? 'Créer un nouvel événement' : 'Modifier l\'événement'}
</h2>

<Tabs value={activeTab} onValueChange={setActiveTab}>
<TabsList className="mb-6">
<TabsTrigger value="general">Informations générales</TabsTrigger>
<TabsTrigger value="location">Lieu et horaires</TabsTrigger>
<TabsTrigger value="tickets" disabled={eventType !== 'billetterie'}>
Billetterie
</TabsTrigger>
<TabsTrigger value="form" disabled={eventType !== 'inscription'}>
Formulaire d'inscription
</TabsTrigger>
<TabsTrigger value="media">Médias</TabsTrigger>
</TabsList>

<TabsContent value="general" className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<Input
  label="Titre de l'événement *"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Donnez un titre à votre événement"
  required
/>

<Select
  label="Type d'événement *"
  value={eventType}
  onChange={(e) => setEventType(e.target.value)}
  options={[
    { value: 'billetterie', label: 'Billetterie' },
    { value: 'inscription', label: 'Inscription personnalisée' }
  ]}
  required
/>

<div className="md:col-span-2">
  <Textarea
    label="Description complète *"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Décrivez votre événement en détail"
    required
    className="min-h-32"
  />
</div>

<div className="md:col-span-2">
  <Textarea
    label="Résumé court"
    value={shortDescription}
    onChange={(e) => setShortDescription(e.target.value)}
    placeholder="Un bref résumé de votre événement (max 255 caractères)"
    maxLength={255}
  />
</div>

<Select
  label="Catégorie *"
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  options={[
    { value: '', label: 'Sélectionnez une catégorie' },
    ...categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }))
  ]}
  required
/>

<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">Tags</label>
  <div className="flex flex-wrap gap-2">
    {tags.map(tag => (
      <button
        key={tag.id}
        type="button"
        onClick={() => handleTagToggle(tag.id)}
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          selectedTags.includes(tag.id)
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {tag.name}
      </button>
    ))}
  </div>
</div>
</div>
</TabsContent>

<TabsContent value="location" className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-6">
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Date et heure</h3>
    <p className="text-sm text-gray-500">
      Définissez quand votre événement aura lieu
    </p>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date de début *"
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      required
    />
    
    <Input
      label="Heure de début *"
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      required
    />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date de fin *"
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      required
    />
    
    <Input
      label="Heure de fin *"
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      required
    />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Date limite d'inscription"
      type="date"
      value={registrationDeadlineDate}
      onChange={(e) => setRegistrationDeadlineDate(e.target.value)}
    />
    
    <Input
      label="Heure limite d'inscription"
      type="time"
      value={registrationDeadlineTime}
      onChange={(e) => setRegistrationDeadlineTime(e.target.value)}
    />
  </div>
</div>

<div className="space-y-6">
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Lieu</h3>
    <p className="text-sm text-gray-500">
      Indiquez où votre événement aura lieu
    </p>
  </div>
  
  <Input
    label="Nom du lieu *"
    value={locationName}
    onChange={(e) => setLocationName(e.target.value)}
    placeholder="Ex: Salle de conférence, Stade, etc."
    required
  />
  
  <Input
    label="Adresse *"
    value={locationAddress}
    onChange={(e) => setLocationAddress(e.target.value)}
    placeholder="Ex: 123 Rue Principale"
    required
  />
  
  <div className="grid grid-cols-2 gap-4">
    <Input
      label="Ville *"
      value={locationCity}
      onChange={(e) => setLocationCity(e.target.value)}
      placeholder="Ex: Douala"
      required
    />
    
    <Input
      label="Pays *"
      value={locationCountry}
      onChange={(e) => setLocationCountry(e.target.value)}
      placeholder="Ex: Cameroun"
      required
    />
  </div>
</div>
</div>
</TabsContent>

<TabsContent value="tickets" className="space-y-6">
<div className="space-y-4">
<div className="flex justify-between items-center">
  <div>
    <h3 className="text-lg font-medium">Types de billets</h3>
    <p className="text-sm text-gray-500">
      Définissez les différents types de billets disponibles pour votre événement
    </p>
  </div>
  
  <Button
    type="button"
    onClick={addTicketType}
    variant="outline"
  >
    <FaPlus className="mr-2" />
    Ajouter un type de billet
  </Button>
</div>

{ticketTypes.length === 0 ? (
  <div className="bg-gray-50 p-8 rounded-lg text-center">
    <FaTicketAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
    <h4 className="text-lg font-medium text-gray-900">Aucun type de billet</h4>
    <p className="mt-1 text-sm text-gray-500">
      Commencez par ajouter un type de billet pour votre événement
    </p>
    <Button
      type="button"
      onClick={addTicketType}
      className="mt-4"
    >
      Ajouter un type de billet
    </Button>
  </div>
) : (
  <div className="space-y-4">
    {ticketTypes.map((ticket, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Type de billet #{index + 1}</h4>
          <button
            type="button"
            onClick={() => removeTicketType(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom du billet *"
            value={ticket.name}
            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
            placeholder="Ex: Standard, VIP, Early Bird"
            required
          />
          
          <Input
            label="Prix (XAF) *"
            type="number"
            value={ticket.price}
            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
            min={0}
            required
          />
          
          <Input
            label="Quantité totale *"
            type="number"
            value={ticket.quantity_total}
            onChange={(e) => updateTicketType(index, 'quantity_total', parseInt(e.target.value))}
            min={1}
            required
          />
          
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={ticket.description}
              onChange={(e) => updateTicketType(index, 'description', e.target.value)}
              placeholder="Décrivez ce type de billet"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date de début des ventes"
              type="date"
              value={ticket.sales_start_date}
              onChange={(e) => updateTicketType(index, 'sales_start_date', e.target.value)}
            />
            
            <Input
              label="Heure de début"
              type="time"
              value={ticket.sales_start_time}
              onChange={(e) => updateTicketType(index, 'sales_start_time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date de fin des ventes"
              type="date"
              value={ticket.sales_end_date}
              onChange={(e) => updateTicketType(index, 'sales_end_date', e.target.value)}
            />
            
            <Input
              label="Heure de fin"
              type="time"
              value={ticket.sales_end_time}
              onChange={(e) => updateTicketType(index, 'sales_end_time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min. par commande"
              type="number"
              value={ticket.min_per_order}
              onChange={(e) => updateTicketType(index, 'min_per_order', parseInt(e.target.value))}
              min={1}
            />
            
            <Input
              label="Max. par commande"
              type="number"
              value={ticket.max_per_order}
              onChange={(e) => updateTicketType(index, 'max_per_order', parseInt(e.target.value))}
              min={1}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}
</div>
</TabsContent>

<TabsContent value="form" className="space-y-6">
<div className="space-y-4">
<div className="flex justify-between items-center">
  <div>
    <h3 className="text-lg font-medium">Champs du formulaire d'inscription</h3>
    <p className="text-sm text-gray-500">
      Créez un formulaire personnalisé pour recueillir les informations des participants
    </p>
  </div>
  
  <Button
    type="button"
    onClick={addFormField}
    variant="outline"
  >
    <FaPlus className="mr-2" />
    Ajouter un champ
  </Button>
</div>

{formFields.length === 0 ? (
  <div className="bg-gray-50 p-8 rounded-lg text-center">
    <FaClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
    <h4 className="text-lg font-medium text-gray-900">Aucun champ de formulaire</h4>
    <p className="mt-1 text-sm text-gray-500">
      Commencez par ajouter des champs pour personnaliser votre formulaire d'inscription
    </p>
    <Button
      type="button"
      onClick={addFormField}
      className="mt-4"
    >
      Ajouter un champ
    </Button>
  </div>
) : (
  <div className="space-y-4">
    {formFields.map((field, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Champ #{index + 1}</h4>
          <button
            type="button"
            onClick={() => removeFormField(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Intitulé du champ *"
            value={field.label}
            onChange={(e) => updateFormField(index, 'label', e.target.value)}
            placeholder="Ex: Nom, Email, Téléphone"
            required
          />
          
          <Select
            label="Type de champ *"
            value={field.field_type}
            onChange={(e) => updateFormField(index, 'field_type', e.target.value)}
            options={[
              { value: 'text', label: 'Texte' },
              { value: 'textarea', label: 'Zone de texte' },
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Téléphone' },
              { value: 'number', label: 'Nombre' },
              { value: 'date', label: 'Date' },
              { value: 'select', label: 'Liste déroulante' },
              { value: 'checkbox', label: 'Cases à cocher' },
              { value: 'radio', label: 'Boutons radio' }
            ]}
            required
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={field.required}
              onChange={(e) => updateFormField(index, 'required', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor={`required-${index}`}
              className="ml-2 block text-sm text-gray-900"
            >
              Champ obligatoire
            </label>
          </div>
          
          <Input
            label="Texte d'aide"
            value={field.help_text}
            onChange={(e) => updateFormField(index, 'help_text', e.target.value)}
            placeholder="Instructions ou informations supplémentaires"
          />
          
          <Input
            label="Placeholder"
            value={field.placeholder}
            onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
            placeholder="Texte indicatif dans le champ"
          />
          
          {['select', 'checkbox', 'radio'].includes(field.field_type) && (
            <div className="md:col-span-2">
              <Textarea
                label="Options (séparées par des virgules)"
                value={field.options}
                onChange={(e) => updateFormField(index, 'options', e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
                required
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}
</div>
</TabsContent>

<TabsContent value="media" className="space-y-6">
<div className="space-y-4">
<div>
  <h3 className="text-lg font-medium">Image de bannière</h3>
  <p className="text-sm text-gray-500">
    Téléchargez une image attrayante qui représente votre événement
  </p>
</div>

<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
  {bannerImagePreview ? (
    <div className="space-y-4 w-full">
      <div className="relative h-48 w-full">
        <Image
          src={bannerImagePreview}
          alt="Aperçu de la bannière"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Cliquez sur parcourir pour changer l'image
        </p>
        
        <button
          type="button"
          onClick={() => {
            setBannerImage(null);
            setBannerImagePreview(null);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : (
    <>
      <FaImage className="h-12 w-12 text-gray-300 mb-4" />
      <p className="text-sm text-gray-500 mb-4">
        Glissez-déposez une image ou cliquez pour parcourir
      </p>
      <p className="text-xs text-gray-400">
        PNG, JPG ou JPEG. Taille recommandée : 1200 x 600 pixels.
      </p>
    </>
  )}
  
  <input
    type="file"
    id="banner-image"
    accept="image/*"
    onChange={handleBannerImageChange}
    className={`mt-4 ${bannerImagePreview ? '' : 'w-full'}`}
  />
</div>
</div>
</TabsContent>
</Tabs>

{error && (
<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
{error}
</div>
)}

<div className="mt-8 flex justify-end space-x-4">
<Button
type="button"
variant="ghost"
onClick={() => router.push('/dashboard/my-events')}
>
Annuler
</Button>

<Button
type="submit"
disabled={isSubmitting}
>
{isSubmitting
? 'Enregistrement...'
: mode === 'create'
? 'Créer l\'événement'
: 'Enregistrer les modifications'}
</Button>
</div>
</div>
</form>
</div>
);
}
