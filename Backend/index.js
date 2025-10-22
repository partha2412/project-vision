require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const authProduct = require('./routes/product');
const cartRoutes = require('./routes/cart');
const notificationRoutes = require("./routes/notification");
const wishlistRoutes = require('./routes/wishlist');
const analytics = require("./routes/analytics");
const front_url = process.env.REACT_APP_API_BASE_URL
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://project-vision-kjv1.vercel.app', 'http://localhost:5173', front_url, 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'stripe-signature'],
  exposedHeaders: ['set-cookie'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

app.use(express.json());     
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/product', authProduct);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use("/api/admin/analytics", analytics );
app.use("/api/notifications", notificationRoutes);




   // Database connection with improved configuration
const connectDB = async () => {
  try {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
      maxPoolSize: 50, // Maintain up to 50 socket connections
      minPoolSize: 10, // Maintain at least 10 socket connections
      maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
      writeConcern: { w: 'majority' }, // Wait for write acknowledgment from majority of replicas
      retryWrites: true, // Automatically retry write operations
      retryReads: true // Automatically retry read operations
    };

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', mongoOptions);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // If initial connection fails, retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
