import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Sprout } from "lucide-react";
import { toast } from "sonner";

interface FieldDetailsFormProps {
  coordinates: [number, number][];
  area: number;
  onSave: (fieldData: any) => void;
  onBack: () => void;
}

const cropTypes = [
  "Rice",
  "Wheat",
  "Maize",
  "Tomato",
  "Potato",
  "Onion",
  "Cotton",
  "Sugarcane",
  "Soybean",
  "Chickpea",
  "Lentil",
  "Mango",
  "Banana",
  "Other",
];

export const FieldDetailsForm = ({ coordinates, area, onSave, onBack }: FieldDetailsFormProps) => {
  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [variety, setVariety] = useState("");
  const [sowingDate, setSowingDate] = useState("");

  const handleSave = () => {
    if (!fieldName.trim()) {
      toast.error("Please enter a field name");
      return;
    }
    if (!cropType) {
      toast.error("Please select a crop type");
      return;
    }
    if (!sowingDate) {
      toast.error("Please select a sowing date");
      return;
    }

    const fieldData = {
      name: fieldName,
      cropType,
      variety: variety || "Not specified",
      sowingDate,
      coordinates,
      area,
    };

    onSave(fieldData);
    toast.success("Field saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-gradient-primary text-white">
        <Button onClick={onBack} variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mapping
        </Button>
        <h1 className="text-2xl font-bold mb-1">Field Details</h1>
        <p className="text-sm opacity-90">Complete your field information</p>
      </header>

      {/* Form */}
      <div className="px-6 py-6 space-y-4">
        {/* Summary Card */}
        <Card className="p-4 bg-card shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Boundary Mapped Successfully!</p>
              <p className="text-xs text-muted-foreground">
                Area: {area.toFixed(3)} hectares ({(area * 2.471).toFixed(2)} acres)
              </p>
            </div>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground">
              {coordinates.length - 1} boundary points recorded
            </p>
          </div>
        </Card>

        {/* Field Information */}
        <Card className="p-4 bg-card shadow-soft space-y-4">
          <div>
            <Label htmlFor="fieldName" className="text-sm font-medium text-foreground mb-2 block">
              Field Name *
            </Label>
            <Input
              id="fieldName"
              placeholder="e.g., North Field, Field 1"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <Label htmlFor="cropType" className="text-sm font-medium text-foreground mb-2 block">
              Crop Type *
            </Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="variety" className="text-sm font-medium text-foreground mb-2 block">
              Variety Name (Optional)
            </Label>
            <Input
              id="variety"
              placeholder="e.g., IR-64, Pusa Basmati"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the specific variety if known
            </p>
          </div>

          <div>
            <Label htmlFor="sowingDate" className="text-sm font-medium text-foreground mb-2 block">
              Sowing Date *
            </Label>
            <Input
              id="sowingDate"
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="h-11"
              max={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-muted-foreground mt-1">
              When was the crop planted?
            </p>
          </div>
        </Card>

        {/* Coordinates Info */}
        <Card className="p-3 bg-info/5 border-info/20">
          <p className="text-xs text-info font-medium mb-1">📍 Field Coordinates</p>
          <p className="text-xs text-muted-foreground">
            Center: {((coordinates[0][1] + coordinates[Math.floor(coordinates.length / 2)][1]) / 2).toFixed(6)},{" "}
            {((coordinates[0][0] + coordinates[Math.floor(coordinates.length / 2)][0]) / 2).toFixed(6)}
          </p>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full h-12 bg-gradient-primary">
          <Save className="w-5 h-5 mr-2" />
          Save Field & Analyze
        </Button>

        {/* Info */}
        <Card className="p-3 bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            After saving, we'll fetch satellite data and calculate vegetation indices for your field
          </p>
        </Card>
      </div>
    </div>
  );
};
