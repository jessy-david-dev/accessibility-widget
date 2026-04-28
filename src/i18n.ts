export const translations = {
  fr: {
    openMenu: "Ouvrir les options d'accessibilité",
    closeMenu: "Fermer les options d'accessibilité",
    panelTitle: "Accessibilité",
    reset: "Réinitialiser",
    close: "Fermer",

    sectionColors: "Couleurs",
    highContrast: "Contraste élevé",
    invertColors: "Inverser les couleurs",

    sectionText: "Texte",
    fontSize: "Taille du texte",
    fontSizeNormal: "Normal",
    fontSizeLarge: "Grand",
    fontSizeXL: "Très grand",
    fontSizeXXL: "Très très grand",
    lineHeight: "Hauteur de ligne",
    letterSpacing: "Espacement des lettres",
    wordSpacing: "Espacement des mots",

    sectionFont: "Police",
    fontDefault: "Par défaut",
    fontReadable: "Lisible",
    fontDyslexic: "Dyslexique",

    sectionMotion: "Mouvement",
    reduceMotion: "Réduire les animations",
    pauseAnimations: "Mettre en pause les animations",

    sectionNavigation: "Navigation",
    focusVisible: "Indicateur de focus renforcé",
    highlightLinks: "Mettre en évidence les liens",

    sectionReading: "Aide à la lecture",
    readingGuide: "Guide de lecture",
    readingMask: "Masque de lecture",
    textAlignLeft: "Aligner le texte à gauche",
  },
  en: {
    openMenu: "Open accessibility options",
    closeMenu: "Close accessibility options",
    panelTitle: "Accessibility",
    reset: "Reset",
    close: "Close",

    sectionColors: "Colors",
    highContrast: "High contrast",
    invertColors: "Invert colors",

    sectionText: "Text",
    fontSize: "Font size",
    fontSizeNormal: "Normal",
    fontSizeLarge: "Large",
    fontSizeXL: "Extra large",
    fontSizeXXL: "Extra extra large",
    lineHeight: "Line height",
    letterSpacing: "Letter spacing",
    wordSpacing: "Word spacing",

    sectionFont: "Font",
    fontDefault: "Default",
    fontReadable: "Readable",
    fontDyslexic: "Dyslexic",

    sectionMotion: "Motion",
    reduceMotion: "Reduce animations",
    pauseAnimations: "Pause animations",

    sectionNavigation: "Navigation",
    focusVisible: "Enhanced focus indicator",
    highlightLinks: "Highlight links",

    sectionReading: "Reading aids",
    readingGuide: "Reading guide",
    readingMask: "Reading mask",
    textAlignLeft: "Align text to the left",
  },
} as const;

export type Lang = keyof typeof translations;
export type T = (typeof translations)[Lang];
