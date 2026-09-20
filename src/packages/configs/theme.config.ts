export const THEME_STORAGE_KEY = "vivekcsein-theme";

export const themeConfig = {
  storageKey: THEME_STORAGE_KEY,
  defaultTheme: "system",
  enableSystem: true,
  disableTransitionOnChange: true,
} as const;
