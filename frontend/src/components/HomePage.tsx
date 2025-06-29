import React from 'react';

const HomePage: React.FC = () => {
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
                padding: '100px 20px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '4em',
                    margin: '0 0 30px 0',
                    fontWeight: '700'
                }}>
                    Welcome to ShopApp
                </h1>
                <p style={{
                    fontSize: '1.4em',
                    margin: '0 0 40px 0',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: '1.6',
                    opacity: '0.9'
                }}>
                    Your one-stop destination for amazing products. Discover, browse, and shop 
                    with confidence in our curated collection of quality items.
                </p>
            </div>

            {/* Features Section */}
            <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '2.5em',
                    marginBottom: '60px',
                    color: '#2c3e50'
                }}>
                    Why Choose Us?
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px'
                }}>
                    {[
                        {
                            icon: '🚀',
                            title: 'Fast & Reliable',
                            description: 'Lightning-fast performance with 99.9% uptime guarantee'
                        },
                        {
                            icon: '🔒',
                            title: 'Secure Shopping',
                            description: 'Your data is protected with enterprise-grade security'
                        },
                        {
                            icon: '🎯',
                            title: 'Quality Products',
                            description: 'Carefully curated selection of premium quality items'
                        }
                    ].map((feature, index) => (
                        <div key={index} style={{
                            backgroundColor: '#fff',
                            padding: '40px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s'
                        }}>
                            <div style={{ fontSize: '4em', marginBottom: '20px' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.5em',
                                marginBottom: '15px',
                                color: '#2c3e50'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                lineHeight: '1.6'
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;