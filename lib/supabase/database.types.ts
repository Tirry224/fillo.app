export type Database = {
  public: {
    Functions: {
      submit_public_request: {
        Args: {
          target_shop_slug: string;
          customer_name: string;
          customer_phone: string;
          request_text: string;
          request_photo_path?: string | null;
        };
        Returns: Record<string, string>;
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
    };
    Tables: {
      shops: {
        Row: {
          id: string;
          slug: string;
          name: string;
          initial: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          initial: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shops"]["Insert"]>;
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
      };
      clients: {
        Row: {
          id: string;
          shop_id: string;
          initials: string;
          name: string;
          phone: string;
          normalized_phone: string;
          color: "blue" | "orange" | "green";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["clients"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };
      client_requests: {
        Row: {
          id: string;
          shop_id: string;
          client_id: string;
          title: string;
          detail: string;
          message: string;
          photo_path: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["client_requests"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["client_requests"]["Insert"]
        >;
      };
      sales: {
        Row: {
          id: string;
          shop_id: string;
          client_id: string;
          request_id: string;
          product: string;
          message: string;
          status: "new" | "pending" | "completed" | "lost";
          photo_path: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["sales"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };
    };
  };
};
