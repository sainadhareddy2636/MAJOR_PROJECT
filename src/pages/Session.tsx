import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp, Camera, CameraOff, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePoseCoach } from "@/hooks/usePoseCoach";
import { ASANAS, DEFAULT_ASANA_ID } from "@/lib/asanas";

const Session = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const selectedAsanaId = searchParams.get("asana") ?? DEFAULT_ASANA_ID;
  const selectedAsana = ASANAS.find((asana) => asana.id === selectedAsanaId) ?? ASANAS[0];
  const trainerVideoSrc = `/trainer-${selectedAsana.id}.mp4`;
  const trainerVideoRef = useRef<HTMLVideoElement | null>(null);

  const {
    videoRef,
    canvasRef,
    ready,
    isCameraOn,
    isScoringActive,
    overall,
    metrics,
    tips,
    startCamera,
    stopCamera,
    setScoringActive,
    setTrainerVideoElement,
    resetSession,
    buildReport,
  } = usePoseCoach();
  const [trainerReady, setTrainerReady] = useState(false);
  const [trainerPlaying, setTrainerPlaying] = useState(false);
  const [trainerError, setTrainerError] = useState(false);

  useEffect(() => {
    setTrainerVideoElement(trainerVideoRef.current);
  }, [setTrainerVideoElement]);

  useEffect(() => {
    setScoringActive(isCameraOn && trainerPlaying && trainerReady && !trainerError);
  }, [isCameraOn, trainerPlaying, trainerReady, trainerError, setScoringActive]);

  const handleStart = async () => {
    try {
      await startCamera();
      toast({ title: "Camera enabled", description: "Real-time pose tracking started." });
    } catch {
      toast({
        title: "Camera access failed",
        description: "Allow camera permissions in your browser and retry.",
        variant: "destructive",
      });
    }
  };

  const handleResetSession = () => {
    if (trainerVideoRef.current) {
      trainerVideoRef.current.pause();
      trainerVideoRef.current.currentTime = 0;
    }
    setTrainerPlaying(false);
    resetSession();
  };

  const handleEndSession = () => {
    const report = {
      ...buildReport(),
      asanaId: selectedAsana.id,
      asanaName: selectedAsana.name,
      asanaSanskrit: selectedAsana.sanskrit,
      targetArea: selectedAsana.targetArea,
    };
    localStorage.setItem("poseperfect:lastReport", JSON.stringify(report));
    const historyKey = "poseperfect:reports";
    const historyRaw = localStorage.getItem(historyKey);
    const history = historyRaw ? (JSON.parse(historyRaw) as typeof report[]) : [];
    history.unshift(report);
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 50)));

    stopCamera();
    if (trainerVideoRef.current) {
      trainerVideoRef.current.pause();
      trainerVideoRef.current.currentTime = 0;
    }
    setTrainerPlaying(false);
    toast({ title: "Session complete", description: "Report generated and downloaded." });
    setTimeout(() => navigate("/progress"), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{selectedAsana.name} Guided Session</h1>
              <p className="text-muted-foreground">
                {selectedAsana.sanskrit} | Target: {selectedAsana.targetArea} | {selectedAsana.duration}
              </p>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
              {isScoringActive ? "Guided Scoring Active" : ready ? "Ready" : "Initializing"}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden shadow-medium border-none">
                <div className="aspect-video bg-black relative">
                  <video
                    ref={trainerVideoRef}
                    className="w-full h-full object-cover"
                    src={trainerVideoSrc}
                    controls
                    loop={false}
                    onLoadedData={() => {
                      setTrainerReady(true);
                      setTrainerError(false);
                    }}
                    onPlay={() => setTrainerPlaying(true)}
                    onPause={() => setTrainerPlaying(false)}
                    onEnded={() => {
                      setTrainerPlaying(false);
                      if (trainerVideoRef.current) {
                        trainerVideoRef.current.pause();
                        trainerVideoRef.current.currentTime = trainerVideoRef.current.duration || 0;
                      }
                    }}
                    onError={() => {
                      setTrainerError(true);
                      setTrainerReady(false);
                      setTrainerPlaying(false);
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/80">Trainer Demonstration</Badge>
                  </div>
                  {trainerError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center">
                      <p className="text-sm text-white">
                        Trainer video missing. Add <code className="mx-1">{`public/trainer-${selectedAsana.id}.mp4`}</code> to continue.
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="overflow-hidden shadow-medium border-none">
                <div className="aspect-video bg-black relative">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                  <div className="absolute top-3 left-3">
                    <Badge className={isCameraOn ? "bg-success text-success-foreground" : "bg-muted"}>
                      {isCameraOn ? "Tracking Active" : "Camera Off"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-background border-t border-border flex gap-3">
                  {!isCameraOn ? (
                    <Button
                      onClick={handleStart}
                      className="bg-gradient-wellness"
                      disabled={!trainerReady || trainerError}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera + Tracking
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={stopCamera}>
                      <CameraOff className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}

                  <Button variant="outline" onClick={handleResetSession}>
                    Reset Session
                  </Button>

                  <Button variant="destructive" onClick={handleEndSession}>
                    <Download className="w-4 h-4 mr-2" />
                    End + Download Report
                  </Button>
                </div>
                {(!trainerReady || trainerError) && (
                  <div className="px-4 pb-4 text-sm text-warning">
                    Load a valid trainer video first. Scoring starts only when video is playing and camera is on.
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-gradient-card shadow-soft">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">CURRENT SCORE</h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary mb-2">{overall}</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-wellness" style={{ width: `${overall}%` }} />
                </div>
              </Card>

              <Card className="p-6 bg-background">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Pose Analysis
                </h3>
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {metric.status === "good" ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-warning" />
                          )}
                          <span className="text-sm font-medium text-foreground">{metric.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{metric.score}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={metric.status === "good" ? "h-full bg-success" : "h-full bg-warning"}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-accent/20 border-accent">
                <h3 className="font-semibold text-foreground mb-3">Real-time Corrections</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tips.map((tip) => (
                    <li key={tip}>- {tip}</li>
                  ))}
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
