import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, AlertCircle, Volume2 } from "lucide-react";
import { saveYieldPrediction, generateId } from "@/lib/storage";
import { toast } from "sonner";

interface YieldPredictionProps {
  fieldId: string;
  fieldCoordinates: string;
  cropType: string;
  sowingDate: string;
  varietyName: string;
  locationName: string;
}

export const YieldPredictionView = ({ 
  fieldId, 
  fieldCoordinates, 
  cropType, 
  sowingDate, 
  varietyName, 
  locationName 
}: YieldPredictionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fieldData = {
        field_coordinates: fieldCoordinates,
        crop_type: cropType,
        sowing_date: sowingDate,
        variety_name: varietyName,
        location_name: locationName,
        use_real_time_data: true
      };

      const response = await fetch('https://yield-1.onrender.com/predict/field-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldData)
      });

      if (!response.ok) throw new Error('Failed to get prediction');
      
      const result = await response.json();
      setPrediction(result);
      
      // Save to localStorage
      saveYieldPrediction({
        id: generateId(),
        fieldId,
        timestamp: new Date().toISOString(),
        prediction: result
      });
      
      toast.success("Yield prediction saved to field history");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      {!prediction && !error && (
        <Card className="p-6 bg-card text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Predict Your Yield</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get AI-powered yield predictions based on satellite data, weather patterns, and crop variety.
          </p>
          <Button
            onClick={handlePredict}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-success to-success/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing field data...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate Yield Prediction
              </>
            )}
          </Button>
        </Card>
      )}

      {error && (
        <Card className="p-6 bg-destructive/10 border-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Prediction Failed</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handlePredict}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {prediction && (
        <div className="space-y-4">
          {/* Main Prediction Card */}
          <Card className="p-6 bg-success/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Predicted Yield
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on satellite data and ML models
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => playAudio(`Your predicted yield is ${prediction.predicted_yield} tons per hectare with ${(prediction.confidence * 100).toFixed(0)}% confidence`)}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center py-6">
              <p className="text-5xl font-bold text-success mb-2">
                {prediction.predicted_yield?.toFixed(2)}
              </p>
              <p className="text-lg text-muted-foreground">tons/hectare</p>
              <Badge className="mt-3 bg-primary text-primary-foreground">
                {(prediction.confidence * 100).toFixed(0)}% Confidence
              </Badge>
            </div>

            {/* Range visualization */}
            {prediction.lower_bound && prediction.upper_bound && (
              <div className="mt-4 p-4 bg-background rounded">
                <p className="text-xs text-muted-foreground mb-2">Yield Range</p>
                <div className="flex items-center justify-between text-sm">
                  <span>Low: {prediction.lower_bound.toFixed(2)}</span>
                  <span className="font-semibold text-primary">
                    Predicted: {prediction.predicted_yield.toFixed(2)}
                  </span>
                  <span>High: {prediction.upper_bound.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Variety Information */}
          {prediction.variety_characteristics && (
            <Card className="p-4 bg-card">
              <h3 className="font-semibold mb-3">🌾 Variety Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Variety</p>
                  <p className="font-semibold">{prediction.variety_characteristics.variety_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Maturity Days</p>
                  <p className="font-semibold">{prediction.variety_characteristics.maturity_days}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Yield Potential</p>
                  <p className="font-semibold">{prediction.variety_characteristics.yield_potential} t/ha</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Drought Tolerance</p>
                  <p className="font-semibold">{prediction.variety_characteristics.drought_tolerance}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Environmental Factors */}
          {prediction.environmental_adjustments && (
            <Card className="p-4 bg-card">
              <h3 className="font-semibold mb-3">🌡️ Environmental Impact</h3>
              <div className="space-y-2">
                {Object.entries(prediction.environmental_adjustments).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                    <Badge className={value > 0 ? "bg-success" : value < 0 ? "bg-warning" : "bg-muted"}>
                      {value > 0 ? '+' : ''}{value.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Data Quality */}
          {prediction.data_quality !== undefined && (
            <Card className="p-4 bg-card">
              <h3 className="font-semibold mb-3">📊 Data Quality</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all"
                    style={{ width: `${prediction.data_quality * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {(prediction.data_quality * 100).toFixed(0)}%
                </span>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePredict}
            >
              🔄 Refresh Prediction
            </Button>
            <Button
              variant="outline"
              className="w-full"
            >
              📥 Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
