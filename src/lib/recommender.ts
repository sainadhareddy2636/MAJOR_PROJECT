import { ASANAS, Asana } from "@/lib/asanas";
import researchIndex from "@/data/researchIndex.json";
import { RESEARCH_SOURCES, ResearchSource } from "@/data/researchSources";

export type Recommendation = {
  asana: Asana;
  score: number;
  citations: ResearchSource[];
  reasons: string[];
};

const STOP_WORDS = new Set([
  "and",
  "or",
  "the",
  "a",
  "an",
  "to",
  "of",
  "for",
  "with",
  "in",
  "on",
  "at",
  "from",
  "by",
  "about",
  "my",
  "your",
  "their",
  "is",
  "are",
  "be",
  "been",
]);

const SYNONYMS: Record<string, string[]> = {
  "low back": ["lower back", "lumbar", "lumbosacral", "back"],
  "back pain": ["low back pain", "lumbar pain", "backache"],
  "neck pain": ["cervical pain", "neck stiffness"],
  "knee pain": ["knee discomfort", "knee osteoarthritis", "knee OA"],
  "hip pain": ["hip osteoarthritis", "hip OA", "hip discomfort"],
  stress: ["anxiety", "tension", "burnout"],
  balance: ["stability", "fall risk", "falls"],
  sleep: ["insomnia", "sleep quality"],
  posture: ["alignment"],
  flexibility: ["mobility", "range of motion"],
  shoulder: ["shoulder pain", "shoulder tension", "rotator cuff", "upper back"],
  ankle: ["ankle pain", "ankle instability", "ankle discomfort"],
  wrist: ["wrist pain", "wrist strain"],
  sciatic: ["sciatica", "radiating pain", "leg pain"],
  pelvic: ["pelvis", "pelvic tilt", "pelvic pain"],
  hamstring: ["hamstring tightness", "tight hamstrings"],
  calf: ["calf tightness", "calf pain"],
  headache: ["tension headache", "migraine"],
};

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text: string) =>
  normalize(text)
    .split(" ")
    .filter((t) => t && !STOP_WORDS.has(t));

const expandQuery = (text: string) => {
  const base = normalize(text);
  const expanded = new Set<string>([base]);
  Object.entries(SYNONYMS).forEach(([key, variants]) => {
    if (base.includes(key)) variants.forEach((v) => expanded.add(normalize(v)));
    variants.forEach((v) => {
      if (base.includes(v)) expanded.add(normalize(key));
    });
  });
  // Add laterality hints (left/right) without changing meaning
  if (base.includes("left") || base.includes("right")) {
    expanded.add(base.replace(/\bleft\b/g, "").replace(/\bright\b/g, "").replace(/\s+/g, " ").trim());
  }
  return Array.from(expanded);
};

const scoreByConditions = (query: string, conditions: string[]) => {
  if (!conditions.length) return 0;
  const queryVariants = expandQuery(query);
  const queryTokens = new Set(queryVariants.flatMap((q) => tokenize(q)));

  return conditions.reduce((acc, c) => {
    const cond = normalize(c);
    const phraseHit = queryVariants.some((q) => q.includes(cond));
    const condTokens = tokenize(cond);
    const tokenOverlap = condTokens.filter((t) => queryTokens.has(t)).length;
    const weighted = (phraseHit ? 3 : 0) + tokenOverlap;
    return acc + weighted;
  }, 0);
};

const pickCitations = (query: string, asana: Asana, limit = 2) => {
  const scored = RESEARCH_SOURCES.map((source) => {
    const score = Math.max(
      scoreByConditions(query, source.conditions),
      scoreByConditions(asana.targetArea, source.conditions),
      scoreByConditions(asana.name, source.conditions)
    );
    return { source, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length) return scored.slice(0, limit).map((s) => s.source);

  return RESEARCH_SOURCES.slice(0, limit);
};

type ResearchIndex = {
  idf: Record<string, number>;
  papers: { fileName: string; title: string; terms: Record<string, number> }[];
};

const INDEX = researchIndex as ResearchIndex;

const vectorFromText = (text: string) => {
  const terms = tokenize(text);
  const counts = new Map<string, number>();
  for (const t of terms) counts.set(t, (counts.get(t) ?? 0) + 1);
  const total = terms.length || 1;
  const vec: Record<string, number> = {};
  for (const [term, count] of counts) {
    const idf = INDEX.idf[term];
    if (!idf) continue;
    vec[term] = (count / total) * idf;
  }
  return vec;
};

const cosine = (a: Record<string, number>, b: Record<string, number>) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const k in a) {
    const av = a[k];
    na += av * av;
    const bv = b[k];
    if (bv) dot += av * bv;
  }
  for (const k in b) {
    const bv = b[k];
    nb += bv * bv;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

const pickResearchMatches = (query: string, limit = 4) => {
  const qVec = vectorFromText(query);
  return INDEX.papers
    .map((p) => ({ source: p, score: cosine(qVec, p.terms) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const recommendAsanas = (concern: string, details: string, limit = 3): Recommendation[] => {
  const query = `${concern} ${details}`.trim();
  const matchedResearch = pickResearchMatches(query, 4);

  const scored = ASANAS.map((asana) => {
    const asanaText = [
      asana.name,
      asana.sanskrit,
      asana.targetArea,
      asana.benefits,
      asana.conditions.join(" "),
    ].join(" ");
    const aVec = vectorFromText(asanaText);
    const score = matchedResearch.reduce((acc, m) => acc + cosine(aVec, m.source.terms), 0);
    return { asana, score };
  }).sort((a, b) => b.score - a.score || a.asana.name.localeCompare(b.asana.name));

  const filtered = scored.filter((s) => s.score > 0).slice(0, limit);
  const fallback = scored.slice(0, limit);
  const finalList = filtered.length ? filtered : fallback;

  return finalList.map((item) => ({
    asana: item.asana,
    score: item.score,
    citations: matchedResearch
      .map((m) => RESEARCH_SOURCES.find((s) => s.fileName === m.source.fileName))
      .filter((s): s is ResearchSource => Boolean(s))
      .slice(0, 2),
    reasons: matchedResearch.map((m) => m.source.title),
  }));
};
