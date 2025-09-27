// components/features/Psychosocial/PsychosocialIntakeForm.tsx
"use client";

import { useSubmitPsychosocialIntake } from "@/application/hooks/useSubmitPsychosocialIntake";
import { Button } from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/InputField/InputField";
import { PsychosocialIntakeFormPayload } from "@/domain/entities/psychosocialIntake";
import {
  psychosocialIntakeSchema,
  PsychosocialIntakeValues,
} from "@/domain/validation/psychosocialIntake.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
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
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PsychosocialIntakeValues>({
    resolver: zodResolver(psychosocialIntakeSchema),
    defaultValues: {
      servicesRequested: [],
      consentToTreatment: false,
      confidentialityAcknowledgment: false,
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
    onError: (error) => {
      console.log("error", error);
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });

  const onSubmit: SubmitHandler<PsychosocialIntakeValues> = (data) => {
    const payload: PsychosocialIntakeFormPayload = {
      client: "68d6cf4803c61caa9ab44210",
      personnel: session?.user?.id ?? "",
      service:  session?.user?.role ?? "",
      formData: {
        client_name: data.clientName,
        date_of_assessment: data.dateOfAssessment,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        marital_status: data.maritalStatus,
        nationality: data.nationality,
        immigration_status: data.immigrationStatus,
        language: data.language,
        address: data.address,
        phone_number: data.phoneNumber,
        email: data.email,
        emergency_contact: data.emergencyContact,
        presenting_problem: data.presentingProblem,
        medical_history: data.medicalHistory,
        mental_health_history: data.mentalHealthHistory,
        substance_use_history: data.substanceUseHistory,
        family_history: data.familyHistory,
        social_support: data.socialSupport,
        current_medications: data.currentMedications,
        strengths_resources: data.strengthsResources,
        risk_assessment: data.riskAssessment,
        referred_by: data.referredBy,
        services_requested: data.servicesRequested,
        consent_to_treatment: data.consentToTreatment,
        confidentiality_acknowledgment: data.confidentialityAcknowledgment,
        assessor_name: data.assessorName,
        assessor_signature: data.assessorSignature,
      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-6 bg-white gap-6 w-full md:max-w-[900px] mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-2">PSYCHOSOCIAL INTAKE ASSESSMENT</h2>

      {/* Client Information Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Client Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Client Name *"
            {...register("clientName")}
            placeholder="Enter client name"
            error={errors.clientName?.message}
          />
          <InputField
                      placeholder={""} label="Date of Assessment *"
                      type="date"
                      {...register("dateOfAssessment")}
                      error={errors.dateOfAssessment?.message}          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
                      placeholder={""} label="Date of Birth"
                      type="date"
                      {...register("dateOfBirth")}          />
          
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Gender"
                options={GENDER_OPTIONS}
                selected={field.value || ""}
                onChange={field.onChange}
                placeholder="Select gender"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Marital Status"
                options={MARITAL_STATUS_OPTIONS}
                selected={field.value || ""}
                onChange={field.onChange}
                placeholder="Select marital status"
              />
            )}
          />
          
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Nationality"
                options={NATIONALITY_OPTIONS}
                selected={field.value || ""}
                onChange={field.onChange}
                placeholder="Select nationality"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Controller
            name="immigrationStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Immigration Status"
                options={IMMIGRATION_STATUS_OPTIONS}
                selected={field.value || ""}
                onChange={field.onChange}
                placeholder="Select immigration status"
              />
            )}
          />
          
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Primary Language"
                options={LANGUAGE_OPTIONS}
                selected={field.value || ""}
                onChange={field.onChange}
                placeholder="Select language"
              />
            )}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        
        <InputField
          label="Address"
          {...register("address")}
          placeholder="Enter full address"
          className="mb-4"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            {...register("phoneNumber")}
            placeholder="Enter phone number"
          />
          <InputField
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Enter email address"
          />
        </div>
        
        <InputField
          label="Emergency Contact"
          {...register("emergencyContact")}
          placeholder="Enter emergency contact information"
          className="mt-4"
        />
      </div>

      {/* Assessment Information Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Assessment Information</h3>
        
        {[
          { label: "Presenting Problem", name: "presentingProblem", rows: 3 },
          { label: "Medical History", name: "medicalHistory", rows: 3 },
          { label: "Mental Health History", name: "mentalHealthHistory", rows: 3 },
          { label: "Substance Use History", name: "substanceUseHistory", rows: 2 },
          { label: "Family History", name: "familyHistory", rows: 3 },
          { label: "Social Support", name: "socialSupport", rows: 2 },
          { label: "Current Medications", name: "currentMedications", rows: 2 },
          { label: "Strengths and Resources", name: "strengthsResources", rows: 3 },
          { label: "Risk Assessment", name: "riskAssessment", rows: 2 },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2 block">
              {field.label}
            </label>
            <textarea
              {...register(field.name as any)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              rows={field.rows}
              className="w-full border-[1px] border-[#DADADA] rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
            />
          </div>
        ))}
      </div>

      {/* Service Information Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Service Information</h3>
        
        <InputField
          label="Referred By"
          {...register("referredBy")}
          placeholder="Enter referral source"
          className="mb-4"
        />
        
        <Controller
          name="servicesRequested"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Services Requested"
              options={SERVICES_OPTIONS}
              selected={field.value || []}
              onChange={field.onChange}
              multiple={true}
              placeholder="Select requested services"
            />
          )}
        />
      </div>

      {/* Consent Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Consent and Acknowledgments</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consentToTreatment"
              {...register("consentToTreatment")}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="consentToTreatment" className="text-sm text-gray-700">
              I consent to psychosocial treatment and services
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confidentialityAcknowledgment"
              {...register("confidentialityAcknowledgment")}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="confidentialityAcknowledgment" className="text-sm text-gray-700">
              I acknowledge that my information will be kept confidential according to privacy laws
            </label>
          </div>
        </div>
      </div>

      {/* Assessor Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Assessor Name"
          {...register("assessorName")}
          placeholder="Enter assessor name"
        />
        <InputField
          label="Assessor Signature"
          {...register("assessorSignature")}
          placeholder="Enter signature"
        />
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-center">Error submitting form. Please try again.</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center w-full mt-6">
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className={`w-full md:w-64 ${isSubmitting || isPending ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {isSubmitting || isPending ? "Submitting Assessment..." : "Submit Assessment"}
        </Button>
      </div>
    </form>
  );
}