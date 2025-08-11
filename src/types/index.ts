export interface Idea {
  id: string;
  description: string;
  submitterInfo: string;
}

export interface Bubble {
  theme: string;
  ideaIds: string[];
  ideas: Idea[];
}
