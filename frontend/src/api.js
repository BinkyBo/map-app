const API_URL = "http://localhost:5000/api";

export async function fetchPins() {
  const res = await fetch(`${API_URL}/pins`);
  return res.json();
}

export async function createPin(lat, lng, message) {
  const res = await fetch(`${API_URL}/pins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, message }),
  });
  return res.json();
}

export async function addReply(pinId, text) {
  const res = await fetch(`${API_URL}/pins/${pinId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
