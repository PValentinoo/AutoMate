import { useState } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function DeveloperLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<"udvikler" | "medarbejder">("medarbejder");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      const isValidCredentials = 
        (loginMode === "udvikler" && credentials.username === "developer" && credentials.password === "workflow123") ||
        (loginMode === "medarbejder" && credentials.username === "medarbejder" && credentials.password === "medarbejder123");

      if (isValidCredentials) {
        // Store user data in context
        login({
          userId: credentials.username,
          userName: credentials.username,
          userEmail: `${credentials.username}@automate.local`,
        });

        toast({
          title: "Login lykkedes",
          description: loginMode === "udvikler" ? "Velkommen til udvikler dashboardet" : "Velkommen til AutoMate portal",
        });
        navigate(loginMode === "udvikler" ? '/developer/dashboard' : '/');
      } else {
        const demoCredentials = loginMode === "udvikler" ? "developer / workflow123" : "medarbejder / medarbejder123";
        toast({
          title: "Login fejlede",
          description: `Ugyldige legitimationsoplysninger. Prøv: ${demoCredentials}`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
      <div className="container mx-auto px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 hover:bg-secondary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbage til Portal
        </Button>

        <Card className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-muted-foreground mt-2">
              Log ind som {loginMode === "udvikler" ? "udvikler" : "medarbejder"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Brugernavn</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Indtast brugernavn"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Adgangskode</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Indtast adgangskode"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logger ind..." : "Log Ind"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setLoginMode(loginMode === "udvikler" ? "medarbejder" : "udvikler")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
            >
              {loginMode === "medarbejder" ? "Log ind som udvikler" : "Log ind som medarbejder"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Demo legitimationsoplysninger: {loginMode === "udvikler" ? "developer / workflow123" : "medarbejder / medarbejder123"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}