/**
 * localStorage-backed store for integration configs + per-provider health.
 * Mirrors the pattern used by useStore.ts.
 */
import { useSyncExternalStore } from "react";
import type { IntegrationsConfig, ProviderHealth, ProviderId } from "./types";

type State = {
  config: IntegrationsConfig;
  health: Record<ProviderId, ProviderHealth>;
};

const KEY = "billzo_integrations_v1";

const seed = (): State => ({
  config: {
    frappe:   { enabled: false, baseUrl: "http://localhost:8000", defaultCompany: "Ravi Electronics" },
    whatsapp: { enabled: false, provider: "meta_cloud" },
    upi:      { enabled: false, provider: "razorpay" },
    gst:      { enabled: false, gsp: "cleartax", gstin: "27ABCDE1234F1Z5" },
    sms:      { enabled: false, provider: "twilio" },
  },
  health: {
    frappe:   { status: "disabled" },
    whatsapp: { status: "disabled" },
    upi:      { status: "disabled" },
    gst_irp:  { status: "disabled" },
    sms:      { status: "disabled" },
  },
});

const read = (): State => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    const base = seed();
    return { config: { ...base.config, ...parsed.config }, health: { ...base.health, ...parsed.health } };
  } catch { return seed(); }
};

let state: State = read();
const listeners = new Set<() => void>();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ } };
const setState = (next: Partial<State>) => {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export const useIntegrations = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

export const integrationsApi = {
  getState: () => state,
  updateConfig: <K extends keyof IntegrationsConfig>(key: K, patch: IntegrationsConfig[K]) =>
    setState({ config: { ...state.config, [key]: { ...state.config[key], ...patch } } }),
  setHealth: (key: ProviderId, h: ProviderHealth) =>
    setState({ health: { ...state.health, [key]: h } }),
};
