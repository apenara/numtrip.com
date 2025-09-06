import { DashboardSidebar } from '@/components/business-dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/business-dashboard/DashboardHeader';

interface BusinessDashboardLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function BusinessDashboardLayout({
  children,
  params: { locale },
}: BusinessDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar Navigation */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}