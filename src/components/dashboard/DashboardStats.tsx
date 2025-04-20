// components/dashboard/DashboardStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { analyticsAPI } from '@/lib/api';
import { AnalyticsDashboardSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

export default function DashboardStats() {
  const [stats, setStats] = useState<AnalyticsDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // Obtenir la session utilisateur
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });

  useEffect(() => {
    // Ne charger les données que si l'utilisateur est authentifié
    if (status !== 'authenticated' || !session) {
      return;
    }
    
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // S'assurer que l'ID de l'organisateur est inclus dans la requête
        const response = await analyticsAPI.getDashboardSummary({ 
          period,
          organizer_id: session.user.id
        });
        
        setStats(response.data);
      } catch (error: any) {
        console.error('Erreur de chargement des statistiques:', error);
        
        // Log détaillé de l'erreur
        if (error.response) {
          console.error('Détails de l\'erreur:', error.response.data);
          console.error('Statut:', error.response.status);
          console.error('Headers:', error.response.headers);
        }
    
        setError(error.response?.data?.detail || 'Une erreur est survenue lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [period, session, status]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-32 bg-white rounded-lg shadow-sm animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-4">Erreur de chargement</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
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
                <span> · <span className="text-indigo-500">{stats.event_summary.ongoing_events}</span> en cours</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full">
              <FaUsers className="h-4 w-4 text-indigo-500" />
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