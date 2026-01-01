import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkFlowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button size="lg" onClick={handleExecuteWorkflow} disabled={false}>
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
