# Customer UI - Setup and Usage Guide

This document provides setup instructions and usage details for the customer-facing UI of the cafe ordering system.

## Project Structure

```
src/
├── api/
│   └── customerAxios.js          # Axios instance for customer API (no auth)
├── services/
│   ├── menuService.js            # Menu API calls (categories, products)
│   └── orderService.js           # Order API calls (create order)
├── utils/
│   └── cartStorage.js            # LocalStorage utilities for cart and customerId
├── components/
│   ├── CategoryList.jsx          # Category list component
│   ├── CategoryList.css
│   ├── ProductList.jsx           # Product list component
│   ├── ProductList.css
│   ├── CartSummary.jsx           # Cart summary component
│   └── CartSummary.css
├── pages/
│   ├── MenuPage.jsx              # Main menu page
│   ├── MenuPage.css
│   ├── CartPage.jsx              # Shopping cart page
│   ├── CartPage.css
│   ├── OrderSuccess.jsx          # Order success page
│   └── OrderSuccess.css
└── App.jsx                       # Updated with customer routes
```

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already in `package.json`. Run:

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port).

### 3. Configure API Endpoints

**IMPORTANT:** Before running, you need to update the API endpoints in the following files to match your exact backend API:

#### `src/services/menuService.js`

Update the `fetchProductsByCategory` function with your actual products endpoint:

```javascript
export const fetchProductsByCategory = async (categoryId) => {
  // REPLACE THIS with your actual endpoint
  // Examples:
  // - /menu/api/Urun?kategoriId={categoryId}
  // - /menu/api/Urunler?kategoriId={categoryId}
  // - /menu/api/Product?categoryId={categoryId}
  
  const response = await customerApiClient.get(`/menu/api/Urun`, {
    params: {
      kategoriId: categoryId  // Adjust parameter name if needed
    }
  });
  return response.data || [];
};
```

#### `src/services/orderService.js`

Update the `createOrder` function request body to match your `CreateOrderRequest` DTO structure. Common fields:

```javascript
export const createOrder = async (orderData) => {
  // orderData should match your CreateOrderRequest DTO
  // Example structure:
  // {
  //   customerId: "string",
  //   tableNumber: "string" (optional),
  //   addressText: "string" (optional),
  //   items: [{ productId: "string", quantity: number }]
  // }
  const response = await customerApiClient.post('/order/api/Order', orderData);
  return response.data;
};
```

#### Product DTO Fields

Update the following components to match your Product DTO field names:

- `src/components/ProductList.jsx` - Adjust field names for product name, description, and price
- `src/components/CartSummary.jsx` - Adjust field names for product name and price

Common Turkish field names: `ad`, `aciklama`, `fiyat`
Common English field names: `name`, `description`, `price`

## Routes

- `/` or `/menu` - Menu page (categories and products)
- `/cart` - Shopping cart page
- `/order-success/:orderId?` - Order success page (orderId is optional)
- `/admin` - Admin panel (existing, unchanged)
- `/login` - Admin login (existing, unchanged)

## Testing Flow

### 1. Start the Application

```bash
npm run dev
```

### 2. Access the Customer UI

Navigate to `http://localhost:5173` - you will be redirected to `/menu`.

### 3. Test the Menu Flow

1. **View Categories**: The page loads and displays all categories from `/menu/api/Kategori`
2. **Select Category**: Click on a category to load products for that category
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the "Cart" button in the header or navigate to `/cart`

### 4. Test the Cart Flow

1. **Review Items**: View all items in the cart
2. **Modify Quantities**: Use + and - buttons to adjust quantities
3. **Remove Items**: Click "Remove" to delete items from cart
4. **Checkout**: 
   - Enter table number (if dining in) or delivery address (if delivery)
   - Click "Place Order"
   - You will be redirected to the order success page

### 5. Verify Data Persistence

- Refresh the page - cart should persist (stored in localStorage)
- Customer ID is automatically generated and stored on first visit

## API Gateway URLs to Test

### Menu Service (Public)

- **Categories**: `GET https://localhost:7046/menu/api/Kategori`
- **Products**: `GET https://localhost:7046/menu/api/Urun?kategoriId={id}` (update endpoint as needed)

### Order Service (Public)

- **Create Order**: `POST https://localhost:7046/order/api/Order`

## Local Storage Keys

- `customer_cart` - Stores cart items
- `customerId` - Stores generated customer ID

## Error Handling

- **Network Errors**: Displayed as user-friendly error messages
- **400 (Validation Error)**: Shows validation error message from API
- **500 (Server Error)**: Shows generic server error message
- **Empty Cart**: Prevents checkout if cart is empty

## Notes

- Customer UI has **NO authentication** - all endpoints are public
- Cart persists in localStorage - survives page refreshes
- Customer ID is auto-generated on first visit and stored in localStorage
- The customer axios instance (`customerApiClient`) does NOT include auth headers
- Admin panel routes remain unchanged and protected

## Troubleshooting

### Products Not Loading

1. Check the products endpoint in `src/services/menuService.js`
2. Verify the query parameter name matches your API (`kategoriId` vs `categoryId`)
3. Check browser console for API errors
4. Verify the API Gateway is running on `https://localhost:7046`

### Order Creation Fails

1. Check the request body structure in `src/pages/CartPage.jsx` matches your `CreateOrderRequest` DTO
2. Verify required fields are included (customerId, items, etc.)
3. Check if `tableNumber` or `addressText` are required by your API
4. Review browser console for detailed error messages

### Cart Not Persisting

1. Check browser localStorage is enabled
2. Verify localStorage keys are correct: `customer_cart` and `customerId`
3. Check browser console for localStorage errors

