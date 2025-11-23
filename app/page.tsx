"use client";
import { Button } from "@/components/ui/Button/Button";
import { useTranslatedText } from "@/domain/translation/presentation/getTranslatedText";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const translatedText = useTranslatedText();
  
  const handleSignIn = () => {
    router.push("/register");
  };  

  return (
    <div className="flex bg-white  items-center justify-center w-full px-4">
      <div className="min-h-screen flex flex-col items-center justify-center lg:px-6 md:px-4 px-2">
        <div className="w-full flex flex-col items-center text-center">
          <div className="w-[390px] h-[247px] mb-6 flex items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/assets/canada.svg"
              alt="canada"
              width={390}
              height={247}
              className="object-contain w-full h-auto"
              priority 
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[30px] text-[#555555] font-[600] mb-1.5">
              {translatedText?.welcomeTitle ?? "Welcome to Habari Pharmacy"}
            </h1>
            <p className="text-[#555555] font-[400] text-[14px] lg:w-[789px]">
              {translatedText?.welcomeDescription ??
                "Simplify the prescription process with a seamless digital system. With a few clicks, prescriptions are sent, filled, and delivered, making treatment faster and easier for everyone."}
            </p>
          </div>
          <div className="flex w-full flex-col text-center items-center justify-center gap-4.5">
            <Button
              variant="outline"
              onClick={handleSignIn}
              className="text-[#1E1E1E] border-[#2463EB] border-[1px]"
            >
              <span className="font-[600] text-[16px]">
                {translatedText?.signIn ?? "Sign In"}
              </span>
            </Button>           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
