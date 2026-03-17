"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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


  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streaming]);

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
      setMessages((prev) => [...prev, { role: "assistant", content: lang === "fr" ? "Une erreur s'est produite. Réessaie." : "Something went wrong. Please try again." }]);
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
    <main style={{ position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px clamp(1.25rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)" }}>
      <div style={{ width:"100%",maxWidth:"680px",background:"rgba(255,255,255,0.72)",backdropFilter:"blur(32px) saturate(1.8)",WebkitBackdropFilter:"blur(32px) saturate(1.8)",borderRadius:"28px",border:"0.5px solid rgba(255,255,255,0.9)",boxShadow:"0 4px 40px rgba(0,0,0,0.06)",padding:"clamp(1.75rem, 4vw, 2.75rem)",display:"flex",flexDirection:"column",gap:"var(--space-lg)" }}>

        {/* Header */}
        <div style={{ textAlign:"center",transition:"all 500ms cubic-bezier(0.16,1,0.3,1)",opacity:hasMessages?0.35:1,transform:hasMessages?"scale(0.88) translateY(-4px)":"scale(1)",animation:"fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both" }}>
          <h1 style={{ fontSize:"var(--text-hero)",fontWeight:600,letterSpacing:"-0.04em",lineHeight:1,color:"var(--color-text)",marginBottom:"var(--space-sm)" }}>
            Mathieu Astruc
          </h1>
          <p style={{ fontSize:"var(--text-xl)",fontWeight:300,color:"var(--color-text-secondary)",letterSpacing:"-0.015em",margin:0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* Messages */}
        {hasMessages && (
          <div>
            {messages.map((msg, i) => <MessageRow key={i} message={msg} />)}
            {streaming && <MessageRow message={{ role:"assistant", content:streaming }} isStreaming />}
            {loading && !streaming && (
              <div style={{ display:"flex",gap:"5px",alignItems:"center",marginBottom:"var(--space-lg)",animation:"fadeIn 0.3s ease" }}>
                {[0,1,2].map((i) => <span key={i} style={{ display:"block",width:"5px",height:"5px",borderRadius:"50%",background:"var(--color-text-tertiary)",animation:"dotBounce 1.3s ease infinite",animationDelay:`${i*0.18}s` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div>
          <div
            style={{ display:"flex",alignItems:"flex-end",gap:"10px",padding:"clamp(10px,1.5vw,14px) clamp(12px,2vw,18px)",background:"rgba(0,0,0,0.03)",borderRadius:"var(--radius-xl)",border:"0.5px solid var(--color-border-strong)",transition:"border-color 120ms ease, background 120ms ease" }}
            onFocusCapture={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor="rgba(0,0,0,0.22)"; el.style.background="rgba(0,0,0,0.02)"; }}
            onBlurCapture={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor="var(--color-border-strong)"; el.style.background="rgba(0,0,0,0.03)"; }}
          >
            <textarea ref={inputRef} value={input} onChange={onInput} onKeyDown={onKeyDown}
              placeholder={hasMessages ? t.placeholderMore : t.placeholder}
              rows={1}
              style={{ flex:1,background:"none",border:"none",outline:"none",resize:"none",fontSize:"var(--text-base)",color:"var(--color-text)",fontFamily:"inherit",lineHeight:1.55,letterSpacing:"-0.01em",overflow:"hidden",caretColor:"var(--color-text)" }}
            />
            <SendButton active={!!input.trim() && !loading} onClick={() => send(input)} />
          </div>

          {!hasMessages && (
            <div style={{ display:"flex",flexWrap:"wrap",gap:"var(--space-xs)",marginTop:"var(--space-md)",justifyContent:"center",animation:"fadeIn 1s ease 0.45s both" }}>
              {t.suggestions.map((q) => <SuggestionChip key={q} label={q} onSelect={() => send(q)} />)}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

function MessageRow({ message, isStreaming }: { message: { role: string; content: string }; isStreaming?: boolean }) {
  const isUser = message.role === "user";
  return (
    <div style={{ marginBottom:"var(--space-lg)",display:"flex",flexDirection:"column",alignItems:isUser?"flex-end":"flex-start",animation:"fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
      {isUser ? (
        <p style={{ fontSize:"var(--text-lg)",fontWeight:500,color:"var(--color-text)",letterSpacing:"-0.02em",lineHeight:1.4,maxWidth:"85%" }}>{message.content}</p>
      ) : (
        <p style={{ fontSize:"var(--text-base)",fontWeight:400,color:"var(--color-text-secondary)",letterSpacing:"-0.01em",lineHeight:1.72,maxWidth:"100%",whiteSpace:"pre-wrap" }}>
          {message.content}
          {isStreaming && <span style={{ display:"inline-block",width:"1.5px",height:"1.05em",background:"var(--color-text-tertiary)",marginLeft:"2px",verticalAlign:"text-bottom",animation:"cursorBlink 0.9s ease infinite" }} />}
        </p>
      )}
    </div>
  );
}

function SendButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={!active} aria-label="Send"
      style={{ width:"30px",height:"30px",flexShrink:0,borderRadius:"50%",border:active?"none":"0.5px solid var(--color-border-strong)",background:active?"var(--color-text)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:active?"pointer":"default",transition:"background 120ms ease, border-color 120ms ease" }}>
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M6.5 11V2M6.5 2L2 6.5M6.5 2L11 6.5" stroke={active?"white":"var(--color-text-tertiary)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function SuggestionChip({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <button onClick={onSelect}
      style={{ padding:"5px 13px",borderRadius:"var(--radius-full)",background:"transparent",border:"0.5px solid var(--color-border-strong)",fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",cursor:"pointer",letterSpacing:"-0.01em",transition:"background 120ms ease, color 120ms ease",fontFamily:"inherit",lineHeight:1.5 }}
      onMouseEnter={(e) => { e.currentTarget.style.background="rgba(0,0,0,0.05)"; e.currentTarget.style.color="var(--color-text)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--color-text-secondary)"; }}
    >{label}</button>
  );
}
