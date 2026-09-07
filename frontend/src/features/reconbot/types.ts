export interface BotContextPayload {
  lastPatternId: string | null;
  lastExceptionType: string | null;
}

export interface BotApiResponse {
  success: true;
  answer: string;
  intent: string;
  referencedPatternIds: string[];
  referencedExceptionIds: string[];
  suggestedFollowUps: string[];
  context: BotContextPayload;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  suggestedFollowUps?: string[];
  referencedExceptionIds?: string[];
  isError?: boolean;
}
