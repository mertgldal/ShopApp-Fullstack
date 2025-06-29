import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '60px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{
                        fontSize: '3em',
                        marginBottom: '30px',
                        color: '#2c3e50',
                        textAlign: 'center'
                    }}>
                        About Our Company
                    </h1>
                    
                    <div style={{ fontSize: '4em', textAlign: 'center', marginBottom: '30px' }}>
                        🏢
                    </div>

                    <p style={{
                        fontSize: '1.2em',
                        lineHeight: '1.8',
                        color: '#555',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        We are a modern e-commerce platform dedicated to bringing you the best 
                        products at competitive prices. Our mission is to make online shopping 
                        simple, secure, and enjoyable for everyone.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px',
                        marginTop: '50px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>🎯</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Our Mission</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                To provide excellent products and exceptional customer service.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>👥</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Our Team</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                Experienced professionals committed to your satisfaction.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>🌟</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Our Values</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                Quality, integrity, and customer satisfaction in everything we do.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;