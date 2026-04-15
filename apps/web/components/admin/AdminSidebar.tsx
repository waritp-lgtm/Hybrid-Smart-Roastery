'use client';

import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/th/admin', icon: '📊', label: 'Dashboard' },
  { group: 'Production' },
  { href: '/th/admin/inventory', icon: '🗂️', label: 'Inventory' },
  { href: '/th/admin/roast', icon: '🔥', label: 'Roast Jobs' },
  { group: 'Commerce' },
  { href: '/th/admin/orders', icon: '📦', label: 'Orders' },
  { href: '/th/admin/products', icon: '☕', label: 'Products' },
  { group: 'System' },
  { href: '/th/admin/users', icon: '👥', label: 'Users & Roles' },
  { href: '/docs', icon: '📖', label: 'API Docs', target: '_blank' },
];

export function AdminSidebar() {
  const path = usePathname();
  return (
    <aside className="admin-sidebar" role="navigation" aria-label="Admin navigation">
      <div className="admin-sidebar-header">
        <div className="admin-brand">Eight Coffee</div>
        <div className="admin-brand-sub">ERP Admin Panel</div>
      </div>
      <nav className="admin-nav">
        {NAV_ITEMS.map((item, i) => {
          if ('group' in item) return (
            <div key={i} className="admin-nav-section">{item.group}</div>
          );
          const isActive = path === item.href || (item.href !== '/th/admin' && path.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              target={item.target}
              className={`admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
