const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth).token : null;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

export const api = {
  /* ✅ ADD THIS */
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => request("/users/me"),

  updateCurrentUser: (body: any) =>
    request("/users/me", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getColleges: () => request("/colleges"),

  createCollege: (body: any) =>
    request("/colleges", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getCafeterias: (collegeId: string) =>
    request(`/cafeterias?collegeId=${collegeId}`),

  createCafeteria: (body: any) =>
    request("/cafeterias", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    getMenu: async (cafeteriaId: string) => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/menu?cafeteriaId=${cafeteriaId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth") || "{}")?.token}`,
            },
          }
        );
      
        if (!res.ok) {
          throw new Error("Failed to fetch menu");
        }
      
        return res.json();
      },
};