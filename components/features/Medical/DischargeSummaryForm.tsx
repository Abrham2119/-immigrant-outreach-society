// components/features/Medical/DischargeSummaryForm.tsx
"use client";

import { useSubmitDischargeSummaryForm } from "@/application/hooks/useSubmitDischargeSummaryForm";
import { Button } from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/InputField/InputField";
import { DischargeSummaryFormPayload } from "@/domain/entities/assesments/dischargeSummary";
import {
  dischargeSummaryFormSchema,
  DischargeSummaryFormValues,
} from "@/domain/validation/dischargeSummaryForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const FUTURE_CONSIDERATION_OPTIONS = [
  { value: "fully_considered", label: "Fully Considered" },
  { value: "partially_considered", label: "Partially Considered" },
  { value: "not_considered", label: "Did Not Consider" },
];

const DETAIL_CHECK_OPTIONS = [
  { value: "completed", label: "Details Checked and Completed" },
  { value: "pending", label: "Details Pending Review" },
  { value: "not_checked", label: "Details Not Checked" },
];

const FEATURE_OPTIONS = [
  { value: "medication_management", label: "Medication Management" },
  { value: "follow_up_care", label: "Follow-up Care" },
  { value: "home_care_instructions", label: "Home Care Instructions" },
  { value: "rehabilitation", label: "Rehabilitation Plan" },
  { value: "dietary_restrictions", label: "Dietary Restrictions" },
  { value: "activity_limitations", label: "Activity Limitations" },
];

const ATTRIBUTE_OPTIONS = [
  { value: "critical", label: "Critical Condition" },
  { value: "stable", label: "Stable Condition" },
  { value: "improving", label: "Improving Condition" },
  { value: "chronic", label: "Chronic Management" },
  { value: "acute", label: "Acute Episode" },
];

const DOCUMENTATION_OPTIONS = [
  { value: "complete", label: "Complete Documentation" },
  { value: "partial", label: "Partial Documentation" },
  { value: "minimal", label: "Minimal Documentation" },
];

const ACKNOWLEDGEMENT_OPTIONS = [
  { value: "acknowledged", label: "Fully Acknowledged" },
  { value: "partial", label: "Partially Acknowledged" },
  { value: "not_acknowledged", label: "Not Acknowledged" },
];

const OUTPUT_OPTIONS = [
  { value: "successful", label: "Successful Discharge" },
  { value: "conditional", label: "Conditional Discharge" },
  { value: "follow_up_required", label: "Follow-up Required" },
  { value: "readmission_risk", label: "Readmission Risk" },
];

export default function DischargeSummaryForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DischargeSummaryFormValues>({
    resolver: zodResolver(dischargeSummaryFormSchema),
    defaultValues: {
      future_consideration: "",
      detail_check: "",
      features: [],
      key_features: [],
      other_attributes: [],
      additional_information: "",
      documentation_status: "",
      acknowledgement_status: "",
      output_status: "",
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
    onError: (error:any) => {
      console.log("error", error);
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });

const onSubmit: SubmitHandler<DischargeSummaryFormValues> = (data) => {
  const payload: DischargeSummaryFormPayload = {
    patient: "68d6cf4803c61caa9ab44210",
    doctor: session?.user?.id ?? "",
    department: session?.user?.role ?? "",
    formData: {
      future_consideration: data.future_consideration,
      detail_check: data.detail_check,
      features: data.features || [],  
      key_features: data.key_features || [],  
      other_attributes: data.other_attributes || [],  
      additional_information: data.additional_information,
      documentation_status: data.documentation_status,
      acknowledgement_status: data.acknowledgement_status,
      output_status: data.output_status,
      doctor_signature: data.doctor_signature,
      patient_consent: data.patient_consent,
      discharge_date: data.discharge_date || new Date().toISOString().split('T')[0],
      final_acknowledgement: data.final_acknowledgement || false,
    },
  };

  mutate(payload);
};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-6 bg-white gap-6 w-full md:max-w-[900px] mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">DISCHARGE SUMMARY</h2>
      <p className="text-lg font-semibold text-gray-700 text-center mb-6">Medical Discharge Documentation</p>

      {/* Future Consideration */}
      <Controller
        name="future_consideration"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="1. Future Consideration Status *"
            options={FUTURE_CONSIDERATION_OPTIONS}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(value[0] || "")}
            error={errors.future_consideration?.message}
            multiple={false}
            placeholder="Select future consideration status"
          />
        )}
      />

      {/* Detail Check */}
      <Controller
        name="detail_check"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="2. Detail Check Status *"
            options={DETAIL_CHECK_OPTIONS}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(value[0] || "")}
            error={errors.detail_check?.message}
            multiple={false}
            placeholder="Select detail check status"
          />
        )}
      />

      {/* Features */}
      <Controller
        name="features"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="3. Fill up the Features *"
            options={FEATURE_OPTIONS}
            selected={field.value || []}
            onChange={field.onChange}
            error={errors.features?.message}
            multiple={true}
            placeholder="Select features implemented"
          />
        )}
      />

      {/* Key Features */}
      <Controller
        name="key_features"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="4. Set Your Key Features *"
            options={FEATURE_OPTIONS}
            selected={field.value || []}
            onChange={field.onChange}
            error={errors.key_features?.message}
            multiple={true}
            placeholder="Select key features"
          />
        )}
      />

      {/* Other Attributes */}
      <Controller
        name="other_attributes"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="5. Select Any Other Attributes"
            options={ATTRIBUTE_OPTIONS}
            selected={field.value || []} 
            onChange={field.onChange}
            error={errors.other_attributes?.message}
            multiple={true}
            placeholder="Select additional attributes"
          />
        )}
      />

      {/* Additional Information */}
      <div className="w-full">
        <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2">
          Add the First Information
        </label>
        <textarea
          {...register("additional_information")}
          placeholder="Enter additional patient information, observations, or special instructions..."
          className="w-full border-[1px] border-[#DADADA] rounded-[8px] px-3 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
        />
        {errors.additional_information && (
          <span className="text-red-500 text-xs mt-1">{errors.additional_information.message}</span>
        )}
      </div>

      {/* Documentation Status */}
      <Controller
        name="documentation_status"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Documentation from the Key"
            options={DOCUMENTATION_OPTIONS}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(value[0] || "")}
            error={errors.documentation_status?.message}
            multiple={false}
            placeholder="Select documentation status"
          />
        )}
      />

      {/* Acknowledgement Status */}
      <Controller
        name="acknowledgement_status"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="6. Acknowledgement Status *"
            options={ACKNOWLEDGEMENT_OPTIONS}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(value[0] || "")}
            error={errors.acknowledgement_status?.message}
            multiple={false}
            placeholder="Select acknowledgement status"
          />
        )}
      />

      {/* Output Status */}
      <Controller
        name="output_status"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="7. Find the Output Status *"
            options={OUTPUT_OPTIONS}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(value[0] || "")}
            error={errors.output_status?.message}
            multiple={false}
            placeholder="Select discharge output status"
          />
        )}
      />

      {/* Doctor Signature & Patient Consent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Doctor Signature *"
          {...register("doctor_signature")}
          placeholder="Enter doctor's signature"
          error={errors.doctor_signature?.message}
        />
        <InputField
          label="Patient Consent *"
          {...register("patient_consent")}
          placeholder="Enter patient consent status"
          error={errors.patient_consent?.message}
        />
      </div>

      {/* Discharge Date */}
      <InputField
        label="Discharge Date *"
        type="date"
        {...register("discharge_date")}
        error={errors.discharge_date?.message}
        placeholder=""
      />

      {/* Final Acknowledgement Checkbox */}
      <div className="flex items-center gap-2 mt-4 p-4 border rounded-lg bg-gray-50">
        <input
          type="checkbox"
          id="final_acknowledgement"
          {...register("final_acknowledgement")}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="final_acknowledgement" className="text-sm text-gray-700 font-medium">
          I acknowledge that all discharge procedures have been completed and documented according to medical standards
        </label>
      </div>
      {errors.final_acknowledgement && (
        <span className="text-red-500 text-xs mt-1">{errors.final_acknowledgement.message}</span>
      )}

      {/* Error Display */}
      {isError && <p className="text-red-500 text-center">Error submitting discharge summary. Please try again.</p>}

      {/* Submit Button */}
      <div className="flex justify-center w-full mt-6">
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className={`w-full md:w-1/2 ${isSubmitting || isPending ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {isSubmitting || isPending ? "Submitting Discharge Summary..." : "Submit Discharge Summary"}
        </Button>
      </div>
    </form>
  );
}