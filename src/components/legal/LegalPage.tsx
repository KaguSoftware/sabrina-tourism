import { genericMessage } from "@/lib/whatsapp/whatsapp";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <section className="relative z-10 min-h-screen px-[clamp(20px,4vw,56px)] pt-[clamp(140px,16vw,220px)] pb-[clamp(80px,10vw,140px)]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <span aria-hidden className="block h-px w-8 bg-ochre" />
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
            {eyebrow}
          </p>
        </div>
        <h1 className="font-display font-light text-[clamp(42px,6vw,72px)] tracking-tight leading-[1.05] text-ink mb-6">
          {title}
        </h1>
        <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[62ch] mb-12">
          {intro}
        </p>

        <div className="space-y-8 border-y border-rule py-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-mono text-[12px] tracking-[0.18em] uppercase text-ochre mb-3">
                {section.heading}
              </h2>
              <p className="text-[15px] leading-[1.75] text-ink-soft">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <a
          href={genericMessage()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 border border-ochre bg-navy px-6 py-4 font-mono text-[12px] font-semibold tracking-[0.16em] uppercase text-ochre transition-all duration-300 hover:-translate-y-0.5"
        >
          Contact us on WhatsApp
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
