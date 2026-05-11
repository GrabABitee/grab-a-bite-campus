import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/*
--------------------------------
AXIOS INSTANCE
--------------------------------
*/
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
--------------------------------
ATTACH TOKEN AUTOMATICALLY
--------------------------------
*/
axiosInstance.interceptors.request.use((config) => {

  const auth = localStorage.getItem("auth");

  const token = auth
    ? JSON.parse(auth).token
    : null;

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

/*
--------------------------------
API METHODS
--------------------------------
*/
export const api = {

  /* ===================================== */
  /* GENERIC */
  /* ===================================== */

  get: async (url: string) => {
    const res =
      await axiosInstance.get(url);

    return res.data;
  },

  post: async (
    url: string,
    body: any
  ) => {

    const res =
      await axiosInstance.post(
        url,
        body
      );

    return res.data;
  },

  put: async (
    url: string,
    body?: any
  ) => {

    const res =
      await axiosInstance.put(
        url,
        body
      );

    return res.data;
  },

  patch: async (
    url: string,
    body?: any
  ) => {

    const res =
      await axiosInstance.patch(
        url,
        body
      );

    return res.data;
  },

  delete: async (url: string) => {

    const res =
      await axiosInstance.delete(url);

    return res.data;
  },

  /* ===================================== */
  /* AUTH */
  /* ===================================== */

  login: async (
    email: string,
    password: string
  ) => {

    const res =
      await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    return res.data;
  },

  /* ===================================== */
  /* USER */
  /* ===================================== */

  getCurrentUser: async () => {

    const res =
      await axiosInstance.get(
        "/users/me"
      );

    return res.data;
  },

  updateCurrentUser: async (
    body: any
  ) => {

    const res =
      await axiosInstance.put(
        "/users/me",
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* COLLEGES */
  /* ===================================== */

  getColleges: async () => {

    const res =
      await axiosInstance.get(
        "/colleges"
      );

    return res.data;
  },

  createCollege: async (
    body: any
  ) => {

    const res =
      await axiosInstance.post(
        "/colleges",
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* CAFETERIAS */
  /* ===================================== */

  getCafeterias: async (
    collegeId: string
  ) => {

    const res =
      await axiosInstance.get(
        `/cafeterias?collegeId=${collegeId}`
      );

    return res.data;
  },

  getCafeteria: async (
    id: string
  ) => {

    const res =
      await axiosInstance.get(
        `/cafeterias/${id}`
      );

    return res.data;
  },

  toggleKitchen: async (
    id: string
  ) => {

    const res =
      await axiosInstance.put(
        `/cafeterias/${id}/toggle-kitchen`
      );

    return res.data;
  },

  createCafeteria: async (
    body: any
  ) => {

    const res =
      await axiosInstance.post(
        "/cafeterias",
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* MENU */
  /* ===================================== */

  getMenu: async (
    cafeteriaId: string
  ) => {

    const res =
      await axiosInstance.get(
        `/menu-items?cafeteriaId=${cafeteriaId}`
      );

    return res.data;
  },

  createMenuItemsBulk: async (
    body: any
  ) => {

    const res =
      await axiosInstance.post(
        "/menu-items/bulk",
        body
      );

    return res.data;
  },

  updateMenuItem: async (
    id: string,
    body: any
  ) => {

    const res =
      await axiosInstance.put(
        `/menu-items/${id}`,
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* TIMINGS */
  /* ===================================== */

  getTimings: async (
    cafeteriaId: string
  ) => {

    const res =
      await axiosInstance.get(
        `/timings?cafeteriaId=${cafeteriaId}`
      );

    return res.data;
  },

  updateTimings: async (
    cafeteriaId: string,
    body: any
  ) => {

    const res =
      await axiosInstance.put(
        `/timings?cafeteriaId=${cafeteriaId}`,
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* STANDARD MENU */
  /* ===================================== */

  getStandardMenuItems: async () => {

    const res =
      await axiosInstance.get(
        "/standard-menu-items"
      );

    return res.data;
  },

  createStandardMenuItem: async (
    body: any
  ) => {

    const res =
      await axiosInstance.post(
        "/standard-menu-items",
        body
      );

    return res.data;
  },

  createStandardMenuBulk: async (
    body: any[]
  ) => {

    const res =
      await axiosInstance.post(
        "/standard-menu-items/bulk",
        body
      );

    return res.data;
  },

  /* ===================================== */
  /* ORDERS */
  /* ===================================== */

  placeOrder: async (
    data: any
  ) => {

    const res =
      await axiosInstance.post(
        "/orders",
        data
      );

    return res.data;
  },

  getOrders: async () => {

    const res =
      await axiosInstance.get(
        "/orders"
      );

    return res.data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ) => {

    const res =
      await axiosInstance.patch(
        `/orders/${orderId}/status`,
        { status }
      );

    return res.data;
  },

};