import { useState, useMemo } from 'react'
import './Partners.css'
import { partners, getPurchaseOrdersForPartner } from '../data/master'

export default function Partners() {
  const [filter, setFilter] = useState({ category: '', name: '' })

  const categoryOptions = [...new Set(partners.map((p) => p.category))]

  const filtered = useMemo(() => partners.filter((p) => {
    return (
      (!filter.category || p.category === filter.category) &&
      (!filter.name || p.name.includes(filter.name))
    )
  }), [filter])

  const reset = () => setFilter({ category: '', name: '' })

  return (
    <div className="par-page">
      <div className="par-page-header">
        <div>
          <div className="par-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="par-bc-current">協力会社一覧</span>
          </div>
          <div className="par-page-title">協力会社一覧</div>
        </div>
        <button className="par-new-btn">＋ 新規登録</button>
      </div>

      <div className="par-content">
        {/* フィルタ */}
        <div className="par-filter">
          <div className="par-filter-grid">
            <div className="par-filter-field">
              <label>業種</label>
              <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                <option value="">すべて</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="par-filter-field">
              <label>会社名</label>
              <input type="text" placeholder="例：内装" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
            </div>
          </div>
          <div className="par-filter-actions">
            <button className="par-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="par-filter-result">{filtered.length}件の協力会社が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="par-table-wrap">
          <table className="par-table">
            <thead>
              <tr>
                <th>会社名</th>
                <th style={{ width: 70 }}>業種</th>
                <th style={{ width: 100 }}>担当者</th>
                <th style={{ width: 110 }}>電話番号</th>
                <th style={{ width: 120 }}>所在地</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 80 }}>発注件数</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="par-empty">該当する協力会社が見つかりませんでした</td></tr>
              ) : (
                filtered.map((p) => {
                  const activePOs = getPurchaseOrdersForPartner(p.id).filter(
                    (po) => po.status !== '完了' && po.status !== '納品済'
                  )
                  return (
                    <tr key={p.id}>
                      <td><div className="par-name">{p.name}</div></td>
                      <td><span className="par-category">{p.category}</span></td>
                      <td className="par-contact">{p.contact}</td>
                      <td className="par-tel">{p.tel}</td>
                      <td className="par-addr">{p.addr}</td>
                      <td><span className="par-status" style={{ color: p.statusColor }}>{p.status}</span></td>
                      <td>
                        <div className="par-po-count">{activePOs.length}件（進行中）</div>
                      </td>
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
