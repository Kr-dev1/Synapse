"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

const GithubButton = () => {
  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Button
      className="w-full justify-start gap-3"
      variant="outline"
      onClick={handleSignIn}
      aria-label="Sign in with GitHub"
    >
      <GithubIcon />
      Sign in with GitHub
    </Button>
  );
};

export default GithubButton;
