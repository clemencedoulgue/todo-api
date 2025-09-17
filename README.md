# 📝 Todo List API

A RESTful API for managing todo lists with user authentication, built with Node.js, Express, and MongoDB.

## ✨ Features

- 🔐 **User Authentication** - JWT-based authentication with registration and login
- 📋 **CRUD Operations** - Create, read, update, and delete todos
- 🔒 **Authorization** - Users can only access their own todos
- 📄 **Pagination** - Get todos with pagination support
- 🔍 **Search & Filter** - Search todos by title and sort by various fields
- ✅ **Data Validation** - Comprehensive input validation and error handling
- 🛡️ **Security** - Password hashing, JWT tokens, and secure endpoints

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt for password hashing
- **Environment**: dotenv for configuration

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }` |
| POST | `/api/auth/login` | Login user | `{ "email": "john@example.com", "password": "password123" }` |

### Todos (Protected Routes)

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/api/todos` | Get all todos with pagination | `Authorization: Bearer <token>` |
| POST | `/api/todos` | Create a new todo | `Authorization: Bearer <token>` |
| PUT | `/api/todos/:id` | Update a todo | `Authorization: Bearer <token>` |
| DELETE | `/api/todos/:id` | Delete a todo | `Authorization: Bearer <token>` |

### Query Parameters for GET /api/todos

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order - asc/desc (default: desc)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb://127.0.0.1:27017/todo-api
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/todo-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and update `MONGO_URL` in `.env`

#### Option B: Local MongoDB

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. The default connection string should work: `mongodb://127.0.0.1:27017/todo-api`

#### Option C: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Start without database (for testing)
npm run start-fallback
```

## 🧪 Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/
```

### 2. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Create a Todo

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Buy groceries",
    "description": "Buy milk, eggs, and bread"
  }'
```

### 5. Get Todos

```bash
curl -X GET "http://localhost:5000/api/todos?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📊 Response Examples

### Successful Registration/Login

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Todo Creation

```json
{
  "id": "64f1c2a7e4b0f2a1c9d3b7e8",
  "title": "Buy groceries",
  "description": "Buy milk, eggs, and bread",
  "completed": false,
  "createdAt": "2023-09-01T10:00:00.000Z"
}
```

### Get Todos with Pagination

```json
{
  "data": [
    {
      "id": "64f1c2a7e4b0f2a1c9d3b7e8",
      "title": "Buy groceries",
      "description": "Buy milk, eggs, and bread",
      "completed": false,
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

## 🔧 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-restart
npm run dev

# Start server without database (for testing)
npm run start-fallback

# Test MongoDB connection
npm run check-db

# Troubleshoot MongoDB Atlas connection
npm run troubleshoot
```

## 🏗️ Project Structure

```
todo-api/
├── controllers/
│   ├── auth.js          # Authentication logic
│   └── todoController.js # Todo CRUD operations
├── middlewares/
│   ├── auth.js          # JWT authentication middleware
│   └── errorMiddleware.js # Error handling
├── models/
│   ├── User.js          # User schema
│   └── Todo.js          # Todo schema
├── routes/
│   ├── authRoutes.js    # Authentication routes
│   └── todoRoutes.js    # Todo routes
├── app.js               # Express app configuration
├── index.js             # Server entry point
└── package.json         # Dependencies and scripts
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **Authorization**: Users can only access their own data
- **Error Handling**: Secure error messages without sensitive data

## 🚨 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 📝 Data Models

### User Model

```javascript
{
  name: String (required, 2-50 characters),
  email: String (required, unique, valid email),
  password: String (required, min 6 characters),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Model

```javascript
{
  title: String (required, max 200 characters),
  description: String (optional, max 1000 characters),
  completed: Boolean (default: false),
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure IP is whitelisted (for Atlas)

2. **JWT Token Issues**
   - Check if `JWT_SECRET` is set in `.env`
   - Verify token format in Authorization header

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill existing processes on the port

### Getting Help

- Check the terminal output for specific error messages
- Verify your `.env` configuration
- Test MongoDB connection with `npm run check-db`

## 🎯 Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Todo categories and tags
- [ ] File uploads for todo attachments
- [ ] Real-time updates with WebSockets
- [ ] API rate limiting
- [ ] Comprehensive API documentation with Swagger

---

**Happy coding! 🚀**