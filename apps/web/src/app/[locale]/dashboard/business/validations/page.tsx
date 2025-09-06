import { ValidationManager } from '@/components/business-dashboard/ValidationManager';

interface ValidationsPageProps {
  params: {
    locale: string;
  };
}

export default function ValidationsPage({
  params: { locale },
}: ValidationsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Validations</h1>
        <p className="text-gray-600 mt-1">
          View and respond to customer validations of your business information.
        </p>
      </div>

      <ValidationManager />
    </div>
  );
}