'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Mail, Calendar, Shield, Search, Download } from 'lucide-react';

type UserProfile = {
  user_id: string;
  full_name: string;
  student_id: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  profile_completed: boolean;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin'>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.student_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Student ID', 'Email', 'Phone', 'Gender', 'Role', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.full_name,
        user.student_id,
        user.email,
        user.phone || '',
        user.gender,
        user.role,
        new Date(user.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    completed: users.filter(u => u.profile_completed).length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-neutral-900 mb-2 sm:mb-3">
          User Management
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 font-light">
          View and manage all registered users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider">Total Users</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extralight text-neutral-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-50 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider">Students</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extralight text-neutral-900">{stats.students}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-50 flex items-center justify-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider">Admins</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extralight text-neutral-900">{stats.admins}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-wider">Completed</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extralight text-neutral-900">{stats.completed}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-100">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors font-light"
              />
            </div>
          </div>

          {/* Filter and Export */}
          <div className="flex gap-2 sm:gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors font-light bg-white"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>

            <button
              onClick={exportToCSV}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-neutral-200 border-t-neutral-900"></div>
            <p className="mt-4 text-sm sm:text-base text-neutral-500 font-light">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-neutral-500 font-light">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{user.full_name || 'No name'}</p>
                            <p className="text-sm text-neutral-500 font-light">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-neutral-600">
                          {user.student_id || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-neutral-900 font-light">{user.phone || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 capitalize">
                          {user.gender || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' && <Shield className="h-3 w-3" />}
                          {user.role || 'student'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          user.profile_completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.profile_completed ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 font-light">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-neutral-100">
              {filteredUsers.map((user) => (
                <div key={user.user_id} className="p-4 sm:p-6 hover:bg-neutral-50 transition-colors">
                  {/* User Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 mb-1">{user.full_name || 'No name'}</p>
                      <p className="text-sm text-neutral-500 font-light truncate">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' && <Shield className="h-3 w-3" />}
                        {user.role || 'student'}
                      </span>
                    </div>
                  </div>

                  {/* User Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Student ID</p>
                      <p className="font-mono text-neutral-900">{user.student_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-neutral-900 font-light">{user.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Gender</p>
                      <p className="text-neutral-900 capitalize">{user.gender || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.profile_completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.profile_completed ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Joined</p>
                      <p className="text-neutral-900 font-light">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-xs sm:text-sm text-neutral-500 font-light text-center">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      )}
    </div>
  );
}
