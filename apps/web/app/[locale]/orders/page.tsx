'use client';

import { useState } from 'react';
import { Navbar } from '../../../components/ui/Navbar';

const ORDER_STATES = [
  { key: 'PENDING_PAYMENT', label: 'รอชำระเงิน', icon: '💳', desc: 'รอการยืนยันจากธนาคาร' },
  { key: 'PAID', label: 'ชำระเงินแล้ว', icon: '✅', desc: 'ยืนยันการชำระเรียบร้อย' },
  { key: 'ROASTING', label: 'กำลังคั่วกาแฟ', icon: '🔥', desc: 'คั่วสดตามออเดอร์' },
  { key: 'READY_TO_SHIP', label: 'พักแก๊สและแพ็ค', icon: '📦', desc: 'พักแก๊สครบ พร้อมแพ็คจัดส่ง' },
  { key: 'SHIPPED', label: 'จัดส่งแล้ว', icon: '🚚', desc: 'Flash Express รับพัสดุแล้ว' },
  { key: 'DELIVERED', label: 'ส่งถึงมือแล้ว', icon: '🎉', desc: 'ได้รับสินค้าเรียบร้อย' },
];

// Mock order data — production: fetch from /api/v1/orders/:id
const MOCK_ORDER = {
  id: 'ORD-003',
  status: 'SHIPPED',
  items: [{ name: 'Thailand Doi Chang Honey 250g', qty: 1, price: 380 }],
  total: 430,
  shippingFee: 50,
  trackingNo: 'FX1234567890TH',
  customer: { name: 'คุณนภา มีสุข', address: 'เชียงใหม่' },
  estimatedDelivery: '2025-04-17',
  history: [
    { status: 'PENDING_PAYMENT', at: '14/04 16:00' },
    { status: 'PAID', at: '14/04 16:05' },
    { status: 'ROASTING', at: '15/04 08:00' },
    { status: 'READY_TO_SHIP', at: '15/04 14:30' },
    { status: 'SHIPPED', at: '15/04 17:20' },
  ],
};

export default function OrdersPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<typeof MOCK_ORDER | null>(null);
  const [notFound, setNotFound] = useState(false);

  const search = () => {
    if (orderId.toUpperCase() === 'ORD-003' || orderId === '') {
      setOrder(MOCK_ORDER);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const currentIdx = order ? ORDER_STATES.findIndex(s => s.key === order.status) : -1;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '5rem' }}>
        <div className="container section-sm">
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p className="t-label" style={{ marginBottom: '0.5rem' }}>Track Order</p>
            <h1 className="t-h2" style={{ marginBottom: '2rem' }}>ติดตามออเดอร์</h1>

            {/* Search */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem' }}>
              <input
                type="text"
                placeholder="เลขออเดอร์ เช่น ORD-003"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                id="order-search-input"
                style={{ flex: 1, padding: '0.85rem 1.25rem', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', font: 'inherit', fontSize: '0.95rem', background: 'var(--bg-white)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--ink-900)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button className="btn btn-dark" onClick={search} id="search-order-btn">ค้นหา</button>
            </div>

            {notFound && (
              <div style={{ textAlign: 'center', color: 'var(--ink-500)', padding: '2rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
                <p>ไม่พบออเดอร์ <strong>{orderId}</strong></p>
              </div>
            )}

            {/* Demo auto-load */}
            {!order && !notFound && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <button className="btn btn-outline" onClick={() => { setOrderId('ORD-003'); setOrder(MOCK_ORDER); }}>
                  ทดสอบด้วย ORD-003
                </button>
              </div>
            )}

            {/* Order Result */}
            {order && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Header */}
                <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>{order.id}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-500)', marginTop: '0.2rem' }}>{order.customer.name} · {order.customer.address}</div>
                    </div>
                    <span className="badge badge-blue">{ORDER_STATES.find(s => s.key === order.status)?.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                    <div><span style={{ color: 'var(--ink-500)' }}>ยอดชำระ </span><strong style={{ fontFamily: 'var(--font-serif)' }}>฿{order.total}</strong></div>
                    {order.trackingNo && (
                      <div><span style={{ color: 'var(--ink-500)' }}>Tracking </span><code style={{ color: 'var(--accent)' }}>{order.trackingNo}</code></div>
                    )}
                    {order.estimatedDelivery && (
                      <div><span style={{ color: 'var(--ink-500)' }}>คาดส่งถึง </span><strong>{order.estimatedDelivery}</strong></div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>สถานะออเดอร์</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {ORDER_STATES.map((state, idx) => {
                      const done = idx <= currentIdx;
                      const current = idx === currentIdx;
                      const histEntry = order.history.find(h => h.status === state.key);
                      return (
                        <div key={state.key} style={{ display: 'flex', gap: '1rem', paddingBottom: idx < ORDER_STATES.length - 1 ? '1.5rem' : '0', position: 'relative' }}>
                          {/* Vertical line */}
                          {idx < ORDER_STATES.length - 1 && (
                            <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: 0, width: '2px', background: done ? 'var(--ink-900)' : 'var(--border)' }} />
                          )}
                          {/* Icon */}
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: current ? 'var(--accent)' : done ? 'var(--ink-900)' : 'var(--bg-warm)', border: '2px solid', borderColor: current ? 'var(--accent)' : done ? 'var(--ink-900)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, transition: 'all 0.3s' }}>
                            {done ? (current ? state.icon : '✓') : <span style={{ opacity: 0.3 }}>{state.icon}</span>}
                          </div>
                          {/* Text */}
                          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: current ? 700 : done ? 600 : 400, color: done ? 'var(--ink-900)' : 'var(--ink-300)' }}>{state.label}</span>
                              {histEntry && <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)' }}>{histEntry.at}</span>}
                            </div>
                            {(done) && <div style={{ fontSize: '0.82rem', color: 'var(--ink-500)', marginTop: '0.15rem' }}>{state.desc}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>รายการสินค้า</div>
                  {order.items.map(item => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                      <span>{item.name} × {item.qty}</span>
                      <span>฿{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--ink-500)' }}>
                    <span>ค่าส่ง</span>
                    <span>{order.shippingFee === 0 ? 'ฟรี' : `฿${order.shippingFee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                    <span>รวม</span>
                    <span>฿{order.total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
