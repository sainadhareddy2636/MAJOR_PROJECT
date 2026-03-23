import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type ReportMetric = {
  name: string;
  avg: number;
};

type ReportCorrection = {
  tip: string;
  count: number;
};

type SessionReport = {
  generatedAt?: string;
  durationSec?: number;
  framesCaptured?: number;
  averageScore?: number;
  latestScore?: number;
  metricSummary?: ReportMetric[];
  bestMetric?: ReportMetric | null;
  worstMetric?: ReportMetric | null;
  topCorrections?: ReportCorrection[];
  scoringMode?: "trainer" | "self";
  asanaId?: string;
  asanaName?: string;
  asanaSanskrit?: string;
  targetArea?: string;
};

const Progress = () => {
  const navigate = useNavigate();

  const [reportHistory, setReportHistory] = useState<SessionReport[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("poseperfect:reports");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as SessionReport[];
      if (Array.isArray(parsed)) setReportHistory(parsed);
    } catch {
      setReportHistory([]);
    }
  }, []);

  const formatDateTime = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const derivedHistory = useMemo(() => {
    if (!reportHistory.length) return [];
    return reportHistory.map((r) => {
      const improvements: string[] = [];
      const concerns: string[] = [];

      if (r.bestMetric?.name) improvements.push(`Best: ${r.bestMetric.name} (${r.bestMetric.avg}%)`);
      if (r.worstMetric?.name) concerns.push(`Needs work: ${r.worstMetric.name} (${r.worstMetric.avg}%)`);

      if (Array.isArray(r.topCorrections) && r.topCorrections.length > 0) {
        concerns.push(`Top correction: ${r.topCorrections[0].tip}`);
      }

      return {
        date: r.generatedAt ? formatDateTime(r.generatedAt) : "Recent",
        asana: r.asanaName ?? "Guided Session",
        duration: r.durationSec ? `${Math.max(1, Math.round(r.durationSec / 60))} min` : "—",
        score: r.averageScore ?? r.latestScore ?? 0,
        improvements,
        concerns,
      };
    });
  }, [reportHistory]);

  const metrics = useMemo(() => {
    if (reportHistory.length === 0) {
      return {
        totalSessions: 0,
        avgScore: 0,
        totalTimeMin: 0,
        streakDays: 0,
      };
    }

    const totalSessions = reportHistory.length;
    const avgScore = Math.round(
      reportHistory.reduce((acc, r) => acc + (r.averageScore ?? r.latestScore ?? 0), 0) / totalSessions
    );
    const totalTimeMin = Math.round(
      reportHistory.reduce((acc, r) => acc + (r.durationSec ?? 0), 0) / 60
    );

    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const days = reportHistory
      .map((r) => (r.generatedAt ? new Date(r.generatedAt) : null))
      .filter((d): d is Date => Boolean(d))
      .map((d) => dayKey(d));
    const uniqueDays = Array.from(new Set(days)).sort();

    let streakDays = 0;
    if (uniqueDays.length > 0) {
      const daySet = new Set(uniqueDays);
      const today = new Date();
      let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      while (daySet.has(dayKey(cursor))) {
        streakDays += 1;
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
      }
    }

    return { totalSessions, avgScore, totalTimeMin, streakDays };
  }, [reportHistory]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Your Progress Journey
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Track your improvements and see how your practice is transforming your wellness
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("poseperfect:lastReport");
                  localStorage.removeItem("poseperfect:reports");
                  setReportHistory([]);
                }}
              >
                Reset Progress
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-scale-in">
            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.totalSessions}</div>
              <div className="text-xs text-muted-foreground mt-1">from tracked sessions</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Score</span>
                <Badge className="bg-success/10 text-success border-success/20">Live</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.avgScore}%</div>
              <div className="text-xs text-muted-foreground mt-1">across all sessions</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Streak</span>
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.streakDays}</div>
              <div className="text-xs text-muted-foreground mt-1">days in a row</div>
            </Card>

            <Card className="p-6 bg-gradient-card border-none shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Time</span>
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {metrics.totalTimeMin >= 60 ? `${(metrics.totalTimeMin / 60).toFixed(1)}h` : `${metrics.totalTimeMin}m`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">total tracked time</div>
            </Card>
          </div>

          {/* Session History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Sessions</h2>
            </div>

            {derivedHistory.map((session, index) => (
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

        </div>
      </div>
    </div>
  );
};

export default Progress;
