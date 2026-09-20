@AGENTS.md

# next-navigation — project context

Navigation system (header, mobile drawer, footer) for a Next.js App Router
project. It is a standalone base meant to be reused across Frenzz projects.
No auth logic exists yet: the auth routes and the drawer footer are UI only.

## Stack

- Next.js 16 (App Router), React 19 with React Compiler enabled, TypeScript strict
- Tailwind CSS v4 plus hand-written CSS files (see Styling)
- Bun (`packageManager`), Biome for lint and format, `next-themes` for light/dark
- Read `node_modules/next/dist/docs/` before using framework APIs (see AGENTS.md)

## Commands

- `bun run dev` / `bun run build`
- `bun run typecheck` (`tsc --noEmit --skipLibCheck`)
- `bun run check` (Biome). Run typecheck, Biome and build before finishing any change.
- `next build` fetches Google Fonts. It fails offline (fonts are in `packages/configs/font.config.ts`).

## Layout of the code (`src/`)

- `app/`: `layout.tsx` (wraps everything in `AppClientLayout`), `page.tsx`, `dev/` (scratch page)
- `components/layouts/`: `AppClientLayout` (ThemeProvider, NavigationProvider, Header, main, Footer), `Header`, `Footer`, `ThemeToggle`
- `components/features/navigation/navbar/`: `NavbarDesktop`, `NavbarDesktopAction`, `NavbarMobile`, `NavigationMobileFooter`, `Hamburger`
- `components/features/navigation/footer/`: `FooterNavbar` (server), `FooterAccordion` (client)
- `components/ui/`: `drawer/Drawer`, `accordian/AccordionItem` (folder is spelled "accordian"; keep the spelling or rename everywhere at once), `buttons/`, `links/`, `images/`, `icon/`
- `components/providers/NavigationProvider.tsx`: store context plus `useNavigationState(key)` / `useNavigationActions()`
- `packages/store/navigation.store.ts`: plain external store, per-key subscriptions
- `packages/hooks/`: `useHoverDropdown`, `useNavigationAutoClose`, `useAccordion`, `useMounted`, `useImageFromGit`
- `packages/configs/`: `navigation.config` (nav data, `DESKTOP_NAV_MEDIA_QUERY`, `MOBILE_MENU_ID`), `animation.config`, `app.config` (routes incl. `routes.auth`), theme/font/seo configs
- `packages/utils/animation.ts`: `getAnimationStyle(type, direction, { durationMs, delayMs, easing, fillMode })`
- `styles/`: `globals.css` imports everything; `ui/{drawer,hamburger,accordian,navigation,footer}.css`, `utils/animations.css`, theme files
- `types/navigation.d.ts`: `NavTab`, `NavSection`, `DropdownCategory`, `NavigationState`, `NavUser`

## What is done

### Header (desktop, >= 1024px)

- Sticky by default (`header-sticky`), 4rem tall (`--header-height`), translucent with backdrop blur.
- Nav items are plain `next/link` or `<button>` triggers sharing `.nav-btn`. Text lives in `.nav-label`, so the hover underline is exactly as wide as the text. It grows in from the left and leaves out through the right. It stays on for the current route or section.
- Dropdown triggers have a chevron that flips when open. The dropdown panel is centred with a padded hover bridge, and the wrapper only handles show/hide.
- Dropdown animation comes from `animation.config`: the `"dropdown"` type (`dropdownIn` keyframe) on the panel plus a staggered `"fade"` on each column. It is applied only while open, so it replays on every open.
- `useHoverDropdown`: hover open with a 200ms delayed close (fires only if that item is still active), Enter/Space toggle, Escape closes and refocuses the trigger, Tab-out closes, outside pointer-down closes for touch. A mouse or touch click opens only; only keyboard clicks toggle.

### Mobile (< 1024px)

- `Hamburger` (its own component and `hamburger.css`, driven by CSS variables) morphs into an X in place. It is the only open and close control.
- `Drawer` is generic: portal, backdrop, scroll lock, Escape to close, focus restore. Props include `title`, `footer`, `hideCloseButton`, `id`, `ariaLabel`, `rootClassName`. The nav drawer uses `rootClassName="mobile-menu-root"` so it starts below the header.
- Layering: while the menu is open, `.header.menu-open` is raised above the drawer layer (z-index 10001) so the hamburger/X stays clickable. On close, the z-index drops after a 400ms delay so it does not flicker.
- `NavbarMobile` uses `AccordionItem` for dropdown groups and plain rows for links. Open state lives in the navigation store. Following a link calls `closeAll` behaviour (drawer closes, accordions reset).
- `useNavigationAutoClose(closeAll)` closes everything on route change and when the viewport crosses into desktop.
- `NavigationMobileFooter` is the drawer footer: a guest state (profile teaser, Sign in and Sign up) and a signed-in state via `user` (`NavUser`): profile card, Sign out. It is presentational only; `onSignOut` is a placeholder.

### Footer

- `Footer` (shell, brand, copyright bar) contains `FooterNavbar` (server component). `FooterNavbar` renders the desktop columns and `FooterAccordion` side by side. CSS shows one (accordion below 768px, three columns at 768px and up), so there is no hydration flash.
- Footer links use a text-only underline via `background-size`.

### Shared primitives

- `AccordionItem` is controlled and uses grid-rows 0fr to 1fr with a single inner wrapper. Collapsed panels are `inert`. It is used by the mobile nav and the footer. `useAccordion` provides single-open state.

## Conventions and rules

- Use design tokens (`--primary`, `--accent`, `--border`, `--ring`, `--popover`, `--card`, `--muted-foreground`, `--radius`) for all colours. Never hardcode colours; light and dark must both work.
- One easing everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`. Respect `prefers-reduced-motion` (handled globally in `base.css`).
- Component-specific CSS goes in its own file under `styles/ui/` and is imported from `globals.css`. Class names in TSX must match the CSS exactly.
- Unlayered CSS beats Tailwind utilities. Do not fight it: for the nav, use plain elements and your own classes rather than the UI `Link` or `Button` variants.
- Animations set through inline styles must be applied conditionally (only while active), and must include duration, easing, fill mode and delay. Use `getAnimationStyle`.
- Never write refs during render (React Compiler); update them in effects.
- No `console.log` in components. No double slashes when joining URLs. Logo DOM ids must be unique per page (`navigation-logo` in the header, `footer-logo` in the footer).
- Keep shell and inner components in separate files (e.g. `Footer.tsx` vs `FooterNavbar.tsx`). This was swapped once in a merge.
- When iterating, provide only the changed files.

## Known gaps and possible next steps

- No auth: `/sign-in`, `/sign-up`, `/profile` are routes in config only. No pages or forms exist.
- `Drawer` has light accessibility only (initial focus, Escape, backdrop). No full focus trap. `aria-modal` is set although the header hamburger sits outside the dialog. The planned fix is swapping to a Dialog/Sheet primitive.
- The folder and CSS file are misspelled `accordian`. Rename to `accordion` (folder, CSS file, imports in `globals.css`, `NavbarMobile`, `FooterAccordion`).
- `SocialLinks` is referenced in comments in the footer but does not exist yet.
- Images are served from the GitHub raw URL in `appConfig.repository.imageUrl` (via `useImageFromGit`), not from `/public`.
- Visual checks have been by code review and SSR output only. Verify hover, keyboard and mobile behaviour in a real browser after changes.
