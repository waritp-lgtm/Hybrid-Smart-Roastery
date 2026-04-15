'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../../contexts/cart.context';

interface NavbarProps {
  locale?: string;
}

export function Navbar({ locale = 'th' }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 20);
      if (progressRef.current) {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressRef.current.style.width = `${pct}%`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" />
      <nav ref={navRef} className="nav" role="navigation" aria-label="Main navigation">
        <a href={`/${locale}`} className="nav-brand">
          <span className="brand-name">Eight Coffee</span>
          <span className="brand-tag">Roasters</span>
        </a>
        <div className="nav-links">
          <a href={`/${locale}/products`}>สินค้า</a>
          <a href={`/${locale}#features`}>ระบบ ERP</a>
          <a href={`/${locale}#process`}>กระบวนการ</a>
          <a href={`/${locale}/b2b`}>ราคาส่ง</a>
        </div>
        <div className="nav-right">
          <a href={locale === 'th' ? '/en' : '/th'} className="locale-btn" aria-label="Switch language">
            {locale === 'th' ? 'TH / EN' : 'EN / TH'}
          </a>
          <a href={`/${locale}/cart`} className="btn btn-outline btn-sm" id="cart-btn" aria-label={`Cart ${count} items`}>
            🛒 {count > 0 && <span className="cart-badge">{count}</span>}
          </a>
          <a href={`/${locale}/products`} className="btn btn-dark btn-sm">เลือกซื้อ</a>
        </div>
      </nav>
    </>
  );
}
