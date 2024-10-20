import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import { Popup } from 'react-leaflet'
import customIcon from './Icon';
import 'leaflet/dist/leaflet.css'
import '../src/index.css'
import { useState } from 'react';
function MapPage() {
  const [position,setPosition] = useState([51.505, -0.09]);
  function MapEvents() {
    useMapEvents({
      click(e) {
        console.log(e.latlng);
        setPosition(e.latlng);
      },
    });
    return null;
  }
  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <MapEvents />
      </MapContainer>
    </div>
  )
}

export default MapPage