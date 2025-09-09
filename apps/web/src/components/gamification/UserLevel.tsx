'use client';

import { useTranslations } from 'next-intl';
import { 
  Award, 
  CheckCircle, 
  Star, 
  Target,
  TrendingUp,
  Trophy 
} from 'lucide-react';
import { useUserValidationStats } from '@/hooks/useValidation';

interface UserLevelProps {
  userId?: string;
  layout?: 'compact' | 'full';
  showProgress?: boolean;
}

export function UserLevel({ 
  userId, 
  layout = 'compact',
  showProgress = true 
}: UserLevelProps) {
  const t = useTranslations('Gamification');
  const { data: userStats, isLoading, error } = useUserValidationStats();

  if (!userId || isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse flex space-x-2">
          <div className="rounded-full bg-gray-200 h-6 w-6"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (error || !userStats) {
    return null;
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUPER_VALIDADOR': return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'EXPERTO': return <Star className="h-5 w-5 text-blue-600" />;
      case 'NOVATO': return <Target className="h-5 w-5 text-green-600" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUPER_VALIDADOR': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'EXPERTO': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'NOVATO': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getNextLevelRequirement = (level: string, currentValidations: number) => {
    switch (level) {
      case 'NOVATO': return { next: 'EXPERTO', required: 50, current: currentValidations };
      case 'EXPERTO': return { next: 'SUPER_VALIDADOR', required: 100, current: currentValidations };
      case 'SUPER_VALIDADOR': return null; // Max level
      default: return { next: 'NOVATO', required: 1, current: currentValidations };
    }
  };

  const nextLevel = getNextLevelRequirement(userStats.userLevel, userStats.totalValidations);

  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border
          ${getLevelColor(userStats.userLevel)}
        `}>
          {getLevelIcon(userStats.userLevel)}
          <span>{t(`level.${userStats.userLevel.toLowerCase()}`)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <TrendingUp className="h-3 w-3" />
          <span>{userStats.points} {t('points')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t('userLevel')}</h3>
        <div className={`
          flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border
          ${getLevelColor(userStats.userLevel)}
        `}>
          {getLevelIcon(userStats.userLevel)}
          <span>{t(`level.${userStats.userLevel.toLowerCase()}`)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{userStats.totalValidations}</div>
          <div className="text-xs text-gray-600">{t('validations')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.reputationScore}</div>
          <div className="text-xs text-gray-600">{t('accuracy')}%</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.points}</div>
          <div className="text-xs text-gray-600">{t('points')}</div>
        </div>
      </div>

      {/* Progress to Next Level */}
      {showProgress && nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('nextLevel')}</span>
            <span>{nextLevel.current}/{nextLevel.required}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((nextLevel.current / nextLevel.required) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {t('progressTo', { level: t(`level.${nextLevel.next.toLowerCase()}`) })}
          </div>
        </div>
      )}

      {/* Badges */}
      {userStats.badges.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2 text-sm">{t('badges')}</h4>
          <div className="flex flex-wrap gap-1">
            {userStats.badges.map((badge) => (
              <div 
                key={badge}
                className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
              >
                <Award className="h-3 w-3" />
                <span>{t(`badge.${badge.toLowerCase()}`)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}