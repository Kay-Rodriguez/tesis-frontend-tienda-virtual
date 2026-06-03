const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-tienda-vit.onrender.com/api";

async function getAccessToken() {
  return localStorage.getItem("token") || "";
}

export async function apiRequest(endpoint, options = {}) {
  const token = await getAccessToken();

  const isFormData =
    options.body instanceof FormData;

  const normalizedEndpoint =
    endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

  const response = await fetch(
    `${API_URL}${normalizedEndpoint}`,
    {
      method: options.method || "GET",

      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },

      ...options,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        `Error HTTP ${response.status}`
    );

    error.status = response.status;
    error.backend = data;

    throw error;
  }

  return data;
}

export { API_URL };