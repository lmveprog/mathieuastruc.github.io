"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

interface Message { role: "user" | "assistant"; content: string; }

export default function Hero() {
  const { lang } = useLanguage();
  const t = T[lang].hero;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

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
    <div className="hero-root">
      <section className="hero-intro">

        {/* Portrait */}
        <div className="hero-portrait-wrap">
          <Image
            src="/images/about-portrait.png"
            alt="Mathieu Astruc"
            width={600}
            height={800}
            className="hero-portrait"
            priority
          />
        </div>

        {/* Right column: credentials + chat */}
        <div className="hero-right">
          <div className="hero-creds">
            <h1 className="hero-name">Mathieu<br />Astruc</h1>
            <p className="hero-role">{t.subtitle}</p>

            <hr className="hero-rule" />

            <p className="hero-affil">
              <span className="hero-affil-bullet">▪</span>
              {lang === "fr" ? "Ingénieur IA — Airbus Helicopters, France" : "AI Engineer — Airbus Helicopters, France"}
            </p>
            <p className="hero-affil">
              <span className="hero-affil-bullet">▪</span>
              {lang === "fr" ? "Chercheur — NTNU Gjøvik, Norvège" : "Researcher — NTNU Gjøvik, Norway"}
            </p>
            <p className="hero-affil">
              <span className="hero-affil-bullet">▪</span>
              {lang === "fr" ? "Data Engineer — Banque de France, France" : "Data Engineer — Banque de France, France"}
            </p>

            <hr className="hero-rule" />

            <span className="hero-badge">
              <span className="hero-badge-dot" />
              {lang === "fr" ? "Futur diplômé · Recherche opportunités · Oct. 2026" : "Future graduate · Seeking opportunities · Oct. 2026"}
            </span>

            <div className="hero-actions">
              <a href="/MathieuResume.pdf" target="_blank" rel="noopener noreferrer" className="hero-cv-btn">
                {lang === "fr" ? "Télécharger CV" : "Download CV"}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 1v7M3 5.5l3 3 3-3M1 11h10" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer" className="hero-link-btn">
                LinkedIn
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H3M9 1v6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Chat — inline, visible on load */}
          <div className="hero-chat-inline">
            <p className="hero-section-label">
              {lang === "fr" ? "Assistant IA" : "AI Assistant"}
            </p>
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
        </div>

      </section>
    </div>
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
