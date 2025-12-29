import { publicHttp } from "../api/publicHttp";
import { adminHttp } from "../api/adminHttp";

/**
 * ======================
 * PUBLIC (User)
 * ======================
 */

/**
 * Fetch products by category (PUBLIC)
 * @param {string} kategoriId
 */
export const fetchProductsByCategory = async (kategoriId) => {
  const response = await publicHttp.get(
    `/menu/api/Urun/${kategoriId}`
  );
  return response.data || [];
};

/**
 * Fetch all products (PUBLIC)
 */
export const fetchAllProducts = async () => {
  const response = await publicHttp.get(
    "/menu/api/Urun"
  );
  return response.data || [];
};

/**
 * ======================
 * ADMIN
 * ======================
 */

/**
 * Create product (ADMIN)
 */
export const createProduct = async (payload) => {
  const response = await adminHttp.post(
    "/menu/api/Urun",
    payload
  );
  return response.data;
};

/**
 * Update product (ADMIN)
 */
export const updateProduct = async (payload) => {
  const response = await adminHttp.put(
    "/menu/api/Urun",
    payload
  );
  return response.data;
};

/**
 * Delete product (ADMIN)
 */
export const deleteProduct = async (productId) => {
  const response = await adminHttp.delete(
    `/menu/api/Urun/${productId}`
  );
  return response.data;
};
