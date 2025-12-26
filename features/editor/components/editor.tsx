"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { EditorBreadCrumbs, EditorSaveButton } from "./editor-header";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor" />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex h-8 items-center justify-between px-6 bg-background">
        <EditorBreadCrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </header>
      <div className="flex-1 p-6">
        <pre>{JSON.stringify(workflow, null, 2)}</pre>
      </div>
    </div>
  );
};
