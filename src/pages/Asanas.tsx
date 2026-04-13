import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Target, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ASANAS, DEFAULT_ASANA_ID } from "@/lib/asanas";

const Asanas = () => {
  const navigate = useNavigate();

  const recommendedAsanas = ASANAS;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-warning/10 text-warning";
      case "Advanced":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 space-y-4 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Yoga Asanas Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Explore the full set of poses available in PosePerfect. Select any asana to start a guided session.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12 animate-scale-in">
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">{recommendedAsanas.length}</div>
              <div className="text-sm text-muted-foreground">Total Asanas</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">3-10</div>
              <div className="text-sm text-muted-foreground">Typical Duration (min)</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">Beginner-Intermediate</div>
              <div className="text-sm text-muted-foreground">Difficulty Range</div>
            </Card>
          </div>

          {/* Asanas List */}
          <div className="space-y-6">
            {recommendedAsanas.map((asana, index) => (
              <Card
                key={index}
                className="p-6 lg:p-8 bg-background border-border hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/session?asana=${encodeURIComponent(asana.id)}`)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">
                          {asana.name}
                        </h3>
                        <p className="text-muted-foreground italic">{asana.sanskrit}</p>
                      </div>
                      <Badge className={getDifficultyColor(asana.difficulty)}>
                        {asana.difficulty}
                      </Badge>
                    </div>

                    <p className="text-foreground">{asana.benefits}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {asana.duration}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Target className="w-4 h-4 mr-2" />
                        {asana.targetArea}
                      </div>
                    </div>

                  </div>

                  <Button
                    size="lg"
                    className="bg-gradient-wellness hover:opacity-90 transition-opacity lg:self-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/session?asana=${encodeURIComponent(asana.id)}`);
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Asanas;
