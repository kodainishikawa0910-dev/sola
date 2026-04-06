import { useMemo } from 'react'
import './Settlements.css'
import { orders, purchaseOrders, invoices, getCustomer, getStaff, getSite } from '../data/master'

type SettlementRow = {
  siteId: string
  siteName: string
  customerName: string
  orderAmount: number
  purchaseTotal: number
  grossProfit: number
  profitRate: number
  billedTotal: number
  paidTotal: number
  staffName: string
}

export default function Settlements() {
  const rows = useMemo<SettlementRow[]>(() => {
    return orders.map((ord) => {
      const site = getSite(ord.siteId)
      const cust = getCustomer(ord.customerId)
      const stf = getStaff(site?.staffId ?? '')

      const purchaseTotal = purchaseOrders
        .filter((po) => po.siteId === ord.siteId)
        .reduce((sum, po) => sum + po.amount, 0)

      const siteInvoices = invoices.filter((inv) => inv.siteId === ord.siteId)
      const billedTotal = siteInvoices.reduce((sum, inv) => sum + inv.total, 0)
      const paidTotal = siteInvoices
        .filter((inv) => inv.status === '入金済')
        .reduce((sum, inv) => sum + inv.total, 0)

      const grossProfit = ord.amount - purchaseTotal
      const profitRate = ord.amount > 0 ? (grossProfit / ord.amount) * 100 : 0

      return {
        siteId: ord.siteId,
        siteName: site?.name ?? '—',
        customerName: cust ? `${cust.kanji} ${cust.honorific}` : '—',
        orderAmount: ord.amount,
        purchaseTotal,
        grossProfit,
        profitRate,
        billedTotal,
        paidTotal,
        staffName: stf?.name ?? '—',
      }
    })
  }, [])

  const rateClass = (rate: number) => {
    if (rate >= 20) return 'stl-rate-green'
    if (rate >= 10) return 'stl-rate-normal'
    return 'stl-rate-red'
  }

  return (
    <div className="stl-page">
      <div className="stl-page-header">
        <div>
          <div className="stl-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="stl-bc-current">清算管理</span>
          </div>
          <div className="stl-page-title">清算管理</div>
        </div>
      </div>

      <div className="stl-content">
        <div className="stl-table-wrap">
          <table className="stl-table">
            <thead>
              <tr>
                <th>現場名</th>
                <th style={{ width: 110 }}>顧客名</th>
                <th style={{ width: 110, textAlign: 'right' }}>受注金額</th>
                <th style={{ width: 110, textAlign: 'right' }}>発注合計</th>
                <th style={{ width: 110, textAlign: 'right' }}>粗利</th>
                <th style={{ width: 70, textAlign: 'right' }}>粗利率</th>
                <th style={{ width: 110, textAlign: 'right' }}>請求済</th>
                <th style={{ width: 110, textAlign: 'right' }}>入金済</th>
                <th style={{ width: 90 }}>担当者</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={9} className="stl-empty">該当するデータがありません</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.siteId}>
                    <td>
                      <div className="stl-site-name">{r.siteName}</div>
                    </td>
                    <td className="stl-customer">{r.customerName}</td>
                    <td className="stl-amount stl-amount-order">¥{r.orderAmount.toLocaleString()}</td>
                    <td className="stl-amount stl-amount-purchase">¥{r.purchaseTotal.toLocaleString()}</td>
                    <td className="stl-amount stl-amount-profit">¥{r.grossProfit.toLocaleString()}</td>
                    <td className={`stl-rate ${rateClass(r.profitRate)}`}>{r.profitRate.toFixed(1)}%</td>
                    <td className="stl-amount stl-amount-billed">{r.billedTotal > 0 ? `¥${r.billedTotal.toLocaleString()}` : '—'}</td>
                    <td className="stl-amount stl-amount-paid">{r.paidTotal > 0 ? `¥${r.paidTotal.toLocaleString()}` : '—'}</td>
                    <td className="stl-staff">{r.staffName}</td>
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
