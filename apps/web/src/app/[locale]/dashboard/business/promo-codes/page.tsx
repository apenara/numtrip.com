import { PromoCodeManager } from '@/components/business-dashboard/PromoCodeManager';

interface PromoCodesPageProps {
  params: {
    locale: string;
  };
}

export default function PromoCodesPage({
  params: { locale },
}: PromoCodesPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
        <p className="text-gray-600 mt-1">
          Create and manage promotional codes to attract more customers.
        </p>
      </div>

      <PromoCodeManager />
    </div>
  );
}