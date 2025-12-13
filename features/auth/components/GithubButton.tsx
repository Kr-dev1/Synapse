import { signIn } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

const GithubButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <Button
        className="w-full justify-start gap-3"
        variant="outline"
        type="submit"
        aria-label="Sign in with GitHub"
      >
        <GithubIcon />
        Sign in with GitHub
      </Button>
    </form>
  );
};

export default GithubButton;
