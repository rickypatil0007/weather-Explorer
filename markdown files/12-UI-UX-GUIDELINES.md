# UI/UX & Styling Guidelines

## 1. Core Philosophy
The interface should feel like a premium, modern dashboard. It must look significantly better than a standard "student project." 
**Mantra:** Clean, spacious, and contextual.

## 2. Typography
Use modern, highly legible sans-serif fonts. Avoid browser defaults (Times New Roman, basic Arial).
- **Primary Font:** 'Inter', 'Roboto', or system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).
- **Hierarchy:**
  - `h1` (App Title): Bold, spaced, prominent.
  - `h2` (Card Titles): Uppercase, semi-bold, subtle letter-spacing.
  - `.temp-large`: Massive font size (`3rem`+), thin or regular weight.
  - `.body-text`: `1rem`, `1.5` line height.

## 3. Color Palette

### Light Mode
- **Background:** Soft grayish-blue (`#f0f2f5`).
- **Cards/Containers:** Solid White (`#ffffff`) with subtle drop shadows (`box-shadow: 0 4px 6px rgba(0,0,0,0.05)`).
- **Text Primary:** Dark Gray/Black (`#1a1a1a`).
- **Text Secondary:** Medium Gray (`#666666`).
- **Accents:** Modern Blue (`#007AFF` or `#2563EB`) for primary buttons and active markers.

### Dark Mode
- **Background:** Deep Gray/Almost Black (`#121212`).
- **Cards/Containers:** Slightly lighter Gray (`#1e1e1e`) with very subtle borders instead of heavy shadows.
- **Text Primary:** Off-White (`#f5f5f5`).
- **Text Secondary:** Light Gray (`#a0a0a0`).
- **Accents:** Slightly desaturated Blue to reduce eye strain (`#3b82f6`).

## 4. Component Styling Rules

### Glassmorphism / Cards
Cards should have rounded corners (`border-radius: 12px` or `16px`). 
Optional: Apply a very subtle `backdrop-filter: blur(10px)` with a semi-transparent background if layered over a colored element, but keep it mostly solid for readability.

### Buttons & Inputs
- **Inputs:** No harsh black borders. Use soft gray borders, rounded edges, and a distinct focus state (`outline: 2px solid var(--accent-color)`).
- **Buttons:** Padding (e.g., `10px 20px`), borderless, smooth hover state (`filter: brightness(1.1); transform: translateY(-1px)`), and active state (`transform: translateY(0)`).

### Map Container
- Must have rounded corners matching the cards (`border-radius: 12px; overflow: hidden;`).
- Provide a subtle border to separate it from the background.

## 5. Micro-Interactions (Animations)
- **Hover:** All clickable elements (buttons, search results, recent locations) must have a hover effect.
- **Data Load:** When new weather data is injected into a card, use a quick CSS fade-in animation to prevent visual jarring.
  ```css
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fadeUp 0.3s ease-out forwards; }
  ```

## 6. Layout Spacing
- Use a consistent spacing scale (e.g., multiples of 8px).
- Internal card padding: `24px`.
- Gap between grid items: `24px`.

## 7. Responsiveness
- **Desktop (>1024px):** 2 or 3 column grid. Map takes left side, cards stack on right.
- **Tablet (768px - 1024px):** 2 columns or stacked depending on content density.
- **Mobile (<768px):** 100% width stacked layout. Order: Search -> Map -> User Card -> Selected Card -> Comparison.

## 8. Avoid
- Pure `#000000` black or `#FF0000` red.
- Heavy, dated gradients.
- Tailwind CSS or Bootstrap classes (must write vanilla CSS).
- Unnecessary border lines (use background color contrast or shadows to separate sections).
