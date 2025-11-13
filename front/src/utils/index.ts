export const getApiBase = () => {
  const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as
    | string
    | undefined;
  return envBase && envBase.length > 0
    ? envBase.replace(/\/$/, "")
    : "http://0.0.0.0:11111/api";
};
