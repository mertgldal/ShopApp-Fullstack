import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
    const { user, logout, isAdmin } = useAuth();

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'about', label: 'About', icon: 'ℹ️' },
        { id: 'contact', label: 'Contact', icon: '📞' },
        ...(user ? [
            { id: 'cart', label: 'Cart', icon: '🛒' },
            { id: 'orders', label: 'My Orders', icon: '📦' }
        ] : []),
        ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: '⚙️' }] : []),
    ];

    return (
        <nav style={{
            backgroundColor: '#2c3e50',
            padding: '0 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '70px'
            }}>
                {/* Logo */}
                <div 
                    style={{
                        color: '#ecf0f1',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                    onClick={() => onNavigate('home')}
                >
                    🛒 ShopApp
                </div>

                {/* Desktop Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: currentPage === item.id ? '#3498db' : '#ecf0f1',
                                cursor: 'pointer',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                transition: 'all 0.3s',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: currentPage === item.id ? 'rgba(52, 152, 219, 0.1)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (currentPage !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'rgba(236, 240, 241, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}

                    {/* User Authentication */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ color: '#ecf0f1', fontSize: '14px' }}>
                                👋 {user.username}
                                {isAdmin && <span style={{ 
                                    backgroundColor: '#e74c3c', 
                                    color: 'white', 
                                    padding: '2px 6px', 
                                    borderRadius: '10px', 
                                    fontSize: '10px', 
                                    marginLeft: '5px' 
                                }}>ADMIN</span>}
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate('login')}
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            🔑 Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;