// // app/general-referral-form/page.tsx
// import GeneralReferralForm from "@/components/features/Referral/GeneralReferralForm";
// import { Suspense } from "react";
// import { ToastContainer } from "react-toastify";

// export default function GeneralReferralFormPage() {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={6000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <Suspense fallback={<div>Loading...</div>}>
//         <div className="min-h-screen py-6 px-6 md:px-8 lg:p-12">
//           <GeneralReferralForm />
//         </div>
//       </Suspense>
//     </>
//   );
// }