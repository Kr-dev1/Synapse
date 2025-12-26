"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export default function page() {
  const trpc = useTRPC();

  return <Button>Click to test Subscription</Button>;
}
