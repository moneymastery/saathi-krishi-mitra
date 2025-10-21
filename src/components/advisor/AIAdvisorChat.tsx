import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAdvisorChatProps {
  onClose: () => void;
}

export const AIAdvisorChat = ({ onClose }: AIAdvisorChatProps) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Farm Advisor. How can I help you today? 🌾",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Placeholder response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI Advisor integration coming soon! I'll be powered by Lovable AI (Gemini 2.5 Flash) with full context awareness of your fields, diseases, and predictions.",
        },
      ]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-accent">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            🤖
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Advisor</h2>
            <p className="text-xs text-white/80">Powered by Gemini</p>
          </div>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-gradient-primary">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
