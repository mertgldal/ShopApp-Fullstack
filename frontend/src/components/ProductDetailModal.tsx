import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (productId: number, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    if (!product) return null;

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        setLoading(true);
        try {
            await onAddToCart(product.id, quantity);
            alert('Product added to cart!');
            onClose();
        } catch (error) {
            alert('Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '15px',
                padding: '30px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    alignItems: 'start'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: '15px',
                                border: '3px solid #f8f9fa'
                            }}
                        />
                    </div>

                    <div>
                        <h1 style={{
                            color: '#2c3e50',
                            marginBottom: '15px',
                            fontSize: '2em'
                        }}>
                            {product.name}
                        </h1>

                        <p style={{
                            color: '#666',
                            lineHeight: '1.6',
                            marginBottom: '20px'
                        }}>
                            {product.description}
                        </p>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                fontSize: '2em',
                                color: '#27ae60',
                                fontWeight: 'bold',
                                marginBottom: '10px'
                            }}>
                                ${product.price.toFixed(2)}
                            </div>
                            <div style={{
                                color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                                fontWeight: 'bold'
                            }}>
                                {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                            </div>
                        </div>

                        {product.stock > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    color: '#555'
                                }}>
                                    Quantity:
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        style={{
                                            backgroundColor: '#e9ecef',
                                            border: 'none',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '18px'
                                        }}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                        style={{
                                            width: '80px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '16px'
                                        }}
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        style={{
                                            backgroundColor: '#e9ecef',
                                            border: 'none',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '18px'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {product.stock > 0 && (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading || !user}
                                    style={{
                                        backgroundColor: loading ? '#95a5a6' : '#27ae60',
                                        color: 'white',
                                        border: 'none',
                                        padding: '15px 25px',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        cursor: loading || !user ? 'not-allowed' : 'pointer',
                                        flex: 1,
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    {loading ? '🔄 Adding...' : '🛒 Add to Cart'}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px 25px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {!user && (
                            <p style={{
                                marginTop: '15px',
                                color: '#e74c3c',
                                fontStyle: 'italic'
                            }}>
                                Please login to add items to your cart
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;