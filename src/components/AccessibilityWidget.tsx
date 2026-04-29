import { useState, useRef, useCallback } from "react";
import { useA11yStore } from "../store";
import { useA11yEffects } from "../useA11yEffects";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { translations } from "../i18n";
import type { A11yWidgetProps, A11yAction } from "../types";
import "../styles.css";

const TRIGGER_ID = "a11y-widget-trigger";

export function AccessibilityWidget({
  position = "bottom-right",
  lang = "fr",
  storageKey = "a11y-widget-prefs",
}: A11yWidgetProps) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useA11yStore(storageKey);
  const t = translations[lang];
  const liveRef = useRef<HTMLSpanElement>(null);

  useA11yEffects(state);

  // Annonce chaque changement d'option aux lecteurs d'écran via aria-live
  const dispatchWithAnnounce = useCallback(
    (action: A11yAction) => {
      dispatch(action);
      if (!liveRef.current) return;
      const labels: Partial<Record<A11yAction["type"], string>> = {
        TOGGLE_HIGH_CONTRAST: t.highContrast,
        TOGGLE_INVERT_COLORS: t.invertColors,
        TOGGLE_LINE_HEIGHT: t.lineHeight,
        TOGGLE_LETTER_SPACING: t.letterSpacing,
        TOGGLE_WORD_SPACING: t.wordSpacing,
        TOGGLE_REDUCE_MOTION: t.reduceMotion,
        TOGGLE_PAUSE_ANIMATIONS: t.pauseAnimations,
        TOGGLE_FOCUS_VISIBLE: t.focusVisible,
        TOGGLE_HIGHLIGHT_LINKS: t.highlightLinks,
        TOGGLE_READING_GUIDE: t.readingGuide,
        TOGGLE_READING_MASK: t.readingMask,
        RESET: lang === "fr" ? "Réinitialisé" : "Reset",
      };
      const label = labels[action.type];
      if (label) {
        // Vider puis reremplir force une nouvelle annonce même si le texte est identique
        liveRef.current.textContent = "";
        requestAnimationFrame(() => {
          if (liveRef.current) liveRef.current.textContent = label;
        });
      }
    },
    [dispatch, t, lang],
  );

  const activeCount = [
    state.highContrast,
    state.invertColors,
    state.fontSize !== 1,
    state.lineHeight,
    state.letterSpacing,
    state.wordSpacing,
    state.fontFamily !== "default",
    state.reduceMotion,
    state.pauseAnimations,
    state.focusVisible,
    state.textAlign !== "default",
    state.highlightLinks,
    state.readingGuide,
    state.readingMask,
  ].filter(Boolean).length;

  return (
    <div className={`a11y-widget a11y-widget--${position}`}>
      {/* Live region : annonce les changements d'état aux lecteurs d'écran */}
      <span
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="a11y-sr-only"
      />

      <button
        id={TRIGGER_ID}
        type="button"
        className="a11y-trigger"
        aria-label={open ? t.closeMenu : t.openMenu}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          width="28"
          height="28"
          viewBox="0 0 15 15"
          fill="currentColor"
        >
          <path d="M7.5.877a6.623 6.623 0 1 1 0 13.246A6.623 6.623 0 0 1 7.5.877m0 .95a5.674 5.674 0 1 0 0 11.343a5.674 5.674 0 0 0-.002-11.345m2.953 3.484a.5.5 0 1 1 .26.965l-1.967.527V8.27c0 .602.88 3.427.88 3.427a.5.5 0 1 1-.966.26S7.92 9.126 7.868 9c-.048-.127-.218-.127-.218-.127h-.307c-.006 0-.174.002-.219.127c-.055.129-.788 2.94-.793 2.959a.5.5 0 1 1-.966-.259c.006-.017.881-2.83.881-3.43V6.8l-1.959-.524a.5.5 0 0 1 .26-.965s1.654.562 2.299.562h1.31c.642 0 2.282-.557 2.297-.562M7.5 2.87a1.125 1.125 0 1 1 0 2.25a1.125 1.125 0 0 1 0-2.25" />
        </svg>
        {activeCount > 0 && (
          <span
            className="a11y-badge"
            aria-label={
              lang === "fr"
                ? `${activeCount} option${activeCount > 1 ? "s" : ""} active${activeCount > 1 ? "s" : ""}`
                : `${activeCount} active option${activeCount > 1 ? "s" : ""}`
            }
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <AccessibilityPanel
          state={state}
          dispatch={dispatchWithAnnounce}
          onClose={() => setOpen(false)}
          t={t}
          triggerId={TRIGGER_ID}
        />
      )}
    </div>
  );
}
