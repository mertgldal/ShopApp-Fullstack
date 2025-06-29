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

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
}

export class ProductService {
    private products: Product[] = [];
    private nextId = 1;

    constructor() {
        this.initializeSampleProducts();
    }

    private initializeSampleProducts() {
        const sampleProducts = [
            {
                name: "MacBook Pro",
                description: "Powerful laptop for professionals with M2 chip",
                price: 1999.99,
                stock: 10,
                imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"
            },
            {
                name: "iPhone 15 Pro",
                description: "Latest smartphone with advanced camera system",
                price: 999.99,
                stock: 25,
                imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
            },
            {
                name: "iPad Air",
                description: "Lightweight tablet for work and creativity",
                price: 599.99,
                stock: 15,
                imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300"
            },
            {
                name: "AirPods Pro",
                description: "Wireless headphones with active noise cancellation",
                price: 249.99,
                stock: 30,
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
            },
            {
                name: "Gaming Chair Pro",
                description: "Ergonomic chair designed for long gaming sessions",
                price: 399.99,
                stock: 8,
                imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300"
            }
        ];

        sampleProducts.forEach(product => {
            this.products.push({
                id: this.nextId++,
                ...product,
                active: true,
                created_at: new Date().toISOString()
            });
        });
    }

    async getAllProducts(): Promise<Product[]> {
        return this.products.filter(p => p.active);
    }

    async getProductById(id: number): Promise<Product | null> {
        const product = this.products.find(p => p.id === id && p.active);
        return product || null;
    }

    async createProduct(productData: CreateProductRequest): Promise<Product> {
        const newProduct: Product = {
            id: this.nextId++,
            ...productData,
            imageUrl: productData.imageUrl || 'https://via.placeholder.com/300',
            active: true,
            created_at: new Date().toISOString()
        };

        this.products.push(newProduct);
        return newProduct;
    }

    async updateProduct(id: number, productData: Partial<CreateProductRequest>): Promise<Product | null> {
        const productIndex = this.products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return null;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...productData
        };

        return this.products[productIndex];
    }

    async deleteProduct(id: number): Promise<boolean> {
        const productIndex = this.products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return false;
        }

        this.products[productIndex].active = false;
        return true;
    }

    async updateStock(productId: number, quantity: number): Promise<boolean> {
        const product = this.products.find(p => p.id === productId);
        
        if (!product || product.stock < quantity) {
            return false;
        }

        product.stock -= quantity;
        return true;
    }
}