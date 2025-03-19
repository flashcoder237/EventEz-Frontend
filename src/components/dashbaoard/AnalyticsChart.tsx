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