import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Analytics.css'
import {
  orders,
  estimates,
  purchaseOrders,
  invoices,
  sites,
  partners,
  getCustomer,
  getStaff,
} from '../data/master'

type TabDef = { key: string; path: string; label: string }

const tabs: TabDef[] = [
  { key: 'sales-by-rep', path: '/analytics/sales-by-rep', label: '営業担当別受注状況' },
  { key: 'site-by-rep', path: '/analytics/site-by-rep', label: '工事担当別利益率' },
  { key: 'design-by-rep', path: '/analytics/design-by-rep', label: '積算担当別受託状況' },
  { key: 'customer-ranking', path: '/analytics/customer-ranking', label: '顧客ランキング' },
  { key: 'partner-orders', path: '/analytics/partner-orders', label: '協力会社別発注状況' },
  { key: 'sales-trend', path: '/analytics/sales-trend', label: '月別売上推移' },
  { key: 'conversion', path: '/analytics/conversion', label: '見積→受注転換率' },
]

function formatYen(n: number) {
  return '\u00A5' + n.toLocaleString('ja-JP')
}

export default function Analytics() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = useMemo(() => {
    const path = location.pathname
    const found = tabs.find((t) => path.startsWith(t.path))
    return found ? found.key : tabs[0].key
  }, [location.pathname])

  return (
    <div className="ana-page">
      <div className="ana-page-header">
        <div className="ana-breadcrumb">
          <a href="/">メニュー</a> ＞ <span className="ana-bc-current">分析・レポート</span>
        </div>
        <div className="ana-page-title">分析・レポート</div>
      </div>

      <div className="ana-tab-bar">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`ana-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ana-content">
        {activeTab === 'sales-by-rep' && <SalesByRep />}
        {activeTab === 'site-by-rep' && <SiteByRep />}
        {activeTab === 'design-by-rep' && <DesignByRep />}
        {activeTab === 'customer-ranking' && <CustomerRanking />}
        {activeTab === 'partner-orders' && <PartnerOrders />}
        {activeTab === 'sales-trend' && <SalesTrend />}
        {activeTab === 'conversion' && <Conversion />}
      </div>
    </div>
  )
}

/* ========== 1. 営業担当別受注状況 ========== */
function SalesByRep() {
  const rows = useMemo(() => {
    const staffMap = new Map<string, {
      staffName: string
      count: number
      total: number
      sekou: number
      kanryo: number
      chakkou: number
    }>()

    for (const ord of orders) {
      const s = getStaff(ord.staffId)
      const name = s?.name ?? '—'
      const prev = staffMap.get(ord.staffId) ?? {
        staffName: name, count: 0, total: 0, sekou: 0, kanryo: 0, chakkou: 0,
      }
      prev.count++
      prev.total += ord.amount
      if (ord.status === '施工中') prev.sekou++
      else if (ord.status === '完了') prev.kanryo++
      else if (ord.status === '着工前') prev.chakkou++
      staffMap.set(ord.staffId, prev)
    }

    return Array.from(staffMap.values()).sort((a, b) => b.total - a.total)
  }, [])

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th>担当者</th>
            <th className="ana-th-num">受注件数</th>
            <th className="ana-th-num">受注金額合計</th>
            <th className="ana-th-num">施工中</th>
            <th className="ana-th-num">完了</th>
            <th className="ana-th-num">着工前</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.staffName}>
              <td>{r.staffName}</td>
              <td className="ana-num">{r.count}</td>
              <td className="ana-num">{formatYen(r.total)}</td>
              <td className="ana-num">{r.sekou}</td>
              <td className="ana-num">{r.kanryo}</td>
              <td className="ana-num">{r.chakkou}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ========== 2. 工事担当別利益率 ========== */
function SiteByRep() {
  const rows = useMemo(() => {
    const staffMap = new Map<string, {
      staffName: string
      siteCount: number
      orderTotal: number
      purchaseTotal: number
    }>()

    for (const site of sites) {
      if (site.amount === 0) continue
      const s = getStaff(site.staffId)
      const name = s?.name ?? '—'
      const prev = staffMap.get(site.staffId) ?? {
        staffName: name, siteCount: 0, orderTotal: 0, purchaseTotal: 0,
      }
      prev.siteCount++
      prev.orderTotal += site.amount

      const poTotal = purchaseOrders
        .filter((po) => po.siteId === site.id)
        .reduce((sum, po) => sum + po.amount, 0)
      prev.purchaseTotal += poTotal

      staffMap.set(site.staffId, prev)
    }

    return Array.from(staffMap.values()).map((r) => {
      const gross = r.orderTotal - r.purchaseTotal
      const rate = r.orderTotal > 0 ? (gross / r.orderTotal) * 100 : 0
      return { ...r, gross, rate }
    }).sort((a, b) => b.rate - a.rate)
  }, [])

  const rateClass = (rate: number) => {
    if (rate >= 20) return 'ana-rate-green'
    if (rate >= 10) return 'ana-rate-normal'
    return 'ana-rate-red'
  }

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th>担当者</th>
            <th className="ana-th-num">現場数</th>
            <th className="ana-th-num">受注合計</th>
            <th className="ana-th-num">発注合計</th>
            <th className="ana-th-num">粗利</th>
            <th className="ana-th-num">粗利率</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.staffName}>
              <td>{r.staffName}</td>
              <td className="ana-num">{r.siteCount}</td>
              <td className="ana-num">{formatYen(r.orderTotal)}</td>
              <td className="ana-num">{formatYen(r.purchaseTotal)}</td>
              <td className="ana-num">{formatYen(r.gross)}</td>
              <td className={`ana-num ${rateClass(r.rate)}`}>{r.rate.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ========== 3. 積算担当別受託状況 ========== */
function DesignByRep() {
  const rows = useMemo(() => {
    const staffMap = new Map<string, {
      staffName: string
      count: number
      total: number
      ordered: number
      submitted: number
      drafting: number
    }>()

    for (const est of estimates) {
      const s = getStaff(est.staffId)
      const name = s?.name ?? '—'
      const prev = staffMap.get(est.staffId) ?? {
        staffName: name, count: 0, total: 0, ordered: 0, submitted: 0, drafting: 0,
      }
      prev.count++
      prev.total += est.amount
      if (est.status === '受注済') prev.ordered++
      else if (est.status === '提出中') prev.submitted++
      else if (est.status === '作成中') prev.drafting++
      staffMap.set(est.staffId, prev)
    }

    return Array.from(staffMap.values()).sort((a, b) => b.total - a.total)
  }, [])

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th>担当者</th>
            <th className="ana-th-num">見積件数</th>
            <th className="ana-th-num">見積金額合計</th>
            <th className="ana-th-num">受注済</th>
            <th className="ana-th-num">提出中</th>
            <th className="ana-th-num">作成中</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.staffName}>
              <td>{r.staffName}</td>
              <td className="ana-num">{r.count}</td>
              <td className="ana-num">{formatYen(r.total)}</td>
              <td className="ana-num">{r.ordered}</td>
              <td className="ana-num">{r.submitted}</td>
              <td className="ana-num">{r.drafting}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ========== 4. 顧客ランキング ========== */
function CustomerRanking() {
  const rows = useMemo(() => {
    const custMap = new Map<string, {
      customerId: string
      customerName: string
      count: number
      total: number
      lastDate: string
    }>()

    for (const ord of orders) {
      const c = getCustomer(ord.customerId)
      const name = c ? `${c.kanji}${c.honorific ? ' ' + c.honorific : ''}` : '—'
      const prev = custMap.get(ord.customerId) ?? {
        customerId: ord.customerId, customerName: name, count: 0, total: 0, lastDate: '',
      }
      prev.count++
      prev.total += ord.amount
      if (ord.orderDate > prev.lastDate) prev.lastDate = ord.orderDate
      custMap.set(ord.customerId, prev)
    }

    return Array.from(custMap.values()).sort((a, b) => b.total - a.total)
  }, [])

  const rankClass = (i: number) => {
    if (i === 0) return 'ana-rank ana-rank-1'
    if (i === 1) return 'ana-rank ana-rank-2'
    if (i === 2) return 'ana-rank ana-rank-3'
    return 'ana-rank ana-rank-other'
  }

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}>順位</th>
            <th>顧客名</th>
            <th className="ana-th-num">受注件数</th>
            <th className="ana-th-num">受注金額合計</th>
            <th>最終受注日</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.customerId}>
              <td><span className={rankClass(i)}>{i + 1}</span></td>
              <td>{r.customerName}</td>
              <td className="ana-num">{r.count}</td>
              <td className="ana-num">{formatYen(r.total)}</td>
              <td>{r.lastDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ========== 5. 協力会社別発注状況 ========== */
function PartnerOrders() {
  const rows = useMemo(() => {
    return partners.map((p) => {
      const pos = purchaseOrders.filter((po) => po.partnerId === p.id)
      const total = pos.reduce((sum, po) => sum + po.amount, 0)
      const kanryo = pos.filter((po) => po.status === '完了' || po.status === '納品済').length
      const sekou = pos.filter((po) => po.status === '施工中').length
      const mi = pos.filter((po) => po.status === '未着手').length
      return {
        name: p.name,
        category: p.category,
        count: pos.length,
        total,
        kanryo,
        sekou,
        mi,
      }
    }).filter((r) => r.count > 0).sort((a, b) => b.total - a.total)
  }, [])

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th>会社名</th>
            <th>業種</th>
            <th className="ana-th-num">発注件数</th>
            <th className="ana-th-num">発注金額合計</th>
            <th className="ana-th-num">完了</th>
            <th className="ana-th-num">施工中</th>
            <th className="ana-th-num">未着手</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{r.category}</td>
              <td className="ana-num">{r.count}</td>
              <td className="ana-num">{formatYen(r.total)}</td>
              <td className="ana-num">{r.kanryo}</td>
              <td className="ana-num">{r.sekou}</td>
              <td className="ana-num">{r.mi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ========== 6. 月別売上推移 ========== */
function SalesTrend() {
  const rows = useMemo(() => {
    const monthMap = new Map<string, {
      month: string
      count: number
      billed: number
      paid: number
      unpaid: number
    }>()

    for (const inv of invoices) {
      const ym = inv.issueDate.substring(0, 7).replace('/', '-')
      const prev = monthMap.get(ym) ?? { month: ym, count: 0, billed: 0, paid: 0, unpaid: 0 }
      prev.count++
      prev.billed += inv.total
      if (inv.status === '入金済') {
        prev.paid += inv.total
      } else {
        prev.unpaid += inv.total
      }
      monthMap.set(ym, prev)
    }

    return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month))
  }, [])

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        count: acc.count + r.count,
        billed: acc.billed + r.billed,
        paid: acc.paid + r.paid,
        unpaid: acc.unpaid + r.unpaid,
      }),
      { count: 0, billed: 0, paid: 0, unpaid: 0 },
    )
  }, [rows])

  const monthLabel = (ym: string) => {
    const parts = ym.split('-')
    return `${parts[0]}年${parseInt(parts[1])}月`
  }

  return (
    <div className="ana-table-wrap">
      <table className="ana-table">
        <thead>
          <tr>
            <th>月</th>
            <th className="ana-th-num">請求件数</th>
            <th className="ana-th-num">請求金額</th>
            <th className="ana-th-num">入金済金額</th>
            <th className="ana-th-num">未入金金額</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month}>
              <td>{monthLabel(r.month)}</td>
              <td className="ana-num">{r.count}</td>
              <td className="ana-num">{formatYen(r.billed)}</td>
              <td className="ana-num">{formatYen(r.paid)}</td>
              <td className="ana-num">{r.unpaid > 0 ? formatYen(r.unpaid) : '—'}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700, borderTop: '2px solid #E5E7EB' }}>
            <td>合計</td>
            <td className="ana-num">{totals.count}</td>
            <td className="ana-num">{formatYen(totals.billed)}</td>
            <td className="ana-num">{formatYen(totals.paid)}</td>
            <td className="ana-num">{totals.unpaid > 0 ? formatYen(totals.unpaid) : '—'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ========== 7. 見積→受注転換率 ========== */
function Conversion() {
  const totalEstimates = estimates.length
  const orderedCount = estimates.filter((e) => e.status === '受注済').length
  const conversionRate = totalEstimates > 0 ? (orderedCount / totalEstimates) * 100 : 0

  const staffRows = useMemo(() => {
    const staffMap = new Map<string, {
      staffName: string
      estCount: number
      ordCount: number
    }>()

    for (const est of estimates) {
      const s = getStaff(est.staffId)
      const name = s?.name ?? '—'
      const prev = staffMap.get(est.staffId) ?? { staffName: name, estCount: 0, ordCount: 0 }
      prev.estCount++
      if (est.status === '受注済') prev.ordCount++
      staffMap.set(est.staffId, prev)
    }

    return Array.from(staffMap.values())
      .map((r) => ({
        ...r,
        rate: r.estCount > 0 ? (r.ordCount / r.estCount) * 100 : 0,
      }))
      .sort((a, b) => b.rate - a.rate)
  }, [])

  return (
    <div>
      <div className="ana-summary">
        <div className="ana-summary-card">
          <div className="ana-summary-label">見積総数</div>
          <div className="ana-summary-value">{totalEstimates}件</div>
        </div>
        <div className="ana-summary-card">
          <div className="ana-summary-label">受注済</div>
          <div className="ana-summary-value">{orderedCount}件</div>
        </div>
        <div className="ana-summary-card">
          <div className="ana-summary-label">転換率</div>
          <div className="ana-summary-value ana-rate-green">{conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="ana-section-title">担当者別内訳</div>
      <div className="ana-table-wrap">
        <table className="ana-table">
          <thead>
            <tr>
              <th>担当者</th>
              <th className="ana-th-num">見積件数</th>
              <th className="ana-th-num">受注済</th>
              <th className="ana-th-num">転換率</th>
            </tr>
          </thead>
          <tbody>
            {staffRows.map((r) => (
              <tr key={r.staffName}>
                <td>{r.staffName}</td>
                <td className="ana-num">{r.estCount}</td>
                <td className="ana-num">{r.ordCount}</td>
                <td className="ana-num">{r.rate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
