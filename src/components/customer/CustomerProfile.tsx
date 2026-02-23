"use client";

import { useRouter } from "next/navigation";
import { env } from "@/env";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { User, Mail, Phone, MapPin, Edit2, Loader2 } from "lucide-react";
import { useProfileData, type EditableProfile } from "@/hooks/useCustomerProfile";

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
  const baseUrl = env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return imagePath.startsWith("uploads/") ? `${baseUrl}/${imagePath}` : `${baseUrl}/uploads/${imagePath}`;
};

export default function ProfilePage() {
  const { user, isLoading, profile, triggerRefresh, storageKey } = useProfileData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 rounded-3xl overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600" />
          <CardContent className="relative pt-0 flex flex-col items-center">
            <div className="-mt-16">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={getImageUrl(profile.image)} className="object-cover" />
                <AvatarFallback className="text-2xl bg-orange-100 text-orange-700 font-bold uppercase">
                  {profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>

            <div className="mt-4">
              <EditProfileDialog
                profile={profile}
                onSave={triggerRefresh}
                storageKey={storageKey}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <InfoItem icon={<User size={20} />} label="Full Name" value={profile.name} />
          <MailInfoItem icon={<Mail size={20} />} label="Email" value={user.email} />
          <InfoItem icon={<Phone size={20} />} label="Phone" value={profile.phone || "Not set"} />
          <InfoItem icon={<MapPin size={20} />} label="Address" value={profile.address || "Not set"} />
        </div>
      </div>
    </div>
  );
}

// Sub-components
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="rounded-2xl border-slate-100">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
          {icon}
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
          <p className="font-semibold text-slate-700">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Reusing same UI for Mail
const MailInfoItem = InfoItem;

function EditProfileDialog({
  profile,
  onSave,
  storageKey,
}: {
  profile: EditableProfile;
  onSave: () => void;
  storageKey: string;
}) {
  const [form, setForm] = useState(profile);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(form));
    onSave();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) setForm(profile);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full gap-2 border-slate-200">
          <Edit2 className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. +88017XXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="City, Area, House No."
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Image</Label>
            <Input
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({ ...form, image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 w-full rounded-xl">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}