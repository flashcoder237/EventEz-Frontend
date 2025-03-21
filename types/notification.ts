export interface Notification {
    id: string;
    user: string | number;
    title: string;
    message: string;
    notification_type: 'event_update' | 'registration_confirmation' | 'payment_confirmation' | 'event_reminder' | 'system_message' | 'custom_message';
    related_object_id?: string;
    related_object_type?: string;
    channel: 'email' | 'sms' | 'push' | 'in_app';
    is_read: boolean;
    is_sent: boolean;
    created_at: string;
    scheduled_for?: string;
    sent_at?: string;
    read_at?: string;
    email_subject?: string;
    phone_number?: string;
    extra_data?: Record<string, any>;
  }
  
  export interface NotificationTemplate {
    id: number;
    name: string;
    notification_type: 'event_update' | 'registration_confirmation' | 'payment_confirmation' | 'event_reminder' | 'system_message' | 'custom_message';
    email_subject: string;
    email_body: string;
    sms_body: string;
    push_title: string;
    push_body: string;
    in_app_title: string;
    in_app_body: string;
    available_variables: string;
    created_at: string;
    updated_at: string;
  }