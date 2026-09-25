import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue with Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Cyber battle zones — MapCN presentation (shadcn-styled map)
const BATTLE_ZONES = [
  { id: 1, code: "ZG-ALPHA", name: "NEURAL_GRID_ALPHA", lat: 37.7749, lng: -122.4194, players: 42, status: "LIVE", type: "one_to_one", prize: "2.4 ETH" },
  { id: 2, code: "ZG-BETA", name: "VOID_SECTOR_7", lat: 37.7849, lng: -122.4094, players: 18, status: "WAITING", type: "one_to_many", prize: "1.2 ETH" },
  { id: 3, code: "ZG-GAMMA", name: "SYNTH_CORE", lat: 37.7649, lng: -122.4294, players: 67, status: "LIVE", type: "one_to_many", prize: "4.0 ETH" },
  { id: 4, code: "ZG-DELTA", name: "CRIMSON_VOID", lat: 37.7549, lng: -122.4394, players: 31, status: "WAITING", type: "one_to_one", prize: "0.8 ETH" },
  { id: 5, code: "ZG-EPSILON", name: "TOXIC_LAB", lat: 37.7949, lng: -122.3994, players: 55, status: "LIVE", type: "one_to_many", prize: "3.1 ETH" },
  { id: 6, code: "ZG-ZETA", name: "ARCTIC_BREACH", lat: 37.8049, lng: -122.4294, players: 12, status: "WAITING", type: "one_to_one", prize: "1.5 ETH" },
];

// Carto Dark Matter (cyber) tiles — free, no key, perfect for MapCN dark presentation
const CARTO_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_DARK_ATTR = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM';

function createCyberIcon(status, isSelected) {
  const color = status === "LIVE" ? "#8ff5ff" : "#d674ff";
  const bg = status === "LIVE" ? "rgba(143,245,255,0.15)" : "rgba(214,116,255,0.15)";
  const border = status === "LIVE" ? "#8ff5ff" : "#d674ff";
  const size = isSelected ? 48 : 36;
  return L.divIcon({
    className: "cyber-marker",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${bg};
        border:2px solid ${border};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 ${isSelected ? 20 : 10}px ${color}, inset 0 0 10px ${bg};
        position:relative;
        transform:${isSelected ? "scale(1.15)" : "scale(1)"};
        transition:all 0.2s;
      ">
        <span style="font-size:${isSelected ? 20 : 16}px;color:${color};" class="material-symbols-outlined">${status === "LIVE" ? "swords" : "groups"}</span>
        <span style="
          position:absolute;top:-6px;right:-6px;
          width:10px;height:10px;
          background:${status === "LIVE" ? "#ef4444" : "#f59e0b"};
          border:1px solid #000;
          border-radius:9999px;
          box-shadow:0 0 6px ${status === "LIVE" ? "#ef4444" : "#f59e0b"};
          animation: ${status === "LIVE" ? "pulse 1.2s infinite" : "none"};
        "></span>
      </div>
      <div style="
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:8px solid ${border};
        margin:0 auto;
        filter:drop-shadow(0 0 4px ${color});
      "></div>
    `,
    iconSize: [size, size + 12],
    iconAnchor: [size / 2, size + 12],
  });
}

export default function MapCN({ onSelectZone, onBattleAction, selectedZone: propSelected, height = "520px", interactive = true }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selected, setSelected] = useState(propSelected || null);
  const [filter, setFilter] = useState("all"); // all | one_to_one | one_to_many
  const [search, setSearch] = useState("");

  const filteredZones = BATTLE_ZONES.filter((z) => {
    if (filter !== "all" && z.type !== filter) return false;
    if (search && !z.name.toLowerCase().includes(search.toLowerCase()) && !z.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Keep propSelected in sync — render-phase adjustment (no setState-in-effect)
  const [prevPropSelected, setPrevPropSelected] = useState(propSelected || null);
  if (propSelected !== prevPropSelected) {
    setPrevPropSelected(propSelected);
    if (propSelected) setSelected(propSelected);
  }

  // Init leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [37.779, -122.4194],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
    });

    L.tileLayer(CARTO_DARK, {
      attribution: CARTO_DARK_ATTR,
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add scale
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    mapInstanceRef.current = map;

    // Add scanline overlay via pane
    return () => {
      try {
        map.remove();
      } catch {
        // map already removed (StrictMode double-unmount) — safe to ignore
      }
      mapInstanceRef.current = null;
    };
  }, [interactive]);

  // Update markers when filter/selected changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => {
      try {
        map.removeLayer(m);
      } catch {
        // layer already removed — safe to ignore
      }
    });
    markersRef.current = [];

    filteredZones.forEach((zone) => {
      const isSelected = selected?.id === zone.id;
      const icon = createCyberIcon(zone.status, isSelected);
      const marker = L.marker([zone.lat, zone.lng], { icon }).addTo(map);

      // Tooltip
      marker.bindTooltip(
        `<div style="font-family:Space Grotesk;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${zone.status === "LIVE" ? "#8ff5ff" : "#d674ff"}">${zone.code}</div>
         <div style="font-weight:700;font-size:12px;color:#fff;">${zone.name}</div>
         <div style="font-size:10px;color:#adaaaa;">${zone.players} operators • ${zone.prize}</div>`,
        { direction: "top", offset: [0, -10], className: "cyber-tooltip" }
      );

      // Pulse circle for LIVE
      if (zone.status === "LIVE") {
        const circle = L.circle([zone.lat, zone.lng], {
          radius: 380,
          color: zone.status === "LIVE" ? "#8ff5ff" : "#d674ff",
          weight: 1,
          opacity: 0.35,
          fillColor: zone.status === "LIVE" ? "#8ff5ff" : "#d674ff",
          fillOpacity: 0.06,
        }).addTo(map);
        markersRef.current.push(circle);
      }

      marker.on("click", () => {
        setSelected(zone);
        onSelectZone?.(zone);
        map.flyTo([zone.lat, zone.lng], 14, { duration: 1.2 });
      });

      markersRef.current.push(marker);
    });
  }, [filteredZones, selected, onSelectZone]);

  const handleSelect = (zone) => {
    setSelected(zone);
    onSelectZone?.(zone);
    const map = mapInstanceRef.current;
    if (map) map.flyTo([zone.lat, zone.lng], 14, { duration: 1 });
  };

  const handleAction = (zone, action) => {
    onBattleAction?.(zone, action);
  };

  return (
    <div className="w-full border border-primary/10 bg-surface overflow-hidden relative" style={{ height }}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" style={{ background: "#0a0a0a" }} />

      {/* Top bar — MapCN header (shadcn style) */}
      <div className="absolute top-0 left-0 right-0 z-[400] flex flex-col md:flex-row gap-2 p-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-xl border border-primary/20 px-3 py-1.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">map</span>
            <span className="text-xs font-display font-bold tracking-widest text-primary">MAP_CN</span>
            <span className="text-[10px] font-label text-slate-500 hidden md:inline">• CYBER_CARTO_DARK • 6 ZONES</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-black/70 backdrop-blur-xl border border-white/10 px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Live_Telemetry</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto pointer-events-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search zone..."
              className="bg-black/70 backdrop-blur-xl border border-white/10 pl-8 pr-3 py-1.5 text-xs w-36 md:w-48 focus:border-primary outline-none text-white placeholder:text-slate-500"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-black/70 backdrop-blur-xl border border-white/10 px-3 py-1.5 text-xs text-white focus:border-primary outline-none">
            <option value="all">All Zones</option>
            <option value="one_to_one">1 vs 1</option>
            <option value="one_to_many">1 vs N</option>
          </select>
        </div>
      </div>

      {/* Zone list — MapCN sidebar (shadcn card) */}
      <div className="absolute left-3 top-16 bottom-3 w-72 hidden lg:flex flex-col gap-2 z-[400] pointer-events-none">
        <div className="bg-black/75 backdrop-blur-xl border border-white/10 flex-1 overflow-hidden flex flex-col pointer-events-auto">
          <div className="p-3 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-display text-xs font-bold tracking-widest">BATTLE_ZONES</h4>
            <span className="text-[10px] font-label text-slate-500">{filteredZones.length} SECTORS</span>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {filteredZones.map((z) => (
              <button
                key={z.id}
                onClick={() => handleSelect(z)}
                className={`w-full text-left p-3 border transition-all ${selected?.id === z.id ? "bg-primary/10 border-primary/40 shadow-[0_0_12px_rgba(143,245,255,0.15)]" : "bg-white/[0.03] border-white/5 hover:border-primary/20 hover:bg-white/[0.06]"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display text-xs font-bold tracking-widest" style={{ color: z.status === "LIVE" ? "#8ff5ff" : "#d674ff" }}>{z.code}</p>
                    <p className="text-xs font-bold mt-1 leading-tight">{z.name}</p>
                  </div>
                  <span className={`text-[10px] font-headline px-1.5 py-0.5 border ${z.type === "one_to_one" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>{z.type === "one_to_one" ? "1V1" : "1VN"}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-slate-400">{z.players} OPS • {z.prize}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border font-headline uppercase ${z.status === "LIVE" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{z.status}</span>
                </div>
                <div className="mt-2 h-1 bg-white/5">
                  <div className="h-full" style={{ width: `${Math.min(100, z.players * 1.4)}%`, background: z.status === "LIVE" ? "#8ff5ff" : "#d674ff" }} />
                </div>
              </button>
            ))}
            {filteredZones.length === 0 && <p className="text-xs text-slate-500 text-center py-8">No zones match filter</p>}
          </div>
        </div>
      </div>

      {/* Selected zone card — MapCN detail (bottom sheet on mobile, card on desktop) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-3 left-3 right-3 lg:left-auto lg:right-3 lg:w-80 z-[400]"
          >
            <div className="bg-surface-container/95 backdrop-blur-xl border border-primary/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: selected.status === "LIVE" ? "#22c55e" : "#f59e0b" }} />
                    <p className="text-[10px] font-headline tracking-[0.2em] uppercase text-primary">{selected.code} • {selected.type === "one_to_one" ? "DUEL" : "SQUAD"}</p>
                  </div>
                  <h4 className="font-display text-lg font-bold uppercase mt-1">{selected.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{selected.players} operators • Prize {selected.prize} • {selected.status}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-7 h-7 border border-white/10 hover:border-primary/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-black/40 border border-white/5 p-2 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Lat</p>
                  <p className="text-xs font-bold mt-1">{selected.lat.toFixed(4)}</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-2 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Lng</p>
                  <p className="text-xs font-bold mt-1">{selected.lng.toFixed(4)}</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-2 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Prize</p>
                  <p className="text-xs font-bold mt-1 text-secondary">{selected.prize}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handleAction(selected, "one_to_one")}
                  className="py-2.5 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">swords</span> Duel 1v1
                </button>
                <button
                  onClick={() => handleAction(selected, "one_to_many")}
                  className="py-2.5 bg-secondary text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">groups</span> Squad 1vN
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2">MapCN • Carto Dark Matter • Click marker to focus</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] hidden md:flex items-center gap-3 bg-black/70 backdrop-blur-xl border border-white/10 px-3 py-1.5 pointer-events-none">
        <span className="flex items-center gap-1.5 text-[10px] font-headline uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-primary" /> Duel</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="flex items-center gap-1.5 text-[10px] font-headline uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-secondary" /> Squad</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[10px] font-label text-slate-500">MapCN • Leaflet • Cyber</span>
      </div>

      <style>{`
        .cyber-tooltip {
          background: rgba(14,14,14,0.92) !important;
          border: 1px solid rgba(143,245,255,0.2) !important;
          color: white !important;
          font-family: Inter, sans-serif !important;
          padding: 6px 8px !important;
          backdrop-filter: blur(12px);
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.7) !important;
          color: #adaaaa !important;
          font-size: 10px !important;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .leaflet-control-zoom a {
          background: rgba(0,0,0,0.8) !important;
          color: #8ff5ff !important;
          border: 1px solid rgba(143,245,255,0.2) !important;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export const MAPCN_ZONES = BATTLE_ZONES;
