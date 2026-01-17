import { RawOrder, ProcessedOrder, DashboardMetrics } from './types';

// Robust CSV Line Splitter that handles quoted fields with commas
export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  // Clean up quotes around values
  return result.map(val => val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
};

export const parseCSVData = (csvContent: string): ProcessedOrder[] => {
  const lines = csvContent.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const dataLines = lines.slice(1);

  return dataLines.map((line, index) => {
    const values = parseCSVLine(line);
    const rawOrder: any = {};
    headers.forEach((header, i) => {
      rawOrder[header] = values[i] || '';
    });

    // Extract details from "Otros campos de formulario"
    const otherFields = rawOrder["Otros campos de formulario"] || '';
    
    // Logic for extractions
    const hasTKCard = otherFields.includes("Tengo tarjeta TK");
    const needsTranslation = otherFields.includes("¿Necesitas Traducción? (Evento En Inglés): Si");
    
    let marketingConsent = "No especificado";
    if (otherFields.includes("Si, Por email y WhatsApp")) marketingConsent = "Email y WhatsApp";
    else if (otherFields.includes("Si, Por email")) marketingConsent = "Solo Email";
    else if (otherFields.includes("Si, Por WhatsApp")) marketingConsent = "Solo WhatsApp";
    else if (otherFields.includes("No, Gracias")) marketingConsent = "No Consiente";

    // Clean City Name (remove quotes or extra spaces if any)
    let city = rawOrder["Ciudad"].replace(/['"]+/g, '').trim();
    // Normalize city names (e.g., "Pozuelo De Alarcon" vs "Pozuelo de Alarcón")
    if (city.toLowerCase().includes("pozuelo")) city = "Pozuelo de Alarcón";
    if (city.toLowerCase().includes("las rozas")) city = "Las Rozas";
    if (city.toLowerCase().includes("madrid")) city = "Madrid";


    return {
      id: rawOrder["Número de pedido"],
      status: rawOrder["Estado del pedido"],
      date: new Date(rawOrder["Fecha del pedido"]),
      customerName: `${rawOrder["Nombre"]} ${rawOrder["Apellidos"]}`.replace(/['"]+/g, ''),
      city: city,
      email: rawOrder["Correo electrónico"],
      paymentMethod: rawOrder["Método de pago"],
      total: parseFloat(rawOrder["Importe total"]),
      hasTKCard,
      needsTranslation,
      marketingConsent
    };
  }).filter(order => order.id); // Filter out empty lines if any
};

export const calculateMetrics = (orders: ProcessedOrder[]): DashboardMetrics => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const tkCardHolders = orders.filter(o => o.hasTKCard).length;
  const translationRequests = orders.filter(o => o.needsTranslation).length;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    tkCardHolders,
    translationRequests
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};
