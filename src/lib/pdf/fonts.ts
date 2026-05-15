import { Font } from "@react-pdf/renderer";
import path from "path";

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;
  // bump this comment to force re-registration after font changes: v7

  const pf = path.join(process.cwd(), "public/fonts");
  const jb = path.join(process.cwd(), "node_modules/@fontsource/jetbrains-mono/files");
  const ns = path.join(process.cwd(), "node_modules/@fontsource/noto-sans/files");
  const ar = path.join(process.cwd(), "node_modules/@fontsource/noto-sans-arabic/files");
  const jp = path.join(process.cwd(), "node_modules/@fontsource/noto-sans-jp/files");
  const sc = path.join(process.cwd(), "node_modules/@fontsource/noto-sans-sc/files");

  // Fraunces — static TTFs per weight (variable font ignores fontWeight in @react-pdf)
  Font.register({
    family: "Fraunces",
    fonts: [
      { src: path.join(pf, "Fraunces-Light.ttf"),        fontWeight: 300, fontStyle: "normal" },
      { src: path.join(pf, "Fraunces-LightItalic.ttf"),  fontWeight: 300, fontStyle: "italic" },
      { src: path.join(pf, "Fraunces-Regular.ttf"),      fontWeight: 400, fontStyle: "normal" },
      { src: path.join(pf, "Fraunces-Italic.ttf"),       fontWeight: 400, fontStyle: "italic" },
      { src: path.join(pf, "Fraunces-Bold.ttf"),         fontWeight: 700, fontStyle: "normal" },
      { src: path.join(pf, "Fraunces-BoldItalic.ttf"),   fontWeight: 700, fontStyle: "italic" },
      { src: path.join(pf, "Fraunces-Black.ttf"),        fontWeight: 900, fontStyle: "normal" },
      { src: path.join(pf, "Fraunces-BlackItalic.ttf"),  fontWeight: 900, fontStyle: "italic" },
    ],
  });

  // Inter — static TTFs per weight (variable font ignores fontWeight in @react-pdf)
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(pf, "Inter-Regular.ttf"),  fontWeight: 300, fontStyle: "normal" },
      { src: path.join(pf, "Inter-Regular.ttf"),  fontWeight: 300, fontStyle: "italic" },
      { src: path.join(pf, "Inter-Regular.ttf"),  fontWeight: 400, fontStyle: "normal" },
      { src: path.join(pf, "Inter-Regular.ttf"),  fontWeight: 400, fontStyle: "italic" },
      { src: path.join(pf, "Inter-Medium.ttf"),   fontWeight: 500, fontStyle: "normal" },
      { src: path.join(pf, "Inter-Medium.ttf"),   fontWeight: 500, fontStyle: "italic" },
      { src: path.join(pf, "Inter-SemiBold.ttf"), fontWeight: 600, fontStyle: "normal" },
      { src: path.join(pf, "Inter-SemiBold.ttf"), fontWeight: 600, fontStyle: "italic" },
      { src: path.join(pf, "Inter-Bold.ttf"),     fontWeight: 700, fontStyle: "normal" },
      { src: path.join(pf, "Inter-Bold.ttf"),     fontWeight: 700, fontStyle: "italic" },
      { src: path.join(pf, "Inter-Bold.ttf"),     fontWeight: 900, fontStyle: "normal" },
      { src: path.join(pf, "Inter-Bold.ttf"),     fontWeight: 900, fontStyle: "italic" },
    ],
  });

  // JetBrains Mono — labels
  Font.register({
    family: "JetBrains Mono",
    fonts: [
      { src: path.join(jb, "jetbrains-mono-latin-ext-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-500-normal.woff"), fontWeight: 500, fontStyle: "normal" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-500-italic.woff"), fontWeight: 500, fontStyle: "italic" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-700-normal.woff"), fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // Noto Sans — Cyrillic (Russian) — italic points to normal as fallback
  Font.register({
    family: "Noto Sans",
    fonts: [
      { src: path.join(ns, "noto-sans-cyrillic-400-normal.woff"), fontWeight: 300, fontStyle: "normal" },
      { src: path.join(ns, "noto-sans-cyrillic-400-normal.woff"), fontWeight: 300, fontStyle: "italic" },
      { src: path.join(ns, "noto-sans-cyrillic-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(ns, "noto-sans-cyrillic-400-normal.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(ns, "noto-sans-cyrillic-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(ns, "noto-sans-cyrillic-700-normal.woff"), fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // IBM Plex Sans Arabic — Arabic script (same font as project1)
  const ibm = path.join(process.cwd(), "public/fonts");
  Font.register({
    family: "IBMPlexSansArabic",
    fonts: [
      { src: path.join(ibm, "IBMPlexSansArabic-Regular.ttf"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(ibm, "IBMPlexSansArabic-Regular.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(ibm, "IBMPlexSansArabic-Bold.ttf"),    fontWeight: 700, fontStyle: "normal" },
      { src: path.join(ibm, "IBMPlexSansArabic-Bold.ttf"),    fontWeight: 700, fontStyle: "italic" },
      { src: path.join(ibm, "IBMPlexSansArabic-Bold.ttf"),    fontWeight: 900, fontStyle: "normal" },
    ],
  });

  // Noto Sans JP — italic points to normal as fallback
  Font.register({
    family: "Noto Sans JP",
    fonts: [
      { src: path.join(jp, "noto-sans-jp-japanese-400-normal.woff"), fontWeight: 300, fontStyle: "normal" },
      { src: path.join(jp, "noto-sans-jp-japanese-400-normal.woff"), fontWeight: 300, fontStyle: "italic" },
      { src: path.join(jp, "noto-sans-jp-japanese-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(jp, "noto-sans-jp-japanese-400-normal.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(jp, "noto-sans-jp-japanese-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(jp, "noto-sans-jp-japanese-700-normal.woff"), fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // Noto Sans SC — italic points to normal as fallback
  Font.register({
    family: "Noto Sans SC",
    fonts: [
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-400-normal.woff"), fontWeight: 300, fontStyle: "normal" },
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-400-normal.woff"), fontWeight: 300, fontStyle: "italic" },
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-400-normal.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(sc, "noto-sans-sc-chinese-simplified-700-normal.woff"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
}
