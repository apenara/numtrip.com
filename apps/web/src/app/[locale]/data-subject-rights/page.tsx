import { Metadata } from 'next';
import DataSubjectRightsClient from './data-subject-rights-client';

export const metadata: Metadata = {
  title: 'Derechos del Titular de Datos - NumTrip',
  description: 'Ejercita tus derechos de protección de datos personales según GDPR - acceso, rectificación, supresión y más',
  keywords: 'GDPR, derechos de datos, privacidad, protección de datos, NumTrip',
};

export default function DataSubjectRightsPage() {
  return <DataSubjectRightsClient />;
}