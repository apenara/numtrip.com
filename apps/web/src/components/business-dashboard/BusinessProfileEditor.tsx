'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  AlertCircle, 
  Clock, 
  Globe, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone,
  Save,
  Upload
} from 'lucide-react';

interface BusinessData {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  verified: boolean;
}

export function BusinessProfileEditor() {
  const { user } = useAuthStore();
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [businessId] = useState('cmf7ofthb0000c15cqexub8yc'); // Mock ID

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        // Mock data for demonstration
        const mockBusiness: BusinessData = {
          id: businessId,
          name: 'Hotel Caribe Plaza',
          description: 'Luxury hotel in the heart of Cartagena with stunning ocean views and world-class amenities.',
          category: 'HOTEL',
          address: 'Calle 1 # 2-87, Centro Histórico, Cartagena, Colombia',
          phone: '+57 5 664 0000',
          email: 'info@hotelcaribeplaza.com',
          whatsapp: '+57 300 123 4567',
          website: 'https://hotelcaribeplaza.com',
          verified: true,
        };

        setBusiness(mockBusiness);
      } catch (error) {
        console.error('Failed to fetch business:', error);
        setMessage({ type: 'error', text: 'Failed to load business information' });
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    setMessage(null);

    try {
      // In production, this would call the API:
      // const response = await fetch(`/api/v1/business-dashboard/${businessId}/profile`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify(business)
      // });

      // Mock success for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Business profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update business profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    if (!business) return;
    setBusiness({ ...business, [field]: value });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">Failed to load business information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {business.verified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
            <p className="text-green-800 font-medium">
              Your business is verified and live on NumTrip
            </p>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="name"
                value={business.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={business.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="HOTEL">Hotel</option>
                <option value="TOUR">Tour Agency</option>
                <option value="TRANSPORT">Transportation</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={business.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your business, services, and what makes you unique..."
            />
            <p className="text-xs text-gray-500 mt-1">
              A good description helps customers understand your services and improves your search ranking.
            </p>
          </div>

          <div className="mt-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Address
            </label>
            <input
              type="text"
              id="address"
              value={business.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full address including city and country"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={business.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+57 5 123 4567"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={business.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="info@yourbusiness.com"
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="inline h-4 w-4 mr-1" />
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={business.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+57 300 123 4567"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Website
              </label>
              <input
                type="url"
                id="website"
                value={business.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourbusiness.com"
              />
            </div>
          </div>
        </div>

        {/* Business Hours - Placeholder for future implementation */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Clock className="inline h-5 w-5 mr-2" />
            Business Hours
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Business hours editing will be available in the next update. 
              For now, you can mention your hours in the business description.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}