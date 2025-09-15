'use client';

import { useState } from 'react';
import {
  Mail,
  MessageCircle,
  Phone,
  Globe,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Business, ContactButtonProps } from '@/types/business';
import { cn } from '@/lib/utils';

interface ContactButtonsProps {
  business: Business;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon' | 'link';
  className?: string;
  showLabels?: boolean;
  maxButtons?: number;
}

export function ContactButtons({
  business,
  size = 'md',
  variant = 'button',
  className = '',
  showLabels = false,
  maxButtons = 4
}: ContactButtonsProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const contacts = [
    business.whatsapp && {
      type: 'whatsapp' as const,
      value: business.whatsapp,
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open(`https://wa.me/${business.whatsapp?.replace(/\D/g, '')}`, '_blank')
    },
    business.phone && {
      type: 'phone' as const,
      value: business.phone,
      icon: Phone,
      label: 'Teléfono',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.open(`tel:${business.phone}`, '_self')
    },
    business.email && {
      type: 'email' as const,
      value: business.email,
      icon: Mail,
      label: 'Email',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.open(`mailto:${business.email}`, '_self')
    },
    business.website && {
      type: 'website' as const,
      value: business.website,
      icon: Globe,
      label: 'Sitio Web',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => window.open(business.website, '_blank')
    }
  ].filter(Boolean).slice(0, maxButtons);

  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'px-2 py-1 text-xs',
          icon: 'p-1.5',
          iconSize: 'h-3 w-3',
          gap: 'gap-1'
        };
      case 'lg':
        return {
          button: 'px-4 py-3 text-base',
          icon: 'p-3',
          iconSize: 'h-6 w-6',
          gap: 'gap-2'
        };
      default: // md
        return {
          button: 'px-3 py-2 text-sm',
          icon: 'p-2',
          iconSize: 'h-4 w-4',
          gap: 'gap-1.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (contacts.length === 0) {
    return (
      <div className={cn("text-gray-400 text-sm", className)}>
        Sin contactos disponibles
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", sizeClasses.gap, className)}>
      {contacts.map((contact) => {
        if (!contact) return null;

        const Icon = contact.icon;
        const isCopied = copiedType === contact.type;

        if (variant === 'icon') {
          return (
            <div key={contact.type} className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  contact.action();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  copyToClipboard(contact.value, contact.type);
                }}
                className={cn(
                  "rounded-full text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
                  contact.color,
                  sizeClasses.icon
                )}
                title={`${contact.label}: ${contact.value}`}
                aria-label={`Contactar por ${contact.label}`}
              >
                {isCopied ? (
                  <Check className={sizeClasses.iconSize} />
                ) : (
                  <Icon className={sizeClasses.iconSize} />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {contact.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        }

        if (variant === 'link') {
          return (
            <a
              key={contact.type}
              href={contact.type === 'whatsapp' ? `https://wa.me/${contact.value.replace(/\D/g, '')}` :
                    contact.type === 'phone' ? `tel:${contact.value}` :
                    contact.type === 'email' ? `mailto:${contact.value}` :
                    contact.value}
              target={contact.type === 'whatsapp' || contact.type === 'website' ? '_blank' : '_self'}
              rel={contact.type === 'whatsapp' || contact.type === 'website' ? 'noopener noreferrer' : undefined}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center text-primary-blue hover:text-primary-blue-dark transition-colors",
                sizeClasses.gap
              )}
            >
              <Icon className={sizeClasses.iconSize} />
              {showLabels && <span>{contact.label}</span>}
              {(contact.type === 'whatsapp' || contact.type === 'website') && (
                <ExternalLink className="h-3 w-3" />
              )}
            </a>
          );
        }

        // Default: button variant
        return (
          <div key={contact.type} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                contact.action();
              }}
              className={cn(
                "inline-flex items-center rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
                contact.color,
                sizeClasses.button,
                sizeClasses.gap
              )}
              title={`${contact.label}: ${contact.value}`}
              aria-label={`Contactar por ${contact.label}`}
            >
              <Icon className={sizeClasses.iconSize} />
              {showLabels && <span>{contact.label}</span>}
            </button>

            {/* Copy button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(contact.value, contact.type);
              }}
              className={cn(
                "absolute -top-1 -right-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400",
                size === 'sm' ? 'p-0.5' : 'p-1'
              )}
              title="Copiar"
              aria-label={`Copiar ${contact.label}`}
            >
              {isCopied ? (
                <Check className="h-2.5 w-2.5" />
              ) : (
                <Copy className="h-2.5 w-2.5" />
              )}
            </button>
          </div>
        );
      })}

      {/* Show more indicator if contacts were truncated */}
      {maxButtons < [business.whatsapp, business.phone, business.email, business.website].filter(Boolean).length && (
        <div className="text-gray-400 text-xs">
          +{[business.whatsapp, business.phone, business.email, business.website].filter(Boolean).length - maxButtons}
        </div>
      )}
    </div>
  );
}

// Individual Contact Button Component
export function ContactButton({
  type,
  value,
  verified = false,
  businessName,
  className = '',
  size = 'md',
  variant = 'button'
}: ContactButtonProps) {
  const [copied, setCopied] = useState(false);

  const config = {
    PHONE: {
      icon: Phone,
      label: 'Teléfono',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.open(`tel:${value}`, '_self')
    },
    EMAIL: {
      icon: Mail,
      label: 'Email',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.open(`mailto:${value}`, '_self')
    },
    WHATSAPP: {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank')
    },
    WEBSITE: {
      icon: Globe,
      label: 'Sitio Web',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => window.open(value, '_blank')
    }
  };

  const contactConfig = config[type];
  const Icon = contactConfig.icon;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return variant === 'icon' ? 'p-1.5' : 'px-2 py-1 text-xs';
      case 'lg':
        return variant === 'icon' ? 'p-3' : 'px-4 py-3 text-base';
      default:
        return variant === 'icon' ? 'p-2' : 'px-3 py-2 text-sm';
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={contactConfig.action}
        onContextMenu={(e) => {
          e.preventDefault();
          copyToClipboard();
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
          contactConfig.color,
          getSizeClasses(),
          className
        )}
        title={`${contactConfig.label}: ${value}`}
        aria-label={`Contactar por ${contactConfig.label}`}
      >
        <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} />
        {variant !== 'icon' && (
          <span className="flex items-center gap-1">
            {contactConfig.label}
            {verified && <Check className="h-3 w-3" />}
          </span>
        )}
      </button>

      {copied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
          ¡Copiado!
        </div>
      )}
    </div>
  );
}