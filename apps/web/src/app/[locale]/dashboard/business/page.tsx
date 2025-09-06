import { redirect } from 'next/navigation';

interface BusinessDashboardPageProps {
  params: {
    locale: string;
  };
}

export default function BusinessDashboardPage({
  params: { locale },
}: BusinessDashboardPageProps) {
  // Redirect to overview page by default
  redirect(`/${locale}/dashboard/business/overview`);
}