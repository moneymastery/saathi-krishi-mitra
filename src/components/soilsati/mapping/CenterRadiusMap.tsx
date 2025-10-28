import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle, Marker, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
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

interface CenterRadiusMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

function MapClickHandler({ onSetCenter }: { onSetCenter: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onSetCenter(e.latlng.lat, e.latlng.lng);
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

export const CenterRadiusMap = ({ onComplete }: CenterRadiusMapProps) => {
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(50);

  const handleSetCenter = (lat: number, lng: number) => {
    setCenterPoint([lat, lng]);
    toast.success("Center point set! Adjust radius below.");
  };

  const completeMapping = () => {
    if (!centerPoint) {
      toast.error("Please mark the center point on the map first");
      return;
    }

    const circle = turf.circle([centerPoint[1], centerPoint[0]], radius / 1000, {
      steps: 64,
      units: "kilometers",
    });

    const coordinates = circle.geometry.coordinates[0].map(
      (c) => [c[1], c[0]] as [number, number]
    );
    const areaInSqMeters = turf.area(circle);
    const areaInHectares = areaInSqMeters / 10000;

    toast.success(`Field mapped! Area: ${areaInHectares.toFixed(3)} hectares`);
    onComplete(coordinates, areaInHectares);
  };

  const areaInHectares = (Math.PI * radius * radius) / 10000;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-info-foreground">
          📍 <strong>Click to mark</strong> the center of your field, then adjust the radius.
        </p>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden shadow-elevated">
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
          <MapClickHandler onSetCenter={handleSetCenter} />

          {centerPoint && (
            <>
              <Marker position={centerPoint} />
              <Circle
                center={centerPoint}
                radius={radius}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.3,
                  weight: 3,
                }}
              />
            </>
          )}
        </MapContainer>
      </Card>

      {/* Radius Control */}
      {centerPoint && (
        <Card className="p-4 bg-card shadow-soft">
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Field Radius: {radius} meters
          </Label>
          <Slider
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            min={10}
            max={500}
            step={5}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10m</span>
            <span>250m</span>
            <span>500m</span>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded text-center">
            <p className="text-sm font-medium text-success">
              Area: {areaInHectares.toFixed(3)} hectares
            </p>
          </div>
        </Card>
      )}

      {/* Status */}
      <Card className="p-4 bg-card shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Center Point</p>
            <p className="text-xs text-muted-foreground">
              {centerPoint
                ? `${centerPoint[0].toFixed(6)}, ${centerPoint[1].toFixed(6)}`
                : "Tap on map to mark center"}
            </p>
          </div>
          {centerPoint && (
            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
              Ready to save
            </span>
          )}
        </div>
      </Card>

      {/* Action Button */}
      {centerPoint && (
        <Button onClick={completeMapping} className="w-full h-12 bg-gradient-to-r from-success to-success/80">
          <Save className="w-5 h-5 mr-2" />
          Complete Mapping (Radius: {radius}m)
        </Button>
      )}
    </div>
  );
};
