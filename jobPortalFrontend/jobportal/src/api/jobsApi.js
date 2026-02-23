import axiosClient from "./axiosClient";

// published jobs before login or for regular users
export const getPublishedJobsApi = () => axiosClient.get("/jobs");
export const getPublishedJobApi = (id) => axiosClient.get(`/jobs/${id}`);

// Admin list 
export const getAdminJobsApi = () => axiosClient.get("/admin/jobs");