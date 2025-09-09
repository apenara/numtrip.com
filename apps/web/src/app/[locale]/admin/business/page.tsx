'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { 
  Building2, 
  CheckCircle, 
  Globe, 
  Mail, 
  MapPin, 
  MessageCircle,
  Phone,
  Plus,
  Save,
  Trash2
} from 'lucide-react';

export default function BusinessProfilePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user's business
      const { data: businesses } = await supabase
        .from('businesses')
        .select(`
          *,
          contacts (*),
          cities (name, country)
        `)
        .eq('owner_id', session.user.id)
        .single();

      if (businesses) {
        setBusiness(businesses);
        setFormData({
          name: businesses.name || '',
          description: businesses.description || '',
          category: businesses.category || '',
          address: businesses.address || '',
          website: businesses.website || ''
        });
        setContacts(businesses.contacts || []);
      }
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setContacts(updatedContacts);
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        type: 'PHONE',
        value: '',
        verified: false,
        primary_contact: false,
        business_id: business.id
      }
    ]);
  };

  const removeContact = async (index: number) => {
    const contact = contacts[index];
    
    if (contact.id) {
      // Delete from database if it exists
      await supabase
        .from('contacts')
        .delete()
        .eq('id', contact.id);
    }
    
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update business info
      const { error: businessError } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category as Database['public']['Enums']['business_category'],
          address: formData.address,
          website: formData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', business.id);

      if (businessError) throw businessError;

      // Update contacts
      for (const contact of contacts) {
        if (contact.id) {
          // Update existing contact
          await supabase
            .from('contacts')
            .update({
              type: contact.type,
              value: contact.value,
              updated_at: new Date().toISOString()
            })
            .eq('id', contact.id);
        } else if (contact.value) {
          // Insert new contact
          await supabase
            .from('contacts')
            .insert({
              business_id: business.id,
              type: contact.type,
              value: contact.value,
              verified: false,
              primary_contact: false
            });
        }
      }

      // Reload data
      await loadBusinessData();
      
      // Show success message (you could use a toast library here)
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Negocio</h1>
        <p className="text-gray-600 mt-2">
          Administra la información de tu negocio
        </p>
      </div>

      {business && (
        <form onSubmit={handleSubmit}>
          {/* Business Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Estado del Perfil</h2>
              <div className="flex items-center gap-4">
                {business.verified ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verificado
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Verificar Ahora
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="HOTEL">Hotel</option>
                  <option value="RESTAURANT">Restaurante</option>
                  <option value="TOUR">Tour</option>
                  <option value="TRANSPORT">Transporte</option>
                  <option value="ATTRACTION">Atracción</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe tu negocio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Sitio Web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
              <button
                type="button"
                onClick={addContact}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </button>
            </div>

            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <select
                    value={contact.type}
                    onChange={(e) => handleContactChange(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PHONE">Teléfono</option>
                    <option value="EMAIL">Email</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="WEBSITE">Website</option>
                  </select>

                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      contact.type === 'PHONE' ? '+57 123 456 7890' :
                      contact.type === 'EMAIL' ? 'email@ejemplo.com' :
                      contact.type === 'WHATSAPP' ? '+57 123 456 7890' :
                      'https://...'
                    }
                  />

                  {contact.verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificado
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay contactos agregados. Haz clic en "Agregar" para añadir uno.
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}