"use client";

import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoggedInView from "@/components/LoggedInView";
import LoggedOutView from "@/components/LoggedOutView";

export default function Home() {
  const isLogin = useAuthStatus();

  if (isLogin === null) {
    return null; // or <LoadingSpinner /> if you want feedback
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLogin ? <LoggedInView /> : <LoggedOutView />}
    </div>
  );
}
