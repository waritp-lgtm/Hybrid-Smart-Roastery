'use client';

import { Navbar } from '../../../components/ui/Navbar';
import { useCart } from '../../../contexts/cart.context';

export default function CartPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'th';
  const { items, removeItem, updateQty, total } = useCart();

  const shipping = total >= 500 ? 0 : 50;
  const grandTotal = total + shipping;

  return (
    <>
      <Navbar locale={locale} />
      <main style={{ paddingTop: '5rem' }}>
        <div className="container section-sm">
          <div style={{ marginBottom: '2rem' }}>
            <p className="t-label" style={{ marginBottom: '0.5rem' }}>ตะกร้าสินค้า</p>
            <h1 className="t-h2">รายการสินค้า</h1>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>ตะกร้าว่างเปล่า</h2>
              <p style={{ color: 'var(--ink-500)', marginBottom: '2rem' }}>เลือกกาแฟที่ชอบแล้วเพิ่มในตะกร้า</p>
              <a href={`/${locale}/products`} className="btn btn-dark">เลือกซื้อกาแฟ →</a>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="t-label">{items.length} รายการ</span>
                  <span className="t-small" style={{ color: 'var(--accent)' }}>
                    {total >= 500 ? '✓ ฟรีค่าส่ง' : `อีก ฿${500 - total} รับฟรีค่าส่ง`}
                  </span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-img">☕</div>
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.nameTh}</div>
                      <div className="cart-item-sub">{item.origin} · {item.process} · {item.weightGram}g</div>
                      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="qty-ctrl" role="group" aria-label="Quantity">
                          <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease">−</button>
                          <span className="qty-num">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ fontSize: '0.8rem', color: 'var(--ink-500)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-sans)' }}
                          aria-label="Remove item"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">฿{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <div className="cs-title">สรุปรายการ</div>
                <div className="cs-row">
                  <span>ราคาสินค้า</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="cs-row">
                  <span>ค่าส่ง Flash Express</span>
                  <span style={{ color: shipping === 0 ? '#22c55e' : undefined }}>
                    {shipping === 0 ? 'ฟรี' : `฿${shipping}`}
                  </span>
                </div>
                <div className="cs-row total">
                  <span>ยอดชำระ</span>
                  <span className="cs-val">฿{grandTotal.toLocaleString()}</span>
                </div>

                <a href={`/${locale}/checkout`} className="btn btn-dark" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                  ชำระเงิน →
                </a>
                <a href={`/${locale}/products`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                  เลือกสินค้าเพิ่ม
                </a>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--r-sm)', fontSize: '0.8rem', color: 'var(--ink-500)' }}>
                  🔒 ชำระผ่าน PromptPay QR · ปลอดภัย 100%<br />
                  🚚 จัดส่ง Flash Express ทั่วไทย 48h
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
