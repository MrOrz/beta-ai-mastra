// Session in sidebar
export type Session = {
  id: string;
  title: string;
  subtitle: string;
  active?: boolean;
};

// Chat message
export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
};

export type ToolCall = {
  name: string;
  icon: string; // Material Symbols icon name
};

// Source item for SourceLinkage
export type SourceItem = {
  id: string;
  domain: string;
  faviconUrl?: string;
  title: string;
  snippet: string;
  thumbnailUrl?: string;
  thumbnailIcon?: string; // fallback icon if no thumbnail image
  url: string;
  adopted?: boolean;
};

// Response categories
export type ResponseCategory =
  | "NOT_ARTICLE"
  | "RUMOR"
  | "REAL"
  | "OPINIONATED";

// Response draft in editor
export type ResponseDraft = {
  version: number;
  category: ResponseCategory;
  content: string;
  references: string;
};

// State of the agent, make sure this aligns with your agent's state.
export type AgentState = {
  proverbs: string[];
};
