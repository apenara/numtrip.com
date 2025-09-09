'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle, Shield, TrendingUp, Users, XCircle } from 'lucide-react';
import { useValidationStats } from '@/hooks/useValidation';

interface ValidationStatsProps {
  businessId: string;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showDetails?: boolean;
}

export function ValidationStats({ 
  businessId, 
  layout = 'horizontal',
  showDetails = false 
}: ValidationStatsProps) {
  const t = useTranslations('Validation');
  const { data: stats, isLoading, error } = useValidationStats(businessId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-4 w-4"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'VERIFIED': return 'text-green-700 bg-green-100 border-green-200';
      case 'HIGH': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTrustIcon = (level: string) => {
    switch (level) {
      case 'VERIFIED': return <Shield className="h-4 w-4" />;
      case 'HIGH': return <CheckCircle className="h-4 w-4" />;
      case 'MEDIUM': return <TrendingUp className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border
          ${getTrustLevelColor(stats.trustLevel)}
        `}>
          {getTrustIcon(stats.trustLevel)}
          <span>{stats.validationPercentage}%</span>
        </div>
        <span className="text-xs text-gray-500">
          ({stats.totalValidations} {t('validations')})
        </span>
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{t('communityValidation')}</h3>
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border
            ${getTrustLevelColor(stats.trustLevel)}
          `}>
            {getTrustIcon(stats.trustLevel)}
            <span>{t(`trustLevel.${stats.trustLevel.toLowerCase()}`)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('accuracy')}</span>
            <span className="font-medium">{stats.validationPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.validationPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>{stats.totalValidations} {t('totalValidations')}</span>
            <span>
              {stats.positiveValidations} ✓ / {stats.negativeValidations} ✗
            </span>
          </div>
        </div>

        {showDetails && stats.totalValidations > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.entries(stats.byType).map(([type, typeStats]) => (
              <div key={type} className="bg-gray-50 p-2 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">{t(`contactType.${type}`)}</span>
                  <span className="text-xs text-gray-600">{typeStats.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${typeStats.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {typeStats.total} {t('validations')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default horizontal layout
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {stats.totalValidations} {t('validations')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.validationPercentage}%` }}
          />
        </div>
        <span className="text-sm font-medium">
          {stats.validationPercentage}%
        </span>
      </div>

      <div className={`
        flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border
        ${getTrustLevelColor(stats.trustLevel)}
      `}>
        {getTrustIcon(stats.trustLevel)}
        <span>{t(`trustLevel.${stats.trustLevel.toLowerCase()}`)}</span>
      </div>
    </div>
  );
}