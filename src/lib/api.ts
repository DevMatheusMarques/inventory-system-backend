// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Função genérica para requisições
async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ${res.status}: ${error}`);
  }

  return res.json();
}

/* ===============================
   USERS
=================================*/
export const UsersAPI = {
  login: (data: { email: string; password: string }) =>
    request("users/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request("users/me"),
  list: () => request("users"),
  create: (data: any) =>
    request("users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`users/${id}`, { method: "DELETE" }),
};

/* ===============================
   PRODUCTS
=================================*/
export const ProductsAPI = {
  list: () => request("products"),
  get: (id: string) => request(`products/${id}`),
  create: (data: any) =>
    request("products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`products/${id}`, { method: "DELETE" }),
};

/* ===============================
   CATEGORIES
=================================*/
export const CategoriesAPI = {
  list: () => request("categories"),
  create: (data: any) =>
    request("categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`categories/${id}`, { method: "DELETE" }),
};

/* ===============================
   SUPPLIERS
=================================*/
export const SuppliersAPI = {
  list: () => request("suppliers"),
  get: (id: string) => request(`suppliers/${id}`),
  create: (data: any) =>
    request("suppliers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`suppliers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`suppliers/${id}`, { method: "DELETE" }),
};

/* ===============================
   STOCK MOVEMENTS
=================================*/
export const StockMovementsAPI = {
  list: () => request("stock-movements"),
  create: (data: any) =>
    request("stock-movements", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`stock-movements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request(`stock-movements/${id}`, { method: "DELETE" }),
};

/* ===============================
   STOCK LOGS
=================================*/
export const StockLogsAPI = {
  list: () => request("stock-logs"),
  get: (id: string) => request(`stock-logs/${id}`),
};

/* ===============================
   PURCHASE ORDERS
=================================*/
export const PurchaseOrdersAPI = {
  list: () => request("purchase-orders"),
  get: (id: string) => request(`purchase-orders/${id}`),
  create: (data: any) =>
    request("purchase-orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request(`purchase-orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

/* ===============================
   NOTIFICATIONS
=================================*/
export const NotificationsAPI = {
  list: () => request("notifications"),
  markAsRead: (id: string) =>
    request(`notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    }),
};

/* ===============================
   AUDIT TRAIL
=================================*/
export const AuditTrailAPI = {
  list: () => request("audit-trail"),
  get: (id: string) => request(`audit-trail/${id}`),
};
