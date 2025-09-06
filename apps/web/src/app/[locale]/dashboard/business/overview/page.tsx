import { BusinessOverview } from '@/components/business-dashboard/BusinessOverview';

interface BusinessOverviewPageProps {
  params: {
    locale: string;
  };
}

export default function BusinessOverviewPage({
  params: { locale },
}: BusinessOverviewPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor your business performance and engagement metrics.
        </p>
      </div>

      <BusinessOverview />
    </div>
  );
}