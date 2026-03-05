"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

export interface LatLng {
  lat: number;
  lng: number;
}

interface MissionMapProps {
  origin: LatLng;
  destination: LatLng;
  truckPosition: LatLng;
  className?: string;
}

const createIcon = (color: string, label: string) =>
  L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${label}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const createTruckIcon = () =>
  L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${GOLD};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${NAVY};
        font-size: 20px;
      ">🚛</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

export function MissionMap({
  origin,
  destination,
  truckPosition,
  className = "",
}: MissionMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2],
      zoom: 8,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const originIcon = createIcon("#2563eb", "A");
    const destIcon = createIcon(GOLD, "B");
    const truckIcon = createTruckIcon();

    const originM = L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(map);
    const destM = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(map);
    const truckM = L.marker([truckPosition.lat, truckPosition.lng], { icon: truckIcon }).addTo(map);

    const path = [
      [origin.lat, origin.lng],
      [truckPosition.lat, truckPosition.lng],
      [destination.lat, destination.lng],
    ] as [number, number][];

    const polyline = L.polyline(path, {
      color: NAVY,
      weight: 4,
      opacity: 0.7,
      dashArray: "10, 10",
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    mapRef.current = map;
    originMarkerRef.current = originM;
    destMarkerRef.current = destM;
    truckMarkerRef.current = truckM;
    polylineRef.current = polyline;

    return () => {
      map.remove();
      mapRef.current = null;
      originMarkerRef.current = null;
      destMarkerRef.current = null;
      truckMarkerRef.current = null;
      polylineRef.current = null;
    };
  }, [origin.lat, origin.lng, destination.lat, destination.lng]);

  useEffect(() => {
    if (!truckMarkerRef.current || !polylineRef.current) return;

    truckMarkerRef.current.setLatLng([truckPosition.lat, truckPosition.lng]);

    const path = [
      [origin.lat, origin.lng],
      [truckPosition.lat, truckPosition.lng],
      [destination.lat, destination.lng],
    ] as [number, number][];

    polylineRef.current.setLatLngs(path);
  }, [truckPosition, origin, destination]);

  return (
    <div
      ref={containerRef}
      className={`h-full min-h-[400px] w-full rounded-xl overflow-hidden ${className}`}
    />
  );
}
