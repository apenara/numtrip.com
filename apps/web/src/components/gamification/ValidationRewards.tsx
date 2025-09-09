'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, Plus, Trophy } from 'lucide-react';

interface ValidationRewardsProps {
  isVisible: boolean;
  pointsEarned: number;
  onClose: () => void;
}

export function ValidationRewards({ 
  isVisible, 
  pointsEarned,
  onClose 
}: ValidationRewardsProps) {
  const t = useTranslations('Gamification');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        bg-white border border-green-200 rounded-lg shadow-lg p-4 min-w-[280px]
        transform transition-all duration-500 ease-out
        ${animate ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h4 className="font-medium text-gray-900">{t('validationComplete')}</h4>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Plus className="h-4 w-4" />
              <Trophy className="h-4 w-4" />
              <span className="font-medium">+{pointsEarned} {t('points')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing validation rewards
export function useValidationRewards() {
  const [reward, setReward] = useState<{
    isVisible: boolean;
    pointsEarned: number;
  }>({ isVisible: false, pointsEarned: 0 });

  const showReward = (pointsEarned: number = 10) => {
    setReward({ isVisible: true, pointsEarned });
  };

  const hideReward = () => {
    setReward(prev => ({ ...prev, isVisible: false }));
  };

  return {
    reward,
    showReward,
    hideReward,
  };
}