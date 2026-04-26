"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import konspektMd from "@/content/konspekt.md";
import lecture1Md from "@/content/lecture-1.md";
import lecture2Md from "@/content/lecture-2.md";
import lecture3Md from "@/content/lecture-3.md";
import lecture4Md from "@/content/lecture-4.md";
import lecture5Md from "@/content/lecture-5.md";
import lecture6Md from "@/content/lecture-6.md";
import dictionaryMd from "@/content/dictionary.md";
import {
  BookOpen,
  ChevronLeft,
  GraduationCap,
  FileText,
  Menu,
  BookA,
  Search,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

/* ── Search result types ── */

interface FuseMatch {
  indices: [number, number][];
  key: string;
  value: string;
}

interface SearchResult {
  sourceId: string;
  sourceLabel: string;
  sectionId: string;
  sectionTitle: string;
  line: string;
  lineIndex: number;
  score?: number;
  matches?: FuseMatch[];
}

interface GroupedResults {
  sourceId: string;
  sourceLabel: string;
  results: SearchResult[];
}

/* ── Sources ── */

interface Source {
  id: string;
  label: string;
  md: string;
  icon: "file" | "book" | "dict";
}

const sources: Source[] = [
  { id: "konspekt", label: "Konspekt", icon: "file", md: konspektMd },
  { id: "lecture-1", label: "1. Alphabet & Pronunciation", icon: "book", md: lecture1Md },
  { id: "lecture-2", label: "2. Communication & Greetings", icon: "book", md: lecture2Md },
  { id: "lecture-3", label: "3. Numbers", icon: "book", md: lecture3Md },
  { id: "lecture-4", label: "4. Practical Exercises", icon: "book", md: lecture4Md },
  { id: "lecture-5", label: "5. Gender of Nouns", icon: "book", md: lecture5Md },
  { id: "lecture-6", label: "6. Feminine Gender", icon: "book", md: lecture6Md },
  { id: "dictionary", label: "Dictionary / Словарь", icon: "dict", md: dictionaryMd },
];

/* ── Parse sections from markdown ── */

interface Section {
  id: string;
  title: string;
  level: number;
}

function parseSections(md: string): Section[] {
  const sections: Section[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) {
      const level = m[1].length;
      const title = m[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-zа-яёїіє0-9\s-]/gi, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      sections.push({ id, title, level });
    }
  }
  return sections;
}

/* ── Hash routing ── */

function parseHash(): { source: string; section: string | null } {
  if (typeof window === "undefined")
    return { source: "konspekt", section: null };
  const hash = window.location.hash.replace("#", "");
  if (!hash) return { source: "konspekt", section: null };
  const [source, ...rest] = hash.split("/");
  const section = rest.join("/") || null;
  const validSource = sources.some((s) => s.id === source) ? source : "konspekt";
  return { source: validSource, section };
}

/* ── Markdown components ── */

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight mb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => {
    const text = String(children);
    const id = text
      .toLowerCase()
      .replace(/[^a-zа-яёїіє0-9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    return (
      <h2
        id={id}
        className="bg-table-header rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-bold text-table-header-text tracking-wide mt-10 sm:mt-12 mb-4 sm:mb-5 scroll-mt-14"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = String(children);
    const id = text
      .toLowerCase()
      .replace(/[^a-zа-яёїіє0-9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    return (
      <h3
        id={id}
        className="text-sm sm:text-base font-bold text-text mt-6 sm:mt-8 mb-2 sm:mb-3 scroll-mt-14"
      >
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="text-sm leading-7 text-text-secondary my-2">{children}</p>
  ),
  hr: () => <hr className="border-border my-6 sm:my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-0 sm:px-0 my-3 sm:my-4">
      <div className="min-w-[320px] sm:min-w-0 rounded-lg border border-table-border mx-4 sm:mx-0">
        <table className="w-full text-xs sm:text-sm border-collapse">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-table-header">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2.5 sm:px-4 py-2 sm:py-2.5 text-left font-semibold text-table-header-text border-b border-table-border whitespace-nowrap text-xs sm:text-sm">
      {children}
    </th>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-border/40 last:border-b-0 hover:bg-bg-hover transition-colors duration-100 even:bg-table-stripe">
      {children}
    </tr>
  ),
  td: ({ children }) => (
    <td className="px-2.5 sm:px-4 py-2 sm:py-2.5 text-text-secondary first:text-text first:font-medium text-xs sm:text-sm">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm leading-relaxed my-3 bg-info-bg border-info-border text-info-text [&_strong]:text-warning-text [&_p]:my-0.5">
      {children}
    </div>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1 my-2 text-sm text-text-secondary">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-7 flex gap-2">
      <span className="text-text-muted select-none">-</span>
      <span>{children}</span>
    </li>
  ),
  em: ({ children }) => (
    <em className="text-text-muted not-italic text-xs sm:text-sm">{children}</em>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
};

/* ── Main ── */

export default function Home() {
  const [activeSource, setActiveSource] = useState(() => parseHash().source);
  const [activeSection, setActiveSection] = useState<string | null>(
    () => parseHash().section
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedResults[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentSource = sources.find((s) => s.id === activeSource) || sources[0];
  const currentSections = parseSections(currentSource.md);
  const displayMd = currentSource.md;

  // Flat list of all results for keyboard navigation
  const flatResults = searchResults.flatMap((g) => g.results);

  // Debounced search via API
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        // Group by source
        const grouped = new Map<string, GroupedResults>();
        for (const r of data.results as SearchResult[]) {
          if (!grouped.has(r.sourceId)) {
            grouped.set(r.sourceId, {
              sourceId: r.sourceId,
              sourceLabel: r.sourceLabel,
              results: [],
            });
          }
          grouped.get(r.sourceId)!.results.push(r);
        }
        setSearchResults(Array.from(grouped.values()));
        setSelectedIndex(0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 200);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // Navigate to a search result
  const navigateToResult = useCallback(
    (result: SearchResult) => {
      setActiveSource(result.sourceId);
      setSearchOpen(false);
      setSearchQuery("");
      // Wait for source change to render, then scroll to section
      setTimeout(() => {
        if (result.sectionId) {
          const el = document.getElementById(result.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(result.sectionId);
          }
        }
      }, 150);
    },
    []
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        } else {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Search modal keyboard navigation
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        navigateToResult(flatResults[selectedIndex]);
      }
    },
    [flatResults, selectedIndex, navigateToResult]
  );

  // Update hash
  useEffect(() => {
    const hash = activeSection
      ? `${activeSource}/${activeSection}`
      : activeSource;
    if (window.location.hash !== `#${hash}`) {
      window.history.replaceState(null, "", `#${hash}`);
    }
  }, [activeSource, activeSection]);

  // Restore from hash
  useEffect(() => {
    if (initialScrollDone) return;
    const { section } = parseHash();
    if (section) {
      const timer = setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
        setInitialScrollDone(true);
      }, 150);
      return () => clearTimeout(timer);
    }
    setInitialScrollDone(true);
  }, [initialScrollDone]);

  // Track scroll for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    const container = contentRef.current;
    if (container) {
      container.querySelectorAll("h2[id], h3[id]").forEach((el) => {
        observer.observe(el);
      });
    }
    return () => observer.disconnect();
  }, [activeSource]);

  // Reset scroll on source change
  useEffect(() => {
    if (!initialScrollDone) return;
    contentRef.current?.scrollTo(0, 0);
    setActiveSection(null);
  }, [activeSource, initialScrollDone]);

  const scrollToSection = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setSidebarOpen(false);
    },
    []
  );

  const handleSourceChange = useCallback((id: string) => {
    setActiveSource(id);
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 sm:w-80
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:flex-shrink-0 border-r border-border bg-bg-surface
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h1 className="font-semibold text-sm text-text">
                  Limba Romana
                </h1>
                <p className="text-[11px] text-text-muted">
                  {sources.length} materials
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 rounded-md bg-bg-hover flex items-center justify-center hover:bg-bg-active transition-colors cursor-pointer lg:hidden"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          {/* Layer 1: Sources */}
          <div className="px-3 pt-3 pb-2">
            <p className="text-[10px] uppercase tracking-wider text-text-muted px-2 mb-2 font-medium">
              Materials
            </p>
            <div className="space-y-0.5">
              {sources.map((src) => {
                const isActive = activeSource === src.id;
                return (
                  <button
                    key={src.id}
                    onClick={() => handleSourceChange(src.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? "bg-accent-dim text-accent"
                        : "text-text-secondary hover:bg-bg-hover hover:text-text"
                    }`}
                  >
                    {src.icon === "file" ? (
                      <FileText className="w-4 h-4 flex-shrink-0" />
                    ) : src.icon === "dict" ? (
                      <BookA className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{src.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer 2: Sections */}
          <div className="flex-1 overflow-y-auto border-t border-border">
            <div className="px-3 pt-3 pb-4">
              <p className="text-[10px] uppercase tracking-wider text-text-muted px-2 mb-2 font-medium">
                Sections
              </p>
              <div className="space-y-0.5">
                {currentSections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left rounded-lg transition-colors duration-150 cursor-pointer ${
                        section.level === 3 ? "pl-7" : ""
                      } px-3 py-1.5 ${
                        isActive
                          ? "bg-bg-hover text-text"
                          : "text-text-muted hover:bg-bg-hover hover:text-text-secondary"
                      }`}
                    >
                      <span
                        className={`text-[12px] leading-snug line-clamp-2 ${
                          section.level === 3 ? "text-[11px]" : ""
                        }`}
                      >
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 sm:h-11 flex items-center px-3 sm:px-4 border-b border-border bg-bg-surface flex-shrink-0 gap-2 sm:gap-3">
          {/* Menu button (always visible on mobile, sidebar toggle on desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 sm:w-7 sm:h-7 rounded-md bg-bg-hover flex items-center justify-center hover:bg-bg-active transition-colors cursor-pointer flex-shrink-0"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-text-secondary" />
            ) : (
              <Menu className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-text-secondary" />
            )}
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 max-w-sm flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-text-muted hover:border-border-light transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left truncate">Search all materials...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-hover text-[10px] font-mono text-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Current source label — desktop only */}
          <span className="text-[12px] text-text-muted hidden md:block flex-shrink-0 truncate max-w-48">
            {currentSource.label}
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" ref={contentRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
            >
              {displayMd}
            </ReactMarkdown>
            <div className="h-24 sm:h-40" />
          </div>
        </div>
      </main>

      {/* Global search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-lg mx-4 bg-bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search across all materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
              {searchLoading && (
                <Loader2 className="w-4 h-4 text-text-muted animate-spin flex-shrink-0" />
              )}
              {searchQuery && !searchLoading && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-hover cursor-pointer flex-shrink-0"
                >
                  <X className="w-3 h-3 text-text-muted" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-bg-hover text-[10px] font-mono text-text-muted flex-shrink-0">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {searchQuery.length >= 2 && !searchLoading && flatResults.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-text-muted">
                  No results for &ldquo;{searchQuery}&rdquo;
                </div>
              )}

              {searchQuery.length >= 2 && searchQuery.length < 2 && (
                <div className="px-4 py-8 text-center text-sm text-text-muted">
                  Type at least 2 characters...
                </div>
              )}

              {!searchQuery && (
                <div className="px-4 py-8 text-center text-sm text-text-muted">
                  Search Romanian words, grammar rules, translations...
                </div>
              )}

              {searchResults.map((group) => {
                return (
                  <div key={group.sourceId}>
                    <div className="px-4 py-2 bg-bg-card/50 border-b border-border/50 sticky top-0">
                      <span className="text-[11px] uppercase tracking-wider font-medium text-text-muted">
                        {group.sourceLabel}
                      </span>
                      <span className="text-[10px] text-text-muted ml-2">
                        ({group.results.length})
                      </span>
                    </div>
                    {group.results.map((result, i) => {
                      const globalIndex = flatResults.indexOf(result);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={`${result.sourceId}-${result.lineIndex}-${i}`}
                          onClick={() => navigateToResult(result)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-accent-dim"
                              : "hover:bg-bg-hover"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-text-muted mb-0.5">
                              {result.sectionTitle}
                            </div>
                            <HighlightedText
                              text={result.line}
                              matches={result.matches}
                            />
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-3.5 h-3.5 text-accent mt-1 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {flatResults.length > 0 && (
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-bg-hover font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-bg-hover font-mono">↵</kbd>
                  open
                </span>
                <span className="ml-auto">{flatResults.length} results</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Highlight matches using Fuse indices ── */

function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches?: FuseMatch[];
}) {
  if (!matches || matches.length === 0) {
    return <p className="text-xs text-text-secondary line-clamp-2">{text}</p>;
  }

  // Merge all match indices and sort
  const indices = matches
    .flatMap((m) => m.indices)
    .sort((a, b) => a[0] - b[0]);

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of indices) {
    if (start > lastEnd) {
      parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd, start)}</span>);
    }
    parts.push(
      <mark
        key={`m-${start}`}
        className="bg-accent/25 text-accent-hover rounded-sm px-0.5"
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    lastEnd = end + 1;
  }
  if (lastEnd < text.length) {
    parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd)}</span>);
  }

  return <p className="text-xs text-text-secondary line-clamp-2">{parts}</p>;
}
