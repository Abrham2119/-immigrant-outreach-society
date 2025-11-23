// components/features/Contact/GroupContactNoteForm.tsx
"use client";

import { useSubmitGroupContactNoteForm } from "@/application/hooks/useSubmitGroupContactNoteForm";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { GroupContactNoteFormPayload } from "@/domain/entities/assesments/groupContactNote";
import {
  groupContactNoteFormSchema,
  GroupContactNoteFormValues,
} from "@/domain/validation/groupContactNoteForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const METHOD_OF_CONTACT_OPTIONS = [
  { value: "in_person", label: "In Person" },
  { value: "email", label: "Email" },
  { value: "telephone", label: "Telephone" },
  { value: "virtual", label: "Virtual" },
];

export default function GroupContactNoteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<GroupContactNoteFormValues>({
    resolver: zodResolver(groupContactNoteFormSchema),
    defaultValues: {
      date_completed: new Date().toISOString().split('T')[0],
      method_of_contact: [],
      other_method_explanation: "",
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitGroupContactNoteForm({
    onSuccess: () => {
      toast.success("Group contact note submitted successfully!");
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

  const methodOfContact = watch("method_of_contact");
  const showOtherExplanation = methodOfContact?.includes("other");

  const onSubmit: SubmitHandler<GroupContactNoteFormValues> = (data) => {
    const payload: GroupContactNoteFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS GROUP CONTACT NOTE",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        group_name: data.group_name,
        ios_staff_1_first_name: data.ios_staff_1_first_name,
        ios_staff_1_last_name: data.ios_staff_1_last_name,
        ios_staff_2_first_name: data.ios_staff_2_first_name,
        ios_staff_2_last_name: data.ios_staff_2_last_name,
        ios_staff_3_first_name: data.ios_staff_3_first_name,
        ios_staff_3_last_name: data.ios_staff_3_last_name,
        duration_minutes: data.duration_minutes,
        method_of_contact: data.method_of_contact,
        other_method_explanation: data.other_method_explanation,
        participants: data.participants,
        acknowledgement_first_name: data.acknowledgement_first_name,
        acknowledgement_last_name: data.acknowledgement_last_name,
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
        <h2 className="text-2xl font-bold uppercase">IOS GROUP CONTACT NOTE</h2>
        <p className="text-lg font-semibold text-gray-700 mt-2">IOS GROUP CONTACT</p>
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

        {/* Group Name */}
        <InputField
          label="Group Name (Required)"
          {...register("group_name")}
          placeholder="Enter group name"
          error={errors.group_name?.message}
        />

        {/* IOS Staff */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">IOS Staff</h3>
          
          {/* Staff 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="IOS Staff - 1 - First"
              {...register("ios_staff_1_first_name")}
              placeholder="First name"
              error={errors.ios_staff_1_first_name?.message}
            />
            <InputField
              label="IOS Staff - 1 - Last"
              {...register("ios_staff_1_last_name")}
              placeholder="Last name"
              error={errors.ios_staff_1_last_name?.message}
            />
          </div>

          {/* Staff 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="IOS Staff - 2 - First"
              {...register("ios_staff_2_first_name")}
              placeholder="First name"
              error={errors.ios_staff_2_first_name?.message}
            />
            <InputField
              label="IOS Staff - 2 - Last"
              {...register("ios_staff_2_last_name")}
              placeholder="Last name"
              error={errors.ios_staff_2_last_name?.message}
            />
          </div>

          {/* Staff 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="IOS Staff - 3 - First"
              {...register("ios_staff_3_first_name")}
              placeholder="First name"
              error={errors.ios_staff_3_first_name?.message}
            />
            <InputField
              label="IOS Staff - 3 - Last"
              {...register("ios_staff_3_last_name")}
              placeholder="Last name"
              error={errors.ios_staff_3_last_name?.message}
            />
          </div>
        </div>

        {/* Duration */}
        <InputField
          label="Duration of Group In Minutes: (Required)"
          type="number"
          {...register("duration_minutes", { valueAsNumber: true })}
          placeholder="Enter duration in minutes"
          error={errors.duration_minutes?.message}
        />

        {/* Method of Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Method of Contact: (Required) - Select All
          </label>
          <div className="space-y-2">
            {METHOD_OF_CONTACT_OPTIONS.map((method) => (
              <div key={method.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={method.value}
                  value={method.value}
                  {...register("method_of_contact")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={method.value} className="ml-2 text-sm text-gray-700">
                  {method.label}
                </label>
              </div>
            ))}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other"
                value="other"
                {...register("method_of_contact")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="other" className="ml-2 text-sm text-gray-700">
                Other: Please explain below
              </label>
            </div>
          </div>
          {errors.method_of_contact && (
            <span className="text-red-500 text-xs mt-1">{errors.method_of_contact.message}</span>
          )}
        </div>

        {/* Other Method Explanation */}
        {showOtherExplanation && (
          <InputField
            label="Others:"
            {...register("other_method_explanation")}
            placeholder="Please explain other method"
            error={errors.other_method_explanation?.message}
          />
        )}

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Participants: Name of participants: Date Topic
          </label>
          <textarea
            {...register("participants")}
            placeholder="Enter participant names, dates, and topics"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.participants && (
            <span className="text-red-500 text-xs mt-1">{errors.participants.message}</span>
          )}
        </div>
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        <h2 className="text-xl font-bold"># Acknowledgement</h2>

        {/* IOS Staff Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="IOS Staff Name: - First"
            {...register("acknowledgement_first_name")}
            placeholder="First name"
            error={errors.acknowledgement_first_name?.message}
          />
          <InputField
            label="IOS Staff Name: - Last"
            {...register("acknowledgement_last_name")}
            placeholder="Last name"
            error={errors.acknowledgement_last_name?.message}
          />
        </div>

        {/* Signature */}
        <InputField
          label="Signature"
          {...register("signature")}
          placeholder="Enter signature"
          error={errors.signature?.message}
        />

        {/* Date Completed */}
        <InputField
                  placeholder={""} label="Date Completed"
                  type="date"
                  {...register("date_completed")}
                  error={errors.date_completed?.message}        />
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600 text-center">Error submitting group contact note. Please try again.</p>
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