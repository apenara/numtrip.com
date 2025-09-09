'use client';

import { useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
// Using standard HTML button with Tailwind classes
import { useAuthStore } from '@/stores/auth.store';
import { createClient } from '@/lib/supabase';
import { isMockAuthEnabled, mockAuth } from '@/lib/auth-mock';

interface ClaimButtonProps {
  businessId: string;
  businessName: string;
  isOwned?: boolean;
  onClaimSuccess?: () => void;
  className?: string;
}

interface ClaimStartResponse {
  id: string;
  status: string;
  message: string;
  expiresAt: string;
}

export function ClaimButton({ 
  businessId, 
  businessName, 
  isOwned = false,
  onClaimSuccess,
  className = '' 
}: ClaimButtonProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);

  // Don't show button if business is already owned
  if (isOwned) return null;

  const handleClaimClick = async () => {
    if (!user) {
      // In mock mode, auto-login
      if (isMockAuthEnabled()) {
        mockAuth.signIn();
        window.location.reload(); // Reload to update auth state
        return;
      }
      
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?returnUrl=${returnUrl}`;
      return;
    }

    setShowClaimForm(true);
  };

  const handleStartClaim = async (email: string, phoneNumber?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Get access token - use mock token in development
      let accessToken: string | undefined;
      
      if (isMockAuthEnabled()) {
        const mockSession = mockAuth.getSession();
        accessToken = mockSession?.access_token;
      } else {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.access_token;
      }
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/claims/${businessId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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
      
      // Show success message and handle next steps
      alert(`Verificación enviada! Revisa tu email ${email} para el código de verificación.`);
      
      // Close form and notify parent component
      setShowClaimForm(false);
      onClaimSuccess?.();
      
      // Redirect to dashboard after successful claim
      setTimeout(() => {
        window.location.href = `/dashboard/business/overview?claimed=${businessId}`;
      }, 2000);
      
    } catch (error) {
      console.error('Claim error:', error);
      alert(error instanceof Error ? error.message : 'Error al iniciar el reclamo');
    } finally {
      setLoading(false);
    }
  };

  if (showClaimForm) {
    return (
      <ClaimForm
        businessName={businessName}
        onSubmit={handleStartClaim}
        onCancel={() => setShowClaimForm(false)}
        loading={loading}
        className={className}
      />
    );
  }

  return (
    <button
      onClick={handleClaimClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
    >
      <Shield className="h-4 w-4" />
      {user ? 'Reclamar Negocio' : 'Iniciar Sesión para Reclamar'}
    </button>
  );
}

interface ClaimFormProps {
  businessName: string;
  onSubmit: (email: string, phoneNumber?: string) => void;
  onCancel: () => void;
  loading: boolean;
  className?: string;
}

function ClaimForm({ businessName, onSubmit, onCancel, loading, className }: ClaimFormProps) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    onSubmit(email.trim(), phoneNumber.trim() || undefined);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Reclamar {businessName}
        </h3>
        <p className="text-sm text-gray-600">
          Verifica que eres el propietario de este negocio. Te enviaremos un código de verificación.
        </p>
      </div>

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
            placeholder="tu@negocio.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa el email asociado con el negocio
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Número de teléfono (opcional)
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

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar Verificación
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

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Beneficios:</strong> Perfil sin anuncios, panel de administración, códigos promocionales y estadísticas detalladas.
        </p>
      </div>
    </div>
  );
}