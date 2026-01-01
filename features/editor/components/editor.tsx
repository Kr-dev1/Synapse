"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { EditorBreadCrumbs, EditorSaveButton } from "./editor-header";
import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { nodeComponents } from "@/config/node-components";
import { NodeType } from "@/app/generated/prisma";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { AddNodeButton } from "./add-node-button";

//xy-flowstyles
import "@xyflow/react/dist/style.css";
import { ExecuteWorkFlowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor" />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex h-8 items-center justify-between px-6 bg-background">
        <EditorBreadCrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </header>
      <div className="size-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeComponents}
          fitView
          proOptions={{ hideAttribution: true }}
          onInit={setEditor}
          snapGrid={[10, 10]}
          snapToGrid
          panOnScroll
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right">
            <AddNodeButton />
          </Panel>
          {hasManualTrigger && (
            <Panel position="bottom-center">
              <ExecuteWorkFlowButton workflowId={workflowId} />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};
