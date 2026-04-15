'use client';

import { useState } from 'react';

const GREEN_BEANS = [
  { id: 'gb001', origin: 'Ethiopia Yirgacheffe', process: 'Natural', lot: 'LOT-2025-042', purchasedKg: 20, remainingKg: 12.8, alertThresholdKg: 5, costPerKg: 620, supplier: 'Kochere Farm', arrivedAt: '2025-03-10' },
  { id: 'gb002', origin: 'Colombia Huila', process: 'Washed', lot: 'LOT-2025-039', purchasedKg: 30, remainingKg: 18.5, alertThresholdKg: 5, costPerKg: 480, supplier: 'Finca La Esperanza', arrivedAt: '2025-02-28' },
  { id: 'gb003', origin: 'Thailand Doi Chang', process: 'Honey', lot: 'LOT-2025-041', purchasedKg: 25, remainingKg: 14.2, alertThresholdKg: 5, costPerKg: 350, supplier: 'Doi Chang Village', arrivedAt: '2025-03-05' },
  { id: 'gb004', origin: 'Kenya AA', process: 'Washed', lot: 'LOT-2025-044', purchasedKg: 10, remainingKg: 3.5, alertThresholdKg: 5, costPerKg: 780, supplier: 'Nyeri Cooperative', arrivedAt: '2025-03-20' },
  { id: 'gb005', origin: 'Myanmar Shan', process: 'Natural', lot: 'LOT-2025-040', purchasedKg: 15, remainingKg: 1.8, alertThresholdKg: 3, costPerKg: 420, supplier: 'Shan Highlands', arrivedAt: '2025-03-01' },
  { id: 'gb006', origin: 'Brazil Cerrado', process: 'Natural', lot: 'LOT-2025-038', purchasedKg: 50, remainingKg: 28.3, alertThresholdKg: 10, costPerKg: 280, supplier: 'Fazenda Santa Lucia', arrivedAt: '2025-02-15' },
];

const ROASTED_STOCK = [
  { id: 'rs001', origin: 'Colombia Huila', roastLevel: 'Medium', batchId: 'ROAST-2025-088', roastedAt: '2025-04-10', roastedKg: 5.0, remainingKg: 3.2, degasReady: true, degasDaysLeft: 0 },
  { id: 'rs002', origin: 'Ethiopia Yirgacheffe', roastLevel: 'Light', batchId: 'ROAST-2025-089', roastedAt: '2025-04-12', roastedKg: 3.5, remainingKg: 2.1, degasReady: false, degasDaysLeft: 8 },
  { id: 'rs003', origin: 'Brazil Cerrado', roastLevel: 'Medium Dark', batchId: 'ROAST-2025-087', roastedAt: '2025-04-08', roastedKg: 8.0, remainingKg: 5.5, degasReady: true, degasDaysLeft: 0 },
  { id: 'rs004', origin: 'Thailand Doi Chang', roastLevel: 'Medium Light', batchId: 'ROAST-2025-086', roastedAt: '2025-04-07', roastedKg: 4.0, remainingKg: 1.8, degasReady: true, degasDaysLeft: 0 },
];

type Tab = 'green' | 'roasted';

export default function AdminInventoryPage() {
  const [tab, setTab] = useState<Tab>('green');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalGreenKg = GREEN_BEANS.reduce((s, b) => s + b.remainingKg, 0);
  const totalGreenValue = GREEN_BEANS.reduce((s, b) => s + b.remainingKg * b.costPerKg, 0);
  const lowStockCount = GREEN_BEANS.filter(b => b.remainingKg <= b.alertThresholdKg).length;
  const totalRoastedKg = ROASTED_STOCK.reduce((s, r) => s + r.remainingKg, 0);

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Inventory Management</h1>
        <button className="btn btn-dark btn-sm" onClick={() => setShowAddModal(true)} id="add-stock-btn">
          + รับสารกาแฟ
        </button>
      </div>
      <div className="admin-content">

        {/* Stats */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="admin-stat-card">
            <div className="asc-label">สารกาแฟดิบทั้งหมด</div>
            <div className="asc-value">{totalGreenKg.toFixed(1)} kg</div>
            <div className="asc-sub">{GREEN_BEANS.length} แหล่งผลิต</div>
          </div>
          <div className="admin-stat-card">
            <div className="asc-label">มูลค่าสต็อก</div>
            <div className="asc-value">฿{totalGreenValue.toLocaleString()}</div>
            <div className="asc-sub">ต้นทุนสารดิบรวม</div>
          </div>
          <div className="admin-stat-card">
            <div className="asc-label">⚠ Low Stock</div>
            <div className="asc-value" style={{ color: lowStockCount > 0 ? '#ef4444' : '#22c55e' }}>{lowStockCount} รายการ</div>
            <div className="asc-sub">ต่ำกว่า threshold</div>
          </div>
          <div className="admin-stat-card">
            <div className="asc-label">กาแฟคั่วพร้อมขาย</div>
            <div className="asc-value">{totalRoastedKg.toFixed(1)} kg</div>
            <div className="asc-sub">{ROASTED_STOCK.filter(r => r.degasReady).length} lot พร้อม Degas</div>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', width: 'fit-content', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <button className={`btn btn-sm ${tab === 'green' ? 'btn-dark' : 'btn-outline'}`} style={{ borderRadius: 0, border: 'none' }} onClick={() => setTab('green')}>
            🫘 สารกาแฟดิบ
          </button>
          <button className={`btn btn-sm ${tab === 'roasted' ? 'btn-dark' : 'btn-outline'}`} style={{ borderRadius: 0, border: 'none' }} onClick={() => setTab('roasted')}>
            ☕ กาแฟคั่วแล้ว
          </button>
        </div>

        {/* Green Bean Table */}
        {tab === 'green' && (
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <span className="admin-table-title">สารกาแฟดิบ (Green Beans) — FIFO Inventory</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Lot #</th>
                  <th>แหล่งผลิต</th>
                  <th>กระบวนการ</th>
                  <th>ซื้อ (kg)</th>
                  <th>คงเหลือ (kg)</th>
                  <th>ต้นทุน/kg</th>
                  <th>Supplier</th>
                  <th>วันรับ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {GREEN_BEANS.map((b) => {
                  const pct = (b.remainingKg / b.purchasedKg) * 100;
                  const isLow = b.remainingKg <= b.alertThresholdKg;
                  return (
                    <tr key={b.id}>
                      <td><code style={{ fontSize: '0.8rem', color: 'var(--ink-500)' }}>{b.lot}</code></td>
                      <td style={{ fontWeight: 500 }}>{b.origin}</td>
                      <td>{b.process}</td>
                      <td>{b.purchasedKg}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span style={{ fontWeight: 600, color: isLow ? '#ef4444' : 'var(--ink-900)' }}>{b.remainingKg}</span>
                          <div style={{ width: '80px', height: '4px', background: 'var(--bg)', borderRadius: '2px' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: isLow ? '#ef4444' : pct < 50 ? 'var(--accent)' : '#22c55e', borderRadius: '2px' }} />
                          </div>
                        </div>
                      </td>
                      <td>฿{b.costPerKg}</td>
                      <td style={{ color: 'var(--ink-500)', fontSize: '0.85rem' }}>{b.supplier}</td>
                      <td style={{ color: 'var(--ink-500)', fontSize: '0.85rem' }}>{b.arrivedAt}</td>
                      <td>
                        {isLow
                          ? <span className="badge badge-red">⚠ Low</span>
                          : pct < 50
                          ? <span className="badge badge-yellow">ปานกลาง</span>
                          : <span className="badge badge-green">ปกติ</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Roasted Stock Table */}
        {tab === 'roasted' && (
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <span className="admin-table-title">กาแฟคั่วแล้ว (Roasted Stock) — Degas Tracker</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>แหล่งผลิต</th>
                  <th>ระดับคั่ว</th>
                  <th>วันคั่ว</th>
                  <th>คั่ว (kg)</th>
                  <th>คงเหลือ (kg)</th>
                  <th>Degas</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {ROASTED_STOCK.map((r) => (
                  <tr key={r.id}>
                    <td><code style={{ fontSize: '0.8rem', color: 'var(--ink-500)' }}>{r.batchId}</code></td>
                    <td style={{ fontWeight: 500 }}>{r.origin}</td>
                    <td>{r.roastLevel}</td>
                    <td style={{ color: 'var(--ink-500)', fontSize: '0.85rem' }}>{r.roastedAt}</td>
                    <td>{r.roastedKg}</td>
                    <td style={{ fontWeight: 600 }}>{r.remainingKg}</td>
                    <td>
                      {r.degasReady
                        ? <span className="badge badge-green">✓ พร้อม</span>
                        : <span className="badge badge-yellow">⏱ อีก {r.degasDaysLeft} วัน</span>
                      }
                    </td>
                    <td>
                      {r.remainingKg < 1
                        ? <span className="badge badge-red">เกือบหมด</span>
                        : <span className="badge badge-blue">มีสต็อก</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add stock modal (basic) */}
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
            <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--r-lg)', padding: '2rem', maxWidth: '480px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>รับสารกาแฟเข้าสต็อก</h3>
              {['แหล่งผลิต', 'กระบวนการ', 'Lot Number', 'น้ำหนัก (kg)', 'ต้นทุนต่อ kg (฿)', 'Supplier'].map((label) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-500)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                  <input style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', font: 'inherit', fontSize: '0.9rem' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>ยกเลิก</button>
                <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>บันทึก</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
