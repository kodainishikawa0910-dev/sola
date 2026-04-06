import { useState, useMemo } from 'react'
import './Payments.css'

type Payment = {
  id: string
  poId: string
  partnerName: string
  siteName: string
  amount: number
  tax: number
  total: number
  invoiceDate: string
  dueDate: string
  status: string
  statusBg: string
  statusColor: string
  paidDate?: string
}

const payments: Payment[] = [
  { id: 'pay-001', poId: 'po-001', partnerName: '△△解体', siteName: '田中邸 解体・養生', amount: 280000, tax: 28000, total: 308000, invoiceDate: '2026/03/20', dueDate: '2026/04/30', status: '支払済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2026/04/25' },
  { id: 'pay-002', poId: 'po-002', partnerName: '〇〇内装工業', siteName: '田中邸 内装下地・クロス', amount: 650000, tax: 65000, total: 715000, invoiceDate: '2026/03/25', dueDate: '2026/04/30', status: '未払い', statusBg: '#FEF3C7', statusColor: '#92400E' },
  { id: 'pay-003', poId: 'po-004', partnerName: '◇◇建材', siteName: '田中邸 材料調達', amount: 420000, tax: 42000, total: 462000, invoiceDate: '2026/03/10', dueDate: '2026/04/10', status: '支払済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2026/04/08' },
  { id: 'pay-004', poId: 'po-005', partnerName: '〇〇内装工業', siteName: 'JF A棟 内装一式', amount: 2800000, tax: 280000, total: 3080000, invoiceDate: '2026/03/31', dueDate: '2026/04/30', status: '確認中', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'pay-005', poId: 'po-011', partnerName: '◎◎塗装', siteName: '天王寺 外壁塗装', amount: 1800000, tax: 180000, total: 1980000, invoiceDate: '2026/04/01', dueDate: '2026/05/10', status: '未払い', statusBg: '#FEF3C7', statusColor: '#92400E' },
  { id: 'pay-006', poId: 'po-013', partnerName: '★★設備工業', siteName: '高橋邸 水回り設備', amount: 520000, tax: 52000, total: 572000, invoiceDate: '2026/02/20', dueDate: '2026/03/31', status: '支払済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2026/03/28' },
]

export default function Payments() {
  const [filter, setFilter] = useState({ status: '', partner: '' })

  const statusOptions = [...new Set(payments.map((p) => p.status))]

  const filtered = useMemo(() => payments.filter((p) => {
    return (
      (!filter.status || p.status === filter.status) &&
      (!filter.partner || p.partnerName.includes(filter.partner))
    )
  }), [filter])

  const reset = () => setFilter({ status: '', partner: '' })

  return (
    <div className="pay-page">
      <div className="pay-page-header">
        <div>
          <div className="pay-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="pay-bc-current">支払管理</span>
          </div>
          <div className="pay-page-title">支払管理</div>
        </div>
        <button className="pay-new-btn">＋ 新規登録</button>
      </div>

      <div className="pay-content">
        {/* フィルタ */}
        <div className="pay-filter">
          <div className="pay-filter-grid">
            <div className="pay-filter-field">
              <label>ステータス</label>
              <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="">すべて</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="pay-filter-field">
              <label>協力会社名</label>
              <input type="text" placeholder="例：内装" value={filter.partner} onChange={(e) => setFilter({ ...filter, partner: e.target.value })} />
            </div>
          </div>
          <div className="pay-filter-actions">
            <button className="pay-reset-btn" onClick={reset}>リセット</button>
          </div>
          <div className="pay-filter-result">{filtered.length}件の支払データが見つかりました</div>
        </div>

        {/* テーブル */}
        <div className="pay-table-wrap">
          <table className="pay-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>支払番号</th>
                <th>件名 / 協力会社</th>
                <th style={{ width: 130, textAlign: 'right' }}>支払金額（税込）</th>
                <th style={{ width: 80 }}>ステータス</th>
                <th style={{ width: 90 }}>請求受領日</th>
                <th style={{ width: 90 }}>支払期限</th>
                <th style={{ width: 90 }}>支払日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="pay-empty">該当する支払データが見つかりませんでした</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="pay-no">{p.id.replace('pay-', 'PAY-')}</td>
                    <td>
                      <div className="pay-title">{p.siteName}</div>
                      <div className="pay-partner">{p.partnerName}</div>
                    </td>
                    <td className="pay-amount">¥{p.total.toLocaleString()}</td>
                    <td>
                      <span className="pay-status" style={{ background: p.statusBg, color: p.statusColor }}>{p.status}</span>
                    </td>
                    <td className="pay-date">{p.invoiceDate}</td>
                    <td className="pay-date">{p.dueDate}</td>
                    <td>{p.paidDate ? <span className="pay-paid">{p.paidDate}</span> : <span className="pay-date">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
