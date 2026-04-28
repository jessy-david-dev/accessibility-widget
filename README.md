# accessibility-widget

[![npm](https://img.shields.io/npm/v/a11y-widget)](https://www.npmjs.com/package/a11y-widget)
[![license](https://img.shields.io/npm/l/a11y-widget)](./LICENSE)

Widget d'accessibilité React aligné **RGAA 4.1 / WCAG 2.1 AA**, conçu pour rendre les sites et services numériques accessibles à toutes et à tous.

## Installation

```bash
npm install a11y-widget
```

## Usage

```tsx
import { AccessibilityWidget } from "accessibility-widget";
import "accessibility-widget/dist/accessibility-widget.css";

export default function App() {
  return (
    <>
      <AccessibilityWidget position="bottom-right" lang="fr" />
    </>
  );
}
```

## Props

| Prop         | Type                                                                 | Défaut                | Description                                          |
| ------------ | -------------------------------------------------------------------- | --------------------- | ---------------------------------------------------- |
| `position`   | `"bottom-right"` \| `"bottom-left"` \| `"top-right"` \| `"top-left"` | `"bottom-right"`      | Position du bouton flottant                          |
| `lang`       | `"fr"` \| `"en"`                                                     | `"fr"`                | Langue de l'interface                                |
| `storageKey` | `string`                                                             | `"a11y-widget-prefs"` | Clé localStorage pour la persistance des préférences |

## Fonctionnalités

### RGAA 3 - Couleurs

- Contraste élevé
- Inversion des couleurs

### RGAA 10 - Présentation de l'information

- Taille du texte (×1 / ×1.2 / ×1.4 / ×1.6)
- Hauteur de ligne augmentée
- Espacement des lettres
- Espacement des mots
- Alignement du texte à gauche
- Police lisible (serif) ou dyslexique (OpenDyslexic)

### RGAA 13 - Consultation

- Réduction des animations
- Mise en pause des animations

### Navigation au clavier

- Indicateur de focus renforcé
- Mise en évidence des liens

### Aide à la lecture

- Guide de lecture (réticule horizontal)
- Masque de lecture

## Accessibilité du widget lui-même

Le widget est lui-même conforme RGAA :

- Bouton trigger avec `aria-label`, `aria-expanded`, `aria-haspopup="dialog"`
- Dialog avec `role="dialog"`, `aria-modal`, `aria-labelledby`
- Focus-trap dans le panneau (Tab / Shift+Tab)
- Fermeture par Échap avec retour du focus sur le trigger
- Switches avec `role="switch"`, `aria-checked`, `aria-labelledby`
- Annonces des changements d'état via `aria-live="polite"`
- Compatible NVDA + Firefox, JAWS + Firefox, VoiceOver + Safari, TalkBack + Chrome

## Environnements de test recommandés (RGAA)

| Environnement                         | OS          |
| ------------------------------------- | ----------- |
| NVDA (dernière version) + Firefox     | Windows     |
| JAWS (version précédente) + Firefox   | Windows     |
| VoiceOver (dernière version) + Safari | macOS / iOS |
| TalkBack (dernière version) + Chrome  | Android     |

## Usage avancé

### Usage headless (hooks uniquement)

```tsx
import { useA11yStore, useA11yEffects } from "accessibility-widget";

function MonWidget() {
  const { state, dispatch } = useA11yStore("a11y-widget-prefs");
  useA11yEffects(state);

  return (
    <button onClick={() => dispatch({ type: "TOGGLE_HIGH_CONTRAST" })}>
      Contraste élevé
    </button>
  );
}
```

### Personnalisation CSS

Toutes les couleurs et dimensions sont en custom properties CSS :

```css
:root {
  --a11y-color-bg: #1a1a2e; /* couleur du bouton et header */
  --a11y-color-accent: #005fcc; /* couleur d'accentuation */
  --a11y-panel-width: 340px; /* largeur du panneau */
  --a11y-radius: 12px; /* rayon des bordures */
}
```

## Référence

- [RGAA 4.1 - Critères et tests](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)
- [RGAA 4.1 - Environnements de test](https://accessibilite.numerique.gouv.fr/methode/environnement-de-test/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)

## Licence

MIT © [Jessy DAVID](https://jessy-david.dev)
