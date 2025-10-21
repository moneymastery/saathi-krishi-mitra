import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Play, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as turf from "@turf/turf";

interface WalkBoundaryMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const WalkBoundaryMap = ({ onComplete }: WalkBoundaryMapProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCurrentLocation(coords);
        },
        (error) => {
          toast.error("Unable to get your location. Please enable GPS.");
          console.error(error);
        }
      );
    }
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your device");
      return;
    }

    setIsTracking(true);
    setCoordinates([]);
    toast.success("Started tracking! Walk around your field boundary.");

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        setCurrentLocation(newCoord);
        setCoordinates((prev) => [...prev, newCoord]);
      },
      (error) => {
        toast.error("GPS tracking error. Please check your settings.");
        console.error(error);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const completeMapping = () => {
    if (coordinates.length < 3) {
      toast.error("Please track at least 3 points to create a boundary");
      return;
    }

    stopTracking();

    // Close the polygon by adding the first point at the end
    const closedCoordinates = [...coordinates, coordinates[0]];

    // Calculate area using Turf.js
    const polygon = turf.polygon([closedCoordinates]);
    const areaInSqMeters = turf.area(polygon);
    const areaInHectares = areaInSqMeters / 10000;

    toast.success(`Field boundary completed! Area: ${areaInHectares.toFixed(2)} hectares`);
    onComplete(closedCoordinates, areaInHectares);
  };

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <Card className="h-80 bg-muted rounded-2xl overflow-hidden shadow-elevated relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {!currentLocation ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Getting your location...</p>
            </div>
          ) : (
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-sm text-foreground font-medium">
                {isTracking ? "Tracking..." : "Ready to track"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentLocation[1].toFixed(6)}, {currentLocation[0].toFixed(6)}
              </p>
              {coordinates.length > 0 && (
                <p className="text-xs text-success mt-2 font-medium">
                  {coordinates.length} points tracked
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-card shadow-soft">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">GPS Tracking Status</p>
            <p className="text-xs text-muted-foreground">
              {!isTracking
                ? "Start walking to begin tracking your field boundary"
                : `Tracking active - ${coordinates.length} points recorded`}
            </p>
          </div>
        </div>

        {isTracking && (
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-xs text-success font-medium">
              🟢 Active tracking - walk around your field perimeter
            </p>
          </div>
        )}
      </Card>

      {/* Control Buttons */}
      <div className="space-y-2">
        {!isTracking ? (
          <Button
            onClick={startTracking}
            className="w-full h-12 bg-gradient-primary"
            disabled={!currentLocation}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Walking
          </Button>
        ) : (
          <>
            <Button
              onClick={completeMapping}
              className="w-full h-12 bg-success"
              disabled={coordinates.length < 3}
            >
              <Square className="w-5 h-5 mr-2" />
              Complete Boundary ({coordinates.length} points)
            </Button>
            <Button onClick={stopTracking} variant="outline" className="w-full">
              Cancel Tracking
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      <Card className="p-3 bg-warning/5 border-warning/20">
        <p className="text-xs text-warning font-medium mb-1">⚠️ Tips for accurate tracking:</p>
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>Hold your phone steady while walking</li>
          <li>Walk at a steady pace along the boundary</li>
          <li>Ensure GPS signal is strong (outdoor, clear sky)</li>
          <li>Walk back to the starting point before completing</li>
        </ul>
      </Card>
    </div>
  );
};
