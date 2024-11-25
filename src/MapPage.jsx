import { MapContainer, TileLayer, useMapEvents,useMap } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import customIcon from './Icon'
import 'leaflet/dist/leaflet.css'
import '../src/index.css'
import { useEffect, useState } from 'react'
import './style.css'

function MapPage() {
  const fetchPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      return data.display_name || 'Unknown Place'
    } catch (error) {
      console.error('Error fetching place name:', error)
      return 'Unknown Place'
    }
  }
  
  const [map, setMap] = useState(null)
  const [positions, setPositions] = useState(() => {
    const storedPositions = localStorage.getItem('positions')

    try {
      const parsedPositions = JSON.parse(storedPositions)

      return Array.isArray(parsedPositions)
        ? parsedPositions.filter(pos => pos && pos.lat !== undefined && pos.lng !== undefined)
        : []
    } catch (error) {
      console.error('Error parsing positions from localStorage:', error)
      return []
    }
  })

  const [descriptions, setDescriptions] = useState(() => {
    const storedDescriptions = localStorage.getItem('descriptions')

    try {
      return JSON.parse(storedDescriptions) || []
    } catch (error) {
      console.error('Error parsing descriptions from localStorage:', error)
      return []
    }
  })

  const [newPosition, setNewPosition] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newPhoto, setNewPhoto] = useState(null)

  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions))
    localStorage.setItem('descriptions', JSON.stringify(descriptions))
  }, [positions, descriptions])

  function MapEvents() {
    const map = useMap()
    useEffect(() => {
      setMap(map)
    })
    useMapEvents({
      click: async(e) => {
        const { lat, lng } = e.latlng
        const placeName = await fetchPlaceName(lat, lng)
        setNewPosition({ lat, lng ,address:placeName})
        setNewMessage('')
        setNewTitle('')
        setNewPhoto(null)
      }
    })
    return null
  }

  if (newPosition) {
    return (
      <div className="form-overlay">
        <div>
          <h2>
            Add New Pin
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewPhoto(e.target.files[0])}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => {
                setPositions([...positions, newPosition])
                setDescriptions([...descriptions, { title: newTitle, message: newMessage, photo: newPhoto ? URL.createObjectURL(newPhoto) : null }])
                setNewPosition(null)
              }}
              className='save'
            >
              Save
            </button>
            <button onClick={() => setNewPosition(null)} className='cancel'>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Map Locator</h1>
        <p>Click on the map to save your favorite spots and add a message!</p>
      </header>
      <div className="map" style={{ display: 'flex', height: '100%', width: '100%' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {positions.map((position, index) => (
            <Marker key={index} position={position} icon={customIcon} />
          ))}
          <MapEvents />
        </MapContainer>
        <div className="sidebar">
          <h2>Saved Pins</h2>
          {positions.length === 0 ? (
            <p>No pins saved yet.</p>
          ) : (
            positions.map((position, index) => (
              <div key={index} onClick={() => map.flyTo(position, 15)}>
                <p>{position.address || 'Unnamed Place'}</p>
                <p>{descriptions[index]?.title || 'Untitled'}</p>
                <p>{descriptions[index]?.message || 'No description'}</p>
                {descriptions[index]?.photo && (
                  <img src={descriptions[index].photo} alt="Uploaded" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newPositions = positions.filter((pos, i) => i !== index)
                    setPositions(newPositions)
                    const newDescriptions = descriptions.filter((desc, i) => i !== index)
                    setDescriptions(newDescriptions)
                  }}
                  className='delete'
                >
                Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage

