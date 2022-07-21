export type tags = "h1" | "h2" | "h3" | "p" | "li" | "strong";

export interface BlockType {
  id: string;
  content: string;
  tag: tags;
  position: number;
  children: null | BlockType[];
}

export interface Command {
  tag: tags;
  name: string;
}

export interface FilesList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  index: number;
}
