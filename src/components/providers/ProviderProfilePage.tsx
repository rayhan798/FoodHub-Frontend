"use client";

import { use } from "react";
import Link from "next/link";
import MealCard from "@/components/meal/MealCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/context";
import { useProviderProfile } from "../../hooks/useProviderProfile";
import { 
  MapPin, Phone, Info, Loader2, AlertCircle, 
  ArrowLeft, Edit3, CheckCircle2, Save, X 
} from "lucide-react";

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user: authUser } = useAuth();
  
  const {
    provider, loading, isEditing, setIsEditing,
    editData, setEditData, updating, handleUpdate, isOwner
  } = useProviderProfile(id, authUser);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      <p className="text-slate-500 font-medium">Loading Kitchen...</p>
    </div>
  );

  if (!provider) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold">Kitchen not found!</h2>
      <Button asChild className="mt-6 bg-orange-600 rounded-xl"><Link href="/meals">Back</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat" />
        <Button asChild variant="secondary" className="absolute top-6 left-6 z-20 rounded-full">
          <Link href="/meals"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl">
        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 border-b pb-10">
            <Avatar className="h-44 w-44 border-[10px] border-white shadow-2xl shrink-0">
              <AvatarImage src={provider.user?.image} className="object-cover" />
              <AvatarFallback className="bg-orange-100 text-orange-600 text-5xl font-black">
                {provider.restaurantName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900">{provider.restaurantName}</h1>
                <Badge className="bg-green-500/10 text-green-600 border-none px-4 py-1 mx-auto md:mx-0 font-bold">
                  <CheckCircle2 size={14} className="mr-1" /> Verified Kitchen
                </Badge>
              </div>
              
              {isOwner && (
                <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "outline"} className="rounded-full h-9 font-bold px-6">
                  {isEditing ? <><X className="h-4 w-4 mr-2"/> Cancel</> : <><Edit3 className="h-4 w-4 mr-2"/> Update Profile</>}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              {isEditing ? (
                <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 space-y-4">
                  <Input placeholder="Address" value={editData.address} onChange={(e)=>setEditData({...editData, address: e.target.value})} />
                  <Input placeholder="Phone" value={editData.phone} onChange={(e)=>setEditData({...editData, phone: e.target.value})} />
                  <Textarea placeholder="Description" value={editData.description} onChange={(e)=>setEditData({...editData, description: e.target.value})} />
                  <Button onClick={handleUpdate} disabled={updating} className="w-full bg-orange-600">
                    {updating ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="mr-2 h-4 w-4"/> Save</>}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl font-bold text-slate-700">
                    <MapPin className="text-orange-500" /> {provider.address || "Location not set"}
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl font-bold text-blue-700">
                    <Phone className="text-blue-500" /> {provider.phone || "No contact"}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs content */}
            <div className="lg:col-span-8">
              <Tabs defaultValue="menu">
                <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 w-full md:w-80 grid grid-cols-2 mb-8">
                  <TabsTrigger value="menu" className="rounded-xl font-bold">Meals</TabsTrigger>
                  <TabsTrigger value="info" className="rounded-xl font-bold">About</TabsTrigger>
                </TabsList>

                <TabsContent value="menu">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {provider.meals?.map((meal: any) => (
                      <MealCard key={meal.id} meal={{...meal, provider: {name: provider.restaurantName, id: provider.id}}} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="info">
                   <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <p className="text-slate-600 text-lg italic whitespace-pre-wrap leading-relaxed">
                        {provider.description || "Welcome to our kitchen! We serve fresh, home-cooked meals."}
                      </p>
                   </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}