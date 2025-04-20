'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Eye, 
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { analyticsAPI, eventsAPI } from '@/lib/api';
import { Event } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Couleurs pour les graphiques
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('month');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getMyEvents();
        setEvents(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    };

    if (session) {
      fetchEvents();
    }
  }, [session]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Préparer les paramètres de date
        let dateParams = {};
        const now = new Date();
        
        if (timeRange === 'month') {
          dateParams = {
            start_date: format(startOfMonth(now), 'yyyy-MM-dd'),
            end_date: format(endOfMonth(now), 'yyyy-MM-dd')
          };
        } else if (timeRange === '3months') {
          dateParams = {
            start_date: format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd'),
            end_date: format(endOfMonth(now), 'yyyy-MM-dd')
          };
        } else if (timeRange === '6months') {
          dateParams = {
            start_date: format(startOfMonth(subMonths(now, 5)), 'yyyy-MM-dd'),
            end_date: format(endOfMonth(now), 'yyyy-MM-dd')
          };
        } else if (timeRange === 'year') {
          dateParams = {
            start_date: format(startOfMonth(subMonths(now, 11)), 'yyyy-MM-dd'),
            end_date: format(endOfMonth(now), 'yyyy-MM-dd')
          };
        }
        
        // Préparer les paramètres d'événement
        let eventParams = {};
        if (selectedEvent !== 'all') {
          eventParams = { event: selectedEvent };
        }
        
        // Récupérer les données du tableau de bord
        const dashboardResponse = await analyticsAPI.getDashboardSummary({
          ...dateParams,
          ...eventParams
        });
        
        setDashboardData(dashboardResponse.data);
        console.log(dashboardResponse);
        
        
        // Préparer les données pour les graphiques
        if (dashboardResponse.data) {
          // Données d'inscription
          if (dashboardResponse.data.registration_summary?.trends?.data) {
            setRegistrationData(dashboardResponse.data.registration_summary.trends.data);
          }
          
          // Données de revenus
          if (dashboardResponse.data.revenue_summary?.revenue_by_period?.data) {
            setRevenueData(dashboardResponse.data.revenue_summary.revenue_by_period.data);
          }
          
          // Données de catégories
          if (dashboardResponse.data.event_summary?.categories) {
            setCategoryData(dashboardResponse.data.event_summary.categories);
          }
          
          // Données de méthodes de paiement
          if (dashboardResponse.data.revenue_summary?.revenue_by_method) {
            setPaymentMethodData(dashboardResponse.data.revenue_summary.revenue_by_method);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'analyse:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAnalyticsData();
    }
  }, [session, selectedEvent, timeRange]);

  const handleExportData = async () => {
    try {
      // Créer un rapport
      const reportData = {
        title: `Rapport d'analyse - ${selectedEvent === 'all' ? 'Tous les événements' : 'Événement spécifique'}`,
        description: `Période: ${timeRange === 'month' ? 'Mois en cours' : 
                              timeRange === '3months' ? '3 derniers mois' : 
                              timeRange === '6months' ? '6 derniers mois' : 
                              '12 derniers mois'}`,
        report_type: 'event_performance',
        data: dashboardData,
        filters: {
          event: selectedEvent,
          time_range: timeRange
        },
        export_format: 'pdf'
      };
      
      const response = await analyticsAPI.generateReport(reportData);
      
      // Télécharger le rapport
      if (response.data && response.data.id) {
        window.open(`/api/analytics/reports/${response.data.id}/export/?format=pdf`, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données:', error);
      alert('Une erreur est survenue lors de l\'exportation des données.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="month">Mois en cours</option>
                <option value="3months">3 derniers mois</option>
                <option value="6months">6 derniers mois</option>
                <option value="year">12 derniers mois</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="all">Tous les événements</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter les données
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Événements
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {dashboardData?.event_summary?.total_events || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inscriptions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {dashboardData?.registration_summary?.summary?.total_registrations || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenus
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {(dashboardData?.revenue_summary?.total_revenue || 0).toLocaleString()} XAF
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux de conversion
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {dashboardData?.registration_summary?.summary?.conversion_rate || 0}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des inscriptions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des inscriptions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={registrationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="confirmed" name="Confirmées" stroke="#82ca9d" />
                <Line type="monotone" dataKey="pending" name="En attente" stroke="#ffc658" />
                <Line type="monotone" dataKey="cancelled" name="Annulées" stroke="#ff8042" />
                <Line type="monotone" dataKey="total" name="Total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des revenus */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des revenus</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} XAF`} />
                <Legend />
                <Bar dataKey="total" name="Revenus" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des catégories */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par catégorie</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category__name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} événements`, props.payload.category__name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des méthodes de paiement */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par méthode de paiement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="payment_method"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} XAF`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableau des événements les plus performants */}
      {dashboardData?.event_summary?.events_details && dashboardData.event_summary.events_details.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Événements les plus performants
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Classement des événements par taux de remplissage
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscriptions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité max.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux de remplissage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.event_summary.events_details.map((event: any) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-600">
                        <a href={`/events/${event.id}`} target="_blank" rel="noopener noreferrer">
                          {event.title}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.registrations_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.max_capacity || 'Illimité'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.fill_rate ? `${event.fill_rate}%` : 'N/A'}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${event.fill_rate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
