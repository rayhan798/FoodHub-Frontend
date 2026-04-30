import MealDetailsPage from "@/components/meal/MealDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <main className="min-h-screen bg-white">
      <MealDetailsPage id={id} />
    </main>
  );
}