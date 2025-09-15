import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

interface Props {
  params: {
    locale: string;
  };
}

export const metadata: Metadata = {
  title: 'Términos y Condiciones | NumTrip',
  description: 'Términos y condiciones de uso del directorio de contactos turísticos NumTrip',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage({ params }: Props) {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">

            {/* Introducción */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">1. Introducción</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Bienvenido a NumTrip, un directorio de contactos turísticos verificados. Al acceder y utilizar nuestro sitio web
                (numtrip.com), aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos
                términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            {/* Definiciones */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">2. Definiciones</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>"NumTrip"</strong> se refiere a nuestro directorio de contactos turísticos</li>
                <li><strong>"Usuario"</strong> se refiere a cualquier persona que accede a nuestro sitio web</li>
                <li><strong>"Negocio"</strong> se refiere a establecimientos turísticos listados en nuestro directorio</li>
                <li><strong>"Propietario"</strong> se refiere al dueño o representante autorizado de un negocio</li>
                <li><strong>"Contenido"</strong> incluye textos, imágenes, datos de contacto y otra información</li>
              </ul>
            </section>

            {/* Uso del Servicio */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso del Servicio</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Uso Permitido</h3>
              <p className="text-gray-700 mb-4">
                NumTrip está diseñado para ayudar a turistas a encontrar información de contacto verificada de negocios
                turísticos en Colombia. Puedes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                <li>Buscar y contactar negocios turísticos</li>
                <li>Agregar tu negocio al directorio</li>
                <li>Reportar información incorrecta</li>
                <li>Compartir enlaces a perfiles de negocios</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Uso Prohibido</h3>
              <p className="text-gray-700 mb-2">No puedes utilizar NumTrip para:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Spam o comunicaciones no solicitadas masivas</li>
                <li>Publicar información falsa o engañosa</li>
                <li>Infringir derechos de propiedad intelectual</li>
                <li>Realizar actividades ilegales o fraudulentas</li>
                <li>Interferir con el funcionamiento del sitio</li>
                <li>Extraer datos masivamente sin autorización</li>
              </ul>
            </section>

            {/* Registro y Cuentas */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Registro y Cuentas de Negocio</h2>
              <p className="text-gray-700 mb-4">
                Al registrar tu negocio en NumTrip, garantizas que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Eres el propietario legal o representante autorizado del negocio</li>
                <li>Toda la información proporcionada es exacta y actualizada</li>
                <li>Tienes derecho a publicar la información de contacto proporcionada</li>
                <li>Mantendrás la información actualizada</li>
                <li>No crearás múltiples perfiles para el mismo negocio</li>
              </ul>
            </section>

            {/* Contenido y Verificación */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contenido y Verificación</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Verificación de Información</h3>
              <p className="text-gray-700 mb-4">
                NumTrip se esfuerza por mantener información precisa, pero no garantiza la exactitud, completitud o
                actualidad de toda la información. Los usuarios pueden reportar información incorrecta para ayudar
                en el proceso de verificación.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Responsabilidad del Contenido</h3>
              <p className="text-gray-700">
                Los propietarios de negocios son responsables de la exactitud de su información. NumTrip no se hace
                responsable por transacciones, servicios o experiencias entre usuarios y negocios listados.
              </p>
            </section>

            {/* Propiedad Intelectual */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                El sitio web NumTrip, incluyendo su diseño, código, marcas y contenido original, está protegido por
                derechos de autor y otras leyes de propiedad intelectual.
              </p>
              <p className="text-gray-700">
                Los datos de contacto de negocios son proporcionados por los propietarios o están disponibles públicamente.
                Los propietarios mantienen los derechos sobre la información de sus negocios.
              </p>
            </section>

            {/* Limitación de Responsabilidad */}
            <section className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">7. Limitación de Responsabilidad</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium mb-2">Importante:</p>
                <p className="text-yellow-700 text-sm">
                  NumTrip actúa únicamente como un directorio de información. No somos responsables por la calidad
                  de servicios, transacciones comerciales, o experiencias entre usuarios y negocios.
                </p>
              </div>
              <p className="text-gray-700">
                En la máxima medida permitida por la ley, NumTrip no será responsable por daños directos, indirectos,
                incidentales, especiales o consecuentes que resulten del uso del servicio.
              </p>
            </section>

            {/* Privacidad */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacidad</h2>
              <p className="text-gray-700">
                Nuestra política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información.
                Al utilizar NumTrip, aceptas nuestras prácticas de privacidad descritas en nuestra{' '}
                <Link href={`/${params.locale}/privacy`} className="text-primary-blue hover:underline">
                  Política de Privacidad
                </Link>.
              </p>
            </section>

            {/* Modificaciones */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modificaciones</h2>
              <p className="text-gray-700">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán
                en vigor inmediatamente después de su publicación. Es tu responsabilidad revisar periódicamente estos términos.
              </p>
            </section>

            {/* Terminación */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Terminación</h2>
              <p className="text-gray-700">
                Podemos suspender o terminar tu acceso al servicio en cualquier momento si violas estos términos.
                Los propietarios pueden solicitar la eliminación de su negocio del directorio en cualquier momento.
              </p>
            </section>

            {/* Ley Aplicable */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Ley Aplicable</h2>
              <p className="text-gray-700">
                Estos términos se rigen por las leyes de Colombia. Cualquier disputa será resuelta en los tribunales
                competentes de Cartagena, Colombia.
              </p>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> legal@numtrip.com</li>
                  <li><strong>Dirección:</strong> Cartagena, Colombia</li>
                  <li><strong>Sitio web:</strong> numtrip.com</li>
                </ul>
              </div>
            </section>

          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href={`/${params.locale}`}
            className="text-primary-blue hover:text-primary-blue-dark transition-colors"
          >
            ← Volver al Inicio
          </Link>
          <Link
            href={`/${params.locale}/privacy`}
            className="text-primary-blue hover:text-primary-blue-dark transition-colors"
          >
            Política de Privacidad →
          </Link>
        </div>
      </div>
    </div>
  );
}