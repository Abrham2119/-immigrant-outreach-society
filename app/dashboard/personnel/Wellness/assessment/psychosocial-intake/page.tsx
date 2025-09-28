// app/psychosocial-intake/page.tsx
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
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading Psychosocial Intake Assessment...</div>}>
        <div className="min-h-screen bg-gray-50 py-8">
          <PsychosocialIntakeForm />
        </div>
      </Suspense>
    </>
  );
}