import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import { Popup } from 'react-leaflet'
import customIcon from './Icon';
import 'leaflet/dist/leaflet.css'
import '../src/index.css'
import { useState, useEffect } from 'react';

function MapPage() {
  const [positions, setPositions] = useState(
    JSON.parse(localStorage.getItem('positions')) || []
  );
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem('messages')) || []
  );
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
      <div className='sidebar'style={{height: '100%',width: '30%',}}>
        <h2 style={{textAlign: 'center',fontFamily: 'sans-serif'}}>Saved Pins</h2>
        {positions.map((position, index) => (
          <div key={index} style={{border: '1px solid black', padding: '10px', margin: '10px'}}>
            <p>{`Latitude: ${positions[index].lat}, Longitude: ${positions[index].lng}`}</p>
            <p>{`Message: ${messages[index]}`}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default MapPage
