import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  History,
  CloudSun,
  BookOpen,
  Settings,
  HelpCircle,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Plant', icon: ScanLine },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'environment', label: 'Environment', icon: CloudSun },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings', label: 'Settings & AI', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white py-6 px-4 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="space-y-1.5 flex-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Responsible AI note */}
        <div className="mt-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advisory Notice</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            AI results are indicative. Always verify with local agricultural extension before critical chemical treatments.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-3 flex justify-around items-center shadow-lg">
        {menu.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
