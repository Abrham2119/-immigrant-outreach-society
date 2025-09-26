// app/psychosocial-intervention/page.tsx
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
        <PsychosocialInterventionForm />  
      </Suspense>
    </>
  );
}