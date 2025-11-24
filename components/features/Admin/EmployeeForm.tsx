// components/features/Admin/EmployeeForm.tsx
"use client";

import { Button } from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import { Employee, EmployeeRole } from "@/domain/entities/employee";
import { employeeFormSchema, EmployeeFormValues } from "@/domain/validation/employeeForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";

const ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: "Admin", label: "Admin" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "PCO", label: "PCO" },
  { value: "Wellness", label: "Wellness" },
  { value: "IOCR", label: "IOCR" },
  { value: "Settlement", label: "Settlement" },
  { value: "Psychosocial", label: "Psychosocial" },
  { value: "Youth", label: "Youth" },
  { value: "SALP", label: "SALP" },
  { value: "GBV", label: "GBV" },
  { value: "Training", label: "Training" },
  { value: "Policy", label: "Policy" },
];

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: SubmitHandler<EmployeeFormValues>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export default function EmployeeForm({ employee, onSubmit, isSubmitting = false, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  // Reset form when employee changes (for edit mode)
  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: "", // Don't pre-fill password for updates
        role: employee.role,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: undefined,
      });
    }
  }, [employee, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 max-w-7xl  space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name *"
          {...register("firstName")}
          placeholder="Enter first name"
          error={errors.firstName?.message}
        />
        <InputField
          label="Last Name *"
          {...register("lastName")}
          placeholder="Enter last name"
          error={errors.lastName?.message}
        />
      </div>

      <InputField
        label="Email *"
        type="email"
        {...register("email")}
        placeholder="Enter email address"
        error={errors.email?.message}
      />

      <InputField
        label="Password *"
        type="password"
        {...register("password")}
        placeholder={employee ? "Leave blank to keep current password" : "Enter password (min. 6 characters)"}
        error={errors.password?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <select
          {...register("role")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a role</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <span className="text-red-500 text-xs mt-1">{errors.role.message}</span>
        )}
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          disabled={isSubmitting}
        >
          {employee ? "Update Employee" : "Create Employee"}
        </Button>
      </div>
    </form>
  );
}