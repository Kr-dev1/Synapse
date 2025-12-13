import { requireAuth } from "@/lib/auth-utils";
import TestAiButton from "./TestAiButton";

export default async function Page() {
  await requireAuth();

  return (
    <div>
      <TestAiButton />
    </div>
  );
}
