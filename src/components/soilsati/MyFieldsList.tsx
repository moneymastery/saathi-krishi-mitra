import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Plus, TrendingUp, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllFields } from "@/lib/storage";
import { Field } from "@/types/field";

export const MyFieldsList = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    // Load fields from localStorage
    const loadedFields = getAllFields();
    setFields(loadedFields);
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-success text-success-foreground";
      case "monitor": return "bg-warning text-warning-foreground";
      case "stress": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  const getHealthLabel = (status: string) => {
    switch (status) {
      case "healthy": return "🟢 Healthy";
      case "monitor": return "🟡 Monitor";
      case "stress": return "🔴 Stress";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">My Fields</h2>
        <Button 
          onClick={() => navigate("/soilsati/map-field")}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="p-8 text-center bg-card/50">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Fields Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start by mapping your first field to get satellite insights
          </p>
          <Button 
            onClick={() => navigate("/soilsati/map-field")}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Map Your First Field
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <Card 
              key={field.id}
              className="p-4 bg-card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/soilsati/field/${field.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{field.name}</h3>
                  <p className="text-sm text-muted-foreground">🌾 {field.cropType}</p>
                </div>
                <Badge className={getHealthColor(field.currentHealth?.status || "monitor")}>
                  {getHealthLabel(field.currentHealth?.status || "monitor")}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Area</p>
                  <p className="text-sm font-semibold">{field.area} ha</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <p className="text-xs text-muted-foreground">NDVI</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {field.currentHealth?.ndvi ? field.currentHealth.ndvi.toFixed(2) : "N/A"}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-info" />
                    <p className="text-xs text-muted-foreground">Days</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {Math.floor((Date.now() - new Date(field.sowingDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                e.stopPropagation();
                navigate(`/soilsati/field/${field.id}`);
              }}>
                View Details →
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
