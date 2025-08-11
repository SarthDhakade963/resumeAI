"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // or use <button> directly
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // if already logged in, check backend for profile status
    if (status === "authenticated") {
      // we will call backend to check profile (using fetchWithToken from client)
      router.push("/check-profile"); // leight weight page that resolves profile check
    }
  }, [status, router]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p>Welcome</p>
        <p>{session.user?.name}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
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
          Login
        </Button>

        {show && <AuthForm onClose={() => setShow(false)} />}
      </div>
    );
  }
}
