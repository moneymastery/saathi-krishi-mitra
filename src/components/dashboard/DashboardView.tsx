import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, BarChart3, Bot, Sprout, TrendingUp, Activity, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Hello, Farmer 👋
        </h1>
        <p className="text-muted-foreground">Your Farm Intelligence Today</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-medium text-success">+5%</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">0.75</p>
            <p className="text-xs text-muted-foreground">Field Health (NDVI)</p>
          </Card>

          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">3</p>
            <p className="text-xs text-muted-foreground">Active Fields</p>
          </Card>

          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">1</p>
            <p className="text-xs text-muted-foreground">Active Alerts</p>
          </Card>

          <Card className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs font-medium text-success">80%</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">5.2</p>
            <p className="text-xs text-muted-foreground">Yield (tons/ha)</p>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/soilsati")}
            className="w-full h-auto py-4 bg-gradient-primary hover:shadow-glow transition-all justify-start"
          >
            <Camera className="w-6 h-6 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Scan Plant Disease</p>
              <p className="text-xs opacity-90">Detect and diagnose issues</p>
            </div>
          </Button>

          <Button 
            onClick={() => navigate("/soilsati")}
            variant="outline"
            className="w-full h-auto py-4 justify-start border-primary/20 hover:bg-primary/5"
          >
            <MapPin className="w-6 h-6 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Map New Field</p>
              <p className="text-xs text-muted-foreground">Add field boundary</p>
            </div>
          </Button>

          <Button 
            onClick={() => navigate("/soilsati")}
            variant="outline"
            className="w-full h-auto py-4 justify-start border-primary/20 hover:bg-primary/5"
          >
            <BarChart3 className="w-6 h-6 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Check Field Health</p>
              <p className="text-xs text-muted-foreground">View vegetation indices</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <Card className="p-4 bg-card shadow-soft space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Field 1 NDVI updated - 0.68</p>
              <p className="text-xs text-muted-foreground">Healthy • 2h ago</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Early Blight detected</p>
              <p className="text-xs text-muted-foreground">Treatment recommended • 5h ago</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Yield prediction completed</p>
              <p className="text-xs text-muted-foreground">5.2 tons/ha expected • 1d ago</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Modules</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            onClick={() => navigate("/soilsati")}
            className="p-6 bg-gradient-primary text-white shadow-elevated hover:shadow-glow transition-all cursor-pointer"
          >
            <Sprout className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">SoilSati</h3>
            <p className="text-xs opacity-90">Field Intelligence</p>
          </Card>

          <Card 
            onClick={() => navigate("/guide")}
            className="p-6 bg-card shadow-soft hover:shadow-elevated transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold mb-1 text-foreground">Grok Guide</h3>
            <p className="text-xs text-muted-foreground">Learn & Grow</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
