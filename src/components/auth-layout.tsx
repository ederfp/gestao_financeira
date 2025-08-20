'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

interface AuthLayoutProps {
  children: React.ReactNode
}

const authPaths = ['/login', '/cadastro', '/esqueci-senha']

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = authPaths.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}