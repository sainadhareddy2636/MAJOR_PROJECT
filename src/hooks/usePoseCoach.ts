import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { ASANAS } from "@/lib/asanas";

type PoseStatus = "good" | "warning";

export type PoseMetric = {
  name: string;
  score: number;
  status: PoseStatus;
};

export type PoseFrame = {
  at: number;
  overall: number;
  metrics: PoseMetric[];
  tips: string[];
};

type Landmark = {
  x: number;
  y: number;
};

const IDX = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function angleABC(a: Landmark | undefined, b: Landmark | undefined, c: Landmark | undefined) {
  if (!a || !b || !c) return 0;
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  if (magAB === 0 || magCB === 0) return 0;
  const cos = clamp(dot / (magAB * magCB), -1, 1);
  return (Math.acos(cos) * 180) / Math.PI;
}

function drawLandmarks(canvas: HTMLCanvasElement, landmarks: Landmark[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pairs = [
    [11, 13], [13, 15],
    [12, 14], [14, 16],
    [11, 12], [11, 23], [12, 24], [23, 24],
    [23, 25], [25, 27],
    [24, 26], [26, 28],
  ];

  ctx.strokeStyle = "rgba(16,185,129,0.9)";
  ctx.lineWidth = 3;
  for (const [a, b] of pairs) {
    const p1 = landmarks[a];
    const p2 = landmarks[b];
    if (!p1 || !p2) continue;
    ctx.beginPath();
    ctx.moveTo(p1.x * w, p1.y * h);
    ctx.lineTo(p2.x * w, p2.y * h);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(59,130,246,0.95)";
  for (const p of landmarks) {
    if (!p) continue;
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function evaluatePose(landmarks: Landmark[]) {
  const ls = landmarks[IDX.LEFT_SHOULDER];
  const rs = landmarks[IDX.RIGHT_SHOULDER];
  const lh = landmarks[IDX.LEFT_HIP];
  const rh = landmarks[IDX.RIGHT_HIP];
  const lk = landmarks[IDX.LEFT_KNEE];
  const rk = landmarks[IDX.RIGHT_KNEE];

  if (!ls || !rs || !lh || !rh || !lk || !rk) {
    const metrics: PoseMetric[] = [
      { name: "Shoulder Level", score: 0, status: "warning" },
      { name: "Hip Level", score: 0, status: "warning" },
      { name: "Spine Alignment", score: 0, status: "warning" },
      { name: "Knee Stability", score: 0, status: "warning" },
    ];
    return { overall: 0, metrics, tips: ["Move fully into frame for detection."] };
  }

  const shoulderDiff = Math.abs(ls.y - rs.y);
  const hipDiff = Math.abs(lh.y - rh.y);

  const shoulderScore = clamp(100 - shoulderDiff * 900, 0, 100);
  const hipScore = clamp(100 - hipDiff * 900, 0, 100);

  const leftTorso = angleABC(ls, lh, lk);
  const rightTorso = angleABC(rs, rh, rk);
  const torsoAvg = (leftTorso + rightTorso) / 2;
  const spineScore = clamp(100 - Math.abs(170 - torsoAvg) * 2.2, 0, 100);

  const leftKnee = angleABC(lh, lk, landmarks[IDX.LEFT_ANKLE]);
  const rightKnee = angleABC(rh, rk, landmarks[IDX.RIGHT_ANKLE]);
  const kneeAvg = (leftKnee + rightKnee) / 2;
  const kneeScore = clamp(100 - Math.abs(165 - kneeAvg) * 2.0, 0, 100);

  const metrics: PoseMetric[] = [
    { name: "Shoulder Level", score: Math.round(shoulderScore), status: shoulderScore > 80 ? "good" : "warning" },
    { name: "Hip Level", score: Math.round(hipScore), status: hipScore > 80 ? "good" : "warning" },
    { name: "Spine Alignment", score: Math.round(spineScore), status: spineScore > 75 ? "good" : "warning" },
    { name: "Knee Stability", score: Math.round(kneeScore), status: kneeScore > 75 ? "good" : "warning" },
  ];

  const tips: string[] = [];
  if (shoulderScore < 80) tips.push("Keep both shoulders level.");
  if (hipScore < 80) tips.push("Square your hips and avoid tilting.");
  if (spineScore < 75) tips.push("Lengthen your spine and engage your core.");
  if (kneeScore < 75) tips.push("Align your knees over ankles with control.");
  if (tips.length === 0) tips.push("Great form. Maintain smooth breathing.");

  const overall = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);
  return { overall, metrics, tips };
}

function getJointAngles(landmarks: Landmark[]) {
  const ls = landmarks[IDX.LEFT_SHOULDER];
  const rs = landmarks[IDX.RIGHT_SHOULDER];
  const le = landmarks[IDX.LEFT_ELBOW];
  const re = landmarks[IDX.RIGHT_ELBOW];
  const lw = landmarks[IDX.LEFT_WRIST];
  const rw = landmarks[IDX.RIGHT_WRIST];
  const lh = landmarks[IDX.LEFT_HIP];
  const rh = landmarks[IDX.RIGHT_HIP];
  const lk = landmarks[IDX.LEFT_KNEE];
  const rk = landmarks[IDX.RIGHT_KNEE];
  const la = landmarks[IDX.LEFT_ANKLE];
  const ra = landmarks[IDX.RIGHT_ANKLE];

  const shoulderLeft = angleABC(le, ls, lh);
  const shoulderRight = angleABC(re, rs, rh);
  const elbowLeft = angleABC(ls, le, lw);
  const elbowRight = angleABC(rs, re, rw);
  const hipLeft = angleABC(ls, lh, lk);
  const hipRight = angleABC(rs, rh, rk);
  const kneeLeft = angleABC(lh, lk, la);
  const kneeRight = angleABC(rh, rk, ra);

  const avg = (a: number, b: number) => (a + b) / 2;

  return {
    shoulder: avg(shoulderLeft, shoulderRight),
    elbow: avg(elbowLeft, elbowRight),
    hip: avg(hipLeft, hipRight),
    knee: avg(kneeLeft, kneeRight),
  };
}

function compareWithTrainer(user: Landmark[], trainer: Landmark[], weights?: Record<string, number>) {
  const userAngles = getJointAngles(user);
  const trainerAngles = getJointAngles(trainer);

  const scoreFromDiff = (diff: number) => clamp(100 - diff * 2, 0, 100);

  const shoulderDiff = Math.abs(userAngles.shoulder - trainerAngles.shoulder);
  const elbowDiff = Math.abs(userAngles.elbow - trainerAngles.elbow);
  const hipDiff = Math.abs(userAngles.hip - trainerAngles.hip);
  const kneeDiff = Math.abs(userAngles.knee - trainerAngles.knee);

  const shoulderScore = scoreFromDiff(shoulderDiff);
  const elbowScore = scoreFromDiff(elbowDiff);
  const hipScore = scoreFromDiff(hipDiff);
  const kneeScore = scoreFromDiff(kneeDiff);

  const metrics: PoseMetric[] = [
    { name: "Shoulder Match", score: Math.round(shoulderScore), status: shoulderScore > 80 ? "good" : "warning" },
    { name: "Elbow Match", score: Math.round(elbowScore), status: elbowScore > 80 ? "good" : "warning" },
    { name: "Hip Match", score: Math.round(hipScore), status: hipScore > 80 ? "good" : "warning" },
    { name: "Knee Match", score: Math.round(kneeScore), status: kneeScore > 80 ? "good" : "warning" },
  ];

  const tips: string[] = [];
  if (shoulderScore < 80) tips.push("Align your shoulder angle with the trainer.");
  if (elbowScore < 80) tips.push("Match the trainer's elbow bend.");
  if (hipScore < 80) tips.push("Adjust hip angle to match the trainer.");
  if (kneeScore < 80) tips.push("Match knee bend with the trainer.");
  if (tips.length === 0) tips.push("Great match with the trainer. Maintain the pose.");

  const weightsSafe = {
    shoulder: weights?.shoulder ?? 0.25,
    elbow: weights?.elbow ?? 0.25,
    hip: weights?.hip ?? 0.25,
    knee: weights?.knee ?? 0.25,
  };
  const totalW = weightsSafe.shoulder + weightsSafe.elbow + weightsSafe.hip + weightsSafe.knee;
  const overall = Math.round(
    (shoulderScore * weightsSafe.shoulder +
      elbowScore * weightsSafe.elbow +
      hipScore * weightsSafe.hip +
      kneeScore * weightsSafe.knee) /
      (totalW || 1)
  );
  return { overall, metrics, tips };
}

export function usePoseCoach() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trainerVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const userModelRef = useRef<PoseLandmarker | null>(null);
  const trainerModelRef = useRef<PoseLandmarker | null>(null);
  const resolverRef = useRef<Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null>(null);
  const startAtRef = useRef<number>(0);
  const framesRef = useRef<PoseFrame[]>([]);
  const usedTrainerComparisonRef = useRef(false);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [ready, setReady] = useState(false);
  const [overall, setOverall] = useState(0);
  const [metrics, setMetrics] = useState<PoseMetric[]>([]);
  const [tips, setTips] = useState<string[]>(["Start camera to begin tracking."]);
  const [asanaId, setAsanaId] = useState<string | null>(null);
  const [isScoringActive, setIsScoringActive] = useState(false);
  const scoringActiveRef = useRef(false);
  const lastProcessedAtRef = useRef<number>(0);
  const processingIntervalMs = 120;

  const ensureResolver = useCallback(async () => {
    if (resolverRef.current) return resolverRef.current;
    resolverRef.current = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    return resolverRef.current;
  }, []);

  const loadUserModel = useCallback(async () => {
    if (userModelRef.current) return userModelRef.current;
    const vision = await ensureResolver();
    userModelRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return userModelRef.current;
  }, [ensureResolver]);

  const loadTrainerModel = useCallback(async () => {
    if (trainerModelRef.current) return trainerModelRef.current;
    const vision = await ensureResolver();
    trainerModelRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return trainerModelRef.current;
  }, [ensureResolver]);

  const stopTrackingLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setIsTracking(false);
  }, []);

  const startTrackingLoop = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const userModel = await loadUserModel();
    const trainerModel = await loadTrainerModel();
    setReady(true);
    setIsTracking(true);

    let lastUserTs = 0;
    let lastTrainerTs = 0;

    const run = () => {
      if (!videoRef.current || !canvasRef.current || !userModelRef.current || !trainerModelRef.current) return;
      const v = videoRef.current;
      const c = canvasRef.current;

      if (v.videoWidth && v.videoHeight) {
        c.width = v.videoWidth;
        c.height = v.videoHeight;

        if (!scoringActiveRef.current) {
          const ctx = c.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, c.width, c.height);
          rafRef.current = requestAnimationFrame(run);
          return;
        }

        const now = performance.now();
        if (now - lastProcessedAtRef.current < processingIntervalMs) {
          rafRef.current = requestAnimationFrame(run);
          return;
        }
        lastProcessedAtRef.current = now;

        const userTs = now <= lastUserTs ? lastUserTs + 1 : now;
        lastUserTs = userTs;
        const userResult = userModel.detectForVideo(v, userTs);
        const userLandmarks = userResult.landmarks?.[0] as Landmark[] | undefined;
        const trainerVideo = trainerVideoRef.current;
        const trainerTimeMs = trainerVideo ? trainerVideo.currentTime * 1000 : now;
        const trainerTs = trainerTimeMs <= lastTrainerTs ? lastTrainerTs + 1 : trainerTimeMs;
        lastTrainerTs = trainerTs;
        const trainerLandmarks = trainerVideo
          ? (trainerModel.detectForVideo(trainerVideo, trainerTs).landmarks?.[0] as Landmark[] | undefined)
          : undefined;

        const hasUser = Boolean(userLandmarks && userLandmarks.length > 0);
        const hasTrainer = Boolean(trainerLandmarks && trainerLandmarks.length > 0);

        if (hasUser) {
          drawLandmarks(c, userLandmarks as Landmark[]);
        }

        if (hasUser && hasTrainer) {
          const activeAsana = ASANAS.find((a) => a.id === asanaId);
          const ev = compareWithTrainer(
            userLandmarks as Landmark[],
            trainerLandmarks as Landmark[],
            activeAsana?.scoringWeights
          );
          usedTrainerComparisonRef.current = true;
          setOverall(ev.overall);
          setMetrics(ev.metrics);
          setTips(ev.tips);

          framesRef.current.push({
            at: Date.now(),
            overall: ev.overall,
            metrics: ev.metrics,
            tips: ev.tips,
          });
          if (framesRef.current.length > 3600) framesRef.current.shift();
        } else if (hasUser || hasTrainer) {
          setOverall(0);
          setMetrics([
            { name: "Shoulder Match", score: 0, status: "warning" },
            { name: "Elbow Match", score: 0, status: "warning" },
            { name: "Hip Match", score: 0, status: "warning" },
            { name: "Knee Match", score: 0, status: "warning" },
          ]);
          setTips(["Ensure both you and the trainer are visible in the frame."]);
        } else {
          const ctx = c.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, c.width, c.height);
          setOverall(0);
          setMetrics([
            { name: "Shoulder Level", score: 0, status: "warning" },
            { name: "Hip Level", score: 0, status: "warning" },
            { name: "Spine Alignment", score: 0, status: "warning" },
            { name: "Knee Stability", score: 0, status: "warning" },
          ]);
          setTips(["No pose detected. Step back and keep your full body in frame."]);
        }
      }

      rafRef.current = requestAnimationFrame(run);
    };

    rafRef.current = requestAnimationFrame(run);
  }, [loadUserModel, loadTrainerModel, asanaId]);

  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    streamRef.current = stream;
    video.srcObject = stream;
    await video.play();
    startAtRef.current = Date.now();
    setIsCameraOn(true);
    await startTrackingLoop();
  }, [startTrackingLoop]);

  const stopCamera = useCallback(() => {
    stopTrackingLoop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOn(false);
  }, [stopTrackingLoop]);

  const buildReport = useCallback(() => {
    const frames = framesRef.current;
    const durationSec = Math.max(1, Math.floor((Date.now() - startAtRef.current) / 1000));
    const avgScore =
      frames.length > 0
        ? Math.round(frames.reduce((a, f) => a + f.overall, 0) / frames.length)
        : 0;

    const metricMap = new Map<string, number[]>();
    const tipFreq = new Map<string, number>();

    for (const f of frames) {
      for (const m of f.metrics) {
        const arr = metricMap.get(m.name) ?? [];
        arr.push(m.score);
        metricMap.set(m.name, arr);
      }
      for (const tip of f.tips) {
        tipFreq.set(tip, (tipFreq.get(tip) ?? 0) + 1);
      }
    }

    const metricSummary = Array.from(metricMap.entries()).map(([name, vals]) => ({
      name,
      avg: Math.round(vals.reduce((a, n) => a + n, 0) / vals.length),
    }));

    const sortedMetrics = [...metricSummary].sort((a, b) => b.avg - a.avg);
    const bestMetric = sortedMetrics[0] ?? null;
    const worstMetric = sortedMetrics[sortedMetrics.length - 1] ?? null;

    const topCorrections = Array.from(tipFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tip, count]) => ({ tip, count }));

    return {
      generatedAt: new Date().toISOString(),
      durationSec,
      framesCaptured: frames.length,
      averageScore: avgScore,
      latestScore: overall,
      metricSummary,
      bestMetric,
      worstMetric,
      topCorrections,
      scoringMode: usedTrainerComparisonRef.current ? "trainer" : "self",
    };
  }, [overall]);

  const setScoringActive = useCallback((active: boolean) => {
    scoringActiveRef.current = active;
    setIsScoringActive(active);
    if (!active) {
      setOverall(0);
      setMetrics([]);
      setTips(["Start trainer video and keep camera on to begin scoring."]);
    }
  }, []);

  const setTrainerVideoElement = useCallback((el: HTMLVideoElement | null) => {
    trainerVideoRef.current = el;
  }, []);

  const setActiveAsana = useCallback((id: string) => {
    setAsanaId(id);
  }, []);

  const resetSession = useCallback(() => {
    framesRef.current = [];
    startAtRef.current = Date.now();
    usedTrainerComparisonRef.current = false;
    setOverall(0);
    setMetrics([]);
    setTips(["Start camera to begin tracking."]);
    setScoringActive(false);
  }, [setScoringActive]);

  useEffect(() => {
    return () => {
      stopCamera();
      userModelRef.current?.close();
      trainerModelRef.current?.close();
    };
  }, [stopCamera]);

  return useMemo(
    () => ({
      videoRef,
      canvasRef,
      ready,
      isCameraOn,
      isTracking,
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
    }),
    [
      ready,
      isCameraOn,
      isTracking,
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
    ]
  );
}
