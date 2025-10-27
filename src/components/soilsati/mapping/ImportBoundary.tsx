import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileJson, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as turf from "@turf/turf";

interface ImportBoundaryProps {
  onComplete: (coordinates: [number, number][], area: number) => void;
}

export const ImportBoundary = ({ onComplete }: ImportBoundaryProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{
    coordinates: [number, number][];
    area: number;
    valid: boolean;
    error?: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    // Read and parse file
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        let parsedData: any;

        if (uploadedFile.name.endsWith('.geojson') || uploadedFile.name.endsWith('.json')) {
          parsedData = JSON.parse(content);
          processGeoJSON(parsedData);
        } else if (uploadedFile.name.endsWith('.kml')) {
          toast.error("KML parsing coming soon - please use GeoJSON or CSV");
        } else if (uploadedFile.name.endsWith('.csv')) {
          processCSV(content);
        } else {
          toast.error("Unsupported file format. Use GeoJSON, KML, or CSV");
        }
      } catch (error) {
        console.error("Parse error:", error);
        toast.error("Failed to parse file");
        setPreview({
          coordinates: [],
          area: 0,
          valid: false,
          error: "Invalid file format or corrupted data"
        });
      }
    };

    reader.readAsText(uploadedFile);
  };

  const processGeoJSON = (data: any) => {
    try {
      let geometry;

      // Handle different GeoJSON structures
      if (data.type === "Feature") {
        geometry = data.geometry;
      } else if (data.type === "FeatureCollection") {
        geometry = data.features[0]?.geometry;
      } else if (data.type === "Polygon") {
        geometry = data;
      } else {
        throw new Error("Unsupported GeoJSON type");
      }

      if (geometry.type !== "Polygon") {
        throw new Error("Only Polygon geometries are supported");
      }

      // Extract coordinates (GeoJSON is [lng, lat])
      const coords: [number, number][] = geometry.coordinates[0].map((c: number[]) => [c[1], c[0]]);
      
      // Remove last coordinate if it's a duplicate of the first (closing point)
      if (coords.length > 1 && 
          coords[0][0] === coords[coords.length - 1][0] && 
          coords[0][1] === coords[coords.length - 1][1]) {
        coords.pop();
      }

      // Calculate area
      const polygon = turf.polygon([[...coords.map(c => [c[1], c[0]]), [coords[0][1], coords[0][0]]]]);
      const areaInSqMeters = turf.area(polygon);
      const areaInHectares = areaInSqMeters / 10000;

      setPreview({
        coordinates: coords,
        area: areaInHectares,
        valid: true
      });

      toast.success(`GeoJSON loaded: ${coords.length} points, ${areaInHectares.toFixed(2)} ha`);
    } catch (error) {
      console.error("GeoJSON processing error:", error);
      setPreview({
        coordinates: [],
        area: 0,
        valid: false,
        error: error instanceof Error ? error.message : "Invalid GeoJSON structure"
      });
      toast.error("Invalid GeoJSON format");
    }
  };

  const processCSV = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      const coords: [number, number][] = [];

      // Skip header if present
      const startIdx = lines[0].toLowerCase().includes('lat') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim());
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            coords.push([lat, lng]);
          }
        }
      }

      if (coords.length < 3) {
        throw new Error("CSV must contain at least 3 coordinate pairs");
      }

      // Calculate area
      const polygon = turf.polygon([[...coords.map(c => [c[1], c[0]]), [coords[0][1], coords[0][0]]]]);
      const areaInSqMeters = turf.area(polygon);
      const areaInHectares = areaInSqMeters / 10000;

      setPreview({
        coordinates: coords,
        area: areaInHectares,
        valid: true
      });

      toast.success(`CSV loaded: ${coords.length} points, ${areaInHectares.toFixed(2)} ha`);
    } catch (error) {
      console.error("CSV processing error:", error);
      setPreview({
        coordinates: [],
        area: 0,
        valid: false,
        error: error instanceof Error ? error.message : "Invalid CSV format"
      });
      toast.error("Invalid CSV format");
    }
  };

  const handleConfirm = () => {
    if (!preview?.valid) {
      toast.error("Cannot confirm invalid boundary");
      return;
    }

    onComplete(preview.coordinates, preview.area);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-info-foreground">
          📁 <strong>Upload boundary file</strong> in GeoJSON, KML, or CSV format (lat,lng pairs).
        </p>
      </Card>

      {/* Upload Area */}
      {!file ? (
        <label htmlFor="file-upload">
          <Card className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="font-semibold mb-2">Click to upload boundary file</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports GeoJSON (.geojson, .json), KML (.kml), and CSV (.csv)
              </p>
              <div className="flex gap-4 justify-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileJson className="w-4 h-4" />
                  <span>GeoJSON</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>CSV</span>
                </div>
              </div>
            </div>
          </Card>
          <input
            id="file-upload"
            type="file"
            accept=".geojson,.json,.kml,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      ) : (
        <Card className="p-4 bg-card">
          <div className="flex items-start gap-3 mb-4">
            <FileJson className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              Change
            </Button>
          </div>

          {preview && (
            <div className={`p-3 rounded border-l-4 ${preview.valid ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
              {preview.valid ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-semibold text-sm">Valid Boundary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Points</p>
                      <p className="font-semibold">{preview.coordinates.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-semibold text-success">{preview.area.toFixed(2)} ha</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-semibold text-sm">Invalid File</span>
                  </div>
                  <p className="text-sm text-destructive">{preview.error}</p>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Preview Map Placeholder */}
      {preview?.valid && (
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20" style={{ height: "200px" }}>
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            📍 Map preview: {preview.coordinates.length} boundary points
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {preview?.valid && (
        <Button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-success to-success/80"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Boundary
        </Button>
      )}

      {/* Format Examples */}
      <Card className="p-4 bg-muted/30">
        <p className="text-xs font-semibold mb-2">Example CSV format:</p>
        <code className="text-xs block bg-background p-2 rounded">
          lat,lng<br />
          28.368717,77.540933<br />
          28.368989,77.540859<br />
          28.369041,77.541089
        </code>
      </Card>
    </div>
  );
};
