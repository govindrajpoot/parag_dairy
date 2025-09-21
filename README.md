# Param Dairy Authentication API

A complete Node.js Express API for user authentication with role-based access control and MongoDB integration.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (Admin, Distributor, Sub-Admin)
- 🛡️ Password hashing with bcrypt
- 📊 MongoDB integration with Mongoose
- 🚀 Rate limiting and security middleware
- 📝 Input validation and error handling
- 🌱 Admin user seeding on first run

## Project Structure

```
project/
├── config/        # Database connection, JWT secret
├── controllers/   # Business logic for signup/signin
├── middlewares/   # Auth and role-based checks
├── models/        # Mongoose User schema
├── routes/        # Express routes
├── app.js         # Express app setup
├── server.js      # Start server
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paramdairy-auth-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your values:
   ```env
   MONGO_URI=mongodb+srv://govindrajpoot760:eeNGiiphEb2egn5u@cluster0.2ift0zy.mongodb.net/paramdairy
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user (requires authentication and proper permissions).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Distributor"
}
```

**Response (Success):**
```json
{
  "status": 201,
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Distributor",
      "createdBy": "creator_id",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/signin
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "status": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Distributor",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /api/users
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success):**
```json
{
  "status": 200,
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Distributor",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": 200,
  "success": true,
  "message": "Server is running",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456
  }
}
```

## User Roles & Permissions

### Admin
- Can create Distributors and Sub-Admins
- Can view all users
- Full access to the system

### Distributor
- Can only log in
- Can create Sub-Admins
- Limited access

### Sub-Admin
- Can only log in
- Basic user access

## Error Handling

The API uses consistent error response format:

```json
{
  "status": 400,
  "success": false,
  "message": "Error description",
  "data": null
}
```

### HTTP Status Codes

- **200 OK** - Successful requests
- **201 Created** - Resource created successfully
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Invalid token or credentials
- **403 Forbidden** - Role not allowed
- **404 Not Found** - Endpoint not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server errors

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- CORS configuration
- Error message sanitization

## Development

### Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |

## Default Admin User

On first run, the system creates a default admin user:

- **Email:** admin@paramdairy.com
- **Password:** Admin@123
- **Role:** Admin

⚠️ **Important:** Change the default password after first login!

## License

ISC
