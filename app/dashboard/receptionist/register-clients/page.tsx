import RegistrationFormReceptional from "@/components/features/Registration/RegistrationFormReceptional";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export default function Register() {
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
      <Suspense>
        <RegistrationFormReceptional />  
      </Suspense>
    </>
  );
}