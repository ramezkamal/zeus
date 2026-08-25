import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatPanel({ messages, onSend, typing, placeholder, companionName, t }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const submit = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v || typing) return;
    onSend(v);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-white flex items-center justify-center text-xs font-bold me-2 mt-0.5">
                {(companionName || "Z").charAt(0).toUpperCase()}
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-zeus-gold text-white rounded-ee-sm font-medium"
                : "bg-card border border-border/60 rounded-es-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-white flex items-center justify-center text-xs font-bold me-2">
              {(companionName || "Z").charAt(0).toUpperCase()}
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-es-sm bg-card border border-border/60 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zeus-gold animate-pulse-soft" />
              <span className="w-2 h-2 rounded-full bg-zeus-gold animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-zeus-gold animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-full bg-card border border-border/60 focus:zeus-gold-border outline-none text-sm transition"
        />
        <button type="submit" disabled={typing || !text.trim()} className="w-11 h-11 shrink-0 rounded-full bg-zeus-gold text-white flex items-center justify-center hover:bg-zeus-brightgold transition disabled:opacity-40 shadow-gold-sm">
          <Send style={{ width: 18, height: 18 }} />
        </button>
      </form>
    </div>
  );
}