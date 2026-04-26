import MealDetailsPage from "@/components/meal/MealDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // ১. সার্ভার সাইডেই আইডিটি রেজলভ করে নিচ্ছি
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <main className="min-h-screen bg-white">
      {/* ২. সরাসরি id প্রপ হিসেবে পাঠানো হচ্ছে */}
      <MealDetailsPage id={id} />
    </main>
  );
}