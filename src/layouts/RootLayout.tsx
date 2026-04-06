import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const dowJa = ['日', '月', '火', '水', '木', '金', '土']
function formatNow(d: Date) {
  const date = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${dowJa[d.getDay()]}）`
  const time = `${d.getHours()}時${String(d.getMinutes()).padStart(2, '0')}分`
  return `${date} ${time}`
}

type MenuItem = { label: string; href: string }
type MenuSection = { title: string; dot: string; items: MenuItem[] }

const menuSections: MenuSection[] = [
  {
    title: '顧客管理',
    dot: '#3B82F6',
    items: [
      { label: '顧客一覧', href: '/customers.html' },
      { label: '変更', href: '/customers/edit' },
    ],
  },
  {
    title: '営業管理',
    dot: '#22C55E',
    items: [
      { label: '日誌登録', href: '/journal/new' },
      { label: '日誌一覧', href: '/journal' },
      { label: '行動履歴一覧', href: '/activity' },
      { label: '行動頻度表', href: '/activity/frequency' },
    ],
  },
  {
    title: '現場・受注管理',
    dot: '#EAB308',
    items: [
      { label: '現場一覧', href: '/sites' },
      { label: '受注一覧', href: '/orders' },
      { label: '受注申請一覧', href: '/orders/requests' },
      { label: '完了報告', href: '/sites/reports' },
    ],
  },
  {
    title: '見積・発注管理',
    dot: '#A855F7',
    items: [
      { label: '見積書一覧', href: '/estimates' },
      { label: '発注管理一覧', href: '/purchases' },
    ],
  },
  {
    title: '協力会社管理',
    dot: '#14B8A6',
    items: [
      { label: '協力会社一覧', href: '/partners' },
    ],
  },
  {
    title: '請求管理',
    dot: '#F97316',
    items: [
      { label: '売上請求書一覧', href: '/billing/invoices' },
      { label: '売上入金管理', href: '/billing/receipts' },
    ],
  },
]

export default function RootLayout() {
  const location = useLocation()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const isActive = (href: string) => location.pathname === href

  const isSectionActive = (items: MenuItem[]) =>
    items.some((item) => location.pathname.startsWith(item.href.split('/').slice(0, 2).join('/')))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ヘッダー */}
      <header
        style={{
          background: '#1D4ED8',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          height: 36,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: 1 }}>
            sola
          </Link>
          <span style={{ fontSize: 8, opacity: 0.8 }}>ラックプラス 総合業務管理システム</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 9 }}>
          <span style={{ opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>{formatNow(now)}</span>
          <span style={{ opacity: 0.9 }}>西川 公大 ｜ 0.9.9.17341</span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* サイドバー */}
        <aside
          style={{
            width: 160,
            minWidth: 160,
            background: '#1A1C24',
            color: '#fff',
            overflowY: 'auto',
            flexShrink: 0,
            paddingTop: 4,
            fontSize: 9,
          }}
        >
          {menuSections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 2 }}>
              <div
                style={{
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: isSectionActive(sec.items) ? '#fff' : '#94A3B8',
                  background: isSectionActive(sec.items) ? 'rgba(255,255,255,0.05)' : undefined,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: sec.dot,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {sec.title} ▾
              </div>
              {sec.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  style={{
                    display: 'block',
                    padding: '5px 12px 5px 28px',
                    color: isActive(item.href) ? '#fff' : '#64748B',
                    textDecoration: 'none',
                    background: isActive(item.href) ? 'rgba(29,78,216,0.4)' : undefined,
                    borderLeft: isActive(item.href) ? '2px solid #60A5FA' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = '#CBD5E1'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = '#64748B'
                      e.currentTarget.style.background = ''
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* メインコンテンツ */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
