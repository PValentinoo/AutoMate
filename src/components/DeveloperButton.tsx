import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeveloperButtonProps {
  onClick: () => void;
}

export function DeveloperButton({ onClick }: DeveloperButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed top-6 right-6 z-50 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-secondary/80 transition-all duration-300"
      onClick={onClick}
    >
      <Settings className="w-4 h-4 mr-2" />
      Udvikler
    </Button>
  );
}