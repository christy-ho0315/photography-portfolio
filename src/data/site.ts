export type Collection = {
  slug: string;
  title: string;
  description: string;
};

// Replace these working categories once the photography specialties are confirmed.
export const collections: Collection[] = [
  { slug: "portraits", title: "Portraits", description: "Individual, editorial, and creative portrait sessions." },
  { slug: "events", title: "Events", description: "Honest moments and atmosphere from meaningful gatherings." },
  { slug: "stories", title: "Stories", description: "Personal projects, travel, and visual narratives." },
];
