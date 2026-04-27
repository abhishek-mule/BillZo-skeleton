import { useEffect, useState } from "react";

export type DefaultDeliveryAction = "whatsapp" | "print" | "ask";
export type PrintFormat = "thermal58" | "thermal80" | "a4";

export type Prefs = {
  defaultAction: DefaultDeliveryAction;
  autoPrint: boolean;
  printFormat: PrintFormat;
};

const KEY = "billzo_prefs_v1";
const DEFAULTS: Prefs = {
  defaultAction: "whatsapp",
  autoPrint: false,
  printFormat: "thermal80",
};

const read = (): Prefs => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

export const usePrefs = () => {
  const [prefs, setPrefs] = useState<Prefs>(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* noop */ }
  }, [prefs]);

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [key]: value }));

  return { prefs, update };
};
