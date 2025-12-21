interface PageProps {
  params: Promise<{ credentialId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  return <div>Credential ID: {credentialId}</div>;
};

export default page;
