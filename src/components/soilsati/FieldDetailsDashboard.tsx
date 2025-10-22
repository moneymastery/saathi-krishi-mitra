import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, Camera, TrendingUp, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { VegetationIndicesGrid } from "./VegetationIndicesGrid";
import { FieldHealthMap } from "./FieldHealthMap";

// Mock field data - will be replaced with real Supabase data
const mockFieldData = {
  id: "1",
  name: "Field 1",
  cropType: "Rice",
  variety: "IR-64",
  area: 2.5,
  sowingDate: "2024-06-21",
  expectedHarvestDate: "2024-11-18",
  irrigationMethod: "Drip",
  wateringFrequency: "Every 3 days",
  coordinates: [[28.368717, 77.540933], [28.368989, 77.540859], [28.369041, 77.541089], [28.368791, 77.541176]],
  health: {
    ndvi: 0.67,
    msavi: 0.60,
    ndre: 0.49,
    ndmi: 0.24,
    rvi: 2.40,
    soc_vis: 0.35,
    status: "healthy"
  },
  quadrants: [
    { id: "q1", name: "North-West", ndvi: 0.72, status: "healthy" as const },
    { id: "q2", name: "North-East", ndvi: 0.68, status: "healthy" as const },
    { id: "q3", name: "South-West", ndvi: 0.58, status: "monitor" as const },
    { id: "q4", name: "South-East", ndvi: 0.70, status: "healthy" as const }
  ]
};

export const FieldDetailsDashboard = () => {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const field = mockFieldData; // Replace with actual data fetch

  const growthDays = Math.floor((Date.now() - new Date(field.sowingDate).getTime()) / (1000 * 60 * 60 * 24));
  const harvestDays = Math.floor((new Date(field.expectedHarvestDate).getTime() - new Date(field.sowingDate).getTime()) / (1000 * 60 * 60 * 24));
  const growthPercentage = (growthDays / harvestDays) * 100;
  const canPredictYield = growthPercentage >= 85;

  const playAudio = (text: string, id: string) => {
    setPlayingAudio(id);
    // Use Web Speech API for now - will be enhanced with better TTS later
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setPlayingAudio(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-gradient-primary text-white">
        <Button
          onClick={() => navigate("/soilsati")}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Fields
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{field.name}</h1>
            <p className="text-sm opacity-90">🌾 {field.cropType} ({field.variety})</p>
          </div>
          <Badge className="bg-white/20 text-white">
            {field.area} hectares
          </Badge>
        </div>
      </header>

      {/* Field Summary Card */}
      <div className="px-6 py-4">
        <Card className="p-4 bg-card shadow-soft mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sowing Date</p>
              <p className="text-sm font-semibold">{new Date(field.sowingDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Expected Harvest</p>
              <p className="text-sm font-semibold">{new Date(field.expectedHarvestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Growth Stage</p>
              <p className="text-sm font-semibold">Day {growthDays} of {harvestDays} ({growthPercentage.toFixed(0)}%)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Irrigation</p>
              <p className="text-sm font-semibold">{field.irrigationMethod}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {field.coordinates[0][0].toFixed(4)}°N, {field.coordinates[0][1].toFixed(4)}°E
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playAudio(`This is ${field.name}, a ${field.area} hectare field growing ${field.cropType} variety ${field.variety}. The crop was sown on ${new Date(field.sowingDate).toLocaleDateString()} and is currently at day ${growthDays} of its ${harvestDays} day growth cycle.`, 'field-summary')}
            >
              <Volume2 className={`w-4 h-4 ${playingAudio === 'field-summary' ? 'animate-pulse text-primary' : ''}`} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Field Health Map with Quadrants */}
      <div className="px-6 mb-4">
        <FieldHealthMap 
          coordinates={field.coordinates}
          quadrants={field.quadrants}
          playAudio={playAudio}
          playingAudio={playingAudio}
        />
      </div>

      {/* Vegetation Indices */}
      <div className="px-6 mb-4">
        <VegetationIndicesGrid 
          indices={field.health}
          playAudio={playAudio}
          playingAudio={playingAudio}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <Button
          onClick={() => navigate("/disease")}
          className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:opacity-90"
        >
          <Camera className="w-4 h-4 mr-2" />
          📸 Diagnose Plant Disease
        </Button>

        {canPredictYield ? (
          <Button
            className="w-full bg-gradient-to-r from-success to-success/80 hover:opacity-90"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            📈 Predict Yield (Unlocked!)
          </Button>
        ) : (
          <Button
            disabled
            variant="outline"
            className="w-full"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            🔒 Predict Yield (Available at {harvestDays * 0.85}% growth - Day {Math.ceil(harvestDays * 0.85)})
          </Button>
        )}
      </div>
    </div>
  );
};
