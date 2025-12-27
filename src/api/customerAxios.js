import axios from 'axios';

// Customer axios instance - NO authentication headers
// Used for public customer endpoints
const customerApiClient = axios.create({
  baseURL: 'https://localhost:7046',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customerApiClient;

