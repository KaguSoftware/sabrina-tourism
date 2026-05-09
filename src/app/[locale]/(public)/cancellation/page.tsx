import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Cancellation Policy — Sabrina Turizm",
  description: "General cancellation information for Sabrina Turizm bookings.",
};

export default function CancellationPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cancellation Policy"
      intro="Cancellation terms can vary by hotel, vehicle, guide, route, season, and supplier. The applicable terms are confirmed with each booking."
      sections={[
        {
          heading: "Before confirmation",
          body: "You can change or stop an enquiry before the booking is confirmed. No service is held until confirmation details are agreed in writing.",
        },
        {
          heading: "After confirmation",
          body: "Once a booking is confirmed, cancellation fees may apply depending on supplier rules, timing, prepaid services, and non-refundable reservations.",
        },
        {
          heading: "How to cancel",
          body: "Contact Sabrina Turizm directly by WhatsApp or email with your booking details. We will confirm the applicable cancellation terms for your reservation.",
        },
      ]}
    />
  );
}
