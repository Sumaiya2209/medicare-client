"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserStatus } from "@/lib/api/admin";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
      toast.success("User deleted!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          (u.id === id || u._id === id) ? { ...u, status: newStatus } : u
        )
      );
      toast.success(`User ${newStatus}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading users...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Users</h1>
      <p className="text-gray-500 mb-6">{users.length} total users</p>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id || user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${user.role === "admin" ? "bg-purple-100 text-purple-700"
                    : user.role === "doctor" ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${user.status === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"}`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusToggle(user.id || user._id, user.status)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium
                        ${user.status === "suspended"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                    >
                      {user.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id || user._id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}