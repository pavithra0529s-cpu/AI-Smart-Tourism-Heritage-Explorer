import React, { useState } from 'react';

const cityDetails = {
  'Chennai Temple Tour': {
    place: 'Kapaleeshwarar Temple',
    food: 'Filter Coffee & Masala Dosa',
  },
  'Bangalore Tech Hub': {
    place: 'Lalbagh Botanical Garden',
    food: 'Bisi Bele Bath',
  },
  'Mumbai Market Visit': {
    place: 'Crawford Market',
    food: 'Vada Pav',
  },
  'Delhi Historical Monuments': {
    place: 'Red Fort',
    food: 'Chole Bhature',
  },
  'Jaipur Temple Visit': {
    place: 'Birla Mandir',
    food: 'Dal Baati Churma',
  },
  'Coimbatore Nature Walk': {
    place: 'Marudamalai Temple',
    food: 'Kongunadu Meals',
  },
  'Madurai Temple Festival': {
    place: 'Meenakshi Amman Temple',
    food: 'Jigarthanda',
  },
};

const History = () => {
  const cities = Object.keys(cityDetails);

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [highlightKeyword, setHighlightKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setCitySearchQuery('');
    addToHistory(city);
  };

  const addToHistory = (term) => {
    const newHistory = [
      ...searchHistory,
      { term, timestamp: new Date().toLocaleString() },
    ];
    if (newHistory.length > 10) {
      newHistory.shift();
    }
    setSearchHistory(newHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const filterHistory = () => {
    return searchHistory.filter((item) => {
      const cityMatch = item.term.toLowerCase().includes(historySearchQuery.toLowerCase());
      const keywordMatch = highlightKeyword
        ? item.term.toLowerCase().includes(highlightKeyword.toLowerCase())
        : true;
      return cityMatch && keywordMatch;
    });
  };

  const getHighlightedText = (text) => {
    if (!highlightKeyword) return text;
    const parts = text.split(new RegExp(`(${highlightKeyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlightKeyword.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#FFEB3B', fontWeight: '600' }}>{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Cities</h2>
      <input
        type="text"
        placeholder="Search city..."
        value={citySearchQuery}
        onChange={(e) => setCitySearchQuery(e.target.value)}
        style={styles.input}
      />

      {citySearchQuery.trim() !== '' && (
        <ul style={styles.cityList}>
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <li
                key={index}
                onClick={() => handleCityClick(city)}
                style={styles.cityItem}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {city}
              </li>
            ))
          ) : (
            <li style={styles.noMatch}>No matching cities</li>
          )}
        </ul>
      )}

      {selectedCity && (
        <div style={styles.cityDetails}>
          <h3 style={{ marginBottom: 10 }}>Selected City: <span style={{color: '#007BFF'}}>{selectedCity}</span></h3>
          <p><strong>Famous Place:</strong> {cityDetails[selectedCity]?.place}</p>
          <p><strong>Famous Food:</strong> {cityDetails[selectedCity]?.food}</p>
        </div>
      )}

      <h2 style={styles.title}>Search History</h2>
      <input
        type="text"
        placeholder="Filter history..."
        value={historySearchQuery}
        onChange={(e) => setHistorySearchQuery(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Highlight keyword (e.g., temple)"
        value={highlightKeyword}
        onChange={(e) => setHighlightKeyword(e.target.value)}
        style={styles.input}
      />

      <ul style={styles.historyList}>
        {filterHistory().map((item, index) => (
          <li key={index} style={styles.historyItem}>
            <span>{getHighlightedText(item.term)}</span>
            <small style={styles.timestamp}>{item.timestamp}</small>
          </li>
        ))}
      </ul>

      <div style={styles.buttons}>
        <button onClick={clearHistory} style={{ ...styles.button, ...styles.clearButton }}>
          Clear History
        </button>
        <button
          onClick={() => addToHistory('Sample Temple Tour')}
          style={{ ...styles.button, ...styles.addButton }}
        >
          Add Sample Term
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '520px',
    margin: '40px auto',
    padding: '25px 30px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f3)',
    boxShadow: '8px 8px 16px #c1c1c1, -8px -8px 16px #ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  title: {
    fontWeight: '700',
    color: '#222',
    marginBottom: '12px',
    userSelect: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    margin: '12px 0',
    borderRadius: '10px',
    border: '1.8px solid #ccc',
    fontSize: '1rem',
    transition: 'all 0.25s ease-in-out',
    outline: 'none',
    boxShadow: 'inset 2px 2px 5px #eaeaea',
  },
  cityList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '170px',
    overflowY: 'auto',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
  },
  cityItem: {
    padding: '12px 20px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    userSelect: 'none',
  },
  noMatch: {
    padding: '15px 20px',
    color: '#888',
    fontStyle: 'italic',
  },
  cityDetails: {
    marginTop: '25px',
    padding: '18px 22px',
    backgroundColor: '#f7f9fc',
    borderRadius: '14px',
    boxShadow: 'inset 2px 2px 6px #d6ddeb',
    fontSize: '1.05rem',
    color: '#444',
  },
  historyList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0',
    maxHeight: '220px',
    overflowY: 'auto',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgb(0 0 0 / 0.1)',
  },
  historyItem: {
    padding: '14px 20px',
    borderBottom: '1px solid #eee',
    fontWeight: '500',
    color: '#555',
  },
  timestamp: {
    display: 'block',
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    flex: '1 1 48%',
    padding: '12px 0',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    userSelect: 'none',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(255, 107, 107, 0.4)',
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
    marginLeft: '10px',
  },
};

export default History;
