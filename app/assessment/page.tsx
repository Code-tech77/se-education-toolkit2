"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Award, RotateCcw, Download, Sparkles, BookOpen, Layers, Play } from "lucide-react";
import Footer from "@/components/Footer";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizHistoryItem {
  questionText: string;
  options: string[];
  selectedOptionText: string;
  correctOptionText: string;
  isCorrect: boolean;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const topics = [
  "Requirements Engineering",
  "User Stories",
  "Acceptance Criteria",
  "UML Class Diagrams",
  "Software Testing",
];

const gradeBadges = (pct: number) => {
  if (pct === 100) return { title: "Software Architect Master 👑", color: "from-amber-400 to-yellow-650" };
  if (pct >= 80) return { title: "Senior Systems Modeler 💎", color: "from-accent-sky to-accent-indigo" };
  if (pct >= 60) return { title: "Agile Practitioner ⚙️", color: "from-emerald-400 to-teal-600" };
  return { title: "Requirements Apprentice 🎓", color: "from-slate-400 to-navy-700" };
};

export default function AssessmentPage() {
  const [phase, setPhase] = useState<"config" | "quiz" | "results">("config");
  
  // Configuration States
  const [selectedTopic, setSelectedTopic] = useState("Requirements Engineering");
  const [questionCount, setQuestionCount] = useState(5);
  
  // Live Quiz States
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Analytics States
  const [difficultyScores, setDifficultyScores] = useState({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  });
  const [askedQuestionsList, setAskedQuestionsList] = useState<string[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);

  // Start Assessment workflow
  const startQuiz = async () => {
    setPhase("quiz");
    setCurrentQuestionNumber(1);
    setScore(0);
    setDifficulty("easy");
    setAskedQuestionsList([]);
    setQuizHistory([]);
    setDifficultyScores({
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    });
    await loadNextQuestion("easy", []);
  };

  // Call API to load next question
  const loadNextQuestion = async (targetDifficulty: "easy" | "medium" | "hard", excludeList: string[]) => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: targetDifficulty,
          excludeQuestions: excludeList,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch question");
      
      setCurrentQuestion(data.question);
      setAskedQuestionsList((prev) => [...prev, data.question.question]);
    } catch (err) {
      console.error(err);
      // Fail-safe default question structured safely if network/server fails completely
      setCurrentQuestion({
        question: `Explain a primary property of ${selectedTopic}.`,
        options: [
          "It is standard practice in software systems.",
          "It reduces overall lifecycle risks.",
          "It is a core phase in systems engineering.",
          "All of the above."
        ],
        correctIndex: 3,
        explanation: "This fallback is displayed due to a local connection failure. All options correct."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit current answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsAnswerSubmitted(true);
    
    // Add to score
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Record difficulty metrics
    setDifficultyScores((prev) => {
      const next = { ...prev };
      next[difficulty].total += 1;
      if (isCorrect) next[difficulty].correct += 1;
      return next;
    });

    // Record question history
    const historyItem: QuizHistoryItem = {
      questionText: currentQuestion.question,
      options: currentQuestion.options,
      selectedOptionText: currentQuestion.options[selectedOption],
      correctOptionText: currentQuestion.options[currentQuestion.correctIndex],
      isCorrect,
      explanation: currentQuestion.explanation,
      difficulty,
    };
    setQuizHistory((prev) => [...prev, historyItem]);

    // Adaptive difficulty logic:
    // If correct: Easy -> Medium -> Hard
    // If incorrect: Hard -> Medium -> Easy
    if (isCorrect) {
      if (difficulty === "easy") setDifficulty("medium");
      else if (difficulty === "medium") setDifficulty("hard");
    } else {
      if (difficulty === "hard") setDifficulty("medium");
      else if (difficulty === "medium") setDifficulty("easy");
    }
  };

  // Progress to next question or complete
  const handleNext = async () => {
    if (currentQuestionNumber >= questionCount) {
      setPhase("results");
    } else {
      const nextNum = currentQuestionNumber + 1;
      setCurrentQuestionNumber(nextNum);
      
      // Determine target difficulty for next question (already updated in state)
      // Note: State might not have flushed, so we compute directly to be robust
      const lastAnswerCorrect = selectedOption === currentQuestion?.correctIndex;
      let nextDifficulty = difficulty;
      if (lastAnswerCorrect) {
        if (difficulty === "easy") nextDifficulty = "medium";
        else if (difficulty === "medium") nextDifficulty = "hard";
      } else {
        if (difficulty === "hard") nextDifficulty = "medium";
        else if (difficulty === "medium") nextDifficulty = "easy";
      }

      await loadNextQuestion(nextDifficulty, askedQuestionsList);
    }
  };

  // Generate and download report
  const downloadReport = () => {
    const pct = Math.round((score / questionCount) * 100);
    const badge = gradeBadges(pct).title;
    
    let recommendationsHTML = "";
    if (pct === 100) {
      recommendationsHTML = "<p>Outstanding job! You demonstrated complete mastery. Try taking a quiz on another topic or review the talks section to extend your learning.</p>";
    } else {
      recommendationsHTML = "<p>Here are targeted suggestions based on your answers:</p><ul>";
      if (difficultyScores.hard.correct < difficultyScores.hard.total) {
        recommendationsHTML += "<li><strong>Master Advanced UML/Gherkin</strong>: You struggled with high-difficulty conceptual edge cases. We recommend exploring the <em>Expert Mentor Persona</em> in Labs to test critical boundaries.</li>";
      }
      if (difficultyScores.medium.correct < difficultyScores.medium.total) {
        recommendationsHTML += "<li><strong>Refine Story Slicing</strong>: Practice dividing large user stories and refining ambiguous requirements. Refer to Lab 2 (User Story Wizard Game).</li>";
      }
      if (pct < 60) {
        recommendationsHTML += "<li><strong>Review Definitions</strong>: Review basic definitions of functional vs. non-functional requirements. Go through Lab 1 (Requirements Elicitation).</li>";
      }
      recommendationsHTML += "</ul>";
    }

    const historyHTML = quizHistory.map((item, idx) => `
      <div class="question-box ${item.isCorrect ? 'correct' : 'incorrect'}">
        <div class="q-header">
          <strong>Question ${idx + 1} [${item.difficulty.toUpperCase()}]</strong>
          <span class="badge">${item.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}</span>
        </div>
        <p class="q-text">${item.questionText}</p>
        <div class="options-list">
          ${item.options.map((opt, i) => {
            const isSelected = opt === item.selectedOptionText;
            const isCorrectOpt = opt === item.correctOptionText;
            let optClass = "";
            if (isCorrectOpt) optClass = "correct-opt";
            else if (isSelected && !item.isCorrect) optClass = "wrong-opt";
            return `<div class="opt-item ${optClass}">${opt} ${isSelected ? '<strong>(Your Choice)</strong>' : ''}</div>`;
          }).join("")}
        </div>
        <div class="explanation">
          <strong>Explanation:</strong> ${item.explanation}
        </div>
      </div>
    `).join("");

    const reportHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SE Education Toolkit - Assessment Report</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 30px; background: #f8fafc; color: #0f172a; }
    .container { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 30px; margin-bottom: 35px; }
    .title { color: #0a192f; margin: 0; font-size: 28px; font-weight: 800; }
    .subtitle { color: #64748b; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }
    .score-circle { display: inline-flex; flex-direction: column; justify-content: center; align-items: center; width: 140px; height: 140px; border-radius: 50%; background: #0a192f; color: white; margin: 20px 0; }
    .score-num { font-size: 44px; font-weight: 900; line-height: 1; }
    .score-pct { font-size: 14px; font-weight: 700; color: #38bdf8; margin-top: 2px; }
    .badge-grade { font-size: 16px; font-weight: 800; margin-top: 10px; color: #0ea5e9; }
    .section-title { font-size: 18px; font-weight: 800; color: #0a192f; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px; }
    .stats-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .stats-table th, .stats-table td { padding: 12px 15px; border: 1px solid #e2e8f0; text-align: left; }
    .stats-table th { background: #f8fafc; font-weight: 700; color: #0a192f; }
    .question-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 25px; border-left: 5px solid #cbd5e1; }
    .question-box.correct { border-left-color: #10b981; }
    .question-box.incorrect { border-left-color: #ef4444; }
    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 12px; text-transform: uppercase; font-weight: 800; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; }
    .question-box.correct .badge { background: #d1fae5; color: #065f46; }
    .question-box.incorrect .badge { background: #fee2e2; color: #991b1b; }
    .q-text { font-size: 15px; font-weight: 700; margin: 0 0 15px 0; color: #0f172a; }
    .options-list { display: grid; gap: 8px; margin-bottom: 15px; }
    .opt-item { padding: 10px 15px; border-radius: 10px; font-size: 13px; border: 1px solid #e2e8f0; font-weight: 600; }
    .correct-opt { background: #d1fae5; border-color: #10b981; color: #065f46; }
    .wrong-opt { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
    .explanation { font-size: 12px; background: #f1f5f9; padding: 15px; border-radius: 10px; color: #475569; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="subtitle">Assessment Report Summary</div>
      <h1 class="title">SE Knowledge Certificate</h1>
      <div class="score-circle">
        <span class="score-num">${score}/${questionCount}</span>
        <span class="score-pct">${pct}% Score</span>
      </div>
      <div class="badge-grade">AWARDED BADGE: ${badge}</div>
    </div>
    
    <div class="section-title">Performance Breakdown</div>
    <table class="stats-table">
      <thead>
        <tr>
          <th>Difficulty</th>
          <th>Score</th>
          <th>Accuracy %</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Easy</td>
          <td>${difficultyScores.easy.correct}/${difficultyScores.easy.total}</td>
          <td>${difficultyScores.easy.total > 0 ? Math.round((difficultyScores.easy.correct / difficultyScores.easy.total) * 100) : 0}%</td>
        </tr>
        <tr>
          <td>Medium</td>
          <td>${difficultyScores.medium.correct}/${difficultyScores.medium.total}</td>
          <td>${difficultyScores.medium.total > 0 ? Math.round((difficultyScores.medium.correct / difficultyScores.medium.total) * 100) : 0}%</td>
        </tr>
        <tr>
          <td>Hard</td>
          <td>${difficultyScores.hard.correct}/${difficultyScores.hard.total}</td>
          <td>${difficultyScores.hard.total > 0 ? Math.round((difficultyScores.hard.correct / difficultyScores.hard.total) * 100) : 0}%</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Improvement Recommendations</div>
    ${recommendationsHTML}

    <div class="section-title">Question History Review</div>
    ${historyHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `se-assessment-${selectedTopic.replace(/\s+/g, "-").toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Hero Header */}
      <section className="bg-navy-950 pt-32 pb-16 px-6 text-center flex flex-col items-center relative border-b border-white/5">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl relative z-10 flex flex-col items-center"
        >
          <span className="inline-flex items-center space-x-2 py-1 px-3.5 rounded-full bg-navy-800 border border-white/10 text-accent-sky text-2xs font-extrabold mb-5 tracking-wider uppercase">
            Test Your Knowledge
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-white tracking-tighter">
            Knowledge Check
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Take an adaptive multiple-choice assessment. Questions scale in difficulty based on your correctness patterns.
          </p>
        </motion.div>
      </section>

      {/* Main Container Workspace */}
      <main className="container mx-auto py-12 px-4 max-w-4xl flex-1 relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* Phase 1: Setup Config Screen */}
          {phase === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-premium max-w-xl w-full relative overflow-hidden"
            >
              {/* Top border color strip */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-blue via-accent-sky to-accent-indigo" />
              
              <h3 className="text-base font-black text-navy-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Layers size={18} className="text-accent-blue" />
                <span>Configure Assessment</span>
              </h3>

              <div className="space-y-6">
                {/* Topic Selector */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    1. Select Study Subject
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTopic(t)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          selectedTopic === t
                            ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                            : "bg-slate-50/50 border-slate-200 text-navy-900 hover:bg-slate-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count segment switcher */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                    2. Select Question Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 15].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setQuestionCount(cnt)}
                        className={`py-3.5 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                          questionCount === cnt
                            ? "bg-accent-blue text-white border-accent-blue shadow-md"
                            : "bg-slate-50 border-slate-200 text-navy-900 hover:bg-slate-100"
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Launch button */}
                <button
                  onClick={startQuiz}
                  className="w-full py-4.5 bg-navy-950 hover:bg-accent-blue text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 cursor-pointer mt-8"
                >
                  <Play size={14} className="fill-white" />
                  <span>Launch Assessment</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Live Quiz Panel */}
          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-premium relative overflow-hidden"
            >
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-accent-blue rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-450 uppercase tracking-widest">Generating next question...</p>
                </div>
              ) : currentQuestion ? (
                <div>
                  {/* Progress segment & Difficulty capsule */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                        Question Progress
                      </span>
                      <h4 className="font-extrabold text-navy-900 text-sm">
                        Q {currentQuestionNumber} of {questionCount}
                      </h4>
                    </div>

                    {/* Dynamic difficulty pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                        difficulty === "easy"
                          ? "bg-accent-sky/10 text-accent-sky border-accent-sky/20"
                          : difficulty === "medium"
                          ? "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20"
                          : "bg-accent-violet/10 text-accent-violet border-accent-violet/20"
                      }`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
                    <div 
                      className="h-full bg-accent-blue transition-all duration-300"
                      style={{ width: `${(currentQuestionNumber / questionCount) * 100}%` }}
                    />
                  </div>

                  {/* Question Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-navy-900 leading-snug mb-6">
                    {currentQuestion.question}
                  </h3>

                  {/* Answers list */}
                  <div className="grid grid-cols-1 gap-3.5 mb-6">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;
                      
                      let btnClass = "bg-white border-slate-200 text-navy-900 hover:border-slate-350 hover:bg-slate-50/50";
                      
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold";
                        } else if (isSelected) {
                          btnClass = "bg-red-50 border-red-500 text-red-950 font-bold";
                        } else {
                          btnClass = "bg-white border-slate-100 text-slate-400 opacity-60";
                        }
                      } else if (isSelected) {
                        btnClass = "bg-navy-900 text-white border-navy-900 shadow-sm";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-4.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-start gap-3.5 ${
                            !isAnswerSubmitted ? "cursor-pointer" : ""
                          } ${btnClass}`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-inner flex-shrink-0 ${
                            isSelected && !isAnswerSubmitted
                              ? "bg-white/20 text-white"
                              : isAnswerSubmitted && isCorrect
                              ? "bg-emerald-500 text-white"
                              : isAnswerSubmitted && isSelected
                              ? "bg-red-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card (expands after submitting) */}
                  <AnimatePresence>
                    {isAnswerSubmitted && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6"
                      >
                        <div className="flex items-start gap-2.5">
                          {selectedOption === currentQuestion.correctIndex ? (
                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={18} className="text-red-550 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-extrabold text-navy-900 text-xs uppercase tracking-wider mb-1">
                              {selectedOption === currentQuestion.correctIndex ? "Correct Answer" : "Incorrect Answer"}
                            </h4>
                            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer controls */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className={`py-3.5 px-8 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          selectedOption === null
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-navy-900 text-white hover:bg-accent-blue shadow-md cursor-pointer"
                        }`}
                      >
                        <span>Submit Answer</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="py-3.5 px-8 rounded-xl bg-navy-900 hover:bg-accent-blue text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{currentQuestionNumber >= questionCount ? "Finish Assessment" : "Next Question"}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Phase 3: Results Summary Panel */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-premium max-w-2xl w-full text-center relative overflow-hidden"
            >
              {/* Top border color strip */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-blue via-accent-sky to-accent-indigo" />
              
              <div className="max-w-md mx-auto flex flex-col items-center">
                
                {/* Grade Badge */}
                <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center text-accent-sky mb-4 shadow-md">
                  <Award size={32} />
                </div>
                
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">
                  Assessment Completed
                </span>
                
                <h3 className="text-2xl font-black text-navy-900 mb-6">
                  {selectedTopic}
                </h3>

                {/* Centered Score Badge */}
                <div className="py-6 px-10 rounded-2xl bg-slate-50 border border-slate-200 mb-6 w-full flex flex-col items-center">
                  <span className="text-slate-450 text-[10px] font-black uppercase tracking-widest mb-1.5">Your Final Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-navy-900">{score}</span>
                    <span className="text-slate-400 text-lg">/ {questionCount}</span>
                  </div>
                  
                  {/* Grade Badge label */}
                  <span className="mt-4 px-4 py-1.5 rounded-full bg-navy-900 text-white text-xs font-black uppercase tracking-wider">
                    {gradeBadges(Math.round((score / questionCount) * 100)).title}
                  </span>
                </div>

                {/* Accuracy difficulty grid table */}
                <div className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-5 mb-8 text-left space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1 border-b border-slate-150 pb-2">Accuracy by Difficulty</h4>
                  <div className="flex justify-between items-center text-xs font-bold text-navy-900">
                    <span>Easy Questions:</span>
                    <span className="font-extrabold">{difficultyScores.easy.correct}/{difficultyScores.easy.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-navy-900">
                    <span>Medium Questions:</span>
                    <span className="font-extrabold">{difficultyScores.medium.correct}/{difficultyScores.medium.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-navy-900">
                    <span>Hard Questions:</span>
                    <span className="font-extrabold">{difficultyScores.hard.correct}/{difficultyScores.hard.total}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <button
                    onClick={downloadReport}
                    className="w-full py-4 bg-accent-blue hover:bg-accent-sky text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download size={14} />
                    <span>Download Report</span>
                  </button>
                  <button
                    onClick={() => setPhase("config")}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Retake Quiz</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
