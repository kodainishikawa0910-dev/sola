import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Menu.css'

// 47都道府県と地方別気温オフセット(大阪基準)
const prefectures: { name: string; region: string }[] = [
  { name: '北海道', region: 'hokkaido' },
  { name: '青森県', region: 'tohoku' },
  { name: '岩手県', region: 'tohoku' },
  { name: '宮城県', region: 'tohoku' },
  { name: '秋田県', region: 'tohoku' },
  { name: '山形県', region: 'tohoku' },
  { name: '福島県', region: 'tohoku' },
  { name: '茨城県', region: 'kanto' },
  { name: '栃木県', region: 'kanto' },
  { name: '群馬県', region: 'kanto' },
  { name: '埼玉県', region: 'kanto' },
  { name: '千葉県', region: 'kanto' },
  { name: '東京都', region: 'kanto' },
  { name: '神奈川県', region: 'kanto' },
  { name: '新潟県', region: 'chubu' },
  { name: '富山県', region: 'chubu' },
  { name: '石川県', region: 'chubu' },
  { name: '福井県', region: 'chubu' },
  { name: '山梨県', region: 'chubu' },
  { name: '長野県', region: 'chubu' },
  { name: '岐阜県', region: 'chubu' },
  { name: '静岡県', region: 'chubu' },
  { name: '愛知県', region: 'chubu' },
  { name: '三重県', region: 'kinki' },
  { name: '滋賀県', region: 'kinki' },
  { name: '京都府', region: 'kinki' },
  { name: '大阪府', region: 'kinki' },
  { name: '兵庫県', region: 'kinki' },
  { name: '奈良県', region: 'kinki' },
  { name: '和歌山県', region: 'kinki' },
  { name: '鳥取県', region: 'chugoku' },
  { name: '島根県', region: 'chugoku' },
  { name: '岡山県', region: 'chugoku' },
  { name: '広島県', region: 'chugoku' },
  { name: '山口県', region: 'chugoku' },
  { name: '徳島県', region: 'shikoku' },
  { name: '香川県', region: 'shikoku' },
  { name: '愛媛県', region: 'shikoku' },
  { name: '高知県', region: 'shikoku' },
  { name: '福岡県', region: 'kyushu' },
  { name: '佐賀県', region: 'kyushu' },
  { name: '長崎県', region: 'kyushu' },
  { name: '熊本県', region: 'kyushu' },
  { name: '大分県', region: 'kyushu' },
  { name: '宮崎県', region: 'kyushu' },
  { name: '鹿児島県', region: 'kyushu' },
  { name: '沖縄県', region: 'okinawa' },
]

const regionOffset: Record<string, number> = {
  hokkaido: -10,
  tohoku: -6,
  kanto: -2,
  chubu: -3,
  kinki: 0,
  chugoku: 1,
  shikoku: 1,
  kyushu: 3,
  okinawa: 8,
}

// 大阪基準の週間天気
const baseWeather = [
  { date: '4/5', dow: '日', icon: '☀', hi: 22, lo: 12 },
  { date: '4/6', dow: '月', icon: '⛅', hi: 20, lo: 11 },
  { date: '4/7', dow: '火', icon: '☁', hi: 18, lo: 13 },
  { date: '4/8', dow: '水', icon: '🌧', hi: 16, lo: 12 },
  { date: '4/9', dow: '木', icon: '🌧', hi: 15, lo: 10 },
  { date: '4/10', dow: '金', icon: '⛅', hi: 19, lo: 11 },
  { date: '4/11', dow: '土', icon: '☀', hi: 23, lo: 13 },
]

function getWeather(pref: string) {
  const p = prefectures.find((x) => x.name === pref)
  const off = p ? regionOffset[p.region] ?? 0 : 0
  return baseWeather.map((w) => ({
    ...w,
    hi: w.hi + off,
    lo: w.lo + off,
  }))
}

const dowJa = ['日', '月', '火', '水', '木', '金', '土']

function formatNow(d: Date) {
  const date = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${dowJa[d.getDay()]}）`
  const time = `${d.getHours()}時${String(d.getMinutes()).padStart(2, '0')}分`
  return { date, time }
}

// サイドバーメニュー定義
type MenuItem = { label: string; href: string }
type MenuSection = { key: string; title: string; dot: string; items: MenuItem[] }

const menuSections: MenuSection[] = [
  {
    key: 'customers',
    title: '顧客管理',
    dot: '#22C55E',
    items: [
      { label: '顧客一覧', href: '/customers' },
      { label: '変更', href: '/customers/edit' },
    ],
  },
  {
    key: 'sales',
    title: '営業管理',
    dot: '#22C55E',
    items: [
      { label: '日誌登録', href: '/journal/new' },
      { label: '日誌一覧', href: '/journal.html' },
      { label: '行動履歴一覧', href: '/activity' },
      { label: '行動頻度表', href: '/activity/frequency' },
    ],
  },
  {
    key: 'sites',
    title: '現場・受注管理',
    dot: '#F59E0B',
    items: [
      { label: '現場一覧', href: '/sites' },
      { label: '受注一覧', href: '/orders.html' },
      { label: '受注申請一覧', href: '/orders/requests' },
      { label: '完了報告', href: '/sites/reports' },
      { label: '受注キャンセル処理', href: '/orders/cancel' },
    ],
  },
  {
    key: 'estimates',
    title: '見積・発注管理',
    dot: '#F59E0B',
    items: [
      { label: '見積書一覧', href: '/estimates.html' },
      { label: '見積依頼申請一覧', href: '/estimates/requests' },
      { label: '新規作成', href: '/estimates/new' },
      { label: '追加作成', href: '/estimates/add' },
      { label: '簡易見積書作成', href: '/estimates/quick' },
      { label: '発注一覧', href: '/purchases' },
      { label: '発注申請一覧', href: '/purchases/requests' },
    ],
  },
  {
    key: 'partners',
    title: '協力会社管理',
    dot: '#22C55E',
    items: [
      { label: '協力会社一覧', href: '/partners' },
      { label: '変更', href: '/partners/edit' },
    ],
  },
  {
    key: 'billing',
    title: '請求管理',
    dot: '#22C55E',
    items: [
      { label: '売上請求書一覧', href: '/billing/invoices' },
      { label: '売上請求書発行', href: '/billing/invoices/new' },
      { label: '売上入金管理', href: '/billing/receipts' },
    ],
  },
  {
    key: 'payments',
    title: '支払管理',
    dot: '#22C55E',
    items: [
      { label: '支払請求書一覧', href: '/payments/invoices' },
      { label: '支払請求書登録', href: '/payments/invoices/new' },
      { label: '小口経費一覧', href: '/payments/petty' },
      { label: '小口経費登録', href: '/payments/petty/new' },
    ],
  },
  {
    key: 'settlements',
    title: '清算管理',
    dot: '#F59E0B',
    items: [{ label: '清算書一覧', href: '/settlements' }],
  },
  {
    key: 'maintenance',
    title: 'メンテナンス管理',
    dot: '#22C55E',
    items: [
      { label: 'メンテナンス一覧', href: '/maintenance' },
      { label: '変更', href: '/maintenance/edit' },
    ],
  },
  {
    key: 'deadlines',
    title: '期限管理',
    dot: '#C9272D',
    items: [{ label: '期限管理一覧', href: '/deadlines' }],
  },
  {
    key: 'cashflow',
    title: '資金繰り管理',
    dot: '#1D4ED8',
    items: [{ label: '月別資金繰り表', href: '/cashflow' }],
  },
  {
    key: 'analytics',
    title: '分析・レポート',
    dot: '#1D4ED8',
    items: [
      { label: '営業担当別受注状況', href: '/analytics/sales-by-rep' },
      { label: '工事担当別利益率', href: '/analytics/site-by-rep' },
      { label: '積算担当別受託状況', href: '/analytics/design-by-rep' },
      { label: '顧客ランキング', href: '/analytics/customer-ranking' },
      { label: '協力会社別発注状況', href: '/analytics/partner-orders' },
      { label: '月別売上推移', href: '/analytics/sales-trend' },
      { label: '見積→受注転換率', href: '/analytics/conversion' },
    ],
  },
  {
    key: 'misc',
    title: 'その他',
    dot: '#888',
    items: [
      { label: '業務フロー', href: '/workflow.html' },
      { label: '組織図', href: '/org' },
      { label: '郵送宛名印刷', href: '/misc/mail-print' },
      { label: '近隣挨拶文作成', href: '/misc/greeting' },
      { label: '環境設定', href: '/settings' },
    ],
  },
]

// 進行中の工事
const constructions = [
  {
    id: 'genba-001',
    name: '○○邸 内装リフォーム',
    customer: '○○様',
    period: '3/15 〜 4/20',
    person: '田中',
    status: '施工中',
    statusClass: 'sekou',
  },
  {
    id: 'genba-002',
    name: '△△マンション 外壁改修',
    customer: '△△管理組合',
    period: '4/1 〜 5/30',
    person: '佐藤',
    status: '施工中',
    statusClass: 'sekou',
  },
  {
    id: 'genba-003',
    name: '□□ビル テナント改装',
    customer: '□□不動産',
    period: '4/10 〜 4/25',
    person: '山田',
    status: '着工前',
    statusClass: 'chakkou',
  },
  {
    id: 'genba-004',
    name: '◇◇邸 キッチンリフォーム',
    customer: '◇◇様',
    period: '2/20 〜 3/31',
    person: '高橋',
    status: '完了報告待ち',
    statusClass: 'kanryo',
  },
  {
    id: 'genba-005',
    name: '☆☆店舗 新装工事',
    customer: '☆☆(株)',
    period: '3/1 〜 4/10',
    person: '鈴木',
    status: '請求待ち',
    statusClass: 'seikyu',
  },
]

// 申請一覧
const applications = [
  {
    id: 'app-001',
    type: '発注申請',
    typeClass: 'hacchu',
    title: '○○邸 電気工事 発注',
    applicant: '田中',
    approver: '山田 部長',
    status: '部長承認待ち',
    statusClass: 'waiting',
    stuckDays: 2,
    date: '4/3',
  },
  {
    id: 'app-002',
    type: '見積依頼',
    typeClass: 'mitsumori',
    title: '△△マンション 外壁改修 見積依頼',
    applicant: '佐藤',
    approver: '鈴木 課長',
    status: '課長承認待ち',
    statusClass: 'waiting',
    stuckDays: 1,
    date: '4/4',
  },
  {
    id: 'app-003',
    type: '受注申請',
    typeClass: 'juchu',
    title: '□□ビル テナント改装 受注',
    applicant: '山田',
    approver: '役員会',
    status: '役員決裁待ち',
    statusClass: 'executive',
    stuckDays: 3,
    date: '4/2',
  },
  {
    id: 'app-004',
    type: '発注申請',
    typeClass: 'hacchu',
    title: '◇◇邸 キッチン材料 発注',
    applicant: '高橋',
    approver: '西川 社長',
    status: '社長決裁待ち',
    statusClass: 'executive',
    stuckDays: 0,
    date: '4/5',
  },
  {
    id: 'app-005',
    type: '見積依頼',
    typeClass: 'mitsumori',
    title: '☆☆店舗 新装工事 見積依頼',
    applicant: '鈴木',
    approver: '田中 部長',
    status: '差戻し',
    statusClass: 'returned',
    stuckDays: 4,
    date: '4/1',
  },
]

const notices = [
  {
    date: '04/05',
    tag: '重要',
    tagClass: 'important',
    text: '安全大会の開催日程が変更になりました（4/20→4/27）',
  },
  {
    date: '04/04',
    tag: '連絡',
    tagClass: 'info',
    text: 'GW休暇申請の締切は4/10（金）です',
  },
  {
    date: '04/03',
    tag: '総務',
    tagClass: 'general',
    text: '社用車の点検スケジュールを更新しました',
  },
  {
    date: '04/02',
    tag: '連絡',
    tagClass: 'info',
    text: '新入社員研修のOJT担当者が決定しました',
  },
  {
    date: '04/01',
    tag: '重要',
    tagClass: 'important',
    text: '4月度安全目標：高所作業時の安全帯使用徹底',
  },
]

const todaySchedule = [
  { time: '09:00', color: '#1D4ED8', text: '朝礼・安全確認', source: '社内' },
  { time: '10:00', color: '#16A34A', text: '○○邸 現場打合せ', source: 'Outlook' },
  { time: '13:00', color: '#F59E0B', text: '△△マンション 見積提出', source: 'Outlook' },
  { time: '15:00', color: '#8B5CF6', text: '協力会社 定例MTG', source: 'Outlook' },
  { time: '17:00', color: '#EC4899', text: '日報提出', source: '社内' },
]

const holidays = [
  { date: '4/7（月）〜 4/8（火）', name: '田中', type: '有給', typeClass: 'yukyu', memo: '私用' },
  { date: '4/10（金）PM', name: '佐藤', type: '半休', typeClass: 'hankyu', memo: '通院' },
  { date: '4/14（月）〜 4/15（火）', name: '山田', type: '研修', typeClass: 'kenshu', memo: '現場安全研修' },
  { date: '4/18（金）', name: '高橋', type: '特休', typeClass: 'tokkyu', memo: '慶弔' },
  { date: '4/21（月）〜 4/22（火）', name: '鈴木', type: '有給', typeClass: 'yukyu', memo: '旅行' },
  { date: '4/25（金）AM', name: '伊藤', type: '半休', typeClass: 'hankyu', memo: '家庭事情' },
  { date: '4/29（火）', name: '全社', type: '祝日', typeClass: 'holiday', memo: '昭和の日', allCompany: true },
]

export default function Menu() {
  const navigate = useNavigate()
  const go = (path: string) => () => navigate(path)

  const [now, setNow] = useState(() => new Date())
  const [pref, setPref] = useState('大阪府')
  const weekWeather = getWeather(pref)

  // 全セクション初期は展開
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggleSection = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const { date: dateStr, time: timeStr } = formatNow(now)

  const openSite = (id: string) => () => window.open(`/sites/${id}`, '_blank')

  return (
    <div className="menu-root">
      {/* 共有ヘッダー */}
      <div className="menu-hdr">
        <div className="menu-hdr-left">
          <a href="/" className="menu-hdr-logo">sola</a>
          <span className="menu-hdr-sub">ラックプラス 総合業務管理システム</span>
        </div>
        <div className="menu-hdr-right">
          <span className="menu-hdr-datetime">{dateStr} {timeStr}</span>
          <span className="menu-hdr-user">西川 公大 ｜ 0.9.9.17341</span>
        </div>
      </div>

      {/* 通知バー */}
      <div className="notif-bar">
        <span className="notif-icon">●</span>
        <span className="notif-label">通知・メッセージ</span>
        <button className="notif-btn active" onClick={go('/messages/review')}>
          要確認BOX <span className="badge">5</span>
        </button>
        <button className="notif-btn" onClick={go('/messages')}>
          受信BOX
        </button>
        <button className="notif-btn" onClick={go('/messages/sent')}>
          送信BOX
        </button>
      </div>

      {/* サイドバー + ダッシュボード */}
      <div className="body-wrap">
        {/* サイドバー */}
        <aside className="sidebar">
          {menuSections.map((sec) => (
            <div className="menu-section" key={sec.key}>
              <div
                className={`menu-header${collapsed[sec.key] ? ' collapsed' : ''}`}
                onClick={() => toggleSection(sec.key)}
              >
                <span className="menu-title">
                  <span className="menu-dot" style={{ background: sec.dot }} />
                  {sec.title}
                </span>
                <span className="menu-arrow">▾</span>
              </div>
              <div className="menu-items">
                {sec.items.map((item) => (
                  <a
                    key={item.label}
                    className="menu-item"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* メインダッシュボード */}
        <div className="main-area">
          {/* Row 1: 通達 + 天気 */}
          <div className="dash-row r1">
            <div className="card">
              <div className="card-head">
                <span className="card-title">
                  <span className="icon">📢</span> 社内通達
                </span>
                <span className="card-more">すべて見る →</span>
              </div>
              <ul className="notice-list">
                {notices.map((n, i) => (
                  <li key={i}>
                    <span className="notice-date">{n.date}</span>
                    <span className={`notice-tag ${n.tagClass}`}>{n.tag}</span>
                    <span className="notice-text">{n.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="card-head">
                <span className="card-title">
                  <span className="icon">🌤</span> 週間天気
                </span>
                <select
                  className="weather-pref-select"
                  value={pref}
                  onChange={(e) => setPref(e.target.value)}
                >
                  {prefectures.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="weather-grid">
                {weekWeather.map((w, i) => (
                  <div className={`w-day${i === 0 ? ' today' : ''}`} key={w.date}>
                    <div className="w-label">{i === 0 ? '今日' : w.dow}</div>
                    <div className="w-icon">{w.icon}</div>
                    <div className="w-temp">
                      {w.hi}°<span>/{w.lo}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 進行中の工事一覧 */}
          <div className="construction-card">
            <div className="card-head">
              <span className="card-title">
                <span className="icon">🏗</span> 進行中の工事一覧
              </span>
              <span className="card-more" onClick={go('/sites')}>
                すべて見る →
              </span>
            </div>
            <table className="construction-table">
              <thead>
                <tr>
                  <th>工事名</th>
                  <th>顧客名</th>
                  <th>工期</th>
                  <th>担当</th>
                  <th>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {constructions.map((c) => (
                  <tr key={c.id} onClick={openSite(c.id)}>
                    <td className="proj-name">{c.name}</td>
                    <td style={{ fontSize: '10px', color: '#555' }}>{c.customer}</td>
                    <td className="proj-period">{c.period}</td>
                    <td className="proj-person">{c.person}</td>
                    <td>
                      <span className={`status-badge ${c.statusClass}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="summary-row">
              <div className="summary-item">
                <span className="summary-count" style={{ color: '#1D4ED8' }}>2</span> 施工中
              </div>
              <div className="summary-item">
                <span className="summary-count" style={{ color: '#92400E' }}>1</span> 着工前
              </div>
              <div className="summary-item">
                <span className="summary-count" style={{ color: '#065F46' }}>1</span> 完了報告待ち
              </div>
              <div className="summary-item">
                <span className="summary-count" style={{ color: '#9D174D' }}>1</span> 請求待ち
              </div>
            </div>
          </div>

          {/* 申請一覧 */}
          <div className="application-card">
            <div className="card-head">
              <span className="card-title">
                <span className="icon">📋</span> 申請一覧
              </span>
              <span className="card-more">すべて見る →</span>
            </div>
            <table className="application-table">
              <thead>
                <tr>
                  <th>種別</th>
                  <th>件名</th>
                  <th>申請者 → 承認者</th>
                  <th>状態</th>
                  <th>経過</th>
                  <th>申請日</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id} onClick={() => window.open(`/applications/${a.id}`, '_blank')}>
                    <td>
                      <span className={`apply-badge ${a.typeClass}`}>{a.type}</span>
                    </td>
                    <td className="apply-title">{a.title}</td>
                    <td className="apply-flow">
                      <span className="apply-from">{a.applicant}</span>
                      <span className="apply-arrow">→</span>
                      <span className="apply-to">{a.approver}</span>
                    </td>
                    <td>
                      <span className={`apply-status ${a.statusClass}`}>{a.status}</span>
                    </td>
                    <td>
                      {a.stuckDays === 0 ? (
                        <span className="stuck-days fresh">当日</span>
                      ) : a.stuckDays >= 3 ? (
                        <span className="stuck-days danger">{a.stuckDays}日</span>
                      ) : (
                        <span className="stuck-days warn">{a.stuckDays}日</span>
                      )}
                    </td>
                    <td className="apply-date">{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Row 2: 今日の予定 + 休暇 + 外部リンク */}
          <div className="dash-row r2">
            <div className="card">
              <div className="card-head">
                <span className="card-title">
                  <span className="icon">🗓</span> 今日の予定
                </span>
                <span className="outlook-chip">📎 Outlook連携</span>
              </div>
              <ul className="sched-list">
                {todaySchedule.map((s, i) => (
                  <li key={i}>
                    <span className="sched-time">{s.time}</span>
                    <span className="sched-bar" style={{ background: s.color }} />
                    <span className="sched-text">{s.text}</span>
                    <span className="sched-source">{s.source}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-title">
                  <span className="icon">🏖</span> 休暇予定（4月）
                </span>
                <span className="card-more">全員表示 →</span>
              </div>
              <table className="holiday-table">
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>氏名</th>
                    <th>種別</th>
                    <th>備考</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((h, i) => (
                    <tr key={i}>
                      <td className="h-date">{h.date}</td>
                      <td className="h-name" style={h.allCompany ? { color: '#C9272D' } : undefined}>
                        {h.name}
                      </td>
                      <td>
                        <span className={`h-badge-sm ${h.typeClass}`}>{h.type}</span>
                      </td>
                      <td style={{ fontSize: '9px', color: '#888' }}>{h.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-title">
                  <span className="icon">🔗</span> 外部サービス
                </span>
              </div>
              <div className="ext-links">
                <a className="ext-link" href="https://recoru.in/" target="_blank" rel="noopener noreferrer">
                  <div className="ext-icon" style={{ background: '#0EA5E9' }}>R</div>
                  <div>
                    <div className="ext-name">Recoru</div>
                    <div className="ext-desc">勤怠管理</div>
                  </div>
                  <span className="ext-arrow">↗</span>
                </a>
                <a className="ext-link" href="https://smarthr.jp/" target="_blank" rel="noopener noreferrer">
                  <div className="ext-icon" style={{ background: '#00C4CC' }}>S</div>
                  <div>
                    <div className="ext-name">SmartHR</div>
                    <div className="ext-desc">労務管理</div>
                  </div>
                  <span className="ext-arrow">↗</span>
                </a>
                <a className="ext-link" href="https://reserva.be/" target="_blank" rel="noopener noreferrer">
                  <div className="ext-icon" style={{ background: '#6366F1' }}>り</div>
                  <div>
                    <div className="ext-name">りざーブプラス</div>
                    <div className="ext-desc">予約管理</div>
                  </div>
                  <span className="ext-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
