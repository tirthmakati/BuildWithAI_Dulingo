export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ScenarioCategory = 'all' | 'travel' | 'professional' | 'social' | 'culture' | 'emergency';

export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
  flag: string;
  level: string;
  speechLang: string; // e.g. 'gu-IN', 'hi-IN', 'en-US', 'fr-FR'
  category: 'Indian Languages' | 'English for Indian Speakers' | 'European & Asian Languages';
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  categoryLabel: string;
  level: CEFRLevel | string;
  durationMinutes: number;
  location: string;
  description: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  partnerStyle: string;
  badge?: string;
  highStakes?: boolean;
  rating: number;
  reviewsCount: number;
  culturalNuance: string;
  lexicalKeysCount: number;
  targetLexicon: string[];
  imageUrl: string;
  missionTarget: string;
  initialMessage: string;
  initialTranslation: string;
  language?: string;
  speechLang?: string;
}

export interface DialogueTurn {
  id: string;
  speaker: 'ai' | 'user';
  speakerName: string;
  avatar?: string;
  text: string;
  time: string;
  contextTranslation?: string;
  pacingWpm?: number;
  pronunciationScore?: number;
  highlightPhrase?: string;
  highlightNote?: string;
  isCorrect?: boolean;
  audioVoice?: string;
}

export interface NuanceTip {
  id: string;
  type: 'idiom' | 'grammar' | 'cultural';
  title: string;
  description: string;
  recommendedPhrase?: string;
  originalPhrase?: string;
  note?: string;
}

export interface QuickPrompt {
  id: string;
  targetText?: string;
  english: string;
  french?: string; // backward compat
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  pos: string; // part of speech
  meaning: string;
  contextQuote: string;
  highlightInQuote: string;
  scenarioOrigin: string;
  scenarioIcon: string;
  retentionPercent: number;
  status: 'review' | 'learning' | 'mastered';
  lastPracticed: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  xp: number;
  streakDays: number;
  rank: number;
  isCurrentUser: boolean;
  division: 'Obsidian' | 'Diamond' | 'Emerald' | 'Sapphire';
  dailyMinutes: number;
  pronunciationAvg: number;
  wordsLearned: number;
  recentActivity: string;
  statusText?: string;
  isFriend: boolean;
}

export interface PronunciationDrill {
  id: string;
  phoneme: string;
  contrastPhoneme: string;
  title: string;
  subtitle: string;
  targetSentence: string;
  ipaTarget: string;
  f1JawHz: number;
  f2TongueHz: number;
  lipGuide: string;
  tongueGuide: string;
  sampleWords: string[];
}

export interface Milestone {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'achieved' | 'in-progress' | 'locked' | 'capstone';
  badge: string;
  scenariosTested: string;
  expressionsAcquired: string;
  score?: number;
  progressPercent?: number;
}
