import ProviderSidebar from "@/components/provider/ProviderSidebar";
import ProviderHeader from "@/components/provider/ProviderHeader";
import { AuthProvider } from "@/features/auth/context"; 

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block">
          <ProviderSidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Header */}
          <ProviderHeader />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}