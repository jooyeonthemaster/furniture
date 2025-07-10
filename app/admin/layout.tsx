'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Users, BarChart3, Settings, 
  LogOut, Menu, X, Plus, Search, Bell
} from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '상품 관리', href: '/admin/manage', icon: Package },
  { name: '사용자 관리', href: '/admin/users', icon: Users },
  { name: '통계', href: '/admin/analytics', icon: BarChart3 },
  { name: '설정', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 임시로 인증 체크 비활성화
  /*
  useEffect(() => {
    if (!loading && (!user || user.email !== 'admin@luxefurniture.com')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!user || user.email !== 'admin@luxefurniture.com') {
    return null;
  }
  */

  // 임시 사용자 데이터
  const user = {
    name: 'Admin User',
    email: 'admin@luxefurniture.com'
  };

  const signOut = async () => {
    console.log('로그아웃');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-screen bg-muted border-r transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <Link href="/admin" className="text-xl font-light tracking-widest">
            LUXE ADMIN
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-sm rounded-lg hover:bg-background transition-colors group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 px-4 py-3 text-sm">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs opacity-60">관리자</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-medium">관리자 패널</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-80 xs:w-60 pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 