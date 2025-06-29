import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ProductService } from '../services/ProductService';
import { CartService } from '../services/CartService';
import { OrderService } from '../services/OrderService';
import { AuthenticatedRequest } from '../middleware/auth';

const authService = new AuthService();
const productService = new ProductService();
const cartService = new CartService(productService);
const orderService = new OrderService();

// Auth endpoints
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await authService.login({ username, password });
        res.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        res.status(401).json({ message });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const result = await authService.register({ username, email, password });
        res.status(201).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        res.status(400).json({ message });
    }
};

// Product endpoints
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch products';
        res.status(500).json({ message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.getProductById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch product';
        res.status(500).json({ message });
    }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, description, price, stock, imageUrl } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await productService.createProduct({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            imageUrl
        });

        res.status(201).json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create product';
        res.status(500).json({ message });
    }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        
        const product = await productService.updateProduct(id, updates);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update product';
        res.status(500).json({ message });
    }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await productService.deleteProduct(id);
        
        if (!success) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete product';
        res.status(500).json({ message });
    }
};

// Cart endpoints
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user!.userId;
        
        const cartItem = await cartService.addToCart(userId, parseInt(productId), parseInt(quantity));
        res.status(201).json(cartItem);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add to cart';
        res.status(400).json({ message });
    }
};

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const cart = await cartService.getCart(userId);
        res.json(cart);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch cart';
        res.status(500).json({ message });
    }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const cartItemId = parseInt(req.params.id);
        const { quantity } = req.body;
        
        const cartItem = await cartService.updateCartItem(cartItemId, parseInt(quantity));
        res.json(cartItem);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update cart item';
        res.status(400).json({ message });
    }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const cartItemId = parseInt(req.params.id);
        await cartService.removeFromCart(cartItemId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove from cart';
        res.status(500).json({ message });
    }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        
        // Get user's cart
        const cart = await cartService.getCart(userId);
        
        if (cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Check stock availability and update stock
        for (const cartItem of cart.items) {
            const stockUpdated = await productService.updateStock(cartItem.product.id, cartItem.quantity);
            if (!stockUpdated) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${cartItem.product.name}` 
                });
            }
        }

        // Create order items
        const orderItems = cart.items.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        }));

        // Create order
        const order = await orderService.createOrder(userId, orderItems, cart.totalPrice);

        // Clear user's cart
        await cartService.clearCart(userId);

        res.status(201).json(order);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create order';
        res.status(500).json({ message });
    }
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const orders = await orderService.getUserOrders(userId);
        res.json(orders);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch orders';
        res.status(500).json({ message });
    }
};

export const getOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        const order = await orderService.getOrderById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if user owns this order or is admin
        if (order.user_id !== req.user!.userId && req.user!.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(order);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch order';
        res.status(500).json({ message });
    }
};