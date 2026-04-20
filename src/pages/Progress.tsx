import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { clearReports, fetchReports, SessionReport } from "@/lib/reports";

const Progress = () => {
  const { toast } = useToast();
  const [reportHistory, setReportHistory] = useState<SessionReport[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const reports = await fetchReports();
        setReportHistory(reports);
      } catch {
        setReportHistory([]);
      }
    };

    void loadReports();
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

    return reportHistory.map((report) => {
      const improvements: string[] = [];
      const concerns: string[] = [];

      if (report.bestMetric?.name) {
        improvements.push(`Best: ${report.bestMetric.name} (${report.bestMetric.avg}%)`);
      }

      if (report.worstMetric?.name) {
        concerns.push(`Needs work: ${report.worstMetric.name} (${report.worstMetric.avg}%)`);
      }

      if (Array.isArray(report.topCorrections) && report.topCorrections.length > 0) {
        concerns.push(`Top correction: ${report.topCorrections[0].tip}`);
      }

      return {
        id: report._id ?? `${report.asanaId}-${report.generatedAt}`,
        date: report.generatedAt ? formatDateTime(report.generatedAt) : "Recent",
        asana: report.asanaName ?? "Guided Session",
        duration: report.durationSec ? `${Math.max(1, Math.round(report.durationSec / 60))} min` : "-",
        score: report.averageScore ?? report.latestScore ?? 0,
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
      reportHistory.reduce((acc, report) => acc + (report.averageScore ?? report.latestScore ?? 0), 0) /
        totalSessions,
    );
    const totalTimeMin = Math.round(
      reportHistory.reduce((acc, report) => acc + (report.durationSec ?? 0), 0) / 60,
    );

    const dayKey = (date: Date) => date.toISOString().slice(0, 10);
    const days = reportHistory
      .map((report) => (report.generatedAt ? new Date(report.generatedAt) : null))
      .filter((date): date is Date => Boolean(date))
      .map((date) => dayKey(date));
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

  const handleResetProgress = async () => {
    try {
      await clearReports();
      setReportHistory([]);
      toast({
        title: "Progress reset",
        description: "Your saved session history has been cleared.",
      });
    } catch (error) {
      toast({
        title: "Could not reset progress",
        description:
          error instanceof Error ? error.message : "Please make sure the backend is running.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground lg:text-5xl">Your Progress Journey</h1>
                <p className="max-w-3xl text-xl text-muted-foreground">
                  Track your improvements and see how your practice is transforming your wellness
                </p>
              </div>
              <Button variant="outline" onClick={() => void handleResetProgress()}>
                Reset Progress
              </Button>
            </div>
          </div>

          <div className="mb-12 grid gap-4 animate-scale-in sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none bg-gradient-card p-6 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.totalSessions}</div>
              <div className="mt-1 text-xs text-muted-foreground">from tracked sessions</div>
            </Card>

            <Card className="border-none bg-gradient-card p-6 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Score</span>
                <Badge className="border-success/20 bg-success/10 text-success">Live</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.avgScore}%</div>
              <div className="mt-1 text-xs text-muted-foreground">across all sessions</div>
            </Card>

            <Card className="border-none bg-gradient-card p-6 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Streak</span>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.streakDays}</div>
              <div className="mt-1 text-xs text-muted-foreground">days in a row</div>
            </Card>

            <Card className="border-none bg-gradient-card p-6 shadow-soft">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Time</span>
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {metrics.totalTimeMin >= 60 ? `${(metrics.totalTimeMin / 60).toFixed(1)}h` : `${metrics.totalTimeMin}m`}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">total tracked time</div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Sessions</h2>
            </div>

            {derivedHistory.map((session) => (
              <Card key={session.id} className="border-border bg-background p-6 transition-all hover:shadow-medium">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-foreground">{session.asana}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{session.score}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {session.improvements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="flex items-center text-sm font-semibold text-success">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Improvements
                        </h4>
                        <ul className="ml-6 space-y-1">
                          {session.improvements.map((improvement) => (
                            <li key={improvement} className="text-sm text-foreground">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {session.concerns.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="flex items-center text-sm font-semibold text-warning">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Areas to Focus On
                        </h4>
                        <ul className="ml-6 space-y-1">
                          {session.concerns.map((concern) => (
                            <li key={concern} className="text-sm text-foreground">
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
