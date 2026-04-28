import { useReducer, useEffect, useCallback } from "react";
import type { A11yState, A11yAction } from "./types";

export const DEFAULT_STATE: A11yState = {
  highContrast: false,
  invertColors: false,
  fontSize: 1,
  lineHeight: false,
  letterSpacing: false,
  wordSpacing: false,
  fontFamily: "default",
  reduceMotion: false,
  pauseAnimations: false,
  focusVisible: false,
  textAlign: "default",
  highlightLinks: false,
  readingGuide: false,
  readingMask: false,
};

function reducer(state: A11yState, action: A11yAction): A11yState {
  switch (action.type) {
    case "TOGGLE_HIGH_CONTRAST":
      return { ...state, highContrast: !state.highContrast };
    case "TOGGLE_INVERT_COLORS":
      return { ...state, invertColors: !state.invertColors };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "TOGGLE_LINE_HEIGHT":
      return { ...state, lineHeight: !state.lineHeight };
    case "TOGGLE_LETTER_SPACING":
      return { ...state, letterSpacing: !state.letterSpacing };
    case "TOGGLE_WORD_SPACING":
      return { ...state, wordSpacing: !state.wordSpacing };
    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload };
    case "TOGGLE_REDUCE_MOTION":
      return { ...state, reduceMotion: !state.reduceMotion };
    case "TOGGLE_PAUSE_ANIMATIONS":
      return { ...state, pauseAnimations: !state.pauseAnimations };
    case "TOGGLE_FOCUS_VISIBLE":
      return { ...state, focusVisible: !state.focusVisible };
    case "SET_TEXT_ALIGN":
      return { ...state, textAlign: action.payload };
    case "TOGGLE_HIGHLIGHT_LINKS":
      return { ...state, highlightLinks: !state.highlightLinks };
    case "TOGGLE_READING_GUIDE":
      return { ...state, readingGuide: !state.readingGuide };
    case "TOGGLE_READING_MASK":
      return { ...state, readingMask: !state.readingMask };
    case "RESET":
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
}

function loadState(storageKey: string): A11yState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useA11yStore(storageKey: string) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    loadState(storageKey),
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // storage indisponible, on continue sans persistance
    }
  }, [state, storageKey]);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return { state, dispatch, reset };
}
