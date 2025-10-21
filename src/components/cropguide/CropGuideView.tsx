import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";

const cropCategories = [
  { name: "🌾 Cereals", count: 8, color: "bg-primary/10 text-primary" },
  { name: "🫘 Pulses", count: 6, color: "bg-success/10 text-success" },
  { name: "🥕 Vegetables", count: 12, color: "bg-warning/10 text-warning" },
  { name: "🍎 Fruits", count: 10, color: "bg-destructive/10 text-destructive" },
  { name: "🌿 Cash Crops", count: 5, color: "bg-info/10 text-info" },
  { name: "🌻 Oilseeds", count: 4, color: "bg-accent/10 text-accent" },
];

const popularTopics = [
  { icon: "🌾", title: "Rice Cultivation", subtitle: "Complete guide" },
  { icon: "🍅", title: "Tomato Diseases", subtitle: "Prevention & cure" },
  { icon: "💰", title: "PM-KISAN Scheme", subtitle: "Government benefit" },
  { icon: "🧪", title: "Fertilizer Guide", subtitle: "NPK & more" },
];

export const CropGuideView = () => {
  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Grok Guide</h1>
            <p className="text-sm text-muted-foreground">Agricultural Knowledge Base</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search crops, diseases, practices..."
            className="pl-10 h-12 bg-card shadow-soft"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {cropCategories.map((category) => (
            <Card
              key={category.name}
              className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{category.name.split(" ")[0]}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                  {category.count}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {category.name.split(" ").slice(1).join(" ")}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Popular Topics</h2>
        <div className="space-y-3">
          {popularTopics.map((topic) => (
            <Card
              key={topic.title}
              className="p-4 bg-card shadow-soft hover:shadow-elevated transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5">{topic.title}</h3>
                  <p className="text-xs text-muted-foreground">{topic.subtitle}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
