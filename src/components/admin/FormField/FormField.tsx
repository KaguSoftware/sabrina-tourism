"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

const LABEL_KEYS: Record<string, string> = {
  "Name": "name",
  "Region": "region",
  "Location": "location",
  "Tag 1": "tag1",
  "Tag 2": "tag2",
  "Style / Illustration": "styleIllustration",
  "Check-in time": "checkInTime",
  "Check-out time": "checkOutTime",
  "Languages spoken": "languagesSpoken",
  "Short description": "shortDescription",
  "Long description": "longDescription",
  "Bedrooms": "bedrooms",
  "Bathrooms": "bathrooms",
  "Distance to centre (km)": "distanceToCentre",
  "Room name": "roomName",
  "Max guests": "maxGuests",
  "Bed configuration": "bedConfiguration",
  "Room size": "roomSize",
  "Gallery image position": "galleryImagePosition",
  "Highlights": "highlights",
  "Label": "label",
  "Or paste URL directly": "pasteUrlDirectly",
  "Kicker": "kicker",
  "Heading": "heading",
  "Headline top": "headlineTop",
  "Headline em (italic ochre)": "headlineEm",
  "Sub": "sub",
  "Hero background image": "heroBackgroundImage",
  "Body": "body",
  "Section heading": "sectionHeading",
  "Num": "num",
  "Icon": "icon",
  "Quote": "quote",
  "Attribution": "attribution",
  "Heading top": "headingTop",
  "Heading emphasis": "headingEmphasis",
  "Sub / lede": "subLede",
  "Fleet section heading": "fleetSectionHeading",
  "Hero image": "heroImage",
  "Package name": "packageName",
  "Destinations": "destinations",
  "Price (starting from)": "priceStartingFrom",
  "Currency": "currency",
  "Vehicle model": "vehicleModel",
  "Features": "features",
  "Duration": "duration",
  "Min people": "minPeople",
  "Max people": "maxPeople",
  "Available from": "availableFrom",
  "Available to": "availableTo",
  "Tier name": "tierName",
  "Vehicle class": "vehicleClass",
  "Accommodation": "accommodation",
  "Group size": "groupSize",
  "Meals included": "mealsIncluded",
  "Guide languages": "guideLanguages",
  "Accommodation name": "accommodationName",
  "Accommodation description": "accommodationDescription",
  "Tour name": "tourName",
  "Tour date": "tourDate",
  "Start time": "startTime",
  "End time": "endTime",
  "Vehicle": "vehicle",
  "Driver / Guide": "driverGuide",
  "Price": "price",
  "Time": "time",
  "Place": "place",
  "Description": "description",
  "Duration label": "durationLabel",
  "Duration (days)": "durationDays",
  "Title": "title",
  "Day #": "dayNumber",
  "Card image": "cardImage",
};

const HINT_KEYS: Record<string, string> = {
  "~200 chars — used on cards": "cards200",
  "Full text shown on the detail page": "detailFullText",
  "Small label above the heading": "smallLabelAboveHeading",
  "16:9 recommended": "heroImage16x9",
  "16:9 — used as the tours listing page banner": "toursHeroBanner",
  "Date range shown on public page": "dateRangePublic",
  "Short paragraph shown on the booking page": "bookingParagraph",
  "Bullet points shown on tier card": "tierCardBullets",
  "Used on the detail page top": "detailHeroImage",
  "Optional — used on listing cards. Falls back to hero.": "listingCardImage",
};

export function FormField({ label, hint, error, children, required }: FormFieldProps) {
  const labelT = useTranslations("admin.formLabels");
  const hintT = useTranslations("admin.formHints");
  const translatedLabel = LABEL_KEYS[label] ? labelT(LABEL_KEYS[label]) : label;
  const translatedHint = hint && HINT_KEYS[hint] ? hintT(HINT_KEYS[hint]) : hint;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink-soft font-medium mb-1">
        {translatedLabel}
        {required && <span className="text-ochre ml-1">*</span>}
      </label>
      {children}
      {translatedHint && !error && (
        <p className="font-sans text-[12px] text-muted">{translatedHint}</p>
      )}
      {error && (
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}
