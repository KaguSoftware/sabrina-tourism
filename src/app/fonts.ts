import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

// Fraunces: only the `opsz` (optical-size) axis is actually used by our type
// scale. Dropping `SOFT` and `WONK` cuts the variable-font payload roughly in
// half. Italic kept because <em> tags in the hero / pull-quotes rely on it.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: "variable",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// JetBrains Mono: only used for small uppercase mono labels. Three weights
// cover everything in the codebase (regular, medium, semibold).
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});
