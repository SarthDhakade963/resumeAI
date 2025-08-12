"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // or use <button> directly
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./Loading";
import { LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated" && pathname !== "/check-profile") {
      router.push("/check-profile");
    }
  }, [status, pathname, router]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <div>
        {/* Welcome content */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <div className="space-y-2">
            <p className="text-gray-600 text-lg">Hello there,</p>
            <p className="text-2xl font-semibold text-gray-800">
              {session.user?.name}
            </p>
          </div>

          <p className="text-gray-500 text-sm">
            We&apos;re glad to see you again!
          </p>
        </div>

        {/* Sign out button */}
        <Button
          onClick={() => signOut()}
          className="w-full bg-gradient-to-r from-gray-500 to-black hover:from-gray-600 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          Sign Out
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-7">
        <p className="text-gray-500">Sign in with </p>
        <div className="flex items-center justify-center gap-4">
          <div>
            <Button
              onClick={() => signIn("google")}
              className="w-12 h-12 p-0 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full shadow hover:shadow-md transition hover:bg-gray-300 hover:pointer"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
            </Button>
          </div>

          <div>
            <Button
              onClick={() => signIn("github")}
              className="w-12 h-12 p-0 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full shadow hover:shadow-md transition hover:bg-gray-300"
            >
              <Image
                src="/github-sign.png"
                alt="Google"
                width={23}
                height={23}
              />
            </Button>
          </div>

          <div>
            <Button
              onClick={() => signIn("linkedin")}
              className="w-12 h-12 p-0 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full shadow hover:shadow-md transition hover:bg-gray-300"
            >
              <Image src="/linkedin.png" alt="Google" width={25} height={25} />
            </Button>
          </div>
        </div>

        <div className="flex items-center w-full max-w-xs">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <Button
          className="px-2 py-1 w-full max-w-xs  text-white rounded-md hover:bg-gray-400 transition"
          onClick={() => setShow(true)}
        >
          Login with Email
        </Button>

        {show && <AuthForm onClose={() => setShow(false)} />}
      </div>
    );
  }
}
