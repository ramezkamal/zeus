import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export default function ChatPanel({ messages, onSend, typing, placeholder, companionName, t, lang }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Speak the last AI response when speak is enabled
  useEffect(() => {
    if (!speakEnabled || !messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "assistant" && lastMsg.content !== lastSpokenRef.current) {
      lastSpokenRef.current = lastMsg.content;
      speak(lastMsg.content);
    }
  }, [messages, speakEnabled]);

  const speak = (content) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(content);
    utter.lang = lang === "ar" ? "ar-EG" : "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = lang === "ar" ? "ar-EG" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      setText(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleSpeak = () => {
    if (speakEnabled) {
      window.speechSynthesis?.cancel();
    }
    setSpeakEnabled(!speakEnabled);
  };

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
              <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-zeus-gold/40 me-2 mt-0.5">
                <img src="https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/d926a568e_image-removebg-preview1.png" alt="Zeus" className="w-full h-full object-cover object-top" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-zeus-gold text-zeus-midnight rounded-ee-sm font-medium"
                : "bg-card border border-border/60 rounded-es-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-zeus-gold/40 me-2">
              <img src="https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/d926a568e_image-removebg-preview1.png" alt="Zeus" className="w-full h-full object-cover object-top" />
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
          placeholder={listening ? (lang === "ar" ? "بتسمع..." : "Listening...") : placeholder}
          className="flex-1 px-4 py-3 rounded-full bg-card border border-border/60 focus:zeus-gold-border outline-none text-sm transition"
        />
        <button type="button" onClick={toggleSpeak}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition ${
            speakEnabled ? "bg-zeus-gold/20 text-zeus-gold border border-zeus-gold/50" : "bg-card border border-border/60 text-muted-foreground hover:text-zeus-gold"
          }`}
          title={lang === "ar" ? "رد صوتي" : "Voice replies"}>
          {speakEnabled ? <Volume2 style={{ width: 18, height: 18 }} /> : <VolumeX style={{ width: 18, height: 18 }} />}
        </button>
        <button type="button" onClick={listening ? stopListening : startListening}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition ${
            listening ? "bg-red-500 text-white animate-pulse" : "bg-card border border-border/60 text-muted-foreground hover:text-zeus-gold"
          }`}
          title={lang === "ar" ? "تحدث" : "Voice input"}>
          {listening ? <MicOff style={{ width: 18, height: 18 }} /> : <Mic style={{ width: 18, height: 18 }} />}
        </button>
        <button type="submit" disabled={typing || !text.trim()} className="w-11 h-11 shrink-0 rounded-full bg-zeus-gold text-zeus-midnight flex items-center justify-center hover:bg-zeus-brightgold transition disabled:opacity-40 shadow-gold-sm">
          <Send style={{ width: 18, height: 18 }} />
        </button>
      </form>
    </div>
  );
}