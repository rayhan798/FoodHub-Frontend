import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const categoryService = {
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data; 
  },

  createCategory: async (data: any) => {
    const response = await axios.post(`${API_URL}/categories`, data);
    return response.data;
  },

  updateCategory: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
  }
};