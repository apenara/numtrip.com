'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { useValidateContact } from '@/hooks/useValidation';
import { useValidationRewards, ValidationRewards } from '@/components/gamification/ValidationRewards';

interface ValidationButtonsProps {
  businessId: string;
  contactType: 'phone' | 'email' | 'whatsapp' | 'general';
  contactValue?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function ValidationButtons({ 
  businessId, 
  contactType, 
  contactValue,
  size = 'sm',
  disabled = false
}: ValidationButtonsProps) {
  const t = useTranslations('Validation');
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [pendingAction, setPendingAction] = useState<'positive' | 'negative' | null>(null);
  const { reward, showReward, hideReward } = useValidationRewards();

  const {
    validateContact,
    isValidating,
    lastValidation,
    canValidate,
    cooldownRemaining
  } = useValidateContact(businessId, contactType);

  // Map contact type to validation enum
  const getValidationType = (type: string, isCorrect: boolean) => {
    const typeMap = {
      phone: isCorrect ? 'PHONE_WORKS' : 'PHONE_INCORRECT',
      email: isCorrect ? 'EMAIL_WORKS' : 'EMAIL_INCORRECT', 
      whatsapp: isCorrect ? 'WHATSAPP_WORKS' : 'WHATSAPP_INCORRECT',
      general: isCorrect ? 'GENERAL_CORRECT' : 'GENERAL_INCORRECT',
    };
    return typeMap[type as keyof typeof typeMap] as "PHONE_WORKS" | "PHONE_INCORRECT" | "EMAIL_WORKS" | "EMAIL_INCORRECT" | "WHATSAPP_WORKS" | "WHATSAPP_INCORRECT" | "GENERAL_CORRECT" | "GENERAL_INCORRECT";
  };

  const handleValidation = async (isCorrect: boolean) => {
    if (!canValidate || isValidating) return;

    setPendingAction(isCorrect ? 'positive' : 'negative');

    try {
      const validationType = getValidationType(contactType, isCorrect);
      await validateContact({
        type: validationType,
        isCorrect,
        comment: comment || undefined,
      });

      // Reset state after successful validation
      setComment('');
      setShowComment(false);
      setPendingAction(null);
      
      // Show reward notification
      showReward(10); // 10 points per validation
    } catch (error) {
      setPendingAction(null);
      console.error('Validation failed:', error);
    }
  };

  const getButtonSize = () => {
    return size === 'sm' ? 'h-7 px-2' : 'h-9 px-3';
  };

  const getIconSize = () => {
    return size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  };

  // Show cooldown message if user can't validate yet
  if (!canValidate && cooldownRemaining > 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
        <Clock className="h-3 w-3" />
        <span>
          {t('cooldown', { 
            time: Math.ceil(cooldownRemaining / (1000 * 60 * 60)) // hours remaining
          })}
        </span>
      </div>
    );
  }

  // Show last validation if user already validated
  if (lastValidation) {
    const isPositive = lastValidation.isCorrect;
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {isPositive ? (
          <CheckCircle className="h-3 w-3 text-green-600" />
        ) : (
          <XCircle className="h-3 w-3 text-red-600" />
        )}
        <span className={isPositive ? 'text-green-700' : 'text-red-700'}>
          {t(isPositive ? 'validatedCorrect' : 'validatedIncorrect')}
        </span>
      </div>
    );
  }

  return (
    <>
      <ValidationRewards
        isVisible={reward.isVisible}
        pointsEarned={reward.pointsEarned}
        onClose={hideReward}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
        <button
          onClick={() => handleValidation(true)}
          disabled={disabled || isValidating || !canValidate}
          className={`
            flex items-center gap-1 ${getButtonSize()} 
            bg-green-50 hover:bg-green-100 border border-green-200 
            text-green-700 rounded-md transition-colors text-xs font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            ${pendingAction === 'positive' ? 'bg-green-100' : ''}
          `}
        >
          {pendingAction === 'positive' ? (
            <Loader2 className={`${getIconSize()} animate-spin`} />
          ) : (
            <CheckCircle className={getIconSize()} />
          )}
          <span>{t('works')}</span>
        </button>

        <button
          onClick={() => handleValidation(false)}
          disabled={disabled || isValidating || !canValidate}
          className={`
            flex items-center gap-1 ${getButtonSize()}
            bg-red-50 hover:bg-red-100 border border-red-200 
            text-red-700 rounded-md transition-colors text-xs font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            ${pendingAction === 'negative' ? 'bg-red-100' : ''}
          `}
        >
          {pendingAction === 'negative' ? (
            <Loader2 className={`${getIconSize()} animate-spin`} />
          ) : (
            <XCircle className={getIconSize()} />
          )}
          <span>{t('doesntWork')}</span>
        </button>

        <button
          onClick={() => setShowComment(!showComment)}
          className={`
            flex items-center gap-1 ${getButtonSize()}
            bg-gray-50 hover:bg-gray-100 border border-gray-200 
            text-gray-600 rounded-md transition-colors text-xs
            ${showComment ? 'bg-gray-100' : ''}
          `}
        >
          <AlertCircle className={getIconSize()} />
        </button>
      </div>

      {showComment && (
        <div className="mt-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('commentPlaceholder')}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md resize-none"
            rows={2}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {comment.length}/200
            </span>
            <button
              onClick={() => setShowComment(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}