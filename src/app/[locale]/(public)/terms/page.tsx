import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms & Conditions — Sabrina Turizm",
  description: "General booking terms for Sabrina Turizm enquiries and services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="These general terms describe how enquiries and bookings are handled. Confirmed booking details are shared directly with each guest before payment."
      sections={[
        {
          heading: "Quotes and availability",
          body: "Website prices and examples are starting points unless stated otherwise. Final availability, inclusions, route details, and pricing are confirmed in writing.",
        },
        {
          heading: "Guest responsibility",
          body: "Guests are responsible for providing accurate travel dates, passenger counts, accommodation details, flight information, and any special requirements before confirmation.",
        },
        {
          heading: "Service changes",
          body: "Route, timing, hotel, vehicle, or guide changes may be needed because of availability, weather, traffic, local closures, or operational requirements.",
        },
      ]}
    />
  );
}
