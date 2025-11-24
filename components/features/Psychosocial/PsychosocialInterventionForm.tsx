// components/features/Psychosocial/PsychosocialInterventionForm.tsx
"use client";

import { useSubmitPsychosocialInterventionForm } from "@/application/hooks/useSubmitPsychosocialForm";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { PsychosocialInterventionFormPayload } from "@/domain/entities/assesments/psychosocialIntervention";
import {
  psychosocialInterventionFormSchema,
  PsychosocialInterventionFormValues,
} from "@/domain/validation/psychosocialInterventionForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const MODALITY_OPTIONS = [
  { value: "home_visit", label: "Home Visit" },
  { value: "outreach_support", label: "Outreach Support" },
  { value: "community_engagement", label: "Community Engagement" },
  { value: "individual_psychosocial_support", label: "Individual Psychosocial support" },
  { value: "group_support", label: "Group Support" },
  { value: "referral_community_services", label: "Referral community services" },
];

export default function PsychosocialInterventionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PsychosocialInterventionFormValues>({
    resolver: zodResolver(psychosocialInterventionFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      date_completed: new Date().toISOString().split('T')[0],
      modalities: [],
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitPsychosocialInterventionForm({
    onSuccess: () => {
      toast.success("Psychosocial intervention plan submitted successfully!");
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

  const onSubmit: SubmitHandler<PsychosocialInterventionFormValues> = (data) => {
    const payload: PsychosocialInterventionFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS Psychosocial Intervention Plan",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        client_first_name: data.client_first_name,
        client_last_name: data.client_last_name,
        ios_staff_first_name: data.ios_staff_first_name,
        ios_staff_last_name: data.ios_staff_last_name,
        date: data.date,
        goals: data.goals,
        modalities: data.modalities,
        other_agencies_programs: data.other_agencies_programs,
        acknowledgement_name: data.acknowledgement_name,
        signature: data.signature,
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
        <h2 className="text-2xl font-bold uppercase">IOS PSYCHOSOCIAL INTERVENTION PLAN</h2>
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

        {/* Date */}
        <InputField
          placeholder={""} label="Date (Required)"
          type="date"
          {...register("date")}
          error={errors.date?.message} />

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goals (Required)
          </label>
          <textarea
            {...register("goals")}
            placeholder="If there is no information needed, please enter none."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.goals && (
            <span className="text-red-500 text-xs mt-1">{errors.goals.message}</span>
          )}
        </div>

        {/* Modalities/Interventions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalities/Interventions
          </label>
          <div className="space-y-2">
            {MODALITY_OPTIONS.map((modality) => (
              <div key={modality.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={modality.value}
                  value={modality.value}
                  {...register("modalities")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={modality.value} className="ml-2 text-sm text-gray-700">
                  {modality.label}
                </label>
              </div>
            ))}
          </div>
          {errors.modalities && (
            <span className="text-red-500 text-xs mt-1">{errors.modalities.message}</span>
          )}
        </div>
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* Other Agencies/Programs Involved */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Agencies/Programs Involved (list):
          </label>
          <textarea
            {...register("other_agencies_programs")}
            placeholder="List other agencies or programs involved"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.other_agencies_programs && (
            <span className="text-red-500 text-xs mt-1">{errors.other_agencies_programs.message}</span>
          )}
        </div>

        {/* Acknowledgement Section */}
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Acknowledgement</h3>

          <InputField
            label="IOS Staff (Required)"
            {...register("acknowledgement_name")}
            placeholder="Enter full name"
            error={errors.acknowledgement_name?.message}
          />

          <InputField
            label="Signature (Required)"
            {...register("signature")}
            placeholder="Enter signature"
            error={errors.signature?.message}
          />

          <InputField
            placeholder={""} label="Date Completed (Required)"
            type="date"
            {...register("date_completed")}
            error={errors.date_completed?.message} />
        </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600 text-center">Error submitting psychosocial intervention plan. Please try again.</p>
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