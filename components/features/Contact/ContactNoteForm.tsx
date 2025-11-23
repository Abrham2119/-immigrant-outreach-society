// components/features/Contact/ContactNoteForm.tsx
"use client";

import { useSubmitContactNoteForm } from "@/application/hooks/useSubmitContactNoteForm";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { ContactNoteFormPayload } from "@/domain/entities/assesments/contactNote";
import { contactNoteFormSchema, ContactNoteFormValues } from "@/domain/validation/contactNoteForm.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ContactNoteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactNoteFormValues>({
    resolver: zodResolver(contactNoteFormSchema),
    defaultValues: {
      date_of_contact: new Date().toISOString().split('T')[0],
      date_of_next_appointment: new Date().toISOString().split('T')[0],
      date_completed: new Date().toISOString().split('T')[0],
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

  const params = useParams();
  const clientId = params.clientId as string;

  const onSubmit: SubmitHandler<ContactNoteFormValues> = (data) => {
    const payload: ContactNoteFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS Contact Note",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        client_first_name: data.client_first_name,
        client_last_name: data.client_last_name,
        ios_staff_first_name: data.ios_staff_first_name,
        ios_staff_last_name: data.ios_staff_last_name,
        date_of_contact: data.date_of_contact,
        client_concerns: data.client_concerns,
        interventions: data.interventions,
        client_response: data.client_response,
        future_actions: data.future_actions,
        date_of_next_appointment: data.date_of_next_appointment,
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
        <h2 className="text-2xl font-bold uppercase">IOS CONTACT NOTE</h2>
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

        {/* Date of Contact */}
        <InputField
          placeholder={""} label="Date of Contact (Required)"
          type="date"
          {...register("date_of_contact")}
          error={errors.date_of_contact?.message}        />

        {/* Client Concerns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data (Client Concerns):
          </label>
          <textarea
            {...register("client_concerns")}
            placeholder="Enter client concerns"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.client_concerns && (
            <span className="text-red-500 text-xs mt-1">{errors.client_concerns.message}</span>
          )}
        </div>

        {/* Interventions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action (Interventions):
          </label>
          <textarea
            {...register("interventions")}
            placeholder="Enter interventions taken"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.interventions && (
            <span className="text-red-500 text-xs mt-1">{errors.interventions.message}</span>
          )}
        </div>

        {/* Client Response */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response (Client's Response to Action):
          </label>
          <textarea
            {...register("client_response")}
            placeholder="Enter client's response"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.client_response && (
            <span className="text-red-500 text-xs mt-1">{errors.client_response.message}</span>
          )}
        </div>
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* Future Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan (Future Actions/Others Involved):
          </label>
          <textarea
            {...register("future_actions")}
            placeholder="Enter future actions and others involved"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.future_actions && (
            <span className="text-red-500 text-xs mt-1">{errors.future_actions.message}</span>
          )}
        </div>

        {/* Date of Next Appointment */}
        <InputField
          placeholder={""} label="Date of Next Appointment (Required)"
          type="date"
          {...register("date_of_next_appointment")}
          error={errors.date_of_next_appointment?.message}        />

        {/* Acknowledgement Section */}
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Acknowledgement (IOS Staff):</h3>
          
          <InputField
            label="Name (Required)"
            {...register("acknowledgement_name")}
            placeholder="Enter full name"
            error={errors.acknowledgement_name?.message}
          />

          <InputField
            label="Signature (Required)"
            {...register("acknowledgement_signature")}
            placeholder="Enter signature"
            error={errors.acknowledgement_signature?.message}
          />

          <InputField
            placeholder={""} label="Date Completed (Required)"
            type="date"
            {...register("date_completed")}
            error={errors.date_completed?.message}          />
        </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600 text-center">Error submitting form. Please try again.</p>
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