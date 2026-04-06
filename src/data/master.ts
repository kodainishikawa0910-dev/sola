// ====================================================
// sola マスタデータ — 全モジュール横断共通データ
// ====================================================

// ---------- 担当者 ----------
export type Staff = {
  id: string
  name: string
  role: string
}

export const staff: Staff[] = [
  { id: 'nishikawa', name: '西川 公大', role: '代表取締役' },
  { id: 'tanaka', name: '田中 一郎', role: '工事部長' },
  { id: 'suzuki', name: '鈴木 太郎', role: '営業課長' },
]

// ---------- 顧客 ----------
export type CustomerBadge = { label: string; bg: string; color: string }
export type Customer = {
  id: string
  kanji: string
  honorific: string
  kana: string
  initial: string
  iBg: string
  iColor: string
  addr: string
  addrShort: string
  tel: string
  email: string
  zip: string
  billing: string
  billingUnit: string
  badges: CustomerBadge[]
  notes: string[]
  stats: { kojiCount: number; totalAmount: string; lastKoji: string; contactCount: number }
}

export const customers: Customer[] = [
  {
    id: 'cust-tanaka', kanji: '田中 一郎', honorific: '様', kana: 'タナカ イチロウ',
    initial: '田', iBg: '#DBEAFE', iColor: '#1E40AF',
    addr: '大阪府堺市南区〇〇町1-2-3', addrShort: '堺市南区',
    tel: '090-1111-2222', email: 'tanaka@example.com', zip: '〒590-0101',
    billing: '月末締め／入金：翌月末', billingUnit: '工事単位',
    badges: [
      { label: '元請け', bg: '#DBEAFE', color: '#1E40AF' },
      { label: 'リピーター', bg: '#D1FAE5', color: '#065F46' },
      { label: 'VIP', bg: '#FEF3C7', color: '#92400E' },
    ],
    notes: ['平日午前中連絡可。夕方以降はメール推奨。', '丁寧な仕上がりを重視。追加工事の相談も多い。', '紹介で西本邸・山本邸にもつながっている。'],
    stats: { kojiCount: 4, totalAmount: '¥4,200,000', lastKoji: '2026/04', contactCount: 12 },
  },
  {
    id: 'cust-jf', kanji: 'JF株式会社', honorific: '', kana: 'ジェイエフ',
    initial: 'J', iBg: '#EDE9FE', iColor: '#4C1D95',
    addr: '大阪府堺市北区△△2-4-6', addrShort: '堺市北区',
    tel: '072-333-4444', email: 'info@jf-corp.example.com', zip: '〒591-8001',
    billing: '月末締め／入金：翌月末', billingUnit: '月次',
    badges: [{ label: '元請け', bg: '#DBEAFE', color: '#1E40AF' }],
    notes: ['大規模案件が多い。担当は営業部・佐々木氏。', '請求書は本社宛とすること。'],
    stats: { kojiCount: 2, totalAmount: '¥12,500,000', lastKoji: '2026/03', contactCount: 8 },
  },
  {
    id: 'cust-yamamoto', kanji: '山本 三郎', honorific: '様', kana: 'ヤマモト サブロウ',
    initial: '山', iBg: '#D1FAE5', iColor: '#065F46',
    addr: '大阪府堺市西区◎◎5-8-2', addrShort: '堺市西区',
    tel: '090-5555-6666', email: 'yamamoto@example.com', zip: '〒593-8301',
    billing: '月末締め／入金：翌月末', billingUnit: '工事単位',
    badges: [{ label: '元請け', bg: '#DBEAFE', color: '#1E40AF' }],
    notes: ['田中様からの紹介。週末連絡可。'],
    stats: { kojiCount: 1, totalAmount: '¥3,800,000', lastKoji: '2026/04', contactCount: 5 },
  },
  {
    id: 'cust-sato', kanji: '佐藤建設株式会社', honorific: '', kana: 'サトウケンセツ',
    initial: '佐', iBg: '#FEE2E2', iColor: '#991B1B',
    addr: '大阪市天王寺区□□3-7-1', addrShort: '天王寺区',
    tel: '06-7777-8888', email: 'sato-kensetsu@example.com', zip: '〒543-0001',
    billing: '20日締め／入金：翌月末', billingUnit: '月次',
    badges: [{ label: '下請け', bg: '#F3E8FF', color: '#6B21A8' }, { label: 'リピーター', bg: '#D1FAE5', color: '#065F46' }],
    notes: ['法人与信済み。担当窓口：総務部 加藤氏。'],
    stats: { kojiCount: 2, totalAmount: '¥8,700,000', lastKoji: '2026/03', contactCount: 6 },
  },
  {
    id: 'cust-takahashi', kanji: '高橋 美咲', honorific: '様', kana: 'タカハシ ミサキ',
    initial: '高', iBg: '#FCE7F3', iColor: '#9D174D',
    addr: '大阪府堺市中区△△6-1-9', addrShort: '堺市中区',
    tel: '090-9999-0000', email: 'takahashi@example.com', zip: '〒599-8236',
    billing: '月末締め／入金：翌月末', billingUnit: '工事単位',
    badges: [{ label: '元請け', bg: '#DBEAFE', color: '#1E40AF' }],
    notes: ['ショールーム見学がきっかけ。デザイン重視。'],
    stats: { kojiCount: 1, totalAmount: '¥1,400,000', lastKoji: '2026/02', contactCount: 4 },
  },
  {
    id: 'cust-housone', kanji: '株式会社ハウスワン', honorific: '', kana: 'ハウスワン',
    initial: 'ハ', iBg: '#CCFBF1', iColor: '#134E4A',
    addr: '大阪市住吉区◇◇1-3-5', addrShort: '住吉区',
    tel: '06-1234-5678', email: 'info@houseone.example.com', zip: '〒558-0041',
    billing: '月末締め／入金：翌々月10日', billingUnit: '工事単位',
    badges: [{ label: '元請け', bg: '#DBEAFE', color: '#1E40AF' }, { label: 'VIP', bg: '#FEF3C7', color: '#92400E' }],
    notes: ['モデルハウス案件は広報との調整が必要。', '年間保守契約あり。'],
    stats: { kojiCount: 3, totalAmount: '¥9,200,000', lastKoji: '2026/04', contactCount: 15 },
  },
]

// ---------- 協力会社 ----------
export type Partner = {
  id: string
  name: string
  category: string
  contact: string
  tel: string
  addr: string
  status: string
  statusColor: string
}

export const partners: Partner[] = [
  { id: 'part-naiso', name: '〇〇内装工業', category: '内装', contact: '中村 健一', tel: '072-111-2222', addr: '堺市北区', status: '取引中', statusColor: '#059669' },
  { id: 'part-kaitai', name: '△△解体', category: '解体', contact: '吉田 修', tel: '072-222-3333', addr: '堺市堺区', status: '取引中', statusColor: '#059669' },
  { id: 'part-denki', name: '□□電気設備', category: '電気', contact: '松田 光', tel: '072-333-4444', addr: '堺市南区', status: '取引中', statusColor: '#059669' },
  { id: 'part-kenzai', name: '◇◇建材', category: '材料', contact: '渡辺 勇', tel: '072-444-5555', addr: '堺市西区', status: '取引中', statusColor: '#059669' },
  { id: 'part-tosou', name: '◎◎塗装', category: '塗装', contact: '藤原 誠', tel: '072-555-6666', addr: '大阪市住之江区', status: '取引中', statusColor: '#059669' },
  { id: 'part-setsubi', name: '★★設備工業', category: '設備', contact: '井上 拓也', tel: '072-666-7777', addr: '堺市中区', status: '取引中', statusColor: '#059669' },
  { id: 'part-bohan', name: '●●防水工業', category: '防水', contact: '木村 大輔', tel: '072-777-8888', addr: '大阪市東住吉区', status: '休止中', statusColor: '#9CA3AF' },
]

// ---------- 現場（工事）----------
export type Site = {
  id: string
  name: string
  customerId: string
  staffId: string
  status: string
  statusClass: string
  periodStart: string
  periodEnd: string
  amount: number
  address: string
  type: string
  structure: string
  billingType: string
}

export const sites: Site[] = [
  { id: 'site-001', name: '田中邸 内装改修工事', customerId: 'cust-tanaka', staffId: 'tanaka', status: '施工中', statusClass: 'sekou', periodStart: '2026/03/01', periodEnd: '2026/04/15', amount: 1850000, address: '堺市南区〇〇町1-2-3', type: '改修工事', structure: '木造', billingType: '完工一括' },
  { id: 'site-002', name: '田中邸 外壁塗装工事', customerId: 'cust-tanaka', staffId: 'suzuki', status: '完了', statusClass: 'kanryo', periodStart: '2025/06/01', periodEnd: '2025/07/20', amount: 1650000, address: '堺市南区〇〇町1-2-3', type: '塗装工事', structure: '木造', billingType: '完工一括' },
  { id: 'site-003', name: 'JF新築工事 A棟', customerId: 'cust-jf', staffId: 'tanaka', status: '施工中', statusClass: 'sekou', periodStart: '2025/10/01', periodEnd: '2026/05/30', amount: 8200000, address: '堺市北区△△2-4-6', type: '新築工事', structure: 'RC造', billingType: '月次出来高' },
  { id: 'site-004', name: '山本邸 新築工事', customerId: 'cust-yamamoto', staffId: 'nishikawa', status: '施工中', statusClass: 'sekou', periodStart: '2026/02/01', periodEnd: '2026/06/30', amount: 3800000, address: '堺市西区◎◎5-8-2', type: '新築工事', structure: '木造', billingType: '完工一括' },
  { id: 'site-005', name: '高橋邸 水回りリフォーム', customerId: 'cust-takahashi', staffId: 'suzuki', status: '完了', statusClass: 'kanryo', periodStart: '2026/01/10', periodEnd: '2026/02/14', amount: 1400000, address: '堺市中区△△6-1-9', type: '改修工事', structure: '木造', billingType: '完工一括' },
  { id: 'site-006', name: '住吉モデルハウス外構工事', customerId: 'cust-housone', staffId: 'nishikawa', status: '着工前', statusClass: 'chakkou', periodStart: '2026/04/15', periodEnd: '2026/05/20', amount: 2400000, address: '大阪市住吉区◇◇1-3-5', type: '外構工事', structure: '—', billingType: '完工一括' },
  { id: 'site-007', name: '鈴木邸リフォーム', customerId: 'cust-sato', staffId: 'tanaka', status: '請求待ち', statusClass: 'seikyu', periodStart: '2026/01/20', periodEnd: '2026/03/10', amount: 2100000, address: '堺市堺区◯◯4-2-8', type: '改修工事', structure: '木造', billingType: '完工一括' },
  { id: 'site-008', name: '天王寺マンション改修工事', customerId: 'cust-sato', staffId: 'suzuki', status: '施工中', statusClass: 'sekou', periodStart: '2026/03/01', periodEnd: '2026/06/30', amount: 6600000, address: '大阪市天王寺区□□3-7-1', type: '改修工事', structure: 'RC造', billingType: '月次出来高' },
  { id: 'site-009', name: 'JF新築工事 B棟', customerId: 'cust-jf', staffId: 'tanaka', status: '着工前', statusClass: 'chakkou', periodStart: '2026/06/01', periodEnd: '2026/11/30', amount: 4300000, address: '堺市北区△△2-4-6', type: '新築工事', structure: 'RC造', billingType: '月次出来高' },
  { id: 'site-010', name: '田中邸 外構リフォーム', customerId: 'cust-tanaka', staffId: 'nishikawa', status: '見積中', statusClass: 'chudan', periodStart: '2026/04/20', periodEnd: '2026/05/15', amount: 0, address: '堺市南区〇〇町1-2-3', type: '外構工事', structure: '—', billingType: '完工一括' },
]

// ---------- 見積 ----------
export type Estimate = {
  id: string
  siteId: string
  customerId: string
  staffId: string
  title: string
  amount: number
  status: string
  statusBg: string
  statusColor: string
  createdDate: string
  validUntil: string
}

export const estimates: Estimate[] = [
  { id: 'est-001', siteId: 'site-001', customerId: 'cust-tanaka', staffId: 'tanaka', title: '田中邸 内装改修工事', amount: 1850000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2026/02/10', validUntil: '2026/03/10' },
  { id: 'est-002', siteId: 'site-002', customerId: 'cust-tanaka', staffId: 'suzuki', title: '田中邸 外壁塗装工事', amount: 1650000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2025/05/01', validUntil: '2025/06/01' },
  { id: 'est-003', siteId: 'site-003', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF新築工事 A棟', amount: 8200000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2025/08/15', validUntil: '2025/09/15' },
  { id: 'est-004', siteId: 'site-004', customerId: 'cust-yamamoto', staffId: 'nishikawa', title: '山本邸 新築工事', amount: 3800000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2026/01/05', validUntil: '2026/02/05' },
  { id: 'est-005', siteId: 'site-005', customerId: 'cust-takahashi', staffId: 'suzuki', title: '高橋邸 水回りリフォーム', amount: 1400000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2025/12/10', validUntil: '2026/01/10' },
  { id: 'est-006', siteId: 'site-006', customerId: 'cust-housone', staffId: 'nishikawa', title: '住吉モデルハウス外構工事', amount: 2400000, status: '提出中', statusBg: '#FEF3C7', statusColor: '#92400E', createdDate: '2026/03/20', validUntil: '2026/04/20' },
  { id: 'est-007', siteId: 'site-007', customerId: 'cust-sato', staffId: 'tanaka', title: '鈴木邸リフォーム', amount: 2100000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2025/12/20', validUntil: '2026/01/20' },
  { id: 'est-008', siteId: 'site-008', customerId: 'cust-sato', staffId: 'suzuki', title: '天王寺マンション改修工事', amount: 6600000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2026/02/01', validUntil: '2026/03/01' },
  { id: 'est-009', siteId: 'site-009', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF新築工事 B棟', amount: 4300000, status: '受注済', statusBg: '#D1FAE5', statusColor: '#065F46', createdDate: '2026/03/01', validUntil: '2026/04/01' },
  { id: 'est-010', siteId: 'site-010', customerId: 'cust-tanaka', staffId: 'nishikawa', title: '田中邸 外構リフォーム', amount: 980000, status: '作成中', statusBg: '#F3F4F6', statusColor: '#374151', createdDate: '2026/04/05', validUntil: '—' },
]

// ---------- 受注 ----------
export type Order = {
  id: string
  siteId: string
  estimateId: string
  customerId: string
  staffId: string
  title: string
  amount: number
  orderDate: string
  status: string
  statusBg: string
  statusColor: string
}

export const orders: Order[] = [
  { id: 'ord-001', siteId: 'site-001', estimateId: 'est-001', customerId: 'cust-tanaka', staffId: 'tanaka', title: '田中邸 内装改修工事', amount: 1850000, orderDate: '2026/02/15', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'ord-002', siteId: 'site-002', estimateId: 'est-002', customerId: 'cust-tanaka', staffId: 'suzuki', title: '田中邸 外壁塗装工事', amount: 1650000, orderDate: '2025/05/20', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46' },
  { id: 'ord-003', siteId: 'site-003', estimateId: 'est-003', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF新築工事 A棟', amount: 8200000, orderDate: '2025/09/10', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'ord-004', siteId: 'site-004', estimateId: 'est-004', customerId: 'cust-yamamoto', staffId: 'nishikawa', title: '山本邸 新築工事', amount: 3800000, orderDate: '2026/01/20', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'ord-005', siteId: 'site-005', estimateId: 'est-005', customerId: 'cust-takahashi', staffId: 'suzuki', title: '高橋邸 水回りリフォーム', amount: 1400000, orderDate: '2025/12/25', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46' },
  { id: 'ord-006', siteId: 'site-006', estimateId: 'est-006', customerId: 'cust-housone', staffId: 'nishikawa', title: '住吉モデルハウス外構工事', amount: 2400000, orderDate: '2026/04/01', status: '着工前', statusBg: '#FEF3C7', statusColor: '#92400E' },
  { id: 'ord-007', siteId: 'site-007', estimateId: 'est-007', customerId: 'cust-sato', staffId: 'tanaka', title: '鈴木邸リフォーム', amount: 2100000, orderDate: '2026/01/10', status: '請求待ち', statusBg: '#FCE7F3', statusColor: '#9D174D' },
  { id: 'ord-008', siteId: 'site-008', estimateId: 'est-008', customerId: 'cust-sato', staffId: 'suzuki', title: '天王寺マンション改修工事', amount: 6600000, orderDate: '2026/02/10', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'ord-009', siteId: 'site-009', estimateId: 'est-009', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF新築工事 B棟', amount: 4300000, orderDate: '2026/03/15', status: '着工前', statusBg: '#FEF3C7', statusColor: '#92400E' },
]

// ---------- 発注 ----------
export type PurchaseOrder = {
  id: string
  siteId: string
  partnerId: string
  staffId: string
  title: string
  amount: number
  orderDate: string
  status: string
  statusBg: string
  statusColor: string
  category: string
}

export const purchaseOrders: PurchaseOrder[] = [
  // 田中邸 内装改修
  { id: 'po-001', siteId: 'site-001', partnerId: 'part-kaitai', staffId: 'tanaka', title: '田中邸 解体・養生', amount: 280000, orderDate: '2026/02/20', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46', category: '解体' },
  { id: 'po-002', siteId: 'site-001', partnerId: 'part-naiso', staffId: 'tanaka', title: '田中邸 内装下地・クロス', amount: 650000, orderDate: '2026/02/25', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '内装' },
  { id: 'po-003', siteId: 'site-001', partnerId: 'part-denki', staffId: 'tanaka', title: '田中邸 電気工事', amount: 180000, orderDate: '2026/03/01', status: '未着手', statusBg: '#F3F4F6', statusColor: '#374151', category: '電気' },
  { id: 'po-004', siteId: 'site-001', partnerId: 'part-kenzai', staffId: 'tanaka', title: '田中邸 材料調達', amount: 420000, orderDate: '2026/02/18', status: '納品済', statusBg: '#D1FAE5', statusColor: '#065F46', category: '材料' },
  // JF A棟
  { id: 'po-005', siteId: 'site-003', partnerId: 'part-naiso', staffId: 'tanaka', title: 'JF A棟 内装一式', amount: 2800000, orderDate: '2025/10/10', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '内装' },
  { id: 'po-006', siteId: 'site-003', partnerId: 'part-denki', staffId: 'tanaka', title: 'JF A棟 電気設備', amount: 1200000, orderDate: '2025/10/15', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '電気' },
  { id: 'po-007', siteId: 'site-003', partnerId: 'part-setsubi', staffId: 'tanaka', title: 'JF A棟 給排水設備', amount: 950000, orderDate: '2025/11/01', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '設備' },
  // 山本邸
  { id: 'po-008', siteId: 'site-004', partnerId: 'part-kenzai', staffId: 'nishikawa', title: '山本邸 木材・建材', amount: 1200000, orderDate: '2026/01/25', status: '納品済', statusBg: '#D1FAE5', statusColor: '#065F46', category: '材料' },
  { id: 'po-009', siteId: 'site-004', partnerId: 'part-denki', staffId: 'nishikawa', title: '山本邸 電気工事', amount: 350000, orderDate: '2026/02/10', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '電気' },
  { id: 'po-010', siteId: 'site-004', partnerId: 'part-setsubi', staffId: 'nishikawa', title: '山本邸 給排水工事', amount: 480000, orderDate: '2026/02/15', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '設備' },
  // 天王寺マンション
  { id: 'po-011', siteId: 'site-008', partnerId: 'part-tosou', staffId: 'suzuki', title: '天王寺 外壁塗装', amount: 1800000, orderDate: '2026/03/05', status: '施工中', statusBg: '#DBEAFE', statusColor: '#1D4ED8', category: '塗装' },
  { id: 'po-012', siteId: 'site-008', partnerId: 'part-bohan', staffId: 'suzuki', title: '天王寺 防水工事', amount: 1100000, orderDate: '2026/03/10', status: '未着手', statusBg: '#F3F4F6', statusColor: '#374151', category: '防水' },
  // 高橋邸
  { id: 'po-013', siteId: 'site-005', partnerId: 'part-setsubi', staffId: 'suzuki', title: '高橋邸 水回り設備', amount: 520000, orderDate: '2026/01/05', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46', category: '設備' },
  { id: 'po-014', siteId: 'site-005', partnerId: 'part-naiso', staffId: 'suzuki', title: '高橋邸 内装仕上げ', amount: 380000, orderDate: '2026/01/15', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46', category: '内装' },
  // 鈴木邸
  { id: 'po-015', siteId: 'site-007', partnerId: 'part-naiso', staffId: 'tanaka', title: '鈴木邸 内装リフォーム', amount: 750000, orderDate: '2026/01/15', status: '完了', statusBg: '#D1FAE5', statusColor: '#065F46', category: '内装' },
  { id: 'po-016', siteId: 'site-007', partnerId: 'part-kenzai', staffId: 'tanaka', title: '鈴木邸 材料', amount: 320000, orderDate: '2026/01/18', status: '納品済', statusBg: '#D1FAE5', statusColor: '#065F46', category: '材料' },
]

// ---------- 売上請求 ----------
export type Invoice = {
  id: string
  siteId: string
  customerId: string
  staffId: string
  title: string
  amount: number
  tax: number
  total: number
  issueDate: string
  dueDate: string
  status: string
  statusBg: string
  statusColor: string
  paidDate?: string
}

export const invoices: Invoice[] = [
  { id: 'inv-001', siteId: 'site-002', customerId: 'cust-tanaka', staffId: 'suzuki', title: '田中邸 外壁塗装工事', amount: 1650000, tax: 165000, total: 1815000, issueDate: '2025/07/25', dueDate: '2025/08/31', status: '入金済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2025/08/28' },
  { id: 'inv-002', siteId: 'site-005', customerId: 'cust-takahashi', staffId: 'suzuki', title: '高橋邸 水回りリフォーム', amount: 1400000, tax: 140000, total: 1540000, issueDate: '2026/02/20', dueDate: '2026/03/31', status: '入金済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2026/03/25' },
  { id: 'inv-003', siteId: 'site-007', customerId: 'cust-sato', staffId: 'tanaka', title: '鈴木邸リフォーム', amount: 2100000, tax: 210000, total: 2310000, issueDate: '2026/03/15', dueDate: '2026/04/30', status: '発行済', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'inv-004', siteId: 'site-003', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF A棟 3月分出来高', amount: 1500000, tax: 150000, total: 1650000, issueDate: '2026/04/01', dueDate: '2026/04/30', status: '発行済', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'inv-005', siteId: 'site-008', customerId: 'cust-sato', staffId: 'suzuki', title: '天王寺マンション 3月分出来高', amount: 1200000, tax: 120000, total: 1320000, issueDate: '2026/04/01', dueDate: '2026/04/20', status: '発行済', statusBg: '#DBEAFE', statusColor: '#1D4ED8' },
  { id: 'inv-006', siteId: 'site-003', customerId: 'cust-jf', staffId: 'tanaka', title: 'JF A棟 2月分出来高', amount: 1500000, tax: 150000, total: 1650000, issueDate: '2026/03/01', dueDate: '2026/03/31', status: '入金済', statusBg: '#D1FAE5', statusColor: '#065F46', paidDate: '2026/03/28' },
]

// ---------- 日誌 ----------
export type JournalEntry = {
  id: number
  date: string
  staffId: string
  customerId: string
  siteId: string
  type: string
  typeClass: string
  action: string
  result: string
  comment: string
  rank: string
}

export const journalEntries: JournalEntry[] = [
  // === 西川 (nishikawa) ===
  // 4/6
  { id: 101, date: '2026-04-06', staffId: 'nishikawa', customerId: 'cust-yamamoto', siteId: 'site-004', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '上棟完了。施主立会いで進捗説明。外壁色の最終決定。', rank: 'A' },
  { id: 102, date: '2026-04-06', staffId: 'nishikawa', customerId: 'cust-housone', siteId: 'site-006', type: '電話', typeClass: 'phone', action: '契約手続き', result: 'normal', comment: '外構工事の契約書送付確認。来週署名予定。', rank: 'B' },
  { id: 103, date: '2026-04-06', staffId: 'nishikawa', customerId: 'cust-tanaka', siteId: 'site-010', type: 'メール', typeClass: 'mail', action: '見積提出', result: 'none', comment: '外構リフォームの概算見積をメール送付。返信待ち。', rank: 'C' },
  // 4/7
  { id: 104, date: '2026-04-07', staffId: 'nishikawa', customerId: 'cust-yamamoto', siteId: 'site-004', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '屋根工事着手確認。工程通り順調。', rank: 'A' },
  { id: 105, date: '2026-04-07', staffId: 'nishikawa', customerId: 'cust-housone', siteId: 'site-006', type: 'メール', typeClass: 'mail', action: '定期フォロー', result: 'normal', comment: '外構デザイン案2パターン送付。', rank: 'B' },
  // 4/8
  { id: 106, date: '2026-04-08', staffId: 'nishikawa', customerId: 'cust-tanaka', siteId: 'site-010', type: '電話', typeClass: 'phone', action: '見積提出', result: 'good', comment: '外構見積に前向きとの返答。正式見積作成へ。', rank: 'A' },
  // 4/9
  { id: 107, date: '2026-04-09', staffId: 'nishikawa', customerId: 'cust-housone', siteId: 'site-006', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: 'デザインA案で決定。着工日確定。', rank: 'A' },
  // 4/10
  { id: 108, date: '2026-04-10', staffId: 'nishikawa', customerId: 'cust-yamamoto', siteId: 'site-004', type: '電話', typeClass: 'phone', action: '進捗確認・打合せ', result: 'normal', comment: '外壁サイディング施工状況を報告。', rank: 'A' },
  { id: 109, date: '2026-04-10', staffId: 'nishikawa', customerId: 'cust-tanaka', siteId: 'site-010', type: 'メール', typeClass: 'mail', action: '見積提出', result: 'none', comment: '正式見積書（98万円）をPDF送付。', rank: 'B' },

  // === 田中 (tanaka) ===
  // 4/6
  { id: 201, date: '2026-04-06', staffId: 'tanaka', customerId: 'cust-tanaka', siteId: 'site-001', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '2Fクロス施工確認。追加工事（洗面所タイル）の相談あり。', rank: 'A' },
  { id: 202, date: '2026-04-06', staffId: 'tanaka', customerId: 'cust-jf', siteId: 'site-003', type: '電話', typeClass: 'phone', action: '進捗確認・打合せ', result: 'normal', comment: 'A棟4F配管工事の進捗報告。1日遅延。', rank: 'B' },
  { id: 203, date: '2026-04-06', staffId: 'tanaka', customerId: 'cust-sato', siteId: 'site-007', type: 'メール', typeClass: 'mail', action: '定期フォロー', result: 'none', comment: '鈴木邸完了検査日の調整メール送付。', rank: 'C' },
  // 4/7
  { id: 204, date: '2026-04-07', staffId: 'tanaka', customerId: 'cust-jf', siteId: 'site-003', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: 'A棟現場巡回。品質チェック実施。問題なし。', rank: 'A' },
  { id: 205, date: '2026-04-07', staffId: 'tanaka', customerId: 'cust-jf', siteId: 'site-009', type: 'メール', typeClass: 'mail', action: '新規挨拶', result: 'normal', comment: 'B棟着工に向けた工程案を送付。', rank: 'B' },
  // 4/8
  { id: 206, date: '2026-04-08', staffId: 'tanaka', customerId: 'cust-tanaka', siteId: 'site-001', type: '訪問', typeClass: 'visit', action: '見積提出', result: 'good', comment: '洗面所タイル張替の見積提出。前向き回答。', rank: 'A' },
  { id: 207, date: '2026-04-08', staffId: 'tanaka', customerId: 'cust-sato', siteId: 'site-007', type: '電話', typeClass: 'phone', action: '契約手続き', result: 'good', comment: '完了検査日4/12に確定。請求書発行準備。', rank: 'A' },
  // 4/9
  { id: 208, date: '2026-04-09', staffId: 'tanaka', customerId: 'cust-jf', siteId: 'site-003', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'normal', comment: '5F鉄骨据付け立会い。設計変更の協議。', rank: 'A' },
  // 4/10
  { id: 209, date: '2026-04-10', staffId: 'tanaka', customerId: 'cust-tanaka', siteId: 'site-001', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: 'クロス張り最終仕上げ確認。来週完了見込み。', rank: 'A' },
  { id: 210, date: '2026-04-10', staffId: 'tanaka', customerId: 'cust-jf', siteId: 'site-003', type: '電話', typeClass: 'phone', action: '進捗確認・打合せ', result: 'bad', comment: 'A棟配管遅延3日に拡大。対策協議中。', rank: 'A' },

  // === 鈴木 (suzuki) ===
  // 4/6
  { id: 301, date: '2026-04-06', staffId: 'suzuki', customerId: 'cust-sato', siteId: 'site-008', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '天王寺マンション外壁塗装1面完了。品質良好。', rank: 'A' },
  { id: 302, date: '2026-04-06', staffId: 'suzuki', customerId: 'cust-takahashi', siteId: 'site-005', type: '電話', typeClass: 'phone', action: '定期フォロー', result: 'good', comment: '水回り使用状況確認。不具合なし。次回リフォーム相談あり。', rank: 'B' },
  // 4/7
  { id: 303, date: '2026-04-07', staffId: 'suzuki', customerId: 'cust-sato', siteId: 'site-008', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'normal', comment: '2面目着手確認。天候による遅延リスクを共有。', rank: 'A' },
  // 4/8
  { id: 304, date: '2026-04-08', staffId: 'suzuki', customerId: 'cust-sato', siteId: 'site-008', type: '電話', typeClass: 'phone', action: '進捗確認・打合せ', result: 'normal', comment: '防水工事業者（●●防水）との日程調整。', rank: 'B' },
  { id: 305, date: '2026-04-08', staffId: 'suzuki', customerId: 'cust-tanaka', siteId: 'site-002', type: 'メール', typeClass: 'mail', action: '定期フォロー', result: 'good', comment: '外壁塗装後の経過確認メール。異常なしとの返答。', rank: 'C' },
  // 4/9
  { id: 306, date: '2026-04-09', staffId: 'suzuki', customerId: 'cust-sato', siteId: 'site-008', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '2面目塗装70%完了。予定通り。', rank: 'A' },
  { id: 307, date: '2026-04-09', staffId: 'suzuki', customerId: 'cust-takahashi', siteId: 'site-005', type: 'メール', typeClass: 'mail', action: '見積提出', result: 'none', comment: '追加リフォーム（洗面化粧台）の概算見積送付。', rank: 'B' },
  // 4/10
  { id: 308, date: '2026-04-10', staffId: 'suzuki', customerId: 'cust-sato', siteId: 'site-008', type: '訪問', typeClass: 'visit', action: '進捗確認・打合せ', result: 'good', comment: '2面目塗装完了。3面目着手。', rank: 'A' },
  { id: 309, date: '2026-04-10', staffId: 'suzuki', customerId: 'cust-jf', siteId: 'site-003', type: '電話', typeClass: 'phone', action: '新規挨拶', result: 'normal', comment: 'JF側の佐々木氏と関係構築。B棟営業向け。', rank: 'B' },
]

// ---------- ヘルパー ----------
export function getCustomer(id: string) { return customers.find((c) => c.id === id) }
export function getStaff(id: string) { return staff.find((s) => s.id === id) }
export function getPartner(id: string) { return partners.find((p) => p.id === id) }
export function getSite(id: string) { return sites.find((s) => s.id === id) }
export function getSitesForCustomer(custId: string) { return sites.filter((s) => s.customerId === custId) }
export function getSitesForStaff(staffId: string) { return sites.filter((s) => s.staffId === staffId) }
export function getEstimatesForSite(siteId: string) { return estimates.filter((e) => e.siteId === siteId) }
export function getOrdersForCustomer(custId: string) { return orders.filter((o) => o.customerId === custId) }
export function getPurchaseOrdersForSite(siteId: string) { return purchaseOrders.filter((p) => p.siteId === siteId) }
export function getPurchaseOrdersForPartner(partnerId: string) { return purchaseOrders.filter((p) => p.partnerId === partnerId) }
export function getInvoicesForCustomer(custId: string) { return invoices.filter((i) => i.customerId === custId) }
export function getJournalForStaff(staffId: string, date?: string) {
  return journalEntries.filter((j) => j.staffId === staffId && (!date || j.date === date))
}
export function getJournalForDate(date: string) { return journalEntries.filter((j) => j.date === date) }

export function formatYen(n: number) {
  return '¥' + n.toLocaleString('ja-JP')
}
