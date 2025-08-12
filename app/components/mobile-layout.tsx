"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { MobileNavigation } from './mobile-navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Rutas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Si es una ruta pública (login/register), mostrar sin layout
  if (isPublicRoute) {
    return (
      <ProtectedRoute requireAuth={false}>
        {children}
      </ProtectedRoute>
    )
  }

  // Para rutas protegidas, aplicar el layout completo
  return (
    <ProtectedRoute requireAuth={true}>
      {isMobile ? (
        <div className="min-h-screen bg-gray-50 pb-16">
          <Header />
          <main className="px-4 py-4">
            {children}
          </main>
          <MobileNavigation />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
