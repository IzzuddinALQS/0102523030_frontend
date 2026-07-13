import { getToken } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at: string;
};

export type MahasiswaResponse = {
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Mahasiswa[];
};

function getAuthHeaders(isFormData = false) {
  const token = getToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
}

export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data || [];
}

export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<MahasiswaResponse> {
  const query = new URLSearchParams();
 
  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
 
  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
 
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login";
    }
    throw new Error(result.message);
  }
  return result;
}

export async function createMahasiswa(formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
 
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function updateMahasiswa(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: formData,
  });
 
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function deleteMahasiswa(id: number) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
 
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.location.href = "/login";
    }
    throw new Error(result.message);
  }
  return result.data || [];
}

export async function createUser(data: Partial<User>) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function updateUser(id: number, data: Partial<User>) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function resetPassword(id: number) {
  const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}
