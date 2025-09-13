import React from 'react';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';

interface LearningViewProps {
  topic: string;
  content: string | null;
  onContinue: () => void;
}

const LearningView: React.FC<LearningViewProps> = ({ topic, content, onContinue }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl animate-fade-in">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <p className="text-slate-400 text-lg font-semibold">Let's Learn About</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          {topic}
        </h2>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-4">
        {!content ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner />
            <p className="mt-4 text-xl text-slate-300">Generating your learning material...</p>
          </div>
        ) : (
          <MarkdownRenderer markdown={content} />
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
        <button
          onClick={onContinue}
          disabled={!content}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue Quiz
        </button>
      </div>

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

export default LearningView;
