import { Font } from "@react-pdf/renderer";
import path from "path";

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;

  const dir = path.join(process.cwd(), "node_modules/@fontsource/noto-sans/files");

  // Use latin-ext subset — covers all Turkish chars (İ ı ş ğ ü ö ç) + basic Latin
  Font.register({
    family: "Noto Sans",
    fonts: [
      { src: path.join(dir, "noto-sans-latin-ext-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(dir, "noto-sans-latin-ext-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(dir, "noto-sans-latin-ext-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(dir, "noto-sans-latin-ext-700-italic.woff"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
}
