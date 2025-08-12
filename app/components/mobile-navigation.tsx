"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, Trophy, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Pronósticos', href: '/pronosticos', icon: Target },
  { name: 'Ranking', href: '/ranking', icon: Trophy },
  { name: 'Historial', href: '/historial', icon: BarChart3 },
  { name: 'Perfil', href: '/perfil', icon: User },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
