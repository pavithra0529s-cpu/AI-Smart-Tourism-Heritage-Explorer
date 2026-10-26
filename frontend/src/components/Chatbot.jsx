import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInput from './ChatInput';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isBotProcessing, setIsBotProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [language, setLanguage] = useState('en');
  const [context, setContext] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (savedMessages) setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const speakBotMessage = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    }
  };

  const addUserMessage = (message) => {
    setMessages((prev) => [...prev, { sender: 'user', text: message }]);
  };

  const addBotMessage = (message) => {
    setMessages((prev) => [...prev, { sender: 'bot', ...message }]);
    if (message.text) speakBotMessage(message.text);
  };

  const locationData = {
    erode: {
      lat: 11.3390793, lng: 77.7249633,
      details: {
        temple: 'Periya Mariamman Temple',
        tourist: 'Vellode Bird Sanctuary',
        restaurant: 'Hotel Junior Kuppanna',
        food: 'Kongu Chicken Curry',
      }
    },sathyamanagalam: {
      lat: 11.5526, lng: 77.1393,
      details: {
        temple: 'bannari amman Temple',
        tourist: 'wildlife',
        restaurant: 'Gayathri Bhavan',
        food: 'Kongu Chicken Curry',
      }
    },erodethindal: {
      lat: 11.317164, lng: 77.6763937,
      details: {
        temple: 'thindal murugan Temple',
        tourist: 'vellode bird sanctuary',
        restaurant: 'meenakshi mess',
        food: 'Kongu Chicken Curry',
      }
    },bhavani: {
      lat: 11.4560, lng: 77.6840,
      details: {
        temple: 'Bhavani Sangameswarar Temple',
        tourist: 'vellode bird sanctuary',
        restaurant: 'meenakshi mess',
        food: 'Kongu Chicken Curry',
      }
    },
kodiveridam: {
      lat: 11.47306, lng: 77.29639,
      details: {
        temple: 'Linga Bhairavi Temple',
        tourist: 'Kodiveri dam',
        restaurant: 'meenakshi mess',
        food: 'Kongu Chicken Curry',
      }
    },
    madurai: {
      lat: 9.9195, lng: 78.1193,
      details: {
        temple: 'Meenakshi Amman Temple',
        tourist: 'Thirumalai Nayakkar Palace',
        restaurant: 'Murugan Idli Shop',
        food: 'Jigarthanda',
      }
    },
    chennai: {
      lat: 13.0337, lng: 80.2699,
      details: {
        temple: 'Kapaleeshwarar Temple',
        tourist: 'Marina Beach',
        restaurant: 'Saravana Bhavan',
        food: 'Masala Dosa',
      }
    },
    coimbatore: {
      lat: 11.0466, lng: 76.8517,
      details: {
        temple: 'Marudhamalai Temple',
        tourist: 'VOC Park & Zoo',
        restaurant: 'Hari Bhavanam',
        food: 'Kongu Style Biryani',
      }
    },
    trichy: {
      lat: 10.86250, lng: 78.68972,
      details: {
        temple: 'Sri Ranganathaswamy Temple',
        tourist: 'Rockfort Temple',
        restaurant: 'Sree Madapalli',
        food: 'Manapparai Murukku',
      }
    },
    salem: {
      lat: 11.65704, lng: 78.15989,
      details: {
        temple: 'Sugavaneshwarar Temple',
        tourist: 'Yercaud Hill Station',
        restaurant: 'Selvi Mess',
        food: 'Salem Chicken Curry',
      }
    },
    vellore: {
      lat: 12.9165, lng: 79.1325,
      details: {
        temple: 'Jalakandeswarar Temple',
        tourist: 'Vellore Fort',
        restaurant: 'Hotel Aryaas',
        food: 'Dosa with Vellore-style Chutney',
      }
    },
    thanjavur: {
      lat: 10.7867, lng: 79.1378,
      details: {
        temple: 'Brihadeeswarar Temple',
        tourist: 'Thanjavur Royal Palace',
        restaurant: 'Sathars',
        food: 'South Indian Thali',
      }
    }
  };

  const handleSend = async (userMessage) => {
    addUserMessage(userMessage);
    setIsBotTyping(true);
    setIsBotProcessing(true);
    setIsError(false);

    try {
      const trimmedMsg = userMessage.trim().toLowerCase();

      if (locationData[trimmedMsg]) {
        const loc = locationData[trimmedMsg];
        addBotMessage({
          text: `Here’s what you can explore in ${userMessage}:\n🛕 Temple: ${loc.details.temple}\n🏞️ Tourist Spot: ${loc.details.tourist}\n🍽️ Restaurant: ${loc.details.restaurant} (Famous for: ${loc.details.food})\n\nExplore on the map below.`,
          type: 'map',
          mapData: { lat: loc.lat, lng: loc.lng }
        });
      } else {
        const botReply = await fetchBotResponse(userMessage, context, language);
        addBotMessage(botReply);
      }

      setContext((prev) => [...prev, userMessage]);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      addBotMessage({ text: 'Sorry, something went wrong. Please try again later.' });
    }

    setIsBotTyping(false);
    setIsBotProcessing(false);
  };

  const fetchBotResponse = async (userMessage, context, language) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const response = await axios.post(
      'http://127.0.0.1:5001/api/chatbot',
      { user_message: userMessage, context, language },
      { headers }
    );

    return {
    text: response.data.reply,
    audio: response.data.audio_url || null,
    sources: response.data.sources || [],
    }; 
  };

  const clearChat = () => {
    setMessages([]);
    setContext([]);
    localStorage.removeItem('chatMessages');
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          addUserMessage('My current location');
          addBotMessage({
            text: 'Here is your current location.',
            type: 'map',
            mapData: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        () => addBotMessage({ text: 'Unable to retrieve your location.' })
      );
    } else {
      addBotMessage({ text: 'Geolocation is not supported by your browser.' });
    }
  };

  useEffect(() => {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
  }, [messages]);

  return (
    <div style={styles.container}>
      <div id="chatbox" style={styles.chatbox}>
        <MessagesContainer messages={messages} />
        {isBotTyping && <p style={styles.typingIndicator}>Bot is typing...</p>}
        {isBotProcessing && <div className="loading-spinner">Processing...</div>}
        {isError && (
          <button style={styles.retryButton} onClick={() => handleSend('retry')}>
            Retry
          </button>
        )}
      </div>

      <div style={styles.buttons}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select}>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="hi">Hindi</option>
        </select>
        <button onClick={getLocation} style={styles.locationButton}>📍 Share Location</button>
        <button onClick={clearChat} style={styles.clearButton}>🗑️ Clear Chat</button>
      </div>

      <ChatInput onSend={handleSend} language={language} />
    </div>
  );
};

const MessagesContainer = ({ messages }) => (
  <div>
    {messages.map((msg, idx) => <Message key={idx} message={msg} />)}
  </div>
);

const Message = ({ message }) => {
  if (message.type === 'map') {
    const { lat, lng } = message.mapData;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return (
      <div style={styles.botMsg}>
        <p>{message.text}</p>
        <iframe
          title="map"
          src={mapUrl}
          width="100%"
          height="200"
          style={{ border: 0, marginTop: '10px' }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    );
  }

  return (
  <div style={message.sender === 'user' ? styles.userMsg : styles.botMsg}>
    <p>{message.text}</p>

    {message.sender !== 'user' && message.sources?.length > 0 && (
      <div style={{ marginTop: '10px', fontSize: '13px' }}>
        <strong>Sources:</strong>
        <ul>
          {message.sources.map((url, index) => (
            <li key={index}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0d9488', overflowWrap: 'anywhere' }}
              >
                Official reference {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    height: '90vh',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  chatbox: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#F5F5F5'
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#999'
  },
  retryButton: {
    marginTop: '10px',
    backgroundColor: '#FF6666',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#FFF',
    borderTop: '1px solid #ccc'
  },
  select: {
    padding: '6px',
    borderRadius: '5px'
  },
  locationButton: {
    padding: '6px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px'
  },
  clearButton: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px'
  }
};


export default Chatbot;
