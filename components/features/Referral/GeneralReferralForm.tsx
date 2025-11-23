// components/features/Referral/GeneralReferralForm.tsx
"use client";

import { useSubmitGeneralReferralForm } from "@/application/hooks/useSubmitGeneralReferralForm";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { GeneralReferralFormPayload } from "@/domain/entities/assesments/generalReferral";
import {
  generalReferralFormSchema,
  GeneralReferralFormValues,
} from "@/domain/validation/generalReferralForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function GeneralReferralForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GeneralReferralFormValues>({
    resolver: zodResolver(generalReferralFormSchema),
    defaultValues: {
      referral_date: new Date().toISOString().split('T')[0],
      date_of_birth: new Date().toISOString().split('T')[0],
      call_any_time: false,
    },
  });

  const { data: session } = useSession();

  const { mutate, isPending, isSuccess, error, isError } = useSubmitGeneralReferralForm({
    onSuccess: () => {
      toast.success("General referral form submitted successfully!");
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

  const onSubmit: SubmitHandler<GeneralReferralFormValues> = (data) => {
    const payload: GeneralReferralFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "IOS General Referral Form",
      formData: {
        data_entry_personnel_name: data.data_entry_personnel_name,
        referral_date: data.referral_date,
        referral_first_name: data.referral_first_name,
        referral_last_name: data.referral_last_name,
        date_of_birth: data.date_of_birth,
        best_time_to_call: data.best_time_to_call,
        email_address: data.email_address,
        phone_number: data.phone_number,
        call_any_time: data.call_any_time,
        street_address: data.street_address,
        address_line_2: data.address_line_2,
        city: data.city,
        state_province_region: data.state_province_region,
        zip_postal_code: data.zip_postal_code,
        country: data.country,
        referred_by_first_name: data.referred_by_first_name,
        referred_by_last_name: data.referred_by_last_name,
        referred_to_first_name: data.referred_to_first_name,
        referred_to_last_name: data.referred_to_last_name,
        reasons_for_referral: data.reasons_for_referral,
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
        <h2 className="text-2xl font-bold uppercase">IOS GENERAL REFERRAL FORM</h2>
        <p className="text-lg font-semibold text-gray-700 mt-2">General Referral Form</p>
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

        {/* Referral Date */}
        <InputField
                  placeholder={""} label="Referral Date: (Required)"
                  type="date"
                  {...register("referral_date")}
                  error={errors.referral_date?.message}        />

        {/* Referral Individual's Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Referral individual's Name: (Required) - First"
            {...register("referral_first_name")}
            placeholder="First name"
            error={errors.referral_first_name?.message}
          />
          <InputField
            label="Referral individual's Name: (Required) - Last"
            {...register("referral_last_name")}
            placeholder="Last name"
            error={errors.referral_last_name?.message}
          />
        </div>

        {/* Date of Birth */}
        <InputField
                  placeholder={""} label="Referral individual's Date of Birth: (Required)"
                  type="date"
                  {...register("date_of_birth")}
                  error={errors.date_of_birth?.message}        />

        {/* Best Time To Call */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best Time To Call:
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                {...register("best_time_to_call")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.best_time_to_call && (
              <span className="text-red-500 text-xs mt-1">{errors.best_time_to_call.message}</span>
            )}
          </div>
        </div>

        {/* Email Address */}
        <InputField
          label="Referral's Email Address:"
          type="email"
          {...register("email_address")}
          placeholder="Enter email address"
          error={errors.email_address?.message}
        />

        {/* Phone Number */}
        <InputField
          label="Referral individual's Phone Number: (Required)"
          type="tel"
          {...register("phone_number")}
          placeholder="Enter phone number"
          error={errors.phone_number?.message}
        />

        {/* Call Any Time Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="call_any_time"
            {...register("call_any_time")}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="call_any_time" className="text-sm text-gray-700">
            Any Time To Call: ☐ Call Any Time
          </label>
        </div>

        {/* Street Address */}
        <InputField
          label="Referral individual's Street Address: (Required)"
          {...register("street_address")}
          placeholder="Street Address"
          error={errors.street_address?.message}
        />

        {/* Address Line 2 */}
        <InputField
          label="Address Line 2"
          {...register("address_line_2")}
          placeholder="Apartment, suite, unit, etc."
          error={errors.address_line_2?.message}
        />

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* Page 2 Content */}
      <div className="border-t pt-6 mt-6 space-y-6">
        {/* Country */}
        <InputField
          label="Country"
          {...register("country")}
          placeholder="Country"
          error={errors.country?.message}
        />

        {/* Referred By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Referred By: (Required) - First"
            {...register("referred_by_first_name")}
            placeholder="First name"
            error={errors.referred_by_first_name?.message}
          />
          <InputField
            label="Referred By: (Required) - Last"
            {...register("referred_by_last_name")}
            placeholder="Last name"
            error={errors.referred_by_last_name?.message}
          />
        </div>

        {/* Referred To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Referred To: (Required) - First"
            {...register("referred_to_first_name")}
            placeholder="First name"
            error={errors.referred_to_first_name?.message}
          />
          <InputField
            label="Referred To: (Required) - Last"
            {...register("referred_to_last_name")}
            placeholder="Last name"
            error={errors.referred_to_last_name?.message}
          />
        </div>

        {/* Reasons for Referral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reasons for Referral:
          </label>
          <textarea
            {...register("reasons_for_referral")}
            placeholder="Enter reasons for referral"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          {errors.reasons_for_referral && (
            <span className="text-red-500 text-xs mt-1">{errors.reasons_for_referral.message}</span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600 text-center">Error submitting referral form. Please try again.</p>
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