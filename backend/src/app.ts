import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/schema';
import { authenticateToken, requireAdmin } from './middleware/auth';
import {
    login,
    register,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    createOrder,
    getUserOrders,
    getOrder
} from './api/endpoint';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Initialize database
initializeDatabase().then(() => {
    console.log('Database initialized successfully');
}).catch(error => {
    console.error('Database initialization failed:', error);
});

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);

// Public product routes
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProduct);

// Admin-only product routes
app.post('/api/products', authenticateToken, requireAdmin, createProduct);
app.put('/api/products/:id', authenticateToken, requireAdmin, updateProduct);
app.delete('/api/products/:id', authenticateToken, requireAdmin, deleteProduct);

// User cart routes
app.post('/api/cart', authenticateToken, addToCart);
app.get('/api/cart', authenticateToken, getCart);
app.put('/api/cart/:id', authenticateToken, updateCartItem);
app.delete('/api/cart/:id', authenticateToken, removeFromCart);

// Order routes
app.post('/api/orders', authenticateToken, createOrder);
app.get('/api/orders', authenticateToken, getUserOrders);
app.get('/api/orders/:id', authenticateToken, getOrder);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Default admin credentials: username: admin, password: admin123');
});