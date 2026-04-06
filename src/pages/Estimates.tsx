import { useState, useMemo } from 'react'
import './Estimates.css'
import { estimates, staff, getCustomer, getStaff } from '../data/master'

export default function Estimates() {
  const [filter, setFilter] = useState({ status: '', customer: '', title: '', staffId: '' })

  const filtered = useMemo(() => estimates.filter((e) => {
    const cust = getCustomer(e.customerId)
    const s = getStaff(e.staffId)
    return (
      (!filter.status || e.status === filter.status) &&
      (!filter.customer || (cust?.kanji ?? '').includes(filter.customer)) &&
      (!filter.title || e.title.includes(filter.title)) &&
      (!filter.staffId || e.staffId === filter.staffId)
    )
  }), [filter])

  const reset = () => setFilter({ status: '', customer: '', title: '', staffId: '' })

  return (
    <div className="est-page">
      <div className="est-page-header">
        <div>
          <div className="est-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="est-bc-current">見積書一覧</span>
          </div>
          <div className="est-page-title">見積書一覧</div>
        </div>
        <button className="est-new-btn">＋ 新規作成</button>
      </div>

      <div className="est-content">
        {/* フィルタ */}
        <div className="est-filter">
          <div className="est-filter-grid">
            <div className="est-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                <option>作成中</option>
                <option>提出中</option>
                <option>受注済</option>
              </select>
            </div>
            <div className="est-filter-field">
              <label>顧客名</label>
              <input type="text" placeholder="例：田中" value={filter.customer} onChange={(e) => setFilter({ ...filter, customer: e.target.value })} />
            </div>
            <div className="est-filter-field">
              <label>件名</label>
              <input type="text" placeholder="例：内装" value={filter.title} onChange={(e) => setFilter({ ...filter, title: e.target.value })} />
            </div>
            <div className="est-filter-field">
              <label>担当者</label>
              <select value={filter.staffId} onChange={(e) => setFilter({ ...filter, staffId: e.target.value })}>
                <option value="">すべて</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="est-filter-actions">
            <button className="est-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="est-filter-result">{filtered.length}件の見積書が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="est-table-wrap">
          <table className="est-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>見積番号</th>
                <th>件名 / 顧客</th>
                <th style={{ width: 120, textAlign: 'right' }}>見積金額</th>
                <th style={{ width: 90 }}>ステータス</th>
                <th style={{ width: 100 }}>積算担当</th>
                <th style={{ width: 90 }}>作成日</th>
                <th style={{ width: 90 }}>有効期限</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="est-empty">該当する見積書が見つかりませんでした</td></tr>
              ) : (
                filtered.map((e) => {
                  const cust = getCustomer(e.customerId)
                  const s = getStaff(e.staffId)
                  return (
                    <tr key={e.id}>
                      <td className="est-no">{e.id.replace('est-', 'EST-')}</td>
                      <td>
                        <div className="est-title">{e.title}</div>
                        <div className="est-customer">{cust?.kanji ?? '—'} {cust?.honorific ?? ''}</div>
                      </td>
                      <td className="est-amount">¥{e.amount.toLocaleString()}</td>
                      <td>
                        <span className="est-status" style={{ background: e.statusBg, color: e.statusColor }}>{e.status}</span>
                      </td>
                      <td className="est-staff">{s?.name ?? '—'}</td>
                      <td className="est-date">{e.createdDate}</td>
                      <td className="est-date">{e.validUntil}</td>
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
