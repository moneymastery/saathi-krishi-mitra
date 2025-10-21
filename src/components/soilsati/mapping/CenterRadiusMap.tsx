import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MapPin, Save, Info } from "lucide-react";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

interface CenterRadiusMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const CenterRadiusMap = ({ onComplete }: CenterRadiusMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const [centerPoint, setCenterPoint] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(50); // meters
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap([position.coords.longitude, position.coords.latitude]);
        },
        () => {
          initializeMap([78.9629, 20.5937]);
        }
      );
    } catch (error) {
      console.error("Map initialization error:", error);
      toast.error("Failed to initialize map. Please check your token.");
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (centerPoint && map.current) {
      drawCircle(centerPoint, radius);
    }
  }, [radius]);

  const initializeMap = (center: [number, number]) => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: center,
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    map.current.on("load", () => {
      setIsMapReady(true);
      toast.success("Map loaded! Tap to mark field center.");
    });

    map.current.on("click", (e) => {
      const coord: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCenter(coord);
    });
  };

  const setCenter = (coord: [number, number]) => {
    if (!map.current) return;

    setCenterPoint(coord);

    // Remove old marker if exists
    if (marker) {
      marker.remove();
    }

    // Add new marker
    const newMarker = new mapboxgl.Marker({ color: "#10b981" })
      .setLngLat(coord)
      .addTo(map.current);

    setMarker(newMarker);
    drawCircle(coord, radius);
    toast.success("Center point set! Adjust radius below.");
  };

  const drawCircle = (center: [number, number], radiusMeters: number) => {
    if (!map.current) return;

    // Remove existing circle
    if (map.current.getSource("field-circle")) {
      map.current.removeLayer("field-circle-fill");
      map.current.removeLayer("field-circle-line");
      map.current.removeSource("field-circle");
    }

    // Create circle polygon using Turf
    const circle = turf.circle(center, radiusMeters / 1000, {
      steps: 64,
      units: "kilometers",
    });

    map.current.addSource("field-circle", {
      type: "geojson",
      data: circle,
    });

    map.current.addLayer({
      id: "field-circle-fill",
      type: "fill",
      source: "field-circle",
      paint: {
        "fill-color": "#10b981",
        "fill-opacity": 0.3,
      },
    });

    map.current.addLayer({
      id: "field-circle-line",
      type: "line",
      source: "field-circle",
      paint: {
        "line-color": "#10b981",
        "line-width": 3,
      },
    });

    // Fit map to circle bounds
    const bbox = turf.bbox(circle);
    map.current.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 50 }
    );
  };

  const completeMapping = () => {
    if (!centerPoint) {
      toast.error("Please mark the center point on the map first");
      return;
    }

    // Create circle and get coordinates
    const circle = turf.circle(centerPoint, radius / 1000, {
      steps: 64,
      units: "kilometers",
    });

    const coordinates = circle.geometry.coordinates[0] as [number, number][];
    const areaInSqMeters = turf.area(circle);
    const areaInHectares = areaInSqMeters / 10000;

    toast.success(`Field mapped! Area: ${areaInHectares.toFixed(2)} hectares`);
    onComplete(coordinates, areaInHectares);
  };

  if (!mapboxToken) {
    return (
      <Card className="p-6 bg-card shadow-soft">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Mapbox Token Required</h3>
            <p className="text-sm text-muted-foreground mb-3">
              To use the interactive map, you need a free Mapbox token. Get yours at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
        <Input
          placeholder="Paste your Mapbox public token here"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
          className="mb-3"
        />
        <p className="text-xs text-muted-foreground">
          Note: In production, this token will be securely stored in your backend.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="overflow-hidden shadow-elevated">
        <div ref={mapContainer} className="h-96 w-full" />
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
              Area: {((Math.PI * radius * radius) / 10000).toFixed(3)} hectares
            </p>
          </div>
        </Card>
      )}

      {/* Status */}
      {isMapReady && (
        <Card className="p-4 bg-card shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Center Point</p>
              <p className="text-xs text-muted-foreground">
                {centerPoint
                  ? `${centerPoint[1].toFixed(6)}, ${centerPoint[0].toFixed(6)}`
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
      )}

      {/* Controls */}
      {isMapReady && centerPoint && (
        <Button onClick={completeMapping} className="w-full h-12 bg-gradient-primary">
          <Save className="w-5 h-5 mr-2" />
          Complete Mapping (Radius: {radius}m)
        </Button>
      )}

      {/* Instructions */}
      <Card className="p-3 bg-info/5 border-info/20">
        <p className="text-xs text-info font-medium mb-1">💡 How to use:</p>
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>Navigate to your field location using map controls</li>
          <li>Tap on map to mark the center of your field</li>
          <li>Adjust the radius slider until circle matches your field</li>
          <li>Perfect for circular or square fields</li>
        </ul>
      </Card>
    </div>
  );
};
