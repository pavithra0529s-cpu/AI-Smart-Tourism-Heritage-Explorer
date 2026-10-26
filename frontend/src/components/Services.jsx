import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate('/contact');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🌟 Services Offered</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>🗺️ Guided Tours</li>
        <li style={styles.listItem}>🎭 Cultural Programs</li>
        <li style={styles.listItem}>📸 Photography Points</li>
        <li style={styles.listItem}>🛍️ Food & Souvenir Stalls</li>
      </ul>
      <button onClick={goToContact} style={styles.button}>Next →</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#fff9f0',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    fontSize: '32px',
    color: '#FF6600',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    fontSize: '20px',
    lineHeight: '2.2',
    color: '#444',
    marginBottom: '30px',
  },
  listItem: {
    backgroundColor: '#ffe0b3',
    padding: '10px 15px',
    margin: '8px 0',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#FF6600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background 0.3s ease, transform 0.2s ease',
  },
};

export default Services;
