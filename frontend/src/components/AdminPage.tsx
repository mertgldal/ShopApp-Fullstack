import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock) || 0,
                    imageUrl: formData.imageUrl
                }),
            });

            if (response.ok) {
                setMessage('Product added successfully!');
                setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
            } else {
                const error = await response.json();
                setMessage(error.message || 'Failed to add product');
            }
        } catch (error) {
            setMessage('Error adding product');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{
                        fontSize: '2.5em',
                        marginBottom: '30px',
                        color: '#2c3e50',
                        textAlign: 'center'
                    }}>
                        🛠️ Admin - Add Product
                    </h1>

                    {message && (
                        <div style={{
                            padding: '15px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                            color: message.includes('successfully') ? '#155724' : '#721c24',
                            border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                required
                                placeholder="Enter product name"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Enter product description"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                required
                                placeholder="0.00"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="0"
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="https://example.com/image.jpg"
                            />
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                Leave empty for placeholder image
                            </small>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#95a5a6' : '#27ae60',
                                color: 'white',
                                border: 'none',
                                padding: '15px 30px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                width: '100%',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {loading ? '🔄 Adding Product...' : '✅ Add Product'}
                        </button>
                    </form>

                    <div style={{ 
                        marginTop: '30px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px' 
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>💡 Image Tips:</h3>
                        <p style={{ color: '#666', margin: '0', lineHeight: '1.5' }}>
                            For best results, use images that are:
                            <br />• Square aspect ratio (300x300px recommended)
                            <br />• High quality and clear
                            <br />• Try Unsplash.com for free stock photos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;