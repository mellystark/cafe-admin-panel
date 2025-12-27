import customerApiClient from '../api/customerAxios';

/**
 * Fetch all categories (PUBLIC endpoint)
 * @returns {Promise<Array>} Array of category objects with {id, ad}
 */
export const fetchCategories = async () => {
  const response = await customerApiClient.get('/menu/api/Kategori');
  return response.data || [];
};

/**
 * Fetch products by category (PUBLIC endpoint)
 * 
 * NOTE: Update the endpoint path and query parameter name based on your actual API.
 * Common patterns:
 * - /menu/api/Urun?kategoriId={categoryId}
 * - /menu/api/Urunler?kategoriId={categoryId}
 * - /menu/api/Product?categoryId={categoryId}
 * 
 * @param {string} categoryId - Category ID to filter products
 * @returns {Promise<Array>} Array of product objects
 */
export const fetchProductsByCategory = async (categoryId) => {
  const response = await customerApiClient.get(
    `/menu/api/Urun/${categoryId}`
  );
  return response.data || [];
};


