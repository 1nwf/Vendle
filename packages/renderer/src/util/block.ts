import { nanoid } from "nanoid";
import { BlockType } from "../types";

export function generateBlock(position: number): BlockType {
  return {
    id: nanoid(),
    content: "",
    tag: position == 0 ? "h1" : "p",
    position,
    children: null,
  };
}
