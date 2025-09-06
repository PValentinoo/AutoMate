import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const workflowDetails = {
  email: {
    title: "Email Assistent", 
    description: "Automatiseret emailbehandling og administrationsworkflows",
    color: "bg-workflow-email/10 text-workflow-email border-workflow-email/20"
  },
  test: {
    title: "JET Test Assistent",
    description: "Automatiserede testworkflows og kvalitetssikringsprocesser", 
    color: "bg-workflow-test/10 text-workflow-test border-workflow-test/20"
  },
  manual: {
    title: "Revisor-håndbog Assistent",
    description: "Manuel gennemgangs- og håndbogsstyringsworkflows",
    color: "bg-workflow-manual/10 text-workflow-manual border-workflow-manual/20"
  },
  economics: {
    title: "Economic Assistent",
    description: "Hent udtræk fra Economic med denne agent",
    color: "bg-workflow-economics/10 text-workflow-economics border-workflow-economics/20"
  },
  idea: {
    title: "Idé kassen",
    description: "Har du en idé til en nyt workflow eller feedback på et eksisterende? Lad mig endelig høre!",
    color: "bg-workflow-idea/10 text-workflow-idea border-workflow-idea/20"
  }
};

export default function WorkflowPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  
  const workflow = workflowDetails[type as keyof typeof workflowDetails];
  
  if (!workflow) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="hover:bg-secondary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbage til Portal
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 ${workflow.color}`}>
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{workflow.title}</h1>
                <p className="text-muted-foreground mt-2">{workflow.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Assistent Interface</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Denne workflow assistent bliver konfigureret i øjeblikket. Det interaktive interface vil være tilgængeligt snart.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Integration med assistent logik afventer udvikler konfiguration.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}