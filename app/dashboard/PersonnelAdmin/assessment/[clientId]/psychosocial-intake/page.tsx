"use client"
import { ContentProtectionWrapper } from "@/components/ContentProtectionWrapper";
import PsychosocialIntakeForm from "@/components/features/Psychosocial/PsychosocialIntakeForm";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export default function PsychosocialIntakePage() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen   py-6 px-6 md:px-8 lg:p-12">
          <ContentProtectionWrapper
            disablePrint={true}
            disableScreenshot={true}
            disableRightClick={false}
            disableTextSelection={true}
            showWarning={true}
            enableAdvancedProtection={true}

          ><PsychosocialIntakeForm />
          </ContentProtectionWrapper>

        </div>
      </Suspense>
    </>
  );
}