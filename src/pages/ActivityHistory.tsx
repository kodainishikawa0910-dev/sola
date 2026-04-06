import { useState, useMemo } from 'react'
import './ActivityHistory.css'
import {
  staff,
  journalEntries,
  customers,
  getCustomer,
  getSite,
  getStaff,
} from '../data/master'

const resultLabels: Record<string, string> = { good: '◎ 良好', normal: '○ 普通', bad: '△ 要注意', none: '— 未実施' }
const typeOptions = ['訪問', '電話', 'メール']

export default function ActivityHistory() {
  const [filter, setFilter] = useState({
    staffId: '',
    customerId: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    keyword: '',
  })

  const filtered = useMemo(() => {
    return journalEntries
      .filter((j) => {
        const cust = getCustomer(j.customerId)
        const site = getSite(j.siteId)
        return (
          (!filter.staffId || j.staffId === filter.staffId) &&
          (!filter.customerId || j.customerId === filter.customerId) &&
          (!filter.type || j.type === filter.type) &&
          (!filter.dateFrom || j.date >= filter.dateFrom) &&
          (!filter.dateTo || j.date <= filter.dateTo) &&
          (!filter.keyword ||
            j.comment.includes(filter.keyword) ||
            j.action.includes(filter.keyword) ||
            (cust?.kanji ?? '').includes(filter.keyword) ||
            (site?.name ?? '').includes(filter.keyword))
        )
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  }, [filter])

  const reset = () => setFilter({ staffId: '', customerId: '', type: '', dateFrom: '', dateTo: '', keyword: '' })

  // 日付ごとにグループ化
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach((j) => {
      const arr = map.get(j.date) ?? []
      arr.push(j)
      map.set(j.date, arr)
    })
    return Array.from(map.entries())
  }, [filtered])

  const DOW = ['日', '月', '火', '水', '木', '金', '土']
  const formatDate = (ds: string) => {
    const d = new Date(ds + 'T00:00:00')
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${DOW[d.getDay()]}）`
  }

  return (
    <div className="ah-page">
      <div className="ah-page-header">
        <div>
          <div className="ah-breadcrumb">
            <a href="/">メニュー</a> ＞ <a href="/activity">営業管理</a> ＞ <span className="ah-bc-current">行動履歴一覧</span>
          </div>
          <div className="ah-page-title">行動履歴一覧</div>
        </div>
      </div>

      <div className="ah-content">
        {/* 検索パネル */}
        <div className="ah-filter">
          <div className="ah-filter-grid">
            <div className="ah-filter-field">
              <label>担当者</label>
              <select value={filter.staffId} onChange={(e) => setFilter({ ...filter, staffId: e.target.value })}>
                <option value="">全員</option>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="ah-filter-field">
              <label>顧客</label>
              <select value={filter.customerId} onChange={(e) => setFilter({ ...filter, customerId: e.target.value })}>
                <option value="">すべて</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.kanji}</option>)}
              </select>
            </div>
            <div className="ah-filter-field">
              <label>行動種別</label>
              <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                <option value="">すべて</option>
                {typeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ah-filter-field">
              <label>フリーワード</label>
              <input type="text" placeholder="コメント・現場名など" value={filter.keyword} onChange={(e) => setFilter({ ...filter, keyword: e.target.value })} />
            </div>
            <div className="ah-filter-field">
              <label>期間（開始）</label>
              <input type="date" value={filter.dateFrom} onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })} />
            </div>
            <div className="ah-filter-field">
              <label>期間（終了）</label>
              <input type="date" value={filter.dateTo} onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })} />
            </div>
          </div>
          <div className="ah-filter-actions">
            <button className="ah-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="ah-filter-result">{filtered.length}件の行動履歴が見つかりました</div>
        </div>

        {/* 結果: 日付グループ */}
        {grouped.length === 0 ? (
          <div className="ah-empty">該当する行動履歴が見つかりませんでした</div>
        ) : (
          grouped.map(([date, entries]) => (
            <div key={date} className="ah-date-group">
              <div className="ah-date-label">
                <span className="ah-date-text">{formatDate(date)}</span>
                <span className="ah-date-count">{entries.length}件</span>
              </div>
              <table className="ah-table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>担当者</th>
                    <th style={{ width: 50 }}>種別</th>
                    <th style={{ width: 120 }}>顧客名</th>
                    <th>現場名</th>
                    <th style={{ width: 110 }}>行動内容</th>
                    <th style={{ width: 70 }}>結果</th>
                    <th>コメント</th>
                    <th style={{ width: 35 }}>見込</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((j) => {
                    const cust = getCustomer(j.customerId)
                    const site = getSite(j.siteId)
                    const s = getStaff(j.staffId)
                    return (
                      <tr key={j.id}>
                        <td className="ah-cell-staff">{s?.name ?? '—'}</td>
                        <td><span className={`ah-badge ah-badge-${j.typeClass}`}>{j.type}</span></td>
                        <td className="ah-cell-customer">{cust?.kanji ?? '—'}</td>
                        <td className="ah-cell-site">{site?.name ?? '—'}</td>
                        <td className="ah-cell-action">{j.action}</td>
                        <td>
                          <span className={`ah-result ah-result-${j.result}`}>
                            {resultLabels[j.result] ?? '—'}
                          </span>
                        </td>
                        <td className="ah-cell-comment">{j.comment}</td>
                        <td className="ah-cell-rank">
                          <span className={`ah-rank ah-rank-${j.rank.toLowerCase()}`}>{j.rank}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
