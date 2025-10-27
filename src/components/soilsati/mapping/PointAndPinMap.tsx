import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Undo, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import * as turf from "@turf/turf";

interface PointAndPinMapProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const PointAndPinMap = ({ onComplete }: PointAndPinMapProps) => {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [area, setArea] = useState(0);

  const handleMapClick = (lat: number, lng: number) => {
    const newPoints = [...points, [lat, lng] as [number, number]];
    setPoints(newPoints);
    toast.success(`Point ${newPoints.length} added`);

    // Calculate area if we have at least 3 points
    if (newPoints.length >= 3) {
      calculateArea(newPoints);
    }
  };

  const calculateArea = (coords: [number, number][]) => {
    if (coords.length < 3) return;

    try {
      // Close the polygon by adding first point at the end
      const closedCoords = [...coords, coords[0]];
      const polygon = turf.polygon([[...closedCoords.map(c => [c[1], c[0]])]]);
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

  // Simulate map click for demo (replace with actual map integration)
  const handleDemoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to mock lat/lng (in real app, use map's pixel-to-latlng)
    const lat = 28.368717 + (y / rect.height - 0.5) * 0.01;
    const lng = 77.540933 + (x / rect.width - 0.5) * 0.01;
    
    handleMapClick(lat, lng);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-info-foreground">
          📍 <strong>Tap at each corner</strong> of your field to drop boundary points. Double-tap to finish.
        </p>
      </Card>

      {/* Map Area */}
      <Card className="relative overflow-hidden" style={{ height: "400px" }}>
        <div
          onClick={handleDemoClick}
          onDoubleClick={completeMapping}
          className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 cursor-crosshair relative"
        >
          {/* Mock Map Background */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            {points.length === 0 ? "Tap to add first point" : "Tap to add more points"}
          </div>

          {/* Points */}
          {points.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-in zoom-in"
              style={{
                left: `${((point[1] - 77.535933) / 0.01 + 0.5) * 100}%`,
                top: `${((point[0] - 28.363717) / 0.01 + 0.5) * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {idx + 1}
              </div>
            </div>
          ))}

          {/* Lines connecting points */}
          {points.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                points={points.map((p, idx) => {
                  const x = ((p[1] - 77.535933) / 0.01 + 0.5) * 100;
                  const y = ((p[0] - 28.363717) / 0.01 + 0.5) * 100;
                  return `${x}%,${y}%`;
                }).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </div>

        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2">
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
              <p className="text-2xl font-bold text-success">{area.toFixed(2)} ha</p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={completeMapping}
          disabled={points.length < 3}
          className="flex-1 bg-gradient-to-r from-success to-success/80"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Boundary ({points.length} points)
        </Button>
      </div>

      <Card className="p-3 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          ℹ️ In the full app, this will use an interactive map (Google Maps/OpenStreetMap) for precise point placement.
        </p>
      </Card>
    </div>
  );
};
