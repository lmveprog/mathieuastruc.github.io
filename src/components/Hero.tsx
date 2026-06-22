"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

interface Message { role: "user" | "assistant"; content: string; }

/** Start year extracted from a period string like "Mar 2026\nSep 2026" or "2025 · NTNU". */
function startYear(period: string): string {
  const first = period.split("\n")[0].trim();
  const yearMatch = first.match(/\d{4}/);
  if (yearMatch) return yearMatch[0];
  return first.split(/[\s·]+/)[0];
}

/** Context after the year, e.g. "2025 · NTNU" -> "NTNU". */
function periodContext(period: string): string | null {
  const parts = period.split("·");
  return parts.length > 1 ? parts.slice(1).join("·").trim() : null;
}

const ArrowIcon = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 9L9 1M9 1H3M9 1v6" />
  </svg>
);

export default function Hero() {
  const { lang } = useLanguage();
  const t = T[lang];
  const h = t.home;
  const experiences = t.career.experiences;
  const projects = t.projects.items.slice(0, 4);

  return (
    <main className="home">
      {/* ── Header — short intro, work comes right after ── */}
      <header className="home-head">
        <div className="home-head-text">
          <h1 className="home-name">Mathieu Astruc</h1>
          <p className="home-role">{t.hero.subtitle}</p>
          <p className="home-headline">{t.hero.headline}</p>

          <div className="home-actions">
            <a href="/MathieuResume.pdf" target="_blank" rel="noopener noreferrer" className="hero-cv-btn">
              {lang === "fr" ? "Telecharger CV" : "Download CV"}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 1v7M3 5.5l3 3 3-3M1 11h10" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer" className="hero-link-btn">
              LinkedIn<ArrowIcon />
            </a>
            <a href="mailto:mathastruc@gmail.com" className="hero-link-btn">
              Email<ArrowIcon />
            </a>
          </div>

          <p className="home-avail">
            <span className="hero-badge-dot" />
            {t.about.availability}
          </p>
        </div>

        <div className="home-portrait">
          <Image
            src="/images/about-portrait.png"
            alt="Mathieu Astruc"
            width={300}
            height={400}
            priority
          />
        </div>
      </header>

      {/* ── Experience ── */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>{t.career.title}</h2>
          <Link href="/career" className="home-more">{h.viewAllExperience} →</Link>
        </div>
        <ul className="home-list">
          {experiences.map((e, i) => (
            <li key={i} className="home-row">
              <span className="home-row-year">{startYear(e.period)}</span>
              <div className="home-row-body">
                <div className="home-row-title">
                  <div className="home-row-titlemain">
                    <span className="home-row-co">{e.company}</span>
                    <span className="home-row-role">{e.role.split(" - ")[0]}</span>
                    {e.current && <span className="home-row-current">{t.career.current}</span>}
                  </div>
                  {e.logo && e.logoSize && (
                    <Image
                      src={e.logo}
                      alt={e.company}
                      width={e.logoSize.w}
                      height={e.logoSize.h}
                      className="home-row-logo"
                    />
                  )}
                </div>
                <p className="home-row-desc">{e.bullets?.[0] ?? e.description}</p>
                {e.videos && e.videos.length > 0 && (
                  <a href={e.videos[0].url} target="_blank" rel="noopener noreferrer" className="home-row-demo">
                    ▸ {h.demo}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Selected projects ── */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>{h.selectedProjects}</h2>
          <Link href="/projects" className="home-more">{h.viewAllProjects} →</Link>
        </div>
        <ul className="home-list">
          {projects.map((p, i) => {
            const ctx = periodContext(p.period);
            return (
              <li key={i} className="home-row">
                <span className="home-row-year">{startYear(p.period)}</span>
                <div className="home-row-body">
                  <div className="home-row-title">
                    <div className="home-row-titlemain">
                      <span className="home-row-co">{p.title}</span>
                      {ctx && <span className="home-row-role">{ctx}</span>}
                    </div>
                  </div>
                  <p className="home-row-desc">{p.description}</p>
                  <div className="home-row-tags">
                    {p.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  {p.videos && p.videos.length > 0 && (
                    <a href={p.videos[0].url} target="_blank" rel="noopener noreferrer" className="home-row-demo">
                      ▸ {h.demo}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Ask my AI — demoted, optional ── */}
      <AskMyAI />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Demoted AI assistant — collapsed behind a button by default  */
/* ─────────────────────────────────────────────────────────── */
function AskMyAI() {
  const { lang } = useLanguage();
  const t = T[lang].hero;
  const h = T[lang].home;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming, open]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setStreaming("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      if (!res.ok || !res.body) throw new Error("API error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreaming(acc);
      }
      setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
      setStreaming("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lang === "fr" ? "Une erreur s'est produite. Réessaie." : "Something went wrong. Please try again." },
      ]);
      setStreaming("");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, lang]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  return (
    <section className="home-ai">
      <div className="home-section-head">
        <h2>{h.askTitle}</h2>
        {open && (
          <button className="home-more" onClick={() => setOpen(false)}>{h.askClose} ✕</button>
        )}
      </div>

      {!open ? (
        <button
          className="home-ai-toggle"
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 60); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {h.askOpen}
        </button>
      ) : (
        <div className="home-ai-panel">
          <p className="home-ai-subtitle">{h.askSubtitle}</p>
          <div className="hero-chat">
            {hasMessages && (
              <div className="hero-messages">
                {messages.map((msg, i) => <MessageRow key={i} message={msg} />)}
                {streaming && <MessageRow message={{ role: "assistant", content: streaming }} isStreaming />}
                {loading && !streaming && (
                  <div className="hero-dots">
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.18}s` }} />
                    ))}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
            <div className="hero-input-wrap">
              <textarea
                ref={inputRef}
                value={input}
                onChange={onInput}
                onKeyDown={onKeyDown}
                placeholder={hasMessages ? t.placeholderMore : t.placeholder}
                rows={1}
                className="hero-textarea"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="hero-send"
                aria-label="Send"
              >
                <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 11V2M6.5 2L2 6.5M6.5 2L11 6.5" />
                </svg>
              </button>
            </div>
            {!hasMessages && (
              <div className="hero-chips">
                {t.suggestions.map((q) => (
                  <button key={q} onClick={() => send(q)} className="hero-chip">{q}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function MessageRow({ message, isStreaming }: { message: { role: string; content: string }; isStreaming?: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={`hero-msg ${isUser ? "hero-msg-user" : "hero-msg-ai"}`}>
      {isUser ? (
        <p className="hero-msg-user-text">{message.content}</p>
      ) : (
        <p className="hero-msg-ai-text">
          {message.content}
          {isStreaming && <span className="hero-cursor" />}
        </p>
      )}
    </div>
  );
}
