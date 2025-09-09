import { Metadata } from 'next';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contacto - NumTrip',
  description: 'Contáctanos para cualquier consulta sobre NumTrip, el directorio turístico de contactos verificados',
};

export default function ContactPage() {
  return <ContactClient />;
}