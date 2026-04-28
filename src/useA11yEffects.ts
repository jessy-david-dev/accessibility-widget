import { useEffect, useRef } from "react";
import type { A11yState } from "./types";

const ROOT = document.documentElement;

function cls(add: boolean, ...names: string[]) {
  names.forEach((n) => ROOT.classList.toggle(n, add));
}

function setCustomProp(prop: string, value: string | null) {
  if (value === null) {
    ROOT.style.removeProperty(prop);
  } else {
    ROOT.style.setProperty(prop, value);
  }
}

export function useA11yEffects(state: A11yState) {
  // RGAA 3 - Couleurs
  useEffect(
    () => cls(state.highContrast, "a11y-high-contrast"),
    [state.highContrast],
  );
  useEffect(() => cls(state.invertColors, "a11y-invert"), [state.invertColors]);

  // RGAA 10 - Présentation : taille de police
  useEffect(() => {
    setCustomProp(
      "--a11y-font-scale",
      state.fontSize === 1 ? null : String(state.fontSize),
    );
  }, [state.fontSize]);

  // RGAA 10 - Présentation : hauteur de ligne
  useEffect(
    () => cls(state.lineHeight, "a11y-line-height"),
    [state.lineHeight],
  );

  // RGAA 10 - Présentation : espacement des lettres
  useEffect(
    () => cls(state.letterSpacing, "a11y-letter-spacing"),
    [state.letterSpacing],
  );

  // RGAA 10 - Présentation : espacement des mots
  useEffect(
    () => cls(state.wordSpacing, "a11y-word-spacing"),
    [state.wordSpacing],
  );

  // RGAA 10 - Police de caractères
  useEffect(() => {
    ROOT.setAttribute("data-a11y-font", state.fontFamily);
  }, [state.fontFamily]);

  // RGAA 13 - Consultation : mouvement / animation
  useEffect(
    () => cls(state.reduceMotion, "a11y-reduce-motion"),
    [state.reduceMotion],
  );
  useEffect(
    () => cls(state.pauseAnimations, "a11y-pause-animations"),
    [state.pauseAnimations],
  );

  // Navigation clavier - focus visible renforcé
  useEffect(
    () => cls(state.focusVisible, "a11y-focus-visible"),
    [state.focusVisible],
  );

  // RGAA 10 - Alignement du texte
  useEffect(() => {
    ROOT.setAttribute("data-a11y-align", state.textAlign);
  }, [state.textAlign]);

  // Mise en évidence des liens
  useEffect(
    () => cls(state.highlightLinks, "a11y-highlight-links"),
    [state.highlightLinks],
  );

  // Guide de lecture (réticule horizontal)
  useEffect(() => {
    if (!state.readingGuide) {
      document.getElementById("a11y-reading-guide")?.remove();
      return;
    }
    let guide = document.getElementById("a11y-reading-guide");
    if (!guide) {
      guide = document.createElement("div");
      guide.id = "a11y-reading-guide";
      guide.setAttribute("aria-hidden", "true");
      document.body.appendChild(guide);
    }
    const onMove = (e: MouseEvent) => {
      if (guide) guide.style.top = `${e.clientY}px`;
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      guide?.remove();
    };
  }, [state.readingGuide]);

  // Masque de lecture (assombrit tout sauf la zone courante)
  useEffect(() => {
    if (!state.readingMask) {
      document.getElementById("a11y-reading-mask-top")?.remove();
      document.getElementById("a11y-reading-mask-bottom")?.remove();
      return;
    }
    function makeMask(id: string) {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.setAttribute("aria-hidden", "true");
        document.body.appendChild(el);
      }
      return el;
    }
    const top = makeMask("a11y-reading-mask-top");
    const bottom = makeMask("a11y-reading-mask-bottom");
    const STRIP = 80;
    const onMove = (e: MouseEvent) => {
      const y = e.clientY;
      top.style.height = `${Math.max(0, y - STRIP)}px`;
      bottom.style.top = `${y + STRIP}px`;
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      top.remove();
      bottom.remove();
    };
  }, [state.readingMask]);

  // Synchro prefers-reduced-motion OS avec l'état initial (lecture seule)
  const syncedMotion = useRef(false);
  useEffect(() => {
    if (syncedMotion.current) return;
    syncedMotion.current = true;
    // pas d'écriture automatique : laisser l'utilisateur choisir
  }, []);
}
