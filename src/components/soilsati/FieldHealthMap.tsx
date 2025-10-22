import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";

interface Quadrant {
  id: string;
  name: string;
  ndvi: number;
  status: "healthy" | "monitor" | "stress";
}

interface FieldHealthMapProps {
  coordinates: number[][];
  quadrants: Quadrant[];
  playAudio: (text: string, id: string) => void;
  playingAudio: string | null;
}

export const FieldHealthMap = ({ quadrants, playAudio, playingAudio }: FieldHealthMapProps) => {
  const getQuadrantColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-success/80";
      case "monitor": return "bg-warning/80";
      case "stress": return "bg-destructive/80";
      default: return "bg-muted";
    }
  };

  const getQuadrantLabel = (status: string) => {
    switch (status) {
      case "healthy": return "🟢 Healthy";
      case "monitor": return "🟡 Monitor";
      case "stress": return "🔴 Stress";
      default: return "Unknown";
    }
  };

  const getHealthSummary = () => {
    const healthy = quadrants.filter(q => q.status === "healthy").length;
    const monitor = quadrants.filter(q => q.status === "monitor").length;
    const stress = quadrants.filter(q => q.status === "stress").length;
    
    let summary = `Field health summary: `;
    if (healthy > 0) summary += `${healthy} quadrant${healthy > 1 ? 's are' : ' is'} healthy. `;
    if (monitor > 0) summary += `${monitor} quadrant${monitor > 1 ? 's need' : ' needs'} monitoring. `;
    if (stress > 0) summary += `${stress} quadrant${stress > 1 ? 's are' : ' is'} under stress and needs immediate attention.`;
    return summary;
  };

  return (
    <Card className="p-4 bg-card shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Field Health Zones</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => playAudio(getHealthSummary(), 'field-health-map')}
        >
          <Volume2 className={`w-4 h-4 ${playingAudio === 'field-health-map' ? 'animate-pulse text-primary' : ''}`} />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Your field is divided into 4 zones for precise health monitoring
      </p>

      {/* Grid visualization of quadrants */}
      <div className="grid grid-cols-2 gap-2 mb-4 aspect-square">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`${getQuadrantColor(quadrant.status)} rounded-lg p-4 flex flex-col items-center justify-center text-white relative`}
          >
            <p className="text-xs font-medium mb-2">{quadrant.name}</p>
            <p className="text-2xl font-bold">{quadrant.ndvi.toFixed(2)}</p>
            <Badge className="mt-2 bg-white/20 text-white text-xs">
              {getQuadrantLabel(quadrant.status).split(' ')[1]}
            </Badge>
          </div>
        ))}
      </div>

      {/* Quadrant details */}
      <div className="space-y-2">
        {quadrants.map((quadrant) => (
          <div key={quadrant.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getQuadrantColor(quadrant.status)}`} />
              <span className="text-sm font-medium">{quadrant.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">NDVI: {quadrant.ndvi.toFixed(2)}</span>
              <Badge className={getQuadrantColor(quadrant.status).replace('/80', '')} variant="outline">
                {getQuadrantLabel(quadrant.status)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-info/10 rounded">
        <p className="text-xs font-medium text-foreground mb-1">💡 What this means:</p>
        <p className="text-xs text-muted-foreground">
          {quadrants.some(q => q.status === "stress") 
            ? "⚠️ Some zones need immediate attention. Focus on the red/yellow areas for irrigation or pest control."
            : quadrants.some(q => q.status === "monitor")
            ? "Your field is mostly healthy, but keep monitoring the yellow zones."
            : "🎉 Excellent! Your entire field is healthy. Keep up the good work!"}
        </p>
      </div>
    </Card>
  );
};
