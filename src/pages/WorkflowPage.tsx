import { ArrowLeft, Bot, TestTube, CheckCircle, XCircle, Send, User, MessageCircle, Lightbulb, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { webhookService } from "@/services/webhookService";
import { useState, useRef, useEffect } from "react";

const workflowDetails = {
  email: {
    title: "Email Assistent", 
    description: "Automatiseret emailbehandling og administrationsworkflows",
    color: "bg-workflow-email/10 text-workflow-email border-workflow-email/20",
    workflowType: "Email"
  },
  test: {
    title: "JET Test Assistent",
    description: "Automatiserede testworkflows og kvalitetssikringsprocesser", 
    color: "bg-workflow-test/10 text-workflow-test border-workflow-test/20",
    workflowType: "JET_test"
  },
  manual: {
    title: "Revisor-håndbog Assistent",
    description: "Chat-agent med udgangspunkt i Quick-guide og regnskabshåndbog",
    color: "bg-workflow-manual/10 text-workflow-manual border-workflow-manual/20",
    workflowType: "Revisor_chat"
  },
  economics: {
    title: "Economic Assistent",
    description: "Hent udtræk fra Economic med denne agent",
    color: "bg-workflow-economics/10 text-workflow-economics border-workflow-economics/20",
    workflowType: "Economics"
  },
  idea: {
    title: "Idé eller feedback",
    description: "Har du en idé til en nyt workflow eller feedback på et eksisterende? Lad mig endelig høre!",
    color: "bg-workflow-idea/10 text-workflow-idea border-workflow-idea/20",
    workflowType: "Idé_kasse"
  }
};

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function WorkflowPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Idea submission state
  const [ideaText, setIdeaText] = useState('');
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  
  // Economic form state
  const [customerName, setCustomerName] = useState('');
  const [extractRequest, setExtractRequest] = useState('');
  const [isSubmittingEconomic, setIsSubmittingEconomic] = useState(false);
  const [economicSubmitted, setEconomicSubmitted] = useState(false);
  
  const workflow = workflowDetails[type as keyof typeof workflowDetails];
  
  if (!workflow) {
    navigate('/');
    return null;
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      // Send message to webhook
      const result = await webhookService.sendWebhook(workflow.title, workflow.workflowType, {
        message: userMessage.content,
        messageType: 'chat_question',
        timestamp: userMessage.timestamp.toISOString(),
        source: 'revisor-chat-interface'
      });

      if (result.success) {
        // Add delay to show loading animation longer
        setTimeout(() => {
          // Add assistant response (placeholder for now)
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: "Besked modtaget",
            sender: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsSending(false);
        }, 5000);
      } else {
        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Der opstod en fejl ved afsendelse af dit spørgsmål. Prøv igen senere.",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsSending(false);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Der opstod en fejl ved afsendelse af dit spørgsmål. Prøv igen senere.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmitIdea = async () => {
    if (!ideaText.trim() || isSubmittingIdea) return;

    setIsSubmittingIdea(true);

    try {
      // Send idea to webhook
      const result = await webhookService.sendWebhook(workflow.title, workflow.workflowType, {
        ideaText: ideaText.trim(),
        timestamp: new Date().toISOString(),
        source: 'idea-submission-interface'
      });

      if (result.success) {
        // Add delay to show loading animation longer
        setTimeout(() => {
          setIdeaSubmitted(true);
          setIdeaText('');
          setIsSubmittingIdea(false);
          // Reset success state after 8 seconds
          setTimeout(() => setIdeaSubmitted(false), 5000);
        }, 2000);
      } else {
        console.error('Failed to submit idea:', result.error);
        setIsSubmittingIdea(false);
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      setIsSubmittingIdea(false);
    }
  };

  const handleSubmitEconomic = async () => {
    if (!customerName.trim() || !extractRequest.trim() || isSubmittingEconomic) return;

    setIsSubmittingEconomic(true);

    try {
      // Send Economic request to webhook
      const result = await webhookService.sendWebhook(workflow.title, workflow.workflowType, {
        customerName: customerName.trim(),
        extractRequest: extractRequest.trim(),
        timestamp: new Date().toISOString(),
        source: 'economic-form-interface'
      });

      if (result.success) {
        // Add delay to show loading animation longer
        setTimeout(() => {
          setEconomicSubmitted(true);
          setCustomerName('');
          setExtractRequest('');
          setIsSubmittingEconomic(false);
          // Reset success state after 8 seconds
          setTimeout(() => setEconomicSubmitted(false), 5000);
        }, 2000);
      } else {
        console.error('Failed to submit Economic request:', result.error);
        setIsSubmittingEconomic(false);
      }
    } catch (error) {
      console.error('Error submitting Economic request:', error);
      setIsSubmittingEconomic(false);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestLoading(true);
    setTestStatus('idle');
    
    try {
      // Send webhook data with test flag
      const result = await webhookService.sendWebhook(workflow.title, workflow.workflowType, {
        testMode: true,
        testTimestamp: new Date().toISOString(),
        source: 'workflow-page-test-button'
      });
      
      if (result.success) {
        console.log('Test webhook sent successfully:', result.message);
        setTestStatus('success');
        // Reset status after 3 seconds
        setTimeout(() => setTestStatus('idle'), 3000);
      } else {
        console.warn('Test webhook failed:', result.error);
        setTestStatus('error');
        // Reset status after 3 seconds
        setTimeout(() => setTestStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error sending test webhook:', error);
      setTestStatus('error');
      // Reset status after 3 seconds
      setTimeout(() => setTestStatus('idle'), 3000);
    } finally {
      setIsTestLoading(false);
    }
  };

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

          {type === 'manual' ? (
            // Chat Interface for Revisor-håndbog Assistant
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-workflow-manual/10 text-workflow-manual rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Revisor-håndbog Chat</h2>
                  <p className="text-sm text-muted-foreground">Få svar på revisionsfaglige spørgsmål</p>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto border border-border rounded-lg p-4 mb-4 bg-muted/20">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Jeg er her for at hjælpe dig med revisionsfaglige spørgsmål</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border border-border'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === 'assistant' && (
                              <Bot className="w-4 h-4 mt-0.5 text-workflow-manual flex-shrink-0" />
                            )}
                            {message.sender === 'user' && (
                              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString('da-DK', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-card border border-border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-workflow-manual" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Start samtalen her..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : type === 'economics' ? (
            // Economic Form Interface for Economic Assistent
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-workflow-economics/10 text-workflow-economics rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Economic Assistent</h2>
                  <p className="text-sm text-muted-foreground">Anmod om udtræk fra Economic</p>
                </div>
              </div>
              
              {/* Economic Form */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Navn på kunde
                  </label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Indtast kundens navn..."
                    disabled={isSubmittingEconomic}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Udtræk
                  </label>
                  <Input
                    value={extractRequest}
                    onChange={(e) => setExtractRequest(e.target.value)}
                    placeholder="F.eks. Saldobalance 2024, Resultatopgørelse Q1, etc."
                    disabled={isSubmittingEconomic}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitEconomic}
                    disabled={!customerName.trim() || !extractRequest.trim() || isSubmittingEconomic}
                    className="px-6"
                  >
                    {isSubmittingEconomic ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Sender...</span>
                      </div>
                    ) : economicSubmitted ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Sendt!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Anmod om udtræk</span>
                      </div>
                    )}
                  </Button>
                </div>
                
                {/* Loading Animation and Response */}
                {(isSubmittingEconomic || economicSubmitted) && (
                  <div className="mt-6">
                    {isSubmittingEconomic && (
                      <div className="flex justify-start">
                        <div className="bg-card border border-border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-workflow-economics" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {economicSubmitted && (
                      <div className="flex justify-start">
                        <div className="bg-card border border-border rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Bot className="w-4 h-4 mt-0.5 text-workflow-economics flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm">Anmodning modtaget! Vi vil behandle din forespørgsel snart.</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date().toLocaleTimeString('da-DK', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : type === 'idea' ? (
            // Idea Submission Interface for Idé kassen
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-workflow-idea/10 text-workflow-idea rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Idé kassen</h2>
                  <p className="text-sm text-muted-foreground">Del din idé eller feedback med os</p>
                </div>
              </div>
              
              {/* Idea Input */}
              <div className="flex gap-2">
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Beskriv din idé til et nyt workflow, forbedring eller del din feedback..."
                  disabled={isSubmittingIdea}
                  className="flex-1 min-h-[60px] max-h-32 p-3 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <Button
                  onClick={handleSubmitIdea}
                  disabled={!ideaText.trim() || isSubmittingIdea || ideaText.length > 500}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Loading Animation and Response */}
              {(isSubmittingIdea || ideaSubmitted) && (
                <div className="mt-6">
                  {isSubmittingIdea && (
                    <div className="flex justify-start">
                      <div className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-workflow-idea" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {ideaSubmitted && (
                    <div className="flex justify-start">
                      <div className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Bot className="w-4 h-4 mt-0.5 text-workflow-idea flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm">Tak for din besked! Vi vil undersøge din henvendelse 🙌</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date().toLocaleTimeString('da-DK', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : (
            // Default Interface for other workflows
            <Card className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Assistent Interface</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Denne workflow assistent bliver konfigureret i øjeblikket. Det interaktive interface vil være tilgængeligt snart.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto mb-6">
                  <p className="text-sm text-muted-foreground">
                    Integration med assistent logik afventer udvikler konfiguration.
                  </p>
                </div>
                
                {/* Test Workflow Button */}
                <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestWebhook}
                  disabled={isTestLoading}
                  className="min-w-[140px] h-10 font-medium transition-all duration-200 hover:bg-secondary/80"
                >
                  {isTestLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Testing...</span>
                    </div>
                  ) : testStatus === 'success' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Success!</span>
                    </div>
                  ) : testStatus === 'error' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span>Failed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                        <span>Test workflow</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card>
          )}
        </div>
      </div>
    </div>
  );
}