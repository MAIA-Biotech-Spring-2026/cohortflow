"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      aria-label="Sign out of your account"
    >
      <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
      Sign Out
    </Button>
  );
}
