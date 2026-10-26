import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const goToChatbot = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📞 Contact Details</h2>
      <div style={styles.infoBlock}>
        <p style={styles.info}><strong>🏢 Tourism Office:</strong> +91-9876543210</p>
        <p style={styles.info}><strong>✉️ Email:</strong> info@heritageinfo.in</p>
        <p style={styles.info}><strong>📍 Address:</strong> Near Big Temple, Thanjavur, Tamil Nadu, India</p>
      </div>
      <button
        onClick={goToChatbot}
        style={styles.button}
        onMouseOver={(e) => (e.currentTarget.style.background = '#d35400')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#e67e22')}
      >
        Go to Chatbot →
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '650px',
    margin: '60px auto',
    padding: '40px',
    background: 'linear-gradient(135deg, #fffbe6, #fceabb)',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'center',
  },
  header: {
    fontSize: '36px',
    color: '#6c3483',
    marginBottom: '25px',
    fontWeight: '600',
  },
  infoBlock: {
    backgroundColor: '#fef9f3',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
    marginBottom: '35px',
    textAlign: 'left',
  },
  info: {
    fontSize: '18px',
    color: '#2c3e50',
    marginBottom: '12px',
    lineHeight: '1.7',
  },
  button: {
    padding: '14px 35px',
    fontSize: '16px',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '10px',
    fontWeight: 'bold',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  }
};

export default Contact;
