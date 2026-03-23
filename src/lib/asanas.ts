export type Asana = {
  id: string;
  name: string;
  sanskrit: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  benefits: string;
  targetArea: string;
  effectiveness: number;
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
    effectiveness: 95,
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskrit: "Balasana",
    difficulty: "Beginner",
    duration: "3-5 minutes",
    benefits: "Stretches hips, thighs, and ankles, calms the mind",
    targetArea: "Lower Back & Hips",
    effectiveness: 92,
  },
  {
    id: "cobra",
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    difficulty: "Intermediate",
    duration: "3-5 minutes",
    benefits: "Strengthens spine, opens chest, relieves back pain",
    targetArea: "Upper & Lower Back",
    effectiveness: 88,
  },
  {
    id: "downward-dog",
    name: "Downward Dog",
    sanskrit: "Adho Mukha Svanasana",
    difficulty: "Intermediate",
    duration: "5-8 minutes",
    benefits: "Stretches entire back, strengthens core and arms",
    targetArea: "Full Spine",
    effectiveness: 90,
  },
  {
    id: "bridge",
    name: "Bridge Pose",
    sanskrit: "Setu Bandha Sarvangasana",
    difficulty: "Intermediate",
    duration: "5-7 minutes",
    benefits: "Strengthens back muscles, improves posture",
    targetArea: "Lower Back & Glutes",
    effectiveness: 87,
  },
  {
    id: "tree",
    name: "Tree Pose",
    sanskrit: "Vrikshasana",
    difficulty: "Beginner",
    duration: "3-5 minutes",
    benefits: "Improves balance, strengthens legs, and enhances focus",
    targetArea: "Balance & Legs",
    effectiveness: 89,
  },
];

export const DEFAULT_ASANA_ID = "cat-cow";
