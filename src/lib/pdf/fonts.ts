import { Font } from "@react-pdf/renderer";
import path from "path";

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;

  const fr = path.join(process.cwd(), "node_modules/@fontsource/fraunces/files");
  const it = path.join(process.cwd(), "node_modules/@fontsource/inter/files");
  const jb = path.join(process.cwd(), "node_modules/@fontsource/jetbrains-mono/files");

  // Fraunces — display serif (site's --font-fraunces)
  Font.register({
    family: "Fraunces",
    fonts: [
      { src: path.join(fr, "fraunces-latin-300-normal.woff"), fontWeight: 300, fontStyle: "normal" },
      { src: path.join(fr, "fraunces-latin-300-italic.woff"), fontWeight: 300, fontStyle: "italic" },
      { src: path.join(fr, "fraunces-latin-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(fr, "fraunces-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(fr, "fraunces-latin-700-normal.woff"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(fr, "fraunces-latin-900-normal.woff"), fontWeight: 900, fontStyle: "normal" },
      { src: path.join(fr, "fraunces-latin-900-italic.woff"), fontWeight: 900, fontStyle: "italic" },
    ],
  });

  // Inter — body sans (site's --font-inter)
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(it, "inter-latin-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(it, "inter-latin-500-normal.woff"), fontWeight: 500, fontStyle: "normal" },
      { src: path.join(it, "inter-latin-600-normal.woff"), fontWeight: 600, fontStyle: "normal" },
    ],
  });

  // JetBrains Mono — labels (site's --font-mono)
  Font.register({
    family: "JetBrains Mono",
    fonts: [
      { src: path.join(jb, "jetbrains-mono-latin-ext-400-normal.woff"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(jb, "jetbrains-mono-latin-ext-500-normal.woff"), fontWeight: 500, fontStyle: "normal" },
    ],
  });
}
