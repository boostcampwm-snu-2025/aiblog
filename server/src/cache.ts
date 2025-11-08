const MAX = 120;
const store = new Map<string, { etag?: string; body?: any; at: number }>();
export function get(key: string) { const v = store.get(key); if (!v) return; store.delete(key); store.set(key, v); return v; }
export function set(key: string, val: { etag?: string; body?: any }) {
  if (store.size >= MAX) store.delete(store.keys().next().value as string);
  store.set(key, { ...val, at: Date.now() });
}