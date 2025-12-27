import customerApiClient from '../api/customerAxios';

/**
 * Create a new order (PUBLIC endpoint)
 * 
 * @param {Object} params
 * @param {string} params.customerId
 * @param {string} params.addressText
 * @param {number|null} params.tableNumber
 * @param {Array<{productId: string, quantity: number}>} params.items
 */
export const createOrder = async ({
  customerId,
  productId,
  quantity,
  addressText
}) => {
  const requestBody = {
    customerId,
    productId,
    quantity,
    addressText
  };

  const response = await customerApiClient.post(
    '/order/api/Order',
    requestBody
  );

  return response.data;
};

