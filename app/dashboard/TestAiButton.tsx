"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function TestAiButton() {
  const trpc = useTRPC();
  const [result, setResult] = useState<any>(null);
  const mutation = useMutation(trpc.testAI.mutationOptions({
    onSuccess: (data) => setResult(data),
  } as any));

  return (
    <div className="space-y-3">
      <div>{JSON.stringify(result)}</div>
      <div className="flex gap-2">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          type="button"
        >
          Test Ai
        </Button>
        <Button variant="ghost" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
