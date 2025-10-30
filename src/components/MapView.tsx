import { MapPin } from 'lucide-react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function MapView({ latitude, longitude, label }: MapViewProps) {
  // Create a simple static map visualization
  // In production, you could use OpenStreetMap static tiles or a real map library
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="space-y-2">
      <div className="aspect-video bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={mapUrl}
          className="pointer-events-none"
          title="Map location"
        />
        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-xs flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#00C2FF]" />
          <span>{latitude.toFixed(6)}° N, {Math.abs(longitude).toFixed(6)}° {longitude < 0 ? 'W' : 'E'}</span>
        </div>
      </div>
      {label && (
        <p className="text-xs text-gray-400 text-center">{label}</p>
      )}
    </div>
  );
}
