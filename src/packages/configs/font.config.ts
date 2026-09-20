import { Fira_Code, Poppins, Roboto } from "next/font/google";
import localFont from "next/font/local";

const Sans = Roboto({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
});

const Serif = Poppins({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const Mono = Fira_Code({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const CustomFont = localFont({
  src: "../../assets/fonts/custom.ttf",
  variable: "--font-custom",
  weight: "400",
  style: "normal",
  display: "swap",
});

export default {
  sans: Sans.variable,
  serif: Serif.variable,
  mono: Mono.variable,
  custom: CustomFont.variable,
};
