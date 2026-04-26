import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

interface SourceDef {
  id: string;
  label: string;
  file: string;
}

const sourceDefs: SourceDef[] = [
  { id: "konspekt", label: "Konspekt", file: "konspekt.md" },
  { id: "lecture-1", label: "1. Alphabet & Pronunciation", file: "lecture-1.md" },
  { id: "lecture-2", label: "2. Communication & Greetings", file: "lecture-2.md" },
  { id: "lecture-3", label: "3. Numbers", file: "lecture-3.md" },
  { id: "lecture-4", label: "4. Practical Exercises", file: "lecture-4.md" },
  { id: "lecture-5", label: "5. Gender of Nouns", file: "lecture-5.md" },
  { id: "lecture-6", label: "6. Feminine Gender", file: "lecture-6.md" },
  { id: "dictionary", label: "Dictionary / Словарь", file: "dictionary.md" },
];

interface SearchEntry {
  sourceId: string;
  sourceLabel: string;
  sectionId: string;
  sectionTitle: string;
  line: string;
  lineIndex: number;
}

function toSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zа-яёїіє0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

// Build the index once, cache in module scope
let fuse: Fuse<SearchEntry> | null = null;

function getIndex(): Fuse<SearchEntry> {
  if (fuse) return fuse;

  const contentDir = path.join(process.cwd(), "src", "content");
  const entries: SearchEntry[] = [];

  for (const def of sourceDefs) {
    const md = fs.readFileSync(path.join(contentDir, def.file), "utf-8");
    const lines = md.split("\n");
    let currentSection = { id: "", title: def.label };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track current section
      const headingMatch = line.match(/^(#{2,3})\s+(.+)/);
      if (headingMatch) {
        const title = headingMatch[2].trim();
        currentSection = { id: toSectionId(title), title };
      }

      // Skip structure-only lines
      if (line.match(/^---\s*$/) || line.match(/^\|\s*-/) || !line.trim()) continue;

      // Clean display text
      let displayLine = line;
      if (line.startsWith("#")) {
        displayLine = line.replace(/^#+\s+/, "");
      } else if (line.startsWith("|")) {
        displayLine = line
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean)
          .join(" — ");
      }

      entries.push({
        sourceId: def.id,
        sourceLabel: def.label,
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
        line: displayLine,
        lineIndex: i,
      });
    }
  }

  fuse = new Fuse(entries, {
    keys: ["line"],
    threshold: 0.35,
    distance: 200,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });

  return fuse;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return Response.json({ results: [], query: q || "" });
  }

  const index = getIndex();
  const raw = index.search(q, { limit: 50 });

  const results = raw.map((r) => ({
    sourceId: r.item.sourceId,
    sourceLabel: r.item.sourceLabel,
    sectionId: r.item.sectionId,
    sectionTitle: r.item.sectionTitle,
    line: r.item.line,
    lineIndex: r.item.lineIndex,
    score: r.score,
    matches: r.matches,
  }));

  return Response.json({ results, query: q });
}
