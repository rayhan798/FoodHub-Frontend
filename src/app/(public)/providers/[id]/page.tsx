import ProviderProfilePage from "@/components/providers/ProviderProfilePage";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProviderDetails({ params }: Props) {

  return <ProviderProfilePage params={params} />;
}