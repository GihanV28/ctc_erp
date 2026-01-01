'use client';

import React from 'react';
import { MapPin, EyeOff } from 'lucide-react';
import { trackingStatuses } from './TrackingUpdateModal';
import type { TrackingUpdate } from './types';

interface TrackingHistoryProps {
  updates: TrackingUpdate[];
  onAddUpdate?: () => void;
}

export default function TrackingHistory({ updates, onAddUpdate }: TrackingHistoryProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
          <p className="text-sm text-gray-500 mt-1">{updates.length} update{updates.length !== 1 ? 's' : ''} recorded</p>
        </div>
        {onAddUpdate && (
          <button
            onClick={onAddUpdate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            <MapPin size={16} />
            Add Update
          </button>
        )}
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tracking updates yet</p>
          {onAddUpdate && (
            <button
              onClick={onAddUpdate}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add first tracking update
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Timeline items */}
          <div className="space-y-6">
            {updates.map((update, index) => {
              const status = trackingStatuses.find(s => s.value === update.status);
              const Icon = status?.icon || MapPin;

              return (
                <div key={update._id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                    status?.bgColor || 'bg-gray-100'
                  }`}>
                    <Icon size={18} className={status?.color || 'text-gray-500'} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${status?.color || 'text-gray-900'}`}>
                          {status?.label || update.status}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>
                            {update.location.name}
                            {update.location.city && `, ${update.location.city}`}
                            {update.location.country && `, ${update.location.country}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!update.isPublic && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                            <EyeOff size={10} />
                            Internal
                          </span>
                        )}
                        <span className="text-sm text-gray-400">
                          {new Date(update.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{update.description}</p>

                    {/* Attachments */}
                    {update.attachments && update.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {update.attachments.map((attachment, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                          >
                            📎 {attachment}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
