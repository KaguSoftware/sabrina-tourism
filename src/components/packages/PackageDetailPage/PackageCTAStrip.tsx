"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { packageMessage } from "@/lib/whatsapp/whatsapp";
import { PEOPLE_OPTIONS, TIER_LABELS } from "@/lib/packages/constants";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";

export function PackageCTAStrip({
  packageName,
  tierName,
  date,
  people,
  onDateChange,
  onPeopleChange,
  onTierChange,
}: {
  packageName: string;
  tierName: string;
  date: string;
  people: string;
  onDateChange: (v: string) => void;
  onPeopleChange: (v: string) => void;
  onTierChange: (v: string) => void;
}) {
  const t = useTranslations("packageDetail");
  const tCommon = useTranslations("common");
  const tWa = useTranslations("whatsapp");
  const today = new Date().toISOString().split("T")[0];
  const [submitted, setSubmitted] = useState(false);
  const [singleRoom, setSingleRoom] = useState(false);
  const [children, setChildren] = useState<Array<{ id: string; age: string }>>([]);
  const dateMissing = submitted && !date;

  const isOneGuest = people === "1";
  const childrenAges = children.map((c) => c.age || "?");
  const childrenSuffix =
    children.length > 0
      ? tWa("childrenSuffix", { count: children.length, ages: childrenAges.join(", ") })
      : "";
  const singleRoomSuffix = isOneGuest && singleRoom ? tWa("singleRoomSuffix") : "";

  const previewMsg = `Hey Sabrina — I'd like to reserve "${packageName}" at the ${tierName} tier for ${people || "TBD"} guest(s)${childrenSuffix}${singleRoomSuffix}, starting ${date || "TBD"}. Could you confirm availability?`;

  const waHref = packageMessage({
    name: packageName,
    tier: tierName,
    date: date || "TBD",
    count: people || "TBD",
    childrenAges: children.length > 0 ? childrenAges : undefined,
    singleRoom: isOneGuest && singleRoom ? true : undefined,
  });

  const addChild = () => {
    setChildren((arr) => [...arr, { id: crypto.randomUUID(), age: "" }]);
  };
  const removeChild = (id: string) => {
    setChildren((arr) => arr.filter((c) => c.id !== id));
  };
  const updateChildAge = (id: string, age: string) => {
    setChildren((arr) => arr.map((c) => (c.id === id ? { ...c, age } : c)));
  };

  return (
    <section className="pt-[clamp(12px,2vw,24px)] pb-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)] relative z-20">
      <div className="max-w-[1320px] mx-auto">
        <Reveal><Kicker>{t("reserve")}</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(40px,6vw,84px)] mt-6 mb-7 tracking-[-0.02em]">
            {packageName}, {tierName} tier.
          </GoldUnderlineHeading>
        </Reveal>

        <Reveal delay={160}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre mb-10">
            No payment now &nbsp;·&nbsp; We send a tailored quote first &nbsp;·&nbsp; You confirm only when ready
          </p>
        </Reveal>

        {/* Inline form */}
        <Reveal delay={200}>
          <div
            id="package-reserve-inputs"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-140 mb-8 scroll-mt-28"
          >
            {/* Date */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
                {t("startDate")} {dateMissing && <span className="text-terracotta normal-case tracking-normal">— {t("required")}</span>}
              </span>
              <DatePicker value={date} onChange={onDateChange} min={today} error={dateMissing} />
            </div>

            {/* People */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("groupSize")}</span>
              <div className="flex flex-wrap gap-2">
                {PEOPLE_OPTIONS.map((opt) => {
                  const active = people === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onPeopleChange(active ? "" : opt.value)}
                      className="font-sans text-[13px] px-4 py-1.5 rounded-full border transition-all duration-200"
                      style={{
                        backgroundColor: active ? "#0b1a2e" : "transparent",
                        color: active ? "#c99a3f" : "#1f1a14",
                        borderColor: active ? "transparent" : "#c99a3f",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Single-room occupancy (only when 1 guest) */}
        {isOneGuest && (
          <Reveal delay={210}>
            <div className="mb-6 max-w-140">
              <label className="inline-flex items-center gap-2.5 cursor-pointer font-mono text-[12px] tracking-[0.06em] text-ink-soft">
                <input
                  type="checkbox"
                  checked={singleRoom}
                  onChange={(e) => setSingleRoom(e.target.checked)}
                  className="accent-ochre w-4 h-4"
                />
                <span>{t("singleRoomOccupancy")}</span>
              </label>
            </div>
          </Reveal>
        )}

        {/* Children */}
        <Reveal delay={215}>
          <div className="mb-8 max-w-140 flex flex-col gap-2">
            {children.map((child) => (
              <div key={child.id} className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted min-w-[3ch]">{t("childAge")}</span>
                <input
                  type="number"
                  min={0}
                  max={17}
                  value={child.age}
                  onChange={(e) => updateChildAge(child.id, e.target.value)}
                  className="w-20 border-b border-rule bg-transparent font-sans text-[14px] text-ink pb-1.5 focus:outline-none focus:border-ochre transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => removeChild(child.id)}
                  aria-label={t("removeChild")}
                  className="text-ink-soft hover:text-ochre transition-colors text-[18px] leading-none px-2"
                >×</button>
              </div>
            ))}
            <button
              type="button"
              onClick={addChild}
              className="self-start font-mono text-[12px] tracking-[0.06em] text-ochre hover:text-navy transition-colors mt-1"
            >
              {t("addChildren")}
            </button>
          </div>
        </Reveal>

        {/* Tier */}
        <Reveal delay={220}>
          <div className="flex flex-col gap-2 mb-10 max-w-140">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("tierLabel")}</span>
            <div className="flex flex-wrap gap-2">
              {TIER_LABELS.map((t) => {
                const active = tierName === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTierChange(t)}
                    className="font-sans text-[13px] px-4 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      backgroundColor: active ? "#0b1a2e" : "transparent",
                      color: active ? "#c99a3f" : "#1f1a14",
                      borderColor: active ? "transparent" : "#c99a3f",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Message preview */}
        <Reveal delay={240}>
          <div className="mb-10 max-w-160">
            <Kicker className="mb-3">{t("messagePreview")}</Kicker>
            <pre className="font-mono text-[12px] leading-[1.7] text-ink-soft whitespace-pre-wrap p-4 border-l-2 border-ochre/50 bg-ochre/5">
              {previewMsg}
            </pre>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <button
            type="button"
            onClick={() => {
              setSubmitted(true);
              if (!date) return;
              window.open(waHref, "_blank", "noopener,noreferrer");
            }}
            style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
            className="inline-flex items-center gap-4 px-10 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-semibold shadow-[0_4px_32px_-6px_rgba(11,26,46,0.45)] transition-all duration-300 hover:shadow-[0_8px_40px_-6px_rgba(11,26,46,0.35)] hover:scale-[1.02] active:scale-[0.99] group"
          >
            <span>{tCommon("reserveWhatsapp")}</span>
            <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
