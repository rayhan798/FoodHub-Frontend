// app/customer/providers/[id]/page.tsx
import ProviderProfilePage from "@/components/providers/ProviderProfilePage";

// Next.js 15+ এ params একটি Promise টাইপ হয়
type Props = {
  params: Promise<{ id: string }>;
};

export default function ProviderDetails({ params }: Props) {
  // সরাসরি params পাস করুন, ভেতরে ProviderProfilePage 'use(params)' দিয়ে এটি রিজলভ করবে
  return <ProviderProfilePage params={params} />;
}