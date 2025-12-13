import GithubButton from "@/features/auth/components/GithubButton";
import GoogleButton from "@/features/auth/components/GoogleButton";
import LoginPage from "@/features/auth/components/LoginPage";
import { requireUnAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireUnAuth();
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
