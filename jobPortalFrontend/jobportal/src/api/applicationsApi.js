import axiosClient from "./axiosClient";

export const applyApi = ({ jobId, userId }) =>
  axiosClient.post("/applications/apply", null, { params: { jobId, userId } });

export const withdrawApi = ({ applicationId, userId }) =>
  axiosClient.post(`/applications/${applicationId}/withdraw`, null, { params: { userId } });


export const listMyApplicationsApi = (userId) => {
  if (userId == null) {
    return Promise.reject(new Error("Missing userId. Please re-login."));
  }
  return axiosClient.get("/applications/me", { params: { userId } });
};