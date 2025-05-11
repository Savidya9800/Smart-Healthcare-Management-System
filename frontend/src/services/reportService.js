import axios from "axios";

const API = "http://localhost:5000/api/reports";

export const getMedicalReports = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const uploadMedicalReport = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteMedicalReport = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
