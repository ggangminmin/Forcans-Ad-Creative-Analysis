import Link from 'next/link'
import { Home, FileText, Settings, Layout, Sparkles } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] bg-white border-r border-gray-200 shadow-sm z-[100]">
      <div className="p-6">
        {/* 로고 영역 */}
        <div className="mb-12">
          <Link href="/" className="text-xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
            지피티코리아
          </Link>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-1">
          <SidebarLink href="/" icon={<Home size={18} />} label="Home" />
          
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Agent Services</span>
          </div>
          
          <SidebarLink 
            href="/ad-creative" 
             icon={<Sparkles size={18} />} 
             label="Ad Creative" 
             active 
          />
          
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Pages</span>
          </div>
          
          <SidebarLink href="/page1" icon={<FileText size={18} />} label="Page1" />
          <SidebarLink href="/page2" icon={<Layout size={18} />} label="Page2" />
          <SidebarLink href="/page3" icon={<Settings size={18} />} label="Page3" />
        </nav>
      </div>
    </aside>
  )
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm ${
        active 
          ? "bg-purple-50 text-purple-700 border border-purple-100/50 shadow-sm" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className={active ? "text-purple-600" : "text-gray-400"}>{icon}</span>
      {label}
    </Link>
  )
}