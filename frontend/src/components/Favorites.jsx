import React, { useEffect, useState } from 'react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [newPlace, setNewPlace] = useState({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = () => {
    if (!newPlace.name || !newPlace.location || !newPlace.description) {
      alert('Please fill in all fields.');
      return;
    }

    const newFavorite = {
      ...newPlace,
      category: 'place',
      addedAt: new Date().toISOString(),
    };

    setFavorites([...favorites, newFavorite]);
    setNewPlace({ name: '', location: '', description: '' }); // reset form
  };

  const removeFavorite = (site) => {
    if (window.confirm(`Remove "${site.name}" from favorites?`)) {
      const updatedFavorites = favorites.filter(
        (fav) => fav.name !== site.name || fav.category !== site.category
      );
      setFavorites(updatedFavorites);
    }
  };

  const clearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all tourist places?')) {
      const updatedFavorites = favorites.filter(fav => fav.category !== 'place');
      setFavorites(updatedFavorites);
    }
  };

  const sortFavorites = (items) => {
    const sorted = [...items];
    if (sortOption === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
    return sorted;
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const renderTouristPlaces = () => {
    const filtered = favorites.filter(fav =>
      fav.category === 'place' &&
      (fav.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fav.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filtered.length === 0) return <p>No tourist places in favorites.</p>;

    const sorted = sortFavorites(filtered);

    return (
      <ul style={styles.list}>
        {sorted.map((site, index) => (
          <li key={index} style={styles.listItem}>
            <h3>{highlightText(site.name, searchQuery)}</h3>
            <p><strong>Location:</strong> {highlightText(site.location, searchQuery)}</p>
            <p><strong>Details:</strong> {site.description}</p>
            {site.addedAt && (
              <p><strong>Added:</strong> {new Date(site.addedAt).toLocaleString()}</p>
            )}
            <button onClick={() => removeFavorite(site)} style={styles.removeButton}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const hasTouristPlaces = favorites.some(fav => fav.category === 'place');

  return (
    <div style={styles.container}>
      <h2>🏛️ Favorite Tourist Places</h2>

      <div style={styles.formContainer}>
        <h3>Add Tourist Place</h3>
        <input
          type="text"
          placeholder="Name"
          value={newPlace.name}
          onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={newPlace.location}
          onChange={(e) => setNewPlace({ ...newPlace, location: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={newPlace.description}
          onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
          style={styles.textarea}
        />
        <button onClick={addFavorite} style={styles.addButton}>
          ➕ Add to Favorites
        </button>
      </div>

      {!hasTouristPlaces ? (
        <p>No favorite tourist places added yet.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search tourist places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.sortContainer}>
            <label><strong>Sort by:</strong></label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={styles.dropdown}
            >
              <option value="recent">Recently Added</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {renderTouristPlaces()}

          <button
            onClick={clearFavorites}
            style={styles.clearButton}
            disabled={!hasTouristPlaces}
          >
            Clear All Tourist Places
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  removeButton: {
    marginTop: '10px',
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  clearButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    opacity: 1,
  },
  searchInput: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
  },
  dropdown: {
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sortContainer: {
    marginBottom: '20px',
  },
  formContainer: {
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#eef',
    borderRadius: '10px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    height: '80px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Favorites;
