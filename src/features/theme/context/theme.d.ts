export type ThemeName =
  "classic" | "midnight" |
  "neon" | "mocha" |
  "ice-latte" | "gruvbox-dark" |
  "github-dark" | "github-light" |
  "nord" | "rose-pine" |
  "rose-pine-dawn" | "amoled"

export interface Theme {
  name: string,
  namekey: string,
  on_primary: string,
  input: string,
  darker: string,
  dark: string,
  darkless: string,
  primary: string,
  secondary: string,
  muted: string,
  text_muted: string,
  surface: string,
  surface_100: string,
  surface_200: string,
  surface_300: string,
  surface_content: string,
  info: string,
  success: string,
  warning: string,
  danger: string,
  // Colors
  red: string,
  orange: string,
  yellow: string,
  green: string,
  cyan: string,
  blue: string,
  purple: string
}