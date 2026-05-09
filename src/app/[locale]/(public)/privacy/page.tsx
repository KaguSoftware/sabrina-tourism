import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy — Sabrina Turizm",
  description: "How Sabrina Turizm handles enquiry and booking information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page explains the basic information Sabrina Turizm uses to respond to enquiries and arrange travel services."
      sections={[
        {
          heading: "Information we collect",
          body: "When you contact us, we may receive your name, contact details, travel dates, group size, destination preferences, booking notes, and related messages.",
        },
        {
          heading: "How we use it",
          body: "We use this information to respond to your enquiry, prepare quotes, coordinate travel services, manage bookings, and provide customer support.",
        },
        {
          heading: "Requests",
          body: "To ask about your information, request a correction, or request deletion where applicable, contact us directly by WhatsApp or email.",
        },
      ]}
    />
  );
}
