// src/components/ui/TableOfContents.tsx
"use client";

import { useEffect, useState } from "react";
import { List, ChevronRight } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3");

    const extractedHeadings: Heading[] = Array.from(headingElements).map(
      (el, index) => {
        const text = el.textContent || "";
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        el.id = id;
        return { id, text, level: parseInt(el.tagName[1]) };
      },
    );

    setHeadings(extractedHeadings);

    // Add IDs to DOM elements
    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      el.id = id;
    });

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    headingElements.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="toc-container">
      <div className="toc-header">
        <List size={16} />
        <span>Daftar Isi</span>
      </div>
      <nav className="toc-nav">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`toc-link toc-level-${heading.level} ${
              activeId === heading.id ? "toc-link-active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <ChevronRight size={12} className="toc-icon" />
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
