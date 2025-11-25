import { HttpError } from "./error";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in .env file");
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json();
};

export const getRequest = async <T = unknown>(url: string) => {
  const resp = await fetch(`${BASE_URL}${url}`, { method: "GET" });
  return handleResponse<T>(resp);
};

export const postRequest = async <T = unknown, D = unknown>(url: string, data: D) => {
  const resp = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(resp);
};

export const putRequest = async <T = unknown, D = unknown>(url: string, data: D) => {
  const resp = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(resp);
};

export const deleteRequest = async <T = unknown>(url: string) => {
  const resp = await fetch(`${BASE_URL}${url}`, { method: "DELETE" });
  return handleResponse<T>(resp);
};
