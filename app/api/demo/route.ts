import { NextResponse } from "next/server";
import {
  clients as initialClients,
  requests as initialRequests,
  sales as initialSales,
  shops as initialShops,
  type Client,
  type Sale,
  type Shop,
} from "@/lib/mockData";

type DemoRequest = {
  id: string;
  clientId: string;
  title: string;
  detail: string;
};

type DemoState = {
  clients: Client[];
  requests: DemoRequest[];
  sales: Sale[];
  shops: Shop[];
};

type ApiBody = {
  resource?: keyof DemoState;
  id?: string;
  data?: Record<string, unknown>;
};

const state: DemoState = {
  clients: structuredClone(initialClients),
  requests: initialRequests.map((request, index) => ({
    ...request,
    id: `request-${index + 1}`,
  })),
  sales: structuredClone(initialSales),
  shops: structuredClone(initialShops),
};

function isResource(value: unknown): value is keyof DemoState {
  return (
    value === "clients" ||
    value === "requests" ||
    value === "sales" ||
    value === "shops"
  );
}

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  return response(state);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ApiBody;
  if (!isResource(body.resource) || !body.data) {
    return response({ error: "resource et data sont obligatoires" }, 400);
  }

  const item = { id: `${body.resource}-${Date.now()}`, ...body.data };
  state[body.resource].push(item as never);
  return response(item, 201);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as ApiBody;
  if (!isResource(body.resource) || !body.id || !body.data) {
    return response({ error: "resource, id et data sont obligatoires" }, 400);
  }

  const items = state[body.resource] as Array<{ id: string }>;
  const index = items.findIndex((item) => item.id === body.id);
  if (index === -1) return response({ error: "Ressource introuvable" }, 404);

  items[index] = { ...items[index], ...body.data };
  return response(items[index]);
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as ApiBody;
  if (!isResource(body.resource) || !body.id) {
    return response({ error: "resource et id sont obligatoires" }, 400);
  }

  const items = state[body.resource] as Array<{ id: string }>;
  const index = items.findIndex((item) => item.id === body.id);
  if (index === -1) return response({ error: "Ressource introuvable" }, 404);

  const [deleted] = items.splice(index, 1);
  return response({ deleted });
}
