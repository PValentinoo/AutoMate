import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "email" | "test" | "manual" | "idea";
  onClick: () => void;
}

const colorClasses = {
  email: "bg-workflow-email/10 text-workflow-email border-workflow-email/20",
  test: "bg-workflow-test/10 text-workflow-test border-workflow-test/20", 
  manual: "bg-workflow-manual/10 text-workflow-manual border-workflow-manual/20",
  idea: "bg-workflow-idea/10 text-workflow-idea border-workflow-idea/20",
};

export function WorkflowCard({ title, description, icon: Icon, color, onClick }: WorkflowCardProps) {
  return (
    <Card 
      className="workflow-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-xs">
            {description}
          </p>
        </div>

        <div className="w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Card>
  );
}