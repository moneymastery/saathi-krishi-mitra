import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Globe, Bell, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  {
    section: "Personal",
    items: [
      { icon: User, label: "Edit Profile", description: "Name, phone, region" },
      { icon: Globe, label: "Language", description: "English, हिन्दी, ਪੰਜਾਬੀ" },
    ],
  },
  {
    section: "App Settings",
    items: [
      { icon: Bell, label: "Notifications", description: "Alerts & reminders" },
      { icon: Settings, label: "Preferences", description: "Theme, units" },
    ],
  },
  {
    section: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQs", description: "Get assistance" },
      { icon: Info, label: "About", description: "Version & credits" },
    ],
  },
];

export const ProfileView = () => {
  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-elevated">
            F
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Farmer Name</h1>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            <p className="text-sm text-muted-foreground">Punjab, India</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-card shadow-soft">
            <p className="text-2xl font-bold text-foreground mb-1">3</p>
            <p className="text-xs text-muted-foreground">Fields</p>
          </Card>
          <Card className="p-3 text-center bg-card shadow-soft">
            <p className="text-2xl font-bold text-foreground mb-1">12</p>
            <p className="text-xs text-muted-foreground">Scans</p>
          </Card>
          <Card className="p-3 text-center bg-card shadow-soft">
            <p className="text-2xl font-bold text-foreground mb-1">45</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </Card>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 space-y-6">
        {menuItems.map((section) => (
          <div key={section.section}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {section.section}
            </h2>
            <Card className="bg-card shadow-soft overflow-hidden">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                    idx !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-6 mt-6">
        <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/5">
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      {/* App Version */}
      <div className="px-6 mt-6 text-center">
        <p className="text-xs text-muted-foreground">Plant Saathi AI v1.0.0</p>
        <p className="text-xs text-muted-foreground">Powered by Lovable Cloud</p>
      </div>
    </div>
  );
};
