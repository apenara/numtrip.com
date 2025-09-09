import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">NumTrip</span>
            </div>
            <p className="text-sm text-gray-400">
              Tu directorio confiable de contactos turísticos verificados en Cartagena y más allá.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm hover:text-white transition-colors">
                  Buscar Negocios
                </Link>
              </li>
              <li>
                <Link href="/claim-business" className="text-sm hover:text-white transition-colors">
                  Reclamar Negocio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?category=HOTEL" className="text-sm hover:text-white transition-colors">
                  Hoteles
                </Link>
              </li>
              <li>
                <Link href="/search?category=RESTAURANT" className="text-sm hover:text-white transition-colors">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/search?category=TOUR" className="text-sm hover:text-white transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/search?category=TRANSPORT" className="text-sm hover:text-white transition-colors">
                  Transporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                Cartagena, Colombia
              </li>
              <li className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="mailto:info@numtrip.com" className="hover:text-white transition-colors">
                  info@numtrip.com
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+573001234567" className="hover:text-white transition-colors">
                  +57 300 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              © {currentYear} NumTrip. Todos los derechos reservados. VAN BOMMEL IORIO SAS
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}