'use client';

import { useState, useEffect, use } from 'react';
import { useCart } from '../../../contexts/cart.context';
import { Navbar } from '../../../components/ui/Navbar';

type Step = 'address' | 'payment' | 'success';

interface Address {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
}

const PROVINCES = ['กรุงเทพมหานคร', 'เชียงใหม่', 'เชียงราย', 'ขอนแก่น', 'นครราชสีมา', 'ภูเก็ต', 'สงขลา', 'อื่นๆ'];

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const params = use(paramsPromise);
  const locale = params?.locale ?? 'th';
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [addr, setAddr] = useState<Address>({ fullName: '', phone: '', address: '', district: '', province: 'กรุงเทพมหานคร', postalCode: '' });
  const [countdown, setCountdown] = useState(900); // 15 min
  const [paid, setPaid] = useState(false);

  const shipping = total >= 500 ? 0 : 50;
  const grandTotal = total + shipping;

  // QR countdown
  useEffect(() => {
    if (step !== 'payment') return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Mock payment polling (prod: poll API every 3s)
  useEffect(() => {
    if (step !== 'payment') return;
    const t = setTimeout(() => {
      // In production: check payment status from backend
      // setPaid(true); setStep('success');
    }, 3000);
    return () => clearTimeout(t);
  }, [step]);

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  const isAddrValid = addr.fullName && addr.phone && addr.address && addr.postalCode;

  if (items.length === 0 && step !== 'success') {
    return (
      <>
        <Navbar locale={locale} />
        <main style={{ paddingTop: '5rem' }}>
          <div className="container section" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1rem' }}>ตะกร้าว่างเปล่า</h2>
            <a href={`/${locale}/products`} className="btn btn-dark">เลือกซื้อกาแฟ →</a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar locale={locale} />
      <main style={{ paddingTop: '5rem' }}>
        <div className="container section-sm">

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem', maxWidth: '400px' }}>
            {(['address', 'payment', 'success'] as Step[]).map((s, i) => {
              const labels = ['ที่อยู่', 'ชำระเงิน', 'สำเร็จ'];
              const done = ['address', 'payment', 'success'].indexOf(step) > i;
              const current = step === s;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'var(--ink-900)' : current ? 'var(--accent)' : 'var(--bg-warm)',
                      color: done || current ? '#fff' : 'var(--ink-500)',
                      fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s',
                    }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: current ? 'var(--ink-900)' : 'var(--ink-500)', fontWeight: current ? 600 : 400 }}>{labels[i]}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: done ? 'var(--ink-900)' : 'var(--border)', margin: '0 0.5rem', marginBottom: '1.25rem', transition: 'all 0.3s' }} />}
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Address ── */}
          {step === 'address' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '2rem' }}>ที่อยู่จัดส่ง</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'ชื่อ-นามสกุล', key: 'fullName', type: 'text', placeholder: 'สมชาย ใจดี' },
                    { label: 'เบอร์โทรศัพท์', key: 'phone', type: 'tel', placeholder: '08x-xxx-xxxx' },
                    { label: 'ที่อยู่', key: 'address', type: 'text', placeholder: '123 ถนนสุขุมวิท แขวง...' },
                    { label: 'เขต/อำเภอ', key: 'district', type: 'text', placeholder: 'วัฒนา' },
                    { label: 'รหัสไปรษณีย์', key: 'postalCode', type: 'text', placeholder: '10110' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', color: 'var(--ink-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(addr as any)[f.key]}
                        onChange={(e) => setAddr({ ...addr, [f.key]: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', font: 'inherit', fontSize: '0.95rem', background: 'var(--bg-white)', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--ink-900)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        id={`checkout-${f.key}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', color: 'var(--ink-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>จังหวัด</label>
                    <select value={addr.province} onChange={(e) => setAddr({ ...addr, province: e.target.value })}
                      style={{ width: '100%', padding: '0.8rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', font: 'inherit', fontSize: '0.95rem', background: 'var(--bg-white)', outline: 'none' }}
                      id="checkout-province"
                    >
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  className="btn btn-dark"
                  style={{ marginTop: '2rem', width: '100%', justifyContent: 'center', opacity: isAddrValid ? 1 : 0.4 }}
                  disabled={!isAddrValid}
                  onClick={() => setStep('payment')}
                  id="proceed-to-payment"
                >
                  ดำเนินการชำระเงิน →
                </button>
              </div>

              {/* Mini order summary */}
              <div className="cart-summary" style={{ position: 'sticky', top: '6rem' }}>
                <div className="cs-title">สรุปรายการ</div>
                {items.map((i) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span>{i.nameTh} {i.weightGram}g × {i.quantity}</span>
                    <span>฿{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="cs-row" style={{ marginTop: '0.75rem' }}>
                  <span>ค่าส่ง</span>
                  <span style={{ color: shipping === 0 ? '#22c55e' : undefined }}>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
                </div>
                <div className="cs-row total">
                  <span>ยอดชำระ</span>
                  <span className="cs-val">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: QR Payment ── */}
          {step === 'payment' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>สแกน QR ชำระเงิน</h2>
                <p style={{ color: 'var(--ink-500)', marginBottom: '2rem' }}>ใช้แอป Banking หรือ PromptPay สแกน QR ด้านล่าง</p>

                {/* QR Code placeholder — production: fetch from /api/v1/payments/orders/:id/initiate */}
                <div style={{ display: 'inline-block', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '240px', height: '240px', background: 'var(--bg)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', position: 'relative' }}>
                    {/* Actual QR from GB Pay will render here */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', width: '220px', height: '220px', padding: '8px', background: '#fff' }}>
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} style={{ background: Math.random() > 0.5 ? '#1C1814' : 'transparent', borderRadius: '1px' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-500)' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--ink-900)', display: 'block' }}>฿{grandTotal.toLocaleString()}</span>
                    Eight Coffee Roasters
                  </div>
                </div>

                {/* Countdown */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: countdown > 60 ? '#22c55e' : '#ef4444', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--ink-500)' }}>QR หมดอายุใน <strong style={{ color: countdown < 60 ? '#ef4444' : 'var(--ink-900)' }}>{mm}:{ss}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={() => setStep('address')}>← แก้ไขที่อยู่</button>
                  {/* Dev only: simulate payment */}
                  <button className="btn btn-accent" onClick={() => { clear(); setStep('success'); }} id="simulate-payment-btn">
                    [Dev] จำลองชำระเงิน
                  </button>
                </div>

                <div style={{ marginTop: '2rem', background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '1rem 1.5rem', fontSize: '0.82rem', color: 'var(--ink-500)', textAlign: 'left' }}>
                  <strong style={{ color: 'var(--ink-700)' }}>วิธีชำระ:</strong><br />
                  1. เปิดแอปธนาคารหรือ Wallet ของคุณ<br />
                  2. เลือก "สแกน QR" หรือ "PromptPay"<br />
                  3. สแกน QR Code ด้านบน<br />
                  4. ยืนยันจำนวนเงิน ฿{grandTotal.toLocaleString()} แล้วกดยืนยัน
                </div>
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <div className="cs-title">ที่อยู่จัดส่ง</div>
                <div style={{ font: 'inherit', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--ink-700)', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                  <strong>{addr.fullName}</strong><br />
                  {addr.phone}<br />
                  {addr.address}<br />
                  {addr.district}, {addr.province} {addr.postalCode}
                </div>
                <div className="cs-title" style={{ fontSize: '1rem' }}>รายการสินค้า</div>
                {items.map((i) => (
                  <div key={i.id} className="cs-row" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>{i.nameTh} {i.weightGram}g ×{i.quantity}</span>
                    <span>฿{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="cs-row total">
                  <span>รวมทั้งสิ้น</span>
                  <span className="cs-val">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto', padding: '4rem 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.75rem' }}>ชำระเงินสำเร็จ!</h2>
              <p style={{ color: 'var(--ink-500)', marginBottom: '2rem', lineHeight: 1.7 }}>
                ขอบคุณที่ซื้อกาแฟจาก Eight Coffee Roasters<br />
                เราจะทำการคั่วสดและแจ้งสถานะผ่าน LINE ทุกขั้นตอน<br />
                คาดว่าจะได้รับสินค้าภายใน <strong>3–5 วันทำการ</strong>
              </p>
              <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>เลขที่ออเดอร์</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>ORD-{Date.now().toString().slice(-6)}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-500)' }}>
                  📦 คั่วสด → พักแก๊ส → Flash Express 48h<br />
                  🔔 แจ้งเตือนทุกขั้นตอนผ่าน LINE OA
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a href={`/${locale}/orders`} className="btn btn-outline">ติดตามออเดอร์</a>
                <a href={`/${locale}/products`} className="btn btn-dark">เลือกซื้อต่อ →</a>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
