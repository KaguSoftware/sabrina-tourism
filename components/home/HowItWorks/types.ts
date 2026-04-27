export interface Step {
  num: string;
  heading: string;
  body: string;
  icon: "compass" | "suitcase" | "whatsapp";
}

export interface HowItWorksProps {
  className?: string;
}
