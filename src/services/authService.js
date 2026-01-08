const TOKEN_KEY = 'access_token';

/**
 * Decode JWT token without verification (client-side only)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Get stored access token
 * @returns {string|null} - Access token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Save access token to localStorage
 * @param {string} token - Access token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove access token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    return false;
  }
  
  // Check if token has admin scope
  if (!hasAdminScope(token)) {
    return false;
  }
  
  return true;
};

/**
 * Check if token is expired
 * @param {string} token - JWT token (optional, uses stored token if not provided)
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token = null) => {
  const tokenToCheck = token || getToken();
  if (!tokenToCheck) {
    return true;
  }
  
  const decoded = decodeToken(tokenToCheck);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  // Check if token expiration time is in the past
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Check if token contains admin scope
 * @param {string} token - JWT token (optional, uses stored token if not provided)
 * @returns {boolean} - True if has admin scope
 */
export const hasAdminScope = (token = null) => {
  const tokenToCheck = token || getToken();
  if (!tokenToCheck) {
    return false;
  }
  
  const decoded = decodeToken(tokenToCheck);
  if (!decoded) {
    return false;
  }
  
  // Check for scope in token (can be string or array)
  const scope = decoded.scope || decoded.scp;
  if (!scope) {
    return false;
  }
  
  // Handle both string and array formats
  if (typeof scope === 'string') {
    return scope.includes('cafe.admin');
  }
  
  if (Array.isArray(scope)) {
    return scope.includes('cafe.admin');
  }
  
  return false;
};

/**
 * Login user and store token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} - Response data with access_token
 */
export const login = async (username, password) => {
  const tokenEndpoint = 'https://localhost:7099/connect/token';
  
  // Prepare form data
  const formData = new URLSearchParams();
  formData.append('client_id', 'admin-client');
  formData.append('client_secret', 'admin-secret');
  formData.append('grant_type', 'password');
  formData.append('username', username);
  formData.append('password', password);
  formData.append('scope', 'cafe.admin');
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_description || errorData.error || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store only the access_token
    if (data.access_token) {
      setToken(data.access_token);
      return data;
    } else {
      throw new Error('No access token received');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user (clear token)
 */
export const logout = () => {
  removeToken();
};

// Export service object
export const authService = {
  login,
  logout,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  isTokenExpired,
  hasAdminScope,
};






