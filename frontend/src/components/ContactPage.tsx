import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
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
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '3em',
                    marginBottom: '50px',
                    color: '#2c3e50',
                    textAlign: 'center'
                }}>
                    Contact Us
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '50px'
                }}>
                    {/* Contact Form */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Send us a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#555',
                                    fontWeight: 'bold'
                                }}>
                                    Name
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
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                    placeholder="Your name"
                                />
                            </div>
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
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#555',
                                    fontWeight: 'bold'
                                }}>
                                    Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        resize: 'vertical',
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px 30px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                📧 Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Get in Touch</h2>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ fontSize: '2em', marginBottom: '15px' }}>📍</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Address</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                123 Business Street<br />
                                City, State 12345<br />
                                United States
                            </p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ fontSize: '2em', marginBottom: '15px' }}>📞</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Phone</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                +1 (555) 123-4567
                            </p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ fontSize: '2em', marginBottom: '15px' }}>✉️</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Email</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                contact@shopapp.com
                            </p>
                        </div>

                        <div>
                            <div style={{ fontSize: '2em', marginBottom: '15px' }}>🕒</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Business Hours</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 10:00 AM - 4:00 PM<br />
                                Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;