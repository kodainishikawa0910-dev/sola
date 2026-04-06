import { useState, useMemo } from 'react'
import './OrderRequests.css'

type OrderRequest = {
  id: string
  title: string
  customerName: string
  amount: number
  applicant: string
  approver: string
  status: string
  appliedDate: string
  stuckDays: number
}

const requestData: OrderRequest[] = [
  { id: 'oreq-001', title: '住吉モデルハウス外構工事', customerName: 'ハウスワン株式会社', amount: 2400000, applicant: '西川 公大', approver: '阪口 誠', status: '役員決裁待ち', appliedDate: '2026/03/28', stuckDays: 5 },
  { id: 'oreq-002', title: 'JF新築工事 B棟', customerName: 'JF株式会社', amount: 4300000, applicant: '中島 健太', approver: '西川 公大', status: '部長承認待ち', appliedDate: '2026/04/02', stuckDays: 2 },
  { id: 'oreq-003', title: '田中邸 追加外構工事', customerName: '田中 一郎', amount: 980000, applicant: '西川 公大', approver: '阪口 誠', status: '承認済', appliedDate: '2026/03/20', stuckDays: 0 },
  { id: 'oreq-004', title: '佐藤ビル 屋上防水改修', customerName: '佐藤建設株式会社', amount: 3500000, applicant: '中島 健太', approver: '西川 公大', status: '申請中', appliedDate: '2026/04/05', stuckDays: 0 },
  { id: 'oreq-005', title: '高橋邸 2期工事 外壁塗装', customerName: '高橋 美咲', amount: 1200000, applicant: '中島 健太', approver: '西川 公大', status: '差戻し', appliedDate: '2026/03/25', stuckDays: 8 },
]

const statusOptions = [
  { value: '申請中', label: '申請中' },
  { value: '部長承認待ち', label: '部長承認待ち' },
  { value: '役員決裁待ち', label: '役員決裁待ち' },
  { value: '承認済', label: '承認済' },
  { value: '差戻し', label: '差戻し' },
]

const statusStyles: Record<string, { bg: string; color: string }> = {
  '申請中':     { bg: '#DBEAFE', color: '#1D4ED8' },
  '部長承認待ち': { bg: '#FEF3C7', color: '#92400E' },
  '役員決裁待ち': { bg: '#FCE7F3', color: '#9D174D' },
  '承認済':     { bg: '#D1FAE5', color: '#065F46' },
  '差戻し':     { bg: '#FEE2E2', color: '#991B1B' },
}

function stuckLabel(days: number): { text: string; bg: string; color: string } {
  if (days === 0) return { text: '当日', bg: '#D1FAE5', color: '#065F46' }
  if (days <= 2) return { text: `${days}日`, bg: '#FEF3C7', color: '#92400E' }
  return { text: `${days}日`, bg: '#FEE2E2', color: '#991B1B' }
}

export default function OrderRequests() {
  const [filter, setFilter] = useState({ status: '' })

  const filtered = useMemo(() => requestData.filter((r) => {
    return !filter.status || r.status === filter.status
  }), [filter])

  const reset = () => setFilter({ status: '' })

  return (
    <div className="odr-page">
      <div className="odr-page-header">
        <div>
          <div className="odr-breadcrumb">
            <a href="/">メニュー</a> ＞ <span>現場・受注管理</span> ＞ <span className="odr-bc-current">受注申請一覧</span>
          </div>
          <div className="odr-page-title">受注申請一覧</div>
        </div>
      </div>

      <div className="odr-content">
        {/* フィルタ */}
        <div className="odr-filter">
          <div className="odr-filter-grid">
            <div className="odr-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="odr-filter-actions">
            <button className="odr-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="odr-filter-result">{filtered.length}件の申請が見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="odr-table-wrap">
          <table className="odr-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>申請番号</th>
                <th>件名／顧客</th>
                <th style={{ width: 120, textAlign: 'right' }}>申請金額</th>
                <th style={{ width: 140 }}>申請者→承認者</th>
                <th style={{ width: 100 }}>ステータス</th>
                <th style={{ width: 70 }}>経過日数</th>
                <th style={{ width: 100 }}>申請日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="odr-empty">該当する申請が見つかりませんでした</td></tr>
              ) : (
                filtered.map((r) => {
                  const ss = statusStyles[r.status] ?? { bg: '#F3F4F6', color: '#374151' }
                  const sl = stuckLabel(r.stuckDays)
                  return (
                    <tr key={r.id}>
                      <td className="odr-id">{r.id}</td>
                      <td>
                        <div className="odr-title">{r.title}</div>
                        <div className="odr-customer">{r.customerName}</div>
                      </td>
                      <td className="odr-amount">¥{r.amount.toLocaleString()}</td>
                      <td className="odr-flow">{r.applicant} → {r.approver}</td>
                      <td>
                        <span className="odr-status" style={{ background: ss.bg, color: ss.color }}>{r.status}</span>
                      </td>
                      <td>
                        <span className="odr-stuck" style={{ background: sl.bg, color: sl.color }}>{sl.text}</span>
                      </td>
                      <td className="odr-date">{r.appliedDate}</td>
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
