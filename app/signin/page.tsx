"use client";

import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    //   "Password must contain at least one uppercase, one lowercase, one number and one special character"
    // ),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async () => {
      setIsSubmitting(true);

      try {
        const res = await signIn("credentials", {
          email: formik.values.email,
          password: formik.values.password,
          redirect: false,
        });
        console.log("Login response:", res);
        
        if (!res?.ok) {
          toast.error(res?.error ?? "Login failed");
        } else {
          toast.success("Logged in successfully");
          window.location.href = "/dashboard";
        }
      } catch (err: any) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-full">
      <div className="p-6 sm:p-7 sm:pt-6 mt-4 w-full mx-2 sm:mx-0 max-w-[26rem] md:max-w-[31rem]  bg-white  shadow-md rounded-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          {/* <img
            src="/images/logos/addis-sytems-log.svg"
            alt="logo"
            className="w-20 sm:w-24 sm:h-24 h-full"
          /> */}
        </div>
        <div className="flex justify-center mt-9 sm:mx-auto">
          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 text-left"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base ${formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-dashenBlue"
                  }`}
                disabled={isSubmitting}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 mt-1 text-xs text-left">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 text-left"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base ${formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-dashenBlue"
                    }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 mt-1 text-xs text-left">
                  {formik.errors.password}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1 text-left">
                Password must contain at least 8 characters, including uppercase,
                lowercase, number, and special character.
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-3 rounded-md text-white font-medium transition-colors ${formik.isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-dashenBlue bg-blue-600"
                }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}