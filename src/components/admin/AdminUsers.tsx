"use client";

import { useUsers } from "../../hooks/useAdminUsers";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MoreHorizontal, Search, UserX, ShieldCheck, Mail, Filter, Loader2, UserCheck
} from "lucide-react";

export default function AdminUsersPage() {
  const { 
    loading, 
    searchTerm, 
    setSearchTerm, 
    updatingId, 
    filteredUsers, 
    toggleUserStatus 
  } = useUsers();

  if (loading) return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Monitor and manage all platform participants.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl focus-visible:ring-orange-500 border-slate-200"
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6 py-4 text-slate-700 font-semibold">User</TableHead>
              <TableHead className="text-slate-700 font-semibold">Role</TableHead>
              <TableHead className="text-slate-700 font-semibold">Joined Date</TableHead>
              <TableHead className="text-slate-700 font-semibold">Status</TableHead>
              <TableHead className="text-right pr-6 text-slate-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400">
                  No users found in database.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                        <AvatarImage src={user.image} className="object-cover" alt={user.name} />
                        <AvatarFallback className="bg-orange-50 text-orange-700 font-bold">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-none mb-1">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={`rounded-lg font-medium px-2 py-0.5 ${
                      user.role === 'ADMIN' ? 'border-purple-200 text-purple-700 bg-purple-50' : 
                      user.role === 'PROVIDER' ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-blue-200 text-blue-700 bg-blue-50'
                    }`}>
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: '2-digit', year: 'numeric'
                    })}
                  </TableCell>

                  <TableCell>
                    <Badge className={`${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    } border-none px-3 py-0.5 rounded-full text-[11px] font-bold uppercase`}>
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                          {updatingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                          ) : (
                            <MoreHorizontal className="h-5 w-5 text-slate-500" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-52 shadow-xl p-2">
                        <DropdownMenuLabel className="text-xs text-slate-500 px-2 py-1.5 font-bold uppercase">Options</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg py-2">
                          <Mail className="h-4 w-4" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg py-2">
                          <ShieldCheck className="h-4 w-4" /> Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem 
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`gap-2 cursor-pointer rounded-lg py-2 font-medium ${
                            user.status === 'ACTIVE' ? 'text-red-600 focus:text-red-600 focus:bg-red-50' : 'text-green-600 focus:text-green-600 focus:bg-green-50'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? (
                            <><UserX className="h-4 w-4" /> Suspend User</>
                          ) : (
                            <><UserCheck className="h-4 w-4" /> Unsuspend User</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}