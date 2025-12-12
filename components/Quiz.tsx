import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing after selection
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIdx].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  const question = questions[currentIdx];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-2xl mx-auto">
      <div className="w-full bg-white rounded-3xl p-8 shadow-xl border-b-8 border-purple-200">
        <div className="flex justify-between items-center mb-6">
          <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-bold">
            Question {currentIdx + 1}/{questions.length}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selectedAnswer}
              className={`w-full p-4 rounded-xl text-xl font-bold border-2 transition-all transform
                ${
                  selectedAnswer === opt
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700 scale-105'
                      : 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-purple-400 hover:bg-purple-50'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {isCorrect === false && (
          <p className="mt-4 text-center text-red-500 font-bold animate-bounce">
            Try again! (Resetting...)
          </p>
        )}
        
         {isCorrect === false && setTimeout(() => {
             setSelectedAnswer(null);
             setIsCorrect(null);
         }, 1000) && null}
      </div>
    </div>
  );
};
