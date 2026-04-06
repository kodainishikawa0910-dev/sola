import { Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Menu from './pages/Menu'
import JournalNew from './pages/JournalNew'
import JournalList from './pages/JournalList'
import ActivityHistory from './pages/ActivityHistory'
import ActivityFrequency from './pages/ActivityFrequency'
import Customers from './pages/Customers'
import Estimates from './pages/Estimates'
import Sites from './pages/Sites'
import Purchases from './pages/Purchases'
import Partners from './pages/Partners'
import Invoices from './pages/Invoices'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <Routes>
      {/* メニュー画面は専用の16:9フルスクリーンレイアウト */}
      <Route index element={<Menu />} />

      <Route element={<RootLayout />}>
        {/* 顧客管理 */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/*" element={<Customers />} />

        {/* 日誌 */}
        <Route path="journal" element={<JournalList />} />
        <Route path="journal/new" element={<JournalNew />} />

        {/* 行動 */}
        <Route path="activity" element={<ActivityHistory />} />
        <Route path="activity/frequency" element={<ActivityFrequency />} />

        {/* メッセージ */}
        <Route
          path="messages"
          element={<Placeholder title="受信BOX" accent="bg-indigo-100" />}
        />
        <Route
          path="messages/sent"
          element={<Placeholder title="送信BOX" accent="bg-indigo-100" />}
        />
        <Route
          path="messages/review"
          element={<Placeholder title="要確認BOX" accent="bg-red-100" />}
        />
        <Route
          path="messages/new"
          element={<Placeholder title="新規メッセージ" accent="bg-indigo-100" />}
        />
        <Route
          path="messages/:id/reply"
          element={<Placeholder title="返信画面" accent="bg-indigo-100" />}
        />

        {/* 現場・受注 */}
        <Route path="sites" element={<Sites />} />
        <Route
          path="sites/reports"
          element={<Placeholder title="完了報告" accent="bg-orange-100" />}
        />
        <Route
          path="orders"
          element={<Placeholder title="受注一覧" accent="bg-amber-100" />}
        />
        <Route
          path="orders/requests"
          element={<Placeholder title="受注申請一覧" accent="bg-amber-100" />}
        />

        {/* 見積・発注 */}
        <Route path="estimates" element={<Estimates />} />
        <Route path="purchases" element={<Purchases />} />

        {/* 協力会社 */}
        <Route path="partners" element={<Partners />} />

        {/* 経理 */}
        <Route path="billing" element={<Invoices />} />
        <Route
          path="payments"
          element={<Placeholder title="支払管理" accent="bg-pink-100" />}
        />
        <Route
          path="settlements"
          element={<Placeholder title="清算管理" accent="bg-fuchsia-100" />}
        />

        {/* 分析 */}
        <Route
          path="analytics"
          element={<Placeholder title="分析・レポート" accent="bg-slate-200" />}
        />

        <Route
          path="*"
          element={<Placeholder title="ページが見つかりません" />}
        />
      </Route>
    </Routes>
  )
}

export default App
