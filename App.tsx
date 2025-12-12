import React, { useState, useEffect } from 'react';
import { STORY_PANELS, VOCABULARY, QUIZ_QUESTIONS } from './constants';
import { playTextToSpeech } from './services/geminiService';
import { WordPopup } from './components/WordPopup';
import { Quiz } from './components/Quiz';
import { AppMode, WordDefinition } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('STORY');
  const [currentPanelIdx, setCurrentPanelIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState<WordDefinition | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentPanel = STORY_PANELS[currentPanelIdx];

  const handleSpeakerClick = async (text: string, speaker: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await playTextToSpeech(text, speaker);
    setIsPlayingAudio(false);
  };

  const handleWordClick = (wordRaw: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Normalize word to match keys (remove punctuation, lowercase)
    const key = wordRaw.toLowerCase().replace(/[!.,?]/g, '');
    const vocab = VOCABULARY[key];
    if (vocab) {
      setSelectedWord(vocab);
    }
  };

  const renderDialogueText = (text: string, highlighted: string[] = []) => {
    return text.split(' ').map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[!.,?]/g, '');
      const isInteractive = highlighted.some(h => h.toLowerCase() === cleanWord);
      
      return (
        <span 
          key={idx}
          onClick={(e) => isInteractive ? handleWordClick(cleanWord, e) : undefined}
          className={`inline-block mr-1.5 transition-colors ${
            isInteractive 
              ? 'text-blue-600 font-extrabold cursor-pointer border-b-2 border-blue-300 hover:text-blue-800 hover:scale-110 transform' 
              : 'text-gray-700'
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center z-10 sticky top-0">
        <h1 className="text-2xl md:text-3xl font-black text-teal-600 flex items-center gap-2">
          <span>🧢</span> Jeff's New Hat
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('STORY')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${mode === 'STORY' ? 'bg-teal-500 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-500'}`}
          >
            Story
          </button>
          <button 
             onClick={() => setMode('QUIZ')}
             className={`px-4 py-2 rounded-full font-bold transition-all ${mode === 'QUIZ' ? 'bg-purple-500 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-500'}`}
          >
            Practice
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        
        {mode === 'STORY' && (
          <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] border-8 border-teal-100">
            
            {/* Image Section (Left/Top) */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-hidden">
               {/* Placeholder for the specific panel image */}
               <img 
                 src={currentPanel.imageUrl} 
                 alt={currentPanel.description}
                 className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
               />
               <div className="absolute top-4 left-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                 Page {currentPanelIdx + 1}
               </div>
            </div>

            {/* Text/Interaction Section (Right/Bottom) */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center space-y-6 bg-gradient-to-br from-white to-teal-50">
              
              {currentPanel.dialogues.map((dialogue, idx) => (
                <div 
                  key={dialogue.id} 
                  className={`relative p-4 rounded-2xl bg-white shadow-lg border-2 border-teal-100 transition-all hover:shadow-xl hover:-translate-y-1 group
                    ${idx % 2 === 0 ? 'bubble-tail-left ml-0 mr-8' : 'bubble-tail-right ml-8 mr-0'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white
                      ${dialogue.speaker === 'Jeff' ? 'bg-blue-400' : dialogue.speaker === 'Mom' ? 'bg-pink-400' : 'bg-orange-400'}
                    `}>
                      {dialogue.speaker}
                    </span>
                    <button 
                      onClick={() => handleSpeakerClick(dialogue.audioText || dialogue.text, dialogue.speaker)}
                      className="text-gray-300 hover:text-teal-500 transition-colors p-1"
                      aria-label="Play audio"
                    >
                       🔊
                    </button>
                  </div>
                  
                  <p className="text-xl md:text-2xl leading-relaxed font-bold text-gray-800">
                    {renderDialogueText(dialogue.text, dialogue.highlightedWords)}
                  </p>
                  
                  <p className="text-gray-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                    {dialogue.translation}
                  </p>
                </div>
              ))}

            </div>
          </div>
        )}

        {mode === 'QUIZ' && (
          <Quiz 
            questions={QUIZ_QUESTIONS} 
            onComplete={() => {
                alert("Great job! You finished the quiz!");
                setMode('STORY');
                setCurrentPanelIdx(0);
            }} 
          />
        )}

      </main>

      {/* Navigation Bar (Story Mode) */}
      {mode === 'STORY' && (
        <footer className="p-4 flex justify-center gap-4 bg-white/80 backdrop-blur-md sticky bottom-0 border-t border-gray-100">
          <button 
            disabled={currentPanelIdx === 0}
            onClick={() => setCurrentPanelIdx(p => p - 1)}
            className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-2xl font-black shadow-sm hover:bg-teal-200 transition-colors"
          >
            ←
          </button>
          
          <div className="flex items-center gap-2 px-4">
             {STORY_PANELS.map((_, idx) => (
               <div 
                 key={idx}
                 className={`h-3 rounded-full transition-all duration-300 ${idx === currentPanelIdx ? 'w-8 bg-teal-500' : 'w-3 bg-gray-300'}`}
               />
             ))}
          </div>

          <button 
            disabled={currentPanelIdx === STORY_PANELS.length - 1}
            onClick={() => setCurrentPanelIdx(p => p + 1)}
            className="w-14 h-14 rounded-full bg-teal-500 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-2xl font-black shadow-lg shadow-teal-500/30 hover:bg-teal-600 hover:scale-110 active:scale-95 transition-all"
          >
            →
          </button>
        </footer>
      )}

      {/* Popups */}
      {selectedWord && (
        <WordPopup 
          vocab={selectedWord} 
          onClose={() => setSelectedWord(null)}
          onPlay={(text) => handleSpeakerClick(text, 'Sister')}
        />
      )}
    </div>
  );
};

export default App;
