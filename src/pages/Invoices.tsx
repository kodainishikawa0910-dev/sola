import { useState, useMemo } from 'react'
import './Invoices.css'
import { invoices, getCustomer } from '../data/master'

export default function Invoices() {
  const [filter, setFilter] = useState({ status: '', customer: '' })

  const statusOptions = [...new Set(invoices.map((inv) => inv.status))]

  const filtered = useMemo(() => invoices.filter((inv) => {
    const cust = getCustomer(inv.customerId)
    return (
      (!filter.status || inv.status === filter.status) &&
      (!filter.customer || (cust?.kanji ?? '').includes(filter.customer))
    )
  }), [filter])

  const reset = () => setFilter({ status: '', customer: '' })

  return (
    <div className="inv-page">
      <div className="inv-page-header">
        <div>
          <div className="inv-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="inv-bc-current">売上請求一覧</span>
          </div>
          <div className="inv-page-title">売上請求一覧</div>
        </div>
        <button className="inv-new-btn">＋ 新規発行</button>
      </div>

      <div className="inv-content">
        {/* フィルタ */}
        <div className="inv-filter">
          <div className="inv-filter-grid">
            <div className="inv-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="inv-filter-field">
              <label>顧客名</label>
              <input type="text" placeholder="例：田中" value={filter.customer} onChange={(e) => setFilter({ ...filter, customer: e.target.value })} />
            </div>
          </div>
          <div className="inv-filter-actions">
            <button className="inv-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="inv-filter-result">{filtered.length}件の請求書が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>請求番号</th>
                <th>件名 / 顧客</th>
                <th style={{ width: 120, textAlign: 'right' }}>請求金額（税込）</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 90 }}>発行日</th>
                <th style={{ width: 90 }}>入金期限</th>
                <th style={{ width: 90 }}>入金日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="inv-empty">該当する請求書が見つかりませんでした</td></tr>
              ) : (
                filtered.map((inv) => {
                  const cust = getCustomer(inv.customerId)
                  return (
                    <tr key={inv.id}>
                      <td className="inv-no">{inv.id.replace('inv-', 'INV-')}</td>
                      <td>
                        <div className="inv-title">{inv.title}</div>
                        <div className="inv-customer">{cust?.kanji ?? '—'} {cust?.honorific ?? ''}</div>
                      </td>
                      <td className="inv-amount">¥{inv.total.toLocaleString()}</td>
                      <td>
                        <span className="inv-status" style={{ background: inv.statusBg, color: inv.statusColor }}>{inv.status}</span>
                      </td>
                      <td className="inv-date">{inv.issueDate}</td>
                      <td className="inv-date">{inv.dueDate}</td>
                      <td>{inv.paidDate ? <span className="inv-paid">{inv.paidDate}</span> : <span className="inv-date">—</span>}</td>
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
