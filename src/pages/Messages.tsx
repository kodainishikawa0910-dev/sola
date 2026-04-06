import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Messages.css'

type Message = {
  id: string
  subject: string
  from: string
  to: string
  date: string
  category: string
  categoryBg: string
  categoryColor: string
  read: boolean
  urgent: boolean
  body: string
  relatedSite?: string
  box: 'review' | 'inbox' | 'sent'
}

const messages: Message[] = [
  // 要確認BOX (5)
  {
    id: 'MSG-001', subject: '発注承認依頼：外壁塗装材料一式', from: '西本 剛', to: '阪口 誠',
    date: '2026-04-05 09:15', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: false, urgent: true, body: '外壁塗装工事に必要な材料の発注について承認をお願いいたします。\n\n発注先：大阪建材株式会社\n金額：¥1,250,000（税別）\n納期：2026年4月15日\n\nご確認のほどよろしくお願いいたします。',
    relatedSite: '田中邸 外壁塗装工事', box: 'review',
  },
  {
    id: 'MSG-002', subject: '見積承認依頼：防水工事 見積書', from: '山本 裕之', to: '阪口 誠',
    date: '2026-04-04 16:30', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: false, urgent: true, body: '防水工事の見積書を作成いたしました。\n\n工事名：マンション屋上防水改修\n見積金額：¥3,800,000（税別）\n工期：約3週間\n\nご確認・承認をお願いいたします。',
    relatedSite: 'ABCマンション 防水工事', box: 'review',
  },
  {
    id: 'MSG-003', subject: '受注申請：内装リフォーム工事', from: '中島 健太', to: '阪口 誠',
    date: '2026-04-04 11:00', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: true, urgent: false, body: '下記案件の受注申請を提出いたします。\n\n顧客名：佐藤様\n工事内容：LDK内装リフォーム\n受注金額：¥2,100,000（税別）\n工期：2026年5月〜6月\n\nご承認をお願いいたします。',
    relatedSite: '佐藤邸 内装リフォーム', box: 'review',
  },
  {
    id: 'MSG-004', subject: '工期変更申請：基礎補強工事', from: '渡村 大輔', to: '阪口 誠',
    date: '2026-04-03 14:45', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: true, urgent: true, body: '基礎補強工事について、天候不良により工期変更の申請をいたします。\n\n変更前：4月20日完了予定\n変更後：4月30日完了予定\n理由：4月第2週の大雨により作業が3日間中断\n\nご承認をお願いいたします。',
    relatedSite: '高橋邸 基礎補強工事', box: 'review',
  },
  {
    id: 'MSG-005', subject: '経費精算依頼：現場交通費・消耗品', from: '田中 浩二', to: '阪口 誠',
    date: '2026-04-02 10:20', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: true, urgent: false, body: '3月分の経費精算を申請いたします。\n\n交通費：¥12,400\n消耗品費：¥8,600\n合計：¥21,000\n\n領収書は添付ファイルをご確認ください。',
    box: 'review',
  },
  // 受信BOX (6)
  {
    id: 'MSG-006', subject: '工事進捗報告：外壁塗装 第2週完了', from: '渡村 大輔', to: '阪口 誠',
    date: '2026-04-05 08:00', category: '報告', categoryBg: '#DBEAFE', categoryColor: '#1E40AF',
    read: false, urgent: false, body: '外壁塗装工事の第2週の進捗をご報告いたします。\n\n完了作業：\n・下地処理完了\n・プライマー塗布完了\n・中塗り 80%完了\n\n来週の予定：\n・中塗り仕上げ\n・上塗り開始',
    relatedSite: '田中邸 外壁塗装工事', box: 'inbox',
  },
  {
    id: 'MSG-007', subject: '現場写真共有：防水工事 施工前', from: '筒井 修平', to: '阪口 誠',
    date: '2026-04-04 17:50', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: false, urgent: false, body: '防水工事の施工前写真を共有いたします。\n\n撮影日：2026年4月4日\n撮影箇所：屋上全体、排水口周辺、既存防水層の劣化箇所\n\n写真は添付ファイルをご確認ください。',
    relatedSite: 'ABCマンション 防水工事', box: 'inbox',
  },
  {
    id: 'MSG-008', subject: '安全確認連絡：明日の作業について', from: '西本 剛', to: '阪口 誠',
    date: '2026-04-04 15:00', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: true, urgent: true, body: '明日4月5日の現場作業について安全確認事項を連絡いたします。\n\n・強風注意報が発令される可能性があります\n・高所作業は風速10m/s以上で中止\n・安全帯の点検を必ず実施してください\n\n各現場責任者への周知をお願いいたします。',
    box: 'inbox',
  },
  {
    id: 'MSG-009', subject: '会議案内：4月度 全体定例会議', from: '西川 公大', to: '阪口 誠',
    date: '2026-04-03 09:30', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: true, urgent: false, body: '4月度の全体定例会議のご案内です。\n\n日時：2026年4月10日（金）10:00〜12:00\n場所：本社 会議室A\n議題：\n1. 3月度実績報告\n2. 4月度受注見込み\n3. 安全管理について\n4. その他',
    box: 'inbox',
  },
  {
    id: 'MSG-010', subject: '資材価格改定のお知らせ', from: '山本 裕之', to: '阪口 誠',
    date: '2026-04-02 14:00', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: true, urgent: false, body: '主要取引先より資材価格改定の通知がありました。\n\n改定日：2026年5月1日\n対象：鉄筋、セメント、防水材\n改定率：約5〜8%値上げ\n\n今後の見積に反映が必要です。詳細は添付資料をご確認ください。',
    box: 'inbox',
  },
  {
    id: 'MSG-011', subject: '顧客対応相談：クレーム対応について', from: '中島 健太', to: '阪口 誠',
    date: '2026-04-01 16:20', category: '相談', categoryBg: '#EDE9FE', categoryColor: '#5B21B6',
    read: true, urgent: false, body: '佐藤様より工事騒音に関するご指摘がありました。\n\n内容：午前8時台の作業開始が早いとのこと\n現在の対応：作業開始を9時に変更することを提案済み\n\nお客様への対応方針についてご相談させてください。',
    relatedSite: '佐藤邸 内装リフォーム', box: 'inbox',
  },
  // 送信BOX (4)
  {
    id: 'MSG-012', subject: '発注承認完了：配管材料', from: '阪口 誠', to: '西本 剛',
    date: '2026-04-04 10:00', category: '承認依頼', categoryBg: '#FEF3C7', categoryColor: '#92400E',
    read: true, urgent: false, body: '配管材料の発注について承認いたしました。\n発注手続きを進めてください。',
    relatedSite: '鈴木邸 配管工事', box: 'sent',
  },
  {
    id: 'MSG-013', subject: '全体連絡：GW期間の稼働について', from: '阪口 誠', to: '全スタッフ',
    date: '2026-04-03 11:30', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: true, urgent: false, body: 'GW期間（4/29〜5/6）の稼働について連絡いたします。\n\n・4/29〜5/3：休業\n・5/4〜5/6：現場により稼働あり\n\n稼働が必要な現場は各部長まで報告してください。',
    box: 'sent',
  },
  {
    id: 'MSG-014', subject: '安全パトロール結果報告', from: '阪口 誠', to: '西本 剛',
    date: '2026-04-02 17:00', category: '報告', categoryBg: '#DBEAFE', categoryColor: '#1E40AF',
    read: true, urgent: false, body: '4月2日実施の安全パトロール結果を共有します。\n\n巡回現場：3現場\n指摘事項：2件（軽微）\n・田中邸：仮設足場の養生シート一部破損 → 即日修繕済み\n・高橋邸：工具の整理整頓を指導\n\n全体として良好な状態です。',
    box: 'sent',
  },
  {
    id: 'MSG-015', subject: '見積修正依頼：防水工事', from: '阪口 誠', to: '山本 裕之',
    date: '2026-04-01 13:00', category: '連絡', categoryBg: '#D1FAE5', categoryColor: '#065F46',
    read: true, urgent: false, body: '防水工事の見積について、下記の修正をお願いします。\n\n・防水材のグレードをA仕様からB仕様に変更\n・諸経費率を8%から10%に変更\n・工期を3週間から4週間に変更\n\n修正後の見積書を再提出してください。',
    relatedSite: 'ABCマンション 防水工事', box: 'sent',
  },
]

type TabKey = 'review' | 'inbox' | 'sent'

const tabConfig: { key: TabKey; label: string; path: string; badgeType: 'red' | 'gray' }[] = [
  { key: 'review', label: '要確認BOX', path: '/messages/review', badgeType: 'red' },
  { key: 'inbox', label: '受信BOX', path: '/messages', badgeType: 'gray' },
  { key: 'sent', label: '送信BOX', path: '/messages/sent', badgeType: 'gray' },
]

function resolveTab(pathname: string): TabKey {
  if (pathname.startsWith('/messages/review')) return 'review'
  if (pathname.startsWith('/messages/sent')) return 'sent'
  return 'inbox'
}

export default function Messages() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = resolveTab(location.pathname)

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => messages.filter((m) => m.box === activeTab), [activeTab])

  const counts = useMemo(() => ({
    review: messages.filter((m) => m.box === 'review').length,
    inbox: messages.filter((m) => m.box === 'inbox').length,
    sent: messages.filter((m) => m.box === 'sent').length,
  }), [])

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isSentTab = activeTab === 'sent'

  return (
    <div className="msg-page">
      <div className="msg-page-header">
        <div>
          <div className="msg-breadcrumb">
            <a href="/">メニュー</a> ＞ <span className="msg-bc-current">メッセージ</span>
          </div>
          <div className="msg-page-title">メッセージ</div>
        </div>
        <button className="msg-new-btn" onClick={() => navigate('/messages/new')}>＋ 新規作成</button>
      </div>

      <div className="msg-content">
        {/* タブ */}
        <div className="msg-tabs">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              className={`msg-tab${activeTab === tab.key ? ' msg-tab--active' : ''}`}
              onClick={() => { setExpandedId(null); navigate(tab.path); }}
            >
              {tab.label}
              <span className={`msg-badge msg-badge--${tab.badgeType}`}>{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* テーブル */}
        <div className="msg-table-wrap">
          <table className="msg-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th style={{ width: 36 }}>重要</th>
                <th style={{ width: 80 }}>カテゴリ</th>
                <th>件名</th>
                <th style={{ width: 100 }}>{isSentTab ? '宛先' : '送信者'}</th>
                <th style={{ width: 140 }}>関連現場</th>
                <th style={{ width: 110 }}>日時</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="msg-empty">メッセージはありません</td></tr>
              ) : (
                filtered.map((m) => (
                  <>
                    <tr
                      key={m.id}
                      className={!m.read ? 'msg-row--unread' : undefined}
                      onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="msg-checkbox"
                          checked={checked.has(m.id)}
                          onChange={() => toggleCheck(m.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>{m.urgent ? <span className="msg-urgent-dot" /> : null}</td>
                      <td>
                        <span className="msg-category" style={{ background: m.categoryBg, color: m.categoryColor }}>
                          {m.category}
                        </span>
                      </td>
                      <td><span className="msg-subject">{m.subject}</span></td>
                      <td className="msg-person">{isSentTab ? m.to : m.from}</td>
                      <td className="msg-site">{m.relatedSite ?? '—'}</td>
                      <td className="msg-date">{m.date}</td>
                    </tr>
                    {expandedId === m.id && (
                      <tr key={`${m.id}-detail`} className="msg-detail">
                        <td colSpan={7}>
                          <div className="msg-detail-meta">
                            差出人: {m.from}　｜　宛先: {m.to}　｜　{m.date}
                          </div>
                          <div className="msg-detail-body">{m.body}</div>
                          <div className="msg-detail-actions">
                            <button className="msg-detail-btn msg-detail-btn--primary">返信</button>
                            <button className="msg-detail-btn">転送</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
