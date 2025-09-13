import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  questionData: Question;
  onAnswer: (selectedOption: string) => void;
  onNext: () => void;
  onLearnMore: (topic: string) => void;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  questionData, 
  onAnswer, 
  onNext,
  onLearnMore,
  questionNumber, 
  totalQuestions,
  selectedAnswer 
}) => {
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === questionData.correctAnswer;

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 border-transparent hover:border-cyan-500 hover:bg-slate-600';
    }

    const isThisOptionCorrect = option === questionData.correctAnswer;
    const isThisOptionSelected = option === selectedAnswer;

    if (isThisOptionCorrect) {
      return 'bg-green-800/50 border-green-600 text-white';
    }
    if (isThisOptionSelected && !isThisOptionCorrect) {
      return 'bg-red-800/50 border-red-600 text-white';
    }
    return 'bg-slate-800 border-transparent opacity-60';
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl animate-fade-in">
      <div className="mb-6">
        <p className="text-slate-400 text-lg font-semibold">Question {questionNumber} of {totalQuestions}</p>
        <h2 
          className="text-2xl md:text-3xl font-bold mt-2 text-white"
          dangerouslySetInnerHTML={{ __html: questionData.question }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg text-lg text-slate-200 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:cursor-not-allowed ${getButtonClass(option)}`}
            dangerouslySetInnerHTML={{ __html: option }}
          />
        ))}
      </div>
      
      {isAnswered && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
            <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Explanation</h3>
            <p 
              className="text-slate-300 mb-6"
              dangerouslySetInnerHTML={{ __html: questionData.explanation }}
            />
            <div className="flex flex-col md:flex-row gap-4">
              {!isCorrect && (
                <button
                  onClick={() => onLearnMore(questionData.topic)}
                  className="w-full md:w-1/2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
                >
                  Learn More
                </button>
              )}
              <button
                  onClick={onNext}
                  className={`w-full ${!isCorrect ? 'md:w-1/2' : 'md:w-full'} bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105`}
              >
                  {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuizCard;
