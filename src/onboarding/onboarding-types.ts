/**
 * Type definitions for the onboarding system
 */

import { DrillType } from '../types.js';

export interface OnboardingScreen {
  id: string;
  title: string;
  content: string;
  visualComponent?: string;
  interactiveElements?: InteractiveElement[];
  nextScreenId?: string;
  skipToScreenId?: string;
  prerequisites?: string[];
  isOptional?: boolean;
}

export interface InteractiveElement {
  type: 'button' | 'demo' | 'quiz' | 'media' | 'callout';
  id: string;
  label?: string;
  action?: string;
  data?: unknown;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  currentScreen: string;
  startTime: number;
  skippedScreens: string[];
}

export interface OnboardingState {
  isCompleted: boolean;
  completionDate?: string;
  skippedScreens: string[];
  userPreferences: {
    preferredDrillType?: DrillType;
    recommendedPairCount?: number;
  };
}

export interface DrillDemo {
  drillType: DrillType;
  samplePairs: string[];
  exampleStory: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
}

export interface LetterPairDemo {
  pair: string;
  suggestedImage: string;
  userImage: string;
  storyConnection: string;
}

export interface NotationDemo {
  pieceType: 'edge' | 'corner';
  colors: string[];
  correctLetter: string;
  userInput: string;
  feedback: 'correct' | 'incorrect';
}

export interface OnboardingCompletion {
  recommendedFirstDrill: DrillType;
  suggestedPairCount: number;
  userPreferences: UserPreferences;
  nextSteps: string[];
}

export interface UserPreferences {
  hasCompletedOnboarding: boolean;
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
}

export interface QuizDefinition {
  id: string;
  question: string;
  prompt?: string;
  options: QuizOption[];
  successMessage: string;
  failureMessage: string;
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'animation';
  src: string;
  alt: string;
  caption?: string;
}

export interface CalloutCard {
  id: string;
  title: string;
  body: string;
  tone: 'info' | 'warning' | 'success';
  icon?: string;
}
