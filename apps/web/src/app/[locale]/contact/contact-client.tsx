'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactClient() {
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSpanish = locale === 'es';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isSpanish ? '¡Mensaje Enviado!' : 'Message Sent!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isSpanish 
              ? 'Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.'
              : 'Thank you for contacting us. We will respond within the next 24 hours.'
            }
          </p>
          <button
            onClick={() => {setSubmitted(false); setFormData({name: '', email: '', subject: '', message: '', type: 'general'})}}
            className="btn-primary"
          >
            {isSpanish ? 'Enviar Otro Mensaje' : 'Send Another Message'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {isSpanish ? 'Contáctanos' : 'Contact Us'}
        </h1>
        <p className="text-gray-600 text-lg">
          {isSpanish 
            ? 'Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.'
            : 'We are here to help you. Send us a message and we will respond soon.'
          }
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {isSpanish ? 'Información de Contacto' : 'Contact Information'}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-primary-blue mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isSpanish ? 'Correo Electrónico' : 'Email'}
                </h3>
                <p className="text-gray-600">support@numtrip.com</p>
                <p className="text-sm text-gray-500">
                  {isSpanish ? 'Respuesta en 24 horas' : 'Response within 24 hours'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-primary-blue mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isSpanish ? 'Teléfono' : 'Phone'}
                </h3>
                <p className="text-gray-600">+57 300 123 4567</p>
                <p className="text-sm text-gray-500">
                  {isSpanish ? 'Lunes a Viernes, 9AM - 6PM COT' : 'Monday to Friday, 9AM - 6PM COT'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MessageCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-gray-600">+57 300 123 4567</p>
                <a 
                  href="https://wa.me/573001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  {isSpanish ? 'Enviar mensaje' : 'Send message'}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-primary-blue mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isSpanish ? 'Ubicación' : 'Location'}
                </h3>
                <p className="text-gray-600">Cartagena, Colombia</p>
                <p className="text-sm text-gray-500">
                  {isSpanish ? 'Enfocados en turismo de Cartagena' : 'Focused on Cartagena tourism'}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              {isSpanish ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">
                  {isSpanish ? '¿Cómo puedo verificar mi negocio?' : 'How can I verify my business?'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {isSpanish 
                    ? 'Contáctanos con la información de tu negocio y te ayudaremos con el proceso de verificación.'
                    : 'Contact us with your business information and we will help you with the verification process.'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {isSpanish ? '¿Es gratis listar mi negocio?' : 'Is it free to list my business?'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {isSpanish 
                    ? 'Sí, es completamente gratis. Los negocios verificados obtienen beneficios adicionales.'
                    : 'Yes, it is completely free. Verified businesses get additional benefits.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                {isSpanish ? 'Tipo de Consulta' : 'Type of Inquiry'}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="general">
                  {isSpanish ? 'Consulta General' : 'General Inquiry'}
                </option>
                <option value="business">
                  {isSpanish ? 'Verificación de Negocio' : 'Business Verification'}
                </option>
                <option value="technical">
                  {isSpanish ? 'Soporte Técnico' : 'Technical Support'}
                </option>
                <option value="partnership">
                  {isSpanish ? 'Asociaciones' : 'Partnerships'}
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {isSpanish ? 'Nombre Completo' : 'Full Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={isSpanish ? 'Tu nombre completo' : 'Your full name'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {isSpanish ? 'Correo Electrónico' : 'Email Address'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={isSpanish ? 'tu@email.com' : 'your@email.com'}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                {isSpanish ? 'Asunto' : 'Subject'}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={isSpanish ? 'Breve descripción del tema' : 'Brief description of the topic'}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {isSpanish ? 'Mensaje' : 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder={isSpanish ? 'Escribe tu mensaje aquí...' : 'Write your message here...'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-blue-hover disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSpanish ? 'Enviando...' : 'Sending...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  {isSpanish ? 'Enviar Mensaje' : 'Send Message'}
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}