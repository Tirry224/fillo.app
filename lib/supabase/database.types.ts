export type Database = {
  public: {
    Views: Record<string, never>;
    Functions: {
      get_public_shop: {
        Args: {
          shop_slug: string;
        };
        Returns: { name: string; initial: string }[];
      };
      submit_public_request: {
        Args: {
          target_shop_slug: string;
          customer_name: string;
          customer_phone: string;
          request_text: string;
          request_photos?: string[];
        };
        Returns: {
          request_id: string;
          client_id: string;
          shop_name: string;
          shop_email: string | null;
          email_notifications: boolean;
        };
      };
      register_shop: {
        Args: {
          shop_name: string;
          shop_slug: string;
        };
        Returns: {
          id: string;
          slug: string;
          name: string;
          initial: string;
        };
      };
      shop_reset_client_password: {
        Args: {
          target_client_id: string;
        };
        Returns: { temporary_password: string };
      };
      link_client_identity: {
        Args: {
          p_phone: string;
        };
        Returns: undefined;
      };
      resolve_client_login_email: {
        Args: {
          p_phone: string;
        };
        Returns: string | null;
      };
      get_recipient_push_subscriptions: {
        Args: {
          target_conversation_id: string;
        };
        Returns: Database["public"]["Tables"]["push_subscriptions"]["Row"][];
      };
      delete_push_subscription: {
        Args: {
          target_endpoint: string;
        };
        Returns: undefined;
      };
      submit_client_conversation_order: {
        Args: {
          target_conversation_id: string;
          request_text: string;
          request_photos?: string[];
        };
        Returns: { request_id: string };
      };
    };
    Tables: {
      shops: {
        Row: {
          id: string;
          slug: string;
          name: string;
          initial: string;
          phone: string | null;
          location: string | null;
          email: string | null;
          email_notifications: boolean | null;
          sale_counter: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          initial: string;
          phone?: string | null;
          location?: string | null;
          email?: string | null;
          email_notifications?: boolean | null;
          sale_counter?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shops"]["Insert"]>;
        Relationships: [];
      };
      shop_members: {
        Row: {
          shop_id: string;
          user_id: string;
          role: "owner" | "member";
          created_at: string;
        };
        Insert: {
          shop_id: string;
          user_id: string;
          role?: "owner" | "member";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shop_members"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "shop_members_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_feedback: {
        Row: {
          id: string;
          shop_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shop_feedback"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "shop_feedback_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          id: string;
          shop_id: string;
          initials: string;
          name: string;
          phone: string;
          normalized_phone: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["clients"]["Row"],
          "id" | "created_at" | "user_id"
        > & { id?: string; created_at?: string; user_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "clients_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
        ];
      };
      client_requests: {
        Row: {
          id: string;
          shop_id: string;
          client_id: string;
          title: string;
          detail: string;
          message: string;
          photos: string[];
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["client_requests"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["client_requests"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "client_requests_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_requests_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          id: string;
          shop_id: string;
          client_id: string;
          request_id: string;
          message: string;
          status: "new" | "pending" | "completed" | "lost";
          photos: string[];
          sale_number: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["sales"]["Row"],
          "id" | "created_at" | "sale_number"
        > & { id?: string; created_at?: string; sale_number?: number };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "sales_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "client_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          shop_id: string;
          client_id: string;
          last_message_at: string | null;
          shop_last_read_at: string | null;
          client_last_read_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["conversations"]["Row"],
          "id" | "created_at" | "last_message_at" | "shop_last_read_at" | "client_last_read_at"
        > & {
          id?: string;
          created_at?: string;
          last_message_at?: string | null;
          shop_last_read_at?: string | null;
          client_last_read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "conversations_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_role: "shop" | "client";
          sender_user_id: string;
          body: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["messages"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth_key: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["push_subscriptions"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
  };
};
