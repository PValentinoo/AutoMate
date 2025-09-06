import { Mail, TestTube, BookOpen, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkflowCard } from "@/components/WorkflowCard";
import { DeveloperButton } from "@/components/DeveloperButton";
import { AnimatedElement } from "@/components/AnimatedElement";
import { WavyBackground } from "@/components/ui/wavy-background";

const Index = () => {
  const navigate = useNavigate();

  const workflows = [
    {
      title: "Email Assistent",
      description: "Strømlin emailbehandling med intelligent automatisering og smart kategorisering",
      icon: Mail,
      color: "email" as const,
      path: "/workflow/email"
    },
    {
      title: "JET Test Assistent", 
      description: "Automatiserede testworkflows for kvalitetssikring og performancevalidering",
      icon: TestTube,
      color: "test" as const,
      path: "/workflow/test"
    },
    {
      title: "Revisor-håndbog Assistent",
      description: "Manuel gennemgangsprocesser og håndbogsstyring med guidede workflows",
      icon: BookOpen,
      color: "manual" as const,
      path: "/workflow/manual"
    },
    {
      title: "Idé kassen",
      description: "Har du en idé? Lad mig endelig høre!",
      icon: Lightbulb,
      color: "idea" as const,
      path: "/workflow/idea"
    }
  ];

  return (
    <WavyBackground 
      backgroundFill="transparent"
      waveOpacity={1}
      speed="slow"
      blur={7}
      className="min-h-screen"
    >
      <DeveloperButton onClick={() => navigate('/developer/login')} />
      
      <div className="container mx-auto px-6 py-16">
        <AnimatedElement animation="fade-in">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Auto<span className="italic">Mate</span>
            </h1>
            <p className="text-2xl italic text-muted-foreground/80 mb-6">
              Portal for automatiske løsninger
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Få adgang til automatiserede agenter, som kan hjælpe dig med hverdagens opgaver
            </p>
          </div>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workflows.map((workflow, index) => (
            <AnimatedElement 
              key={workflow.title}
              animation="slide-up"
              delay={index * 150}
            >
              <WorkflowCard
                title={workflow.title}
                description={workflow.description}
                icon={workflow.icon}
                color={workflow.color}
                onClick={() => navigate(workflow.path)}
              />
            </AnimatedElement>
          ))}
        </div>

        <AnimatedElement animation="fade-in" delay={600}>
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground">
              Har du brug for hjælp? Kontakt XXX
            </p>
          </div>
        </AnimatedElement>
      </div>
    </WavyBackground>
  );
};

export default Index;
