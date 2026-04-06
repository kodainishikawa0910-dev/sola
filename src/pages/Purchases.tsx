import { useState, useMemo } from 'react'
import './Purchases.css'
import { purchaseOrders, partners, sites, getPartner, getSite } from '../data/master'

export default function Purchases() {
  const [filter, setFilter] = useState({ status: '', partnerId: '', siteId: '' })

  const filtered = useMemo(() => purchaseOrders.filter((po) => {
    return (
      (!filter.status || po.status === filter.status) &&
      (!filter.partnerId || po.partnerId === filter.partnerId) &&
      (!filter.siteId || po.siteId === filter.siteId)
    )
  }), [filter])

  const reset = () => setFilter({ status: '', partnerId: '', siteId: '' })

  const statusOptions = [...new Set(purchaseOrders.map((po) => po.status))]

  return (
    <div className="pur-page">
      <div className="pur-page-header">
        <div>
          <div className="pur-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="pur-bc-current">発注管理一覧</span>
          </div>
          <div className="pur-page-title">発注管理一覧</div>
        </div>
        <button className="pur-new-btn">＋ 新規発注</button>
      </div>

      <div className="pur-content">
        {/* フィルタ */}
        <div className="pur-filter">
          <div className="pur-filter-grid">
            <div className="pur-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="pur-filter-field">
              <label>協力会社</label>
              <select value={filter.partnerId} onChange={(e) => setFilter({ ...filter, partnerId: e.target.value })}>
                <option value="">すべて</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="pur-filter-field">
              <label>現場名</label>
              <select value={filter.siteId} onChange={(e) => setFilter({ ...filter, siteId: e.target.value })}>
                <option value="">すべて</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pur-filter-actions">
            <button className="pur-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="pur-filter-result">{filtered.length}件の発注が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="pur-table-wrap">
          <table className="pur-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>発注番号</th>
                <th>件名</th>
                <th style={{ width: 120 }}>協力会社</th>
                <th style={{ width: 140 }}>現場名</th>
                <th style={{ width: 110, textAlign: 'right' }}>金額</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 90 }}>発注日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="pur-empty">該当する発注が見つかりませんでした</td></tr>
              ) : (
                filtered.map((po) => {
                  const partner = getPartner(po.partnerId)
                  const site = getSite(po.siteId)
                  return (
                    <tr key={po.id}>
                      <td className="pur-no">{po.id.replace('po-', 'PO-')}</td>
                      <td><div className="pur-title">{po.title}</div></td>
                      <td className="pur-sub">{partner?.name ?? '—'}</td>
                      <td className="pur-sub">{site?.name ?? '—'}</td>
                      <td className="pur-amount">¥{po.amount.toLocaleString()}</td>
                      <td>
                        <span className="pur-status" style={{ background: po.statusBg, color: po.statusColor }}>{po.status}</span>
                      </td>
                      <td className="pur-date">{po.orderDate}</td>
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
