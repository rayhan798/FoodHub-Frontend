import ProviderProfilePage from "@/components/providers/ProviderProfilePage";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProviderProfileInternalPage({ params }: Props) {

  return (
    <div className="space-y-6">
       <div className="px-2">
         <h1 className="text-2xl font-bold text-slate-900">My Kitchen Profile</h1>
         <p className="text-sm text-slate-500">View and manage your public kitchen profile</p>
       </div>
       
       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <ProviderProfilePage params={params} />
       </div>
    </div>
  );
}