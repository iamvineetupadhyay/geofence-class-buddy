import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search
} from "lucide-react";

interface Doubt {
  id: number;
  title: string;
  description: string;
  subject: string;
  student_name: string;
  created_at: string;
  status: 'open' | 'resolved' | 'in_progress';
  replies_count: number;
}

const DoubtsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDoubtForm, setShowNewDoubtForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDoubt, setNewDoubt] = useState({
    title: "",
    description: "",
    subject: "",
  });

  // Mock data for now
  const mockDoubts: Doubt[] = [
    {
      id: 1,
      title: "Question about Integration by Parts",
      description: "Can someone explain the step-by-step process for integration by parts with a complex example?",
      subject: "Mathematics", 
      student_name: "Alex Johnson",
      created_at: "2024-01-15T10:30:00Z",
      status: "open",
      replies_count: 3
    },
    {
      id: 2,
      title: "Newton's Third Law Clarification",
      description: "I'm confused about the application of Newton's third law in collision problems.",
      subject: "Physics",
      student_name: "Sarah Chen", 
      created_at: "2024-01-14T14:15:00Z",
      status: "resolved",
      replies_count: 5
    },
    {
      id: 3,
      title: "Organic Chemistry Nomenclature",
      description: "How do I name complex organic compounds with multiple functional groups?",
      subject: "Chemistry",
      student_name: "Mike Davis",
      created_at: "2024-01-14T09:20:00Z", 
      status: "in_progress",
      replies_count: 2
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoubts(mockDoubts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDoubt.title || !newDoubt.description || !newDoubt.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    const mockNewDoubt: Doubt = {
      id: doubts.length + 1,
      title: newDoubt.title,
      description: newDoubt.description,
      subject: newDoubt.subject,
      student_name: user?.name || "Anonymous",
      created_at: new Date().toISOString(),
      status: "open",
      replies_count: 0
    };

    setDoubts([mockNewDoubt, ...doubts]);
    setNewDoubt({ title: "", description: "", subject: "" });
    setShowNewDoubtForm(false);

    toast({
      title: "Doubt Submitted!",
      description: "Your question has been posted successfully",
    });
  };

  const filteredDoubts = doubts.filter(doubt =>
    doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doubt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doubt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-success text-success-foreground'; 
      case 'in_progress': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <CardTitle>Please log in to access doubts</CardTitle>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Doubts & Questions
          </h1>
          <p className="text-muted-foreground mt-1">Ask questions and get help from teachers and peers</p>
        </div>
        <Button 
          onClick={() => setShowNewDoubtForm(!showNewDoubtForm)}
          className="bg-gradient-primary shadow-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search doubts by title, subject, or content..."
          className="pl-10 shadow-soft"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* New Doubt Form */}
      {showNewDoubtForm && (
        <Card className="mb-6 shadow-soft bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Ask a New Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitDoubt} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for your question"
                    value={newDoubt.title}
                    onChange={(e) => setNewDoubt({...newDoubt, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    value={newDoubt.subject}
                    onChange={(e) => setNewDoubt({...newDoubt, subject: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your question in detail..."
                  rows={4}
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt({...newDoubt, description: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Question
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewDoubtForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <Card className="p-12 text-center shadow-soft">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No doubts found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to ask a question!"}
            </p>
          </Card>
        ) : (
          filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="p-6 shadow-soft hover:shadow-medium transition-shadow bg-background/50 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${doubt.student_name}`} />
                  <AvatarFallback>
                    {doubt.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{doubt.title}</h3>
                      <Badge className={getStatusColor(doubt.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(doubt.status)}
                          <span className="capitalize">{doubt.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doubt.subject}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {doubt.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>by {doubt.student_name}</span>
                      <span>•</span>
                      <span>{new Date(doubt.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{doubt.replies_count} replies</span>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DoubtsPage;