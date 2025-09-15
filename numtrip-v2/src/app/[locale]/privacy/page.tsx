import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft, Shield, Eye, Lock, Database, Users } from 'lucide-react';

interface Props {
  params: {
    locale: string;
  };
}

export const metadata: Metadata = {
  title: 'Política de Privacidad | NumTrip',
  description: 'Política de privacidad de NumTrip - Cómo protegemos y utilizamos tu información personal',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage({ params }: Props) {
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
              href={`/${params.locale}`}
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
            href={`/${params.locale}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Datos Seguros</h3>
            <p className="text-gray-600 text-sm">Protegemos tu información con encriptación y medidas de seguridad</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Transparencia</h3>
            <p className="text-gray-600 text-sm">Te explicamos claramente qué datos recopilamos y por qué</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Tu Control</h3>
            <p className="text-gray-600 text-sm">Puedes solicitar modificaciones o eliminación de tus datos</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">

            {/* Introducción */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introducción</h2>
              <p className="text-gray-700 leading-relaxed">
                En NumTrip respetamos tu privacidad y nos comprometemos a proteger tu información personal. Esta política
                explica cómo recopilamos, utilizamos, almacenamos y protegemos tu información cuando utilizas nuestro
                directorio de contactos turísticos.
              </p>
            </section>

            {/* Información que Recopilamos */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">2. Información que Recopilamos</h2>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Información que Proporcionas</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Información de Negocio:</strong> Nombre, descripción, categoría, dirección, contactos</li>
                <li><strong>Información de Propietario:</strong> Nombre, email, teléfono para verificación</li>
                <li><strong>Comunicaciones:</strong> Mensajes que nos envías para soporte o consultas</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Información Automática</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Datos de Navegación:</strong> IP, tipo de navegador, páginas visitadas, tiempo de visita</li>
                <li><strong>Cookies:</strong> Para mejorar tu experiencia y recordar preferencias</li>
                <li><strong>Analytics:</strong> Estadísticas anónimas de uso del sitio web</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Información Pública</h3>
              <p className="text-gray-700">
                Algunos datos de contacto de negocios pueden estar disponibles públicamente o ser proporcionados
                directamente por los propietarios para aparecer en nuestro directorio.
              </p>
            </section>

            {/* Cómo Utilizamos la Información */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cómo Utilizamos tu Información</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Propósitos Principales</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Mostrar información de contacto de negocios a turistas</li>
                <li>Verificar la autenticidad de negocios y propietarios</li>
                <li>Mejorar nuestro servicio y experiencia de usuario</li>
                <li>Comunicarnos contigo sobre tu perfil de negocio</li>
                <li>Generar estadísticas anónimas de uso</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Marketing y Comunicaciones</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Enviar actualizaciones sobre tu perfil de negocio</li>
                <li>Notificar sobre nuevas funcionalidades del servicio</li>
                <li>Promociones especiales para propietarios verificados</li>
                <li>Siempre puedes optar por no recibir estas comunicaciones</li>
              </ul>
            </section>

            {/* Compartir Información */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartir tu Información</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Información Pública</h3>
              <p className="text-gray-700 mb-4">
                La información de contacto de negocios (nombre, dirección, teléfono, email, WhatsApp, sitio web)
                se muestra públicamente en nuestro directorio para que los turistas puedan contactar directamente.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 No Vendemos Datos</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">
                  Nunca vendemos, alquilamos o intercambiamos tu información personal con terceros para propósitos comerciales.
                </p>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 Casos Especiales</h3>
              <p className="text-gray-700 mb-2">Podemos compartir información solo en casos como:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Requerimientos legales o procesos judiciales</li>
                <li>Proteger nuestros derechos o seguridad</li>
                <li>Prevenir fraude o actividades ilegales</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </section>

            {/* Cookies y Tecnologías */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies y Tecnologías Similares</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Tipos de Cookies</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de Funcionalidad:</strong> Recordar preferencias y configuraciones</li>
                <li><strong>Cookies Analíticas:</strong> Google Analytics para entender el uso del sitio</li>
                <li><strong>Cookies Publicitarias:</strong> Google AdSense para mostrar anuncios relevantes</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Control de Cookies</h3>
              <p className="text-gray-700">
                Puedes controlar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar
                ciertas cookies puede afectar la funcionalidad del sitio.
              </p>
            </section>

            {/* Seguridad */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seguridad de Datos</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de seguridad técnicas y organizacionales para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Encriptación SSL/TLS para todas las transmisiones de datos</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Copias de seguridad regulares y seguras</li>
                <li>Actualizaciones de seguridad constantes</li>
              </ul>
            </section>

            {/* Tus Derechos */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Tus Derechos</h2>
              <p className="text-gray-700 mb-4">Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Acceso:</strong> Solicitar una copia de tu información personal</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de tu información</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato portable</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Limitación:</strong> Restringir cómo usamos tu información</li>
              </ul>
            </section>

            {/* Retención de Datos */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retención de Datos</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Perfiles de Negocio:</strong> Mantenidos mientras el negocio esté activo en el directorio</li>
                <li><strong>Datos de Propietarios:</strong> Conservados para verificación y comunicación</li>
                <li><strong>Logs del Sistema:</strong> Eliminados después de 12 meses</li>
                <li><strong>Cookies:</strong> Expiración según configuración (generalmente 1-2 años)</li>
              </ul>
            </section>

            {/* Menores de Edad */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Menores de Edad</h2>
              <p className="text-gray-700">
                NumTrip no está dirigido a menores de 18 años. No recopilamos conscientemente información personal
                de menores. Si descubres que un menor ha proporcionado información, contáctanos para eliminarla.
              </p>
            </section>

            {/* Cambios en la Política */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cambios en esta Política</h2>
              <p className="text-gray-700">
                Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos
                por email o mediante un aviso destacado en nuestro sitio web. La fecha de la última actualización
                aparece al inicio de esta política.
              </p>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contacto sobre Privacidad</h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre esta política de privacidad o quieres ejercer tus derechos, contáctanos:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">Oficial de Protección de Datos</h3>
                <ul className="space-y-2 text-blue-800">
                  <li><strong>Email:</strong> privacidad@numtrip.com</li>
                  <li><strong>Email General:</strong> soporte@numtrip.com</li>
                  <li><strong>Dirección:</strong> Cartagena, Colombia</li>
                  <li><strong>Sitio web:</strong> numtrip.com</li>
                </ul>
                <p className="text-blue-700 text-sm mt-3">
                  Respondemos a solicitudes de privacidad dentro de 30 días hábiles.
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href={`/${params.locale}/terms`}
            className="text-primary-blue hover:text-primary-blue-dark transition-colors"
          >
            ← Términos y Condiciones
          </Link>
          <Link
            href={`/${params.locale}`}
            className="text-primary-blue hover:text-primary-blue-dark transition-colors"
          >
            Volver al Inicio →
          </Link>
        </div>
      </div>
    </div>
  );
}