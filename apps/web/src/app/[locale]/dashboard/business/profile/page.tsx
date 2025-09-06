import { BusinessProfileEditor } from '@/components/business-dashboard/BusinessProfileEditor';

interface BusinessProfilePageProps {
  params: {
    locale: string;
  };
}

export default function BusinessProfilePage({
  params: { locale },
}: BusinessProfilePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your business information and contact details.
        </p>
      </div>

      <BusinessProfileEditor />
    </div>
  );
}