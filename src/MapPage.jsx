import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import { Popup } from 'react-leaflet'
import customIcon from './Icon';
import 'leaflet/dist/leaflet.css'
import '../src/index.css'
import { useEffect, useState } from 'react';

function MapPage() {
  const [positions, setPositions] = useState(() => {
    const storedPositions = localStorage.getItem('positions');
    try {
      const parsedPositions = JSON.parse(storedPositions);
      return Array.isArray(parsedPositions)
        ? parsedPositions.filter(pos => pos && pos.lat !== undefined && pos.lng !== undefined)
        : [];
    } catch (error) {
      console.error('Error parsing positions from localStorage:', error);
      return [];
    }
  });

  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('messages');
    try {
      return JSON.parse(storedMessages) || [];
    } catch (error) {
      console.error('Error parsing messages from localStorage:', error);
      return [];
    }
  });

  const [address, setAddress] = useState('');
  const [newPosition, setNewPosition] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions));
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [positions, messages]);

  function MapEvents() {
    useMapEvents({
      click(e) {
        const popupInput = prompt('Enter a message');
        if(popupInput !== null){
          setNewPosition(e.latlng);
          setNewMessage(popupInput);
        }
      },
    });
    return null;
  }

  if (newPosition) {
    setPositions([...positions, newPosition]);
    setMessages([...messages, newMessage]);
    setNewPosition(null);
    setNewMessage('');
  }

  return (
    <div>
      <header style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1>Map Locator</h1>
        <p>Click on the map to save your favorite spots and add a message!</p>
      </header>
      <div className='map' style={{display: 'flex', height: '100%', width: '100%'}}>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {positions.map((position, index) => (
            <Marker key={index} position={position} icon={customIcon}>
              <Popup>
                {messages[index]}
              </Popup>
            </Marker>
          ))}
          <MapEvents />
        </MapContainer>
        <div className='sidebar' style={{height: '100%', width: '30%'}}>
          <h2 style={{textAlign: 'center', fontFamily: 'sans-serif'}}>Saved Pins</h2>
          {positions.map((position, index) => (
            <div key={index} style={{border: '1px solid black', padding: '10px', margin: '10px'}}>
              <p>{`Latitude: ${positions[index].lat}`}</p>
              <p>{`Longitude: ${positions[index].lng}`}</p>
              <p>{`Message: ${messages[index]}`}</p>
              <p>Description: {descriptions[index]}</p>
              {images[index] && <img src={URL.createObjectURL(images[index])} alt="Image" style={{width: '100%'}} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapPage
