import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, TrendingUp, TrendingDown } from "lucide-react";

interface VegetationIndices {
  ndvi: number;
  msavi: number;
  msavi2?: number;
  ndre: number;
  ndmi: number;
  ndwi: number;
  rsm: number;
  rvi: number;
  soc_vis: number;
  status: string;
  
  // Optional NPK (only if backend provides with confidence)
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  npk_confidence?: number;
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
      fullName: "Normalized Difference Vegetation Index",
      value: indices.ndvi,
      optimal: [0.5, 0.8] as [number, number],
      description: "Core indicator of plant health and photosynthesis activity",
      farmerFriendly: "This shows how green and healthy your crops are. Higher is better!",
      recommendation: indices.ndvi >= 0.5 ? "Your crops are healthy! Keep maintaining current practices." : "⚠️ Plants need attention. Consider checking water and nutrients.",
      icon: "🌿",
      trend: 0,
    },
    {
      id: "msavi",
      name: "MSAVI",
      fullName: "Modified Soil-Adjusted Vegetation Index",
      value: indices.msavi,
      optimal: [0.4, 0.7] as [number, number],
      description: "Reduces soil background interference in vegetation measurement",
      farmerFriendly: "This removes soil color effects to show true crop health, especially in early growth.",
      recommendation: indices.msavi >= 0.4 ? "Vegetation cover is good." : "Consider improving crop density or check for soil issues.",
      icon: "🌱",
      trend: 0,
    },
    {
      id: "msavi2",
      name: "MSAVI2",
      fullName: "Enhanced Soil-Adjusted Vegetation",
      value: indices.msavi2 || indices.msavi,
      optimal: [0.4, 0.7] as [number, number],
      description: "Enhanced version with improved soil correction",
      farmerFriendly: "This is an improved way to see plant health without soil affecting the reading.",
      recommendation: (indices.msavi2 || indices.msavi) >= 0.4 ? "Vegetation cover is adequate." : "Increase crop density or check for bare soil patches.",
      icon: "🌿",
      trend: 0,
    },
    {
      id: "ndre",
      name: "NDRE",
      fullName: "Normalized Difference Red Edge",
      value: indices.ndre,
      optimal: [0.4, 0.7] as [number, number],
      description: "Detects nitrogen content in plant leaves",
      farmerFriendly: "This tells you if your plants have enough nitrogen (leafy green fertilizer).",
      recommendation: indices.ndre >= 0.4 ? "Nitrogen levels are good!" : "🚨 Low nitrogen detected. Apply urea or green fertilizer soon.",
      icon: "🍃",
      trend: 0,
    },
    {
      id: "ndmi",
      name: "NDMI",
      fullName: "Normalized Difference Moisture Index",
      value: indices.ndmi,
      optimal: [0.2, 0.5] as [number, number],
      description: "Measures plant water stress and irrigation needs",
      farmerFriendly: "Shows if your crops have enough water. Like checking if plants are thirsty!",
      recommendation: indices.ndmi >= 0.2 ? "Water levels are fine." : "⚠️ Water stress detected! Irrigate your field within 24-48 hours.",
      icon: "💧",
      trend: 0,
    },
    {
      id: "ndwi",
      name: "NDWI",
      fullName: "Water Content Index",
      value: indices.ndwi,
      optimal: [0.2, 0.5] as [number, number],
      description: "Normalized Difference Water Index - measures water in leaves",
      farmerFriendly: "This shows how much water is inside your plant leaves. Good water means healthy plants!",
      recommendation: indices.ndwi >= 0.2 ? "Leaf water content is good." : "🚨 Plants are dehydrated! Water immediately.",
      icon: "💦",
      trend: 0,
    },
    {
      id: "rsm",
      name: "RSM",
      fullName: "Root Zone Soil Moisture",
      value: indices.rsm,
      optimal: [0.3, 0.6] as [number, number],
      description: "Soil moisture at root level - critical for nutrient uptake",
      farmerFriendly: "This tells you if the soil around your roots has enough water for plants to drink.",
      recommendation: indices.rsm >= 0.3 ? "Root zone moisture is adequate." : "⚠️ Dry soil! Roots cannot absorb nutrients. Water now.",
      icon: "🌊",
      trend: 0,
    },
    {
      id: "rvi",
      name: "RVI",
      fullName: "Ratio Vegetation Index",
      value: indices.rvi,
      optimal: [2.0, 4.0] as [number, number],
      description: "Simple ratio of red to NIR reflectance",
      farmerFriendly: "A quick check of overall plant health. Higher numbers mean healthier crops.",
      recommendation: indices.rvi >= 2.0 ? "Vegetation is thriving!" : "Plants need care. Check water and fertilizer.",
      icon: "📊",
      trend: 0,
    },
    {
      id: "soc_vis",
      name: "SOC",
      fullName: "Soil Organic Carbon (Visual)",
      value: indices.soc_vis,
      optimal: [0.3, 0.6] as [number, number],
      description: "Estimates soil carbon content from visible spectrum",
      farmerFriendly: "Shows soil fertility. More carbon means richer, better soil for crops.",
      recommendation: indices.soc_vis >= 0.3 ? "Soil fertility is good." : "Consider adding organic matter (compost, manure) to improve soil.",
      icon: "🪴",
      trend: 0,
    },
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

      {/* NPK Section (Conditional) */}
      {indices.nitrogen && indices.phosphorus && indices.potassium && (
        <Card className="p-6 bg-card border-primary/20 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">📊 NPK Status (Estimated)</h3>
            {indices.npk_confidence && (
              <Badge variant="outline" className="text-xs">
                {(indices.npk_confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 bg-success/10">
              <div className="text-center">
                <span className="text-3xl">🌿</span>
                <p className="text-xs font-medium mt-1 text-muted-foreground">Nitrogen (N)</p>
                <p className="text-xl font-bold text-primary mt-1">{indices.nitrogen.toFixed(1)}%</p>
                <Badge className={indices.nitrogen >= 2.5 ? "bg-success mt-2" : "bg-warning mt-2"}>
                  {indices.nitrogen >= 2.5 ? "Adequate" : "Low"}
                </Badge>
              </div>
            </Card>

            <Card className="p-3 bg-purple-50 dark:bg-purple-900/20">
              <div className="text-center">
                <span className="text-3xl">🟣</span>
                <p className="text-xs font-medium mt-1 text-muted-foreground">Phosphorus (P)</p>
                <p className="text-xl font-bold text-primary mt-1">{indices.phosphorus.toFixed(1)}%</p>
                <Badge className={indices.phosphorus >= 0.3 ? "bg-success mt-2" : "bg-warning mt-2"}>
                  {indices.phosphorus >= 0.3 ? "Adequate" : "Low"}
                </Badge>
              </div>
            </Card>

            <Card className="p-3 bg-orange-50 dark:bg-orange-900/20">
              <div className="text-center">
                <span className="text-3xl">🟠</span>
                <p className="text-xs font-medium mt-1 text-muted-foreground">Potassium (K)</p>
                <p className="text-xl font-bold text-primary mt-1">{indices.potassium.toFixed(1)}%</p>
                <Badge className={indices.potassium >= 1.5 ? "bg-success mt-2" : "bg-warning mt-2"}>
                  {indices.potassium >= 1.5 ? "Adequate" : "Low"}
                </Badge>
              </div>
            </Card>
          </div>

          <div className="p-3 bg-info/10 rounded border border-info/20">
            <p className="text-xs text-muted-foreground">
              ℹ️ NPK values are estimated using satellite data and crop models. For precise soil testing, contact your local agricultural extension office.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
