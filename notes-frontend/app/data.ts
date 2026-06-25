export type Note = {
  id: string;
  title: string;
  excerpt: string;
  tag: "Work" | "Study" | "Ideas" | "Personal";
  date: string;
  time: string;
  favorite: boolean;
  accent: string; // left border color
};

export const notes: Note[] = [];

export const tagStyles: Record<Note["tag"], string> = {
  Work: "bg-gray-100 text-gray-700",
  Study: "bg-blue-100 text-blue-700",
  Ideas: "bg-amber-100 text-amber-700",
  Personal: "bg-green-100 text-green-700",
};