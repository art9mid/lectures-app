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
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentSource = sources.find((s) => s.id === activeSource) || sources[0];
  const currentSections = parseSections(currentSource.md);

  // Filter markdown content if searching
  const displayMd = searchQuery
    ? currentSource.md
        .split("\n")
        .filter((line) => {
          if (line.startsWith("#") || line.startsWith("---") || line.startsWith("| -")) return true;
          if (line.startsWith("|") && line.includes("Romana")) return true;
          if (line.startsWith("|") && line.includes("Перевод")) return true;
          return line.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .join("\n")
    : currentSource.md;

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center hover:bg-bg-hover cursor-pointer"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>
            )}
          </div>

          {/* Current source label — desktop only */}
          <span className="text-[12px] text-text-muted hidden md:block flex-shrink-0 truncate max-w-48">
            {currentSource.label}
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" ref={contentRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
            {searchQuery && (
              <div className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-lg bg-accent-dim border border-accent/20 text-xs sm:text-sm text-accent">
                Searching for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
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
    </div>
  );
}
