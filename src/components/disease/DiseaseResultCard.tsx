import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, CheckCircle, Info, Volume2, Download, Share2 } from "lucide-react";

interface DiseaseResult {
  disease_name: string;
  confidence: number;
  disease_stage: string;
  symptoms: string[];
  action_plan: string[];
  treatments: {
    organic: string[];
    chemical: string[];
    ipm: string[];
    cultural: string[];
  };
  recommended_videos: string[];
  faqs: Array<{ question: string; answer: string }>;
  tips: string[];
  yield_impact: string;
  spread_risk: string;
  recovery_chance: string;
  model_version: string;
}

interface DiseaseResultCardProps {
  result: DiseaseResult;
  imageUrl: string;
  onRetake: () => void;
  playAudio: (text: string) => void;
}

export const DiseaseResultCard = ({ result, imageUrl, onRetake, playAudio }: DiseaseResultCardProps) => {
  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return "bg-success text-success-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "high": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  const getRecoveryIcon = (chance: string) => {
    switch (chance.toLowerCase()) {
      case "excellent":
      case "good":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "fair":
        return <Info className="w-5 h-5 text-warning" />;
      case "poor":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <Card className="p-4 bg-card">
        <img 
          src={imageUrl} 
          alt="Disease detection" 
          className="w-full rounded-lg mb-4"
        />
      </Card>

      {/* Diagnosis Summary */}
      <Card className="p-4 bg-destructive/10">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl">🔬</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {result.disease_name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-primary text-primary-foreground">
                {(result.confidence * 100).toFixed(0)}% Confidence
              </Badge>
              <Badge variant="outline">
                Stage: {result.disease_stage}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => playAudio(`Disease detected: ${result.disease_name} with ${(result.confidence * 100).toFixed(0)}% confidence. Current stage is ${result.disease_stage}.`)}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Impact Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-background rounded">
            <p className="text-xs text-muted-foreground mb-1">Yield Impact</p>
            <Badge className={getImpactColor(result.yield_impact)}>
              {result.yield_impact}
            </Badge>
          </div>
          <div className="text-center p-2 bg-background rounded">
            <p className="text-xs text-muted-foreground mb-1">Spread Risk</p>
            <Badge className={getImpactColor(result.spread_risk)}>
              {result.spread_risk}
            </Badge>
          </div>
          <div className="text-center p-2 bg-background rounded">
            <p className="text-xs text-muted-foreground mb-1">Recovery</p>
            <div className="flex items-center justify-center gap-1">
              {getRecoveryIcon(result.recovery_chance)}
              <span className="text-xs font-semibold">{result.recovery_chance}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Symptoms */}
      <Card className="p-4 bg-card">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          🩺 Symptoms Detected
          <Button
            variant="ghost"
            size="icon"
            onClick={() => playAudio(`Symptoms include: ${result.symptoms.join(', ')}`)}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </h3>
        <ul className="space-y-2">
          {result.symptoms.map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{symptom}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Quick Action Plan */}
      <Card className="p-4 bg-info/10 border-info">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          ⚡ Immediate Action Plan
          <Button
            variant="ghost"
            size="icon"
            onClick={() => playAudio(`Action plan: ${result.action_plan.join('. ')}`)}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </h3>
        <ol className="space-y-2">
          {result.action_plan.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-sm text-foreground">{action}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Treatment Methods - Tabbed Interface */}
      <Card className="p-4 bg-card">
        <h3 className="font-semibold text-base mb-3">💊 Treatment Options</h3>
        <Tabs defaultValue="organic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organic">🌱 Organic</TabsTrigger>
            <TabsTrigger value="chemical">🧪 Chemical</TabsTrigger>
            <TabsTrigger value="ipm">🧫 IPM</TabsTrigger>
            <TabsTrigger value="cultural">🚜 Cultural</TabsTrigger>
          </TabsList>

          <TabsContent value="organic" className="space-y-2 mt-4">
            {result.treatments.organic.map((treatment, idx) => (
              <div key={idx} className="p-3 bg-success/10 rounded border border-success/20">
                <p className="text-sm text-foreground">{treatment}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="chemical" className="space-y-2 mt-4">
            <div className="p-2 bg-destructive/10 rounded border border-destructive/20 mb-3">
              <p className="text-xs text-destructive font-medium">
                ⚠️ Use chemical treatments only when necessary. Follow safety guidelines and Pre-Harvest Interval (PHI).
              </p>
            </div>
            {result.treatments.chemical.map((treatment, idx) => (
              <div key={idx} className="p-3 bg-muted/50 rounded">
                <p className="text-sm text-foreground">{treatment}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ipm" className="space-y-2 mt-4">
            {result.treatments.ipm.map((treatment, idx) => (
              <div key={idx} className="p-3 bg-info/10 rounded border border-info/20">
                <p className="text-sm text-foreground">{treatment}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="cultural" className="space-y-2 mt-4">
            {result.treatments.cultural.map((treatment, idx) => (
              <div key={idx} className="p-3 bg-primary/10 rounded border border-primary/20">
                <p className="text-sm text-foreground">{treatment}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-card">
        <h3 className="font-semibold text-base mb-3">💡 Prevention Tips</h3>
        <ul className="space-y-2">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* FAQs */}
      <Card className="p-4 bg-card">
        <h3 className="font-semibold text-base mb-3">❓ Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {result.faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-sm text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Recommended Videos */}
      {result.recommended_videos.length > 0 && (
        <Card className="p-4 bg-card">
          <h3 className="font-semibold text-base mb-3">🎥 Video Tutorials</h3>
          <div className="space-y-2">
            {result.recommended_videos.map((video, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(video)}`, '_blank')}
              >
                <span className="text-sm">{video}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onRetake}
        >
          📸 Scan Another Plant
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share via WhatsApp
          </Button>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Model: {result.model_version}</p>
        <p>Analysis completed on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};
