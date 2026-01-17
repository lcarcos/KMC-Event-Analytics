export interface RawOrder {
  "Número de pedido": string;
  "Estado del pedido": string;
  "Fecha del pedido": string;
  "Nota del cliente": string;
  "Nombre": string;
  "Apellidos": string;
  "Ciudad": string;
  "Correo electrónico": string;
  "Teléfono": string;
  "Método de pago": string;
  "Subtotal": string;
  "Cantidad": string;
  "Importe total": string;
  "Otros campos de formulario": string;
}

export interface ProcessedOrder {
  id: string;
  status: string;
  date: Date;
  customerName: string;
  city: string;
  email: string;
  paymentMethod: string;
  total: number;
  // Extracted fields
  hasTKCard: boolean;
  needsTranslation: boolean;
  marketingConsent: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  tkCardHolders: number;
  translationRequests: number;
}