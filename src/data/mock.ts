// Mock data store for BillZo (frontend-only skeleton)
export type InvoiceItem = {
  name: string;
  hsn?: string;
  qty: number;
  price: number;
  gst: number;
};

export type Invoice = {
  id: string;
  number: string;
  party: string;
  partyPhone?: string;
  amount: number;
  status: "synced" | "pending" | "failed";
  date: string;
  method: "upi" | "cash" | "udhar";
  items?: InvoiceItem[];
};

export const shopInfo = {
  name: "Ravi Electronics",
  address: "Shop 14, MG Road, Pune 411001",
  phone: "+91 98765 43210",
  gstin: "27ABCDE1234F1Z5",
  upiId: "ravielectronics@okaxis",
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  hsn?: string;
  gst: number;
};

export type Party = {
  id: string;
  name: string;
  phone: string;
  pending: number;
  type: "customer" | "supplier";
};

export const mockInvoices: Invoice[] = [
  { id: "1", number: "INV-0034", party: "Anjali Sharma",   partyPhone: "919876543210", amount: 4200,  status: "pending", date: "Today, 4:12 PM", method: "udhar",
    items: [
      { name: "Surf Excel 1kg", hsn: "3402", qty: 4, price: 245, gst: 18 },
      { name: "Aashirvaad Atta 5kg", hsn: "1101", qty: 8, price: 285, gst: 5 },
      { name: "Colgate Toothpaste", hsn: "3306", qty: 10, price: 95, gst: 18 },
    ]},
  { id: "2", number: "INV-0033", party: "Rahul Mehta",     partyPhone: "919812345678", amount: 1850,  status: "synced",  date: "Today, 3:48 PM", method: "upi",
    items: [
      { name: "Coca Cola 750ml", hsn: "2202", qty: 12, price: 40, gst: 28 },
      { name: "Haldiram Bhujia 200g", hsn: "2106", qty: 8, price: 70, gst: 12 },
      { name: "Britannia Bread", hsn: "1905", qty: 5, price: 50, gst: 5 },
    ]},
  { id: "3", number: "INV-0032", party: "Walk-in Customer", amount: 320,   status: "synced",  date: "Today, 3:30 PM", method: "cash",
    items: [
      { name: "Amul Milk 500ml", hsn: "0401", qty: 4, price: 32, gst: 0 },
      { name: "Maggi 70g", hsn: "1902", qty: 8, price: 14, gst: 12 },
      { name: "Parle-G Biscuit 100g", hsn: "1905", qty: 8, price: 10, gst: 5 },
    ]},
  { id: "4", number: "INV-0031", party: "Priya Stores",    partyPhone: "919988776655", amount: 12400, status: "failed",  date: "Today, 2:15 PM", method: "upi" },
  { id: "5", number: "INV-0030", party: "Kumar General",   amount: 870,   status: "synced",  date: "Today, 1:02 PM", method: "cash" },
  { id: "6", number: "INV-0029", party: "Sita Devi",       partyPhone: "919898912121", amount: 2100,  status: "synced",  date: "Today, 12:40 PM", method: "upi" },
  { id: "7", number: "INV-0028", party: "Mohan Traders",   partyPhone: "919765432109", amount: 6710,  status: "failed",  date: "Today, 11:22 AM", method: "udhar" },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Parle-G Biscuit 100g",  price: 10,   stock: 142, unit: "pc",  hsn: "1905", gst: 5 },
  { id: "p2", name: "Amul Milk 500ml",        price: 32,   stock: 56,  unit: "pc",  hsn: "0401", gst: 0 },
  { id: "p3", name: "Tata Salt 1kg",          price: 28,   stock: 78,  unit: "pc",  hsn: "2501", gst: 5 },
  { id: "p4", name: "Surf Excel 1kg",         price: 245,  stock: 22,  unit: "pc",  hsn: "3402", gst: 18 },
  { id: "p5", name: "Maggi 70g",              price: 14,   stock: 220, unit: "pc",  hsn: "1902", gst: 12 },
  { id: "p6", name: "Coca Cola 750ml",        price: 40,   stock: 48,  unit: "pc",  hsn: "2202", gst: 28 },
  { id: "p7", name: "Britannia Bread",        price: 50,   stock: 18,  unit: "pc",  hsn: "1905", gst: 5 },
  { id: "p8", name: "Aashirvaad Atta 5kg",    price: 285,  stock: 12,  unit: "pc",  hsn: "1101", gst: 5 },
  { id: "p9", name: "Colgate Toothpaste",     price: 95,   stock: 34,  unit: "pc",  hsn: "3306", gst: 18 },
  { id: "p10", name: "Haldiram Bhujia 200g",  price: 70,   stock: 60,  unit: "pc",  hsn: "2106", gst: 12 },
  { id: "p11", name: "Dettol Soap 75g",       price: 38,   stock: 88,  unit: "pc",  hsn: "3401", gst: 18 },
  { id: "p12", name: "Tropicana Juice 1L",    price: 110,  stock: 26,  unit: "pc",  hsn: "2009", gst: 12 },
];

export const mockParties: Party[] = [
  { id: "c1", name: "Anjali Sharma",  phone: "98765 43210", pending: 4200, type: "customer" },
  { id: "c2", name: "Rahul Mehta",    phone: "98123 45678", pending: 0,    type: "customer" },
  { id: "c3", name: "Priya Stores",   phone: "99887 76655", pending: 12400, type: "customer" },
  { id: "c4", name: "Mohan Traders",  phone: "97654 32109", pending: 6710,  type: "customer" },
  { id: "c5", name: "Sita Devi",      phone: "98989 12121", pending: 0,     type: "customer" },
  { id: "s1", name: "ABC Wholesale",  phone: "98000 11111", pending: 0,     type: "supplier" },
];

export const todayStats = {
  revenue: 28450,
  invoiceCount: 34,
  pendingAmount: 23310,
  syncedCount: 32,
  failedCount: 2,
};

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
