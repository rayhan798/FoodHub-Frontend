import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApprovalStatus, ProviderDetail } from "../types/adminApprove";

export function useProviderApproval() {
  const params = useParams();
  const router = useRouter();
  
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [params.id]);

  const handleStatusUpdate = async (newStatus: ApprovalStatus) => {
    try {
      setSubmitting(true);

      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/admin/providers/approve/${params.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(`Provider has been ${newStatus.toLowerCase()}!`);
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error: unknown) {
      toast.error("Connection error. Is backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    params,
    loading,
    submitting,
    handleStatusUpdate,
  };
}