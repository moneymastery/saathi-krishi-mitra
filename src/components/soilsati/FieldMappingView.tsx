import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Upload, Square, Navigation, Edit3, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalkBoundaryMap } from "./mapping/WalkBoundaryMap";
import { DrawOnMap } from "./mapping/DrawOnMap";
import { CenterRadiusMap } from "./mapping/CenterRadiusMap";
import { PointAndPinMap } from "./mapping/PointAndPinMap";
import { ImportBoundary } from "./mapping/ImportBoundary";
import { AutoLocationSquare } from "./mapping/AutoLocationSquare";
import { FieldDetailsForm } from "./mapping/FieldDetailsForm";
import { saveField, saveEvent, generateId } from "@/lib/storage";
import { Field, FieldEvent } from "@/types/field";
import { toast } from "sonner";

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
    if (!coordinates) return;

    const fieldId = generateId();
    const now = new Date().toISOString();

    const field: Field = {
      id: fieldId,
      userId: "local_user", // Will be replaced when auth is implemented
      name: fieldData.name,
      cropType: fieldData.cropType,
      variety: fieldData.variety,
      area: fieldData.area,
      sowingDate: fieldData.sowingDate,
      expectedHarvestDate: fieldData.expectedHarvestDate,
      irrigationMethod: fieldData.irrigationMethod,
      wateringFrequency: fieldData.wateringFrequency,
      coordinates: coordinates,
      geometry: {
        type: "Polygon",
        coordinates: [coordinates.map(c => [c[1], c[0]])], // Convert to GeoJSON [lng, lat]
      },
      quadrants: [
        { id: "q1", name: "North-West", ndvi: 0, status: "monitor" },
        { id: "q2", name: "North-East", ndvi: 0, status: "monitor" },
        { id: "q3", name: "South-West", ndvi: 0, status: "monitor" },
        { id: "q4", name: "South-East", ndvi: 0, status: "monitor" }
      ],
      analysisHistory: [],
      createdAt: now,
      updatedAt: now,
      editCount: 0,
      events: [],
      editAudits: [],
    };

    saveField(field);

    // Add creation event
    const creationEvent: FieldEvent = {
      id: generateId(),
      type: "created",
      timestamp: now,
      userId: "local_user",
      userName: "You",
      description: `Field "${fieldData.name}" created with ${fieldData.area.toFixed(2)} hectares mapped`,
      metadata: {
        cropType: fieldData.cropType,
        variety: fieldData.variety,
        area: fieldData.area,
      },
    };

    saveEvent(fieldId, creationEvent);

    toast.success(`Field "${fieldData.name}" saved successfully!`);
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
      <header className="px-6 pt-8 pb-4 bg-gradient-primary text-white">
        <Button onClick={() => navigate("/soilsati")} variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-1">Map Your Field</h1>
        <p className="text-sm opacity-90">Choose a mapping method below</p>
      </header>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="walk">🚶 Walk</TabsTrigger>
            <TabsTrigger value="point">📍 Point</TabsTrigger>
            <TabsTrigger value="draw">✏️ Draw</TabsTrigger>
          </TabsList>

          <TabsContent value="walk"><WalkBoundaryMap onComplete={handleMappingComplete} /></TabsContent>
          <TabsContent value="point"><PointAndPinMap onComplete={handleMappingComplete} /></TabsContent>
          <TabsContent value="draw"><DrawOnMap onComplete={handleMappingComplete} /></TabsContent>
        </Tabs>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">More Options:</p>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="import">📤 Import</TabsTrigger>
              <TabsTrigger value="auto">⬜ Auto</TabsTrigger>
              <TabsTrigger value="radius">🎯 Radius</TabsTrigger>
            </TabsList>
            <TabsContent value="import"><ImportBoundary onComplete={handleMappingComplete} /></TabsContent>
            <TabsContent value="auto"><AutoLocationSquare onComplete={handleMappingComplete} /></TabsContent>
            <TabsContent value="radius"><CenterRadiusMap onComplete={handleMappingComplete} /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
