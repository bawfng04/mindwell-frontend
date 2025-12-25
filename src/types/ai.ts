export type AiSection = {
  key: string;
  title: string;
  content: string;
  bullets?: string[];
  actions?: Array<{ label: string; url?: string }>;
};

export type AiStructuredResponse = {
  answerId: string;
  locale: "vi" | "en";
  summary: string;
  sections: AiSection[];
  followUps: string[];
  safetyNotes?: string[];
};
