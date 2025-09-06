'use client';

import { useState, useEffect } from 'react';
import { Shield, Mail, Check, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
// Using standard HTML button with Tailwind classes
import { useAuthStore } from '@/stores/auth.store';
import { createClient } from '@/lib/supabase';

interface ClaimFlowProps {
  businessId: string;
  businessName: string;
  onComplete: () => void;
  onCancel: () => void;
  className?: string;
}

interface ClaimStartResponse {
  id: string;
  status: string;
  message: string;
  expiresAt: string;
}

interface ClaimVerifyResponse {
  id: string;
  status: string;
  message: string;
  businessId: string;
}

type ClaimStep = 'start' | 'verify' | 'success' | 'error';

interface ClaimState {
  step: ClaimStep;
  claimId?: string;
  email?: string;
  phoneNumber?: string;
  error?: string;
  loading: boolean;
}

export function ClaimFlow({ 
  businessId, 
  businessName, 
  onComplete, 
  onCancel, 
  className = '' 
}: ClaimFlowProps) {
  const { user } = useAuthStore();
  const [state, setState] = useState<ClaimState>({
    step: 'start',
    loading: false,
  });

  const handleStartClaim = async (email: string, phoneNumber?: string) => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/claims/${businessId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          verificationType: 'EMAIL',
          contactValue: email,
          phoneNumber: phoneNumber || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start claim process');
      }

      const result: ClaimStartResponse = await response.json();
      
      setState(prev => ({
        ...prev,
        step: 'verify',
        claimId: result.id,
        email,
        phoneNumber,
        loading: false,
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Error al iniciar el reclamo',
        loading: false,
      }));
    }
  };

  const handleVerifyClaim = async (verificationCode: string) => {
    if (!user || !state.claimId) return;

    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/claims/${state.claimId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          verificationCode: verificationCode.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify claim');
      }

      const result: ClaimVerifyResponse = await response.json();
      
      setState(prev => ({
        ...prev,
        step: 'success',
        loading: false,
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Código de verificación inválido',
        loading: false,
      }));
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleBack = () => {
    if (state.step === 'verify') {
      setState(prev => ({ ...prev, step: 'start', error: undefined }));
    } else if (state.step === 'error') {
      setState(prev => ({ ...prev, step: 'start', error: undefined }));
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-lg max-w-md mx-auto ${className}`}>
      <div className="p-6">
        <StepIndicator currentStep={state.step} />
        
        {state.step === 'start' && (
          <StartStep
            businessName={businessName}
            onSubmit={handleStartClaim}
            onCancel={onCancel}
            loading={state.loading}
            error={state.error}
          />
        )}

        {state.step === 'verify' && (
          <VerifyStep
            businessName={businessName}
            email={state.email!}
            onVerify={handleVerifyClaim}
            onBack={handleBack}
            loading={state.loading}
            error={state.error}
          />
        )}

        {state.step === 'success' && (
          <SuccessStep
            businessName={businessName}
            onComplete={handleComplete}
          />
        )}

        {state.step === 'error' && (
          <ErrorStep
            error={state.error!}
            onBack={handleBack}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: ClaimStep }) {
  const steps = [
    { key: 'start', label: 'Información', icon: Shield },
    { key: 'verify', label: 'Verificación', icon: Mail },
    { key: 'success', label: 'Completado', icon: Check },
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isCompleted
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${
                isCompleted ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StartStep({ 
  businessName, 
  onSubmit, 
  onCancel, 
  loading, 
  error 
}: {
  businessName: string;
  onSubmit: (email: string, phoneNumber?: string) => void;
  onCancel: () => void;
  loading: boolean;
  error?: string;
}) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim(), phoneNumber.trim() || undefined);
  };

  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Reclamar {businessName}
        </h3>
        <p className="text-gray-600">
          Verifica que eres el propietario proporcionando información de contacto empresarial.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email empresarial *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="propietario@negocio.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Te enviaremos un código de verificación a este email
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono empresarial (opcional)
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
            placeholder="+57 300 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continuar
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Beneficios del reclamo:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Perfil sin anuncios publicitarios</li>
          <li>• Panel de administración completo</li>
          <li>• Creación de códigos promocionales</li>
          <li>• Estadísticas detalladas de tu negocio</li>
          <li>• Prioridad en resultados de búsqueda</li>
        </ul>
      </div>
    </>
  );
}

function VerifyStep({ 
  businessName, 
  email, 
  onVerify, 
  onBack, 
  loading, 
  error 
}: {
  businessName: string;
  email: string;
  onVerify: (code: string) => void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verifica tu email
        </h3>
        <p className="text-gray-600">
          Te enviamos un código de 6 dígitos a <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificación
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            disabled={loading}
            placeholder="123456"
            maxLength={6}
            className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            El código expira en 1 hora
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>
          
          <button
            type="submit"
            disabled={code.length !== 6 || loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verificar Código
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={onBack}
          >
            intenta con otro email
          </button>
        </p>
      </div>
    </>
  );
}

function SuccessStep({ 
  businessName, 
  onComplete 
}: {
  businessName: string;
  onComplete: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Reclamo Exitoso!
        </h3>
        <p className="text-gray-600">
          Has reclamado exitosamente <strong>{businessName}</strong>. 
          Tu solicitud está en revisión y será aprobada dentro de 24-48 horas.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-medium text-green-900 mb-2">Próximos pasos:</h4>
        <ul className="text-sm text-green-800 space-y-1 text-left">
          <li>• Recibirás una notificación por email cuando sea aprobado</li>
          <li>• Podrás acceder al panel de administración</li>
          <li>• Los anuncios serán removidos de tu perfil</li>
          <li>• Podrás crear códigos promocionales</li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Entendido
      </button>
    </div>
  );
}

function ErrorStep({ 
  error, 
  onBack, 
  onCancel 
}: {
  error: string;
  onBack: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error en el Reclamo
        </h3>
        <p className="text-gray-600 mb-4">
          {error}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Intentar de Nuevo
        </button>
        
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}