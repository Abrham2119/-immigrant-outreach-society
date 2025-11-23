// app/psychosocial-intervention/page.tsx
import DischargeSummaryForm from "@/components/features/Medical/DischargeSummaryForm";
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
        <DischargeSummaryForm />  
      </Suspense>
    </>
  );
}