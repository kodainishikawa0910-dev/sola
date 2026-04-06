import { useState, useMemo } from 'react'
import './JournalNew.css'
import {
  journalEntries as masterJournal,
  customers as masterCustomers,
  sites as masterSites,
  staff as masterStaff,
  getStaff,
  getSite,
  getCustomer,
  type JournalEntry,
} from '../data/master'

const DOW = ['日', '月', '火', '水', '木', '金', '土']

type ViewMode = 'day' | 'week'

function toDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateJa(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function getMonday(d: Date) {
  const dt = new Date(d)
  const day = dt.getDay()
  const diff = day === 0 ? -6 : 1 - day
  dt.setDate(dt.getDate() + diff)
  return dt
}

function addDays(d: Date, n: number) {
  const dt = new Date(d)
  dt.setDate(dt.getDate() + n)
  return dt
}

function getWeekDays(d: Date) {
  const mon = getMonday(d)
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i))
}


const actionOptions = [
  '進捗確認・打合せ',
  '見積提出',
  '契約手続き',
  'クレーム対応',
  '新規挨拶',
  '定期フォロー',
  'その他',
]

const resultOptions = [
  { value: 'good', label: '◎ 良好' },
  { value: 'normal', label: '○ 普通' },
  { value: 'bad', label: '△ 要注意' },
  { value: 'none', label: '— 未実施' },
]

type ActionRow = {
  id: number
  date: string
  staffId: string
  customerId: string
  siteId: string
  customer: string
  project: string
  type: string
  typeClass: string
  action: string
  result: string
  comment: string
  rank: string
}

// マスタデータからActionRowに変換
function toActionRows(entries: JournalEntry[]): ActionRow[] {
  return entries.map((j) => ({
    ...j,
    customer: getCustomer(j.customerId)?.kanji ?? '—',
    project: getSite(j.siteId)?.name ?? '—',
  }))
}

const initialRows: ActionRow[] = toActionRows(masterJournal)

// モーダル用顧客リスト（マスタから）
const modalCustomers = masterCustomers.map((c) => {
  const firstSite = masterSites.find((s) => s.customerId === c.id)
  return {
    id: c.id,
    name: c.kanji,
    address: c.addr,
    area: c.addrShort,
    status: '取引中',
    statusColor: '#059669',
    project: firstSite?.name ?? '—',
    siteId: firstSite?.id ?? '',
  }
})

export default function JournalNew() {
  const [rows, setRows] = useState<ActionRow[]>(initialRows)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 3, 6)) // 2026-04-06
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [selectedStaff, setSelectedStaff] = useState('nishikawa')

  // 選択日+担当者のデータ
  const dayRows = useMemo(
    () => rows.filter((r) => r.date === toDateStr(selectedDate) && r.staffId === selectedStaff),
    [rows, selectedDate, selectedStaff]
  )
  const visitCount = dayRows.filter((r) => r.typeClass === 'visit').length
  const phoneCount = dayRows.filter((r) => r.typeClass === 'phone').length
  const mailCount = dayRows.filter((r) => r.typeClass === 'mail').length

  // 週の日付リスト
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  // ◀▶ナビ
  const nav = (dir: -1 | 1) => {
    setSelectedDate((prev) => {
      const d = new Date(prev)
      if (viewMode === 'day') d.setDate(d.getDate() + dir)
      else d.setDate(d.getDate() + dir * 7)
      return d
    })
  }

  // 表示ラベル
  const dateLabel = useMemo(() => {
    if (viewMode === 'day') {
      return `${formatDateJa(selectedDate)}（${DOW[selectedDate.getDay()]}）`
    }
    const mon = getMonday(selectedDate)
    const sun = addDays(mon, 6)
    return `${mon.getMonth() + 1}/${mon.getDate()}（${DOW[mon.getDay()]}）〜 ${sun.getMonth() + 1}/${sun.getDate()}（${DOW[sun.getDay()]}）`
  }, [selectedDate, viewMode])

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value + 'T00:00:00')
    if (!isNaN(d.getTime())) setSelectedDate(d)
  }

  // 日別行データ取得（担当者フィルタ付き）
  const rowsForDate = (ds: string) => rows.filter((r) => r.date === ds && r.staffId === selectedStaff)

  const deleteRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id))

  const updateRow = (id: number, field: keyof ActionRow, value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const addCustomer = (c: (typeof modalCustomers)[0]) => {
    const newRow: ActionRow = {
      id: Date.now(),
      date: toDateStr(selectedDate),
      staffId: selectedStaff,
      customerId: c.id,
      siteId: c.siteId,
      customer: c.name,
      project: c.project,
      type: '訪問',
      typeClass: 'visit',
      action: '進捗確認・打合せ',
      result: 'none',
      comment: '',
      rank: 'C',
    }
    setRows((prev) => [...prev, newRow])
    setModalOpen(false)
    setSearchText('')
  }

  const filtered = modalCustomers.filter(
    (c) =>
      c.name.includes(searchText) ||
      c.address.includes(searchText) ||
      c.project.includes(searchText)
  )

  return (
    <div className="journal-page">
      {/* ページヘッダー */}
      <div className="j-page-header">
        <div>
          <div className="j-breadcrumb">
            <a href="/">メニュー</a> ＞ <a href="/journal">営業管理</a> ＞ 日誌登録
          </div>
          <div className="j-page-title">日誌登録</div>
        </div>
        <div className="j-person-area">
          <span className="j-person-label">担当者</span>
          <select className="j-person-select" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
            {masterStaff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 日誌コンテンツ */}
      <div className="j-content">
        {/* 日付ナビ */}
        <div className="j-date-header">
          <div className="j-date-area">
            <div className="j-view-toggle">
              {(['day', 'week'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  className={`j-view-btn${viewMode === m ? ' active' : ''}`}
                  onClick={() => setViewMode(m)}
                >
                  {{ day: '日別', week: '週間' }[m]}
                </button>
              ))}
            </div>
            <div className="j-date-nav">
              <button className="j-date-nav-btn" onClick={() => nav(-1)}>◀</button>
              <span className="j-date-display">{dateLabel}</span>
              <button className="j-date-nav-btn" onClick={() => nav(1)}>▶</button>
            </div>
            <input
              type="date"
              className="j-date-input"
              value={toDateStr(selectedDate)}
              onChange={handleDateInput}
            />
            <button
              className="j-today-btn"
              onClick={() => setSelectedDate(new Date())}
            >
              今日
            </button>
          </div>
          <button className="j-add-btn" onClick={() => setModalOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M8 3v10M3 8h10" />
            </svg>
            行動追加
          </button>
        </div>

        {viewMode === 'day' ? (
          <>
            {/* サマリー */}
            <div className="j-summary-bar">
              <div className="j-summary-item">
                本日の行動 <span className="j-summary-count">{dayRows.length}</span> 件
              </div>
              <div className="j-summary-item">
                訪問 <span className="j-summary-count" style={{ color: '#1D4ED8' }}>{visitCount}</span>
              </div>
              <div className="j-summary-item">
                電話 <span className="j-summary-count" style={{ color: '#059669' }}>{phoneCount}</span>
              </div>
              <div className="j-summary-item">
                メール <span className="j-summary-count" style={{ color: '#B45309' }}>{mailCount}</span>
              </div>
            </div>

            {/* 行動テーブル */}
            <table className="j-action-table">
              <thead>
                <tr>
                  <th style={{ width: 30, textAlign: 'center' }}>No</th>
                  <th style={{ width: 140 }}>顧客名</th>
                  <th style={{ width: 70 }}>行動種別</th>
                  <th style={{ width: 140 }}>行動予定</th>
                  <th style={{ width: 80 }}>行動結果</th>
                  <th>結果コメント</th>
                  <th style={{ width: 60 }}>見込み度</th>
                  <th style={{ width: 30 }} />
                </tr>
              </thead>
              <tbody>
                {dayRows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 9 }}>{i + 1}</td>
                    <td>
                      <a href="#" className="j-customer-link">{r.customer}</a>
                      <div className="j-project-sub">{r.project}</div>
                    </td>
                    <td>
                      <span className={`j-badge j-badge-${r.typeClass}`}>{r.type}</span>
                    </td>
                    <td>
                      <select
                        className="j-action-select"
                        value={r.action}
                        onChange={(e) => updateRow(r.id, 'action', e.target.value)}
                      >
                        {actionOptions.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={`j-result-select j-result-${r.result}`}
                        value={r.result}
                        onChange={(e) => updateRow(r.id, 'result', e.target.value)}
                      >
                        {resultOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        className="j-comment-input"
                        rows={1}
                        value={r.comment}
                        onChange={(e) => updateRow(r.id, 'comment', e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`j-rank j-rank-${r.rank.toLowerCase()}`}>{r.rank}</span>
                    </td>
                    <td>
                      <button className="j-delete-btn" onClick={() => deleteRow(r.id)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 空行追加エリア */}
            <div className="j-empty-row" onClick={() => setModalOpen(true)}>
              <div className="j-empty-row-text">＋ 行動追加ボタンをクリックして顧客を追加</div>
            </div>
          </>
        ) : (
          /* ===== 週間表示: 7カラム横並び ===== */
          <div className="j-week-grid">
            {weekDays.map((d) => {
              const ds = toDateStr(d)
              const dayData = rowsForDate(ds)
              const isToday = ds === toDateStr(new Date())
              const isSel = ds === toDateStr(selectedDate)
              const isSat = d.getDay() === 6
              const isSun = d.getDay() === 0
              return (
                <div key={ds} className={`j-week-col${isToday ? ' today' : ''}${isSel ? ' selected' : ''}`}>
                  <div
                    className={`j-week-col-header${isSat ? ' sat' : ''}${isSun ? ' sun' : ''}`}
                    onClick={() => { setSelectedDate(d); setViewMode('day') }}
                  >
                    <span className="j-wch-dow">{DOW[d.getDay()]}</span>
                    <span className="j-wch-date">{d.getMonth() + 1}/{d.getDate()}</span>
                    <span className="j-wch-count">{dayData.length}件</span>
                  </div>
                  <div className="j-week-col-body">
                    {dayData.length === 0 ? (
                      <div className="j-week-empty">予定なし</div>
                    ) : (
                      dayData.map((r) => (
                        <div
                          key={r.id}
                          className="j-week-card"
                          onClick={() => { setSelectedDate(d); setViewMode('day') }}
                        >
                          <div className="j-week-card-top">
                            <span className={`j-badge j-badge-${r.typeClass}`}>{r.type}</span>
                            <span className={`j-rank j-rank-${r.rank.toLowerCase()}`}>{r.rank}</span>
                          </div>
                          <div className="j-week-card-customer">{r.customer}</div>
                          <div className="j-week-card-action">{r.action}</div>
                          {r.comment && (
                            <div className="j-week-card-comment">{r.comment}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="j-footer">
        <button className="j-btn-cancel" onClick={() => window.history.back()}>キャンセル</button>
        <button className="j-btn-draft">下書き保存</button>
        <button className="j-btn-save">登録する</button>
      </div>

      {/* 顧客検索モーダル */}
      {modalOpen && (
        <div className="j-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="j-modal">
            <div className="j-modal-header">
              <div className="j-modal-title">顧客検索・追加</div>
              <button className="j-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="j-modal-search">
              <input
                type="text"
                className="j-modal-search-input"
                placeholder="顧客名・住所・電話番号で検索..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />
            </div>
            <div className="j-modal-body">
              {filtered.map((c) => (
                <div key={c.name} className="j-customer-row" onClick={() => addCustomer(c)}>
                  <div>
                    <div className="j-cr-name">{c.name}</div>
                    <div className="j-cr-sub">{c.address}</div>
                  </div>
                  <div className="j-cr-area">{c.area}</div>
                  <div className="j-cr-status" style={{ color: c.statusColor }}>● {c.status}</div>
                  <div style={{ textAlign: 'right' }}>
                    <button className="j-cr-select-btn">選択</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="j-modal-footer">
              <span>全 {modalCustomers.length} 件中 {filtered.length} 件表示</span>
              <span>クリックまたは「選択」で行動に追加されます</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
