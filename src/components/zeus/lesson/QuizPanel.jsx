import React from "react";
import { motion } from "framer-motion";
import { Brain, Check, X, Trophy, RotateCcw, ChevronRight } from "lucide-react";

export default function QuizPanel({ quiz, state, answers, setAnswers, result, onStart, onSubmit, onRetry, onNext, hasNext, isAr }) {
  if (!quiz.length) return null;

  if (state === "idle") {
    return (
      <div className="zeus-glass p-6 text-center">
        <Brain className="text-zeus-gold mx-auto mb-3" style={{ width: 28, height: 28 }} />
        <h3 className="font-heading font-bold text-base mb-1">{isAr ? "جاهز للاختبار؟" : "Ready for the quiz?"}</h3>
        <p className="text-xs text-muted-foreground mb-4">{isAr ? `${quiz.length} أسئلة قصيرة لتأكد فهمك` : `${quiz.length} short questions to verify your understanding`}</p>
        <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold-sm text-sm">
          <Brain style={{ width: 16, height: 16 }} /> {isAr ? "ابدأ الاختبار" : "Start Quiz"}
        </button>
      </div>
    );
  }

  if (state === "taking") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zeus-brightgold">
          <Brain style={{ width: 13, height: 13 }} /> {isAr ? "الاختبار" : "Quiz"}
        </div>
        {quiz.map((q, qi) => (
          <div key={qi} className="zeus-glass p-4">
            <p className="font-medium text-sm mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers({ ...answers, [qi]: oi })}
                  className={`w-full text-start p-3 rounded-xl border text-sm transition flex items-center gap-2.5 ${answers[qi] === oi ? "bg-zeus-gold/15 border-zeus-gold/50 text-foreground" : "bg-secondary/20 border-border/40 text-foreground/70 hover:border-zeus-gold/30"}`}>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold ${answers[qi] === oi ? "border-zeus-gold bg-zeus-gold text-zeus-midnight" : "border-border/60"}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onSubmit} disabled={Object.keys(answers).length < quiz.length}
          className="w-full py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold-sm disabled:opacity-50 text-sm">
          {isAr ? "سلّم الاختبار" : "Submit Quiz"}
        </button>
      </div>
    );
  }

  // submitted
  return (
    <div className="space-y-3">
      <div className={`zeus-glass p-5 text-center ${result.passed ? "border-zeus-gold/40" : "border-red-500/30"}`}>
        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${result.passed ? "bg-zeus-gold/15" : "bg-red-500/10"}`}>
          {result.passed ? <Trophy className="text-zeus-gold" style={{ width: 28, height: 28 }} /> : <RotateCcw className="text-red-400" style={{ width: 28, height: 28 }} />}
        </div>
        <h3 className="font-heading font-bold text-lg mb-1">{result.passed ? (isAr ? "عاش! نجحت 🎉" : "Passed! 🎉") : (isAr ? "محتاج مراجعة" : "Needs review")}</h3>
        <p className="text-sm text-muted-foreground">{isAr ? `${result.correct} من ${result.total} صح (${result.score}%)` : `${result.correct} of ${result.total} correct (${result.score}%)`}</p>
      </div>

      {quiz.map((q, qi) => {
        const userAnswer = answers[qi];
        const isCorrect = userAnswer === q.correct;
        return (
          <div key={qi} className="zeus-glass p-4">
            <div className="flex items-start gap-2 mb-2">
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? "bg-zeus-gold/20 text-zeus-gold" : "bg-red-500/15 text-red-400"}`}>
                {isCorrect ? <Check style={{ width: 14, height: 14 }} /> : <X style={{ width: 14, height: 14 }} />}
              </div>
              <p className="font-medium text-sm flex-1">{qi + 1}. {q.question}</p>
            </div>
            <div className="ps-8 space-y-1.5">
              {!isCorrect && userAnswer !== undefined && (
                <p className="text-xs text-red-400">{isAr ? "إجابتك: " : "Your answer: "}<span className="line-through">{q.options[userAnswer]}</span></p>
              )}
              <p className="text-xs text-zeus-brightgold">{isAr ? "الصح: " : "Correct: "}{q.options[q.correct]}</p>
              {q.explanation && <p className="text-xs text-muted-foreground mt-1.5">{q.explanation}</p>}
            </div>
          </div>
        );
      })}

      <div className="flex gap-3">
        {!result.passed && (
          <button onClick={onRetry} className="flex-1 py-3 rounded-full bg-secondary/40 border border-border/60 font-semibold text-sm hover:border-zeus-gold/30 transition flex items-center justify-center gap-2">
            <RotateCcw style={{ width: 16, height: 16 }} /> {isAr ? "حاول تاني" : "Retry"}
          </button>
        )}
        {result.passed && hasNext && (
          <button onClick={onNext} className="flex-1 py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold-sm text-sm flex items-center justify-center gap-2">
            {isAr ? "الدرس التالي" : "Next Lesson"} <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        )}
        {result.passed && !hasNext && (
          <div className="flex-1 py-3 rounded-full bg-zeus-gold/15 text-zeus-brightgold font-semibold text-sm text-center">{isAr ? "خلّصت كل الدروس! 🏆" : "All lessons done! 🏆"}</div>
        )}
      </div>
    </div>
  );
}