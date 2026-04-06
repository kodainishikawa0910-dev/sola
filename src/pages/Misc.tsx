import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Misc.css'
import { sites, invoices, purchaseOrders, getCustomer, getStaff, formatYen } from '../data/master'

// ---------- Route config ----------
type RouteInfo = {
  title: string
  breadcrumb: string
  icon: string
  description: string
  content: 'org' | 'deadlines' | 'cashflow' | 'placeholder'
}

const routeMap: Record<string, RouteInfo> = {
  '/settings': {
    title: '\u74B0\u5883\u8A2D\u5B9A',
    breadcrumb: '\u74B0\u5883\u8A2D\u5B9A',
    icon: '\u2699\uFE0F',
    description: '\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u8868\u793A\u8A2D\u5B9A\u3001\u901A\u77E5\u8A2D\u5B9A\u3001\u30E6\u30FC\u30B6\u30FC\u60C5\u5831\u306E\u7BA1\u7406\u306A\u3069\u3092\u884C\u3048\u307E\u3059\u3002',
    content: 'placeholder',
  },
  '/org': {
    title: '\u7D44\u7E54\u56F3',
    breadcrumb: '\u7D44\u7E54\u56F3',
    icon: '',
    description: '\u793E\u5185\u306E\u7D44\u7E54\u4F53\u5236\u3068\u5F79\u5272\u5206\u62C5\u3092\u8868\u793A\u3057\u307E\u3059\u3002',
    content: 'org',
  },
  '/misc/mail-print': {
    title: '\u90F5\u9001\u5B9B\u540D\u5370\u5237',
    breadcrumb: '\u90F5\u9001\u5B9B\u540D\u5370\u5237',
    icon: '\u2709\uFE0F',
    description: '\u9867\u5BA2\u30FB\u5354\u529B\u4F1A\u793E\u5411\u3051\u306E\u90F5\u9001\u5B9B\u540D\u30E9\u30D9\u30EB\u3092\u4F5C\u6210\u30FB\u5370\u5237\u3067\u304D\u307E\u3059\u3002',
    content: 'placeholder',
  },
  '/misc/greeting': {
    title: '\u8FD1\u96A3\u6328\u62F6\u6587\u4F5C\u6210',
    breadcrumb: '\u8FD1\u96A3\u6328\u62F6\u6587\u4F5C\u6210',
    icon: '\u{1F4DD}',
    description: '\u5DE5\u4E8B\u7740\u5DE5\u524D\u306E\u8FD1\u96A3\u6328\u62F6\u6587\u66F8\u3092\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304B\u3089\u4F5C\u6210\u3067\u304D\u307E\u3059\u3002',
    content: 'placeholder',
  },
  '/deadlines': {
    title: '\u671F\u9650\u7BA1\u7406\u4E00\u89A7',
    breadcrumb: '\u671F\u9650\u7BA1\u7406\u4E00\u89A7',
    icon: '',
    description: '\u5DE5\u4E8B\u306E\u5DE5\u671F\u7D42\u4E86\u65E5\u3092\u57FA\u6E96\u306B\u3001\u671F\u9650\u304C\u8FEB\u3063\u3066\u3044\u308B\u73FE\u5834\u3092\u4E00\u89A7\u8868\u793A\u3057\u307E\u3059\u3002',
    content: 'deadlines',
  },
  '/cashflow': {
    title: '\u6708\u5225\u8CC7\u91D1\u7E70\u308A\u8868',
    breadcrumb: '\u6708\u5225\u8CC7\u91D1\u7E70\u308A\u8868',
    icon: '',
    description: '\u6708\u3054\u3068\u306E\u8ACB\u6C42\u30FB\u5165\u91D1\u30FB\u652F\u6255\u3092\u96C6\u8A08\u3057\u3001\u8CC7\u91D1\u7E70\u308A\u3092\u53EF\u8996\u5316\u3057\u307E\u3059\u3002',
    content: 'cashflow',
  },
  '/maintenance': {
    title: '\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u4E00\u89A7',
    breadcrumb: '\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u4E00\u89A7',
    icon: '\u{1F527}',
    description: '\u5B8C\u4E86\u3057\u305F\u5DE5\u4E8B\u306E\u30A2\u30D5\u30BF\u30FC\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u4E88\u5B9A\u3092\u7BA1\u7406\u3067\u304D\u307E\u3059\u3002',
    content: 'placeholder',
  },
}

// ---------- Org chart data ----------
type OrgNode = { id: string; name: string; role: string; dept?: string }

const ceo: OrgNode = { id: 'sakaguchi', name: '\u962A\u53E3 \u8AA0', role: '\u4EE3\u8868\u53D6\u7DE0\u5F79' }

const departments: { head: OrgNode; members: OrgNode[] }[] = [
  {
    head: { id: 'nishimoto', name: '\u897F\u672C \u525B', role: '\u5DE5\u4E8B\u90E8\u9577', dept: '\u5DE5\u4E8B\u90E8' },
    members: [
      { id: 'tonomura', name: '\u6E21\u6751 \u5927\u8F14', role: '\u5DE5\u4E8B\u62C5\u5F53' },
    ],
  },
  {
    head: { id: 'nishikawa', name: '\u897F\u5DDD \u516C\u5927', role: '\u55B6\u696D\u90E8\u9577', dept: '\u55B6\u696D\u90E8' },
    members: [
      { id: 'nakajima', name: '\u4E2D\u5CF6 \u5065\u592A', role: '\u55B6\u696D\u62C5\u5F53' },
    ],
  },
  {
    head: { id: 'yamamoto', name: '\u5C71\u672C \u88D5\u4E4B', role: '\u6280\u8853\u90E8\u9577', dept: '\u6280\u8853\u90E8' },
    members: [
      { id: 'tanaka', name: '\u7530\u4E2D \u6D69\u4E8C', role: '\u7A4D\u7B97\u62C5\u5F53' },
      { id: 'tsutsui', name: '\u7B52\u4E95 \u4FEE\u5E73', role: '\u8A2D\u8A08\u62C5\u5F53' },
    ],
  },
]

// ---------- Sub-components ----------

function OrgChart() {
  return (
    <div className="msc-org">
      <div className="msc-org-top">
        <div className="msc-org-card msc-org-ceo">
          <span className="msc-org-name">{ceo.name}</span>
          <span className="msc-org-role">{ceo.role}</span>
        </div>
      </div>
      <div className="msc-org-connector" />
      <div className="msc-org-hline" />
      <div className="msc-org-departments">
        {departments.map((dept) => (
          <div className="msc-org-dept" key={dept.head.id}>
            <div className="msc-org-card msc-org-head">
              <span className="msc-org-name">{dept.head.name}</span>
              <span className="msc-org-role">{dept.head.dept}</span>
            </div>
            <div className="msc-org-connector" />
            <div className="msc-org-dept-members">
              {dept.members.map((m) => (
                <div className="msc-org-card msc-org-member" key={m.id}>
                  <span className="msc-org-name">{m.name}</span>
                  <span className="msc-org-role">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DeadlinesTable() {
  const today = new Date()

  const rows = useMemo(() => {
    return sites
      .filter((s) => s.statusClass !== 'kanryo')
      .map((s) => {
        const cust = getCustomer(s.customerId)
        const st = getStaff(s.staffId)
        const endParts = s.periodEnd.split('/')
        const endDate = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]))
        const diffMs = endDate.getTime() - today.getTime()
        const remaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        return {
          id: s.id,
          name: s.name,
          customer: cust?.kanji ?? '',
          periodEnd: s.periodEnd,
          remaining,
          staff: st?.name ?? '',
          status: s.status,
        }
      })
      .sort((a, b) => a.remaining - b.remaining)
  }, [today])

  const getBadgeClass = (days: number) => {
    if (days < 0) return 'msc-dl-overdue'
    if (days < 7) return 'msc-dl-urgent'
    if (days < 30) return 'msc-dl-soon'
    return 'msc-dl-ok'
  }
  const getTextClass = (days: number) => {
    if (days < 0) return 'msc-dl-overdue-text'
    if (days < 7) return 'msc-dl-urgent-text'
    if (days < 30) return 'msc-dl-soon-text'
    return 'msc-dl-ok-text'
  }
  const getBadgeLabel = (days: number) => {
    if (days < 0) return '\u671F\u9650\u8D85\u904E'
    if (days < 7) return '\u7DCA\u6025'
    if (days < 30) return '\u6CE8\u610F'
    return '\u4F59\u88D5\u3042\u308A'
  }

  return (
    <div className="msc-section">
      <div className="msc-section-title">\u5DE5\u671F\u7D42\u4E86\u65E5\u5225 \u671F\u9650\u4E00\u89A7\uFF08\u5B8C\u4E86\u6E08\u307F\u9664\u304F\uFF09</div>
      <table className="msc-dl-table">
        <thead>
          <tr>
            <th>\u73FE\u5834\u540D</th>
            <th>\u9867\u5BA2</th>
            <th>\u5DE5\u671F\u7D42\u4E86\u65E5</th>
            <th>\u6B8B\u65E5\u6570</th>
            <th>\u62C5\u5F53\u8005</th>
            <th>\u30B9\u30C6\u30FC\u30BF\u30B9</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.customer}</td>
              <td>{r.periodEnd}</td>
              <td>
                <span className={`msc-dl-days ${getTextClass(r.remaining)}`}>
                  {r.remaining < 0 ? `${Math.abs(r.remaining)}\u65E5\u8D85\u904E` : `${r.remaining}\u65E5`}
                </span>
              </td>
              <td>{r.staff}</td>
              <td>
                <span className={`msc-dl-badge ${getBadgeClass(r.remaining)}`}>
                  {getBadgeLabel(r.remaining)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CashflowTable() {
  const monthlyData = useMemo(() => {
    // Gather months from invoices and purchase orders
    const months = new Map<string, { billing: number; income: number; expense: number }>()

    const ensureMonth = (key: string) => {
      if (!months.has(key)) months.set(key, { billing: 0, income: 0, expense: 0 })
    }

    // Billing and income from invoices
    invoices.forEach((inv) => {
      const issueKey = inv.issueDate.substring(0, 7).replace('/', '-')
      ensureMonth(issueKey)
      months.get(issueKey)!.billing += inv.total

      if (inv.paidDate) {
        const paidKey = inv.paidDate.substring(0, 7).replace('/', '-')
        ensureMonth(paidKey)
        months.get(paidKey)!.income += inv.total
      }
    })

    // Expenses from purchase orders
    purchaseOrders.forEach((po) => {
      const key = po.orderDate.substring(0, 7).replace('/', '-')
      ensureMonth(key)
      months.get(key)!.expense += po.amount
    })

    return Array.from(months.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month,
        label: month.replace('-', '/'),
        billing: data.billing,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }))
  }, [])

  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, m) => ({
        billing: acc.billing + m.billing,
        income: acc.income + m.income,
        expense: acc.expense + m.expense,
        balance: acc.balance + m.balance,
      }),
      { billing: 0, income: 0, expense: 0, balance: 0 },
    )
  }, [monthlyData])

  return (
    <>
      <div className="msc-cf-summary">
        <div className="msc-cf-summary-card">
          <div className="msc-cf-summary-label">\u8ACB\u6C42\u7DCF\u984D</div>
          <div className="msc-cf-summary-value">{formatYen(totals.billing)}</div>
        </div>
        <div className="msc-cf-summary-card">
          <div className="msc-cf-summary-label">\u5165\u91D1\u7DCF\u984D</div>
          <div className="msc-cf-summary-value msc-cf-positive">{formatYen(totals.income)}</div>
        </div>
        <div className="msc-cf-summary-card">
          <div className="msc-cf-summary-label">\u652F\u6255\u7DCF\u984D</div>
          <div className="msc-cf-summary-value msc-cf-negative">{formatYen(totals.expense)}</div>
        </div>
        <div className="msc-cf-summary-card">
          <div className="msc-cf-summary-label">\u5DEE\u5F15\u5408\u8A08</div>
          <div className={`msc-cf-summary-value ${totals.balance >= 0 ? 'msc-cf-positive' : 'msc-cf-negative'}`}>
            {formatYen(totals.balance)}
          </div>
        </div>
      </div>
      <div className="msc-section">
        <div className="msc-section-title">\u6708\u5225\u8CC7\u91D1\u7E70\u308A\u660E\u7D30</div>
        <table className="msc-cf-table">
          <thead>
            <tr>
              <th>\u6708</th>
              <th>\u8ACB\u6C42\u984D</th>
              <th>\u5165\u91D1\u984D</th>
              <th>\u652F\u6255\u984D</th>
              <th>\u5DEE\u5F15</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m) => (
              <tr key={m.month}>
                <td>{m.label}</td>
                <td>{formatYen(m.billing)}</td>
                <td className={m.income > 0 ? 'msc-cf-positive' : ''}>{formatYen(m.income)}</td>
                <td className={m.expense > 0 ? 'msc-cf-negative' : ''}>{formatYen(m.expense)}</td>
                <td className={m.balance >= 0 ? 'msc-cf-positive' : 'msc-cf-negative'}>{formatYen(m.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>\u5408\u8A08</td>
              <td>{formatYen(totals.billing)}</td>
              <td className="msc-cf-positive">{formatYen(totals.income)}</td>
              <td className="msc-cf-negative">{formatYen(totals.expense)}</td>
              <td className={totals.balance >= 0 ? 'msc-cf-positive' : 'msc-cf-negative'}>{formatYen(totals.balance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

function PlaceholderContent({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="msc-placeholder-card">
      <div className="msc-placeholder-icon">{icon}</div>
      <div className="msc-placeholder-title">{title}</div>
      <div className="msc-placeholder-desc">{description}</div>
      <span className="msc-placeholder-badge">\u3053\u306E\u30DA\u30FC\u30B8\u306F\u73FE\u5728\u958B\u767A\u4E2D\u3067\u3059</span>
    </div>
  )
}

function NotFound() {
  return (
    <div className="msc-notfound">
      <div className="msc-notfound-code">404</div>
      <div className="msc-notfound-text">\u304A\u63A2\u3057\u306E\u30DA\u30FC\u30B8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</div>
      <Link to="/" className="msc-notfound-link">\u2190 \u30E1\u30CB\u30E5\u30FC\u3078\u623B\u308B</Link>
    </div>
  )
}

// ---------- Main component ----------
export default function Misc() {
  const location = useLocation()
  const path = location.pathname

  const route = routeMap[path]

  // Unknown route -> 404
  if (!route) {
    return (
      <div className="msc-page">
        <div className="msc-page-header">
          <div>
            <div className="msc-breadcrumb">
              <a href="/">\u30E1\u30CB\u30E5\u30FC</a> \uFF1E <span className="msc-bc-current">\u30DA\u30FC\u30B8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</span>
            </div>
            <div className="msc-page-title">\u30DA\u30FC\u30B8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</div>
          </div>
        </div>
        <div className="msc-content">
          <NotFound />
        </div>
      </div>
    )
  }

  return (
    <div className="msc-page">
      <div className="msc-page-header">
        <div>
          <div className="msc-breadcrumb">
            <a href="/">\u30E1\u30CB\u30E5\u30FC</a> \uFF1E <span className="msc-bc-current">{route.breadcrumb}</span>
          </div>
          <div className="msc-page-title">{route.title}</div>
        </div>
      </div>
      <div className="msc-content">
        {route.content === 'org' && <OrgChart />}
        {route.content === 'deadlines' && <DeadlinesTable />}
        {route.content === 'cashflow' && <CashflowTable />}
        {route.content === 'placeholder' && (
          <PlaceholderContent icon={route.icon} title={route.title} description={route.description} />
        )}
      </div>
    </div>
  )
}
