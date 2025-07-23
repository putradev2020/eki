export interface Database {
  public: {
    Tables: {
      event_categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          bg_color: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          color: string;
          bg_color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          bg_color?: string;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          location: string;
          category_id: string;
          external_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          location: string;
          category_id: string;
          external_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          category_id?: string;
          external_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}