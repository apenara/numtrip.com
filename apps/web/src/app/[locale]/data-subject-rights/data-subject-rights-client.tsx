'use client';

import { useState } from 'react';
import { Send, Download, Eye, Edit, Trash2, UserX, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

type RequestType = 'access' | 'rectification' | 'erasure' | 'restriction' | 'portability' | 'objection' | 'complaint';

interface FormData {
  name: string;
  email: string;
  requestType: RequestType;
  description: string;
  verificationMethod: 'email' | 'id_document';
  identificationDocument?: File;
}

export default function DataSubjectRightsClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    requestType: 'access',
    description: '',
    verificationMethod: 'email',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>('');

  const requestTypes = [
    {
      id: 'access' as const,
      title: 'Derecho de Acceso',
      description: 'Solicitar una copia de los datos personales que tenemos sobre ti',
      icon: Eye,
      color: 'blue',
    },
    {
      id: 'rectification' as const,
      title: 'Derecho de Rectificación',
      description: 'Corregir datos personales inexactos o incompletos',
      icon: Edit,
      color: 'green',
    },
    {
      id: 'erasure' as const,
      title: 'Derecho al Olvido',
      description: 'Solicitar la eliminación de tus datos personales',
      icon: Trash2,
      color: 'red',
    },
    {
      id: 'restriction' as const,
      title: 'Derecho de Limitación',
      description: 'Restringir el procesamiento de tus datos personales',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      id: 'portability' as const,
      title: 'Derecho de Portabilidad',
      description: 'Recibir tus datos en un formato estructurado y legible',
      icon: Download,
      color: 'purple',
    },
    {
      id: 'objection' as const,
      title: 'Derecho de Oposición',
      description: 'Oponerte al procesamiento de tus datos personales',
      icon: UserX,
      color: 'gray',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the request to your backend
      console.log('GDPR Request submitted:', formData);
      
      setSubmitted(true);
    } catch (err) {
      setError('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, identificationDocument: file }));
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Solicitud Enviada</h1>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu solicitud de derechos del titular de datos. Te contactaremos en las próximas 
            72 horas para confirmar tu identidad y procesar tu solicitud.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Número de referencia:</strong> DSR-{Date.now().toString().slice(-6)}
              <br />
              <strong>Tipo de solicitud:</strong> {requestTypes.find(r => r.id === formData.requestType)?.title}
              <br />
              <strong>Email:</strong> {formData.email}
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                requestType: 'access',
                description: '',
                verificationMethod: 'email',
              });
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Derechos del Titular de Datos</h1>
        <p className="text-gray-600 mb-6">
          Según el Reglamento General de Protección de Datos (GDPR), tienes derecho a controlar cómo 
          se procesan tus datos personales. Utiliza este formulario para ejercitar tus derechos.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-yellow-800 text-sm">
                <strong>Importante:</strong> Para procesar tu solicitud, necesitaremos verificar tu identidad. 
                Responderemos a tu solicitud dentro de 30 días calendario según la legislación GDPR.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Request Type Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tipo de Solicitud</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requestTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.requestType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, requestType: type.id }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className={`w-6 h-6 mr-3 mt-1 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {type.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la Solicitud *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe tu solicitud con el mayor detalle posible..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Identity Verification */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Verificación de Identidad</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verification"
                  value="email"
                  checked={formData.verificationMethod === 'email'}
                  onChange={(e) => setFormData(prev => ({ ...prev, verificationMethod: 'email' }))}
                  className="mr-2"
                />
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Verificación por correo electrónico
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verification"
                  value="id_document"
                  checked={formData.verificationMethod === 'id_document'}
                  onChange={(e) => setFormData(prev => ({ ...prev, verificationMethod: 'id_document' }))}
                  className="mr-2"
                />
                <Download className="w-4 h-4 mr-2 text-gray-500" />
                Documento de identidad
              </label>
            </div>
            
            {formData.verificationMethod === 'id_document' && (
              <div>
                <label htmlFor="id_document" className="block text-sm font-medium text-gray-700 mb-2">
                  Subir Documento de Identidad
                </label>
                <input
                  type="file"
                  id="id_document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceptados: PDF, JPG, PNG (máx. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Aviso Legal</h3>
          <p className="text-sm text-gray-700">
            Al enviar esta solicitud, confirmas que la información proporcionada es veraz y que tienes 
            derecho a solicitar información sobre los datos personales especificados. El uso fraudulento 
            de este formulario puede constituir una violación de la ley.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Solicitud
              </>
            )}
          </button>
        </div>
      </form>

      {/* Contact Information */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">¿Necesitas Ayuda?</h2>
        <p className="text-gray-600 mb-4">
          Si tienes preguntas sobre tus derechos de protección de datos o necesitas asistencia con este formulario, 
          puedes contactarnos directamente:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Oficial de Protección de Datos</strong><br />
            Email: privacy@numtrip.com<br />
            Teléfono: +57 300 123 4567<br />
            Tiempo de respuesta: 72 horas (confirmación), 30 días (resolución completa)
          </p>
        </div>
      </div>
    </div>
  );
}