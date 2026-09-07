import { apiClient } from "@/lib/api-client";
import type {
  AnalyzeExceptionsResponse,
  ExceptionAnalysisPayload,
  ExplainPatternResponse,
} from "./types";

export interface SubmitCauseFeedbackPayload extends ExceptionAnalysisPayload {
  causeId: string;
  confirmed: boolean;
}

export interface SubmitCauseFeedbackResponse {
  success: true;
  causeId: string;
  confirmed: boolean;
}

export const analysisApi = {
  analyze: (payload: ExceptionAnalysisPayload) =>
    apiClient.post<AnalyzeExceptionsResponse>("/api/v1/exceptions/analyze/", payload),

  explainPattern: (patternId: string, payload: ExceptionAnalysisPayload) =>
    apiClient.post<ExplainPatternResponse>(
      `/api/v1/exceptions/patterns/${encodeURIComponent(patternId)}/explain/`,
      payload
    ),

  // Lets an accountant/admin confirm or reject one of Phase 3's
  // suggested causes — this is the training data behind the learned
  // scorer (see backend/parser/analytics/explanation/learning/README.md).
  // Without this call, nothing an accountant clicks ever reaches the
  // backend's CauseFeedback table, and the learned scorer never gets
  // anything to learn from.
  submitCauseFeedback: (patternId: string, payload: SubmitCauseFeedbackPayload) =>
    apiClient.post<SubmitCauseFeedbackResponse>(
      `/api/v1/exceptions/patterns/${encodeURIComponent(patternId)}/causes/feedback/`,
      payload
    ),
};
