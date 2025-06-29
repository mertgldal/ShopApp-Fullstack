export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    active: boolean;
    created_at: string;
}

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
}

// Simple mock initialization function
export async function initializeDatabase(): Promise<void> {
    console.log('✅ In-memory database initialized');
    return Promise.resolve();
}