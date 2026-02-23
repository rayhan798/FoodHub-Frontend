import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { User, UserStatus } from "../types/adminUsers";
import { userService } from "../services/adminUsers.service";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await userService.getAll();
      setUsers(result.success ? (result.data || []) : []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      setUpdatingId(userId);
      const result = await userService.updateStatus(userId, newStatus);
      if (result.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
        toast.success(result.message || `User is now ${newStatus}`);
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchStr) ||
        user.email?.toLowerCase().includes(searchStr) ||
        user.role?.toLowerCase().includes(searchStr)
      );
    });
  }, [users, searchTerm]);

  useEffect(() => { fetchUsers(); }, []);

  return { users, loading, searchTerm, setSearchTerm, updatingId, filteredUsers, toggleUserStatus };
}