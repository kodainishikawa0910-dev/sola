import { useState, useMemo } from 'react'
import './ActivityFrequency.css'
import {
  staff,
  customers,
  journalEntries,
} from '../data/master'

type ViewMode = 'staff-customer' | 'staff-type' | 'customer-staff'

export default function ActivityFrequency() {
  const [viewMode, setViewMode] = useState<ViewMode>('staff-customer')
  const [month, setMonth] = useState('2026-04')

  // 対象月のエントリ
  const monthEntries = useMemo(
    () => journalEntries.filter((j) => j.date.startsWith(month)),
    [month]
  )

  // 全日付リスト（その月にデータのある日）
  const allDates = useMemo(() => {
    const set = new Set(monthEntries.map((j) => j.date))
    return Array.from(set).sort()
  }, [monthEntries])

  // 日付のラベル (6, 7, 8...)
  const dateLabels = allDates.map((d) => {
    const day = new Date(d + 'T00:00:00')
    const DOW = ['日', '月', '火', '水', '木', '金', '土']
    return { date: d, day: day.getDate(), dow: DOW[day.getDay()], isSat: day.getDay() === 6, isSun: day.getDay() === 0 }
  })

  // カウント関数
  const count = (entries: typeof journalEntries, date: string) =>
    entries.filter((j) => j.date === date).length

  // 担当者×顧客マトリクス
  const staffCustomerData = useMemo(() => {
    return staff.map((s) => {
      const sEntries = monthEntries.filter((j) => j.staffId === s.id)
      const custBreakdown = customers.map((c) => {
        const cEntries = sEntries.filter((j) => j.customerId === c.id)
        return { customer: c, total: cEntries.length, byDate: allDates.map((d) => count(cEntries, d)) }
      }).filter((x) => x.total > 0)
      return { staff: s, total: sEntries.length, custBreakdown }
    }).filter((x) => x.total > 0)
  }, [monthEntries, allDates])

  // 担当者×行動種別
  const staffTypeData = useMemo(() => {
    const types = ['訪問', '電話', 'メール']
    return staff.map((s) => {
      const sEntries = monthEntries.filter((j) => j.staffId === s.id)
      const typeBreakdown = types.map((t) => {
        const tEntries = sEntries.filter((j) => j.type === t)
        return { type: t, total: tEntries.length, byDate: allDates.map((d) => count(tEntries, d)) }
      }).filter((x) => x.total > 0)
      return { staff: s, total: sEntries.length, typeBreakdown }
    }).filter((x) => x.total > 0)
  }, [monthEntries, allDates])

  // 顧客×担当者
  const customerStaffData = useMemo(() => {
    return customers.map((c) => {
      const cEntries = monthEntries.filter((j) => j.customerId === c.id)
      const staffBreakdown = staff.map((s) => {
        const sEntries = cEntries.filter((j) => j.staffId === s.id)
        return { staff: s, total: sEntries.length, byDate: allDates.map((d) => count(sEntries, d)) }
      }).filter((x) => x.total > 0)
      return { customer: c, total: cEntries.length, staffBreakdown }
    }).filter((x) => x.total > 0)
  }, [monthEntries, allDates])

  const monthLabel = (() => {
    const [y, m] = month.split('-')
    return `${y}年${parseInt(m)}月`
  })()

  const navMonth = (dir: -1 | 1) => {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 1 + dir, 1)
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="af-page">
      <div className="af-page-header">
        <div>
          <div className="af-breadcrumb">
            <a href="/">メニュー</a> ＞ <a href="/activity">営業管理</a> ＞ <span className="af-bc-current">行動頻度表</span>
          </div>
          <div className="af-page-title">行動頻度表</div>
        </div>
      </div>

      <div className="af-content">
        {/* コントロール */}
        <div className="af-controls">
          <div className="af-month-nav">
            <button className="af-nav-btn" onClick={() => navMonth(-1)}>◀</button>
            <span className="af-month-label">{monthLabel}</span>
            <button className="af-nav-btn" onClick={() => navMonth(1)}>▶</button>
            <input type="month" className="af-month-input" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="af-view-toggle">
            {([
              ['staff-customer', '担当者×顧客'],
              ['staff-type', '担当者×種別'],
              ['customer-staff', '顧客×担当者'],
            ] as [ViewMode, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`af-view-btn${viewMode === key ? ' active' : ''}`}
                onClick={() => setViewMode(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* テーブル */}
        <div className="af-table-wrap">
          {allDates.length === 0 ? (
            <div className="af-empty">この月のデータがありません</div>
          ) : viewMode === 'staff-customer' ? (
            <table className="af-table">
              <thead>
                <tr>
                  <th className="af-th-fixed">担当者</th>
                  <th className="af-th-fixed2">顧客</th>
                  <th className="af-th-total">計</th>
                  {dateLabels.map((d) => (
                    <th key={d.date} className={`af-th-date${d.isSat ? ' sat' : ''}${d.isSun ? ' sun' : ''}`}>
                      <div>{d.day}</div>
                      <div className="af-th-dow">{d.dow}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffCustomerData.map((sg) => (
                  sg.custBreakdown.map((cb, ci) => (
                    <tr key={`${sg.staff.id}-${cb.customer.id}`}>
                      {ci === 0 && (
                        <td className="af-td-staff" rowSpan={sg.custBreakdown.length}>
                          <div className="af-staff-name">{sg.staff.name}</div>
                          <div className="af-staff-total">{sg.total}件</div>
                        </td>
                      )}
                      <td className="af-td-label">{cb.customer.kanji}</td>
                      <td className="af-td-total">{cb.total}</td>
                      {cb.byDate.map((n, i) => (
                        <td key={i} className={`af-td-cell${n > 0 ? ' has-data' : ''}`}>
                          {n > 0 ? n : ''}
                        </td>
                      ))}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          ) : viewMode === 'staff-type' ? (
            <table className="af-table">
              <thead>
                <tr>
                  <th className="af-th-fixed">担当者</th>
                  <th className="af-th-fixed2">種別</th>
                  <th className="af-th-total">計</th>
                  {dateLabels.map((d) => (
                    <th key={d.date} className={`af-th-date${d.isSat ? ' sat' : ''}${d.isSun ? ' sun' : ''}`}>
                      <div>{d.day}</div>
                      <div className="af-th-dow">{d.dow}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffTypeData.map((sg) => (
                  sg.typeBreakdown.map((tb, ti) => (
                    <tr key={`${sg.staff.id}-${tb.type}`}>
                      {ti === 0 && (
                        <td className="af-td-staff" rowSpan={sg.typeBreakdown.length}>
                          <div className="af-staff-name">{sg.staff.name}</div>
                          <div className="af-staff-total">{sg.total}件</div>
                        </td>
                      )}
                      <td className="af-td-label">
                        <span className={`af-type-badge ${tb.type === '訪問' ? 'visit' : tb.type === '電話' ? 'phone' : 'mail'}`}>{tb.type}</span>
                      </td>
                      <td className="af-td-total">{tb.total}</td>
                      {tb.byDate.map((n, i) => (
                        <td key={i} className={`af-td-cell${n > 0 ? ' has-data' : ''}`}>
                          {n > 0 ? n : ''}
                        </td>
                      ))}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          ) : (
            <table className="af-table">
              <thead>
                <tr>
                  <th className="af-th-fixed">顧客</th>
                  <th className="af-th-fixed2">担当者</th>
                  <th className="af-th-total">計</th>
                  {dateLabels.map((d) => (
                    <th key={d.date} className={`af-th-date${d.isSat ? ' sat' : ''}${d.isSun ? ' sun' : ''}`}>
                      <div>{d.day}</div>
                      <div className="af-th-dow">{d.dow}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customerStaffData.map((cg) => (
                  cg.staffBreakdown.map((sb, si) => (
                    <tr key={`${cg.customer.id}-${sb.staff.id}`}>
                      {si === 0 && (
                        <td className="af-td-staff" rowSpan={cg.staffBreakdown.length}>
                          <div className="af-staff-name">{cg.customer.kanji}</div>
                          <div className="af-staff-total">{cg.total}件</div>
                        </td>
                      )}
                      <td className="af-td-label">{sb.staff.name}</td>
                      <td className="af-td-total">{sb.total}</td>
                      {sb.byDate.map((n, i) => (
                        <td key={i} className={`af-td-cell${n > 0 ? ' has-data' : ''}`}>
                          {n > 0 ? n : ''}
                        </td>
                      ))}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
