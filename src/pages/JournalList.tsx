import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './JournalList.css'
import {
  staff,
  journalEntries,
  getCustomer,
  getSite,
} from '../data/master'

const DOW = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateJa(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DOW[d.getDay()]}）`
}

export default function JournalList() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 3, 6))

  const ds = toDateStr(selectedDate)

  // 全員の日誌をまとめて取得
  const dayEntries = useMemo(
    () => journalEntries.filter((j) => j.date === ds),
    [ds]
  )

  // 担当者ごとにグループ化
  const staffGroups = useMemo(() => {
    return staff.map((s) => {
      const entries = dayEntries.filter((j) => j.staffId === s.id)
      const visitCount = entries.filter((j) => j.typeClass === 'visit').length
      const phoneCount = entries.filter((j) => j.typeClass === 'phone').length
      const mailCount = entries.filter((j) => j.typeClass === 'mail').length
      return { ...s, entries, visitCount, phoneCount, mailCount }
    })
  }, [dayEntries])

  const totalCount = dayEntries.length
  const registeredCount = staffGroups.filter((g) => g.entries.length > 0).length
  const unregisteredCount = staff.length - registeredCount

  const nav = (dir: -1 | 1) => {
    setSelectedDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + dir)
      return d
    })
  }

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value + 'T00:00:00')
    if (!isNaN(d.getTime())) setSelectedDate(d)
  }

  const goToDetail = (staffId: string) => {
    navigate(`/journal/new?staff=${staffId}&date=${ds}`)
  }

  return (
    <div className="jl-page">
      <div className="jl-page-header">
        <div>
          <div className="jl-breadcrumb">
            <a href="/">メニュー</a> ＞ <a href="/journal">営業管理</a> ＞ <span className="jl-bc-current">日誌一覧</span>
          </div>
          <div className="jl-page-title">日誌一覧</div>
        </div>
      </div>

      <div className="jl-content">
        {/* 日付ナビ */}
        <div className="jl-date-header">
          <div className="jl-date-area">
            <div className="jl-date-nav">
              <button className="jl-date-nav-btn" onClick={() => nav(-1)}>◀</button>
              <span className="jl-date-display">{formatDateJa(selectedDate)}</span>
              <button className="jl-date-nav-btn" onClick={() => nav(1)}>▶</button>
            </div>
            <input type="date" className="jl-date-input" value={ds} onChange={handleDateInput} />
            <button className="jl-today-btn" onClick={() => setSelectedDate(new Date())}>今日</button>
          </div>
        </div>

        {/* 全体サマリー */}
        <div className="jl-summary">
          <div className="jl-summary-item">
            全体行動 <span className="jl-summary-count">{totalCount}</span> 件
          </div>
          <div className="jl-summary-item">
            登録済 <span className="jl-summary-count" style={{ color: '#059669' }}>{registeredCount}</span> 名
          </div>
          <div className="jl-summary-item">
            未登録 <span className="jl-summary-count" style={{ color: unregisteredCount > 0 ? '#DC2626' : '#9CA3AF' }}>{unregisteredCount}</span> 名
          </div>
        </div>

        {/* 担当者別カード */}
        <div className="jl-staff-list">
          {staffGroups.map((g) => (
            <div key={g.id} className={`jl-staff-card${g.entries.length === 0 ? ' empty' : ''}`}>
              <div className="jl-staff-header" onClick={() => goToDetail(g.id)}>
                <div className="jl-staff-info">
                  <span className="jl-staff-name">{g.name}</span>
                  <span className="jl-staff-role">{g.role}</span>
                </div>
                <div className="jl-staff-counts">
                  {g.entries.length > 0 ? (
                    <>
                      <span className="jl-sc-total">{g.entries.length}件</span>
                      {g.visitCount > 0 && <span className="jl-sc-badge visit">訪問 {g.visitCount}</span>}
                      {g.phoneCount > 0 && <span className="jl-sc-badge phone">電話 {g.phoneCount}</span>}
                      {g.mailCount > 0 && <span className="jl-sc-badge mail">メール {g.mailCount}</span>}
                    </>
                  ) : (
                    <span className="jl-sc-empty">未登録</span>
                  )}
                </div>
                <span className="jl-staff-arrow">→ 詳細</span>
              </div>

              {g.entries.length > 0 && (
                <table className="jl-entry-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>種別</th>
                      <th>顧客名</th>
                      <th>現場名</th>
                      <th style={{ width: 120 }}>行動内容</th>
                      <th style={{ width: 60 }}>結果</th>
                      <th>コメント</th>
                      <th style={{ width: 40 }}>見込</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.entries.map((j) => {
                      const cust = getCustomer(j.customerId)
                      const site = getSite(j.siteId)
                      return (
                        <tr key={j.id}>
                          <td>
                            <span className={`jl-badge jl-badge-${j.typeClass}`}>{j.type}</span>
                          </td>
                          <td className="jl-cell-customer">{cust?.kanji ?? '—'}</td>
                          <td className="jl-cell-site">{site?.name ?? '—'}</td>
                          <td className="jl-cell-action">{j.action}</td>
                          <td>
                            <span className={`jl-result jl-result-${j.result}`}>
                              {{ good: '◎', normal: '○', bad: '△', none: '—' }[j.result] ?? '—'}
                            </span>
                          </td>
                          <td className="jl-cell-comment">{j.comment}</td>
                          <td className="jl-cell-rank">
                            <span className={`jl-rank jl-rank-${j.rank.toLowerCase()}`}>{j.rank}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
