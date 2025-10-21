import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Sprout, Activity, TrendingUp } from "lucide-react";

export const SoilSatiView = () => {
  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-6 bg-gradient-primary text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sprout className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">SoilSati</h1>
            <p className="text-sm opacity-90">Field Intelligence Hub</p>
          </div>
        </div>
        <p className="text-sm opacity-80 mt-2">
          Real-time crop health monitoring powered by satellite data
        </p>
      </header>

      {/* Map Placeholder */}
      <div className="mx-6 -mt-4 mb-6">
        <Card className="h-64 bg-muted rounded-2xl overflow-hidden shadow-elevated relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
              <p className="text-xs text-muted-foreground mt-1">Your fields will appear here</p>
            </div>
          </div>
        </Card>
      </div>

      {/* My Fields */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Fields</h2>
          <Button 
            size="sm" 
            className="bg-gradient-primary"
            onClick={() => window.location.href = '/soilsati/map-field'}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </div>

        {/* Sample Field Cards */}
        <div className="space-y-3">
          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Field 1 - Rice 🌾</h3>
                <p className="text-xs text-muted-foreground">2.5 hectares • IR-64</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                Healthy
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">NDVI</p>
                <p className="text-lg font-bold text-success">0.67</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Growth Day</p>
                <p className="text-lg font-bold text-foreground">85</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Health</p>
                <p className="text-lg font-bold text-success">85%</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Activity className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Predict
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Field 2 - Wheat 🌾</h3>
                <p className="text-xs text-muted-foreground">1.8 hectares • HD-2967</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                Monitor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">NDVI</p>
                <p className="text-lg font-bold text-warning">0.52</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Growth Day</p>
                <p className="text-lg font-bold text-foreground">62</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Health</p>
                <p className="text-lg font-bold text-warning">68%</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Activity className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Predict
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Features Overview */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">SoilSati Features</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center bg-card shadow-soft">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm font-medium text-foreground">Disease Detection</p>
          </Card>
          <Card className="p-4 text-center bg-card shadow-soft">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-foreground">Yield Prediction</p>
          </Card>
          <Card className="p-4 text-center bg-card shadow-soft">
            <div className="text-3xl mb-2">🛰️</div>
            <p className="text-sm font-medium text-foreground">Satellite Data</p>
          </Card>
          <Card className="p-4 text-center bg-card shadow-soft">
            <div className="text-3xl mb-2">💧</div>
            <p className="text-sm font-medium text-foreground">Vegetation Index</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
