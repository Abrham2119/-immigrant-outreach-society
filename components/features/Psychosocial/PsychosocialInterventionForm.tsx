// components/features/Psychosocial/PsychosocialInterventionForm.tsx
"use client";

import { useSubmitPsychosocialForm } from "@/application/hooks/useSubmitPsychosocialForm";
import { Button } from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/InputField/InputField";
import { PsychosocialInterventionFormPayload } from "@/domain/entities/assesments/psychosocialIntervention";
import {
  psychosocialFormSchema,
  PsychosocialFormValues,
} from "@/domain/validation/psychosocialForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const MODALITIES_OPTIONS = [
  { value: "Home Visit", label: "Home Visit" },
  { value: "Outreach Support", label: "Outreach Support" },
  { value: "Community Engagement", label: "Community Engagement" },
  { value: "Individual Psychosocial Support", label: "Individual Psychosocial Support" },
  { value: "Group Support", label: "Group Support" },
  { value: "Referral Community Service", label: "Referral Community Service" },
];

const SERVICE_OPTIONS = [
  { value: "PCO", label: "Proactive Community Outreach" },
  { value: "Wellness", label: "Wellness Intervention" },
  { value: "IOCR", label: "Immigration Crisis Response" },
  { value: "Settlement", label: "Settlement & Integration" },
  { value: "Psychosocial", label: "Psychosocial Wellbeing" },
  { value: "Youth", label: "Youth Program" },
  { value: "SALP", label: "Senior Active Living Program (SALP)" },
  { value: "GBV", label: "Gender-Based Violence (GBV) Program" },
  { value: "Training", label: "Training and Workshops" },
  { value: "Policy", label: "Policy Influencing and Advocacy for Antiracism Initiatives" }
];

export default function PsychosocialInterventionForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PsychosocialFormValues>({
    resolver: zodResolver(psychosocialFormSchema),
    defaultValues: {
      modalities: [],
      acknowledgement: false,
    },
  });

  const { data: session } = useSession();
   const router = useRouter();
  

  const { mutate, isPending, isSuccess, error, isError } = useSubmitPsychosocialForm({
    onSuccess: () => {
      toast.success("Psychosocial intervention form submitted successfully!");
      setTimeout(() => {
        reset();
      }, 3000);
          router.push('/dashboard/personnel/Wellness/assessment-history');
      
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });
  const params = useParams();
  const clientId = params.clientId as string;

  const onSubmit: SubmitHandler<PsychosocialFormValues> = (data) => {
    const payload: PsychosocialInterventionFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      formData: {
        data_entry_personnel_full_name: data.dataEntryPersonnelFullName,
        client_name: data.clientName,
        modalities: data.modalities,
        other_agencies_programs_involved: data.otherAgencies,
        client_wants_for_housing: data.clientHousingWants,
        acknowledgement: data.acknowledgement,
        ios_staff_full_name: data.iosStaffFullName,
        signature: data.signature,
        date_completed: data.dateCompleted || new Date().toISOString().split('T')[0],
      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-6 bg-white gap-4 w-full md:max-w-[820px]  mx-start"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Psychosocial Intervention Plan</h2>

      {/* Data Entry Personnel & Client Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Data Entry Personnel Full Name *"
          {...register("dataEntryPersonnelFullName")}
          placeholder="Enter full name"
          error={errors.dataEntryPersonnelFullName?.message}
        />
        <InputField
          label="Client Name *"
          {...register("clientName")}
          placeholder="Enter client name"
          error={errors.clientName?.message}
        />
      </div>

      {/* Modalities/Interventions */}
      <Controller
        name="modalities"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Modalities/Interventions"
            options={MODALITIES_OPTIONS}
            selected={field.value || []}
            onChange={field.onChange}
            error={errors.modalities?.message}
            multiple={true}
            placeholder="Select modalities"
          />
        )}
      />

      {/* Other Agencies/Programs */}
      <InputField
        label="Other Agencies/Programs Involved"
        {...register("otherAgencies")}
        placeholder="List other agencies/programs (if any)"
        error={errors.otherAgencies?.message}
      />

      {/* Client Housing Wants */}
      <div className="w-full">
        <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2">
          Client Wants for Housing
        </label>
        <textarea
          {...register("clientHousingWants")}
          placeholder="Client wants for housing..."
          className="w-full border-[1px] border-[#DADADA] rounded-[8px] px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
        />
        {errors.clientHousingWants && (
          <span className="text-red-500 text-xs mt-1">{errors.clientHousingWants.message}</span>
        )}
      </div>

      {/* IOS Staff & Signature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="IOS Staff Full Name"
          {...register("iosStaffFullName")}
          placeholder="Enter IOS staff name"
          error={errors.iosStaffFullName?.message}
        />
        <InputField
          label="Signature"
          {...register("signature")}
          placeholder="Enter signature"
          error={errors.signature?.message}
        />
      </div>

      {/* Date Completed */}
      <InputField
        placeholder={""} label="Date Completed"
        type="date"
        {...register("dateCompleted")}
        error={errors.dateCompleted?.message} />

      {/* Acknowledgement */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="acknowledgement"
          {...register("acknowledgement")}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="acknowledgement" className="text-sm text-gray-700">
          I acknowledge the information provided
        </label>
      </div>
      {errors.acknowledgement && (
        <span className="text-red-500 text-xs mt-1">{errors.acknowledgement.message}</span>
      )}

      {/* Error Display */}
      {isError && <p className="text-red-500 text-center">Error submitting form. Please try again.</p>}

      {/* Submit Button */}
      <div className="flex justify-center w-full mt-4">
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className={`w-full ${isSubmitting || isPending ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {isSubmitting || isPending ? "Submitting..." : "Submit Form"}
        </Button>
      </div>
    </form>
  );
}