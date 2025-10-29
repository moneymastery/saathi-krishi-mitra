import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiseaseResultCard } from "./DiseaseResultCard";
import { saveDiseasesScan, generateId } from "@/lib/storage";
import { toast } from "sonner";

export const DiseaseDetectionView = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

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

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      const result = {
        disease_name: "Early Blight",
        confidence: 0.95,
        disease_stage: "Moderate",
        symptoms: [
          "Dark spots on leaves with concentric rings",
          "Yellowing around the spots",
          "Lower leaves affected first",
          "Brown lesions spreading upward"
        ],
        action_plan: [
          "Remove all affected leaves immediately",
          "Apply fungicide within 24 hours",
          "Improve air circulation around plants",
          "Water at soil level only - avoid wetting leaves"
        ],
        treatments: {
          organic: [
            "Neem oil spray (5ml per liter) - Apply every 5-7 days",
            "Copper fungicide (2g per liter) - Apply twice weekly",
            "Bacillus subtilis biofungicide - Weekly application",
            "Garlic extract spray - Natural antifungal"
          ],
          chemical: [
            "Chlorothalonil 75% WP - 2g/L water, spray every 10 days",
            "Mancozeb 75% WP - 2.5g/L water, alternate with Chlorothalonil",
            "Azoxystrobin 23% SC - 1ml/L water for severe infections",
            "⚠️ PHI: 7-14 days before harvest"
          ],
          ipm: [
            "Crop rotation - Avoid tomatoes/potatoes for 3 years",
            "Plant resistant varieties like 'Mountain Fresh Plus'",
            "Maintain 60cm spacing between plants",
            "Use certified disease-free seeds",
            "Mulch with straw to prevent soil splash"
          ],
          cultural: [
            "Proper spacing (60cm between plants) for air circulation",
            "Stake plants to keep foliage off ground",
            "Water in morning at soil level only",
            "Remove crop debris after harvest",
            "Avoid working in wet fields"
          ]
        },
        recommended_videos: [
          "tomato early blight treatment organic",
          "how to prevent early blight in tomatoes",
          "copper fungicide application guide"
        ],
        faqs: [
          {
            question: "What causes Early Blight?",
            answer: "Early Blight is caused by the fungus Alternaria solani. It thrives in warm, humid conditions (24-29°C with high moisture). Spread through water splash, wind, and contaminated tools."
          },
          {
            question: "Can I eat tomatoes from infected plants?",
            answer: "Yes, tomatoes from infected plants are safe to eat if the fruit itself is not affected. Wash thoroughly before consumption. If fruit shows lesions, discard it."
          },
          {
            question: "How to prevent future outbreaks?",
            answer: "Use crop rotation (3-year cycle), plant resistant varieties, maintain proper spacing, water at soil level, apply mulch, and remove plant debris after harvest."
          },
          {
            question: "Is it contagious to other crops?",
            answer: "Early Blight affects tomatoes, potatoes, eggplants, and peppers. It can spread to nearby plants through water splash and wind. Isolate affected plants if possible."
          }
        ],
        tips: [
          "Water at soil level in the morning - never wet the leaves",
          "Apply 3-4 inch mulch layer to prevent soil splash",
          "Maintain plant spacing of 60cm for good air circulation",
          "Remove lower leaves touching the ground",
          "Disinfect pruning tools with 10% bleach solution",
          "Avoid overhead irrigation systems"
        ],
        yield_impact: "Medium",
        spread_risk: "High",
        recovery_chance: "Good",
        model_version: "gemini-1.5-flash"
      };
      
      setDiagnosisResult(result);
      
      // Save to localStorage
      saveDiseasesScan({
        id: generateId(),
        timestamp: new Date().toISOString(),
        imageUrl: selectedImage!,
        result
      });
      
      toast.success("Disease scan saved to history");
      setIsAnalyzing(false);
    }, 2000);
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setDiagnosisResult(null);
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
        ) : !diagnosisResult ? (
          <div className="space-y-4">
            <Card className="p-4 bg-card">
              <img 
                src={selectedImage} 
                alt="Captured plant" 
                className="w-full rounded-lg mb-4"
              />
              <div className="space-y-2">
                <Button 
                  className="w-full bg-gradient-to-r from-destructive to-destructive/80"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Disease"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedImage(null)}
                  disabled={isAnalyzing}
                >
                  Retake Photo
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <DiseaseResultCard
            result={diagnosisResult}
            imageUrl={selectedImage}
            onRetake={handleRetake}
            playAudio={playAudio}
          />
        )}
      </div>
    </div>
  );
};
