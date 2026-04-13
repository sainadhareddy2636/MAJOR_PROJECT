import os
import re
import json
import math
from collections import Counter, defaultdict
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PAPERS_DIR = Path(r"C:\Users\Siddharth\Desktop\yoga-papers")
OUT_PATH = ROOT / "src" / "data" / "researchIndex.json"

STOP_WORDS = {
    "the","and","or","a","an","to","of","in","on","at","for","with","by","from",
    "is","are","was","were","be","been","being","as","that","this","these","those",
    "it","its","their","they","them","we","our","you","your","i","me","my","mine",
    "can","could","may","might","should","would","will","not","no","yes","if","then",
    "than","such","also","into","about","over","under","between","during","after","before",
    "per","via","et","al","study","studies","trial","randomized","controlled","results",
    "method","methods","data","analysis","significant","participants","group","groups",
    "background","objective","conclusion","conclusions","introduction","discussion",
    "abstract","journal","doi","copyright","license",
}

TOKEN_RE = re.compile(r"[a-z][a-z\-]{2,}")

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()

def extract_title(reader: PdfReader) -> str:
    meta = reader.metadata
    if meta and meta.title and str(meta.title).strip() and str(meta.title).lower() != "untitled":
        return normalize(str(meta.title))[:160]
    try:
        text = (reader.pages[0].extract_text() or "")
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        # pick a line that looks like a title
        for line in lines[:15]:
            line = line.strip()
            if 12 <= len(line) <= 180 and not line.lower().startswith(("http", "doi")):
                return normalize(line)[:160]
    except Exception:
        pass
    return "unknown title"

def tokenize(text: str):
    tokens = TOKEN_RE.findall(text.lower())
    return [t for t in tokens if t not in STOP_WORDS]

def extract_text(reader: PdfReader) -> str:
    parts = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            continue
    return normalize(" ".join(parts))

def build_index():
    docs = []
    df = defaultdict(int)

    pdf_files = sorted([p for p in PAPERS_DIR.iterdir() if p.suffix.lower() == ".pdf"])
    if not pdf_files:
        raise SystemExit("No PDFs found in yoga-papers folder.")

    for pdf in pdf_files:
        reader = PdfReader(str(pdf))
        title = extract_title(reader)
        text = extract_text(reader)
        tokens = tokenize(text)
        counts = Counter(tokens)
        for term in counts.keys():
            df[term] += 1
        docs.append({
            "fileName": pdf.name,
            "title": title,
            "counts": counts,
            "total": sum(counts.values()) or 1
        })

    total_docs = len(docs)
    idf = {term: math.log((total_docs + 1) / (dfc + 1)) + 1 for term, dfc in df.items()}

    papers = []
    for d in docs:
        tfidf = {}
        for term, count in d["counts"].items():
            tf = count / d["total"]
            tfidf[term] = tf * idf.get(term, 0.0)
        # keep top 200 terms
        top_terms = sorted(tfidf.items(), key=lambda x: x[1], reverse=True)[:200]
        papers.append({
            "fileName": d["fileName"],
            "title": d["title"],
            "terms": {k: v for k, v in top_terms}
        })

    payload = {
        "version": 1,
        "docCount": total_docs,
        "idf": {k: idf[k] for k in list(idf)[:5000]},  # cap size
        "papers": papers
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")

if __name__ == "__main__":
    build_index()
