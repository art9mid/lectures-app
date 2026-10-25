// A question is plain data, so wrong answers can be stored in Supabase and replayed later.
export type Question =
  | {
      kind: 'choice';
      prompt: string;
      options: string[];
      answer: string; // must be one of options
      explain?: string; // short hint in Russian, shown after answering
      topic?: string;
    }
  | {
      kind: 'input';
      prompt: string;
      answer: string | string[]; // several accepted spellings allowed
      explain?: string;
      topic?: string;
    };

export type Topic = {
  id: string;
  title: string;
  href: string; // lesson page with theory
  questions: () => Question[]; // called each time, so generators give fresh items
};
