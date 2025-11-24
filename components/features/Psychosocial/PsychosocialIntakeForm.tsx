// components/features/Psychosocial/PsychosocialIntakeForm.tsx
"use client";

import { useSubmitPsychosocialIntake } from "@/application/hooks/useSubmitPsychosocialIntake";
import { Button } from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/InputField/InputField";
import { assessmentForms } from "@/domain/constants/assessmentForms";
import { PsychosocialIntakeFormPayload } from "@/domain/entities/assesments/psychosocialIntake";
import { psychosocialIntakeFormSchema, PsychosocialIntakeFormValues } from "@/domain/validation/psychosocialIntake.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

const NATIONALITY_OPTIONS = [
  { value: "Ethiopian", label: "Ethiopian" },
  { value: "Eritrean", label: "Eritrean" },
  { value: "Somali", label: "Somali" },
  { value: "Other", label: "Other" },
];

const IMMIGRATION_STATUS_OPTIONS = [
  { value: "Refugee", label: "Refugee" },
  { value: "Asylum Seeker", label: "Asylum Seeker" },
  { value: "Resident", label: "Resident" },
  { value: "Citizen", label: "Citizen" },
  { value: "Other", label: "Other" },
];

const LANGUAGE_OPTIONS = [
  { value: "Amharic", label: "Amharic" },
  { value: "Oromo", label: "Oromo" },
  { value: "Tigrinya", label: "Tigrinya" },
  { value: "English", label: "English" },
  { value: "Other", label: "Other" },
];

const SERVICES_OPTIONS = [
  { value: "Individual Counseling", label: "Individual Counseling" },
  { value: "Group Therapy", label: "Group Therapy" },
  { value: "Crisis Intervention", label: "Crisis Intervention" },
  { value: "Case Management", label: "Case Management" },
  { value: "Family Therapy", label: "Family Therapy" },
  { value: "Substance Abuse Treatment", label: "Substance Abuse Treatment" },
  { value: "Trauma Counseling", label: "Trauma Counseling" },
];

export default function PsychosocialIntakeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PsychosocialIntakeFormValues>({
    resolver: zodResolver(psychosocialIntakeFormSchema),
    defaultValues: {
      date_of_assessment: new Date().toISOString().split('T')[0],
      date_of_birth: new Date().toISOString().split('T')[0],
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitPsychosocialIntake({
    onSuccess: () => {
      toast.success("Psychosocial intake assessment submitted successfully!");
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

  const onSubmit: SubmitHandler<PsychosocialIntakeFormValues> = (data) => {
    const payload: PsychosocialIntakeFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS Psychosocial Intake Assessment",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        date_of_assessment: data.date_of_assessment,
        client_first_name: data.client_first_name,
        client_last_name: data.client_last_name,
        preferred_first_name: data.preferred_first_name,
        date_of_birth: data.date_of_birth,
        street_address: data.street_address,
        address_line_2: data.address_line_2,
        city: data.city,
        state_province_region: data.state_province_region,
        zip_postal_code: data.zip_postal_code,
        country: data.country,
        home_phone: data.home_phone,
        cell_phone: data.cell_phone,
        presenting_concerns: data.presenting_concerns,
        collateral_information: data.collateral_information,
        personal_family_history: data.personal_family_history,
        addictions_substance_use: data.addictions_substance_use,
        past_mental_health: data.past_mental_health,
        medical_history_status: data.medical_history_status,
        current_medications: data.current_medications,
        risk_assessment: data.risk_assessment,
        intervention_plan: data.intervention_plan,
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
        <h2 className="text-2xl font-bold uppercase">IOS PSYCHOSOCIAL INTAKE ASSESSMENT</h2>
        <p className="text-lg font-semibold text-gray-700 mt-2">Client Information</p>
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

        {/* Date of Assessment */}
        <InputField
          placeholder={""} label="Date of Assessment (Required)"
          type="date"
          {...register("date_of_assessment")}
          error={errors.date_of_assessment?.message} />

        {/* Client Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Client Name: (Required) - First"
            {...register("client_first_name")}
            placeholder="First name"
            error={errors.client_first_name?.message}
          />
          <InputField
            label="Client Name: (Required) - Last"
            {...register("client_last_name")}
            placeholder="Last name"
            error={errors.client_last_name?.message}
          />
        </div>

        {/* Preferred Name */}
        <InputField
          label="Preferred Name: - First"
          {...register("preferred_first_name")}
          placeholder="Preferred first name"
          error={errors.preferred_first_name?.message}
        />

        {/* Date of Birth */}
        <InputField
          placeholder={""} label="Date of Birth (Required)"
          type="date"
          {...register("date_of_birth")}
          error={errors.date_of_birth?.message} />

        {/* Address */}
        <InputField
          label="Address (Required) - Street Address"
          {...register("street_address")}
          placeholder="Street Address"
          error={errors.street_address?.message}
        />

        <InputField
          label="Address Line 2"
          {...register("address_line_2")}
          placeholder="Apartment, suite, unit, etc."
          error={errors.address_line_2?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="City"
            {...register("city")}
            placeholder="City"
            error={errors.city?.message}
          />
          <InputField
            label="State / Province / Region"
            {...register("state_province_region")}
            placeholder="State/Province/Region"
            error={errors.state_province_region?.message}
          />
          <InputField
            label="ZIP / Postal Code"
            {...register("zip_postal_code")}
            placeholder="ZIP/Postal Code"
            error={errors.zip_postal_code?.message}
          />
          <InputField
            label="Country"
            {...register("country")}
            placeholder="Country"
            error={errors.country?.message}
          />
        </div>

        {/* Home Phone */}
        <InputField
          label="Home Phone: (Required)"
          type="tel"
          {...register("home_phone")}
          placeholder="Enter home phone number"
          error={errors.home_phone?.message}
        />
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* Cell Phone */}
        <InputField
          label="Cell Phone: (Required)"
          type="tel"
          {...register("cell_phone")}
          placeholder="Enter cell phone number"
          error={errors.cell_phone?.message}
        />

        {/* PRESENTING CONCERNS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PRESENTING CONCERNS
          </label>
          <textarea
            {...register("presenting_concerns")}
            placeholder="Enter presenting concerns"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.presenting_concerns && (
            <span className="text-red-500 text-xs mt-1">{errors.presenting_concerns.message}</span>
          )}
        </div>

        {/* COLLATERAL INFORMATION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            COLLATERAL INFORMATION
          </label>
          <textarea
            {...register("collateral_information")}
            placeholder="Enter collateral information"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.collateral_information && (
            <span className="text-red-500 text-xs mt-1">{errors.collateral_information.message}</span>
          )}
        </div>

        {/* PERSONAL / FAMILY HISTORY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PERSONAL / FAMILY HISTORY
          </label>
          <textarea
            {...register("personal_family_history")}
            placeholder="Enter personal and family history"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.personal_family_history && (
            <span className="text-red-500 text-xs mt-1">{errors.personal_family_history.message}</span>
          )}
        </div>
      </div>

      {/* Page 3 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* ADDICTIONS AND SUBSTANCE USE / ABUSE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ADDICTIONS AND SUBSTANCE USE / ABUSE
          </label>
          <textarea
            {...register("addictions_substance_use")}
            placeholder="Enter information about addictions and substance use/abuse"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.addictions_substance_use && (
            <span className="text-red-500 text-xs mt-1">{errors.addictions_substance_use.message}</span>
          )}
        </div>

        {/* PAST MENTAL HEALTH */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAST MENTAL HEALTH
          </label>
          <textarea
            {...register("past_mental_health")}
            placeholder="Enter past mental health history"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.past_mental_health && (
            <span className="text-red-500 text-xs mt-1">{errors.past_mental_health.message}</span>
          )}
        </div>

        {/* MEDICAL HISTORY / STATUS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MEDICAL HISTORY / STATUS
          </label>
          <textarea
            {...register("medical_history_status")}
            placeholder="Enter medical history and current status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.medical_history_status && (
            <span className="text-red-500 text-xs mt-1">{errors.medical_history_status.message}</span>
          )}
        </div>
      </div>

      {/* Page 4 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* CURRENT MEDICATIONS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CURRENT MEDICATIONS
          </label>
          <textarea
            {...register("current_medications")}
            placeholder="Enter current medications"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.current_medications && (
            <span className="text-red-500 text-xs mt-1">{errors.current_medications.message}</span>
          )}
        </div>

        {/* RISK ASSESSMENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RISK ASSESSMENT
          </label>
          <textarea
            {...register("risk_assessment")}
            placeholder="Enter risk assessment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.risk_assessment && (
            <span className="text-red-500 text-xs mt-1">{errors.risk_assessment.message}</span>
          )}
        </div>

        {/* INTERVENTION PLAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            INTERVENTION PLAN
          </label>
          <textarea
            {...register("intervention_plan")}
            placeholder="Enter intervention plan"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.intervention_plan && (
            <span className="text-red-500 text-xs mt-1">{errors.intervention_plan.message}</span>
          )}
        </div>
      </div>

      {/* Page 5 Content */}
      <div className="border-t pt-6 mt-6">
        {/* Error Display */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600 text-center">Error submitting psychosocial intake assessment. Please try again.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center w-full">
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
      </div>
    </form>
  );
}