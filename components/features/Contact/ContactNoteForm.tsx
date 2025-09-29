// components/features/Contact/ContactNoteForm.tsx
"use client";

import { useSubmitContactNoteForm } from "@/application/hooks/useSubmitContactNoteForm";
import { Button } from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/InputField/InputField";
import { ContactNoteFormPayload } from "@/domain/entities/assesments/contactNote";
import { contactNoteFormSchema, ContactNoteFormValues } from "@/domain/validation/contactNoteForm.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SCOPE_OPTIONS = [
  { value: "initial_assessment", label: "Initial Assessment" },
  { value: "follow_up", label: "Follow-up Visit" },
  { value: "crisis_intervention", label: "Crisis Intervention" },
  { value: "case_management", label: "Case Management" },
  { value: "referral", label: "Referral Service" },
  { value: "documentation", label: "Documentation Assistance" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ContactNoteForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactNoteFormValues>({
    resolver: zodResolver(contactNoteFormSchema),
    defaultValues: {
      scope_of_service: [],
      acknowledgement: false,
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitContactNoteForm({
    onSuccess: () => {
      toast.success("Contact note submitted successfully!");
      setTimeout(() => {
        reset();
      }, 3000);
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });

  const onSubmit: SubmitHandler<ContactNoteFormValues> = (data) => {
    const payload: ContactNoteFormPayload  = {
      client: "68d6cf4803c61caa9ab44210",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      formData: {
        client_full_name: data.clientFullName,
        sql_staff_full_name: data.sqlStaffFullName,
        scope_of_service: data.scope_of_service,
        client_name_for_hosting: data.clientNameForHosting,
        action_information: data.actionInformation,
        client_request_to_action: data.clientRequestToAction,
        client_audit_for_hosting: data.clientAuditForHosting,
        party_data_status: data.partyDataStatus,
        appointment_status: data.appointmentStatus,
        acknowledgement: data.acknowledgement,
        signature: data.signature,
        name_composition: data.nameComposition,
        date_completed: data.dateCompleted || new Date().toISOString().split('T')[0],
      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-6 bg-white gap-4 w-full md:max-w-[820px] mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">CONTACT NOTE</h2>

      {/* Client Full Name & SQL Staff Full Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Client Full Name *"
          {...register("clientFullName")}
          placeholder="Enter client full name"
          error={errors.clientFullName?.message}
        />
        <InputField
          label="SQL Staff Full Name *"
          {...register("sqlStaffFullName")}
          placeholder="Enter SQL staff full name"
          error={errors.sqlStaffFullName?.message}
        />
      </div>

      {/* Scope of Service */}
      <Controller
        name="scope_of_service"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Scope of Service *"
            options={SCOPE_OPTIONS}
            selected={field.value || []}
            onChange={field.onChange}
            error={errors.scope_of_service?.message}
            multiple={true}
            placeholder="Select scope of service"
          />
        )}
      />

      {/* VOTATION - Client Overview Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">VOTATION - Your Client Overview</h3>
        
        <InputField
          label="Client Name for Hosting"
          {...register("clientNameForHosting")}
          placeholder="Enter client name for hosting"
          error={errors.clientNameForHosting?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Action Information"
            {...register("actionInformation")}
            placeholder="Enter action information"
            error={errors.actionInformation?.message}
          />
          <InputField
            label="Client's Request to Action"
            {...register("clientRequestToAction")}
            placeholder="Enter client's request"
            error={errors.clientRequestToAction?.message}
          />
        </div>

        <InputField
          label="Client's Audit for Hosting"
          {...register("clientAuditForHosting")}
          placeholder="Enter client audit details"
          error={errors.clientAuditForHosting?.message}
        />

        <Controller
          name="partyDataStatus"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Party Data / Active/Status Interface"
              options={STATUS_OPTIONS}
              selected={field.value ? [field.value] : []}
              onChange={(value) => field.onChange(value[0] || "")}
              error={errors.partyDataStatus?.message}
              multiple={false}
              placeholder="Select status"
            />
          )}
        />

        <InputField
          label="Client's Audit for Hosting"
          {...register("clientAuditForHosting")}
          placeholder="Enter additional audit details"
          error={errors.clientAuditForHosting?.message}
        />

        <InputField
          label="Appointment Status"
          {...register("appointmentStatus")}
          placeholder="Enter appointment details"
          error={errors.appointmentStatus?.message}
        />
      </div>

      {/* VOTATION - Acknowledgement Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">VOTATION - Acknowledgement</h3>
        
        <InputField
          label="SQL Staff Full Name *"
          {...register("sqlStaffFullName")}
          placeholder="Enter SQL staff full name"
          error={errors.sqlStaffFullName?.message}
        />

        <InputField
          label="Signature *"
          {...register("signature")}
          placeholder="Enter signature"
          error={errors.signature?.message}
        />

        <InputField
          label="Name Composition"
          {...register("nameComposition")}
          placeholder="Enter name composition"
          error={errors.nameComposition?.message}
        />
      </div>

      {/* Date Completed */}
      <InputField
        label="Date Completed"
        type="date"
        {...register("dateCompleted")}
        error={errors.dateCompleted?.message}
        placeholder=""
      />

      {/* Acknowledgement Checkbox */}
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

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center w-full mt-4">
        <Button
          type="button"
          className="flex-1"
          onClick={() => reset()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className={`flex-1 ${isSubmitting || isPending ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {isSubmitting || isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}