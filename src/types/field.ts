// Field data types for Soil Saathi

export interface FieldCoordinates {
  lat: number;
  lng: number;
}

export interface FieldGeometry {
  type: "Polygon";
  coordinates: number[][][]; // GeoJSON format
}

export interface VegetationIndices {
  ndvi: number;
  msavi: number;
  msavi2: number;
  ndre: number;
  ndmi: number;
  ndwi: number;
  rsm: number;
  rvi: number;
  soc_vis: number;
  status: "healthy" | "monitor" | "stress";
  
  // Optional NPK
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  npk_confidence?: number;
}

export interface FieldQuadrant {
  id: string;
  name: string;
  ndvi: number;
  status: "healthy" | "monitor" | "stress";
}

export interface AnalysisSnapshot {
  id: string;
  timestamp: string;
  health: VegetationIndices;
  quadrants: FieldQuadrant[];
  modelVersion: string;
  satelliteSource: string;
  cloudCover: number;
  confidence: number;
}

export interface FieldEvent {
  id: string;
  type: "created" | "analysis" | "edit" | "fertilizer" | "irrigation" | "harvest" | "note" | "photo";
  timestamp: string;
  userId: string;
  userName: string;
  description: string;
  metadata?: Record<string, any>;
  attachments?: string[]; // URLs to photos/documents
}

export interface EditAudit {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  field: string;
  oldValue: any;
  newValue: any;
  changes: Array<{
    field: string;
    before: any;
    after: any;
  }>;
}

export interface Field {
  id: string;
  userId: string;
  name: string;
  cropType: string;
  variety: string;
  area: number;
  sowingDate: string;
  expectedHarvestDate: string;
  irrigationMethod: string;
  wateringFrequency: string;
  soilType?: string;
  notes?: string;
  
  // Geometry
  coordinates: number[][];
  geometry: FieldGeometry;
  gpsTrace?: FieldCoordinates[]; // Raw GPS trace for audit
  locationAccuracy?: number;
  
  // Analysis
  currentHealth?: VegetationIndices;
  quadrants: FieldQuadrant[];
  lastAnalysis?: string; // ISO timestamp
  analysisHistory: AnalysisSnapshot[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  editCount: number;
  
  // Timeline
  events: FieldEvent[];
  editAudits: EditAudit[];
}

export interface GPSAccuracy {
  accuracy: number; // meters
  timestamp: string;
  status: "excellent" | "good" | "fair" | "poor";
}

export type MappingMethod = "walk" | "point-pin" | "draw" | "import" | "auto-location" | "center-radius";
