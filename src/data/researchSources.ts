export type ResearchSource = {
  id: string;
  title: string;
  fileName: string;
  conditions: string[];
};

// TODO: Replace titles and conditions with your actual paper metadata.
// Each item should list the health conditions discussed by the paper (keywords),
// e.g. ["low back pain", "neck pain", "stress", "balance", "knee osteoarthritis"].
export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: "12967_2022_article_3356",
    title:
      "A randomized controlled trial of the influence of yoga for women with symptoms of post-traumatic stress disorder",
    fileName: "12967_2022_Article_3356.pdf",
    conditions: ["ptsd", "post-traumatic stress", "anxiety", "stress", "depression", "trauma"],
  },
  {
    id: "bmjsem-2020-000878",
    title:
      "Yoga-based exercise to prevent falls in community-dwelling people aged 60 years and over: study protocol for the SAGE trial",
    fileName: "bmjsem-2020-000878.pdf",
    conditions: ["balance", "falls", "older adults", "stability", "mobility"],
  },
  {
    id: "dtsch_arztebl_int-111-0592",
    title: "Exercise Therapy in Hip Osteoarthritis — A Randomized Controlled Trial",
    fileName: "Dtsch_Arztebl_Int-111-0592.pdf",
    conditions: ["hip osteoarthritis", "hip pain", "mobility", "stiffness"],
  },
  {
    id: "ecam2013-607134",
    title: "A Randomized Controlled Trial on the Effects of Yoga on Stress Reactivity in 6th Grade Students",
    fileName: "ECAM2013-607134.pdf",
    conditions: ["stress", "anxiety", "stress reactivity", "students", "adolescents"],
  },
  {
    id: "fpsyt-09-00180",
    title: "Effect of Yoga Based Lifestyle Intervention on Patients With Knee Osteoarthritis: A Randomized Controlled Trial",
    fileName: "fpsyt-09-00180.pdf",
    conditions: ["knee osteoarthritis", "knee pain", "stiffness", "mobility"],
  },
  {
    id: "healthcare-13-00124",
    title:
      "The Effects of Yoga on Fall-Related Physical Functions for Older Women: A Systematic Review of Randomized Controlled Trials",
    fileName: "healthcare-13-00124.pdf",
    conditions: ["balance", "falls", "older adults", "strength", "mobility"],
  },
  {
    id: "ijy-8-3",
    title: "Effectiveness of Iyengar yoga in treating spinal (back and neck) pain: A systematic review",
    fileName: "IJY-8-3.pdf",
    conditions: ["back pain", "neck pain", "spine", "posture", "stiffness"],
  },
  {
    id: "jpts-28-2171",
    title: "Effects of yoga on chronic neck pain: a systematic review of randomized controlled trials",
    fileName: "jpts-28-2171.pdf",
    conditions: ["neck pain", "cervical pain", "stiffness", "posture"],
  },
  {
    id: "nihms-1891283",
    title: "How Does Yoga Reduce Stress? A Clinical Trial Testing Psychological Mechanisms",
    fileName: "nihms-1891283.pdf",
    conditions: ["stress", "anxiety", "mindfulness", "psychological"],
  },
  {
    id: "nihms-2068820",
    title: "A Randomized Controlled Trial of Community-Delivered Heated Hatha Yoga for Moderate-to-Severe Depression",
    fileName: "nihms-2068820.pdf",
    conditions: ["depression", "mood", "anxiety"],
  },
  {
    id: "nihms9803",
    title: "Randomized, Controlled, Six-Month Trial of Yoga in Healthy Seniors: Effects on Cognition and Quality of Life",
    fileName: "nihms9803.pdf",
    conditions: ["older adults", "quality of life", "wellbeing", "cognition"],
  },
  {
    id: "pnaa150",
    title:
      "Changes in Perceived Stress After Yoga, Physical Therapy, and Education Interventions for Chronic Low Back Pain",
    fileName: "pnaa150.pdf",
    conditions: ["low back pain", "back pain", "stress", "chronic pain"],
  },
  {
    id: "pone.0173869",
    title: "Treating major depression with yoga: A prospective, randomized, controlled pilot trial",
    fileName: "pone.0173869.pdf",
    conditions: ["depression", "mood", "anxiety"],
  },
  {
    id: "pone.0195653",
    title: "Efficacy of a biomechanically-based yoga exercise program in knee osteoarthritis: A randomized controlled trial",
    fileName: "pone.0195653.pdf",
    conditions: ["knee osteoarthritis", "knee pain", "mobility", "stiffness"],
  },
  {
    id: "pone.0204925",
    title: "Hatha yoga for acute, chronic and/or treatment-resistant mood and anxiety disorders: A systematic review and meta-analysis",
    fileName: "pone.0204925.pdf",
    conditions: ["anxiety", "depression", "mood", "stress"],
  },
];
