import axiosClient from "./axiosClient";

export const createJobApi = (job) => axiosClient.post("/admin/jobs", job);
export const updateJobApi = (id, job) => axiosClient.put(`/admin/jobs/${id}`, job);
export const deleteJobApi = (id) => axiosClient.delete(`/admin/jobs/${id}`);
export const closeJobApi = (id) => axiosClient.patch(`/admin/jobs/${id}/close`);