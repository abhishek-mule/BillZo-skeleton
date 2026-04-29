import { useSyncExternalStore } from "react";
import {
  mockInvoices,
  mockProducts,
  mockParties,
  type Invoice,
  type Product,
  type Party,
} from "@/data/mock";

/**
 * Tiny localStorage-backed store for BillZo.
 * Single source of truth for invoices, products, parties.
 * Survives refresh; broadcasts changes via subscriber list + storage events.
 */

type State = {
  invoices: Invoice[];
  products: Product[];
  parties: Party[];
  invoiceCounter: number;
};

const KEY = "billzo_store_v2";

const seed = (): State => ({
  invoices: [...mockInvoices],
  products: [...mockProducts],
  parties: [...mockParties],
  invoiceCounter: 35, // continues from INV-0034
});

const read = (): State => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
};

let state: State = read();
const listeners = new Set<() => void>();

const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ }
};

const setState = (next: Partial<State>) => {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      try {
        state = { ...seed(), ...JSON.parse(e.newValue) };
        listeners.forEach((l) => l());
      } catch { /* noop */ }
    }
  });
}

// ---------- Public API ----------

export const useStore = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

export const storeApi = {
  getState: () => state,

  resetToMocks: () => setState(seed()),

  clearAll: () =>
    setState({ invoices: [], products: [], parties: [], invoiceCounter: 1 }),

  /** Create a new invoice from POS cart. Updates party balance for udhar. */
  createInvoice: (input: Omit<Invoice, "id" | "number" | "date" | "status">): Invoice => {
    const num = state.invoiceCounter;
    const inv: Invoice = {
      id: `inv-${Date.now()}`,
      number: `INV-${String(num).padStart(4, "0")}`,
      date: "Just now",
      status: "pending",
      ...input,
    };

    // Update udhar balance on existing party
    let parties = state.parties;
    if (inv.method === "udhar" && inv.party !== "Walk-in Customer") {
      const idx = parties.findIndex((p) => p.name === inv.party);
      if (idx >= 0) {
        parties = parties.map((p, i) =>
          i === idx ? { ...p, pending: p.pending + inv.amount } : p,
        );
      }
    }

    setState({
      invoices: [inv, ...state.invoices],
      invoiceCounter: num + 1,
      parties,
    });
    return inv;
  },

  retryInvoice: (id: string) =>
    setState({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, status: "synced" as const } : i,
      ),
    }),

  retryAllFailed: () =>
    setState({
      invoices: state.invoices.map((i) =>
        i.status === "failed" ? { ...i, status: "synced" as const } : i,
      ),
    }),

  markPartyPaid: (partyId: string) =>
    setState({
      parties: state.parties.map((p) => (p.id === partyId ? { ...p, pending: 0 } : p)),
    }),
};
