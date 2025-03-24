// events.ts
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



  // src/types/events.ts - Extensions

// Types pour les types de billets
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
  created_at?: string;
  updated_at?: string;
}

export interface TicketTypeCreate {
  event: string;
  name: string;
  description?: string;
  price: number;
  quantity_total: number;
  sales_start: string;
  sales_end: string;
  is_visible?: boolean;
  max_per_order?: number;
  min_per_order?: number;
}

// Types pour les champs de formulaire
export interface FormField {
  id: number;
  event: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'select' | 'checkbox' | 'radio' | 'file';
  required: boolean;
  placeholder: string;
  help_text: string;
  options: string | string[];
  order: number;
  created_at?: string;
  updated_at?: string;
}


export interface FormFieldCreate {
  event: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'select' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  help_text?: string;
  options?: string;
  order?: number;
}

// Types étendus pour la création et mise à jour d'événements
export interface EventCreate {
  title: string;
  description: string;
  short_description?: string;
  event_type: 'billetterie' | 'inscription';
  category: number;
  tags?: number[];
  start_date: string;
  end_date: string;
  registration_deadline?: string | null;
  location_name: string;
  location_address: string;
  location_city: string;
  location_country: string;
  location_latitude?: number;
  location_longitude?: number;
  banner_image?: File;
  max_capacity?: number | null;
  is_featured?: boolean;
  status?: 'draft' | 'published';
}

export interface EventUpdate extends Partial<EventCreate> {
  id: string;
}

// Type pour la prévisualisation des événements
export interface EventPreview {
  id?: string;
  title: string;
  short_description?: string;
  event_type: 'billetterie' | 'inscription';
  start_date: string;
  end_date: string;
  location_name: string;
  location_city: string;
  category: { id: number; name: string };
  ticket_types?: TicketType[];
  form_fields?: FormField[];
  banner_image_preview?: string;
}

export interface EventSearchParams {
  search?: string;
  category?: string;
  event_type?: string;
  city?: string;
  status?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}