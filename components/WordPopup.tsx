import React from 'react';
import { WordDefinition } from '../types';

interface WordPopupProps {
  vocab: WordDefinition;
  onClose: () => void;
  onPlay: (text: string) => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({ vocab, onClose, onPlay }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-float border-4 border-yellow-400 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          ✕
        </button>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-inner">
             <img src={vocab.image} alt={vocab.word} className="w-full h-full object-cover" />
          </div>
          
          <div>
            <h2 className="text-4xl font-black text-blue-600 mb-1">{vocab.word}</h2>
            <p className="text-2xl text-gray-500 font-bold">{vocab.translation}</p>
          </div>

          <button 
            onClick={() => onPlay(vocab.word)}
            className="w-full py-3 bg-green-400 hover:bg-green-500 text-white rounded-xl font-bold text-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>🔊</span> Read Aloud
          </button>
        </div>
      </div>
    </div>
  );
};
