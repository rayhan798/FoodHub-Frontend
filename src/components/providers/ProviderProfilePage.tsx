"use client";
import { useState, useEffect, useCallback, use } from "react";
import MealCard from "@/components/meal/MealCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Phone, Info, Loader2, AlertCircle,
  ArrowLeft, Edit3, CheckCircle2, Save, X
} from "lucide-react";
// import { env } from "@/env";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/context";
import { toast } from "react-hot-toast";

interface ProviderData {
  id: string;
  userId: string;
  restaurantName: string;
  address?: string;
  phone?: string;
  description?: string;
  user?: { image?: string; status: string };
  meals?: any[];
}

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { user: authUser } = useAuth();

  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ address: "", phone: "", description: "" });
  const [updating, setUpdating] = useState(false);

  const API_BASE = "/api/providers";

  const fetchProviderProfile = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      const res = await fetch(`${API_BASE}/${id}?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Kitchen not found");
      const result = await res.json();
      setProvider(result.data);
      
      setEditData({
        address: result.data.address || "",
        phone: result.data.phone || "",
        description: result.data.description || ""
      });
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load kitchen profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProviderProfile();
  }, [fetchProviderProfile]);

  const isOwner = provider?.userId === authUser?.id;

  const handleUpdateProfile = async () => {
    if (!editData.address.trim()) return toast.error("Address is required");
    if (!editData.phone.trim()) return toast.error("Phone number is required");

    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify(editData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setProvider(prev => prev ? { ...prev, ...editData } : null);
      } else {
        if (res.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        } else {
          throw new Error(result.message || "Update failed.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
      console.error("Update Error:", err);
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      <p className="text-slate-500 font-medium">Opening kitchen gates...</p>
    </div>
  );

  if (!provider) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-400 italic">Kitchen not found!</h2>
      <Button asChild className="mt-4 bg-orange-600 rounded-xl">
        <Link href="/meals">Back to Meals</Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat" />
        <Button asChild variant="secondary" className="absolute top-6 left-6 z-20 rounded-full shadow-lg">
          <Link href="/meals"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20 max-w-6xl">
        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
            <Avatar className="h-44 w-44 border-[10px] border-white shadow-2xl shrink-0">
              <AvatarImage src={provider.user?.image} className="object-cover" />
              <AvatarFallback className="bg-orange-100 text-orange-600 text-5xl font-black">
                {provider.restaurantName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-5">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {provider.restaurantName}
                  </h1>
                  <Badge className="bg-green-500/10 text-green-600 border-none px-4 py-1 mx-auto md:mx-0 font-bold flex items-center gap-1.5 w-fit">
                    <CheckCircle2 size={14} /> Verified Kitchen
                  </Badge>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                  {isOwner && (
                    <Button 
                      onClick={() => setIsEditing(!isEditing)} 
                      variant={isEditing ? "destructive" : "outline"} 
                      className="rounded-full h-9 font-bold px-6"
                    >
                      {isEditing ? (
                        <><X className="h-4 w-4 mr-2"/> Cancel</>
                      ) : (
                        <><Edit3 className="h-4 w-4 mr-2"/> Update Contact Info</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Editable/Info Section */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                {isEditing ? (
                  <div className="w-full max-w-2xl grid gap-5 bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 shadow-inner">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Kitchen Address</label>
                        <Input 
                          placeholder="Full address" 
                          value={editData.address} 
                          onChange={(e)=>setEditData({...editData, address: e.target.value})} 
                          className="bg-white rounded-xl h-12 border-orange-100 focus:ring-orange-500" 
                          disabled={updating}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Contact Number</label>
                        <Input 
                          placeholder="Phone number" 
                          value={editData.phone} 
                          onChange={(e)=>setEditData({...editData, phone: e.target.value})} 
                          className="bg-white rounded-xl h-12 border-orange-100 focus:ring-orange-500" 
                          disabled={updating}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Kitchen Description</label>
                        <Textarea 
                          placeholder="Tell us about your kitchen specialty..." 
                          value={editData.description} 
                          onChange={(e)=>setEditData({...editData, description: e.target.value})} 
                          className="bg-white rounded-xl resize-none h-28 border-orange-100 focus:ring-orange-500" 
                          disabled={updating}
                        />
                    </div>
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={updating} 
                      className="bg-orange-600 coursor-pointer hover:bg-orange-700 rounded-2xl font-black h-14 shadow-lg shadow-orange-200 transition-all active:scale-95"
                    >
                      {updating ? (
                        <><Loader2 className="animate-spin mr-2 h-5 w-5"/> Updating Profile...</>
                      ) : (
                        <><Save className="mr-2 h-5 w-5 coursor-pointer"/> Save Profile Changes</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 bg-slate-100 px-6 py-3 rounded-2xl font-bold text-slate-700 border border-slate-200">
                      <MapPin className="h-5 w-5 text-orange-500" /> {provider.address || "Location not set"}
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-2xl font-bold text-blue-700 border border-blue-100">
                      <Phone className="h-5 w-5 text-blue-500" /> {provider.phone || "No contact info"}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="menu" className="mt-4">
            <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] h-16 w-full md:w-[400px] grid grid-cols-2 mb-12">
              <TabsTrigger value="menu" className="font-black rounded-xl text-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 uppercase">Meals</TabsTrigger>
              <TabsTrigger value="info" className="font-black rounded-xl text-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 uppercase">About</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {provider.meals && provider.meals.length > 0 ? (
                    provider.meals.map((meal: any) => (
                        <MealCard key={meal.id} meal={{...meal, provider: {name: provider.restaurantName, id: provider.id}}} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                        No meals available at the moment.
                    </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="info" className="outline-none">
               <div className="max-w-3xl bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
                    <Info className="text-orange-600" /> Kitchen Story
                  </h3>
                  <p className="text-slate-600 text-xl leading-relaxed italic pl-8 border-l-4 border-orange-200 whitespace-pre-wrap">
                    {provider.description || "Welcome to our kitchen! We provide fresh, homemade, and hygienic food to our community."}
                  </p>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}