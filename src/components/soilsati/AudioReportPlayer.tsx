import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Download, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Field } from "@/types/field";
import { toast } from "sonner";

interface AudioReportPlayerProps {
  field: Field;
}

export const AudioReportPlayer = ({ field }: AudioReportPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState("en");
  const [reportLength, setReportLength] = useState<"short" | "medium" | "long">("medium");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  const generateReportText = (length: "short" | "medium" | "long"): string => {
    const baseText = `Field report for ${field.name}. Growing ${field.cropType}, variety ${field.variety}. Total area: ${field.area} hectares. Sown on ${new Date(field.sowingDate).toLocaleDateString()}.`;
    
    if (length === "short") {
      return `${baseText} Current health status: ${field.currentHealth?.status || 'Unknown'}. NDVI reading: ${field.currentHealth?.ndvi.toFixed(2) || 'Not available'}.`;
    }

    const mediumText = `${baseText} Current health status: ${field.currentHealth?.status || 'Unknown'}. Vegetation indices: NDVI ${field.currentHealth?.ndvi.toFixed(2) || 'N/A'}, NDRE ${field.currentHealth?.ndre.toFixed(2) || 'N/A'}, NDMI ${field.currentHealth?.ndmi.toFixed(2) || 'N/A'}. ${field.currentHealth?.nitrogen ? `Estimated nitrogen: ${field.currentHealth.nitrogen.toFixed(1)} percent.` : ''}`;

    if (length === "medium") {
      return mediumText;
    }

    // Long report
    return `${mediumText} Soil moisture index: ${field.currentHealth?.rsm.toFixed(2) || 'N/A'}. Water content: ${field.currentHealth?.ndwi.toFixed(2) || 'N/A'}. Organic carbon: ${field.currentHealth?.soc_vis.toFixed(2) || 'N/A'}. Field is divided into 4 quadrants for detailed monitoring. ${field.quadrants.map(q => `${q.name} quadrant shows ${q.status} status with NDVI of ${q.ndvi.toFixed(2)}.`).join(' ')} Last analysis was performed on ${field.lastAnalysis ? new Date(field.lastAnalysis).toLocaleDateString() : 'unknown date'}. Irrigation method: ${field.irrigationMethod}. Watering frequency: ${field.wateringFrequency}.`;
  };

  const playAudio = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const text = generateReportText(reportLength);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : "hi-IN";
    utterance.volume = isMuted ? 0 : volume;
    utterance.rate = 0.9;

    utterance.onstart = () => {
      setIsPlaying(true);
      // Estimate duration (rough approximation: ~150 words per minute)
      const words = text.split(' ').length;
      const estimatedDuration = (words / 150) * 60;
      setDuration(estimatedDuration);

      // Update progress
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= estimatedDuration) {
            stopAudio();
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    };

    utterance.onend = () => {
      stopAudio();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      toast.error("Audio playback failed");
      stopAudio();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    window.speechSynthesis.cancel();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (utteranceRef.current && window.speechSynthesis.speaking) {
      // Note: Web Speech API doesn't allow real-time volume changes
      // Would need to restart with new volume
      toast.info("Volume will apply to next playback");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const downloadAudio = () => {
    // TODO: Implement server-side MP3 generation
    toast.info("MP3 download coming soon - will generate high-quality audio file");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Audio Player Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Volume2 className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Audio Field Report</h3>
            <p className="text-sm text-muted-foreground">
              {reportLength === "short" ? "30-60 second" : reportLength === "medium" ? "2-4 minute" : "Full"} summary
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            className="mb-2"
            disabled
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            size="lg"
            onClick={togglePlayPause}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Play Report
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={downloadAudio}
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Report Length</label>
            <Select value={reportLength} onValueChange={(v) => setReportLength(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (30-60s)</SelectItem>
                <SelectItem value="medium">Medium (2-4m)</SelectItem>
                <SelectItem value="long">Long (Full)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Transcript */}
      <Card className="p-4 bg-card">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          📝 Transcript
        </h4>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {generateReportText(reportLength).split('. ').map((sentence, idx) => (
            <p key={idx} className="mb-2">
              <span className={currentTime > 0 && isPlaying ? "text-foreground font-medium" : ""}>
                {sentence}.
              </span>
            </p>
          ))}
        </div>
      </Card>

      {/* Info */}
      <Card className="p-3 bg-info/10 border-info">
        <p className="text-xs text-info-foreground">
          💡 <strong>Tip:</strong> Audio reports use device text-to-speech. For high-quality MP3 downloads with professional voice, use the download button (coming soon).
        </p>
      </Card>
    </div>
  );
};
