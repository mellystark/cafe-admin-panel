const CART_KEY = 'customer_cart';
const CUSTOMER_ID_KEY = 'customerId';

/**
 * Get cart from localStorage
 * @returns {Array} Cart items array
 */
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items array
 */
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Clear cart from localStorage
 */
export const clearCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

/**
 * Get or generate customer ID and persist in localStorage
 * @returns {string} Customer ID
 */
export const getCustomerId = () => {
  try {
    let customerId = localStorage.getItem(CUSTOMER_ID_KEY);
    if (!customerId) {
      // Generate a unique customer ID
      customerId = 'customer-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(CUSTOMER_ID_KEY, customerId);
    }
    return customerId;
  } catch (error) {
    console.error('Error getting customer ID:', error);
    // Fallback: generate a temporary ID
    return 'customer-' + Date.now();
  }
};

