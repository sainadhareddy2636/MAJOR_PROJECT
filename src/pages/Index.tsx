import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, Camera, FileText, Activity, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-yoga.jpg";
import featureAi from "@/assets/feature-ai.jpg";
import featureTracking from "@/assets/feature-tracking.jpg";
import featureReports from "@/assets/feature-reports.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-accent/50 rounded-full text-sm font-medium text-accent-foreground">
                <Sparkles className="inline w-4 h-4 mr-2" />
                AI-Powered Yoga Training
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Perfect Your Poses with{" "}
                <span className="bg-gradient-wellness bg-clip-text text-transparent">
                  AI Precision
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Get personalized yoga recommendations for your health concerns and receive 
                real-time feedback on your form with computer vision technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-wellness hover:opacity-90 transition-opacity shadow-glow"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-wellness opacity-20 blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Person practicing yoga" 
                className="relative rounded-2xl shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              How PosePerfect Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From diagnosis to mastery, our AI guides you through every step of your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gradient-card border-none shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="mb-6">
                <img src={featureAi} alt="AI Analysis" className="w-20 h-20 rounded-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">AI Recommendations</h3>
              <p className="text-muted-foreground mb-4">
                Tell us your health concern—back pain, neck stiffness, or knee discomfort—and our 
                AI recommends specific yoga asanas tailored for targeted relief.
              </p>
              <div className="flex items-center text-primary font-medium">
                <Brain className="w-5 h-5 mr-2" />
                Smart Analysis
              </div>
            </Card>

            <Card className="p-8 bg-gradient-card border-none shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="mb-6">
                <img src={featureTracking} alt="Real-time Tracking" className="w-20 h-20 rounded-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Real-Time Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Watch expert demonstrations while our computer vision tracks your movements, 
                comparing your posture and alignment with professional trainers.
              </p>
              <div className="flex items-center text-primary font-medium">
                <Camera className="w-5 h-5 mr-2" />
                Live Feedback
              </div>
            </Card>

            <Card className="p-8 bg-gradient-card border-none shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="mb-6">
                <img src={featureReports} alt="Performance Reports" className="w-20 h-20 rounded-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Progress Reports</h3>
              <p className="text-muted-foreground mb-4">
                Receive detailed performance reports after each session, highlighting deviations, 
                improvements, and personalized insights for continuous growth.
              </p>
              <div className="flex items-center text-primary font-medium">
                <FileText className="w-5 h-5 mr-2" />
                Track Progress
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Your Personal Yoga Therapist, Available 24/7
              </h2>
              <p className="text-lg text-muted-foreground">
                PosePerfect bridges the gap between self-practice and professional guidance, 
                bringing expert-level feedback to your home practice.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Targeted Health Relief</h4>
                    <p className="text-muted-foreground">
                      Address specific health concerns with yoga poses scientifically proven to help
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Safe & Accurate Practice</h4>
                    <p className="text-muted-foreground">
                      Avoid injuries with real-time corrections and alignment guidance
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Track Your Wellness Journey</h4>
                    <p className="text-muted-foreground">
                      Visualize improvements and celebrate milestones as you progress
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card p-8 rounded-2xl shadow-medium">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-background rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center p-6 bg-background rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
                <div className="text-center p-6 bg-background rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Yoga Asanas</div>
                </div>
                <div className="text-center p-6 bg-background rounded-xl">
                  <div className="text-4xl font-bold text-primary mb-2">∞</div>
                  <div className="text-sm text-muted-foreground">Practice Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 PosePerfect. AI-powered yoga guidance for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
