"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";

// Fix default marker icons in many bundlers
const defaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export default function PharmacyMap({ pharmacies }) {
  // Center map on first pharmacy or default UK-ish coords
  const defaultCenter =
    pharmacies.length && pharmacies[0].location
      ? [
          pharmacies[0].location.lat || 51.5074,
          pharmacies[0].location.lng || -0.1278,
        ]
      : [51.5074, -0.1278];

  // Leaflet doesn't like SSR; ensure window exists indirectly by client-only usage

  return (
    <div className="h-[500px] overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pharmacies
          .filter((p) => p.location && p.location.lat && p.location.lng)
          .map((p) => (
            <Marker
              key={p.id}
              position={[p.location.lat, p.location.lng]}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {p.name}
                  </h3>
                  <p className="text-xs">
                    {p.address}
                    {p.city ? `, ${p.city}` : ""}
                  </p>
                  <Link
                    href={`/pharmacies/${p.id}`}
                    className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                  >
                    View products →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
