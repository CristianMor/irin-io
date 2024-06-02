import './App.css'
import 'leaflet/dist/leaflet.css';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, divIcon, point } from 'leaflet';

import MarkerClusterGroup from 'react-leaflet-cluster';


function App() {

  const [markers, setMarkers] = React.useState(null);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/0/622.png",
    iconSize: [38, 38] // tamaño del icono
  });
  
  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true)
    });
  };

  function clientCoords(position){

    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const mark = { geocode: [lat, long], popUp: "El bus XXX"};

    if(markers){
      const [previosLatitude, previosLongitude] = markers[0].geocode;
      if(lat !== previosLatitude || long !== previosLongitude){
        setMarkers([mark]);
      }
    }else{
      setMarkers([mark]);
    }

  };

  function error(err){
    alert(err);
    console.log("Este es el error: ", err);
  }

  React.useEffect(() => {
    console.log("Montando useEffect - Maper Page");

    const interval = setInterval(() => {
      const geolocation = navigator.geolocation;
       if (geolocation) {
          // Obtener ubicación actual del cliente
          geolocation.getCurrentPosition(clientCoords, error);
        } else {
          alert('Geolocation is not supported by this browser.');
        }
    }, 10000);


    return () => {
      clearInterval(interval);
      console.log("Desmontando useEffect - Maper Page");
    }

  }, []);

  return (
    markers && (
      <MapContainer center={markers[0].geocode} zoom={17} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomClusterIcon}
        >
          {markers.map(marker => (
            <Marker key={marker.popUp} position={marker.geocode} icon={customIcon} >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    )
  )
}

export default App;
