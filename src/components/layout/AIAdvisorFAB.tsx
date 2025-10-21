import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AIAdvisorChat } from "@/components/advisor/AIAdvisorChat";

export const AIAdvisorFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-elevated bg-gradient-accent hover:shadow-glow transition-all duration-300 hover:scale-110 z-40"
        size="icon"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>

      {isOpen && <AIAdvisorChat onClose={() => setIsOpen(false)} />}
    </>
  );
};
