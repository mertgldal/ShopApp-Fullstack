import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
}

interface OrderSummary {
    id: number;
    total_amount: number;
    status: string;
    delivery_date: string;
    created_at: string;
    items_count: number;
    items: OrderItem[];
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
    const { user, token } = useAuth();

    const fetchOrders = useCallback(async () => {
        if (!user || !token) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return '#27ae60';
            case 'shipped': return '#3498db';
            case 'processing': return '#f39c12';
            case 'pending': return '#95a5a6';
            case 'cancelled': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return '✅';
            case 'shipped': return '🚚';
            case 'processing': return '⏳';
            case 'pending': return '🔄';
            case 'cancelled': return '❌';
            default: return '📦';
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchOrders();
        }
    }, [fetchOrders, user, token]);

    // ... rest of your component remains exactly the same
    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4em', marginBottom: '20px' }}>🔐</div>
                    <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Login Required</h2>
                    <p style={{ color: '#666', marginBottom: '25px' }}>
                        Please login to view your orders.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '18px', color: '#666' }}>🔄 Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#e74c3c', fontSize: '18px' }}>❌ {error}</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    gap: '15px'
                }}>
                    <div style={{ fontSize: '2.5em' }}>📦</div>
                    <h1 style={{ color: '#2c3e50', margin: '0' }}>My Orders</h1>
                    <div style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '60px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '4em', marginBottom: '20px' }}>📦</div>
                        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>No orders yet</h2>
                        <p style={{ color: '#666', marginBottom: '25px' }}>
                            Start shopping to create your first order!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map((order) => (
                            <div key={order.id} style={{
                                backgroundColor: '#fff',
                                padding: '25px',
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto auto',
                                    gap: '20px',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        fontSize: '2em',
                                        padding: '10px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '50%'
                                    }}>
                                        {getStatusIcon(order.status)}
                                    </div>

                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                                            Order #{order.id}
                                        </h3>
                                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                            {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1.3em',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            marginBottom: '5px'
                                        }}>
                                            ${order.total_amount.toFixed(2)}
                                        </div>
                                        <div style={{
                                            color: getStatusColor(order.status),
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }}>
                                            {order.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                        style={{
                                            backgroundColor: '#3498db',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 15px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {selectedOrder?.id === order.id ? '🔼 Hide' : '🔽 Details'}
                                    </button>
                                </div>

                                {order.status !== 'delivered' && (
                                    <div style={{
                                        backgroundColor: '#e8f4f8',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{ color: '#2c3e50', fontWeight: 'bold', marginBottom: '5px' }}>
                                            📅 Expected Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                                        </div>
                                        <div style={{ color: '#666', fontSize: '14px' }}>
                                            {order.status === 'shipped' 
                                                ? 'Your order is on the way!' 
                                                : 'Your order is being processed.'
                                            }
                                        </div>
                                    </div>
                                )}

                                {selectedOrder?.id === order.id && (
                                    <div style={{
                                        borderTop: '1px solid #e9ecef',
                                        paddingTop: '20px'
                                    }}>
                                        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Order Items:</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {order.items.map((item, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px'
                                                }}>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold' }}>{item.product_name}</span>
                                                        <span style={{ color: '#666', marginLeft: '10px' }}>
                                                            ${item.product_price.toFixed(2)} × {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', color: '#27ae60' }}>
                                                        ${item.subtotal.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;