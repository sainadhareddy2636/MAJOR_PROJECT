import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Target, TrendingUp, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Asanas = () => {
  const navigate = useNavigate();

  const recommendedAsanas = [
    {
      name: "Cat-Cow Pose",
      sanskrit: "Marjaryasana-Bitilasana",
      difficulty: "Beginner",
      duration: "5-10 minutes",
      benefits: "Relieves lower back tension, improves spinal flexibility",
      targetArea: "Lower Back",
      effectiveness: 95,
    },
    {
      name: "Child's Pose",
      sanskrit: "Balasana",
      difficulty: "Beginner",
      duration: "3-5 minutes",
      benefits: "Stretches hips, thighs, and ankles, calms the mind",
      targetArea: "Lower Back & Hips",
      effectiveness: 92,
    },
    {
      name: "Cobra Pose",
      sanskrit: "Bhujangasana",
      difficulty: "Intermediate",
      duration: "3-5 minutes",
      benefits: "Strengthens spine, opens chest, relieves back pain",
      targetArea: "Upper & Lower Back",
      effectiveness: 88,
    },
    {
      name: "Downward Dog",
      sanskrit: "Adho Mukha Svanasana",
      difficulty: "Intermediate",
      duration: "5-8 minutes",
      benefits: "Stretches entire back, strengthens core and arms",
      targetArea: "Full Spine",
      effectiveness: 90,
    },
    {
      name: "Bridge Pose",
      sanskrit: "Setu Bandha Sarvangasana",
      difficulty: "Intermediate",
      duration: "5-7 minutes",
      benefits: "Strengthens back muscles, improves posture",
      targetArea: "Lower Back & Glutes",
      effectiveness: 87,
    },
  ];

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
            <Badge className="bg-success/10 text-success border-success/20">
              <Target className="w-3 h-3 mr-1" />
              Recommended for Lower Back Pain
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Your Personalized Yoga Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Based on your concern, we've selected these asanas to provide targeted relief and healing. 
              Start with beginner poses and progress at your own pace.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12 animate-scale-in">
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">5</div>
              <div className="text-sm text-muted-foreground">Recommended Asanas</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">25-40</div>
              <div className="text-sm text-muted-foreground">Minutes per Day</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="text-3xl font-bold text-primary mb-1">90%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </Card>
          </div>

          {/* Asanas List */}
          <div className="space-y-6">
            {recommendedAsanas.map((asana, index) => (
              <Card
                key={index}
                className="p-6 lg:p-8 bg-background border-border hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate("/session")}
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
                      <div className="flex items-center text-success">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {asana.effectiveness}% Effective
                      </div>
                    </div>

                    {/* Effectiveness Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Effectiveness</span>
                        <span>{asana.effectiveness}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-wellness transition-all duration-500"
                          style={{ width: `${asana.effectiveness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-gradient-wellness hover:opacity-90 transition-opacity lg:self-center"
                    onClick={() => navigate("/session")}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Footer */}
          <Card className="mt-12 p-8 bg-accent/20 border-accent">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ready to Begin Your Session?
                </h3>
                <p className="text-muted-foreground">
                  Start with any asana and let our AI guide you through perfect form
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-wellness hover:opacity-90 transition-opacity"
                onClick={() => navigate("/session")}
              >
                Start Live Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Asanas;
