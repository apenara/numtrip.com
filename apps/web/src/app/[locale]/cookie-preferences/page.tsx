import { Metadata } from 'next';
import CookiePreferencesClient from './cookie-preferences-client';

export const metadata: Metadata = {
  title: 'Preferencias de Cookies - NumTrip',
  description: 'Gestiona tus preferencias de cookies y privacidad en NumTrip',
};

export default function CookiePreferencesPage() {
  return <CookiePreferencesClient />;
}