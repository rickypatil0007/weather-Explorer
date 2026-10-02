# RESPONSIVE & ACCESSIBILITY
## Weather Explorer

### 1. Responsive Layout Strategy
The layout must adapt smoothly across devices using CSS Grid and Flexbox without relying on external libraries like Bootstrap or Tailwind.

**Breakpoints (Suggestions):**
- **Mobile (`< 768px`):** Single column layout. Header -> Map -> User Location Card -> Selected Location Card -> Comparison Table (scrolling horizontally if needed) -> Forecast.
- **Tablet (`768px - 1024px`):** Map takes full width at the top. The two weather cards sit side-by-side (`grid-template-columns: 1fr 1fr`).
- **Desktop (`> 1024px`):** Map on the left (spanning rows), Weather cards and comparison stacked on the right, forming a dashboard layout.

### 2. Touch and Mobile Interactions
- **Map:** Ensure the Leaflet map allows panning and zooming via touch gestures.
- **Buttons:** Minimum tap target size of `44px` by `44px`.
- **Search Bar:** Ensure it does not trigger unwanted page zoom on iOS (use `font-size: 16px` minimum for inputs).

### 3. Accessibility (a11y) Requirements
This project must be accessible to users with disabilities, particularly those using keyboards or screen readers.

- **Semantic HTML:** Use `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>` appropriately.
- **Form Controls:** Every `<input>` must have a corresponding `<label>` (can be visually hidden using CSS if the design dictates, but must be present in the DOM).
- **Buttons:** Use `<button>` for actions, not `<div>` or `<span>` with click handlers.
- **Alt Text:** Use empty alt text (`alt=""`) for purely decorative icons. Use meaningful alt text for informative images (e.g., `<img src="sun.svg" alt="Clear sky">`).
- **Contrast:** Ensure all text passes WCAG AA contrast ratios against its background (particularly important in Dark Mode).
- **Focus States:** Never set `outline: none` without providing a custom, highly visible `:focus` style. Keyboard navigation must be clear and logical.
