interface PageProps {
  params: Promise<{ workflowId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  return <div>Workflow ID: {workflowId}</div>;
};

export default page;
