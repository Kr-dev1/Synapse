("");

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

export const AddNodeButton = memo(() => {
  return (
    <Button onClick={() => {}} size="icon">
      <PlusIcon />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
