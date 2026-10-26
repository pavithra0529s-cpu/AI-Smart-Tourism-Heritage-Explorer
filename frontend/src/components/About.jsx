import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState(null);

  const handleChatbotClick = () => {
    navigate('/');
  };

  const heritageSites = [
    {
      name: 'Brihadeeswarar Temple',
      location: 'Thanjavur, Tamil Nadu',
      description:
        'A UNESCO World Heritage Site known for its Chola-era Dravidian architecture. Built by Raja Raja Chola I in the 11th century, this granite marvel features a 66-meter vimana and massive Nandi statue.',
      image:
        'https://cdn.pixabay.com/photo/2022/06/14/12/04/temple-7261737_640.jpg',
    },
    {
      name: 'Meenakshi Amman Temple',
      location: 'Madurai, Tamil Nadu',
      description:
        'A historic Hindu temple dedicated to Goddess Meenakshi and Lord Sundareswarar. Famous for its colorful gopurams and intricate sculptures.',
      image:
        'https://media.istockphoto.com/id/485572704/photo/madurai-temple.jpg?s=612x612&w=0&k=20&c=ZGYBd1cwl5KSguo1twNFeoA4yuoNcIea72VXnpHIFho=',
    },
    {
      name: 'Shore Temple',
      location: 'Mahabalipuram, Tamil Nadu',
      description:
        'Built during the Pallava dynasty in the 8th century, this granite temple complex stands on the shores of the Bay of Bengal. It’s also a UNESCO World Heritage Site.',
      image:
        'https://media.istockphoto.com/id/579221042/photo/fantastic-art-design-of-monolithic-famous-shore-temple.jpg?s=612x612&w=0&k=20&c=8YqXhGxvIKIcb5OFeWvfcmBMTDPbuhFSHQA3ZHX-5f0=',
    },
    {
      name: 'Airavatesvara Temple',
      location: 'Darasuram, Tamil Nadu',
      description:
        'A 12th-century temple built by Rajaraja Chola II, showcasing exquisite stone carvings and a rich Chola architectural legacy. Also part of the "Great Living Chola Temples" UNESCO site.',
      image:
        'https://media.istockphoto.com/id/1170465041/photo/agra-mandapa-maha-mandapa-airavatesvara-temple-darasuram-tamil-nadu-india-view-from-south-east.jpg?s=612x612&w=0&k=20&c=OA7BFIC5dQminyblAWeoveYVcwOKQAVaosGjIiI0DHM=',
    },
  ];

  const handleSiteClick = (site) => {
    setSelectedSite(site);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🌄 Famous Heritage Sites in Tamil Nadu</h2>

      {selectedSite ? (
        <div style={styles.selectedSite}>
          <img src={selectedSite.image} alt={selectedSite.name} style={styles.largeImage} />
          <h3 style={styles.siteName}>{selectedSite.name}</h3>
          <p><strong>📍 Location:</strong> {selectedSite.location}</p>
          <p style={styles.description}>{selectedSite.description}</p>
          <button onClick={() => setSelectedSite(null)} style={styles.secondaryButton}>← Back</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {heritageSites.map((site, index) => (
            <div key={index} style={styles.card} onClick={() => handleSiteClick(site)}>
              <img src={site.image} alt={site.name} style={styles.image} />
              <h3 style={styles.siteName}>{site.name}</h3>
              <p style={styles.location}>📍 {site.location}</p>
              <p style={styles.snippet}>{site.description.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleChatbotClick} style={styles.button}>
        💬 Ask Chatbot for More
      </button>
    </div>
  );
}

const styles = {
  page: {
    background: 'linear-gradient(to right, #fffbe6, #e6f7ff)',
    padding: '40px 20px',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '1100px',
    margin: 'auto',
  },
  heading: {
    fontSize: '32px',
    color: '#003366',
    textAlign: 'center',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  largeImage: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  siteName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  location: {
    color: '#555',
    marginBottom: '8px',
  },
  snippet: {
    fontSize: '15px',
    color: '#666',
  },
  selectedSite: {
    textAlign: 'center',
  },
  description: {
    fontSize: '16px',
    color: '#444',
    maxWidth: '800px',
    margin: '20px auto',
  },
  button: {
    marginTop: '40px',
    padding: '14px 30px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  secondaryButton: {
    marginTop: '30px',
    padding: '12px 25px',
    fontSize: '15px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default About;
