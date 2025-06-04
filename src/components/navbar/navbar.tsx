"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/navbar/ModeToggle";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isLogin = useAuthStatus();

  const handleLogout = () => {
    localStorage.clear();
    toast.warning("Successfully logged out.");
    window.dispatchEvent(new Event("localStorageChange"));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-background/90 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className={cn(
            "text-xl font-bold tracking-wide",
            "transition-all duration-200 hover:text-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          )}
        >
          <span className="text-primary">Your Logo/Title</span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {isLogin && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className={cn(
                "font-medium text-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400",
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              )}
            >
              Sign out
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
