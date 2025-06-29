import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
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

interface CartSummary {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<CartSummary>({ items: [], totalItems: 0, totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<any>(null);
    const { user, token } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user || !token) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            setCart(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            await fetchCart();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update item');
        }
    };

    const removeItem = async (cartItemId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove item');
            }

            await fetchCart();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to remove item');
        }
    };

    const proceedToCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const order = await response.json();
            setOrderSuccess(order);
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Checkout failed');
        } finally {
            setCheckoutLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchCart();
        }
    }, [fetchCart, user, token]);

    // ... rest of your component remains the same
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
                        Please login to view your shopping cart.
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
                <div style={{ fontSize: '18px', color: '#666' }}>🔄 Loading cart...</div>
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

    if (orderSuccess) {
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
                    padding: '60px',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '5em', marginBottom: '30px' }}>🎉</div>
                    <h1 style={{ color: '#27ae60', marginBottom: '20px', fontSize: '2.5em' }}>
                        Order Placed Successfully!
                    </h1>
                    <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.1em' }}>
                        Thank you for your purchase! Your order has been confirmed.
                    </p>
                    
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '30px'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Order ID:</strong> #{orderSuccess.id}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Total:</strong> ${orderSuccess.total_amount.toFixed(2)}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Status:</strong> {orderSuccess.status}
                        </div>
                        <div>
                            <strong>Expected Delivery:</strong> {new Date(orderSuccess.delivery_date).toLocaleDateString()}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            🛍️ Continue Shopping
                        </button>
                        <button
                            onClick={() => window.location.href = '#orders'}
                            style={{
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            📦 View Orders
                        </button>
                    </div>
                </div>
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
                    <div style={{ fontSize: '2.5em' }}>🛒</div>
                    <h1 style={{ color: '#2c3e50', margin: '0' }}>Shopping Cart</h1>
                    <div style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
                    </div>
                </div>

                {cart.items.length === 0 ? (
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '60px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '4em', marginBottom: '20px' }}>🛒</div>
                        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Your cart is empty</h2>
                        <p style={{ color: '#666', marginBottom: '25px' }}>
                            Start shopping to add items to your cart!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '30px',
                        alignItems: 'start'
                    }}>
                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cart.items.map((item) => (
                                <div key={item.id} style={{
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto auto',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}>
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                                            {item.product.name}
                                        </h3>
                                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                                            ${item.product.price.toFixed(2)} each
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', color: '#27ae60', fontSize: '14px' }}>
                                            {item.product.stock} in stock
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{
                                                backgroundColor: '#e9ecef',
                                                border: 'none',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontSize: '16px'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            minWidth: '40px',
                                            textAlign: 'center'
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            style={{
                                                backgroundColor: item.quantity >= item.product.stock ? '#ccc' : '#e9ecef',
                                                border: 'none',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer',
                                                fontSize: '16px'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1.2em',
                                            fontWeight: 'bold',
                                            color: '#27ae60',
                                            marginBottom: '10px'
                                        }}>
                                            ${item.subtotal.toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '25px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minWidth: '250px'
                        }}>
                            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Order Summary</h3>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                }}>
                                    <span>Items ({cart.totalItems}):</span>
                                    <span>${cart.totalPrice.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                }}>
                                    <span>Shipping:</span>
                                    <span style={{ color: '#27ae60' }}>FREE</span>
                                </div>
                                <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e9ecef' }} />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '1.2em',
                                    fontWeight: 'bold',
                                    color: '#2c3e50'
                                }}>
                                    <span>Total:</span>
                                    <span>${cart.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={proceedToCheckout}
                                disabled={checkoutLoading}
                                style={{
                                    backgroundColor: checkoutLoading ? '#95a5a6' : '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                {checkoutLoading ? '🔄 Processing...' : '🚀 Proceed to Checkout'}
                            </button>

                            <button
                                onClick={fetchCart}
                                style={{
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Refresh Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;