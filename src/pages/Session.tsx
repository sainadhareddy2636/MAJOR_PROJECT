import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  SkipForward,
  Volume2,
  Settings,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Session = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);

  const handleToggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    toast({
      title: cameraEnabled ? "Camera Disabled" : "Camera Enabled",
      description: cameraEnabled 
        ? "Pose tracking paused" 
        : "AI tracking your movements",
    });
  };

  const handleEndSession = () => {
    toast({
      title: "Session Complete!",
      description: "Generating your performance report...",
    });
    setTimeout(() => {
      navigate("/progress");
    }, 1500);
  };

  const posePoints = [
    { name: "Head Alignment", status: "good", score: 95 },
    { name: "Shoulder Position", status: "good", score: 92 },
    { name: "Hip Alignment", status: "warning", score: 78 },
    { name: "Knee Position", status: "good", score: 88 },
    { name: "Foot Placement", status: "warning", score: 75 },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Cat-Cow Pose Session
              </h1>
              <p className="text-muted-foreground">Follow the trainer and perfect your form</p>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
              Live Session
            </Badge>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trainer Video */}
              <Card className="overflow-hidden shadow-medium border-none">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Trainer Video Feed</p>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur">
                      Trainer Demonstration
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/80 backdrop-blur">
                      02:45 / 05:00
                    </Badge>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-4 bg-background border-t border-border">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="outline">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button size="icon" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* User Camera Feed */}
              <Card className="overflow-hidden shadow-medium border-none">
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                  {cameraEnabled ? (
                    <>
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Your Camera Feed</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          AI is tracking your pose
                        </p>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-success/80 backdrop-blur text-success-foreground animate-pulse">
                          ● Tracking Active
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <CameraOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Camera Disabled</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-background border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={cameraEnabled ? "default" : "outline"}
                        onClick={handleToggleCamera}
                        className={cameraEnabled ? "bg-gradient-wellness" : ""}
                      >
                        {cameraEnabled ? (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Camera On
                          </>
                        ) : (
                          <>
                            <CameraOff className="w-4 h-4 mr-2" />
                            Camera Off
                          </>
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleEndSession}
                    >
                      End Session
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Real-time Feedback */}
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="p-6 bg-gradient-card shadow-soft">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  CURRENT SCORE
                </h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {Math.round(posePoints.reduce((acc, point) => acc + point.score, 0) / posePoints.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-wellness transition-all duration-500"
                    style={{
                      width: `${Math.round(posePoints.reduce((acc, point) => acc + point.score, 0) / posePoints.length)}%`
                    }}
                  />
                </div>
              </Card>

              {/* Pose Points */}
              <Card className="p-6 bg-background">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Pose Analysis
                </h3>
                <div className="space-y-4">
                  {posePoints.map((point, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {point.status === "good" ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-warning" />
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {point.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {point.score}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            point.status === "good" 
                              ? "bg-success" 
                              : "bg-warning"
                          }`}
                          style={{ width: `${point.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tips */}
              <Card className="p-6 bg-accent/20 border-accent">
                <h3 className="font-semibold text-foreground mb-3">
                  💡 Real-time Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keep your hips level</li>
                  <li>• Engage your core muscles</li>
                  <li>• Breathe deeply and slowly</li>
                  <li>• Move with controlled motion</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
