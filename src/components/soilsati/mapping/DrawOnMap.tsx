import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Save, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

interface DrawOnMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const DrawOnMap = ({ onComplete }: DrawOnMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      // Get user location or default to India
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap([position.coords.longitude, position.coords.latitude]);
        },
        () => {
          // Default to center of India
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
      toast.success("Map loaded! Tap to add boundary points.");
    });

    // Add click handler for drawing
    map.current.on("click", (e) => {
      const coord: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      addPoint(coord);
    });
  };

  const addPoint = (coord: [number, number]) => {
    if (!map.current) return;

    const newCoords = [...coordinates, coord];
    setCoordinates(newCoords);

    // Add marker
    const marker = new mapboxgl.Marker({ color: "#10b981" })
      .setLngLat(coord)
      .addTo(map.current);

    setMarkers((prev) => [...prev, marker]);

    // Draw line if we have at least 2 points
    if (newCoords.length >= 2) {
      drawPolygon(newCoords);
    }

    toast.success(`Point ${newCoords.length} added`);
  };

  const drawPolygon = (coords: [number, number][]) => {
    if (!map.current) return;

    // Remove existing polygon if any
    if (map.current.getSource("field-polygon")) {
      map.current.removeLayer("field-polygon-fill");
      map.current.removeLayer("field-polygon-line");
      map.current.removeSource("field-polygon");
    }

    // Close the polygon for display
    const displayCoords = coords.length >= 3 ? [...coords, coords[0]] : coords;

    // Create appropriate GeoJSON based on number of points
    const geojsonData = coords.length >= 3
      ? {
          type: "Feature" as const,
          geometry: {
            type: "Polygon" as const,
            coordinates: [displayCoords],
          },
          properties: {},
        }
      : {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: displayCoords,
          },
          properties: {},
        };

    map.current.addSource("field-polygon", {
      type: "geojson",
      data: geojsonData,
    });

    if (coords.length >= 3) {
      map.current.addLayer({
        id: "field-polygon-fill",
        type: "fill",
        source: "field-polygon",
        paint: {
          "fill-color": "#10b981",
          "fill-opacity": 0.3,
        },
      });
    }

    map.current.addLayer({
      id: "field-polygon-line",
      type: "line",
      source: "field-polygon",
      paint: {
        "line-color": "#10b981",
        "line-width": 3,
      },
    });
  };

  const clearMap = () => {
    if (!map.current) return;

    // Remove markers
    markers.forEach((marker) => marker.remove());
    setMarkers([]);

    // Remove polygon
    if (map.current.getSource("field-polygon")) {
      map.current.removeLayer("field-polygon-fill");
      map.current.removeLayer("field-polygon-line");
      map.current.removeSource("field-polygon");
    }

    setCoordinates([]);
    toast.success("Map cleared");
  };

  const completeMapping = () => {
    if (coordinates.length < 3) {
      toast.error("Please add at least 3 points to create a field boundary");
      return;
    }

    // Close the polygon
    const closedCoordinates = [...coordinates, coordinates[0]];

    // Calculate area
    const polygon = turf.polygon([closedCoordinates]);
    const areaInSqMeters = turf.area(polygon);
    const areaInHectares = areaInSqMeters / 10000;

    toast.success(`Field mapped! Area: ${areaInHectares.toFixed(2)} hectares`);
    onComplete(closedCoordinates, areaInHectares);
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

      {/* Status */}
      {isMapReady && (
        <Card className="p-4 bg-card shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-foreground">Boundary Points</p>
              <p className="text-xs text-muted-foreground">
                {coordinates.length === 0
                  ? "Tap on map to start"
                  : `${coordinates.length} points added`}
              </p>
            </div>
            {coordinates.length >= 3 && (
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                Ready to save
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Controls */}
      {isMapReady && (
        <div className="space-y-2">
          <Button
            onClick={completeMapping}
            className="w-full h-12 bg-gradient-primary"
            disabled={coordinates.length < 3}
          >
            <Save className="w-5 h-5 mr-2" />
            Complete Mapping ({coordinates.length} points)
          </Button>
          {coordinates.length > 0 && (
            <Button onClick={clearMap} variant="outline" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Points
            </Button>
          )}
        </div>
      )}

      {/* Instructions */}
      <Card className="p-3 bg-info/5 border-info/20">
        <p className="text-xs text-info font-medium mb-1">💡 How to draw:</p>
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>Use navigation controls to zoom and pan</li>
          <li>Tap on map to add corner points of your field</li>
          <li>Add at least 3 points to form a polygon</li>
          <li>Points will connect automatically</li>
        </ul>
      </Card>
    </div>
  );
};
