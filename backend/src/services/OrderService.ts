export interface Order {
    id: number;
    user_id: number;
    items: OrderItem[];
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    delivery_date: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
}

export interface OrderSummary {
    id: number;
    total_amount: number;
    status: string;
    delivery_date: string;
    created_at: string;
    items_count: number;
    items: OrderItem[];
}

export class OrderService {
    private orders: Order[] = [];
    private nextId = 1;

    constructor() {
        this.initializeSampleOrders();
    }

    private initializeSampleOrders() {
        // Add some sample past orders for demo
        const sampleOrders = [
            {
                user_id: 1, // admin user
                items: [
                    {
                        product_id: 1,
                        product_name: "MacBook Pro",
                        product_price: 1999.99,
                        quantity: 1,
                        subtotal: 1999.99
                    }
                ],
                total_amount: 1999.99,
                status: 'delivered' as const,
                delivery_date: '2024-12-20',
                created_at: '2024-12-15T10:30:00Z',
                updated_at: '2024-12-20T14:20:00Z'
            },
            {
                user_id: 1,
                items: [
                    {
                        product_id: 2,
                        product_name: "iPhone 15 Pro",
                        product_price: 999.99,
                        quantity: 2,
                        subtotal: 1999.98
                    }
                ],
                total_amount: 1999.98,
                status: 'shipped' as const,
                delivery_date: '2025-01-05',
                created_at: '2024-12-28T15:45:00Z',
                updated_at: '2024-12-30T09:15:00Z'
            }
        ];

        sampleOrders.forEach(order => {
            this.orders.push({
                id: this.nextId++,
                ...order
            });
        });
    }

    async createOrder(userId: number, items: OrderItem[], totalAmount: number): Promise<Order> {
        // Generate random delivery date (3-10 days from now)
        const deliveryDays = Math.floor(Math.random() * 8) + 3;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

        const newOrder: Order = {
            id: this.nextId++,
            user_id: userId,
            items,
            total_amount: totalAmount,
            status: 'processing',
            delivery_date: deliveryDate.toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.orders.push(newOrder);
        return newOrder;
    }

    async getUserOrders(userId: number): Promise<OrderSummary[]> {
        const userOrders = this.orders
            .filter(order => order.user_id === userId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return userOrders.map(order => ({
            id: order.id,
            total_amount: order.total_amount,
            status: order.status,
            delivery_date: order.delivery_date,
            created_at: order.created_at,
            items_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
            items: order.items
        }));
    }

    async getOrderById(orderId: number): Promise<Order | null> {
        return this.orders.find(order => order.id === orderId) || null;
    }
}