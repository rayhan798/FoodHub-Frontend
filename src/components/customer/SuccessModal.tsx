"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SuccessModal() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push("/orders"); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center py-10 rounded-3xl">
        <DialogHeader>
          <div className="mx-auto bg-green-50 h-20 w-20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Order Successful!
          </DialogTitle>
        </DialogHeader>
        <p className="text-slate-500 mb-6">
          Your delicious meal is being prepared. You can track your order status from the dashboard.
        </p>
        <Button 
          onClick={handleClose}
          className="bg-orange-600 hover:bg-orange-700 w-full rounded-xl py-6 font-bold"
        >
          View My Orders
        </Button>
      </DialogContent>
    </Dialog>
  );
}