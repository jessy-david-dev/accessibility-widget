export interface A11yState {
  // RGAA 3 - Couleurs
  highContrast: boolean;
  invertColors: boolean;

  // RGAA 10 - Présentation de l'information
  fontSize: number; // multiplicateur : 1 | 1.2 | 1.4 | 1.6
  lineHeight: boolean;
  letterSpacing: boolean;
  wordSpacing: boolean;
  fontFamily: "default" | "readable" | "dyslexic";

  // RGAA 13 - Consultation
  reduceMotion: boolean;
  pauseAnimations: boolean;

  // Navigation au clavier / focus
  focusVisible: boolean;

  // Lisibilité
  textAlign: "default" | "left";
  highlightLinks: boolean;
  readingGuide: boolean;
  readingMask: boolean;
}

export type A11yAction =
  | { type: "TOGGLE_HIGH_CONTRAST" }
  | { type: "TOGGLE_INVERT_COLORS" }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "TOGGLE_LINE_HEIGHT" }
  | { type: "TOGGLE_LETTER_SPACING" }
  | { type: "TOGGLE_WORD_SPACING" }
  | { type: "SET_FONT_FAMILY"; payload: A11yState["fontFamily"] }
  | { type: "TOGGLE_REDUCE_MOTION" }
  | { type: "TOGGLE_PAUSE_ANIMATIONS" }
  | { type: "TOGGLE_FOCUS_VISIBLE" }
  | { type: "SET_TEXT_ALIGN"; payload: A11yState["textAlign"] }
  | { type: "TOGGLE_HIGHLIGHT_LINKS" }
  | { type: "TOGGLE_READING_GUIDE" }
  | { type: "TOGGLE_READING_MASK" }
  | { type: "RESET" };

export interface A11yWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  lang?: "fr" | "en";
  storageKey?: string;
}
