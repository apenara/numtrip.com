'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Building2,
  Users,
  Star
} from 'lucide-react';
import { BusinessCategory } from '@/types/business';
import Link from 'next/link';

interface BusinessForm {
  name: string;
  description: string;
  category: BusinessCategory;
  address: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  ownerName: string;
  ownerEmail: string;
}

const categories = [
  { value: 'HOTEL', label: 'Hotel', icon: '🏨', description: 'Hoteles, hostales, apartamentos' },
  { value: 'TOUR', label: 'Tour', icon: '🗺️', description: 'Agencias de turismo, tours, excursiones' },
  { value: 'TRANSPORT', label: 'Transporte', icon: '🚗', description: 'Taxis, transfers, alquiler de vehículos' },
  { value: 'RESTAURANT', label: 'Restaurante', icon: '🍽️', description: 'Restaurantes, bares, cafeterías' },
  { value: 'ATTRACTION', label: 'Atracción', icon: '🎯', description: 'Sitios turísticos, museos, actividades' },
  { value: 'OTHER', label: 'Otro', icon: '📍', description: 'Otros servicios turísticos' },
];

export default function AddBusinessPage() {
  const router = useRouter();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<BusinessForm>({
    name: '',
    description: '',
    category: 'OTHER' as BusinessCategory,
    address: '',
    city: 'Cartagena',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    ownerName: '',
    ownerEmail: ''
  });

  const [errors, setErrors] = useState<Partial<BusinessForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BusinessForm> = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!form.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!form.ownerName.trim()) newErrors.ownerName = 'Tu nombre es requerido';
    if (!form.ownerEmail.trim()) newErrors.ownerEmail = 'Tu email es requerido';

    // At least one contact method required
    if (!form.phone.trim() && !form.email.trim() && !form.whatsapp.trim() && !form.website.trim()) {
      newErrors.phone = 'Al menos un método de contacto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  const handleChange = (field: keyof BusinessForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-primary-blue" />
                <span className="ml-2 text-xl font-bold text-gray-900">NumTrip</span>
              </div>
              <Link
                href={`/${locale}`}
                className="text-primary-blue hover:text-primary-blue-dark transition-colors"
              >
                Inicio
              </Link>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Solicitud Enviada!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hemos recibido la información de tu negocio. Nuestro equipo la revisará en las próximas 24-48 horas.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">¿Qué sigue?</h2>
              <ul className="text-blue-800 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Verificaremos la información proporcionada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Te enviaremos un email de confirmación</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Tu negocio aparecerá en nuestro directorio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Podrás reclamar y administrar tu perfil</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: '',
                    description: '',
                    category: 'OTHER' as BusinessCategory,
                    address: '',
                    city: 'Cartagena',
                    phone: '',
                    email: '',
                    whatsapp: '',
                    website: '',
                    ownerName: '',
                    ownerEmail: ''
                  });
                }}
                className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-blue-dark transition-colors"
              >
                Agregar Otro Negocio
              </button>
              <Link
                href={`/${locale}`}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-blue" />
              <span className="ml-2 text-xl font-bold text-gray-900">NumTrip</span>
            </div>
            <Link
              href={`/${locale}`}
              className="text-primary-blue hover:text-primary-blue-dark transition-colors"
            >
              Inicio
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agregar Mi Negocio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Únete a nuestro directorio de contactos turísticos y conecta directamente con miles de turistas en Cartagena
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Más Clientes</h3>
            <p className="text-gray-600 text-sm">Conecta con turistas que buscan tus servicios</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Verificación</h3>
            <p className="text-gray-600 text-sm">Badge de verificación para generar confianza</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gratis</h3>
            <p className="text-gray-600 text-sm">Sin costo, promoción gratis por 6 meses</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Negocio
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Negocio *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Hotel Casa Colonial"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label} - {cat.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe tu negocio, servicios que ofreces, qué te hace especial..."
                  />
                  {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Calle de la Mantilla #3-56"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  >
                    <option value="Cartagena">Cartagena</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Santa Marta">Santa Marta</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Agrega al menos un método de contacto. Recomendamos WhatsApp para mejor comunicación con turistas.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    WhatsApp (Recomendado)
                  </label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+57 5 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="contacto@minegocio.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="https://www.minegocio.com"
                  />
                </div>
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-2">{errors.phone}</p>}
            </div>

            {/* Owner Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tu Información (Propietario)
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.ownerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Juan Pérez"
                  />
                  {errors.ownerName && <p className="text-red-600 text-xs mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu Email *
                  </label>
                  <input
                    type="email"
                    value={form.ownerEmail}
                    onChange={(e) => handleChange('ownerEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${
                      errors.ownerEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="juan@email.com"
                  />
                  {errors.ownerEmail && <p className="text-red-600 text-xs mt-1">{errors.ownerEmail}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Te enviaremos las credenciales para administrar tu perfil
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Importante</h3>
                  <p className="text-yellow-700 text-sm">
                    Al enviar este formulario, confirmas que eres el propietario o representante autorizado del negocio.
                    La información será revisada antes de ser publicada.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
              <Link
                href={`/${locale}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ¿Tienes preguntas? Contáctanos en{' '}
            <a href="mailto:soporte@numtrip.com" className="text-primary-blue hover:underline">
              soporte@numtrip.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}