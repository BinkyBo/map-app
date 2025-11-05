import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import { fetchPins, createPin, addReply } from "./api";

export default function MapView() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetchPins().then(setPins);
  }, []);

  const handleMapClick = async (e) => {
    const message = prompt("Enter a message for this location:");
    if (!message) return;
    const newPin = await createPin(e.latlng.lat, e.latlng.lng, message);
    setPins([...pins, newPin]);
  };

  const AddPinOnClick = () => {
    useMapEvents({ click: handleMapClick });
    return null;
  };

  const handleReply = async (pinId) => {
    const text = prompt("Enter your reply:");
    if (!text) return;
    await addReply(pinId, text);
    fetchPins().then(setPins);
  };

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
          <Popup>
            <b>{pin.message}</b>
            <div style={{ marginTop: "8px" }}>
              {pin.replies.map((r, i) => (
                <div key={i} style={{ fontSize: "0.9em" }}>
                  • {r.text}
                </div>
              ))}
            </div>
            <button
              style={{ marginTop: "8px", width: "100%" }}
              onClick={() => handleReply(pin.id)}
            >
              Reply
            </button>
          </Popup>
        </Marker>
      ))}
      <AddPinOnClick />
    </MapContainer>
  );
}
