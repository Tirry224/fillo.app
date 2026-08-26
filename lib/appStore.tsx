"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  clients as initialClients,
  requests as initialRequests,
  sales as initialSales,
  shops as initialShops,
  type Client,
  type ClientRequest,
  type ClientStatus,
  type Sale,
  type Shop,
} from "@/lib/mockData";

type Settings = {
  emailNotifications: boolean;
  shopName: string;
  phone: string;
  location: string;
  email: string;
};

type AppStore = {
  clients: Client[];
  requests: ClientRequest[];
  sales: Sale[];
  shop: Shop;
  settings: Settings;
  isAuthenticated: boolean;
  register: (
    phone: string,
    shopName: string,
    password: string,
  ) => Promise<boolean>;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addRequest: (input: {
    shopId: string;
    name: string;
    phone: string;
    request: string;
    photo?: string;
  }) => void;
  updateSaleStatus: (saleId: string, status: ClientStatus) => void;
  deleteSale: (saleId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  loadShopData: () => Promise<void>;
};

const AppStoreContext = createContext<AppStore | null>(null);

function createSlug(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "ma-boutique"
  );
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function phoneToEmail(phone: string) {
  const clean = normalizePhone(phone);
  return `${clean || "user"}@fillo.app`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [requestList, setRequestList] = useState<ClientRequest[]>(
    initialRequests.map((request, index) => ({
      ...request,
      id: `request-${index + 1}`,
      message: request.title,
    })),
  );
  const [saleList, setSaleList] = useState<Sale[]>(initialSales);
  const [shop, setShop] = useState<Shop>(
    initialShops[0] ?? {
      slug: "ma-boutique",
      name: "Ma boutique",
      initial: "M",
    },
  );
  const [currentShopId, setCurrentShopId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    shopName: initialShops[0]?.name ?? "Ma boutique",
    phone: "",
    location: "",
    email: "",
  });

  async function fetchShopData(userId: string) {
    try {
      const { data: memberData } = await supabase
        .from("shop_members")
        .select("shop_id, shops(id, slug, name, initial)")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (memberData && memberData.shops) {
        const dbShop = memberData.shops as unknown as {
          id: string;
          slug: string;
          name: string;
          initial: string;
        };
        setCurrentShopId(dbShop.id);
        const nextShop = {
          slug: dbShop.slug,
          name: dbShop.name,
          initial: dbShop.initial,
        };
        setShop(nextShop);
        setSettings((prev) => ({ ...prev, shopName: dbShop.name }));

        // Fetch clients
        const { data: clientsData } = await supabase
          .from("clients")
          .select("*")
          .eq("shop_id", dbShop.id);

        if (clientsData && clientsData.length > 0) {
          const mappedClients: Client[] = clientsData.map((c) => ({
            id: c.id,
            shopId: dbShop.slug,
            initials: c.initials,
            name: c.name,
            phone: c.phone,
            color: c.color as "blue" | "orange" | "green",
          }));
          setClientList(mappedClients);
        }

        // Fetch requests
        const { data: requestsData } = await supabase
          .from("client_requests")
          .select("*")
          .eq("shop_id", dbShop.id);

        if (requestsData && requestsData.length > 0) {
          const mappedRequests: ClientRequest[] = requestsData.map((r) => ({
            id: r.id,
            shopId: dbShop.slug,
            clientId: r.client_id,
            title: r.title,
            detail: r.detail,
            message: r.message,
            photo: r.photo_path ?? undefined,
          }));
          setRequestList(mappedRequests);
        }

        // Fetch sales
        const { data: salesData } = await supabase
          .from("sales")
          .select("*, clients(name)")
          .eq("shop_id", dbShop.id)
          .order("created_at", { ascending: false });

        if (salesData && salesData.length > 0) {
          const mappedSales: Sale[] = salesData.map((s) => ({
            id: s.id,
            shopId: dbShop.slug,
            clientId: s.client_id,
            clientName:
              (s.clients as unknown as { name: string } | null)?.name ??
              "Client",
            requestId: s.request_id,
            product: s.product,
            message: s.message,
            status: s.status as ClientStatus,
            photo: s.photo_path ?? undefined,
            createdAt: new Date(s.created_at).getTime(),
          }));
          setSaleList(mappedSales);
        }
      }
    } catch {
      // Fallback silently to initial mock data
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        void fetchShopData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        void fetchShopData(session.user.id);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function register(
    phone: string,
    shopName: string,
    password: string,
  ): Promise<boolean> {
    try {
      const email = phoneToEmail(phone);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        const nextShop = {
          slug: createSlug(shopName),
          name: shopName,
          initial: shopName.trim().charAt(0).toUpperCase() || "F",
        };
        setShop(nextShop);
        setSettings((current) => ({ ...current, shopName, phone }));
        setIsAuthenticated(true);
        return true;
      }

      const slug = createSlug(shopName);
      const { error: rpcError } = await supabase.rpc("register_shop", {
        shop_name: shopName,
        shop_slug: slug,
      });

      if (rpcError) {
        const nextShop = {
          slug,
          name: shopName,
          initial: shopName.trim().charAt(0).toUpperCase() || "F",
        };
        setShop(nextShop);
        setSettings((current) => ({ ...current, shopName, phone }));
        setIsAuthenticated(true);
        return true;
      }

      setIsAuthenticated(true);
      await fetchShopData(authData.user.id);
      return true;
    } catch {
      return false;
    }
  }

  async function login(phone: string, password: string): Promise<boolean> {
    try {
      const email = phoneToEmail(phone);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return false;
      }

      setIsAuthenticated(true);
      await fetchShopData(data.user.id);
      return true;
    } catch {
      return false;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  }

  function addRequest(input: {
    shopId: string;
    name: string;
    phone: string;
    request: string;
    photo?: string;
  }) {
    const normalizedPhone = normalizePhone(input.phone);
    const existingClient = clientList.find(
      (client) =>
        client.shopId === input.shopId &&
        normalizePhone(client.phone) === normalizedPhone,
    );
    const client = existingClient ?? {
      id: `client-${Date.now()}`,
      shopId: input.shopId,
      initials: input.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      name: input.name,
      phone: input.phone,
      color: "blue" as const,
    };

    if (!existingClient) setClientList((current) => [...current, client]);
    const requestId = `request-${Date.now()}`;
    setRequestList((current) => [
      {
        id: requestId,
        shopId: input.shopId,
        clientId: client.id,
        title: input.request,
        detail: "Reçu à l'instant via le formulaire client",
        message: input.request,
        photo: input.photo,
      },
      ...current,
    ]);
    setSaleList((current) => [
      {
        id: `FL-${Date.now()}`,
        shopId: input.shopId,
        clientId: client.id,
        clientName: client.name,
        requestId,
        product: input.request,
        message: input.request,
        status: "new",
        photo: input.photo,
        createdAt: Date.now(),
      },
      ...current,
    ]);
  }

  function updateSaleStatus(saleId: string, status: ClientStatus) {
    setSaleList((current) =>
      current.map((sale) =>
        sale.id === saleId && sale.shopId === shop.slug
          ? { ...sale, status }
          : sale,
      ),
    );

    if (currentShopId) {
      void supabase.from("sales").update({ status }).eq("id", saleId);
    }
  }

  function deleteSale(saleId: string) {
    setSaleList((current) =>
      current.filter(
        (sale) => !(sale.id === saleId && sale.shopId === shop.slug),
      ),
    );

    if (currentShopId) {
      void supabase.from("sales").delete().eq("id", saleId);
    }
  }

  function updateSettings(updates: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...updates }));
    const shopName = updates.shopName;
    if (shopName) {
      setShop((current) => ({ ...current, name: shopName }));
      if (currentShopId) {
        void supabase
          .from("shops")
          .update({
            name: shopName,
            initial: shopName.trim().charAt(0).toUpperCase() || "F",
          })
          .eq("id", currentShopId);
      }
    }
  }

  async function loadShopData() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchShopData(session.user.id);
    }
  }

  return (
    <AppStoreContext.Provider
      value={{
        clients: clientList.filter((client) => client.shopId === shop.slug),
        requests: requestList.filter((request) => request.shopId === shop.slug),
        sales: saleList.filter((sale) => sale.shopId === shop.slug),
        shop,
        settings,
        isAuthenticated,
        register,
        login,
        logout,
        addRequest,
        updateSaleStatus,
        deleteSale,
        updateSettings,
        loadShopData,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }
  return store;
}
