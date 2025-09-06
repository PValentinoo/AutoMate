import { Mail, TestTube, BookOpen, Lightbulb, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import { WorkflowCard } from "@/components/WorkflowCard";
import { DeveloperButton } from "@/components/DeveloperButton";
import { AnimatedElement } from "@/components/AnimatedElement";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter workflows based on search query
  const filteredWorkflows = useMemo(() => {
    if (!debouncedQuery.trim()) return workflows;
    
    return workflows.filter(workflow => 
      workflow.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const content = (
    <>
      <DeveloperButton onClick={() => navigate('/developer/login')} />
      
      <div className="container mx-auto px-6 py-16">
        <AnimatedElement animation="fade-in">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Auto<span className="italic">Mate</span>
            </h1>
            <p className="text-2xl italic text-muted-foreground/80 mb-6">
              Portal for automatiske løsninger
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Her kan du tilgå automatiserede agenter, som kan hjælpe dig med hverdagens opgaver
            </p>
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-in" delay={300}>
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              {isLoading ? (
                <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              )}
              <Input
                type="text"
                placeholder="Søg efter assistenter..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-3 text-base border-2 border-primary/20 focus:border-primary/50 transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
          </div>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow, index) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                Ingen workflows fundet for "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Prøv at søge efter et andet ord eller sætning
              </p>
            </div>
          )}
        </div>

        <AnimatedElement animation="fade-in" delay={600}>
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground">
              Har du brug for hjælp? Kontakt XXX
            </p>
          </div>
        </AnimatedElement>
      </div>
    </>
  );

  return (
    <WavyBackground 
      backgroundFill="transparent"
      waveOpacity={1}
      speed="slow"
      blur={8}
      className="min-h-screen"
    >
      {content}
    </WavyBackground>
  );
};

export default Index;
