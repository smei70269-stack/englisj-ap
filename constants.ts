import { StoryPanel, WordDefinition, QuizQuestion } from './types';

export const VOCABULARY: Record<string, WordDefinition> = {
  'shoes': { word: 'shoes', translation: '鞋子', image: 'https://picsum.photos/id/103/200/200' },
  'coat': { word: 'coat', translation: '外套', image: 'https://picsum.photos/id/200/200/200' },
  'hat': { word: 'hat', translation: '帽子', image: 'https://picsum.photos/id/111/200/200' },
  'black': { word: 'black', translation: '黑色', image: 'https://picsum.photos/id/100/200/200' },
  'windy': { word: 'windy', translation: '刮风的', image: 'https://picsum.photos/id/10/200/200' },
  'like': { word: 'like', translation: '喜欢', image: 'https://picsum.photos/id/30/200/200' },
};

export const STORY_PANELS: StoryPanel[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/jeff1/800/600',
    description: 'Jeff is ready to go out.',
    dialogues: [
      {
        id: 'd1_1',
        speaker: 'Jeff',
        text: "Let's go!",
        translation: "我们走吧！",
        highlightedWords: ['go']
      },
      {
        id: 'd1_2',
        speaker: 'Sister',
        text: "Put on your shoes, Jeff.",
        translation: "穿上你的鞋子，Jeff。",
        highlightedWords: ['shoes']
      }
    ]
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/jeff2/800/600',
    description: 'The weather is windy.',
    dialogues: [
      {
        id: 'd2_1',
        speaker: 'Sister',
        text: "It's windy.",
        translation: "外面风很大。",
        highlightedWords: ['windy']
      },
      {
        id: 'd2_2',
        speaker: 'Mom',
        text: "Put on your coat.",
        translation: "穿上你的外套。",
        highlightedWords: ['coat']
      }
    ]
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/jeff3/800/600',
    description: 'Jeff dislikes the hat.',
    dialogues: [
      {
        id: 'd3_1',
        speaker: 'Mom',
        text: "Put on your hat.",
        translation: "戴上你的帽子。",
        highlightedWords: ['hat']
      },
      {
        id: 'd3_2',
        speaker: 'Jeff',
        text: "No! It's black. I don't like black!",
        translation: "不！它是黑色的。我不喜欢黑色！",
        highlightedWords: ['black', 'like']
      }
    ]
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/jeff4/800/600',
    description: 'The teddy bear has a matching hat.',
    dialogues: [
      {
        id: 'd4_1',
        speaker: 'Sister',
        text: "Look! It has a black hat, too!",
        translation: "看！它也有一顶黑色的帽子！",
        highlightedWords: ['Look', 'black', 'hat']
      }
    ]
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/jeff5/800/600',
    description: 'Jeff is happy now.',
    dialogues: [
      {
        id: 'd5_1',
        speaker: 'Jeff',
        text: "I like my hat!",
        translation: "我喜欢我的帽子！",
        highlightedWords: ['like', 'hat']
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "What color is the hat?",
    options: ["Red", "Black", "Blue"],
    correctAnswer: "Black"
  },
  {
    id: 'q2',
    question: "How is the weather?",
    options: ["Sunny", "Windy", "Rainy"],
    correctAnswer: "Windy"
  },
  {
    id: 'q3',
    question: "Who says 'I like my hat'?",
    options: ["Mom", "Sister", "Jeff"],
    correctAnswer: "Jeff"
  }
];
