'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tag,
  Users
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/dashboard/business/overview', icon: LayoutDashboard },
  { name: 'Business Profile', href: '/dashboard/business/profile', icon: Building2 },
  { name: 'Promo Codes', href: '/dashboard/business/promo-codes', icon: Tag },
  { name: 'Validations', href: '/dashboard/business/validations', icon: MessageSquare, badge: 3 },
  { name: 'Analytics', href: '/dashboard/business/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/dashboard/business/notifications', icon: Bell, badge: 5 },
  { name: 'Settings', href: '/dashboard/business/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle button */}
          <div className="p-4 border-b border-gray-200 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Collapsed state badge */}
                  {collapsed && item.badge && (
                    <span className="absolute left-8 top-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200">
            {!collapsed && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-blue-900">
                      Upgrade Plan
                    </p>
                    <p className="text-xs text-blue-600">
                      Get premium features
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 lg:hidden"
        >
          <LayoutDashboard className="h-6 w-6" />
        </button>
      )}
    </>
  );
}