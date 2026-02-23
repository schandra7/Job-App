// src/api/managerApplicationsApi.js
import axiosClient from "./axiosClient";

export const listPendingApi = () =>
  axiosClient.get("/manager/applications/pending");

export const listByDecisionApi = (decision) =>
  axiosClient.get("/manager/applications", { params: { decision } });

export const approveApi = (id, note, managerId) =>
  axiosClient.post(`/manager/applications/${id}/approve`, null, { params: { note, managerId } });

export const rejectApi = (id, note, managerId) =>
  axiosClient.post(`/manager/applications/${id}/reject`, null, { params: { note, managerId } });

export const holdApi = (id, note, managerId) =>
  axiosClient.post(`/manager/applications/${id}/hold`, null, { params: { note, managerId } });

export const markPendingApi = (id, note, managerId) =>
  axiosClient.post(`/manager/applications/${id}/pending`, null, { params: { note, managerId } });