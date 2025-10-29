import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Edit, Droplet, Sprout, TrendingUp, Camera, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldEvent } from "@/types/field";
import { toast } from "sonner";

interface FieldTimelineProps {
  fieldId: string;
  events: FieldEvent[];
  onAddEvent: (event: Omit<FieldEvent, "id">) => void;
}

export const FieldTimeline = ({ fieldId, events, onAddEvent }: FieldTimelineProps) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventType, setNewEventType] = useState<FieldEvent["type"]>("note");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const getEventIcon = (type: FieldEvent["type"]) => {
    switch (type) {
      case "created": return <Sprout className="w-5 h-5 text-success" />;
      case "analysis": return <TrendingUp className="w-5 h-5 text-primary" />;
      case "edit": return <Edit className="w-5 h-5 text-warning" />;
      case "fertilizer": return <Droplet className="w-5 h-5 text-info" />;
      case "irrigation": return <Droplet className="w-5 h-5 text-blue-500" />;
      case "harvest": return <Calendar className="w-5 h-5 text-success" />;
      case "note": return <FileText className="w-5 h-5 text-muted-foreground" />;
      case "photo": return <Camera className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: FieldEvent["type"]) => {
    switch (type) {
      case "created": return "border-success bg-success/5";
      case "analysis": return "border-primary bg-primary/5";
      case "edit": return "border-warning bg-warning/5";
      case "fertilizer": return "border-info bg-info/5";
      case "irrigation": return "border-blue-500 bg-blue-500/5";
      case "harvest": return "border-success bg-success/5";
      case "note": return "border-muted bg-muted/5";
      case "photo": return "border-purple-500 bg-purple-500/5";
      default: return "border-muted bg-muted/5";
    }
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleAddEvent = () => {
    if (!newEventDescription.trim()) {
      toast.error("Please enter a description");
      return;
    }

    onAddEvent({
      type: newEventType,
      timestamp: new Date().toISOString(),
      userId: "local_user",
      userName: "You",
      description: newEventDescription,
      metadata: {},
    });

    setNewEventDescription("");
    setIsAddingEvent(false);
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Add Event Button */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Timeline Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Event Type</Label>
              <Select value={newEventType} onValueChange={(value) => setNewEventType(value as FieldEvent["type"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fertilizer">💧 Fertilizer Applied</SelectItem>
                  <SelectItem value="irrigation">🌊 Irrigation</SelectItem>
                  <SelectItem value="note">📝 Note</SelectItem>
                  <SelectItem value="photo">📸 Photo Added</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="What happened? (e.g., 'Applied 20kg NPK fertilizer')"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex-1">
                Add Event
              </Button>
              <Button variant="outline" onClick={() => setIsAddingEvent(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeline Feed */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Events */}
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const isExpanded = expandedEvents.has(event.id);
            const hasDetails = event.metadata && Object.keys(event.metadata).length > 0;

            return (
              <div key={event.id} className="relative pl-14">
                {/* Icon */}
                <div className="absolute left-3 top-3 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>

                {/* Event Card */}
                <Card className={`p-4 border-l-4 ${getEventColor(event.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {event.userName}
                      </p>
                    </div>

                    {hasDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEventExpansion(event.id)}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && event.metadata && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Attachments */}
                  {event.attachments && event.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Attachments:</p>
                      <div className="flex gap-2 flex-wrap">
                        {event.attachments.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Attachment ${idx + 1}`}
                            className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>

        {sortedEvents.length === 0 && (
          <Card className="p-8 text-center bg-muted/20">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No events yet. Add your first event to start tracking field activities.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
