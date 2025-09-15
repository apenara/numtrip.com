export enum BusinessCategory {
  HOTEL = 'HOTEL',
  TOUR = 'TOUR',
  TRANSPORT = 'TRANSPORT',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  OTHER = 'OTHER',
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  category: BusinessCategory;
  verified: boolean;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  googlePlaceId?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;

  // Contact aggregation for UI
  contacts?: Contact[];

  // Business stats
  viewCount?: number;
  validationRatio?: number;

  // Calculated fields
  distance?: number;
  slug?: string;
}

export interface Contact {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'WEBSITE';
  value: string;
  verified: boolean;
  primaryContact: boolean;
  label?: string;
}

export interface BusinessSearchParams {
  query?: string;
  city?: string;
  category?: BusinessCategory;
  verified?: boolean;
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface BusinessSearchResponse {
  items: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BusinessMetadata {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  canonicalUrl: string;
  alternateUrls: { [locale: string]: string };
  structuredData: any;
}

export interface BusinessValidation {
  id: string;
  businessId: string;
  contactType: string;
  isCorrect: boolean;
  reportedBy: string;
  createdAt: string;
  notes?: string;
}

export interface BusinessClaim {
  id: string;
  businessId: string;
  claimantId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationMethod: string;
  verificationToken?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Component Props Types
export interface BusinessCardProps {
  business: Business;
  showDistance?: boolean;
  compact?: boolean;
  className?: string;
  onClick?: (business: Business) => void;
}

export interface ContactButtonProps {
  type: Contact['type'];
  value: string;
  verified?: boolean;
  businessName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'link' | 'icon';
}

// Search and Filter Types
export interface SearchFilters {
  category?: BusinessCategory;
  city?: string;
  verified?: boolean;
  hasPhone?: boolean;
  hasWhatsApp?: boolean;
  hasEmail?: boolean;
  hasWebsite?: boolean;
}

export interface SortOption {
  field: 'name' | 'verified' | 'createdAt' | 'viewCount' | 'distance';
  direction: 'asc' | 'desc';
  label: string;
}

// Analytics Types
export interface BusinessAnalytics {
  businessId: string;
  totalViews: number;
  weeklyViews: number;
  monthlyViews: number;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
  contactClicks: Array<{
    type: Contact['type'];
    count: number;
  }>;
  lastUpdated: string;
}