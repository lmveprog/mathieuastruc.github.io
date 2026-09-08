export type Todo = { id: string; text: string; done: boolean; created: string };
export type TodosDoc = { items: Todo[] };

export type Habit = { id: string; name: string };
export type HabitsDoc = { habits: Habit[]; log: Record<string, string[]> };

// une note par jour, cle = yyyy-mm-dd
export type NotesDoc = Record<string, string>;

export type Countdown = { id: string; label: string; date: string };
export type QuickLink = { label: string; href: string };
export type ConfigDoc = {
  countdowns: Countdown[];
  links: QuickLink[];
  contentLinks: QuickLink[];
  weather?: { city: string; lat: number; lon: number };
};

// la face "matheus" : idees de contenu a publier
export type ContentDoc = { ideas: Todo[] };

export type Docs = { todos: TodosDoc; habits: HabitsDoc; notes: NotesDoc; config: ConfigDoc; content: ContentDoc };

export const EMPTY_DOCS: Docs = {
  todos: { items: [] },
  habits: { habits: [], log: {} },
  notes: {},
  config: { countdowns: [], links: [], contentLinks: [] },
  content: { ideas: [] },
};
