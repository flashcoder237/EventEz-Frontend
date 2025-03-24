// app/(dashboard)/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ArrowUp, ArrowDown, ArrowRight, CreditCard, Users, Calendar,
  TrendingUp, Download, Calendar as CalendarIcon, Clipboard, Activity
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // La page est protégée par le middleware
    },
  });

  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [eventPerformanceData, setEventPerformanceData] = useState<any[]>([]);
  const [attendeeData, setAttendeeData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Données pour le graphique de répartition des méthodes de paiement
  const paymentMethodsData = useMemo(() => {
    if (!stats?.revenue_summary?.revenue_by_method) return [];
    return stats.revenue_summary.revenue_by_method.map((method: any) => ({
      name: method.payment_method === 'mtn_money' 
           ? 'MTN Money' 
           : method.payment_method === 'orange_money'
           ? 'Orange Money'
           : method.payment_method === 'credit_card'
           ? 'Carte de crédit'
           : method.payment_method,
      value: method.total
    }));
  }, [stats]);

  // Données pour le graphique de répartition des types d'événements
  const eventTypesData = useMemo(() => {
    if (!stats?.event_summary?.event_types) return [];
    return stats.event_summary.event_types.map((type: any) => ({
      name: type.event_type === 'billetterie' 
          ? 'Billetterie' 
          : type.event_type === 'inscription'
          ? 'Inscription'
          : type.event_type,
      value: type.count
    }));
  }, [stats]);

  // Charger les données d'analytiques
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (status !== 'authenticated' || !session) {
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        // Récupérer les données du tableau de bord
        const dashboardResponse = await analyticsAPI.getDashboardSummary({ period });
        setStats(dashboardResponse.data);

        // Récupérer les données de revenus
        const revenueResponse = await analyticsAPI.getRevenueAnalytics({ 
          analysis_type: 'trends',
          period,
          interval: period === 'week' ? 'day' : period === 'month' ? 'day' : 'month'
        });
        setRevenueData(revenueResponse.data.trends || []);

        // Récupérer les données d'inscriptions
        const registrationResponse = await analyticsAPI.getRegistrationAnalytics({
          period,
          interval: period === 'week' ? 'day' : period === 'month' ? 'day' : 'month'
        });
        setRegistrationData(registrationResponse.data.trends?.data || []);

        // Récupérer les performances d'événements
        const eventAnalyticsResponse = await analyticsAPI.getEventAnalytics(period);
        setEventPerformanceData(eventAnalyticsResponse.data.events_details || []);

        // Données fictives pour les démographies des participants
        setAttendeeData([
          { name: '18-24', value: 25 },
          { name: '25-34', value: 40 },
          { name: '35-44', value: 20 },
          { name: '45-54', value: 10 },
          { name: '55+', value: 5 }
        ]);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setErrorMessage('Une erreur est survenue lors du chargement des données d\'analyse. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [session, status, period]);

  // Formatage des chiffres et calcul des variations
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100; // Si la valeur précédente est 0, considérer comme 100% d'augmentation
    return ((current - previous) / previous) * 100;
  };

  // Couleurs pour les graphiques
  const COLORS = ['#6d28d9', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  // État de chargement
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord analytique</h1>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded mt-4 md:mt-0"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse h-32 bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse h-80 bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Message d'erreur
  if (errorMessage) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-medium">{errorMessage}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord analytique</h1>
          <p className="text-gray-600">
            Vue d'ensemble des performances de vos événements
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
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
      
      {/* Cartes de métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Revenus totaux</span>
              <div className="p-2 bg-purple-100 rounded-full">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{formatCurrency(stats?.revenue_summary?.total_revenue || 0)}</h2>
              <div className="flex items-center text-sm">
                {calculateChange(stats?.revenue_summary?.total_revenue || 0, stats?.revenue_summary?.previous_period_revenue || 0) > 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>+{Math.abs(calculateChange(stats?.revenue_summary?.total_revenue || 0, stats?.revenue_summary?.previous_period_revenue || 0)).toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>-{Math.abs(calculateChange(stats?.revenue_summary?.total_revenue || 0, stats?.revenue_summary?.previous_period_revenue || 0)).toFixed(1)}%</span>
                  </div>
                )}
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Inscriptions</span>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.registration_summary?.summary?.total_registrations || 0}</h2>
              <div className="flex items-center text-sm">
                {calculateChange(stats?.registration_summary?.summary?.total_registrations || 0, stats?.registration_summary?.summary?.previous_period_registrations || 0) > 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>+{Math.abs(calculateChange(stats?.registration_summary?.summary?.total_registrations || 0, stats?.registration_summary?.summary?.previous_period_registrations || 0)).toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>-{Math.abs(calculateChange(stats?.registration_summary?.summary?.total_registrations || 0, stats?.registration_summary?.summary?.previous_period_registrations || 0)).toFixed(1)}%</span>
                  </div>
                )}
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Événements</span>
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.event_summary?.total_events || 0}</h2>
              <div className="flex items-center text-sm">
                <div className="text-blue-600 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  <span>{stats?.event_summary?.upcoming_events || 0} à venir</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Taux de conversion</span>
              <div className="p-2 bg-pink-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{(stats?.registration_summary?.summary?.conversion_rate || 0).toFixed(1)}%</h2>
              <div className="flex items-center text-sm">
                {calculateChange(stats?.registration_summary?.summary?.conversion_rate || 0, stats?.registration_summary?.summary?.previous_conversion_rate || 0) > 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>+{Math.abs(calculateChange(stats?.registration_summary?.summary?.conversion_rate || 0, stats?.registration_summary?.summary?.previous_conversion_rate || 0)).toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>-{Math.abs(calculateChange(stats?.registration_summary?.summary?.conversion_rate || 0, stats?.registration_summary?.summary?.previous_conversion_rate || 0)).toFixed(1)}%</span>
                  </div>
                )}
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex space-x-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Revenus</TabsTrigger>
          <TabsTrigger value="registrations" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Inscriptions</TabsTrigger>
          <TabsTrigger value="events" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Événements</TabsTrigger>
          <TabsTrigger value="attendees" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Participants</TabsTrigger>
        </TabsList>
        
        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Évolution des revenus</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => formatCurrency(value)}
                        labelFormatter={(label) => `Période: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Revenus" 
                        stroke="#6d28d9" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Évolution des inscriptions</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="confirmed" 
                        name="Confirmées" 
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pending" 
                        name="En attente" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Méthodes de paiement</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Types d'événements</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Événements populaires</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64 overflow-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Événement</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Inscrits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPerformanceData.slice(0, 6).map((event, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-sm text-gray-900">{event.title}</td>
                          <td className="py-3 text-sm text-gray-900 text-right">{event.registrations_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Revenus */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenus par période</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="total" name="Revenus" fill="#6d28d9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Répartition des revenus</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Ventes de billets', value: stats?.revenue_summary?.revenue_distribution?.ticket_sales_revenue || 0 },
                          { name: 'Frais d\'utilisation', value: stats?.revenue_summary?.revenue_distribution?.usage_based_revenue || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#6d28d9" />
                        <Cell fill="#ec4899" />
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Transactions récentes</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">ID Transaction</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Événement</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Méthode</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'TRX-12345', date: '2025-03-15', event: 'Concert live', method: 'MTN Money', amount: 45000 },
                      { id: 'TRX-12346', date: '2025-03-14', event: 'Séminaire business', method: 'Orange Money', amount: 25000 },
                      { id: 'TRX-12347', date: '2025-03-14', event: 'Atelier cuisine', method: 'Carte de crédit', amount: 15000 },
                      { id: 'TRX-12348', date: '2025-03-13', event: 'Concert live', method: 'MTN Money', amount: 45000 },
                      { id: 'TRX-12349', date: '2025-03-12', event: 'Conférence tech', method: 'Orange Money', amount: 35000 },
                    ].map((transaction, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{transaction.id}</td>
                        <td className="py-3 text-sm text-gray-900">{transaction.date}</td>
                        <td className="py-3 text-sm text-gray-900">{transaction.event}</td>
                        <td className="py-3 text-sm text-gray-900">{transaction.method}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Inscriptions */}
        <TabsContent value="registrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Inscriptions par période</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total" fill="#3b82f6" />
                      <Bar dataKey="confirmed" name="Confirmées" fill="#10b981" />
                      <Bar dataKey="pending" name="En attente" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Taux de conversion par événement</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={eventPerformanceData.slice(0, 5).map(event => ({
                        name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
                        value: event.fill_rate || 0
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="value" name="Taux de remplissage (%)" fill="#6d28d9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Dernières inscriptions</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">ID</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Participant</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Événement</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'REG-12345', date: '2025-03-15', participant: 'Jean Dupont', event: 'Concert live', status: 'Confirmée' },
                      { id: 'REG-12346', date: '2025-03-14', participant: 'Marie Martin', event: 'Séminaire business', status: 'En attente' },
                      { id: 'REG-12347', date: '2025-03-14', participant: 'Ahmed Sow', event: 'Atelier cuisine', status: 'Confirmée' },
                      { id: 'REG-12348', date: '2025-03-13', participant: 'Sophie Diallo', event: 'Concert live', status: 'Confirmée' },
                      { id: 'REG-12349', date: '2025-03-12', participant: 'Paul Ndiaye', event: 'Conférence tech', status: 'Annulée' },
                    ].map((registration, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{registration.id}</td>
                        <td className="py-3 text-sm text-gray-900">{registration.date}</td>
                        <td className="py-3 text-sm text-gray-900">{registration.participant}</td>
                        <td className="py-3 text-sm text-gray-900">{registration.event}</td>
                        <td className="py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            registration.status === 'Confirmée' ? 'bg-green-100 text-green-800' :
                            registration.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {registration.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Événements */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance des événements</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={eventPerformanceData.slice(0, 5).map(event => ({
                        name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
                        inscriptions: event.registrations_count || 0,
                        capacité: event.max_capacity || 0
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inscriptions" name="Inscriptions" fill="#6d28d9" />
                      <Bar dataKey="capacité" name="Capacité max" fill="#e5e7eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.event_summary?.categories?.map((category: any) => ({
                          name: category.category__name,
                          value: category.count
                        })) || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {(stats?.event_summary?.categories || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Performance des événements</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Événement</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Inscrits</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Capacité max</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Taux de remplissage</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Revenus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventPerformanceData.map((event, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{event.title}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">{event.registrations_count}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">{event.max_capacity || '-'}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">
                          <div className="flex items-center justify-end">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${Math.min(event.fill_rate || 0, 100)}%` }}
                              ></div>
                            </div>
                            <span>{event.fill_rate?.toFixed(1) || 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(event.revenue || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Participants */}
        <TabsContent value="attendees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Répartition des participants par âge</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendeeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {attendeeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top sources d'acquisition</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Réseaux sociaux', value: 45 },
                        { name: 'Bouche à oreille', value: 25 },
                        { name: 'Site web', value: 15 },
                        { name: 'Recherche Google', value: 10 },
                        { name: 'Email marketing', value: 5 }
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="value" name="Pourcentage" fill="#6d28d9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Participants fidèles</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Participant</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Email</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Événements assistés</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Dépenses totales</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Dernière participation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Jean Dupont', email: 'jean.dupont@example.com', attended: 5, spent: 125000, last: '2025-03-15' },
                      { name: 'Marie Martin', email: 'marie.martin@example.com', attended: 4, spent: 90000, last: '2025-03-14' },
                      { name: 'Ahmed Sow', email: 'ahmed.sow@example.com', attended: 3, spent: 75000, last: '2025-03-10' },
                      { name: 'Sophie Diallo', email: 'sophie.diallo@example.com', attended: 3, spent: 60000, last: '2025-02-28' },
                      { name: 'Paul Ndiaye', email: 'paul.ndiaye@example.com', attended: 2, spent: 45000, last: '2025-02-15' },
                    ].map((attendee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{attendee.name}</td>
                        <td className="py-3 text-sm text-gray-900">{attendee.email}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">{attendee.attended}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(attendee.spent)}</td>
                        <td className="py-3 text-sm text-gray-900">{attendee.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Section des rapports */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Rapports disponibles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Rapport de performance</h3>
                <p className="text-sm text-gray-500 mb-4">Vue détaillée de la performance de vos événements</p>
                <Button size="sm" variant="outline">Générer</Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Rapport financier</h3>
                <p className="text-sm text-gray-500 mb-4">Analyse détaillée des revenus et transactions</p>
                <Button size="sm" variant="outline">Générer</Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Clipboard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Rapport d'audience</h3>
                <p className="text-sm text-gray-500 mb-4">Analyse démographique de vos participants</p>
                <Button size="sm" variant="outline">Générer</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}