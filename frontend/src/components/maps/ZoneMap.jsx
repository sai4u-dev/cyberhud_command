import { useState } from "react";

// Simple Google Maps wrapper - uses @react-google-maps/api when key is present
// Falls back to placeholder cyber grid if no key (keeps app usable without billing)

import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };

const BATTLE_ZONES = [
  { id: 1, name: "NEURAL_GRID_ALPHA", lat: 37.7749, lng: -122.4194, players: 42, status: "LIVE" },
  { id: 2, name: "VOID_SECTOR_7", lat: 37.7849, lng: -122.4094, players: 18, status: "WAITING" },
  { id: 3, name: "SYNTH_CORE", lat: 37.7649, lng: -122.4294, players: 67, status: "LIVE" },
];

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0e0e0e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0e0e0e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ff5ff" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1919" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#001a1f" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1a1919" }] },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

export default function ZoneMap({ onSelectZone }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "dummy_for_fallback",
  });

  const handleSelect = (zone) => {
    setSelected(zone);
    onSelectZone?.(zone);
  };

  // Fallback when no API key
  if (!apiKey) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-surface-container border border-primary/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(#8ff5ff 1px, transparent 1px), linear-gradient(90deg, #8ff5ff 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">map</span>
          <h4 className="font-display text-xl text-primary mb-2">BATTLE_ZONE_MAP</h4>
          <p className="text-xs text-slate-400 max-w-md mb-6">Add <code className="bg-black/50 px-2 py-1 text-primary">VITE_GOOGLE_MAPS_API_KEY</code> to .env to enable live Google Maps. Showing offline tactical grid.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
            {BATTLE_ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => handleSelect(z)}
                className={`p-4 border text-left transition-all ${selected?.id === z.id ? "border-primary bg-primary/10" : "border-white/10 bg-black/40 hover:border-primary/40"}`}
              >
                <p className="text-xs font-headline text-primary tracking-widest">{z.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{z.players} OPERATORS • {z.status}</p>
                <div className="mt-2 h-1 bg-white/5">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, z.players * 1.5)}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] font-label text-primary/40 tracking-widest">OFFLINE_MODE • GRID_ACTIVE</div>
      </div>
    );
  }

  if (loadError) {
    return <div className="p-8 text-center text-error">Map failed to load: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div className="w-full h-[500px] bg-surface-container animate-pulse flex items-center justify-center text-slate-500">Loading battle zones...</div>;
  }

  return (
    <div className="w-full h-[500px] border border-primary/10 relative overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={13}
        options={mapOptions}
      >
        {BATTLE_ZONES.map((zone) => (
          <Marker
            key={zone.id}
            position={{ lat: zone.lat, lng: zone.lng }}
            onClick={() => handleSelect(zone)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: zone.status === "LIVE" ? "#8ff5ff" : "#d674ff",
              fillOpacity: 0.9,
              strokeColor: "#fff",
              strokeWeight: 1,
            }}
          />
        ))}
        {BATTLE_ZONES.map((zone) => (
          <Circle
            key={`circle-${zone.id}`}
            center={{ lat: zone.lat, lng: zone.lng }}
            radius={400}
            options={{
              fillColor: zone.status === "LIVE" ? "#8ff5ff" : "#d674ff",
              fillOpacity: 0.08,
              strokeColor: zone.status === "LIVE" ? "#8ff5ff" : "#d674ff",
              strokeOpacity: 0.4,
              strokeWeight: 1,
            }}
          />
        ))}
      </GoogleMap>

      {selected && (
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 glass-panel p-4 border border-primary/20">
          <p className="text-xs font-headline tracking-widest text-primary">{selected.name}</p>
          <p className="text-sm text-white mt-1">{selected.players} operators engaged</p>
          <p className="text-[10px] text-slate-400 uppercase">Status: {selected.status}</p>
          <button className="mt-3 w-full bg-primary text-black text-xs font-bold uppercase tracking-widest py-2 hover:brightness-110">
            Join Zone
          </button>
        </div>
      )}
    </div>
  );
}
