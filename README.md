VisionWear - AI Powered Eyewear E-Commerce Platform

Overview

VisionWear is a full-stack AI-powered e-commerce platform designed for online eyewear shopping. The application provides a modern shopping experience through product browsing, intelligent recommendations, secure authentication, shopping cart management, wishlist functionality, order processing, payment integration, analytics dashboards, and an AI-powered customer assistant.

The platform is built using the MERN stack (MongoDB, Express.js, React, Node.js) and integrates external services such as Cloudinary, Stripe, Google OAuth, and Google's Gemini AI.

---

Features

Customer Features

Authentication & User Management

- User Registration
- User Login
- JWT Authentication
- Google OAuth Login
- User Profile Management
- Password Update
- Logout Functionality

Product Management

- Browse Products
- Product Categories
- Product Search & Filtering
- Product Details View
- Discounted Pricing
- GST Calculation

Shopping Experience

- Add to Cart
- Update Cart Quantity
- Remove Products from Cart
- Wishlist Management
- Product Reviews
- Order Tracking

Checkout & Payments

- Secure Checkout
- Stripe Payment Integration
- Order Confirmation
- Order History

AI Assistant

- Product Recommendations
- Customer Support Chat
- Product Query Assistance
- Shopping Guidance using Gemini AI

Notifications

- Order Status Updates
- User Notifications
- Promotional Alerts

---

Admin Features

Dashboard

- Sales Analytics
- Revenue Reports
- Category-wise Revenue
- Order Status Distribution

Product Administration

- Add Products
- Update Products
- Delete Products
- Inventory Management

User Management

- Customer Monitoring
- Admin Access Control

Order Management

- View Orders
- Update Order Status
- Manage Deliveries

---

Tech Stack

Frontend

- React.js
- Vite
- React Router
- Axios
- Context API
- CSS

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

Authentication

- JWT
- Google OAuth

Cloud Services

- Cloudinary
- Stripe

AI Integration

- Google Gemini API

Deployment

- Vercel

---

System Architecture

┌──────────────────────┐
│     React Frontend   │
└──────────┬───────────┘
           │
           │ Axios API Calls
           ▼
┌──────────────────────┐
│   Express Backend    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      MongoDB         │
└──────────────────────┘

External Services
├── Cloudinary
├── Stripe
├── Google OAuth
└── Gemini AI

---

Project Structure

project-root/
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── common/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

---

Database Schema

User

{
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  phone: String,
  gender: String,
  dob: Date
}

Product

{
  name: String,
  category: String,
  price: Number,
  discountPrice: Number,
  gstRate: Number,
  stock: Number,
  images: [String]
}

Cart

{
  user: ObjectId,
  items: [],
  totalItems: Number,
  totalAmount: Number
}

Order

{
  user: ObjectId,
  orderItems: [],
  totalAmount: Number,
  status: String,
  createdAt: Date
}

Wishlist

{
  user: ObjectId,
  products: []
}

Notification

{
  user: ObjectId,
  message: String,
  read: Boolean
}

---

API Modules

Authentication

Routes

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google-signup
GET    /api/auth/me
PUT    /api/auth/update
POST   /api/auth/logout
DELETE /api/auth/delete

Features

- JWT Token Generation
- Password Encryption
- Google Authentication
- User Profile Management

---

Product APIs

GET    /api/product
GET    /api/product/:id
POST   /api/product
PUT    /api/product/:id
DELETE /api/product/:id

---

Cart APIs

GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove

---

Wishlist APIs

GET    /api/wishlist
POST   /api/wishlist/add
DELETE /api/wishlist/remove

---

Order APIs

POST   /api/order
GET    /api/order
PUT    /api/order/:id

---

Notification APIs

GET    /api/notifications
POST   /api/notifications

---

Analytics APIs

GET /api/admin/analytics/sales-overview
GET /api/admin/analytics/revenue-by-category
GET /api/admin/analytics/orders-distribution

---

Analytics Dashboard

Sales Overview

Displays monthly revenue trends using MongoDB aggregation.

Example

Jan  ₹12,000
Feb  ₹15,500
Mar  ₹18,700

---

Revenue by Category

Displays category-wise sales revenue.

Example

Eyeglasses   ₹75,000
Sunglasses   ₹42,000
Kids         ₹18,000

---

Order Distribution

Displays order status breakdown.

Example

Pending      20
Processing   12
Delivered    140
Cancelled    4

---

AI Assistant

The platform includes an AI-powered assistant built using Google Gemini.

Capabilities

- Product Search Assistance
- Product Recommendations
- Shopping Guidance
- Customer Support
- Frequently Asked Questions

Technology

@google/genai

---

Payment Integration

The platform integrates Stripe for secure payment processing.

Features

- Secure Transactions
- Payment Verification
- Checkout Flow
- Order Confirmation

---

Cloudinary Integration

Cloudinary is used for image storage and management.

Benefits

- Fast Image Delivery
- Image Optimization
- Cloud Storage
- Reduced Server Load

---

Security Features

Authentication

- JWT Authentication
- Protected Routes
- Role-Based Access Control

Password Security

- Password Hashing using bcryptjs

Environment Variables

Sensitive information is stored securely.

PORT=5000

MONGODB_URI=

JWT_SECRET=

FRONTEND_URL=

GOOGLE_CLIENT_ID=

ADMIN_SECRET=

ADMIN_PASSWORD=

STRIPE_SECRET_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

---

Installation Guide

Clone Repository

git clone https://github.com/your-username/visionwear.git
cd visionwear

---

Backend Setup

cd Backend

npm install

Create a .env file:

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

Run Backend:

npm run dev

---

Frontend Setup

cd client

npm install

Run Frontend:

npm run dev

---

Future Improvements

- Product Recommendation Engine
- AI-based Face Shape Detection
- Virtual Try-On Enhancement
- Email Notifications
- Coupon System
- Inventory Forecasting
- Real-Time Chat Support
- Multi-Vendor Marketplace
- Mobile Application

---

Challenges Solved

Authentication Security

Implemented JWT-based authentication with protected routes.

Cart Synchronization

Maintained accurate cart totals and GST calculations.

Analytics Processing

Used MongoDB aggregation pipelines for efficient reporting.

AI Integration

Connected Gemini API with backend services.

Cloud Storage

Integrated Cloudinary for scalable image management.

---

Learning Outcomes

Through this project, the following concepts were implemented and strengthened:

- REST API Development
- MERN Stack Architecture
- JWT Authentication
- MongoDB Aggregation
- Payment Gateway Integration
- Cloud Storage Integration
- AI API Integration
- State Management with Context API
- Deployment using Vercel
- Full-Stack Application Design

---

Author

Partha

AI/ML Enthusiast | MERN Stack Developer | FastAPI & Django Developer

---

License

This project is licensed under the MIT License.
