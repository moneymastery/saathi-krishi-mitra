import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DiseaseDetectionView = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <header className="px-6 pt-8 pb-4 bg-gradient-to-r from-destructive to-destructive/80 text-white">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-1">🔬 Disease Detection</h1>
        <p className="text-sm opacity-90">Scan your crops for diseases</p>
      </header>

      <div className="px-6 py-6">
        {!selectedImage ? (
          <Card className="p-8 text-center bg-card">
            <Camera className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Capture Plant Image</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Take a clear photo of affected leaves, stems, or fruits
            </p>

            <div className="space-y-3">
              <label htmlFor="camera-input">
                <Button className="w-full bg-gradient-to-r from-destructive to-destructive/80">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageCapture}
                />
              </label>

              <label htmlFor="upload-input">
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Gallery
                </Button>
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageCapture}
                />
              </label>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded">
              <h3 className="font-medium text-sm mb-2">📸 Tips for best results:</h3>
              <ul className="text-xs text-muted-foreground space-y-1 text-left">
                <li>• Ensure good lighting (natural daylight is best)</li>
                <li>• Capture the affected area clearly</li>
                <li>• Hold camera steady for sharp image</li>
                <li>• Include the entire leaf/fruit if possible</li>
              </ul>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 bg-card">
              <img 
                src={selectedImage} 
                alt="Captured plant" 
                className="w-full rounded-lg mb-4"
              />
              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-destructive to-destructive/80">
                  Analyze Disease
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedImage(null)}
                >
                  Retake Photo
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
