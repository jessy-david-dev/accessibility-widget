import { useEffect, useRef } from "react";
import type { A11yState, A11yAction } from "../types";
import type { T } from "../i18n";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="a11y-section">
      <h3 className="a11y-section-title">{title}</h3>
      {children}
    </section>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  const id = `a11y-sw-${label.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}`;
  return (
    <div className="a11y-toggle">
      <span id={id} className="a11y-toggle-label">
        {label}
      </span>
      {/* role="switch" + aria-labelledby : annoncé correctement par NVDA, JAWS, VoiceOver */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        className="a11y-switch"
        onClick={onChange}
      >
        <span className="a11y-switch-thumb" />
        {/* Texte masqué visuellement pour lecteurs d'écran anciens (JAWS < 2022) */}
        <span className="a11y-sr-only">{checked ? "activé" : "désactivé"}</span>
      </button>
    </div>
  );
}

interface FontSizeControlProps {
  value: number;
  t: T;
  dispatch: React.Dispatch<A11yAction>;
}

const FONT_SIZES: { value: number; labelKey: keyof T }[] = [
  { value: 1, labelKey: "fontSizeNormal" },
  { value: 1.2, labelKey: "fontSizeLarge" },
  { value: 1.4, labelKey: "fontSizeXL" },
  { value: 1.6, labelKey: "fontSizeXXL" },
];

function FontSizeControl({ value, t, dispatch }: FontSizeControlProps) {
  return (
    <fieldset className="a11y-fieldset">
      <legend className="a11y-legend">{t.fontSize}</legend>
      <div className="a11y-radio-group" role="group">
        {FONT_SIZES.map((fs) => (
          <button
            key={fs.value}
            type="button"
            className="a11y-size-btn"
            aria-pressed={value === fs.value}
            onClick={() =>
              dispatch({ type: "SET_FONT_SIZE", payload: fs.value })
            }
          >
            {t[fs.labelKey] as string}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

interface FontFamilyControlProps {
  value: A11yState["fontFamily"];
  t: T;
  dispatch: React.Dispatch<A11yAction>;
}

function FontFamilyControl({ value, t, dispatch }: FontFamilyControlProps) {
  const families: { value: A11yState["fontFamily"]; label: string }[] = [
    { value: "default", label: t.fontDefault },
    { value: "readable", label: t.fontReadable },
    { value: "dyslexic", label: t.fontDyslexic },
  ];
  return (
    <fieldset className="a11y-fieldset">
      <legend className="a11y-legend">{t.sectionFont}</legend>
      <div className="a11y-radio-group" role="group">
        {families.map((f) => (
          <button
            key={f.value}
            type="button"
            className="a11y-size-btn"
            aria-pressed={value === f.value}
            onClick={() =>
              dispatch({ type: "SET_FONT_FAMILY", payload: f.value })
            }
          >
            {f.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

interface AccessibilityPanelProps {
  state: A11yState;
  dispatch: React.Dispatch<A11yAction>;
  onClose: () => void;
  t: T;
  triggerId: string;
}

export function AccessibilityPanel({
  state,
  dispatch,
  onClose,
  t,
  triggerId,
}: AccessibilityPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Fermeture via Escape + focus-trap basique
  useEffect(() => {
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        document.getElementById(triggerId)?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, triggerId]);

  return (
    <div
      ref={panelRef}
      className="a11y-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-panel-title"
    >
      <div className="a11y-panel-header">
        <h2 id="a11y-panel-title" className="a11y-panel-title">
          {t.panelTitle}
        </h2>
        <div className="a11y-panel-actions">
          <button
            type="button"
            className="a11y-btn-reset"
            onClick={() => dispatch({ type: "RESET" })}
          >
            {t.reset}
          </button>
          <button
            ref={closeRef}
            type="button"
            className="a11y-btn-close"
            aria-label={t.closeMenu}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="a11y-panel-body">
        {/* RGAA 3 – Couleurs */}
        <Section title={t.sectionColors}>
          <Toggle
            label={t.highContrast}
            checked={state.highContrast}
            onChange={() => dispatch({ type: "TOGGLE_HIGH_CONTRAST" })}
          />
          <Toggle
            label={t.invertColors}
            checked={state.invertColors}
            onChange={() => dispatch({ type: "TOGGLE_INVERT_COLORS" })}
          />
        </Section>

        {/* RGAA 10 – Présentation du texte */}
        <Section title={t.sectionText}>
          <FontSizeControl value={state.fontSize} t={t} dispatch={dispatch} />
          <Toggle
            label={t.lineHeight}
            checked={state.lineHeight}
            onChange={() => dispatch({ type: "TOGGLE_LINE_HEIGHT" })}
          />
          <Toggle
            label={t.letterSpacing}
            checked={state.letterSpacing}
            onChange={() => dispatch({ type: "TOGGLE_LETTER_SPACING" })}
          />
          <Toggle
            label={t.wordSpacing}
            checked={state.wordSpacing}
            onChange={() => dispatch({ type: "TOGGLE_WORD_SPACING" })}
          />
          <Toggle
            label={t.textAlignLeft}
            checked={state.textAlign === "left"}
            onChange={() =>
              dispatch({
                type: "SET_TEXT_ALIGN",
                payload: state.textAlign === "left" ? "default" : "left",
              })
            }
          />
        </Section>

        {/* Police de caractères */}
        <Section title={t.sectionFont}>
          <FontFamilyControl
            value={state.fontFamily}
            t={t}
            dispatch={dispatch}
          />
        </Section>

        {/* RGAA 13 – Consultation / Mouvement */}
        <Section title={t.sectionMotion}>
          <Toggle
            label={t.reduceMotion}
            checked={state.reduceMotion}
            onChange={() => dispatch({ type: "TOGGLE_REDUCE_MOTION" })}
          />
          <Toggle
            label={t.pauseAnimations}
            checked={state.pauseAnimations}
            onChange={() => dispatch({ type: "TOGGLE_PAUSE_ANIMATIONS" })}
          />
        </Section>

        {/* Navigation clavier */}
        <Section title={t.sectionNavigation}>
          <Toggle
            label={t.focusVisible}
            checked={state.focusVisible}
            onChange={() => dispatch({ type: "TOGGLE_FOCUS_VISIBLE" })}
          />
          <Toggle
            label={t.highlightLinks}
            checked={state.highlightLinks}
            onChange={() => dispatch({ type: "TOGGLE_HIGHLIGHT_LINKS" })}
          />
        </Section>

        {/* Aide à la lecture */}
        <Section title={t.sectionReading}>
          <Toggle
            label={t.readingGuide}
            checked={state.readingGuide}
            onChange={() => dispatch({ type: "TOGGLE_READING_GUIDE" })}
          />
          <Toggle
            label={t.readingMask}
            checked={state.readingMask}
            onChange={() => dispatch({ type: "TOGGLE_READING_MASK" })}
          />
        </Section>
      </div>
    </div>
  );
}
