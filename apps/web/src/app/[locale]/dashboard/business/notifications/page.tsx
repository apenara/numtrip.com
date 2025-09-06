import { NotificationCenter } from '@/components/business-dashboard/NotificationCenter';

interface NotificationsPageProps {
  params: {
    locale: string;
  };
}

export default function NotificationsPage({
  params: { locale },
}: NotificationsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">
          Stay updated with alerts and important information about your business.
        </p>
      </div>

      <NotificationCenter />
    </div>
  );
}