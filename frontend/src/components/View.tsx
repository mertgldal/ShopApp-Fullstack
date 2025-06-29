import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductDetailModal from './ProductDetailModal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

const ProductListView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { user, token } = useAuth();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load products';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: number, quantity: number) => {
        if (!user || !token) {
            throw new Error('Please login to add items to cart');
        }

        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div style={{ 
                    fontSize: '18px', 
                    marginBottom: '20px',
                    color: '#666'
                }}>
                    🔄 Loading products...
                </div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>😞</div>
                    <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>Oops! Something went wrong</h2>
                    <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
                        We couldn't load the products right now. This might be a temporary issue.
                    </p>
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '25px',
                        border: '1px solid #dee2e6'
                    }}>
                        <strong>Error details:</strong> {error}
                    </div>
                    <button 
                        onClick={fetchProducts}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2980b9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3498db';
                        }}
                    >
                        🔄 Try Again
                    </button>
                </div>
            </div>
        );
    }

    const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <h1 style={{ 
                    fontSize: '3em', 
                    margin: '0 0 20px 0', 
                    fontWeight: '700'
                }}>
                    🛍️ Product Showcase
                </h1>
                <p style={{ 
                    fontSize: '1.2em', 
                    margin: '0 0 30px 0',
                    opacity: '0.9',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: '1.6'
                }}>
                    Discover our amazing collection of products. Browse through our carefully curated selection 
                    and find exactly what you're looking for.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2em', marginBottom: '5px' }}>📱</div>
                        <div>Latest Tech</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2em', marginBottom: '5px' }}>⚡</div>
                        <div>Fast Delivery</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2em', marginBottom: '5px' }}>🔒</div>
                        <div>Secure Shopping</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Stats and Controls */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                            Available Products
                        </h2>
                        <p style={{ margin: '0', color: '#7f8c8d' }}>
                            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} available
                        </p>
                    </div>
                    <button 
                        onClick={fetchProducts}
                        style={{
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            fontSize: '14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#229954';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#27ae60';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        🔄 Refresh Products
                    </button>
                </div>
                
                {/* Products Grid */}
                {sortedProducts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '4em', marginBottom: '20px' }}>📦</div>
                        <h3 style={{ color: '#34495e', marginBottom: '15px' }}>No products available</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
                            Check back later for new products or try refreshing the page.
                        </p>
                        <button 
                            onClick={fetchProducts}
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '25px' 
                    }}>
                        {sortedProducts.map(product => (
                            <div 
                                key={product.id}
                                style={{ 
                                    backgroundColor: '#fff',
                                    borderRadius: '12px', 
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '1px solid #e1e8ed'
                                }}
                                onClick={() => setSelectedProduct(product)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                    {product.imageUrl ? (
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name}
                                            style={{ 
                                                width: '150px', 
                                                height: '150px', 
                                                objectFit: 'cover', 
                                                borderRadius: '8px',
                                                border: '3px solid #f8f9fa'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '150px',
                                            height: '150px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '48px',
                                            margin: '0 auto'
                                        }}>
                                            📦
                                        </div>
                                    )}
                                </div>
                                <h3 style={{ 
                                    margin: '0 0 10px 0', 
                                    fontSize: '1.3em', 
                                    color: '#2c3e50',
                                    textAlign: 'center'
                                }}>
                                    {product.name}
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontSize: '0.9em',
                                    textAlign: 'center',
                                    marginBottom: '15px',
                                    height: '40px',
                                    overflow: 'hidden'
                                }}>
                                    {product.description}
                                </p>
                                <div style={{ 
                                    textAlign: 'center',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}>
                                    <p style={{ 
                                        margin: '0 0 8px 0', 
                                        color: '#27ae60', 
                                        fontSize: '1.5em', 
                                        fontWeight: 'bold'
                                    }}>
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <p style={{
                                        margin: '0',
                                        color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                                        fontSize: '0.9em',
                                        fontWeight: 'bold'
                                    }}>
                                        {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                                    </p>
                                </div>
                                <div style={{ 
                                    textAlign: 'center',
                                    color: '#3498db',
                                    fontSize: '0.9em',
                                    fontWeight: 'bold'
                                }}>
                                    Click to view details & add to cart →
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />

            {/* Footer */}
            <footer style={{
                backgroundColor: '#2c3e50',
                color: '#ecf0f1',
                padding: '40px 20px',
                textAlign: 'center',
                marginTop: '60px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ margin: '0 0 15px 0', fontSize: '1.1em' }}>
                        Built with ❤️ using React & Node.js
                    </p>
                    <p style={{ margin: '0', opacity: '0.7' }}>
                        © 2025 My Fullstack App. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ProductListView;