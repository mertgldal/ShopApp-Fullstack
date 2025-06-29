import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ProductListView from './components/View';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user } = useAuth();

  // Redirect if trying to access login page while logged in
  useEffect(() => {
    if (user && currentPage === 'login') {
      setCurrentPage('products');
    }
  }, [user, currentPage]);

  const renderPage = () => {
    // Redirect to login if trying to access protected pages without authentication
    if (!user && ['cart', 'orders', 'admin'].includes(currentPage)) {
      return <LoginPage />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListView />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'login':
        return <LoginPage />;
      case 'cart':
        return <CartPage />;
      case 'orders':
        return <OrdersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;