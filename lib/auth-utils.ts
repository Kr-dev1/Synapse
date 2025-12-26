import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { headers } from "next/headers";

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export const requireAuth = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await getSession();

  if (session) {
    redirect("/workflows");
  }
};
