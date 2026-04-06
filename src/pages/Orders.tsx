import { useState, useMemo } from 'react'
import './Orders.css'
import { orders, staff, getCustomer, getStaff } from '../data/master'

const statusOptions = [
  { value: '施工中', label: '施工中' },
  { value: '完了', label: '完了' },
  { value: '着工前', label: '着工前' },
  { value: '請求待ち', label: '請求待ち' },
]

export default function Orders() {
  const [filter, setFilter] = useState({ status: '', customer: '', staffId: '' })

  const filtered = useMemo(() => orders.filter((o) => {
    const cust = getCustomer(o.customerId)
    return (
      (!filter.status || o.status === filter.status) &&
      (!filter.customer || (cust?.kanji ?? '').includes(filter.customer)) &&
      (!filter.staffId || o.staffId === filter.staffId)
    )
  }), [filter])

  const reset = () => setFilter({ status: '', customer: '', staffId: '' })

  return (
    <div className="ord-page">
      <div className="ord-page-header">
        <div>
          <div className="ord-breadcrumb">
            <a href="/">メニュー</a> ＞ <span>現場・受注管理</span> ＞ <span className="ord-bc-current">受注一覧</span>
          </div>
          <div className="ord-page-title">受注一覧</div>
        </div>
        <button className="ord-new-btn">＋ 新規登録</button>
      </div>

      <div className="ord-content">
        {/* フィルタ */}
        <div className="ord-filter">
          <div className="ord-filter-grid">
            <div className="ord-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="ord-filter-field">
              <label>顧客名</label>
              <input type="text" placeholder="例：田中" value={filter.customer} onChange={(e) => setFilter({ ...filter, customer: e.target.value })} />
            </div>
            <div className="ord-filter-field">
              <label>担当者</label>
              <select value={filter.staffId} onChange={(e) => setFilter({ ...filter, staffId: e.target.value })}>
                <option value="">すべて</option>
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="ord-filter-actions">
            <button className="ord-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="ord-filter-result">{filtered.length}件の受注が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="ord-table-wrap">
          <table className="ord-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>受注番号</th>
                <th>件名／顧客名</th>
                <th style={{ width: 120, textAlign: 'right' }}>受注金額</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 90 }}>営業担当</th>
                <th style={{ width: 100 }}>受注日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="ord-empty">該当する受注が見つかりませんでした</td></tr>
              ) : (
                filtered.map((o) => {
                  const cust = getCustomer(o.customerId)
                  const st = getStaff(o.staffId)
                  return (
                    <tr key={o.id}>
                      <td className="ord-id">{o.id}</td>
                      <td>
                        <div className="ord-title">{o.title}</div>
                        <div className="ord-customer">{cust?.kanji ?? '—'} {cust?.honorific ?? ''}</div>
                      </td>
                      <td className="ord-amount">¥{o.amount.toLocaleString()}</td>
                      <td>
                        <span className="ord-status" style={{ background: o.statusBg, color: o.statusColor }}>{o.status}</span>
                      </td>
                      <td className="ord-staff">{st?.name ?? '—'}</td>
                      <td className="ord-date">{o.orderDate}</td>
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
