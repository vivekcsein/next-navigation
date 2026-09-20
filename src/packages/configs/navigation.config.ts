import type { NavSection, NavTab } from "@/types/navigation";
import appConfig from "./app.config";

/** Desktop nav shows at/above this width. Keep in sync with the 1024px breakpoints in styles/ui/*.css. */
export const DESKTOP_NAV_MEDIA_QUERY = "(min-width: 1024px)";

/** id of the mobile drawer panel — the hamburger's aria-controls target. */
export const MOBILE_MENU_ID = "mobile-menu";

export const mainNav: NavTab[] = [
  { id: "home", title: "Home", href: appConfig.routes.home },
  { id: "about", title: "About", href: appConfig.routes.about },
  {
    id: "services",
    title: "Services",
    dropdown: [
      {
        category: "Development",
        items: [
          {
            label: "Web Development",
            href: appConfig.routes.services.webDevelopment,
          },
          {
            label: "Performance & Optimization",
            href: appConfig.routes.services.performance,
          },
          { label: "Backend & APIs", href: appConfig.routes.services.backend },
          {
            label: "Authentication & Security",
            href: appConfig.routes.services.authenticationSecurity,
          },
        ],
      },
      {
        category: "Specialized",
        items: [
          {
            label: "SEO & Ad Monetization",
            href: appConfig.routes.services.seoAdsMonetization,
          },
          {
            label: "AR Experiences",
            href: appConfig.routes.services.augmentedReality,
          },
          { label: "Animation", href: appConfig.routes.services.animation },
          {
            label: "Figma to Code",
            href: appConfig.routes.services.figmaToCode,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    title: "Content",
    dropdown: [
      {
        category: "Articles",
        items: [
          { label: "Blogs", href: appConfig.routes.content.blogs },
          { label: "Docs", href: appConfig.routes.content.docs },
          { label: "Code", href: appConfig.routes.content.code },
        ],
      },
      {
        category: "Resources",
        items: [
          { label: "Tech Stack", href: appConfig.routes.content.techStack },
          { label: "Journey", href: appConfig.routes.content.journey },
        ],
      },
    ],
  },
  { id: "projects", title: "Projects", href: appConfig.routes.projects },
  { id: "contact", title: "Contact", href: appConfig.routes.legal.contact },
];
export const footerNav: NavSection[] = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: appConfig.routes.home },
      { label: "About", href: appConfig.routes.about },
      { label: "Projects", href: appConfig.routes.projects },
      { label: "Tech Stack", href: appConfig.routes.content.techStack },
    ],
  },
  {
    title: "Services",
    items: [
      {
        label: "Web Development",
        href: appConfig.routes.services.webDevelopment,
      },
      { label: "Backend & APIs", href: appConfig.routes.services.backend },
      {
        label: "Performance Optimization",
        href: appConfig.routes.services.performance,
      },
      {
        label: "Security & Authentication",
        href: appConfig.routes.services.authenticationSecurity,
      },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Blogs", href: appConfig.routes.content.blogs },
      { label: "Journey", href: appConfig.routes.content.journey },
      { label: "Contact", href: appConfig.routes.legal.contact },
    ],
  },
];
