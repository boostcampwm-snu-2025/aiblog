const BASE_URL = "/api";

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

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = new Error(`HTTP Error: ${response.status}`);
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json();
};
