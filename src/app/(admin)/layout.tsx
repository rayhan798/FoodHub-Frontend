import AdminHeader from "@/components/admin/adminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AuthProvider } from "@/features/auth/context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}