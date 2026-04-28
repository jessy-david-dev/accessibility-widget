import { useState, useRef, useCallback } from "react";
import { AccessibilityIcon } from "@radix-ui/react-icons";
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
        <AccessibilityIcon aria-hidden="true" width="28" height="28" />
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
