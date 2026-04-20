import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp, Camera, CameraOff, Download, MonitorPlay, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePoseCoach } from "@/hooks/usePoseCoach";
import { ASANAS, DEFAULT_ASANA_ID } from "@/lib/asanas";
import { createReport } from "@/lib/reports";

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
    setActiveAsana,
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
    setActiveAsana(selectedAsana.id);
  }, [selectedAsana.id, setActiveAsana]);

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

  const handleEndSession = async () => {
    const report = {
      ...buildReport(),
      asanaId: selectedAsana.id,
      asanaName: selectedAsana.name,
      asanaSanskrit: selectedAsana.sanskrit,
      targetArea: selectedAsana.targetArea,
    };

    try {
      await createReport(report);
      stopCamera();
      if (trainerVideoRef.current) {
        trainerVideoRef.current.pause();
        trainerVideoRef.current.currentTime = 0;
      }
      setTrainerPlaying(false);
      toast({ title: "Session complete", description: "Report saved to your account." });
      setTimeout(() => navigate("/progress"), 800);
    } catch (error) {
      toast({
        title: "Could not save report",
        description:
          error instanceof Error ? error.message : "Please sign in and make sure the backend is running.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      <div className="px-4 pb-8 pt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{selectedAsana.name} Guided Session</h1>
              <p className="text-muted-foreground">
                {selectedAsana.sanskrit} | Target: {selectedAsana.targetArea} | {selectedAsana.duration}
              </p>
            </div>
            <Badge className="border-success/20 bg-success/10 px-4 py-2 text-lg text-success">
              {isScoringActive ? "Guided Scoring Active" : ready ? "Ready to Track" : "Initializing"}
            </Badge>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden border-none shadow-medium">
                  <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MonitorPlay className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Trainer Feed</h2>
                    </div>
                    <Badge className="bg-background text-foreground">{trainerPlaying ? "Playing" : "Paused"}</Badge>
                  </div>
                  <div className="relative aspect-video bg-black">
                    <video
                      ref={trainerVideoRef}
                      className="h-full w-full object-cover"
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
                    {trainerError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center">
                        <p className="text-sm text-white">
                          Trainer video missing. Add <code className="mx-1">{`public/trainer-${selectedAsana.id}.mp4`}</code> to continue.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="overflow-hidden border-none shadow-medium">
                  <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ScanLine className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Your Camera Feed</h2>
                    </div>
                    <Badge className={isCameraOn ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                      {isCameraOn ? "Tracking" : "Camera Off"}
                    </Badge>
                  </div>
                  <div className="relative aspect-video bg-black">
                    <video ref={videoRef} className="h-full w-full object-cover" playsInline muted autoPlay />
                    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                  </div>
                </Card>
              </div>

              <Card className="border-none shadow-medium">
                <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Session Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep the trainer video playing and your camera on to activate comparison and scoring.
                    </p>
                  </div>
                  {!trainerReady || trainerError ? (
                    <Badge className="border-warning/20 bg-warning/10 text-warning">Trainer video required</Badge>
                  ) : (
                    <Badge className="border-primary/20 bg-primary/10 text-primary">Comparison ready</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 p-5">
                  {!isCameraOn ? (
                    <Button onClick={handleStart} className="bg-gradient-wellness" disabled={!trainerReady || trainerError}>
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera + Tracking
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={stopCamera}>
                      <CameraOff className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                  )}

                  <Button variant="outline" onClick={handleResetSession}>
                    Reset Session
                  </Button>

                  <Button variant="destructive" onClick={() => void handleEndSession()}>
                    <Download className="mr-2 h-4 w-4" />
                    End Session
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <Card className="border-none bg-gradient-card p-6 shadow-soft">
                <h3 className="mb-4 text-sm font-semibold text-muted-foreground">CURRENT SCORE</h3>
                <div className="mb-4 text-center">
                  <div className="mb-2 text-5xl font-bold text-primary">{overall}</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-wellness" style={{ width: `${overall}%` }} />
                </div>
              </Card>

              <Card className="border-none bg-background p-6 shadow-soft">
                <h3 className="mb-4 flex items-center font-semibold text-foreground">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Pose Analysis
                </h3>
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {metric.status === "good" ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-warning" />
                          )}
                          <span className="text-sm font-medium text-foreground">{metric.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{metric.score}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={metric.status === "good" ? "h-full bg-success" : "h-full bg-warning"}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-accent bg-accent/20 p-6 shadow-soft">
                <h3 className="mb-3 font-semibold text-foreground">Real-time Corrections</h3>
                <div className="rounded-2xl bg-background/80 p-4">
                  {tips.length > 0 ? (
                    <ul className="space-y-3 text-sm text-foreground">
                      {tips.map((tip) => (
                        <li key={tip} className="rounded-xl border border-border bg-background px-4 py-3">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Start the trainer video and camera together to see live alignment corrections here.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
