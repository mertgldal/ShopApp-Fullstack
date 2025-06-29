import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
            } else {
                await register(formData.username, formData.email, formData.password);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Authentication failed');
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
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔐</div>
                    <h1 style={{ color: '#2c3e50', margin: '0' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
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
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
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
                            placeholder="Enter your username"
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
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
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontWeight: 'bold'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#95a5a6' : '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '15px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            width: '100%',
                            marginBottom: '20px',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {loading ? '🔄 Processing...' : (isLogin ? '🔑 Login' : '✅ Sign Up')}
                    </button>
                </form>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3498db',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                    </button>
                </div>

                {isLogin && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#e8f5e8',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>Demo Credentials:</strong><br />
                        Username: admin<br />
                        Password: admin123
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;