export type Asana = {
  id: string;
  name: string;
  sanskrit: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  benefits: string;
  targetArea: string;
  conditions: string[];
  scoringWeights?: {
    shoulder?: number;
    elbow?: number;
    hip?: number;
    knee?: number;
  };
};

export const ASANAS: Asana[] = [
  {
    id: "cat-cow",
    name: "Cat-Cow Pose",
    sanskrit: "Marjaryasana-Bitilasana",
    difficulty: "Beginner",
    duration: "5-10 minutes",
    benefits: "Relieves lower back tension, improves spinal flexibility",
    targetArea: "Lower Back",
    conditions: ["back pain", "lower back", "spine", "posture", "stiffness", "mobility"],
    scoringWeights: { hip: 0.45, shoulder: 0.35, knee: 0.2 },
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskrit: "Balasana",
    difficulty: "Beginner",
    duration: "3-5 minutes",
    benefits: "Stretches hips, thighs, and ankles, calms the mind",
    targetArea: "Lower Back & Hips",
    conditions: ["stress", "relaxation", "hips", "lower back", "sleep", "anxiety"],
    scoringWeights: { hip: 0.4, knee: 0.3, shoulder: 0.2, elbow: 0.1 },
  },
  {
    id: "cobra",
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    difficulty: "Intermediate",
    duration: "3-5 minutes",
    benefits: "Strengthens spine, opens chest, relieves back pain",
    targetArea: "Upper & Lower Back",
    conditions: ["back pain", "spine", "chest", "posture", "upper back"],
    scoringWeights: { shoulder: 0.5, hip: 0.3, elbow: 0.2 },
  },
  {
    id: "downward-dog",
    name: "Downward Dog",
    sanskrit: "Adho Mukha Svanasana",
    difficulty: "Intermediate",
    duration: "5-8 minutes",
    benefits: "Stretches entire back, strengthens core and arms",
    targetArea: "Full Spine",
    conditions: ["hamstrings", "calves", "shoulders", "spine", "fatigue"],
    scoringWeights: { shoulder: 0.35, hip: 0.35, knee: 0.2, elbow: 0.1 },
  },
  {
    id: "bridge",
    name: "Bridge Pose",
    sanskrit: "Setu Bandha Sarvangasana",
    difficulty: "Intermediate",
    duration: "5-7 minutes",
    benefits: "Strengthens back muscles, improves posture",
    targetArea: "Lower Back & Glutes",
    conditions: ["back pain", "glutes", "core", "posture", "hip flexors"],
    scoringWeights: { hip: 0.5, knee: 0.3, shoulder: 0.2 },
  },
  {
    id: "tree",
    name: "Tree Pose",
    sanskrit: "Vrikshasana",
    difficulty: "Beginner",
    duration: "3-5 minutes",
    benefits: "Improves balance, strengthens legs, and enhances focus",
    targetArea: "Balance & Legs",
    conditions: ["balance", "focus", "legs", "ankles", "stability"],
    scoringWeights: { knee: 0.45, hip: 0.35, shoulder: 0.2 },
  },
  {
    id: "seated-forward-bend",
    name: "Seated Forward Bend",
    sanskrit: "Paschimottanasana",
    difficulty: "Beginner",
    duration: "3-5 minutes",
    benefits: "Stretches hamstrings and spine, calms the nervous system",
    targetArea: "Hamstrings & Spine",
    conditions: ["hamstrings", "spine", "calm", "stress", "flexibility"],
    scoringWeights: { hip: 0.45, knee: 0.35, shoulder: 0.2 },
  },
  {
    id: "corpse",
    name: "Corpse Pose",
    sanskrit: "Savasana",
    difficulty: "Beginner",
    duration: "5-10 minutes",
    benefits: "Deep relaxation, reduces stress and supports recovery",
    targetArea: "Relaxation",
    conditions: ["stress", "anxiety", "relaxation", "sleep", "recovery"],
    scoringWeights: { shoulder: 0.4, hip: 0.3, knee: 0.2, elbow: 0.1 },
  },
];

export const DEFAULT_ASANA_ID = "cat-cow";
