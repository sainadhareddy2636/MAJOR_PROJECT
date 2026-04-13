import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, AlertCircle, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { recommendAsanas, Recommendation } from "@/lib/recommender";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [concern, setConcern] = useState("");
  const [details, setDetails] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasResults, setHasResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concern.trim()) {
      toast({
        title: "Please enter your concern",
        description: "We need to know what you'd like to work on",
        variant: "destructive",
      });
      return;
    }
    
    const results = recommendAsanas(concern, details, 3);
    setRecommendations(results);
    setHasResults(true);
    toast({
      title: "Recommendations ready",
      description: "Select an asana to begin your guided session",
    });
  };

  const quickConcerns = [
    { title: "Lower Back Pain", description: "Relief for lumbar discomfort" },
    { title: "Neck Stiffness", description: "Reduce tension and improve mobility" },
    { title: "Knee Discomfort", description: "Strengthen and protect joints" },
    { title: "Shoulder Tension", description: "Release upper body stress" },
    { title: "Hip Flexibility", description: "Improve range of motion" },
    { title: "Stress Relief", description: "Mental and physical relaxation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-accent/50 rounded-full text-sm font-medium text-accent-foreground">
              <Sparkles className="inline w-4 h-4 mr-2" />
              Personalized Recommendations
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              What Would You Like to Work On?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us about your health concern and we'll recommend the perfect yoga asanas
            </p>
          </div>

          {/* Main Input Form */}
          <Card className="p-8 mb-12 bg-gradient-card border-none shadow-medium animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="concern" className="text-lg font-semibold">
                  Primary Concern
                </Label>
                <Input
                  id="concern"
                  placeholder="e.g., Lower back pain, Neck stiffness, Knee discomfort..."
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-lg font-semibold">
                  Additional Details (Optional)
                </Label>
                <Textarea
                  id="details"
                  placeholder="Tell us more about when the discomfort occurs, its severity, or any specific areas affected..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-32 text-lg"
                />
              </div>

              <Button 
                type="submit"
                size="lg" 
                className="w-full bg-gradient-wellness hover:opacity-90 transition-opacity shadow-soft"
              >
                Get AI Recommendations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>

          {hasResults && (
            <div className="mb-12 space-y-6">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Recommended Asanas
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Research-informed suggestions based on published studies.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                {recommendations.map((rec) => (
                  <Card
                    key={rec.asana.id}
                    className="p-6 bg-background border-border hover:shadow-medium transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {rec.asana.name}
                        </h3>
                        <p className="text-muted-foreground italic">{rec.asana.sanskrit}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Target: {rec.asana.targetArea} • {rec.asana.duration}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {rec.asana.benefits}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-wellness hover:opacity-90 transition-opacity"
                        onClick={() => navigate(`/session?asana=${encodeURIComponent(rec.asana.id)}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    </div>

                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Concerns */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Or Choose a Common Concern
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickConcerns.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 cursor-pointer hover:shadow-medium transition-all hover:-translate-y-1 bg-background border-border"
                  onClick={() => {
                    setConcern(item.title);
                    setDetails("");
                    setHasResults(false);
                    toast({
                      title: "Concern selected",
                      description: `Working on: ${item.title}`,
                    });
                  }}
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <Card className="mt-12 p-8 bg-accent/20 border-accent">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  How Our AI Works
                </h3>
                <p className="text-muted-foreground">
                  Our recommendation system analyzes your concern using medical research papers 
                  and yoga therapy guidelines to suggest the most effective asanas. Each recommendation 
                  is backed by science and tailored to your specific needs.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
