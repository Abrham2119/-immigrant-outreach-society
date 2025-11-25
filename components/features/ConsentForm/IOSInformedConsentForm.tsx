"use client";

import { useSubmitIOSConsentForm } from "@/application/hooks/useSubmitIOSConsentForm";
import { Button } from "@/components/ui/Button/Button";
import { IOSConsentFormPayload } from "@/domain/entities/assesments/iosConsent";
import {
  iosConsentFormSchema,
  IOSConsentFormValues,
} from "@/domain/validation/iosConsentForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SignatureComponent } from '@syncfusion/ej2-react-inputs';
import { useRef, useState } from "react";

// Create proper type for signature ref
type SignatureRef = SignatureComponent | null;

export default function IOSInformedConsentForm() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IOSConsentFormValues>({
    resolver: zodResolver(iosConsentFormSchema),
  });

  const clientSignatureRef = useRef<SignatureRef>(null);
  const iosStaffSignatureRef = useRef<SignatureRef>(null);
  const [clientSignatureData, setClientSignatureData] = useState<string>("");
  const [iosStaffSignatureData, setIosStaffSignatureData] = useState<string>("");

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const { mutate, isPending, isError } = useSubmitIOSConsentForm({
    onSuccess: () => {
      toast.success("IOS Informed Consent form submitted successfully!");
      setTimeout(() => {
        reset();
        setClientSignatureData("");
        setIosStaffSignatureData("");
      }, 3000);
      router.push('/dashboard/receptionist/clients');
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message || "Please try again later."}`);
    }
  });

  const clearClientSignature = () => {
    if (clientSignatureRef.current) {
      clientSignatureRef.current.clear();
      setValue("clientSignature", "");
      setClientSignatureData("");
      trigger("clientSignature");
    }
  };

  const clearIOSSignature = () => {
    if (iosStaffSignatureRef.current) {
      iosStaffSignatureRef.current.clear();
      setValue("iosStaffSignature", "");
      setIosStaffSignatureData("");
      trigger("iosStaffSignature");
    }
  };

  const handleClientSignatureChange = () => {
    if (clientSignatureRef.current && !clientSignatureRef.current.isEmpty()) {
      const signatureData = clientSignatureRef.current.getSignature();
      if (signatureData) {
        setValue("clientSignature", signatureData, { shouldValidate: true });
        setClientSignatureData(signatureData);
        trigger("clientSignature");
      }
    } else {
      setValue("clientSignature", "", { shouldValidate: true });
      setClientSignatureData("");
      trigger("clientSignature");
    }
  };

  const handleIOSSignatureChange = () => {
    if (iosStaffSignatureRef.current && !iosStaffSignatureRef.current.isEmpty()) {
      const signatureData = iosStaffSignatureRef.current.getSignature();
      if (signatureData) {
        setValue("iosStaffSignature", signatureData, { shouldValidate: true });
        setIosStaffSignatureData(signatureData);
        trigger("iosStaffSignature");
      }
    } else {
      setValue("iosStaffSignature", "", { shouldValidate: true });
      setIosStaffSignatureData("");
      trigger("iosStaffSignature");
    }
  };

  const onSubmit = (data: IOSConsentFormValues) => {
    // Double check signatures are set
    if (!clientSignatureData || !iosStaffSignatureData) {
      toast.error("Please provide both signatures before submitting");
      return;
    }

    const payload: IOSConsentFormPayload = {
      client: clientId || "",
      personnel: session?.user?.id ?? "",
      service: session?.user?.role ?? "",
      title: "ios_informed_consent",
      consentText: `    <div className="mb-6 p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
        <div className="text-sm text-gray-700 space-y-4">
          <p>
            Immigrant Outreach Society (IOS) is a community-based non-profit organization that provides mental health intervention and psychological services for refugees and ethnic minorities from East Africa, including Ethiopia, Eritrea, Somalia, Sudan, and South Sudan.
          </p>

          <div>
            <h3 className="font-semibold mb-2">Confidentiality:</h3>
            <p className="mb-3">
              One of the most important rights of the person seeking counseling is confidentiality. Information revealed by you during counseling sessions will be kept strictly confidential and will not be revealed to any other person or agency without your written permission, with the following exceptions:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>If an individual intends to take harmful, dangerous, or criminal action against another human being, or against himself or herself, it is our duty to warn appropriate individuals or agencies of such intentions.</li>
              <li>Any suspected or confirmed acts of abuse towards a child, elder or vulnerable person (including physical abuse, sexual abuse, unlawful sexual intercourse, neglect, emotional and psychological abuse) will need to be reported to the appropriate agencies by the counsellor.</li>
              <li>When the courts believe that a client's counsellor may have valuable information for their case, they will subpoena her/his notes, records, and in some instances, even the counsellor themselves.</li>
              <li>Information about you may be discussed in confidence, without revealing your identity, with other psychosocial support professionals and or supervisors for the purpose of consultation and providing you with the best possible service.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Minors:</h3>
            <p>
              If you are under 18 years of age, please be aware that the law may provide your parents the right to examine your records. It is our policy to request an agreement from parents that they agree to give up access to your records. If they agree, we will provide them only with general information about our work together, unless we feel there is a high risk that you will harm yourself or someone else. In this case, we will notify them of my concern. Before giving them any information, we will discuss the matter with you, if possible, and do my best to handle any concerns you may have with what I am prepared to discuss.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Emergencies:</h3>
            <p>
              IOS doesn't provide emergency or crisis related services. If you have an emergency or are experiencing a crisis, please go the local hospital or emergency, call the Distress Centre (403-266-4357), or 911.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Acknowledgement and Consent:</h3>
            <p>
              Upon signing below, you are indicating that you have read and understood this consent form and that any questions you had about this consent form were answered to your satisfaction, and that you were provided a copy of this document. You agree to accept the psychosocial support services as detailed above.
            </p>
          </div>
        </div>
      </div>`,
      formData: {
        data_entry_personnel_name: data.dataEntryPersonnelName,
        consent: data.consent,
        client_signature: clientSignatureData,
        client_full_name: data.clientFullName,
        client_date: data.clientDate,
        ios_staff_signature: iosStaffSignatureData,
        ios_staff_full_name: data.iosStaffFullName,
        ios_staff_date: data.iosStaffDate,

      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white"
    >
      <h1 className="text-2xl font-bold text-center mb-6">IOS INFORMED CONSENT</h1>

      {/* Data Entry Personnel Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Entry Personnel Name (Required)
        </label>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-3 lg:max-w-96 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("dataEntryPersonnelName")}
        />
        {errors.dataEntryPersonnelName && (
          <p className="text-red-500 text-sm mt-1">{errors.dataEntryPersonnelName.message}</p>
        )}
      </div>

      {/* Consent Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Consent</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="consent"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register("consent")}
          />
          <label htmlFor="consent" className="ml-2 block text-sm text-gray-900">
            I Consent.
          </label>
        </div>
        {errors.consent && (
          <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
        <div className="text-sm text-gray-700 space-y-4">
          <p>
            Immigrant Outreach Society (IOS) is a community-based non-profit organization that provides mental health intervention and psychological services for refugees and ethnic minorities from East Africa, including Ethiopia, Eritrea, Somalia, Sudan, and South Sudan.
          </p>

          <div>
            <h3 className="font-semibold mb-2">Confidentiality:</h3>
            <p className="mb-3">
              One of the most important rights of the person seeking counseling is confidentiality. Information revealed by you during counseling sessions will be kept strictly confidential and will not be revealed to any other person or agency without your written permission, with the following exceptions:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>If an individual intends to take harmful, dangerous, or criminal action against another human being, or against himself or herself, it is our duty to warn appropriate individuals or agencies of such intentions.</li>
              <li>Any suspected or confirmed acts of abuse towards a child, elder or vulnerable person (including physical abuse, sexual abuse, unlawful sexual intercourse, neglect, emotional and psychological abuse) will need to be reported to the appropriate agencies by the counsellor.</li>
              <li>When the courts believe that a client's counsellor may have valuable information for their case, they will subpoena her/his notes, records, and in some instances, even the counsellor themselves.</li>
              <li>Information about you may be discussed in confidence, without revealing your identity, with other psychosocial support professionals and or supervisors for the purpose of consultation and providing you with the best possible service.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Minors:</h3>
            <p>
              If you are under 18 years of age, please be aware that the law may provide your parents the right to examine your records. It is our policy to request an agreement from parents that they agree to give up access to your records. If they agree, we will provide them only with general information about our work together, unless we feel there is a high risk that you will harm yourself or someone else. In this case, we will notify them of my concern. Before giving them any information, we will discuss the matter with you, if possible, and do my best to handle any concerns you may have with what I am prepared to discuss.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Emergencies:</h3>
            <p>
              IOS doesn't provide emergency or crisis related services. If you have an emergency or are experiencing a crisis, please go the local hospital or emergency, call the Distress Centre (403-266-4357), or 911.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Acknowledgement and Consent:</h3>
            <p>
              Upon signing below, you are indicating that you have read and understood this consent form and that any questions you had about this consent form were answered to your satisfaction, and that you were provided a copy of this document. You agree to accept the psychosocial support services as detailed above.
            </p>
          </div>
        </div>
      </div>

      {/* Client and IOS Staff Sections - Side by side on large screens */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Section */}
        <div className="lg:max-w-96">
          <h2 className="text-lg font-semibold mb-4">Client</h2>

          {/* Client Signature Pad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature (Required)
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <SignatureComponent
                ref={clientSignatureRef}
                backgroundColor="white"
                strokeColor="black"
                minStrokeWidth={1}
                maxStrokeWidth={2}
                velocity={1}
                change={handleClientSignatureChange}
                style={{ width: '100%', height: '100px' }}
              />
            </div>
            <button
              type="button"
              onClick={clearClientSignature}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear Signature
            </button>
            {errors.clientSignature && (
              <p className="text-red-500 text-sm mt-1">{errors.clientSignature.message}</p>
            )}
          </div>

          {/* Client Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name (Required)
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("clientFullName")}
            />
            {errors.clientFullName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientFullName.message}</p>
            )}
          </div>

          {/* Client Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date (Required)
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("clientDate")}
            />
            {errors.clientDate && (
              <p className="text-red-500 text-sm mt-1">{errors.clientDate.message}</p>
            )}
          </div>
        </div>

        {/* IOS Staff Section */}
        <div className="lg:max-w-96">
          <h2 className="text-lg font-semibold mb-4">IOS Staff</h2>

          {/* IOS Staff Signature Pad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature (Required)
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <SignatureComponent
                ref={iosStaffSignatureRef}
                backgroundColor="white"
                strokeColor="black"
                minStrokeWidth={1}
                maxStrokeWidth={2}
                velocity={1}
                change={handleIOSSignatureChange}
                style={{ width: '100%', height: '100px' }}
              />
            </div>
            <button
              type="button"
              onClick={clearIOSSignature}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear Signature
            </button>
            {errors.iosStaffSignature && (
              <p className="text-red-500 text-sm mt-1">{errors.iosStaffSignature.message}</p>
            )}
          </div>

          {/* IOS Staff Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name (Required)
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("iosStaffFullName")}
            />
            {errors.iosStaffFullName && (
              <p className="text-red-500 text-sm mt-1">{errors.iosStaffFullName.message}</p>
            )}
          </div>

          {/* IOS Staff Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date (Required)
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("iosStaffDate")}
            />
            {errors.iosStaffDate && (
              <p className="text-red-500 text-sm mt-1">{errors.iosStaffDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {isError && <p className="text-red-500 text-center mb-4">Error submitting form. Please try again.</p>}

      {/* Submit Button */}
      <div className="flex w-full justify-center">
        <Button
          type="submit"
          loading={isSubmitting || isPending}
          variant="primary"
          disabled={isSubmitting || isPending}
          className="w-full"
        >
          {isSubmitting || isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}