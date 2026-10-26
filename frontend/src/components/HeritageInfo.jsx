import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function HeritageInfo() {
  const [place, setPlace] = useState('');
  const [language, setLanguage] = useState('en');
  const [info, setInfo] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please login first!');
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'http://localhost:5001/api/get_heritage_info',
        { place, language },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply = response.data.info || response.data.message || response.data.reply;

      if (botReply) {
        setInfo(botReply);
        setAudioUrl(response.data.audio_url || '');
        setImageUrl(response.data.image_url || '');

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `You: ${place}`, isUser: true },
          { text: `Bot: ${botReply}`, isUser: false },
        ]);

        setPlace('');

        const speech = new SpeechSynthesisUtterance(botReply);
        speech.lang = language;
        window.speechSynthesis.speak(speech);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch information.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: 'auto',
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      background: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      marginTop: '30px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#3a3a3a',
      fontWeight: 'bold',
      fontSize: '2rem',
    },
    input: {
      padding: '12px',
      width: '100%',
      marginBottom: '15px',
      borderRadius: '10px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    button: {
      padding: '12px 25px',
      backgroundColor: '#1e88e5',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#1565c0',
    },
    message: {
      marginBottom: '12px',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '15px',
      lineHeight: '1.5',
    },
    user: {
      backgroundColor: '#e1f5fe',
      textAlign: 'right',
    },
    bot: {
      backgroundColor: '#f9f9f9',
      textAlign: 'left',
    },
    image: {
      width: '100%',
      maxHeight: '300px',
      objectFit: 'cover',
      marginTop: '20px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    map: {
      width: '100%',
      height: '300px',
      border: 0,
      marginTop: '20px',
      borderRadius: '10px',
    },
    sectionTitle: {
      marginTop: '30px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
    },
    audio: {
      marginTop: '20px',
      width: '100%',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌍 AI TOURIST GUIDE Heritage Explorer</h2>

      <input
        style={styles.input}
        type="text"
        placeholder="Enter heritage place (e.g., Taj Mahal)"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />

      <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.input}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="bn">Bengali</option>
      </select>

      <button style={styles.button} onClick={fetchInfo}>Get Info</button>

      {loading && <div style={{ marginTop: '15px' }}><Spinner animation="border" /></div>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{ ...styles.message, ...(msg.isUser ? styles.user : styles.bot) }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {audioUrl && <audio controls src={audioUrl} style={styles.audio}></audio>}
      {imageUrl && <img src={imageUrl} alt="Heritage" style={styles.image} />}
      {place && (
        <iframe
          title="map"
          style={styles.map}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(place)}`}
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <h3 style={styles.sectionTitle}>Heritage Info:</h3>
        <p>{info}</p>
      </div>
    </div>
  );
}

export default HeritageInfo;
