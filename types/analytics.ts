export interface AnalyticsDashboardSummary {
    event_summary: {
      total_events: number;
      upcoming_events: number;
      ongoing_events: number;
      completed_events: number;
      event_types: Array<{ event_type: string; count: number }
  
  export interface AnalyticsReport {
    id: number;
    title: string;
    description?: string;
    report_type: 'event_performance' | 'revenue_summary' | 'user_activity' | 'registration_trends' | 'payment_analysis' | 'custom';
    data: Record<string, any>;
    filters: Record<string, any>;
    created_at: string;
    updated_at: string;
    generated_by: string;
    event?: string;
    is_scheduled: boolean;
    schedule_frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    last_run?: string;
    next_run?: string;
    email_on_generation: boolean;
    export_format: 'pdf' | 'csv' | 'json';
  }
  
  export interface Dashboard {
    id: number;
    title: string;
    description?: string;
    layout: Record<string, any>;
    theme: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    owner: number;
    shared_with: number[];
    widgets_count: string;
  }
  
  export interface DashboardWidget {
    id: number;
    title: string;
    description?: string;
    widget_type: 'number' | 'chart' | 'table' | 'map' | 'list';
    chart_type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar' | 'scatter';
    data_source: 'event_count' | 'registration_count' | 'revenue' | 'user_count' | 'event_types' | 
                 'payment_methods' | 'revenue_trends' | 'registration_trends' | 'geographical' | 'custom_query';
    config: Record<string, any>;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    user: number;
    shared_with: number[];
  }>;
      categories: Array<{ category__name: string; count: number }>;
      avg_fill_rate: number;
      events_details: Array<{
        id: string;
        title: string;
        registrations_count: number;
        max_capacity: number;
        fill_rate: number;
      }>;
    };
    revenue_summary: {
      total_revenue: number;
      avg_transaction: number;
      payment_count: number;
      revenue_by_method: Array<{
        payment_method: string;
        total: number;
        count: number;
        percentage: number;
      }>;
      revenue_distribution: {
        usage_based_revenue: number;
        ticket_sales_revenue: number;
        usage_percentage: number;
        ticket_percentage: number;
      };
      revenue_by_period: {
        type: 'daily' | 'monthly';
        data: Array<{
          period: string;
          total: number;
          count: number;
        }>;
      };
    };
    registration_summary: {
      summary: {
        total_registrations: number;
        confirmed_registrations: number;
        pending_registrations: number;
        cancelled_registrations: number;
        conversion_rate: number;
      };
      registration_types: Array<{
        registration_type: string;
        count: number;
        percentage: number;
      }>;
      trends: {
        interval: string;
        data: Array<{
          period: string;
          total: number;
          confirmed: number;
          pending: number;
          cancelled: number;
        }>;
      };
    };
  }