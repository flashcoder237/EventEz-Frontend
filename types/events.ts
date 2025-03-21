// Types pour les événements
export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    event_type: 'billetterie' | 'inscription';
    start_date: string;
    end_date: string;
    registration_deadline?: string;
    location_name: string;
    location_address: string;
    location_city: string;
    location_country: string;
    location_latitude?: number;
    location_longitude?: number;
    banner_image?: string;
    status: 'draft' | 'published' | 'validated' | 'completed' | 'cancelled';
    is_featured: boolean;
    view_count: number;
    registration_count: number;
    created_at: string;
    updated_at: string;
    form_storage_usage?: number;
    form_active_days?: number;
    category: Category;
    tags: Tag[];
    organizer: number;
    organizer_name?: string;
    ticket_price_range?: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
    image?: string;
  }
  
  export interface Tag {
    id: number;
    name: string;
  }
  
  export interface TicketType {
    id: number;
    event: string;
    name: string;
    description: string;
    price: number;
    quantity_total: number;
    quantity_sold: number;
    available_quantity: number;
    sales_start: string;
    sales_end: string;
    is_visible: boolean;
    max_per_order: number;
    min_per_order: number;
  }
  
  export interface FormField {
    id: number;
    event: string;
    label: string;
    field_type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'select' | 'checkbox' | 'radio' | 'file';
    required: boolean;
    placeholder: string;
    help_text: string;
    options: string;
    order: number;
  }
  
  export interface EventImage {
    id: number;
    image: string;
    caption: string;
  }
  
  export interface EventList {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    event_type: 'billetterie' | 'inscription';
    start_date: string;
    end_date: string;
    location_city: string;
    banner_image?: string;
    category: Category;
    organizer_name: string;
    tags: Tag[];
    ticket_price_range: string;
    status: 'draft' | 'published' | 'validated' | 'completed' | 'cancelled';
    is_featured: boolean;
    registration_count: number;
  }