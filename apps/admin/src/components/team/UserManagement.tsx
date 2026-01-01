'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Mail,
  Phone,
  Shield,
  MoreVertical,
  X,
  AlertTriangle
} from 'lucide-react';

// Types
interface Role {
  _id: string;
  name: string;
  displayName: string;
  userType: 'admin' | 'client';
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  userType: 'admin' | 'client';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  clientId?: string;
  createdAt: string;
}

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId: string;
  userType: 'admin' | 'client';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  clientId?: string;
}

// Mock data
const mockRoles: Role[] = [
  { _id: '1', name: 'super_admin', displayName: 'Super Administrator', userType: 'admin' },
  { _id: '2', name: 'admin', displayName: 'Administrator', userType: 'admin' },
  { _id: '3', name: 'operations_manager', displayName: 'Operations Manager', userType: 'admin' },
  { _id: '4', name: 'client_user', displayName: 'Client User', userType: 'client' }
];

const mockUsers: User[] = [
  {
    _id: '1',
    email: 'admin@ceyloncargo.lk',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+94 77 123 4567',
    role: mockRoles[0],
    userType: 'admin',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2024-11-28T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    email: 'john@ceyloncargo.lk',
    firstName: 'John',
    lastName: 'Manager',
    phone: '+94 77 234 5678',
    role: mockRoles[2],
    userType: 'admin',
    status: 'active',
    emailVerified: true,
    phoneVerified: false,
    lastLogin: '2024-11-27T15:45:00Z',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: '3',
    email: 'sarah@acmecorp.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    phone: '+44 20 7946 0958',
    role: mockRoles[3],
    userType: 'client',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2024-11-28T09:00:00Z',
    clientId: 'CLT-002',
    createdAt: '2024-06-01T00:00:00Z'
  },
  {
    _id: '4',
    email: 'mike@techimport.sg',
    firstName: 'Michael',
    lastName: 'Wong',
    phone: '+65 6789 4561',
    role: mockRoles[3],
    userType: 'client',
    status: 'inactive',
    emailVerified: true,
    phoneVerified: false,
    clientId: 'CLT-003',
    createdAt: '2024-08-20T00:00:00Z'
  },
  {
    _id: '5',
    email: 'pending@example.com',
    firstName: 'New',
    lastName: 'User',
    role: mockRoles[3],
    userType: 'client',
    status: 'pending',
    emailVerified: false,
    phoneVerified: false,
    clientId: 'CLT-004',
    createdAt: '2024-11-25T00:00:00Z'
  }
];

// Status Badge Component
const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    suspended: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Avatar Component
const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const bgColor = user.userType === 'admin' ? 'bg-purple-500' : 'bg-orange-500';

  return (
    <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
      {initials}
    </div>
  );
};

// User Form Modal Component
const UserFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: UserFormData) => void;
  user?: User;
  roles: Role[];
}> = ({ isOpen, onClose, onSave, user, roles }) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    roleId: user?.role._id || '',
    userType: user?.userType || 'admin',
    status: user?.status || 'active',
    clientId: user?.clientId || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    if (formData.userType === 'client' && !formData.clientId?.trim()) {
      newErrors.clientId = 'Client ID is required for client users';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  // Filter roles by user type
  const availableRoles = roles.filter(r => r.userType === formData.userType);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user ? 'Edit User' : 'Add New User'}
                </h3>
                <p className="text-sm text-gray-500">
                  {user ? 'Update user information and permissions' : 'Create a new user account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="admin"
                      checked={formData.userType === 'admin'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, userType: 'admin', roleId: '', clientId: '' }));
                      }}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Admin User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="client"
                      checked={formData.userType === 'client'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, userType: 'client', roleId: '' }));
                      }}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Client User</span>
                  </label>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                    disabled={!!user}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.roleId
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                >
                  <option value="">Select a role</option>
                  {availableRoles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.displayName}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
                )}
              </div>

              {/* Client ID (only for client users) */}
              {formData.userType === 'client' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    placeholder="CLT-001"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.clientId
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                  />
                  {errors.clientId && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
                  )}
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {user ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}> = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the user <span className="font-semibold">{userName}</span>?
            All associated data will be permanently removed.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | User['status']>('all');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'client'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesType = filterType === 'all' || user.userType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.userType === 'admin').length;
  const clientUsers = users.filter(u => u.userType === 'client').length;

  // Handlers
  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (formData: UserFormData) => {
    const selectedRole = mockRoles.find(r => r._id === formData.roleId);
    if (!selectedRole) return;

    if (selectedUser) {
      // Update existing user
      setUsers(prev =>
        prev.map(u =>
          u._id === selectedUser._id
            ? {
                ...u,
                ...formData,
                role: selectedRole,
              }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        _id: String(Date.now()),
        ...formData,
        role: selectedRole,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
      setIsDeleteModalOpen(false);
      setUserToDelete(undefined);
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Admin Users</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{adminUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Client Users</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{clientUsers}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Users</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{user.role.displayName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.userType === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {user.userType === 'admin' ? 'Admin' : 'Client'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatLastLogin(user.lastLogin)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={selectedUser}
        roles={mockRoles}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
      />
    </div>
  );
}
