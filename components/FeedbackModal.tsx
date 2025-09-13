import React from 'react';

interface FeedbackModalProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ score, totalQuestions, onRestart }) => {
  const getFeedbackMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return "Perfect Score! You're a web dev wizard!";
    if (percentage >= 75) return "Great job! You really know your stuff.";
    if (percentage >= 50) return "Not bad! A little more practice and you'll be an expert.";
    return "Keep learning! Every master was once a beginner.";
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Quiz Complete!</h2>
        <p className="text-slate-300 text-lg mb-2">You scored:</p>
        <p className="text-5xl font-extrabold text-white mb-4">{score} / {totalQuestions}</p>
        <p className="text-slate-400 text-lg mb-6">{getFeedbackMessage()}</p>
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
