export interface WordDefinition {
  word: string;
  translation: string;
  image?: string; // Optional image specific to word
}

export interface DialogueLine {
  id: string;
  speaker: 'Jeff' | 'Mom' | 'Sister';
  text: string;
  translation: string;
  audioText?: string; // Optional distinct text for TTS if different from display
  highlightedWords?: string[]; // Words that are clickable for definitions
}

export interface StoryPanel {
  id: number;
  imageUrl: string;
  description: string; // For accessibility and context
  dialogues: DialogueLine[];
}

export type AppMode = 'STORY' | 'VOCAB' | 'QUIZ';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
