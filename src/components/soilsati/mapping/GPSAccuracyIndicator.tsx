import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, AlertTriangle, CheckCircle } from "lucide-react";
import { GPSAccuracy } from "@/types/field";

interface GPSAccuracyIndicatorProps {
  accuracy: GPSAccuracy;
  showDetails?: boolean;
}

export const GPSAccuracyIndicator = ({ accuracy, showDetails = false }: GPSAccuracyIndicatorProps) => {
  const getAccuracyStatus = (meters: number): GPSAccuracy["status"] => {
    if (meters <= 5) return "excellent";
    if (meters <= 10) return "good";
    if (meters <= 15) return "fair";
    return "poor";
  };

  const getStatusColor = (status: GPSAccuracy["status"]) => {
    switch (status) {
      case "excellent": return "bg-success text-success-foreground";
      case "good": return "bg-primary text-primary-foreground";
      case "fair": return "bg-warning text-warning-foreground";
      case "poor": return "bg-destructive text-destructive-foreground";
    }
  };

  const getStatusIcon = (status: GPSAccuracy["status"]) => {
    switch (status) {
      case "excellent":
      case "good":
        return <CheckCircle className="w-4 h-4" />;
      case "fair":
      case "poor":
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: GPSAccuracy["status"]) => {
    switch (status) {
      case "excellent": return "Excellent Signal";
      case "good": return "Good Signal";
      case "fair": return "Fair Signal";
      case "poor": return "Poor Signal";
    }
  };

  const getRecommendation = (status: GPSAccuracy["status"]) => {
    switch (status) {
      case "excellent":
      case "good":
        return "GPS accuracy is sufficient for field mapping.";
      case "fair":
        return "Move to an open area for better accuracy.";
      case "poor":
        return "⚠️ Move to open sky. Avoid buildings and trees.";
    }
  };

  const status = getAccuracyStatus(accuracy.accuracy);

  if (!showDetails) {
    // Compact badge view
    return (
      <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
        {getStatusIcon(status)}
        <span>{accuracy.accuracy.toFixed(1)}m</span>
      </Badge>
    );
  }

  // Detailed card view
  return (
    <Card className={`p-3 border-l-4 ${status === 'excellent' || status === 'good' ? 'border-success bg-success/5' : status === 'fair' ? 'border-warning bg-warning/5' : 'border-destructive bg-destructive/5'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
          <Satellite className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{getStatusText(status)}</span>
            <span className="text-xs text-muted-foreground">
              ±{accuracy.accuracy.toFixed(1)}m
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {getRecommendation(status)}
          </p>
        </div>
      </div>

      {/* Signal Strength Bars */}
      <div className="flex gap-1 mt-3">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={`flex-1 h-1.5 rounded ${
              bar <= (status === 'excellent' ? 5 : status === 'good' ? 4 : status === 'fair' ? 3 : 2)
                ? getStatusColor(status)
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};
