import { Facebook, MessageCircle, Globe, Phone, Mail } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import type { ProviderShop } from '../../types'
import { VI } from '@/shared/i18n/vi'

interface ShopContactsSectionProps {
  shop: ProviderShop
}

export function ShopContactsSection({ shop }: ShopContactsSectionProps) {
  const contacts = [
    shop.facebookUrl && {
      icon: Facebook,
      label: VI.provider.shop.facebook,
      url: shop.facebookUrl,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    shop.messengerUrl && {
      icon: MessageCircle,
      label: VI.provider.shop.messenger,
      url: shop.messengerUrl,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    shop.websiteUrl && {
      icon: Globe,
      label: VI.provider.shop.website,
      url: shop.websiteUrl,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
    shop.phone && {
      icon: Phone,
      label: shop.phone,
      url: `tel:${shop.phone}`,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
    },
    shop.email && {
      icon: Mail,
      label: shop.email,
      url: `mailto:${shop.email}`,
      color: 'bg-red-100 text-red-600 hover:bg-red-200',
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>
    label: string
    url: string
    color: string
  }>

  if (contacts.length === 0) {
    return null
  }

  return (
    <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-5 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
      <h3 className="mb-4 text-lg font-extrabold text-indigo-950">
        {VI.provider.shop.contact}
      </h3>
      <div className="flex flex-wrap gap-3">
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${contact.color}`}
          >
            <contact.icon className="h-4 w-4" />
            <span>{contact.label}</span>
          </a>
        ))}
      </div>
    </Card>
  )
}
