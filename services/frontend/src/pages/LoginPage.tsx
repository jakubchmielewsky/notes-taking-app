import LogoIcon from "@/assets/logo.svg?react";
import GoogleIcon from "@/assets/icons/icon-google.svg?react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-200 py-100 dark:bg-neutral-700">
      <div className="container max-w-135 tablet:px-600 flex flex-col gap-200 bg-neutral-0 border border-neutral-200 px-200 py-600 rounded-12 dark:bg-neutral-950 dark:border-neutral-700">
        <div>
          <LogoIcon className="m-auto dark:text-white" />
        </div>

        <div className="text-center flex flex-col gap-100">
          <h1 className="text-[20px] font-bold text-neutral-950 dark:text-white">
            Welcome to Notes
          </h1>
          <p className="text-[14px] text-neutral-600 dark:text-neutral-300">
            Please log in to continue
          </p>
        </div>

        <div className="flex flex-col gap-200 pt-300 text-center border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => (window.location.href = "/api/v1/auth/oauth/google")}
            className="flex justify-center items-center gap-200 border border-neutral-300 py-150 rounded-12 text-[16px] font-medium hover:bg-neutral-50 dark:text-white dark:border-neutral-600 hover:dark:bg-neutral-700"
          >
            <GoogleIcon className="w-[24px] h-[24px]" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
