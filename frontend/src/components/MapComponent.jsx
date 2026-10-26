import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for waterfalls (blue drop)
const waterfallIcon = new L.Icon({
  iconUrl:
    'https://cdn-icons-png.flaticon.com/512/252/252035.png', // blue water drop icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const templeLocations = [
  { name: "Chennai - Kapaleeshwarar Temple", lat: 13.0337, lng: 80.2699 },
  { name: "Erode - Periya Mariamman Temple", lat: 11.3390793, lng: 77.7249633 },
  { name: "Sathyamangalam - Bannari Amman Temple", lat: 11.5526, lng: 77.1393 },
  { name: "Thindal - Thindal Murugan Temple", lat: 11.317164, lng: 77.6763937 },
  { name: "Bhavani - Bhavani Sangameswarar Temple", lat: 11.4560, lng: 77.6840 },
  { name: "Kodiveri Dam - Linga Bhairavi Temple", lat: 11.47306, lng: 77.29639 },
  { name: "Madurai - Meenakshi Amman Temple", lat: 9.9195, lng: 78.1193 },
  { name: "Coimbatore - Marudhamalai Temple", lat: 11.0466, lng: 76.8517 },
  { name: "Trichy - Sri Ranganathaswamy Temple", lat: 10.86250, lng: 78.68972 },
  { name: "Salem - Sugavaneshwarar Temple", lat: 11.65704, lng: 78.15989 },
  { name: "Vellore - Jalakandeswarar Temple", lat: 12.9165, lng: 79.1325 },
  { name: "Thanjavur - Brihadeeswarar Temple", lat: 10.7867, lng: 79.1378 },
  { name: "Tirupati - Sri Venkateswara Temple", lat: 13.6831, lng: 79.3473 },
  { name: "Thiruvarur - Thyagaraja Temple", lat: 10.7720, lng: 79.6365 },
  { name: "Yellamma Temple - Saundatti, Karnataka", lat: 15.9649, lng: 74.5860 },
  { name: "Kumbakonam - Adi Kumbeswarar Temple", lat: 10.9602, lng: 79.3774 },
{ name: "Kumbakonam - Sarangapani Temple", lat: 10.9620, lng: 79.3833 },
{ name: "Kumbakonam - Ramaswamy Temple", lat: 10.9614, lng: 79.3835 },
{
    name: "Kanchipuram - Kailasanathar Temple",
    lat: 12.8316,
    lng: 79.7036,

  },
  {
    name: "Rameswaram - Ramanathaswamy Temple",
    lat: 9.2880,
    lng: 79.3129,

  },
  {
    name: "Tiruchendur - Subramanya Swamy Temple",
    lat: 8.5019,
    lng: 78.1180,

  },
  {
    name: "Chidambaram - Nataraja Temple",
    lat: 11.4064,
    lng: 79.6883,

  },
  {
    name: "Palani - Palani Murugan Temple",
    lat: 10.4530,
    lng: 77.5200,

  },{
    name: "Tirunelveli - Nellaiappar Temple",
    lat: 8.7304,
    lng: 77.6950,

  },
  {
    name: "Pollachi - Masani Amman Temple",
    lat: 10.6689,
    lng: 77.0056,

  },
  {
    name: "Velankanni - Basilica of Our Lady of Good Health",
    lat: 10.6789,
    lng: 79.8492,

  },{
    name: "Kanchipuram - Ekambareswarar Temple",
    lat: 12.8333,
    lng: 79.7167,

  },{
    name: "Kanyakumari - Kumari Amman Temple",
    lat: 8.0883,
    lng: 77.5385,

  },{
    name: "Pollachi - Anamalai Temple",
    lat: 10.6578,
    lng: 77.0006,
  },{ name: "Bengaluru - Bull Temple", lat: 12.9537, lng: 77.5731 },
  { name: "Bengaluru - ISKCON Temple", lat: 13.0081, lng: 77.5512 },
  { name: "Pune - Dagdusheth Halwai Ganapati Temple", lat: 18.5167, lng: 73.8567 },
  { name: "Pune - Parvati Hill Temple", lat: 18.5294, lng: 73.8614 },
  { name: "Hyderabad - Birla Mandir", lat: 17.4250, lng: 78.4480 },
  { name: "Hyderabad - Chilkur Balaji Temple", lat: 17.4378, lng: 78.3808 },
  { name: "Mumbai - Siddhivinayak Temple", lat: 19.0176, lng: 72.8306 },
  { name: "Mumbai - Mahalaxmi Temple", lat: 18.9822, lng: 72.8167 },
  { name: "Delhi - Akshardham Temple", lat: 28.6127, lng: 77.2773 },
  { name: "Delhi - Lotus Temple", lat: 28.5535, lng: 77.2588 },
];


const waterfallsIndia = [
  {
    name: "Jog Falls",
    state: "Karnataka",
    lat: 14.2320,
    lng: 74.7845,
    details: {
      height: "253 meters",
      description: "One of the highest plunge waterfalls in India.",
      nearby: "Shimoga",
    }
  },
  {
    name: "Dudhsagar Falls",
    state: "Goa",
    lat: 15.3147,
    lng: 74.3147,
    details: {
      height: "310 meters",
      description: "Famous milky white waterfall on the Mandovi River.",
      nearby: "Goa-Karnataka border",
    }
  },
  {
    name: "Athirappilly Falls",
    state: "Kerala",
    lat: 10.2953,
    lng: 76.6045,
    details: {
      height: "80 feet",
      description: "Known as the Niagara of India.",
      nearby: "Thrissur",
    }
  },
  {
    name: "Nohkalikai Falls",
    state: "Meghalaya",
    lat: 25.2149,
    lng: 91.7310,
    details: {
      height: "340 meters",
      description: "India's tallest plunge waterfall.",
      nearby: "Cherrapunji",
    }
  },{
    name: "Kempty Falls",
    state: "Uttarakhand",
    lat: 30.3958,
    lng: 78.0421,
    details: {
      height: "40 feet",
      description: "Popular waterfall and tourist spot near Mussoorie.",
      nearby: "Mussoorie",
    }
  },
  {
    name: "Thommankuthu Falls",
    state: "Kerala",
    lat: 9.7833,
    lng: 76.9000,
    details: {
      height: "100 feet",
      description: "Seven-step waterfall in the Western Ghats.",
      nearby: "Idukki",
    }
  },{
    name: "Dabhosa Falls",
    state: "Maharashtra",
    lat: 19.7800,
    lng: 73.5300,
    details: {
      height: "300 feet",
      description: "Largest waterfall in Maharashtra near Mumbai.",
      nearby: "Jawhar",
    }
  },

  {
    name: "Hogenakkal Falls",
    state: "Tamil Nadu",
    lat: 12.1130,
    lng: 77.5250,
    details: {
      height: "20 meters",
      description: "Known as the Niagara of India in South India.",
      nearby: "Dharmapuri",
    }
  },
  {
    name: "Kunchikal Falls",
    state: "Karnataka",
    lat: 13.5431,
    lng: 75.4385,
    details: {
      height: "455 meters",
      description: "Highest waterfall in India, located in the Western Ghats.",
      nearby: "Shimoga",
    }
  },
  {
    name: "Bhagsu Waterfall",
    state: "Himachal Pradesh",
    lat: 32.2340,
    lng: 76.3210,
    details: {
      height: "30 meters",
      description: "Popular tourist spot near McLeod Ganj.",
      nearby: "Dharamshala",
    }
  },
  {
    name: "Barehipani Falls",
    state: "Odisha",
    lat: 21.7850,
    lng: 86.1870,
    details: {
      height: "399 meters",
      description: "Second highest waterfall in India.",
      nearby: "Simlipal National Park",
    }
  },
  {
    name: "Kempty Falls",
    state: "Uttarakhand",
    lat: 30.3600,
    lng: 78.0600,
    details: {
      height: "40 meters",
      description: "Popular tourist spot near Mussoorie.",
      nearby: "Dehradun",
    }
  },

  {
    name: "Courtallam Falls",
    state: "Tamil Nadu",
    lat: 8.9381,
    lng: 77.2745,
    details: {
      height: "30 meters",
      description: "Famous waterfall known for medicinal properties.",
      nearby: "Tirunelveli",
    },
  },{
    name: "Courtallam Falls",
    lat: 8.9333,
    lng: 77.3167,
    details: {
      height: "50 meters",
      description: "Popular waterfall and tourist spot known as the 'Spa of South India'.",
      nearby: "Tenkasi",
    },}, {
    name: "Pykara Falls",
    lat: 11.3525,
    lng: 76.5858,
    details: {
      height: "55 meters",
      description: "A beautiful waterfall located in the Nilgiris district.",
      nearby: "Ooty",
    },
  },
  {
    name: "Agaya Gangai Falls",
    state: "Tamil Nadu",
    lat: 11.5396,
    lng: 77.5449,
    details: {
      height: "300 meters",
      description: "Sacred waterfall in Kolli Hills.",
      nearby: "Namakkal",
    },
  },
  {
    name: "Kundalika Falls",
    state: "Tamil Nadu",
    lat: 10.2700,
    lng: 78.5900,
    details: {
      height: "50 meters",
      description: "Scenic waterfall near Coimbatore.",
      nearby: "Coimbatore",
    },
  },{
    name: "Dudhsagar Falls",
    state: "Goa",
    lat: 15.3147,
    lng: 74.3147,
    details: {
      height: "310 meters",
      description: "Famous milky white waterfall on the Mandovi River.",
      nearby: "Goa-Karnataka border",
    }
  },
  {
    name: "Athirappilly Falls",
    state: "Kerala",
    lat: 10.2953,
    lng: 76.6045,
    details: {
      height: "80 feet",
      description: "Known as the Niagara of India.",
      nearby: "Thrissur",
    }
  },
  {
    name: "Panchgani Waterfall",
    state: "Maharashtra",
    lat: 17.9247,
    lng: 73.8189,
    details: {
      height: "Approx 30 meters",
      description: "A beautiful waterfall located near the hill station Panchgani.",
      nearby: "Panchgani, near Pune",
    }
  },
  {
    name: "Kuntala Falls",
    state: "Telangana",
    lat: 18.6684,
    lng: 78.8049,
    details: {
      height: "147 feet",
      description: "The highest waterfall in Telangana, scenic and serene.",
      nearby: "Adilabad",
    }
  },
  {
    name: "Shivanasamudra Falls",
    state: "Karnataka",
    lat: 12.3050,
    lng: 76.6399,
    details: {
      height: "98 meters",
      description: "A segmented waterfall on the Kaveri river.",
      nearby: "Mysore",
    }
  },
  {
    name: "Meenmutty Falls",
    state: "Kerala",
    lat: 11.6167,
    lng: 76.1066,
    details: {
      height: "300 meters",
      description: "A three-tiered waterfall in Wayanad district.",
      nearby: "Wayanad",
    }
  },{
    name: "Soochipara Falls",
    state: "Kerala",
    lat: 11.4630,
    lng: 75.9720,
    details: {
      height: "200 feet",
      description: "Three-tiered waterfall with a pool for swimming.",
      nearby: "Wayanad",
    }
  },
  {
    name: "Magod Falls",
    state: "Karnataka",
    lat: 15.5410,
    lng: 74.8695,
    details: {
      height: "181 meters",
      description: "Waterfall formed by the Bedti River cascading down cliffs.",
      nearby: "Uttara Kannada",
    }
  },
  {
    name: "Palaruvi Falls",
    state: "Kerala",
    lat: 9.3980,
    lng: 77.1900,
    details: {
      height: "300 feet",
      description: "Known as the 'Stream of Milk' for its milky white water.",
      nearby: "Pathanamthitta",
    }
  },
  {
    name: "Nohkalikai Falls",
    state: "Meghalaya",
    lat: 25.2300,
    lng: 91.6960,
    details: {
      height: "340 meters",
      description: "One of the tallest plunge waterfalls in India.",
      nearby: "Cherrapunji",
    }
  },
  {
    name: "Ulsoor Waterfall",
    state: "Karnataka",
    lat: 12.9762,
    lng: 77.6033,
    details: {
      height: "Small waterfall in urban Bangalore",
      description: "Waterfall located inside Ulsoor Lake park.",
      nearby: "Bangalore",
    }
  },
  {
    name: "Kondapalli Waterfall",
    state: "Telangana",
    lat: 17.2147,
    lng: 78.6340,
    details: {
      height: "Approx 20 meters",
      description: "Beautiful natural waterfall near Hyderabad.",
      nearby: "Hyderabad",
    }
  },  {
    name: "Chitrakote Falls",
    state: "Chhattisgarh",
    lat: 18.9615,
    lng: 81.7065,
    details: {
      height: "29 meters",
      description: "Widest waterfall in India, often called the Niagara of India.",
      nearby: "Jagdalpur",
    }
  },
  {
    name: "Barkana Falls",
    state: "Karnataka",
    lat: 13.5793,
    lng: 75.1583,
    details: {
      height: "259 meters",
      description: "Among the tallest waterfalls in India, located in the Western Ghats.",
      nearby: "Agumbe",
    }
  },
  {
    name: "Hebbe Falls",
    state: "Karnataka",
    lat: 13.5411,
    lng: 75.7408,
    details: {
      height: "168 meters",
      description: "Located inside a coffee estate, known for medicinal herbs.",
      nearby: "Chikmagalur",
    }
  },
  {
    name: "Bhimlat Falls",
    state: "Rajasthan",
    lat: 25.1800,
    lng: 76.4200,
    details: {
      height: "60 meters",
      description: "Rare perennial waterfall in the desert state of Rajasthan.",
      nearby: "Bundi",
    }
  },
  {
    name: "Langshiang Falls",
    state: "Meghalaya",
    lat: 25.4542,
    lng: 90.4724,
    details: {
      height: "337 meters",
      description: "Spectacular waterfall formed by the Kynshi River.",
      nearby: "West Khasi Hills",
    }
  },
  {
    name: "Kune Falls",
    state: "Maharashtra",
    lat: 18.7715,
    lng: 73.4255,
    details: {
      height: "200 meters",
      description: "A beautiful three-tiered waterfall near Lonavala.",
      nearby: "Khandala",
    }
  },
  {
    name: "Vantawng Falls",
    state: "Mizoram",
    lat: 23.1981,
    lng: 92.7279,
    details: {
      height: "229 meters",
      description: "Tallest uninterrupted waterfall in Mizoram.",
      nearby: "Thenzawl",
    }
  },
  {
    name: "Nuranang Falls",
    state: "Arunachal Pradesh",
    lat: 27.4577,
    lng: 92.5414,
    details: {
      height: "100 meters",
      description: "Hidden gem of the northeast, also called Jang Falls.",
      nearby: "Tawang",
    }
  },
  {
    name: "Hundru Falls",
    state: "Jharkhand",
    lat: 23.3833,
    lng: 85.3833,
    details: {
      height: "98 meters",
      description: "Formed by the Subarnarekha River, ideal for trekking.",
      nearby: "Ranchi",
    }
  },
];


const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 8);
    }
  }, [center, map]);
  return null;
};

const MapComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemples, setFilteredTemples] = useState(templeLocations);
  const [filteredwaterfalls,setFilterWaterfalls]=useState()
  const [mapCenter, setMapCenter] = useState([11.5, 78.5]); // Center over Tamil Nadu

  const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchTerm(query);

  // Filter temples by name matching the query
  const matchedTemples = templeLocations.filter((temple) =>
    temple.name.toLowerCase().includes(query)
  );

  // Filter waterfalls by name matching the query
  const matchedWaterfalls = waterfallsIndia.filter((waterfall) =>
    waterfall.name.toLowerCase().includes(query)
  );

  // Combine both matched arrays
  const combinedMatches = [...matchedTemples, ...matchedWaterfalls];

  // If query is empty, show all temples (you can also decide to show all waterfalls or both)
  setFilteredTemples(query ? combinedMatches : templeLocations);

  // If matches found, set map center to the first matched location (temple or waterfall)
  if (combinedMatches.length > 0) {
    setMapCenter([combinedMatches[0].lat, combinedMatches[0].lng]);
  }
};


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <input
        type="text"
        placeholder="Search temple or place..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: '10px',
          width: '100%',
          fontSize: '16px',
          boxSizing: 'border-box',
          marginBottom: '10px',
        }}
      />

      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '600px', width: '100%' }}
      >
        <ChangeMapCenter center={mapCenter} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Temple markers */}
{filteredTemples.map((temple, idx) => (
  <Marker key={`temple-${idx}`} position={[temple.lat, temple.lng]}>
    <Popup>
      <strong>{temple.name}</strong>
    </Popup>
  </Marker>
))}

{waterfallsIndia.map((waterfall, idx) => (
  <Marker
    key={`waterfall-${idx}`}
    position={[waterfall.lat, waterfall.lng]}
    icon={waterfallIcon}
  >
    <Popup>
      <strong>{waterfall.name}</strong><br />
      State: {waterfall.state}<br />
      Height: {waterfall.details.height}<br />
      {waterfall.details.description}<br />
      Nearby: {waterfall.details.nearby}
    </Popup>
  </Marker>
))}

        {/* Waterfall markers */}

    </MapContainer>
    </div>
  );
};

export default MapComponent;
