'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ChevronDown, 
  Edit, 
  ExternalLink,
  MessageSquare,
  Tag
} from 'lucide-react';

interface QuickActionsProps {
  actionItems: string[];
  unreadValidations: number;
}

export function QuickActions({ actionItems, unreadValidations }: QuickActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (actionItems.length === 0) {
    return (
      <div className="text-green-600 text-sm font-medium flex items-center">
        <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
        All tasks completed!
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {actionItems.length} Action{actionItems.length !== 1 ? 's' : ''} Needed
        </span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
            <div className="space-y-3">
              {actionItems.map((item, index) => {
                let actionComponent;
                
                if (item.includes('validation')) {
                  actionComponent = (
                    <Link
                      href="/dashboard/business/validations"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-purple-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item}</p>
                        <p className="text-xs text-gray-500">Click to respond</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  );
                } else if (item.includes('promo code')) {
                  actionComponent = (
                    <Link
                      href="/dashboard/business/promo-codes"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Tag className="h-4 w-4 text-orange-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item}</p>
                        <p className="text-xs text-gray-500">Manage promo codes</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  );
                } else if (item.includes('description')) {
                  actionComponent = (
                    <Link
                      href="/dashboard/business/profile"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item}</p>
                        <p className="text-xs text-gray-500">Edit business profile</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  );
                } else {
                  actionComponent = (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index}>
                    {actionComponent}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <Link
                href="/dashboard/business/overview"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}