"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationFormSchema,
  RegistrationFormValues,
} from "@/domain/validation/registrationForm.schema";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import RadioGroup from "@/components/ui/RadioGroup/RadioGroup";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { RegistrationFormClients } from "@/domain/entities/registration";
import { useRegisterUser } from "@/application/hooks/useRegisterUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";

const SERVICES = [
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

const NATIONALITIES = [
  { value: "Ethiopian", label: "Ethiopian" },
  { value: "Eritrean", label: "Eritrean" },
  { value: "Somali", label: "Somali" },
  { value: "Other", label: "Other" },
];

const IMMIGRATION_STATUSES = [
  { value: "Refugee", label: "Refugee" },
  { value: "Asylum Seeker", label: "Asylum Seeker" },
  { value: "Resident", label: "Resident" },
  { value: "Other", label: "Other" },
];

const LANGUAGES = [
  { value: "Amharic", label: "Amharic" },
  { value: "Oromo", label: "Oromo" },
  { value: "Tigrinya", label: "Tigrinya" },
  { value: "English", label: "English" },
  { value: "Other", label: "Other" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      services: [],
      mobileNumber: "+251",
      agreeToTerms: false,
      gender: "male",
      dateOfBirth: "",
    },

  });
  const { data: session } = useSession(); 

  const { mutate, isPending, isSuccess, error, isError } = useRegisterUser({
    onSuccess: () => {
      toast.success("You have successfully registered. You will receive notification on your email. Please check your email.");
      setTimeout(() => {
        reset();
      }, 6000);
    },
    onError: (error) => {
      console.log("error", error)
      toast.error(`Registration failed: ${error.message || "Please try again later."}`);
    }
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = (data) => {
    const payload: RegistrationFormClients = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
      mobile: data.mobileNumber,
      nationality: data.nationality,
      immigrationStatus: data.immigrationStatus,
      language: data.language,
      address: data.address,
      birthDate: data.dateOfBirth,
      message: data.message,
      services: data.services,
    };

    mutate(payload);
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col   p-6   gap-4 w-full md:max-w-[820px] mx-auto "
    >
      {/* First + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First name *"
          {...register("firstName")}
          placeholder="Enter first name"
          error={errors.firstName?.message}
        />
        <InputField
          label="Last name *"
          {...register("lastName")}
          placeholder="Enter last name"
          error={errors.lastName?.message}
        />
      </div>

      {/* Date + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Date of Birth"
          type="date"
          {...register("dateOfBirth")}
          placeholder="Select date"
          error={errors.dateOfBirth?.message}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Gender *"
              options={GENDER_OPTIONS}
              selectedValue={field.value}
              onChange={field.onChange}
              error={errors.gender?.message}
              required={true}
            />
          )}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Email Address"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          error={errors.email?.message}
        />
        <InputField
          label="Mobile Number *"
          type="tel"
          {...register("mobileNumber")}
          placeholder="+2519xxxxxxx"
          error={errors.mobileNumber?.message}
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Nationality"
              options={NATIONALITIES}
              selected={field.value || ""}
              onChange={field.onChange}
              error={errors.nationality?.message}
              placeholder="Select Nationality"
            />
          )}
        />

        <Controller
          name="immigrationStatus"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Immigration Status"
              options={IMMIGRATION_STATUSES}
              selected={field.value || ""}
              onChange={field.onChange}
              error={errors.immigrationStatus?.message}
              placeholder="Select Status"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Language"
              options={LANGUAGES}
              selected={field.value || ""}
              onChange={field.onChange}
              error={errors.language?.message}
              placeholder="Select Language"
            />
          )}
        />

        <InputField
          label="Address"
          {...register("address")}
          placeholder="Addis Ababa, Ethiopia"
          error={errors.address?.message}
        />
      </div>

      {/* Message textarea */}
      <div className="w-full">
        <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2">Message</label>
        <textarea
          {...register("message")}
          placeholder="Client wants housing..."
          className="w-full border-[1px] border-[#DADADA] rounded-[8px] px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
        />
        {errors.message && (
          <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>
        )}
      </div>

      {/* Services Dropdown */}
      <Controller
        name="services"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Services *"
            options={SERVICES}
            selected={field.value}
            onChange={field.onChange}
            error={errors.services?.message}
            multiple={true}
            required={true}
            placeholder="Pick a service"
          />
        )}
      />

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...register("agreeToTerms")}
          className="h-5 w-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
          I consent to share my information for case management purposes.
        </label>
      </div>
      {errors.agreeToTerms && (
        <span className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</span>
      )}

      {/* Error */}
      {isError && <p className="text-red-500 text-center">{error?.isAxiosError}</p>}

      {/* Submit */}
      {/* Submit */}
      <div className="flex justify-center w-full mt-4">
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className={`w-full ${isSubmitting || isPending ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {isSubmitting || isPending ? (
            <div className="flex items-center justify-center">
              Processing...
            </div>
          ) : (
            "Register Now"
          )}
        </Button>
      </div>
    </form>
  );
}

