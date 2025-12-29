import { publicHttp } from "../api/publicHttp";

export const fetchCategories = async () => {
  const res = await publicHttp.get("/menu/api/Kategori");
  return res.data || [];
};

export const fetchProductsByCategory = async (categoryId) => {
  const res = await publicHttp.get(`/menu/api/Urun/${categoryId}`);
  return res.data || [];
};

