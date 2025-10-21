import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalkBoundaryMap } from "./mapping/WalkBoundaryMap";
import { DrawOnMap } from "./mapping/DrawOnMap";
import { CenterRadiusMap } from "./mapping/CenterRadiusMap";
import { FieldDetailsForm } from "./mapping/FieldDetailsForm";

export const FieldMappingView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("walk");
  const [coordinates, setCoordinates] = useState<[number, number][] | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleMappingComplete = (coords: [number, number][], calculatedArea: number) => {
    setCoordinates(coords);
    setArea(calculatedArea);
    setShowForm(true);
  };

  const handleSaveField = (fieldData: any) => {
    console.log("Field saved:", { ...fieldData, coordinates, area });
    // TODO: Save to database
    navigate("/soilsati");
  };

  if (showForm && coordinates && area) {
    return (
      <FieldDetailsForm
        coordinates={coordinates}
        area={area}
        onSave={handleSaveField}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-gradient-primary text-white">
        <Button
          onClick={() => navigate("/soilsati")}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-1">Map Your Field</h1>
        <p className="text-sm opacity-90">Choose a mapping method below</p>
      </header>

      {/* Mapping Methods */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="walk">🚶 Walk</TabsTrigger>
            <TabsTrigger value="draw">✏️ Draw</TabsTrigger>
            <TabsTrigger value="radius">📍 Radius</TabsTrigger>
          </TabsList>

          <TabsContent value="walk" className="mt-0">
            <Card className="p-4 bg-card shadow-soft mb-4">
              <h3 className="font-semibold text-foreground mb-2">Walk Boundary Method</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Walk around your field perimeter. Your GPS location will be tracked automatically.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Tap "Start Walking" and walk to your field boundary</li>
                <li>Walk around the entire perimeter</li>
                <li>Tap "Complete Boundary" when you return to start</li>
                <li>Area will be calculated automatically</li>
              </ul>
            </Card>
            <WalkBoundaryMap onComplete={handleMappingComplete} />
          </TabsContent>

          <TabsContent value="draw" className="mt-0">
            <Card className="p-4 bg-card shadow-soft mb-4">
              <h3 className="font-semibold text-foreground mb-2">Draw on Map Method</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Draw your field boundary directly on the interactive map.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Search or navigate to your field location</li>
                <li>Tap to add corner points of your field</li>
                <li>Double-tap the last point to complete the polygon</li>
                <li>Area will be calculated automatically</li>
              </ul>
            </Card>
            <DrawOnMap onComplete={handleMappingComplete} />
          </TabsContent>

          <TabsContent value="radius" className="mt-0">
            <Card className="p-4 bg-card shadow-soft mb-4">
              <h3 className="font-semibold text-foreground mb-2">Center + Radius Method</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Mark the center of your field and specify the radius.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Tap on map to mark the center of your field</li>
                <li>Enter the radius in meters using the slider</li>
                <li>A circular boundary will be created</li>
                <li>Adjust radius until it matches your field</li>
              </ul>
            </Card>
            <CenterRadiusMap onComplete={handleMappingComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
