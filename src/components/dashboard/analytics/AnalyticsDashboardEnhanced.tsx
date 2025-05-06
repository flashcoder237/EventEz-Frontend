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
  Filter,
  Download
} from 'lucide-react';
import { analyticsAPI, eventsAPI } from '@/lib/api';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboardEnhanced() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [dashboardData, setDashboardData] = useState(null);
  const [registrationData, setRegistrationData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);

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
        
        let eventParams = {};
        if (selectedEvent !== 'all') {
          eventParams = { event: selectedEvent };
        }
        
        const dashboardResponse = await analyticsAPI.getDashboardSummary({
          ...dateParams,
          ...eventParams
        });
        
        setDashboardData(dashboardResponse.data);
        
        if (dashboardResponse.data) {
          if (dashboardResponse.data.registration_summary?.trends?.data) {
            setRegistrationData(dashboardResponse.data.registration_summary.trends.data);
          }
          if (dashboardResponse.data.revenue_summary?.revenue_by_period?.data) {
            setRevenueData(dashboardResponse.data.revenue_summary.revenue_by_period.data);
          }
          if (dashboardResponse.data.event_summary?.categories) {
            setCategoryData(dashboardResponse.data.event_summary.categories);
          }
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

  const handleExport = () => {
    if (!dashboardData) return;
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analytics-dashboard-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      {/* Filters and export */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
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
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Download className="mr-2 h-5 w-5" />
          Exporter les données
        </button>
      </div>

      {/* General stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <Calendar className="h-6 w-6 text-purple-600 mr-4" />
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Événements</dt>
            <dd className="text-lg font-medium text-gray-900">{dashboardData?.event_summary?.total_events || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <Users className="h-6 w-6 text-indigo-600 mr-4" />
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Inscriptions</dt>
            <dd className="text-lg font-medium text-gray-900">{dashboardData?.registration_summary?.summary?.total_registrations || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <CreditCard className="h-6 w-6 text-green-600 mr-4" />
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Revenus</dt>
            <dd className="text-lg font-medium text-gray-900">{(dashboardData?.revenue_summary?.total_revenue || 0).toLocaleString()} XAF</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <Eye className="h-6 w-6 text-yellow-600 mr-4" />
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Taux de conversion</dt>
            <dd className="text-lg font-medium text-gray-900">{dashboardData?.registration_summary?.summary?.conversion_rate || 0}%</dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des inscriptions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des revenus</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

      {/* Top performing events table */}
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
                {dashboardData.event_summary.events_details.map((event) => (
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
