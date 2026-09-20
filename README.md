# next-navigation

A reusable, accessible navigation system for Next.js (App Router): a sticky header with mega-dropdowns, a mobile drawer with accordions, and a responsive footer. UI only — no auth logic is wired up.

## Features

**Header (desktop, 1024px and up)**

- Sticky, translucent header with a text-width hover underline (grows in from the left, leaves out through the right)
- Dropdown menus with a staggered entrance animation driven by the animation config
- Hover bridge, keyboard support (Enter/Space, Escape, Tab-out) and touch support (tap outside to close)
- Current route and current section highlighting

**Mobile (below 1024px)**

- A hamburger that morphs into an X in place, so open and close are the same button
- Slide-in drawer that starts below the header, with a backdrop, scroll lock and focus restore
- Accordion navigation with smooth height animation
- Drawer footer with a profile section and Sign in / Sign up buttons (guest) or a profile card and Sign out (signed in)
- Auto-closes on route change and on resize to desktop

**Footer**

- Accordion below 768px, three columns at 768px and up, with no hydration flash
- Text-only hover underline

## Stack

Next.js 16 (App Router), React 19 (React Compiler on), TypeScript, Tailwind CSS v4 plus plain CSS files, Bun, Biome, next-themes.

## Getting started

```bash
bun install
bun run dev        # http://localhost:3000
```

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `bun run dev`       | Start the dev server                              |
| `bun run build`     | Production build (needs network for Google Fonts) |
| `bun run typecheck` | `tsc --noEmit`                                    |
| `bun run check`     | Biome lint and format                             |
| `bun run verify`    | Lint, format, check and typecheck                 |

## Project structure

```
src/
  app/                          layout, home page, /dev scratch page
  components/
    layouts/                    AppClientLayout, Header, Footer, ThemeToggle
    features/navigation/
      navbar/                   NavbarDesktop, NavbarDesktopAction, NavbarMobile,
                                NavigationMobileFooter, Hamburger
      footer/                   FooterNavbar (server), FooterAccordion (client)
    providers/                  NavigationProvider (store context + hooks)
    ui/                         drawer, accordian, buttons, links, images, icon
  packages/
    configs/                    navigation, animation, app, theme, font, seo
    hooks/                      useHoverDropdown, useNavigationAutoClose, useAccordion, ...
    store/                      navigation.store (external store)
    utils/                      animation.ts, cn.ts
  styles/
    globals.css                 imports everything
    ui/                         drawer, hamburger, accordian, navigation, footer
    utils/                      animations, base, theme
  types/                        navigation.d.ts
```

## Customising

- **Menu items:** edit `packages/configs/navigation.config.ts` (main nav, dropdown categories, footer sections). No component changes are needed.
- **Routes:** `packages/configs/app.config.ts` (`routes`, including `routes.auth`).
- **Hamburger look:** change the CSS variables at the top of `styles/ui/hamburger.css`.
- **Dropdown animation:** the `"dropdown"` type and `dropdownIn` keyframe live in `animation.config.ts` and `styles/utils/animations.css`.
- **Header height:** `--header-height` in `styles/ui/navigation.css`. The drawer offsets itself from it.
- **Breakpoint:** the desktop breakpoint is 1024px, defined in `DESKTOP_NAV_MEDIA_QUERY` and in the media queries in `styles/ui/*.css`. Change them together.
- **Signed-in preview:** pass `user={{ name, email }}` to `NavigationMobileFooter` in `Header.tsx`.

## Known gaps

- No auth pages or forms (`/sign-in`, `/sign-up` and `/profile` are route constants only)
- The drawer has no full focus trap yet
- The `accordian` folder and CSS file are misspelled; rename them to `accordion` everywhere at once

---

# Recreate this from scratch (step-by-step prompts)

Use these prompts in order with an AI coding assistant, in a fresh Next.js project. Run typecheck, Biome and a build after **each** step, and only move on when they pass. Each step assumes the previous ones are done.

## Step 0: Project setup and ground rules

```
You are a senior front-end engineer working in a Next.js App Router project
(latest Next.js, React 19 with React Compiler, TypeScript strict, Tailwind
CSS v4, Bun, Biome).

Before writing code, read the framework docs bundled in node_modules; APIs
may differ from your training data.

Ground rules for everything that follows:
- All colours and radii come from design tokens (CSS variables such as
  background, foreground, primary, accent, border, ring, popover, card,
  muted-foreground, radius). Light and dark must both work. No hardcoded colours.
- Component-specific styles live in their own CSS files, imported from one
  globals file. Class names in markup must match the CSS exactly.
- Use one easing for all motion: cubic-bezier(0.16, 1, 0.3, 1). Respect
  prefers-reduced-motion.
- Never write refs during render. Update them in effects.
- No console.log in components. Deliver only new or changed files.
- Shell components and their inner pieces go in separate files.
```

## Step 1: Config, types and animation foundation

```
Create the data and animation foundation.

1. A navigation config with: the main nav (some plain links, some dropdown
   groups with categories and items), the footer sections, a constant for the
   desktop media query (min-width 1024px), and a constant for the mobile menu
   element id.
2. Types for nav tabs, dropdown categories, footer sections, the navigation
   UI state (activeDropdown, activeMobileCategory, mobileMenuOpen) and an
   optional signed-in user (name, email, optional avatar URL).
3. An app config with all route constants, including an auth group
   (sign in, sign up, profile).
4. An animation config with typed animation types and names, including a
   short "dropdown" animation (small drop, slight scale, soft blur-in), and
   a util that returns COMPLETE inline animation styles (name, duration,
   easing, fill mode, delay). A bare keyframe name alone never plays.
   Direction must actually change the animation name if you accept it.
5. The matching keyframes in a shared animations CSS file.

Acceptance: typecheck and Biome pass.
```

## Step 2: Navigation state

```
Create a small external store scoped per header instance, holding
activeDropdown, activeMobileCategory and mobileMenuOpen. Expose it through a
provider with per-key subscriptions (useSyncExternalStore), so a dropdown
hover never re-renders the drawer. Provide stable action functions:
setActiveDropdown, setActiveMobileCategory, toggleMobileCategory,
setMobileMenuOpen, toggleMobileMenu and closeAll. Wrap the app layout with
the theme provider and this provider.

Acceptance: hooks throw a clear error when used outside the provider.
```

## Step 3: Hooks

```
Create three hooks in a hooks folder. Hooks must not import components.

1. Hover dropdown, for one item in a group sharing a single active id:
   - Hover opens immediately and closes after about 200ms. The delayed close
     fires only if that item is still the active one.
   - Keyboard: Enter/Space toggles, Escape closes and returns focus to the
     trigger, Tab-out closes.
   - Touch: a pointer-down outside closes. A mouse or touch click only opens.
     Only keyboard-initiated clicks toggle.
   - Return refs and handler props to spread on the wrapper element.
2. Navigation auto-close: takes the close-all function as a PARAMETER. It
   closes everything on route change and when the viewport crosses into
   desktop width.
3. Accordion: single-open state with a toggle and an isOpen helper.
```

## Step 4: Desktop header

```
Build the sticky desktop header (visible at 1024px and up).

- 4rem tall (a CSS variable), translucent with backdrop blur, bottom border,
  a 40px logo. Use a dedicated sticky class (a utility class loses to a
  component's position: relative).
- Plain links and dropdown triggers must look identical. Triggers are real
  buttons with native chrome reset. Use plain links and your own classes, not
  the project's UI link/button variants, because unlayered CSS beats Tailwind
  utilities and the two will fight.
- Wrap each label in its own span. The hover underline is drawn on that span
  so it is exactly as wide as the text. It grows in from the left on hover,
  focus, active and open, and leaves out through the right. The current
  route (or the section containing it) keeps it.
- Dropdown triggers get a chevron sharing the underline's easing. It nudges
  on hover and flips when open.
- Dropdown panel:
  - It is centred with a transform that is always applied, so it never jumps.
  - The wrapper has top padding that bridges the hover gap.
  - The wrapper only shows and hides (opacity and visibility with a quick
    fade-out). The inner panel is bordered and rounded, with layered shadows,
    uppercase muted column headings and links.
  - Link hover shifts padding slightly and applies an accent background.
- Entrance animation: use the animation config's "dropdown" type on the inner
  panel and a "fade" with a growing delay on each column. Apply these styles
  ONLY while the dropdown is open, so the animation replays on every open.
  Set unconditionally it runs once at page load and never again.
- Accessibility: aria-haspopup, aria-expanded, aria-controls, aria-current,
  and visible focus rings.
- Desktop actions area: theme toggle only for now (the hamburger arrives in
  the next step).

Acceptance: measure that the underline width equals the text width; hover from
trigger to panel without the panel closing; the animation replays on each open.
```

## Step 5: Hamburger, drawer and mobile navigation

```
Build the mobile experience (below 1024px).

1. Hamburger, its own component AND its own CSS file, driven by CSS custom
   properties (size, bar width and height, gap, colour, duration, easing):
   - Three bars with the middle one shorter. On hover the middle bar extends.
   - When open, the bars morph into an X IN PLACE. The open and close controls
     are the same button in the same position. There is no separate close
     button.
   - It is hidden at desktop widths. Set aria-label, aria-expanded and
     aria-controls (pointing at the drawer id).
2. Generic Drawer: renders through a portal, slides in from the right, has a
   single backdrop, body-scroll lock, Escape to close and focus restore. It
   supports optional props: title, footer slot, hide-built-in-close-button,
   id, aria-label and a root class.
3. Layering: the drawer starts BELOW the header. While the menu is open, raise
   the header above the drawer layer so the hamburger/X stays visible and
   clickable. On close, drop the header back only after the slide-out
   finishes, using a delayed z-index transition, so it never flickers. Do not
   add a second backdrop anywhere else.
4. Shared accordion item, controlled by props, with its own CSS file:
   - Animate height with grid rows 0fr to 1fr and exactly ONE inner wrapper
     child. Extra grid children create extra rows and break the animation.
   - The content fades and slides slightly. Collapsed content is inert.
   - The title gets the same left-in/right-out underline as desktop. The
     chevron flips.
5. Mobile nav: plain links and accordion triggers share the same row height
   and typography. Open state comes from the navigation store. Following a
   link closes the drawer and resets the accordions. Wire the auto-close hook
   into the header.
6. Make the header sticky by default, because the drawer offsets from it.

Acceptance: multi-category accordions animate smoothly; the drawer closes on
link tap, route change and resize to desktop; body scroll unlocks afterwards.
```

## Step 6: Drawer footer (profile and account actions)

```
Create the mobile drawer footer component. It is presentational only, with no
auth.

- Guest state (default): a profile teaser with a placeholder avatar, a
  "Welcome" line and a one-line prompt, plus Sign in and Sign up buttons side
  by side.
- Signed-in state via an optional user prop: an avatar (image, or initials as
  a fallback), name and email in a card that links to the profile route, plus
  a Sign out button. The sign-out handler is a placeholder prop.
- Links call an onNavigate callback so the drawer closes. Use route constants
  from the app config. Add safe-area bottom padding.
- Pass it to the drawer through the footer slot.

Acceptance: both states render correctly in light and dark themes.
```

## Step 7: Footer

```
Build the site footer.

- Below 768px: a brand block (40px logo and tagline), then an accordion of
  link groups (reuse the shared accordion item), then the copyright bar.
  Left-aligned.
- At 768px and up: a two-part grid with the brand on the left and three link
  columns on the right, then the copyright bar. Use a subtle card background
  and a top border.
- Render BOTH the columns and the accordion in the DOM and show exactly one
  with CSS. This avoids a hydration flash and any JS breakpoint check, and the
  hidden one is display:none, so it is out of the accessibility tree.
- Footer links: plain links, muted colour. On hover they darken and get a
  text-only underline made with the background-size technique, moving left to
  right in and right out.
- The shell (brand, copyright) and the nav are separate components. The nav is
  a server component that renders the columns and the client accordion. The
  footer logo needs a unique DOM id, different from the header's.

Acceptance: the footer switches cleanly at 768px with no flash.
```

## Step 8: Final audit

```
Audit everything against this checklist and fix what fails:
- Typecheck, Biome and a production build all pass.
- Class names in markup match the CSS. Every new CSS file is imported in globals.
- Underline width equals text width; the dropdown animation replays on each
  open; the hover gap is bridged; Escape and Tab-out work.
- The hamburger morphs into an X in place and stays clickable above the drawer.
- The drawer closes on link tap, route change and resize to desktop.
- The logo is 40px in the header, and its DOM ids are unique.
- No console.log, no double slashes in joined URLs, and no ref writes during render.
- Keyboard-only navigation works; focus rings are visible everywhere.
- Both light and dark themes look right.
Report what you changed and anything intentionally left out (for example, a
full focus trap in the drawer).
```

## Common mistakes to watch for

- A hamburger that never appears is almost always a class-name mismatch between the markup and the CSS.
- A dropdown animation that only plays at page load means the animation style is set unconditionally instead of only while open.
- An accordion that only animates one category means the panel has more than one grid child.
- A sticky header that isn't sticky means a utility class is being overridden by `position: relative`. Use a dedicated class.
- When merging changes file by file, make sure shell and inner components (Footer and FooterNavbar) didn't get swapped.

## License

See [LICENSE](./LICENSE).

```
You are a senior front-end engineer. Build a production-quality, accessible navigation system (header, mobile drawer, footer) for a Next.js App Router project. No auth logic is needed. Prioritise a clean, premium UI and small, controlled components.

## Stack and conventions
- Next.js (latest, App Router), React 19, TypeScript strict, Tailwind CSS v4, Bun, Biome for lint/format. React Compiler is enabled, so never write refs during render.
- Read the framework's bundled docs in node_modules before writing code. APIs may differ from your training data.
- Styling: use design tokens (CSS variables) for every colour and radius (background, foreground, primary, accent, border, ring, popover, card, muted-foreground, radius). Support light and dark. Do not hardcode colours.
- Put component-specific styles in their own CSS files, imported from one globals file. Do not put them in Tailwind class soup.
- Keep one shared easing across all motion: cubic-bezier(0.16, 1, 0.3, 1). Respect prefers-reduced-motion.
- One desktop breakpoint (1024px) for the header, defined as a shared constant. The footer breaks at 768px.

## Architecture
1. Config: one navigation config file holding the main nav (plain links and dropdown groups with categories and items), the footer sections, the desktop media query constant, and the mobile menu element id. Add an animation config with typed names/types and one util that returns full animation styles (name, duration, easing, fill mode, delay). A bare keyframe name alone never plays.
2. State: a small external store scoped per header instance. It holds activeDropdown, activeMobileCategory and mobileMenuOpen. It is exposed through a provider with per-key subscriptions (useSyncExternalStore), so a dropdown hover never re-renders the drawer. Provide stable action functions, including closeAll.
3. Hooks (in a hooks folder, no component imports):
   - Hover dropdown: opens on hover, closes after about 200ms, and the delayed close fires only if that item is still the active one. It supports keyboard (Enter/Space toggles, Escape closes and returns focus to the trigger, Tab-out closes) and outside pointer-down for touch. A mouse or touch click opens only, and only keyboard clicks toggle. It returns refs and handler props.
   - Navigation auto-close: takes closeAll as a parameter. It closes everything on route change and when the viewport crosses into desktop.
   - Accordion: single-open state with a toggle and an isOpen helper.
4. Components:
   - Header (sticky by default), desktop nav, desktop actions (theme toggle plus hamburger), mobile nav, mobile drawer footer, footer nav, footer accordion, and a footer wrapper.
   - Reusable primitives: a Hamburger button, a controlled AccordionItem, and a generic Drawer.
   - Server components wherever there is no interactivity (the footer shell and column layout).

## Desktop header requirements
- The header is 4rem tall (a CSS variable), translucent with backdrop blur, and has a bottom border. The logo is 40px.
- Plain links and dropdown triggers must look identical. Triggers are real buttons with native chrome reset, not styled secondary buttons.
- Hover underline: it spans the label text only, not the padding or chevron. It grows in from the left on hover, focus, active and open, and leaves out through the right. The current route (or the section containing the current route) keeps it.
- Dropdown triggers have a small chevron that shares the underline's easing. It nudges on hover and flips when open.
- Dropdown panel:
  - It is centred under the trigger with a transform that is always applied, so it never jumps.
  - It has a padded wrapper that bridges the hover gap.
  - It is a rounded, bordered, layered-shadow panel with uppercase muted column headings and links.
  - Link hover shifts padding slightly and applies an accent background.
- Dropdown animation: run the entrance animation only while open (set the style conditionally so it replays every time), and never unconditionally. Add a short "dropdown" animation (small drop, slight scale, soft blur-in) to the animation config, and stagger the columns with a fade plus delay. The wrapper handles opacity/visibility with a quick fade-out.
- Accessibility: aria-haspopup, aria-expanded, aria-controls, aria-current on the active route, and visible focus rings on every interactive element.

## Mobile requirements
- Hamburger:
  - It is its own component with its own CSS file, driven by CSS custom properties (size, bar width/height, gap, colour, duration, easing).
  - It has three bars, with the middle bar shorter. On hover the middle bar extends.
  - When open, the three bars morph into an X in place. The open and close controls must be the same button in the same position (no separate close button).
  - It is hidden at desktop widths.
- Drawer (generic, reusable): slides in from the right through a portal, with a backdrop, body-scroll lock, Escape to close and focus restore. It supports optional props for title, footer slot, a hidden built-in close button, an id, an aria-label and a root class. It has one backdrop only, with no duplicates elsewhere.
- Layering: the drawer starts below the header. While the menu is open, the header rises above the drawer layer so the hamburger/X stays visible and clickable. On close, the header's z-index drops back only after the slide-out finishes, so it never flickers.
- Mobile nav: plain links and accordion rows share the same height and typography. Open state is stored in the navigation store. Following a link closes the drawer and resets the accordions.
- Accordion (shared by the nav and the footer):
  - Height animates by a grid-rows 0fr→1fr transition with exactly one inner wrapper child, because extra grid children create extra rows and break the animation.
  - Content fades and slides in slightly.
  - Collapsed content is inert.
  - The title gets the same left-in/right-out underline as desktop.
  - The chevron flips.
  - It is controlled through props.
- Drawer footer component (presentational only):
  - Guest state: a profile teaser (placeholder avatar, "Welcome" and a one-line prompt) plus Sign in and Sign up buttons side by side.
  - Signed-in state via an optional user prop (name, email, optional avatar with an initials fallback): a profile card linking to the profile route, plus a Sign out button (handler is a placeholder).
  - Links call an onNavigate callback to close the drawer. Add safe-area bottom padding. Use route constants from the app config.

## Footer requirements
- Below 768px: a brand block (40px logo and tagline), then an accordion of link groups, then the copyright bar. Left-aligned.
- At 768px and up: a two-part grid with the brand on the left and three link columns on the right, then the copyright bar. Use a subtle card background and a top border.
- Render both the columns and the accordion in the DOM and show exactly one with CSS. This avoids a hydration flash and any JS breakpoint check, and the hidden one is display:none, so it is out of the accessibility tree.
- Footer links are plain links with a muted colour. On hover they darken and get a text-only underline (a background-size trick), moving left to right in and right out.
- The logo must have a unique DOM id (do not duplicate the header's).

## Pitfalls to avoid (learned the hard way)
- Class names in markup must match the CSS exactly. A mismatched hamburger class made it invisible.
- An unlayered CSS rule beats Tailwind utilities. Do not fight it. Use plain elements and your own classes for the nav.
- A sticky utility class loses to a component's position: relative, so use a dedicated sticky class.
- An animation set inline unconditionally runs once at page load and never again. Apply it only while open.
- The animation helper must return duration, easing, fill mode and delay. Direction must actually change the animation name if you claim to support it.
- The default logo size must be correct for the header (not 128px).
- No console.log left in components.
- No double slashes when joining base URLs and paths.
- Do not write refs during render. Update them in effects.
- A drawer left open after a resize or route change must not keep the body scroll locked.
- When copying files, keep the shell components (Footer) and their inner pieces (FooterNavbar) in separate files.

## Deliverables and acceptance criteria
- Deliver only new or changed files, plus a patch.
- Run typecheck, Biome and a production build. All must pass with no lint suppressions except one justified, commented case.
- Manually verify:
  - Underline width equals text width.
  - Dropdown animation replays on each open and stagger is visible.
  - Hover-gap bridging, Escape and Tab-out behaviour.
  - Hamburger morphs to X in place and stays clickable above the drawer.
  - Drawer closes on link tap, route change and resize to desktop.
  - Accordions animate smoothly with multiple categories.
  - Footer switches cleanly at 768px with no flash.
  - Light and dark themes.
  - Keyboard-only navigation.
- Keep the final response short: a summary of changes plus anything intentionally left out (for example, a full focus trap in the drawer).

```
