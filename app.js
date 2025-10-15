import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectDB from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import distributorRoutes from './routes/distributorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import productPriceRoutes from './routes/productPriceRoutes.js';

// Connect to database
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    success: false,
    message: 'Too many requests from this IP, please try again later',
    data: null
  }
});

// Middleware
app.use(limiter); // Apply rate limiting
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Param Dairy API",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.FRONTEND_URL || "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./docs/swagger/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-prices', productPriceRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: 'Endpoint not found',
    data: null
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'Validation error',
      data: { errors: messages }
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${field} already exists`,
      data: null
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 401,
      success: false,
      message: 'Invalid token',
      data: null
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 401,
      success: false,
      message: 'Token expired',
      data: null
    });
  }

  // Default server error
  res.status(500).json({
    status: 500,
    success: false,
    message: 'Internal server error',
    data: null
  });
});

export default app;
