// components/dashboard/AnalyticsChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select } from '../ui/Select';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface AnalyticsChartProps {
  eventId?: string;
  chartType: 'revenue' | 'registrations' | 'visitors';
  title: string;
}

export default function AnalyticsChart({ eventId, chartType, title }: AnalyticsChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<'day' | 'week' | 'month'>('day');
  const [periods, setPeriods] = useState(30);
  const { data: session } = useSession();
  
  useEffect(() => {
    if (!session || !session.accessToken) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        
        switch (chartType) {
          case 'revenue':
            response = await analyticsAPI.getRevenueAnalytics({
              analysis_type: 'trends',
              interval,
              periods,
              event_id: eventId,
              organizer_id: session?.user?.id
            });
            break;
          case 'registrations':
            response = await analyticsAPI.getRegistrationAnalytics({
              analysis_type: 'trends',
              interval,
              periods,
              event_id: eventId,
              organizer_id: session?.user?.id
            });
            break;
          case 'visitors':
            response = await analyticsAPI.getVisitorAnalytics({
              analysis_type: 'trends',
              interval,
              periods,
              event_id: eventId,
              organizer_id: session?.user?.id
            });
            break;
        }
        
        if (response && response.data) {
          // Format data for the chart
          const formattedData = formatChartData(response.data, chartType);
          setData(formattedData);
        }
      } catch (error: any) {
        console.error(`Error fetching ${chartType} data:`, error);
        setError(error.response?.data?.detail || `Une erreur est survenue lors du chargement des données de ${chartType}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [chartType, eventId, interval, periods, session]);
  
  // Helper function to format the data for the charts
  const formatChartData = (responseData: any, type: string) => {
    if (!responseData || !responseData.trends || !responseData.trends.data) {
      return [];
    }
    
    return responseData.trends.data.map((item: any) => {
      // Format date based on interval
      let formattedDate;
      if (interval === 'day') {
        formattedDate = formatDate(item.period, 'dd/MM');
      } else if (interval === 'week') {
        formattedDate = `S${item.period.split('-W')[1]}`;
      } else {
        formattedDate = formatDate(item.period + '-01', 'MMM yyyy');
      }
      
      // Return formatted data object
      return {
        name: formattedDate,
        value: type === 'revenue' ? item.total : item.count,
        confirmed: item.confirmed,
        pending: item.pending,
        cancelled: item.cancelled
      };
    });
  };
  
  // Error screen
  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 bg-red-50 rounded flex items-center justify-center">
            <p className="text-red-500 text-center px-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Loading screen
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
  
  // Render charts based on type
  const renderChart = () => {
    if (data.length === 0) {
      return (
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      );
    }
    
    switch (chartType) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, 'XAF', true)}
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number, 'XAF'), 'Revenu']}
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6d28d9" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#6d28d9' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'registrations':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis width={40} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="confirmed" name="Confirmées" fill="#4ade80" />
              <Bar dataKey="pending" name="En attente" fill="#facc15" />
              <Bar dataKey="cancelled" name="Annulées" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'visitors':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis width={40} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
                name="Visiteurs"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };
  
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
        {renderChart()}
      </CardContent>
    </Card>
  );
}