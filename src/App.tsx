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
import Payments from './pages/Payments'
import Settlements from './pages/Settlements'
import Orders from './pages/Orders'
import OrderRequests from './pages/OrderRequests'
import Analytics from './pages/Analytics'
import Messages from './pages/Messages'
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
        <Route path="messages/*" element={<Messages />} />

        {/* 現場・受注 */}
        <Route path="sites" element={<Sites />} />
        <Route
          path="sites/reports"
          element={<Placeholder title="完了報告" accent="bg-orange-100" />}
        />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/requests" element={<OrderRequests />} />

        {/* 見積・発注 */}
        <Route path="estimates" element={<Estimates />} />
        <Route path="purchases" element={<Purchases />} />

        {/* 協力会社 */}
        <Route path="partners" element={<Partners />} />

        {/* 経理 */}
        <Route path="billing" element={<Invoices />} />
        <Route path="payments" element={<Payments />} />
        <Route path="settlements" element={<Settlements />} />

        {/* 分析 */}
        <Route path="analytics/*" element={<Analytics />} />

        <Route
          path="*"
          element={<Placeholder title="ページが見つかりません" />}
        />
      </Route>
    </Routes>
  )
}

export default App
