import { Field, FieldEvent, AnalysisSnapshot, VegetationIndices } from "@/types/field";

// Storage keys
const STORAGE_KEYS = {
  FIELDS: 'soilsaathi_fields',
  SNAPSHOTS: 'soilsaathi_snapshots',
  EVENTS: 'soilsaathi_events',
  PREFERENCES: 'soilsaathi_preferences',
} as const;

// User preferences
export interface UserPreferences {
  language: string;
  measurementUnit: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
}

// ==================== FIELDS ====================

export const saveField = (field: Field): void => {
  const fields = getAllFields();
  const existingIndex = fields.findIndex(f => f.id === field.id);
  
  if (existingIndex >= 0) {
    fields[existingIndex] = field;
  } else {
    fields.push(field);
  }
  
  localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
};

export const getAllFields = (): Field[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FIELDS);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing fields from storage:', error);
    return [];
  }
};

export const getFieldById = (fieldId: string): Field | null => {
  const fields = getAllFields();
  return fields.find(f => f.id === fieldId) || null;
};

export const deleteField = (fieldId: string): void => {
  const fields = getAllFields();
  const filtered = fields.filter(f => f.id !== fieldId);
  localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(filtered));
  
  // Also delete associated snapshots and events
  deleteAllSnapshotsForField(fieldId);
  deleteAllEventsForField(fieldId);
};

export const updateField = (fieldId: string, updates: Partial<Field>): void => {
  const field = getFieldById(fieldId);
  if (!field) return;
  
  const updatedField = { ...field, ...updates, updatedAt: new Date().toISOString() };
  saveField(updatedField);
};

// ==================== ANALYSIS SNAPSHOTS ====================

export const saveSnapshot = (fieldId: string, snapshot: AnalysisSnapshot): void => {
  const allSnapshots = getAllSnapshots();
  
  if (!allSnapshots[fieldId]) {
    allSnapshots[fieldId] = [];
  }
  
  allSnapshots[fieldId].push(snapshot);
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(allSnapshots));
  
  // Update field's currentHealth and lastAnalysis
  updateField(fieldId, {
    currentHealth: snapshot.health,
    lastAnalysis: snapshot.timestamp,
  });
};

export const getAllSnapshots = (): Record<string, AnalysisSnapshot[]> => {
  const data = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
  if (!data) return {};
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing snapshots from storage:', error);
    return {};
  }
};

export const getSnapshotsForField = (fieldId: string): AnalysisSnapshot[] => {
  const allSnapshots = getAllSnapshots();
  return allSnapshots[fieldId] || [];
};

export const getLatestSnapshot = (fieldId: string): AnalysisSnapshot | null => {
  const snapshots = getSnapshotsForField(fieldId);
  if (snapshots.length === 0) return null;
  
  return snapshots.reduce((latest, current) => 
    new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
  );
};

export const deleteAllSnapshotsForField = (fieldId: string): void => {
  const allSnapshots = getAllSnapshots();
  delete allSnapshots[fieldId];
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(allSnapshots));
};

// ==================== EVENTS ====================

export const saveEvent = (fieldId: string, event: FieldEvent): void => {
  const allEvents = getAllEvents();
  
  if (!allEvents[fieldId]) {
    allEvents[fieldId] = [];
  }
  
  allEvents[fieldId].push(event);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(allEvents));
};

export const getAllEvents = (): Record<string, FieldEvent[]> => {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!data) return {};
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing events from storage:', error);
    return {};
  }
};

export const getEventsForField = (fieldId: string): FieldEvent[] => {
  const allEvents = getAllEvents();
  return allEvents[fieldId] || [];
};

export const deleteAllEventsForField = (fieldId: string): void => {
  const allEvents = getAllEvents();
  delete allEvents[fieldId];
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(allEvents));
};

// ==================== PREFERENCES ====================

export const savePreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
};

export const getPreferences = (): UserPreferences => {
  const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (!data) {
    return {
      language: 'en',
      measurementUnit: 'metric',
      theme: 'auto',
    };
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing preferences from storage:', error);
    return {
      language: 'en',
      measurementUnit: 'metric',
      theme: 'auto',
    };
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const generateId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const exportAllData = (): string => {
  return JSON.stringify({
    fields: getAllFields(),
    snapshots: getAllSnapshots(),
    events: getAllEvents(),
    preferences: getPreferences(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
};

export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.fields) {
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(data.fields));
    }
    if (data.snapshots) {
      localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(data.snapshots));
    }
    if (data.events) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
    }
    if (data.preferences) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
