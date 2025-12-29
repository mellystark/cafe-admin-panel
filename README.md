# Cafe Admin Panel

A React admin panel built with Vite for managing cafe menu categories.

## Features

- JWT Bearer authentication with IdentityServer4
- Protected routes with authentication guards
- Full CRUD operations for categories
- Token expiration and scope validation
- Automatic token refresh handling

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- JavaScript (no TypeScript)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration

### Backend Endpoints

- **Authentication Server**: `https://localhost:7099`
- **API Gateway**: `https://localhost:7046`

### Authentication

- Client ID: `admin-client`
- Client Secret: `admin-secret`
- Scope: `cafe.admin`
- Grant Type: Resource Owner Password

### API Endpoints

- `GET /admin/menu/api/Kategori` - List categories
- `POST /admin/menu/api/Kategori` - Create category
- `PUT /admin/menu/api/Kategori` - Update category
- `DELETE /admin/menu/api/Kategori/{id}` - Delete category

## Security

- Tokens are stored in localStorage
- Automatic token validation on route access
- Automatic logout on 401/403 responses
- Scope validation for admin access





