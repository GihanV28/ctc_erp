'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Users,
  Lock,
  Settings,
  AlertTriangle
} from 'lucide-react';

// Types
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  userType: 'admin' | 'client';
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface RoleFormData {
  name: string;
  displayName: string;
  description: string;
  userType: 'admin' | 'client';
  permissions: string[];
}

// Permission categories with their permissions
const permissionCategories: { category: string; permissions: Permission[] }[] = [
  {
    category: 'Users',
    permissions: [
      { id: 'users:read', name: 'View Users', description: 'Can view user list and details', category: 'Users' },
      { id: 'users:write', name: 'Manage Users', description: 'Can create, update, delete users', category: 'Users' },
      { id: 'users:permissions', name: 'Manage User Permissions', description: 'Can override user permissions', category: 'Users' },
    ]
  },
  {
    category: 'Roles',
    permissions: [
      { id: 'roles:read', name: 'View Roles', description: 'Can view roles and permissions', category: 'Roles' },
      { id: 'roles:write', name: 'Manage Roles', description: 'Can create, update, delete roles', category: 'Roles' },
    ]
  },
  {
    category: 'Shipments',
    permissions: [
      { id: 'shipments:read', name: 'View Shipments', description: 'Can view all shipments', category: 'Shipments' },
      { id: 'shipments:write', name: 'Manage Shipments', description: 'Can create, update, delete shipments', category: 'Shipments' },
      { id: 'shipments:read:own', name: 'View Own Shipments', description: 'Can view own shipments only', category: 'Shipments' },
    ]
  },
  {
    category: 'Containers',
    permissions: [
      { id: 'containers:read', name: 'View Containers', description: 'Can view container fleet', category: 'Containers' },
      { id: 'containers:write', name: 'Manage Containers', description: 'Can add, update, remove containers', category: 'Containers' },
    ]
  },
  {
    category: 'Clients',
    permissions: [
      { id: 'clients:read', name: 'View Clients', description: 'Can view client list and details', category: 'Clients' },
      { id: 'clients:write', name: 'Manage Clients', description: 'Can create, update, delete clients', category: 'Clients' },
    ]
  },
  {
    category: 'Suppliers',
    permissions: [
      { id: 'suppliers:read', name: 'View Suppliers', description: 'Can view supplier network', category: 'Suppliers' },
      { id: 'suppliers:write', name: 'Manage Suppliers', description: 'Can add, update, remove suppliers', category: 'Suppliers' },
    ]
  },
  {
    category: 'Tracking',
    permissions: [
      { id: 'tracking:read', name: 'View Tracking', description: 'Can view tracking updates', category: 'Tracking' },
      { id: 'tracking:write', name: 'Update Tracking', description: 'Can add tracking updates', category: 'Tracking' },
      { id: 'tracking:read:own', name: 'View Own Tracking', description: 'Can view tracking for own shipments', category: 'Tracking' },
    ]
  },
  {
    category: 'Reports',
    permissions: [
      { id: 'reports:read', name: 'View Reports', description: 'Can view and download reports', category: 'Reports' },
      { id: 'reports:write', name: 'Generate Reports', description: 'Can generate new reports', category: 'Reports' },
    ]
  },
  {
    category: 'Invoices',
    permissions: [
      { id: 'invoices:read', name: 'View Invoices', description: 'Can view invoices', category: 'Invoices' },
      { id: 'invoices:write', name: 'Manage Invoices', description: 'Can create, update invoices', category: 'Invoices' },
      { id: 'invoices:read:own', name: 'View Own Invoices', description: 'Can view own invoices only', category: 'Invoices' },
    ]
  },
  {
    category: 'Support',
    permissions: [
      { id: 'support:read', name: 'View Tickets', description: 'Can view support tickets', category: 'Support' },
      { id: 'support:write', name: 'Manage Tickets', description: 'Can respond to and manage tickets', category: 'Support' },
      { id: 'support:read:own', name: 'View Own Tickets', description: 'Can view own tickets only', category: 'Support' },
    ]
  },
  {
    category: 'Settings',
    permissions: [
      { id: 'settings:read', name: 'View Settings', description: 'Can view system settings', category: 'Settings' },
      { id: 'settings:write', name: 'Manage Settings', description: 'Can modify system settings', category: 'Settings' },
    ]
  },
  {
    category: 'Profile',
    permissions: [
      { id: 'profile:read', name: 'View Profile', description: 'Can view own profile', category: 'Profile' },
      { id: 'profile:write', name: 'Update Profile', description: 'Can update own profile', category: 'Profile' },
    ]
  },
];

// Mock data for roles
const mockRoles: Role[] = [
  {
    _id: '1',
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    userType: 'admin',
    isSystem: true,
    permissions: ['*'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access for daily operations',
    userType: 'admin',
    isSystem: true,
    permissions: [
      'shipments:read', 'shipments:write',
      'containers:read', 'containers:write',
      'clients:read', 'clients:write',
      'suppliers:read', 'suppliers:write',
      'tracking:read', 'tracking:write',
      'reports:read', 'reports:write',
      'invoices:read', 'invoices:write',
      'support:read', 'support:write'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    name: 'operations_manager',
    displayName: 'Operations Manager',
    description: 'Manages shipments, containers, and tracking',
    userType: 'admin',
    isSystem: true,
    permissions: [
      'shipments:read', 'shipments:write',
      'containers:read', 'containers:write',
      'tracking:read', 'tracking:write',
      'reports:read'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '4',
    name: 'client_user',
    displayName: 'Client User',
    description: 'Client portal access for tracking and invoices',
    userType: 'client',
    isSystem: true,
    permissions: [
      'profile:read', 'profile:write',
      'shipments:read:own',
      'tracking:read:own',
      'invoices:read:own',
      'support:read:own', 'support:write'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Role Card Component
const RoleCard: React.FC<{
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}> = ({ role, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const getPermissionCount = () => {
    if (role.permissions.includes('*')) return 'All';
    return role.permissions.length;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              role.permissions.includes('*')
                ? 'bg-purple-100 text-purple-600'
                : role.userType === 'admin'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600'
            }`}>
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{role.displayName}</h3>
              <p className="text-sm text-gray-500">{role.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {role.isSystem && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                <Lock size={12} />
                System
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              role.userType === 'admin'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {role.userType === 'admin' ? 'Admin' : 'Client'}
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">{role.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Shield size={14} />
              {getPermissionCount()} permissions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {!role.isSystem && (
              <>
                <button
                  onClick={() => onEdit(role)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(role)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            {role.isSystem && (
              <button
                onClick={() => onEdit(role)}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="View permissions"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
          {role.permissions.includes('*') ? (
            <div className="flex items-center gap-2 text-purple-600">
              <Check size={16} />
              <span className="text-sm font-medium">Full Access (All Permissions)</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {role.permissions.map(permission => (
                <span
                  key={permission}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md text-gray-700"
                >
                  {permission}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// The RoleFormModal component will be continued in part 2 due to size
// For now, let's create a simplified version

// Role Form Modal Component
const RoleFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: RoleFormData) => void;
  role?: Role;
}> = ({ isOpen, onClose, onSave, role }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
    userType: role?.userType || 'admin',
    permissions: role?.permissions || []
  });

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<RoleFormData>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        userType: role.userType,
        permissions: role.permissions
      });
    }
  }, [role]);

  if (!isOpen) return null;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const selectAllInCategory = (categoryPerms: Permission[]) => {
    const permIds = categoryPerms.map(p => p.id);
    const allSelected = permIds.every(id => formData.permissions.includes(id));

    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !permIds.includes(p))
        : [...new Set([...prev.permissions, ...permIds])]
    }));
  };

  const validate = () => {
    const newErrors: Partial<RoleFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = ['At least one permission is required'];
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {role ? 'Edit Role' : 'Create New Role'}
                </h3>
                <p className="text-sm text-gray-500">Define role and assign permissions</p>
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
            {/* Basic Information */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name (System) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., operations_manager"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                    disabled={role?.isSystem}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="e.g., Operations Manager"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.displayName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-purple-500'
                    }`}
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the responsibilities and purpose of this role"
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

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
                      onChange={(e) => setFormData(prev => ({ ...prev, userType: 'admin' }))}
                      className="w-4 h-4 text-purple-600"
                      disabled={role?.isSystem}
                    />
                    <span className="text-sm text-gray-700">Admin User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="client"
                      checked={formData.userType === 'client'}
                      onChange={(e) => setFormData(prev => ({ ...prev, userType: 'client' }))}
                      className="w-4 h-4 text-purple-600"
                      disabled={role?.isSystem}
                    />
                    <span className="text-sm text-gray-700">Client User</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Permissions <span className="text-red-500">*</span>
                </h4>
                {errors.permissions && (
                  <p className="text-sm text-red-600">{errors.permissions[0]}</p>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {permissionCategories.map(({ category, permissions }) => {
                  const isExpanded = expandedCategories.includes(category);
                  const categoryPermIds = permissions.map(p => p.id);
                  const allSelected = categoryPermIds.every(id => formData.permissions.includes(id));
                  const someSelected = categoryPermIds.some(id => formData.permissions.includes(id));

                  return (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => selectAllInCategory(permissions)}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span className="font-medium text-gray-900">{category}</span>
                          <span className="text-xs text-gray-500">
                            ({categoryPermIds.filter(id => formData.permissions.includes(id)).length}/{permissions.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-3 bg-white">
                          {permissions.map(permission => (
                            <label
                              key={permission.id}
                              className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="w-4 h-4 text-purple-600 rounded mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                {role ? 'Update Role' : 'Create Role'}
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
  roleName: string;
}> = ({ isOpen, onClose, onConfirm, roleName }) => {
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
              <h3 className="text-lg font-bold text-gray-900">Delete Role</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the role <span className="font-semibold">{roleName}</span>?
            All users with this role will need to be reassigned.
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
              Delete Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'client'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined);

  const handleCreate = () => {
    setSelectedRole(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (formData: RoleFormData) => {
    if (selectedRole) {
      // Update existing role
      setRoles(prev =>
        prev.map(r =>
          r._id === selectedRole._id
            ? {
                ...r,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : r
        )
      );
    } else {
      // Create new role
      const newRole: Role = {
        _id: String(Date.now()),
        ...formData,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRoles(prev => [...prev, newRole]);
    }
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      setRoles(prev => prev.filter(r => r._id !== roleToDelete._id));
      setIsDeleteModalOpen(false);
      setRoleToDelete(undefined);
    }
  };

  const filteredRoles = roles.filter(role => {
    if (filterType === 'all') return true;
    return role.userType === filterType;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Roles</h2>
          <p className="text-gray-500 mt-1">Control access levels and permissions</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Roles ({roles.length})
        </button>
        <button
          onClick={() => setFilterType('admin')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === 'admin'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Admin Roles ({roles.filter(r => r.userType === 'admin').length})
        </button>
        <button
          onClick={() => setFilterType('client')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === 'client'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Client Roles ({roles.filter(r => r.userType === 'client').length})
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoles.map(role => (
          <RoleCard
            key={role._id}
            role={role}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No roles found</p>
        </div>
      )}

      {/* Modals */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        role={selectedRole}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        roleName={roleToDelete?.displayName || ''}
      />
    </div>
  );
}
