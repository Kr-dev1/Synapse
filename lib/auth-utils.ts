import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";

export const requireAuth = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await auth();

  if (session) {
    redirect("/");
  }
};
