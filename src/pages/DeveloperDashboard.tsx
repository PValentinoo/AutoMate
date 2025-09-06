import { useState } from "react";
import { ArrowLeft, Plus, Settings, BarChart3, Users, Workflow, Mail, TestTube, BookOpen, Calculator, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [activeWorkflows] = useState([
    { 
      name: "Email Assistent", 
      description: "Organiser dine emails, eller få hjælp med at svare på emails i din personlige stemme",
      status: "Aktiv", 
      users: 12, 
      lastUsed: "2 timer siden",
      icon: Mail,
      color: "email"
    },
    { 
      name: "JET Test Assistent", 
      description: "Få hjælp med at udføre en JET test med denne agent",
      status: "Aktiv", 
      users: 8, 
      lastUsed: "1 dag siden",
      icon: TestTube,
      color: "test"
    },
    { 
      name: "Revisor-håndbog Assistent", 
      description: "Få svar på revisionsfaglige spørgsmål med denne agent",
      status: "Aktiv", 
      users: 5, 
      lastUsed: "3 timer siden",
      icon: BookOpen,
      color: "manual"
    },
    { 
      name: "Economic Assistent", 
      description: "Hent specifikke udtræk fra Economic med denne agent",
      status: "Aktiv", 
      users: 3, 
      lastUsed: "5 timer siden",
      icon: Calculator,
      color: "economics"
    },
    { 
      name: "Idé kassen", 
      description: "Har du en idé? Lad mig endelig høre!",
      status: "Aktiv", 
      users: 15, 
      lastUsed: "1 time siden",
      icon: Lightbulb,
      color: "idea"
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hover:bg-secondary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage til Portal
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Udvikler Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Administrer workflows og assistenter</p>
            </div>
          </div>
          
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Ny Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-muted-foreground text-sm">Aktive Workflows</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-workflow-email/10 text-workflow-email rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">43</p>
                <p className="text-muted-foreground text-sm">Samlede Brugere</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-workflow-test/10 text-workflow-test rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-muted-foreground text-sm">Opgaver Afsluttet</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analyser</TabsTrigger>
            <TabsTrigger value="settings">Indstillinger</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Aktive Workflows</h3>
              <div className="space-y-4">
                {activeWorkflows.map((workflow, index) => (
                  <div key={index} className="flex items-start justify-between p-6 border border-border rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${workflow.color === 'email' ? 'bg-workflow-email/10 text-workflow-email border-workflow-email/20' : 
                        workflow.color === 'test' ? 'bg-workflow-test/10 text-workflow-test border-workflow-test/20' :
                        workflow.color === 'manual' ? 'bg-workflow-manual/10 text-workflow-manual border-workflow-manual/20' :
                        workflow.color === 'economics' ? 'bg-workflow-economics/10 text-workflow-economics border-workflow-economics/20' :
                        'bg-workflow-idea/10 text-workflow-idea border-workflow-idea/20'}`}>
                        <workflow.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{workflow.name}</h4>
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                          {workflow.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{workflow.users} aktive brugere</span>
                          <span>•</span>
                          <span>Sidst brugt {workflow.lastUsed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400 font-medium">
                        {workflow.status}
                      </span>
                      <Button variant="ghost" size="sm" className="hover:bg-secondary/80">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Brugsanalyser</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analyse dashboard kommer snart</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Systemindstillinger</h3>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Indstillingspanel kommer snart</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground">
            © 2025 Udviklet af Philip Valentin Christiansen
          </p>
        </div>
      </div>
    </div>
  );
}