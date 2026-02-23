import axiosClient from "./axiosClient";

export const registerApi = (payload) => axiosClient.post("/api/auth/register", payload);
export const loginApi = (payload) => axiosClient.post("/api/auth/login", payload);