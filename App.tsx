import React, { useState } from 'react';
import { generateQuizQuestions, generateLearningContent } from './services/geminiService';
import { Question } from './types';
import QuizCard from './components/QuizCard';
import FeedbackModal from './components/FeedbackModal';
import Spinner from './components/Spinner';
import LearningView from './components/LearningView';
import { TOTAL_QUESTIONS } from './constants';

type QuizState = 'idle' | 'loading' | 'in-progress' | 'completed' | 'learning';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [learningTopic, setLearningTopic] = useState<string | null>(null);
  const [learningContent, setLearningContent] = useState<string | null>(null);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setQuizState('loading');
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions(topic);
      if (fetchedQuestions.length < TOTAL_QUESTIONS) {
        throw new Error("Not enough questions were generated. Please try again.");
      }
      setQuestions(fetchedQuestions);
      setQuizState('in-progress');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setQuizState('idle');
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent answering twice
    setSelectedAnswer(answer);
    setUserAnswers(prevAnswers => [...prevAnswers, answer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizState('completed');
    }
  };

  const handleLearnMore = async (topic: string) => {
    setLearningTopic(topic);
    setLearningContent(null);
    setQuizState('learning');
    try {
      const content = await generateLearningContent(topic);
      setLearningContent(content);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load learning content.");
        setQuizState('in-progress'); // Go back to the question
    }
  };

  const handleContinueQuiz = () => {
    setLearningTopic(null);
    setLearningContent(null);
    setQuizState('in-progress');
    handleNextQuestion();
  };

  const restartQuiz = () => {
    setQuizState('idle');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setError(null);
    setSelectedAnswer(null);
    setTopic('');
    setLearningTopic(null);
    setLearningContent(null);
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return question.correctAnswer === userAnswers[index] ? score + 1 : score;
    }, 0);
  };
  
  const renderContent = () => {
    const isLoading = quizState === 'loading';

    switch (quizState) {
      case 'loading':
        return (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-xl text-slate-300">Generating your quiz on "{topic}"...</p>
          </div>
        );
      case 'in-progress':
        return (
          <QuizCard
            questionData={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onLearnMore={handleLearnMore}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            selectedAnswer={selectedAnswer}
          />
        );
      case 'learning':
        return (
          <LearningView 
            topic={learningTopic!}
            content={learningContent}
            onContinue={handleContinueQuiz}
          />
        );
      case 'completed':
        return (
          <FeedbackModal
            score={calculateScore()}
            totalQuestions={TOTAL_QUESTIONS}
            onRestart={restartQuiz}
          />
        );
      case 'idle':
      default:
        return (
          <div className="text-center max-w-2xl mx-auto">
             <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Smart Quiz Bot
             </h1>
             <p className="text-slate-300 mb-8 text-lg md:text-xl">
                What topic do you want to be quizzed on today?
             </p>
             <div className="flex flex-col gap-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., JavaScript, React, History of Rome"
                    className="w-full text-center p-4 bg-slate-700 rounded-lg text-xl text-slate-200 border-2 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors"
                    aria-label="Quiz topic"
                />
                <button
                onClick={startQuiz}
                disabled={isLoading || !topic.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Start Quiz
                </button>
             </div>
            {error && <p className="text-red-400 mt-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <main className="w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
