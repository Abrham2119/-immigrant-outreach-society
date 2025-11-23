// components/features/Medical/DischargeSummaryForm.tsx
"use client";

import { useSubmitDischargeSummaryForm } from "@/application/hooks/useSubmitDischargeSummaryForm";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { DischargeSummaryFormPayload } from "@/domain/entities/assesments/dischargeSummary";
import {
  dischargeSummaryFormSchema,
  DischargeSummaryFormValues,
} from "@/domain/validation/dischargeSummaryForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const REASON_FOR_DISCHARGE_OPTIONS = [
  { value: "treatment_completed", label: "Treatment Completed" },
  { value: "patient_request", label: "Patient Request" },
  { value: "transferred", label: "Transferred to Another Facility" },
  { value: "insurance", label: "Insurance Limitations" },
  { value: "medical_improvement", label: "Medical Improvement" },
  { value: "other", label: "Other" },
];

const RISK_ASSESSMENT_OPTIONS = [
  { value: "low", label: "Low Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "high", label: "High Risk" },
];

export default function DischargeSummaryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DischargeSummaryFormValues>({
    resolver: zodResolver(dischargeSummaryFormSchema),
    defaultValues: {
      date_of_discharge: new Date().toISOString().split('T')[0],
      date_completed: new Date().toISOString().split('T')[0],
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitDischargeSummaryForm({
    onSuccess: () => {
      toast.success("Discharge summary submitted successfully!");
      setTimeout(() => {
        reset();
      }, 3000);
    },
    onError: (error: any) => {
      console.log("error", error);
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });

  const params = useParams();
  const clientId = params.clientId as string;

  const onSubmit: SubmitHandler<DischargeSummaryFormValues> = (data) => {
    const payload: DischargeSummaryFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS Discharge Summary",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        client_first_name: data.client_first_name,
        client_last_name: data.client_last_name,
        ios_staff_first_name: data.ios_staff_first_name,
        ios_staff_last_name: data.ios_staff_last_name,
        date_of_discharge: data.date_of_discharge,
        goals_and_concerns: data.goals_and_concerns,
        summary_of_care_provided: data.summary_of_care_provided,
        updated_risk_assessment: data.updated_risk_assessment,
        reason_for_discharge: data.reason_for_discharge,
        recommendations_for_follow_up: data.recommendations_for_follow_up,
        acknowledgement_name: data.acknowledgement_name,
        acknowledgement_signature: data.acknowledgement_signature,
        date_completed: data.date_completed,
      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-6 bg-white gap-6 w-full md:max-w-[820px] mx-auto border border-gray-200 rounded-lg"
    >
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold uppercase">IOS DISCHARGE SUMMARY</h2>
        <p className="text-lg font-semibold text-gray-700 mt-2">IOS Discharge Plan</p>
      </div>

      {/* Page 1 Content */}
      <div className="space-y-6">
        {/* Data Entry Personnel */}
        <InputField
          label="Data Entry Personnel Name (Required)"
          {...register("data_entry_personnel_name")}
          placeholder="Enter full name"
          error={errors.data_entry_personnel_name?.message}
        />

        {/* Client Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Client Name (Required) - First"
            {...register("client_first_name")}
            placeholder="First name"
            error={errors.client_first_name?.message}
          />
          <InputField
            label="Client Name (Required) - Last"
            {...register("client_last_name")}
            placeholder="Last name"
            error={errors.client_last_name?.message}
          />
        </div>

        {/* IOS Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="IOS Staff (Required) - First"
            {...register("ios_staff_first_name")}
            placeholder="First name"
            error={errors.ios_staff_first_name?.message}
          />
          <InputField
            label="IOS Staff (Required) - Last"
            {...register("ios_staff_last_name")}
            placeholder="Last name"
            error={errors.ios_staff_last_name?.message}
          />
        </div>

        {/* Date of Discharge */}
        <InputField
          placeholder={""} label="Date of Discharge (Required)"
          type="date"
          {...register("date_of_discharge")}
          error={errors.date_of_discharge?.message}        />

        {/* Goals and Concerns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goals and Concerns: (Required)
          </label>
          <textarea
            {...register("goals_and_concerns")}
            placeholder="Enter client goals and concerns"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.goals_and_concerns && (
            <span className="text-red-500 text-xs mt-1">{errors.goals_and_concerns.message}</span>
          )}
        </div>

        {/* Summary of Care Provided */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary of Care Provided: (Required)
          </label>
          <textarea
            {...register("summary_of_care_provided")}
            placeholder="Enter summary of care provided"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.summary_of_care_provided && (
            <span className="text-red-500 text-xs mt-1">{errors.summary_of_care_provided.message}</span>
          )}
        </div>
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* Updated Risk Assessment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Updated Risk Assessment:
          </label>
          <select
            {...register("updated_risk_assessment")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose One</option>
            {RISK_ASSESSMENT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.updated_risk_assessment && (
            <span className="text-red-500 text-xs mt-1">{errors.updated_risk_assessment.message}</span>
          )}
        </div>

        {/* Reason for Discharge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Discharge:
          </label>
          <select
            {...register("reason_for_discharge")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose One</option>
            {REASON_FOR_DISCHARGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.reason_for_discharge && (
            <span className="text-red-500 text-xs mt-1">{errors.reason_for_discharge.message}</span>
          )}
        </div>

        {/* Recommendations for Follow-Up */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendations for Follow-Up:
          </label>
          <textarea
            {...register("recommendations_for_follow_up")}
            placeholder="Enter follow-up recommendations"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.recommendations_for_follow_up && (
            <span className="text-red-500 text-xs mt-1">{errors.recommendations_for_follow_up.message}</span>
          )}
        </div>

        {/* Acknowledgement Section */}
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Acknowledgement</h3>
          
          <InputField
            label="IOS Staff Name: (Required)"
            {...register("acknowledgement_name")}
            placeholder="Enter full name"
            error={errors.acknowledgement_name?.message}
          />

          <InputField
            label="Signature"
            {...register("acknowledgement_signature")}
            placeholder="Enter signature"
            error={errors.acknowledgement_signature?.message}
          />
        </div>
      </div>

      {/* Page 3 Content */}
      <div className="border-t pt-6 mt-6">
        <InputField
          placeholder={""} label="Date Completed: (Required)"
          type="date"
          {...register("date_completed")}
          error={errors.date_completed?.message}        />
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600 text-center">Error submitting discharge summary. Please try again.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center w-full mt-8 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          className="flex-1 max-w-[200px]"
          onClick={() => reset()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className="flex-1 max-w-[200px]"
        >
          {isSubmitting || isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}