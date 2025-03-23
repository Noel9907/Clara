const API_BASE_URL = "http://localhost:3000"; // Change if deployed

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Signup failed");
  return response.json();
};

export const fetchMedicalRecords = async (userId) => {
  // const response = await fetch(`${API_BASE_URL}/records?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
};

export const uploadRecord = async (recordData) => {
  const response = await fetch(`${API_BASE_URL}/records/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) throw new Error("Failed to upload record");
  return response.json();
};
