import { useState, useMemo } from 'react'
import './Sites.css'
import { sites, staff, getCustomer, getStaff } from '../data/master'

const statusColors: Record<string, { bg: string; color: string }> = {
  sekou:  { bg: '#DBEAFE', color: '#1D4ED8' },
  kanryo: { bg: '#D1FAE5', color: '#065F46' },
  chakkou:{ bg: '#FEF3C7', color: '#92400E' },
  seikyu: { bg: '#FCE7F3', color: '#9D174D' },
  chudan: { bg: '#F3F4F6', color: '#374151' },
}

const statusOptions = [
  { value: 'sekou', label: '施工中' },
  { value: 'kanryo', label: '完了' },
  { value: 'chakkou', label: '着工前' },
  { value: 'seikyu', label: '請求待ち' },
  { value: 'chudan', label: '見積中' },
]

export default function Sites() {
  const [filter, setFilter] = useState({ statusClass: '', customer: '', staffId: '' })

  const filtered = useMemo(() => sites.filter((s) => {
    const cust = getCustomer(s.customerId)
    return (
      (!filter.statusClass || s.statusClass === filter.statusClass) &&
      (!filter.customer || (cust?.kanji ?? '').includes(filter.customer)) &&
      (!filter.staffId || s.staffId === filter.staffId)
    )
  }), [filter])

  const reset = () => setFilter({ statusClass: '', customer: '', staffId: '' })

  return (
    <div className="sit-page">
      <div className="sit-page-header">
        <div>
          <div className="sit-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="sit-bc-current">現場一覧</span>
          </div>
          <div className="sit-page-title">現場一覧</div>
        </div>
        <button className="sit-new-btn">＋ 新規登録</button>
      </div>

      <div className="sit-content">
        {/* フィルタ */}
        <div className="sit-filter">
          <div className="sit-filter-grid">
            <div className="sit-filter-field">
              <label>ステータス</label>
              <select value={filter.statusClass} onChange={(e) => setFilter({ ...filter, statusClass: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="sit-filter-field">
              <label>顧客名</label>
              <input type="text" placeholder="例：田中" value={filter.customer} onChange={(e) => setFilter({ ...filter, customer: e.target.value })} />
            </div>
            <div className="sit-filter-field">
              <label>担当者</label>
              <select value={filter.staffId} onChange={(e) => setFilter({ ...filter, staffId: e.target.value })}>
                <option value="">すべて</option>
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="sit-filter-actions">
            <button className="sit-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="sit-filter-result">{filtered.length}件の現場が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="sit-table-wrap">
          <table className="sit-table">
            <thead>
              <tr>
                <th>現場名</th>
                <th style={{ width: 120 }}>顧客名</th>
                <th style={{ width: 160 }}>工期</th>
                <th style={{ width: 90 }}>担当者</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 120, textAlign: 'right' }}>受注金額</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="sit-empty">該当する現場が見つかりませんでした</td></tr>
              ) : (
                filtered.map((s) => {
                  const cust = getCustomer(s.customerId)
                  const st = getStaff(s.staffId)
                  const sc = statusColors[s.statusClass] ?? { bg: '#F3F4F6', color: '#374151' }
                  return (
                    <tr key={s.id}>
                      <td><div className="sit-name">{s.name}</div></td>
                      <td className="sit-customer">{cust?.kanji ?? '—'} {cust?.honorific ?? ''}</td>
                      <td className="sit-period">{s.periodStart} 〜 {s.periodEnd}</td>
                      <td className="sit-staff">{st?.name ?? '—'}</td>
                      <td>
                        <span className="sit-status" style={{ background: sc.bg, color: sc.color }}>{s.status}</span>
                      </td>
                      <td className="sit-amount">{s.amount > 0 ? `¥${s.amount.toLocaleString()}` : '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
