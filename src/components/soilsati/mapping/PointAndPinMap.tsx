import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, Polygon, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import * as turf from "@turf/turf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface PointAndPinMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

function MapClickHandler({ onAddPoint }: { onAddPoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocationFinder() {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  useMapEvents({
    locationfound: (e) => {
      map.flyTo(e.latlng, 16);
    },
  });

  return null;
}

export const PointAndPinMap = ({ onComplete }: PointAndPinMapProps) => {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [area, setArea] = useState(0);

  const handleMapClick = (lat: number, lng: number) => {
    const newPoints = [...points, [lat, lng] as [number, number]];
    setPoints(newPoints);
    toast.success(`Point ${newPoints.length} added`);

    if (newPoints.length >= 3) {
      calculateArea(newPoints);
    }
  };

  const calculateArea = (coords: [number, number][]) => {
    if (coords.length < 3) return;

    try {
      const closedCoords = [...coords, coords[0]];
      const polygon = turf.polygon([[...closedCoords.map((c) => [c[1], c[0]])]]);
      const areaInSqMeters = turf.area(polygon);
      const areaInHectares = areaInSqMeters / 10000;
      setArea(areaInHectares);
    } catch (error) {
      console.error("Error calculating area:", error);
    }
  };

  const undoLastPoint = () => {
    if (points.length === 0) return;
    const newPoints = points.slice(0, -1);
    setPoints(newPoints);
    if (newPoints.length >= 3) {
      calculateArea(newPoints);
    } else {
      setArea(0);
    }
    toast.info("Last point removed");
  };

  const clearAll = () => {
    setPoints([]);
    setArea(0);
    toast.info("All points cleared");
  };

  const completeMapping = () => {
    if (points.length < 3) {
      toast.error("Please add at least 3 points to create a boundary");
      return;
    }

    onComplete(points, area);
  };

  const leafletPoints = points.map((p) => [p[0], p[1]] as [number, number]);
  const closedPoints = points.length >= 3 ? [...leafletPoints, leafletPoints[0]] : leafletPoints;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-info-foreground">
          📍 <strong>Tap at each corner</strong> of your field to drop boundary points.
        </p>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden shadow-elevated relative">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={13}
          style={{ height: "450px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationFinder />
          <MapClickHandler onAddPoint={handleMapClick} />

          {/* Markers for each point */}
          {leafletPoints.map((pos, idx) => (
            <Marker key={idx} position={pos} />
          ))}

          {/* Lines connecting points */}
          {points.length >= 2 && (
            <Polyline positions={closedPoints} color="#10b981" weight={3} dashArray="5, 10" />
          )}

          {/* Filled polygon */}
          {points.length >= 3 && (
            <Polygon
              positions={closedPoints}
              pathOptions={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.3,
                weight: 3,
              }}
            />
          )}
        </MapContainer>

        {/* Toolbar */}
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-[1000]">
          <Button
            size="sm"
            variant="outline"
            className="bg-background/90 backdrop-blur"
            onClick={undoLastPoint}
            disabled={points.length === 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-background/90 backdrop-blur"
            onClick={clearAll}
            disabled={points.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Points Placed</p>
            <p className="text-2xl font-bold text-primary">{points.length}</p>
          </div>
          {area > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Area</p>
              <p className="text-2xl font-bold text-success">{area.toFixed(3)} ha</p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Button */}
      <Button
        onClick={completeMapping}
        disabled={points.length < 3}
        className="w-full h-12 bg-gradient-to-r from-success to-success/80"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Complete Boundary ({points.length} points)
      </Button>
    </div>
  );
};
