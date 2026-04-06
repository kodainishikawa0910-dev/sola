import { useState, useMemo } from 'react'
import './Customers.css'
import {
  customers as allCustomers,
  sites,
  journalEntries,
  getStaff,
  getSitesForCustomer,
} from '../data/master'

type Page = 'list' | 'detail'
type DetailTab = 'basic' | 'history' | 'contact'

export default function Customers() {
  const [page, setPage] = useState<Page>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTab>('basic')
  const [search, setSearch] = useState({ kanji: '', kana: '', addr: '', koji: '' })

  const filtered = useMemo(() => allCustomers.filter((c) =>
    (!search.kanji || c.kanji.includes(search.kanji)) &&
    (!search.kana || c.kana.includes(search.kana)) &&
    (!search.addr || c.addr.includes(search.addr)) &&
    (!search.koji || getSitesForCustomer(c.id).some((s) => s.name.includes(search.koji)))
  ), [search])

  const selected = allCustomers.find((c) => c.id === selectedId)

  // 選択顧客の工事履歴
  const custSites = useMemo(
    () => (selected ? getSitesForCustomer(selected.id) : []),
    [selected]
  )

  // 選択顧客のコンタクト履歴（日誌から取得）
  const custContacts = useMemo(() => {
    if (!selected) return []
    return journalEntries
      .filter((j) => j.customerId === selected.id)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [selected])

  // 最終接触日
  const lastContact = (custId: string) => {
    const entries = journalEntries.filter((j) => j.customerId === custId)
    if (entries.length === 0) return '—'
    return entries.sort((a, b) => b.date.localeCompare(a.date))[0].date.replace(/-/g, '/')
  }

  // 現場名一覧（サマリ用）
  const kojiSummary = (custId: string) => {
    const s = getSitesForCustomer(custId)
    if (s.length === 0) return '—'
    return s.map((x) => x.name).slice(0, 2).join('、') + (s.length > 2 ? ' ほか' : '')
  }

  const openDetail = (id: string) => {
    setSelectedId(id)
    setDetailTab('basic')
    setPage('detail')
  }

  return (
    <div className="cust-page">
      {/* ページヘッダー */}
      <div className="cust-page-header">
        <div>
          <div className="cust-breadcrumb">
            <a href="/">メニュー</a> ＞{' '}
            {page === 'list' ? (
              <span className="cust-bc-current">顧客一覧</span>
            ) : (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('list') }}>顧客一覧</a> ＞{' '}
                <span className="cust-bc-current">{selected?.kanji} {selected?.honorific}</span>
              </>
            )}
          </div>
          <div className="cust-page-title">{page === 'list' ? '顧客一覧' : `${selected?.kanji} ${selected?.honorific}`}</div>
        </div>
        {page === 'list' && <button className="cust-new-btn">＋ 新規登録</button>}
      </div>

      <div className="cust-content">
        {page === 'list' ? (
          <>
            {/* 検索パネル */}
            <div className="cust-search-panel">
              <div className="cust-search-head"><span className="cust-search-title">顧客検索</span></div>
              <div className="cust-search-body">
                <div className="cust-search-grid">
                  <div className="cust-search-field">
                    <label>顧客名（漢字）</label>
                    <input type="text" placeholder="例：田中" value={search.kanji} onChange={(e) => setSearch({ ...search, kanji: e.target.value })} />
                  </div>
                  <div className="cust-search-field">
                    <label>顧客名（カナ）</label>
                    <input type="text" placeholder="例：タナカ" value={search.kana} onChange={(e) => setSearch({ ...search, kana: e.target.value })} />
                  </div>
                  <div className="cust-search-field">
                    <label>住所</label>
                    <input type="text" placeholder="例：堺市南区" value={search.addr} onChange={(e) => setSearch({ ...search, addr: e.target.value })} />
                  </div>
                  <div className="cust-search-field">
                    <label>現場名</label>
                    <input type="text" placeholder="例：田中邸改修工事" value={search.koji} onChange={(e) => setSearch({ ...search, koji: e.target.value })} />
                  </div>
                </div>
                <div className="cust-search-actions">
                  <button className="cust-reset-btn" onClick={() => setSearch({ kanji: '', kana: '', addr: '', koji: '' })}>リセット</button>
                  <button className="cust-search-btn">検索する</button>
                </div>
                <div className="cust-search-result">{filtered.length}件の顧客が見つかりました</div>
              </div>
            </div>

            {/* カード一覧 */}
            <div className="cust-card-list">
              {filtered.length === 0 ? (
                <div className="cust-empty">該当する顧客が見つかりませんでした</div>
              ) : (
                filtered.map((c) => (
                  <div key={c.id} className="cust-card" onClick={() => openDetail(c.id)}>
                    <div className="cust-card-avatar" style={{ background: c.iBg, color: c.iColor }}>{c.initial}</div>
                    <div className="cust-card-info">
                      <div className="cust-card-name">
                        {c.kanji}{c.honorific && `　${c.honorific}`}
                        {c.badges.map((b) => (
                          <span key={b.label} className="cust-badge" style={{ background: b.bg, color: b.color }}>{b.label}</span>
                        ))}
                      </div>
                      <div className="cust-card-sub">{c.addr}　／　最終接触：{lastContact(c.id)}　／　{kojiSummary(c.id)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : selected ? (
          <>
            {/* プロフィールヘッド */}
            <div className="cust-detail-head">
              <div className="cust-detail-profile">
                <div className="cust-detail-avatar" style={{ background: selected.iBg, color: selected.iColor }}>{selected.initial}</div>
                <div>
                  <div className="cust-detail-name">
                    {selected.kanji} {selected.honorific}
                    {selected.badges.map((b) => (
                      <span key={b.label} className="cust-badge" style={{ background: b.bg, color: b.color }}>{b.label}</span>
                    ))}
                  </div>
                  <div className="cust-detail-addr">{selected.addr}</div>
                </div>
              </div>
              <div className="cust-stat-grid">
                <div className="cust-stat"><div className="cust-stat-label">工事件数</div><div className="cust-stat-value" style={{ color: '#1E40AF' }}>{custSites.length}件</div></div>
                <div className="cust-stat"><div className="cust-stat-label">累計受注額</div><div className="cust-stat-value" style={{ color: '#065F46' }}>{selected.stats.totalAmount}</div></div>
                <div className="cust-stat"><div className="cust-stat-label">最終接触</div><div className="cust-stat-value">{lastContact(selected.id)}</div></div>
                <div className="cust-stat"><div className="cust-stat-label">コンタクト</div><div className="cust-stat-value" style={{ color: '#1E40AF' }}>{custContacts.length}回</div></div>
              </div>
            </div>

            {/* タブ */}
            <div className="cust-tab-bar">
              {([['basic', '基本情報'], ['history', '工事履歴'], ['contact', 'コンタクト履歴']] as [DetailTab, string][]).map(([key, label]) => (
                <button key={key} className={`cust-tab${detailTab === key ? ' active' : ''}`} onClick={() => setDetailTab(key)}>{label}</button>
              ))}
            </div>

            {/* 基本情報 */}
            {detailTab === 'basic' && (
              <div className="cust-tab-content">
                <div className="cust-info-table">
                  <div className="cust-info-row"><span className="cust-info-label">電話番号</span><span className="cust-info-value link">{selected.tel}</span></div>
                  <div className="cust-info-row"><span className="cust-info-label">メール</span><span className="cust-info-value link">{selected.email}</span></div>
                  <div className="cust-info-row"><span className="cust-info-label">住所</span><span className="cust-info-value">{selected.zip}　{selected.addr}</span></div>
                  <div className="cust-info-row"><span className="cust-info-label">締め日</span><span className="cust-info-value">{selected.billing}</span></div>
                  <div className="cust-info-row"><span className="cust-info-label">請求出力単位</span><span className="cust-info-value">{selected.billingUnit}</span></div>
                </div>
                {selected.notes.length > 0 && (
                  <div className="cust-notes">
                    <div className="cust-notes-title">注意事項・気づき</div>
                    {selected.notes.map((n, i) => (
                      <div key={i} className="cust-note-item">{n}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 工事履歴 */}
            {detailTab === 'history' && (
              <div className="cust-tab-content">
                {custSites.map((s) => {
                  const staffName = getStaff(s.staffId)?.name ?? '—'
                  return (
                    <div key={s.id} className={`cust-history-card${s.statusClass === 'sekou' ? ' active' : ''}`}>
                      <div className="cust-history-top">
                        <span className="cust-history-name">{s.name}</span>
                        <span className="cust-history-amount">{s.amount > 0 ? `¥${s.amount.toLocaleString()}` : '—'}</span>
                      </div>
                      <div className="cust-history-bottom">
                        <span className="cust-history-status" style={{
                          background: s.statusClass === 'sekou' ? '#DBEAFE' : s.statusClass === 'kanryo' ? '#D1FAE5' : s.statusClass === 'chakkou' ? '#FEF3C7' : s.statusClass === 'seikyu' ? '#FCE7F3' : '#F3F4F6',
                          color: s.statusClass === 'sekou' ? '#1D4ED8' : s.statusClass === 'kanryo' ? '#065F46' : s.statusClass === 'chakkou' ? '#92400E' : s.statusClass === 'seikyu' ? '#9D174D' : '#374151',
                        }}>{s.status}</span>
                        <span>{s.periodStart}〜{s.periodEnd}</span>
                        <span>担当：{staffName}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* コンタクト履歴 */}
            {detailTab === 'contact' && (
              <div className="cust-tab-content">
                <div className="cust-contact-count">{custContacts.length}件</div>
                {custContacts.map((j) => {
                  const staffName = getStaff(j.staffId)?.name ?? '—'
                  const site = sites.find((s) => s.id === j.siteId)
                  return (
                    <div key={j.id} className="cust-contact-card">
                      <div className="cust-contact-top">
                        <div className="cust-contact-tags">
                          <span className="cust-contact-type" style={{
                            background: j.typeClass === 'visit' ? '#D1FAE5' : j.typeClass === 'phone' ? '#DBEAFE' : '#FEF3C7',
                            color: j.typeClass === 'visit' ? '#065F46' : j.typeClass === 'phone' ? '#1E40AF' : '#B45309',
                          }}>{j.type}</span>
                          <span className="cust-contact-project">{site?.name ?? '—'}</span>
                        </div>
                        <span className="cust-contact-date">{j.date}</span>
                      </div>
                      <div className="cust-contact-content">{j.comment}</div>
                      <div className="cust-contact-person">対応：{staffName}　／　日報より自動記録</div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
