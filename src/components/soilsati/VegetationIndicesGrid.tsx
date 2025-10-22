import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, TrendingUp, TrendingDown } from "lucide-react";

interface VegetationIndices {
  ndvi: number;
  msavi: number;
  ndre: number;
  ndmi: number;
  rvi: number;
  soc_vis: number;
  status: string;
}

interface VegetationIndicesGridProps {
  indices: VegetationIndices;
  playAudio: (text: string, id: string) => void;
  playingAudio: string | null;
}

export const VegetationIndicesGrid = ({ indices, playAudio, playingAudio }: VegetationIndicesGridProps) => {
  const indexData = [
    {
      id: "ndvi",
      name: "NDVI",
      fullName: "Vegetation Health",
      value: indices.ndvi,
      optimal: [0.6, 0.9] as [number, number],
      description: "Overall crop health and greenness",
      farmerFriendly: "This shows how green and healthy your crops are. Higher is better!",
      recommendation: indices.ndvi >= 0.6 ? "Great! Your crops are healthy." : "Consider checking for water or nutrient deficiency.",
      icon: "🌱",
      trend: 5
    },
    {
      id: "msavi",
      name: "MSAVI",
      fullName: "Soil-Adjusted Vegetation",
      value: indices.msavi,
      optimal: [0.5, 0.8] as [number, number],
      description: "Vegetation health adjusted for soil brightness",
      farmerFriendly: "This removes soil background effects to show true plant health.",
      recommendation: indices.msavi >= 0.5 ? "Good vegetation coverage." : "Soil exposure detected - improve crop cover.",
      icon: "🌍",
      trend: -1
    },
    {
      id: "ndre",
      name: "NDRE",
      fullName: "Nitrogen Status",
      value: indices.ndre,
      optimal: [0.5, 0.7] as [number, number],
      description: "Chlorophyll content and nitrogen levels",
      farmerFriendly: "This tells you if your crops have enough nitrogen (important for growth).",
      recommendation: indices.ndre >= 0.5 ? "Nitrogen levels are adequate." : "⚠️ Apply nitrogen fertilizer or urea spray.",
      icon: "💚",
      trend: -3
    },
    {
      id: "ndmi",
      name: "NDMI",
      fullName: "Water Content",
      value: indices.ndmi,
      optimal: [0.3, 0.6] as [number, number],
      description: "Plant water content and stress",
      farmerFriendly: "This shows if your crops are getting enough water.",
      recommendation: indices.ndmi >= 0.3 ? "Water levels are good." : "🚨 Water stress! Increase irrigation frequency.",
      icon: "💧",
      trend: -5
    },
    {
      id: "rvi",
      name: "RVI",
      fullName: "Biomass Index",
      value: indices.rvi,
      optimal: [2.0, 4.0] as [number, number],
      description: "Total plant biomass accumulation",
      farmerFriendly: "This measures how much your crops are growing.",
      recommendation: indices.rvi >= 2.0 ? "Excellent biomass growth!" : "Growth is slow - check nutrients and water.",
      icon: "🌾",
      trend: 1
    },
    {
      id: "soc_vis",
      name: "SOC",
      fullName: "Soil Organic Carbon",
      value: indices.soc_vis,
      optimal: [0.3, 0.6] as [number, number],
      description: "Soil health and organic matter",
      farmerFriendly: "This shows how rich and healthy your soil is.",
      recommendation: indices.soc_vis >= 0.3 ? "Good soil health - keep it up!" : "Add organic compost or manure.",
      icon: "🪨",
      trend: 8
    }
  ];

  const getStatus = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return { label: "Optimal", color: "bg-success text-success-foreground" };
    if (value < optimal[0] * 0.8) return { label: "Poor", color: "bg-destructive text-destructive-foreground" };
    if (value > optimal[1] * 1.2) return { label: "Excess", color: "bg-warning text-warning-foreground" };
    return { label: "Monitor", color: "bg-warning text-warning-foreground" };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Vegetation Health Indices</h2>
      
      <div className="space-y-3">
        {indexData.map((index) => {
          const status = getStatus(index.value, index.optimal);
          return (
            <Card key={index.id} className="p-4 bg-card shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{index.icon}</span>
                    <h3 className="text-base font-semibold">{index.fullName}</h3>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{index.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{index.value.toFixed(2)}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {index.trend > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-success">+{index.trend}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-destructive" />
                        <span className="text-destructive">{index.trend}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded mb-3">
                <p className="text-sm text-foreground mb-2">📖 {index.farmerFriendly}</p>
                <p className="text-xs text-muted-foreground">Optimal range: {index.optimal[0]} - {index.optimal[1]}</p>
              </div>

              <div className="bg-info/10 p-3 rounded mb-3">
                <p className="text-sm font-medium text-foreground">💡 Recommendation:</p>
                <p className="text-sm text-muted-foreground">{index.recommendation}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => playAudio(
                  `${index.fullName}. Current value is ${index.value.toFixed(2)}. ${index.farmerFriendly} ${index.recommendation}`,
                  index.id
                )}
              >
                <Volume2 className={`w-4 h-4 mr-2 ${playingAudio === index.id ? 'animate-pulse text-primary' : ''}`} />
                🔊 Listen to Explanation
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
