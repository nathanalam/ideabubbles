import { Timestamp } from "firebase/firestore";

export interface Idea {
  id: string;
  description: string;
  submitterInfo: string;
  createdAt: Timestamp;
}

export interface Bubble {
  theme: string;
  ideaIds: string[];
  ideas: Idea[];
}
