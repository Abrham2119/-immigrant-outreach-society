// domain/use-cases/submitDischargeSummaryForm.ts

import { dischargeSummaryService } from "@/infrastructure/api/dischargeSummaryService";
import { DischargeSummaryForm } from "../entities/assesments/dischargeSummary";


export async function submitDischargeSummaryFormUseCase(form: DischargeSummaryForm): Promise<{ message: string }> {
  return dischargeSummaryService(form);
}