import { useState } from "react";
import { ArrowLeft, Plus, Settings, BarChart3, Users, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [activeWorkflows] = useState([
    { name: "Email Assistent", status: "Aktiv", users: 12, lastUsed: "2 timer siden" },
    { name: "JET Test Assistent", status: "Aktiv", users: 8, lastUsed: "1 dag siden" },
    { name: "Revisor-håndbog Assistent", status: "Aktiv", users: 5, lastUsed: "3 timer siden" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-8">
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
              <h1 className="text-3xl font-bold">Udvikler Dashboard</h1>
              <p className="text-muted-foreground">Administrer workflows og assistenter</p>
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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">25</p>
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
                <p className="text-2xl font-bold">847</p>
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
              <h3 className="text-lg font-semibold mb-4">Aktive Workflows</h3>
              <div className="space-y-4">
                {activeWorkflows.map((workflow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workflow.users} aktive brugere • Sidst brugt {workflow.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">
                        {workflow.status}
                      </span>
                      <Button variant="ghost" size="sm">
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
      </div>
    </div>
  );
}