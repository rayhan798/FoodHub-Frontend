"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAdminOverview } from "../../hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { stats, providers, loading } = useAdminOverview();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Updating Dashboard Statistics...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
          <p className="text-slate-500">System-wide performance and provider management.</p>
        </div>
        <Badge variant="outline" className="text-slate-400 border-slate-200">
          Live Updates Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-xs font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/30 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Pending Provider Approvals</CardTitle>
              <Badge className="bg-orange-100 text-orange-700">
                {providers.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="pl-6">Provider Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.length > 0 ? (
                  providers.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="pl-6 font-medium">{shop.name}</TableCell>
                      <TableCell>{shop.owner}</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-700 uppercase text-[10px]">
                          {shop.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/providers/approve/${shop.id}`}>Review Request</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                      No pending requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <p className="text-sm text-slate-600">{providers.length} new providers awaiting approval.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}