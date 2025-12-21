"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function TestAiButton() {
  const trpc = useTRPC();
  const [result, setResult] = useState<any>(null);
  const mutation = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: (data) => {
        setResult(data);
        toast.success("AI job queued successfully");
      },
      onError: (error) => {
        toast.error("Failed to queue AI job");
      },
    })
  );

  console.log(result);

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
        <Button
          variant="ghost"
          onClick={async () =>
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/login";
                },
              },
            })
          }
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
