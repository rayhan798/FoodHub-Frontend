"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle, XCircle, Store, User } from "lucide-react";
import Link from "next/link";

// টাইপ ডিফিনিশন
interface ProviderDetail {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  status: string;
}

export default function ProviderApprovePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ১. প্রোভাইডারের ডিটেইলস ফেচ করা (ঐচ্ছিক, যদি আপনি ডিটেইলস দেখাতে চান)
  // আপাতত আমরা শুধু আইডি দিয়ে কাজ করছি
  useEffect(() => {
    // এখানে আপনি চাইলে একটি GET রিকোয়েস্ট পাঠিয়ে ডাটা আনতে পারেন
    // আপাতত আমরা জাস্ট আইডিটি সেট করছি টেস্ট করার জন্য
    setLoading(false);
  }, [params.id]);

  // ২. এপ্রুভ বা রিজেক্ট করার ফাংশন
  const handleStatusUpdate = async (newStatus: "APPROVED" | "REJECTED") => {
    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/admin/providers/approve/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Provider has been ${newStatus.toLowerCase()}!`);
        router.push("/admin"); // কাজ শেষ হলে ড্যাশবোর্ডে ফেরত যাবে
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex justify-between items-center">
            <CardTitle>Review Provider Request</CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              PENDING REVIEW
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Store className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Request ID</p>
                <p className="font-mono text-sm">{params.id}</p>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-lg">
              <p className="text-sm text-slate-600 mb-4">
                By approving this provider, they will be able to list meals, manage orders, and receive payments on the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={() => handleStatusUpdate("REJECTED")} 
              variant="destructive" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Reject Provider
            </Button>
            
            <Button 
              onClick={() => handleStatusUpdate("APPROVED")} 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve Provider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}