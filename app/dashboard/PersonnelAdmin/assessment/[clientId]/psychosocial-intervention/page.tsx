// app/psychosocial-intervention/page.tsx
import { ContentProtectionWrapper } from "@/components/ContentProtectionWrapper";
import PsychosocialInterventionForm from "@/components/features/Psychosocial/PsychosocialInterventionForm";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export default function PsychosocialInterventionPage() {
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

          >  <PsychosocialInterventionForm />     </ContentProtectionWrapper>
        </div>

      </Suspense>
    </>
  );
}