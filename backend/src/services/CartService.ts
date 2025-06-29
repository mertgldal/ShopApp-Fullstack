import { ProductService, Product } from './ProductService';

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
}

export interface CartItemDto {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        stock: number;
    };
    quantity: number;
    subtotal: number;
}

export interface CartSummary {
    items: CartItemDto[];
    totalItems: number;
    totalPrice: number;
}

export class CartService {
    private cartItems: CartItem[] = [];
    private nextId = 1;
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async addToCart(userId: number, productId: number, quantity: number = 1): Promise<CartItemDto> {
        // Check product exists and has enough stock
        const product = await this.productService.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        // Check if item already in cart
        const existingItem = this.cartItems.find(
            item => item.user_id === userId && item.product_id === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error('Insufficient stock for requested quantity');
            }
            
            existingItem.quantity = newQuantity;
            return this.getCartItemDto(existingItem.id);
        } else {
            const newCartItem: CartItem = {
                id: this.nextId++,
                user_id: userId,
                product_id: productId,
                quantity,
                created_at: new Date().toISOString()
            };
            
            this.cartItems.push(newCartItem);
            return this.getCartItemDto(newCartItem.id);
        }
    }

    private async getCartItemDto(cartItemId: number): Promise<CartItemDto> {
        const cartItem = this.cartItems.find(item => item.id === cartItemId);
        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        const product = await this.productService.getProductById(cartItem.product_id);
        if (!product) {
            throw new Error('Product not found');
        }

        return {
            id: cartItem.id,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock
            },
            quantity: cartItem.quantity,
            subtotal: product.price * cartItem.quantity
        };
    }

    async getCart(userId: number): Promise<CartSummary> {
        const userCartItems = this.cartItems.filter(item => item.user_id === userId);
        
        const cartItemDtos: CartItemDto[] = [];
        
        for (const item of userCartItems) {
            try {
                const cartItemDto = await this.getCartItemDto(item.id);
                cartItemDtos.push(cartItemDto);
            } catch (error) {
                // Remove invalid cart items
                this.cartItems = this.cartItems.filter(ci => ci.id !== item.id);
            }
        }

        const totalItems = cartItemDtos.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItemDtos.reduce((sum, item) => sum + item.subtotal, 0);

        return {
            items: cartItemDtos,
            totalItems,
            totalPrice
        };
    }

    async updateCartItem(cartItemId: number, quantity: number): Promise<CartItemDto> {
        if (quantity <= 0) {
            await this.removeFromCart(cartItemId);
            throw new Error('Item removed from cart');
        }

        const cartItem = this.cartItems.find(item => item.id === cartItemId);
        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        const product = await this.productService.getProductById(cartItem.product_id);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        cartItem.quantity = quantity;
        return this.getCartItemDto(cartItemId);
    }

    async removeFromCart(cartItemId: number): Promise<void> {
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
    }

    async clearCart(userId: number): Promise<void> {
        this.cartItems = this.cartItems.filter(item => item.user_id !== userId);
    }
}