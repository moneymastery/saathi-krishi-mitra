import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Square, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as turf from "@turf/turf";
import { GPSAccuracyIndicator } from "./GPSAccuracyIndicator";
import { GPSAccuracy } from "@/types/field";

interface AutoLocationSquareProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const AutoLocationSquare = ({ onComplete }: AutoLocationSquareProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<GPSAccuracy | null>(null);
  const [plotSize, setPlotSize] = useState(1.0); // hectares
  const [preview, setPreview] = useState<{
    coordinates: [number, number][];
    area: number;
  } | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setCurrentLocation([lat, lng]);
        setGpsAccuracy({
          accuracy,
          timestamp: new Date().toISOString(),
          status: accuracy <= 5 ? "excellent" : accuracy <= 10 ? "good" : accuracy <= 15 ? "fair" : "poor"
        });
        setIsGettingLocation(false);
        
        toast.success("Location acquired");
        
        // Auto-generate square boundary
        generateSquareBoundary(lat, lng, plotSize);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
        toast.error("Failed to get location. Please enable GPS.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const generateSquareBoundary = (centerLat: number, centerLng: number, areaHa: number) => {
    try {
      // Calculate side length of square in meters
      const areaM2 = areaHa * 10000;
      const sideLength = Math.sqrt(areaM2);
      const halfSide = sideLength / 2;

      // Create square boundary around center point
      const center = turf.point([centerLng, centerLat]);
      
      // Calculate corner points (in meters from center)
      const corners: [number, number][] = [
        turf.destination(center, halfSide / 1000, 0, { units: 'kilometers' }).geometry.coordinates, // North
        turf.destination(center, halfSide / 1000, 90, { units: 'kilometers' }).geometry.coordinates, // East
        turf.destination(center, halfSide / 1000, 180, { units: 'kilometers' }).geometry.coordinates, // South
        turf.destination(center, halfSide / 1000, 270, { units: 'kilometers' }).geometry.coordinates, // West
      ].map(coord => [coord[1], coord[0]] as [number, number]); // Convert to [lat, lng]

      // Calculate actual corners (NE, SE, SW, NW)
      const ne = turf.destination(
        turf.destination(center, halfSide / 1000, 0, { units: 'kilometers' }),
        halfSide / 1000,
        90,
        { units: 'kilometers' }
      ).geometry.coordinates;
      
      const se = turf.destination(
        turf.destination(center, halfSide / 1000, 180, { units: 'kilometers' }),
        halfSide / 1000,
        90,
        { units: 'kilometers' }
      ).geometry.coordinates;
      
      const sw = turf.destination(
        turf.destination(center, halfSide / 1000, 180, { units: 'kilometers' }),
        halfSide / 1000,
        270,
        { units: 'kilometers' }
      ).geometry.coordinates;
      
      const nw = turf.destination(
        turf.destination(center, halfSide / 1000, 0, { units: 'kilometers' }),
        halfSide / 1000,
        270,
        { units: 'kilometers' }
      ).geometry.coordinates;

      const squareCoords: [number, number][] = [
        [ne[1], ne[0]],
        [se[1], se[0]],
        [sw[1], sw[0]],
        [nw[1], nw[0]]
      ];

      setPreview({
        coordinates: squareCoords,
        area: areaHa
      });
    } catch (error) {
      console.error("Error generating square:", error);
      toast.error("Failed to generate boundary");
    }
  };

  const handlePlotSizeChange = (value: string) => {
    const size = parseFloat(value);
    if (isNaN(size) || size <= 0) return;
    
    setPlotSize(size);
    
    if (currentLocation) {
      generateSquareBoundary(currentLocation[0], currentLocation[1], size);
    }
  };

  const handleConfirm = () => {
    if (!preview) {
      toast.error("Please wait for location and preview");
      return;
    }

    if (gpsAccuracy && gpsAccuracy.status === "poor") {
      toast.error("GPS accuracy too low. Move to open area.");
      return;
    }

    onComplete(preview.coordinates, preview.area);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-info-foreground">
          📍 <strong>Quick single-plot capture</strong> - Creates a square boundary centered on your current location.
        </p>
      </Card>

      {/* GPS Status */}
      {gpsAccuracy && (
        <GPSAccuracyIndicator accuracy={gpsAccuracy} showDetails />
      )}

      {/* Location Status */}
      <Card className="p-4 bg-card">
        {isGettingLocation ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <div>
              <p className="font-semibold text-sm">Getting your location...</p>
              <p className="text-xs text-muted-foreground">This may take a few seconds</p>
            </div>
          </div>
        ) : currentLocation ? (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">Location Acquired</p>
              <p className="text-xs text-muted-foreground">
                {currentLocation[0].toFixed(6)}°N, {currentLocation[1].toFixed(6)}°E
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={getCurrentLocation}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Location unavailable</p>
              <p className="text-xs text-muted-foreground">Enable GPS and try again</p>
            </div>
            <Button size="sm" onClick={getCurrentLocation}>
              Get Location
            </Button>
          </div>
        )}
      </Card>

      {/* Plot Size Input */}
      <Card className="p-4 bg-card">
        <Label htmlFor="plot-size" className="mb-2 block">
          Plot Size (hectares)
        </Label>
        <div className="flex gap-3 items-center">
          <Input
            id="plot-size"
            type="number"
            min="0.1"
            step="0.1"
            value={plotSize}
            onChange={(e) => handlePlotSizeChange(e.target.value)}
            className="flex-1"
          />
          <Square className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Side length: ~{Math.sqrt(plotSize * 10000).toFixed(0)}m × {Math.sqrt(plotSize * 10000).toFixed(0)}m
        </p>
      </Card>

      {/* Preview */}
      {preview && (
        <>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20" style={{ height: "200px" }}>
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Square className="w-16 h-16 text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                Square boundary centered on your location
              </p>
              <p className="text-lg font-bold text-success mt-2">
                {preview.area.toFixed(2)} hectares
              </p>
            </div>
          </Card>

          <Card className="p-3 bg-card">
            <p className="text-xs font-semibold mb-2">Boundary Coordinates:</p>
            <div className="space-y-1">
              {preview.coordinates.map((coord, idx) => (
                <p key={idx} className="text-xs text-muted-foreground font-mono">
                  Point {idx + 1}: {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                </p>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Action Button */}
      <Button
        onClick={handleConfirm}
        disabled={!preview || gpsAccuracy?.status === "poor"}
        className="w-full bg-gradient-to-r from-success to-success/80"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirm Square Boundary
      </Button>

      {gpsAccuracy?.status === "poor" && (
        <Card className="p-3 bg-warning/10 border-warning">
          <p className="text-xs text-warning-foreground">
            ⚠️ GPS accuracy is too low. Move to an open area away from buildings and trees for better signal.
          </p>
        </Card>
      )}
    </div>
  );
};
