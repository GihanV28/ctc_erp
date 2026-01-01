'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Shield, Users } from 'lucide-react';
import RoleManagement from '@/components/team/RoleManagement';
import UserManagement from '@/components/team/UserManagement';

type TabType = 'roles' | 'users';

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('roles');

  return (
    <DashboardLayout title="Team Management" subtitle="Manage roles, users, and permissions">
      <div className="w-full">

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'roles'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield size={20} />
              Role Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'users'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={20} />
              User Management
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'roles' && <RoleManagement />}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
