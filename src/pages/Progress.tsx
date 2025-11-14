import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  ArrowRight,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Progress = () => {
  const navigate = useNavigate();

  const sessionHistory = [
    {
      date: "Today, 2:45 PM",
      asana: "Cat-Cow Pose",
      duration: "5 min",
      score: 87,
      improvements: ["Hip alignment improved by 12%", "Better breathing control"],
      concerns: ["Work on smoother transitions"],
    },
    {
      date: "Yesterday, 9:30 AM",
      asana: "Child's Pose",
      duration: "4 min",
      score: 92,
      improvements: ["Excellent form maintained", "Perfect hip positioning"],
      concerns: [],
    },
    {
      date: "2 days ago, 6:00 PM",
      asana: "Downward Dog",
      duration: "6 min",
      score: 78,
      improvements: ["Core engagement improved"],
      concerns: ["Shoulder alignment needs work", "Keep heels closer to ground"],
    },
  ];

  const weeklyStats = [
    { day: "Mon", score: 75 },
    { day: "Tue", score: 82 },
    { day: "Wed", score: 78 },
    { day: "Thu", score: 85 },
    { day: "Fri", score: 87 },
    { day: "Sat", score: 92 },
    { day: "Sun", score: 87 },
  ];

  const maxScore = Math.max(...weeklyStats.map(s => s.score));

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 space-y-4 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Your Progress Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Track your improvements, celebrate milestones, and see how your practice is transforming your wellness
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-scale-in">
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">24</div>
              <div className="text-xs text-success mt-1">+3 this week</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Score</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">84%</div>
              <div className="text-xs text-success mt-1">+7% from last week</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Streak</span>
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">7</div>
              <div className="text-xs text-muted-foreground mt-1">days in a row</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Time</span>
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">2.4h</div>
              <div className="text-xs text-muted-foreground mt-1">this week</div>
            </Card>
          </div>

          {/* Weekly Progress Chart */}
          <Card className="p-8 mb-12 bg-background shadow-medium">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Weekly Performance</h2>
              <Badge className="bg-success/10 text-success border-success/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Improving
              </Badge>
            </div>

            <div className="flex items-end justify-between gap-4 h-64">
              {weeklyStats.map((stat, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-gradient-wellness rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                      style={{
                        height: `${(stat.score / maxScore) * 100}%`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
                        {stat.score}%
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Session History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Sessions</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {sessionHistory.map((session, index) => (
              <Card
                key={index}
                className="p-6 bg-background border-border hover:shadow-medium transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {session.asana}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {session.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {/* Improvements */}
                    {session.improvements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-success flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Improvements
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {session.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-foreground">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Areas to Work On */}
                    {session.concerns.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-warning flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Areas to Focus On
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {session.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-foreground">
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Achievement Section */}
          <Card className="mt-12 p-8 bg-gradient-card shadow-medium">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-wellness flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Keep Up the Great Work!
                  </h3>
                  <p className="text-muted-foreground">
                    You're on a 7-day streak. Continue your practice to unlock new achievements 
                    and see even more improvements in your wellness journey.
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-wellness hover:opacity-90 transition-opacity whitespace-nowrap"
                onClick={() => navigate("/dashboard")}
              >
                Start New Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;
