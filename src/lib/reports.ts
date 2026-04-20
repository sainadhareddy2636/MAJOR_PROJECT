import { apiRequest } from "@/lib/api";

export type ReportMetric = {
  name: string;
  avg: number;
};

export type ReportCorrection = {
  tip: string;
  count: number;
};

export type SessionReport = {
  _id?: string;
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

export const fetchReports = async () => {
  const result = await apiRequest<{ reports: SessionReport[] }>("/api/reports");
  return result.reports;
};

export const createReport = async (report: SessionReport) => {
  const result = await apiRequest<{ report: SessionReport }>("/api/reports", {
    method: "POST",
    body: report,
  });
  return result.report;
};

export const clearReports = async () => {
  await apiRequest<void>("/api/reports", {
    method: "DELETE",
  });
};
