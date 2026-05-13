import { Navigate, Route, Routes } from 'react-router-dom'

import { HqAdminLayout } from './layouts/HqAdminLayout'
import { CustomerLayout } from './layouts/CustomerLayout'
import { StoreAdminLayout } from './layouts/StoreAdminLayout'
import { CartPage } from './pages/customer/CartPage'
import { CheckoutPage } from './pages/customer/CheckoutPage'
import { CustomerHomePage } from './pages/customer/CustomerHomePage'
import { MenuListPage } from './pages/customer/MenuListPage'
import { OrderStatusPage } from './pages/customer/OrderStatusPage'
import { PaymentHoldPage } from './pages/customer/PaymentHoldPage'
import { SearchPage } from './pages/customer/SearchPage'
import { StoreDetailPage } from './pages/customer/StoreDetailPage'
import {
  HqCampaignsPage,
  HqDashboardPage,
  HqDisputesPage,
  HqFeesPage,
  HqMembersPage,
  HqMenusPage,
  HqNotificationsPage,
  HqOrdersPage,
  HqPaymentsPage,
  HqRbacPage,
  HqReportsPage,
  HqSettlementPage,
  HqStatsPage,
  HqStoresPage,
} from './pages/hq/hqScreens'
import { RiderHomePage } from './pages/rider/RiderHomePage'
import { StoreAdminHomePage } from './pages/store-admin/StoreAdminHomePage'
import { StoreMenuManagePage } from './pages/store-admin/StoreMenuManagePage'
import { StoreOrdersPage } from './pages/store-admin/StoreOrdersPage'
import { StoreSettlementPage } from './pages/store-admin/StoreSettlementPage'

export default function App() {
  return (
    <div className="h-full min-h-0 bg-[var(--color-tr-bg)] text-[var(--color-tr-text)]">
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="stores/:storeId" element={<StoreDetailPage />} />
          <Route path="stores/:storeId/menu" element={<MenuListPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pay/:draftId" element={<PaymentHoldPage />} />
          <Route path="orders/:orderId" element={<OrderStatusPage />} />
        </Route>

        <Route path="/admin/store" element={<StoreAdminLayout />}>
          <Route index element={<StoreAdminHomePage />} />
          <Route path="menus" element={<StoreMenuManagePage />} />
          <Route path="orders" element={<StoreOrdersPage />} />
          <Route path="settlement" element={<StoreSettlementPage />} />
        </Route>

        <Route path="/admin/hq" element={<HqAdminLayout />}>
          <Route index element={<HqDashboardPage />} />
          <Route path="members" element={<HqMembersPage />} />
          <Route path="stores" element={<HqStoresPage />} />
          <Route path="menus" element={<HqMenusPage />} />
          <Route path="orders" element={<HqOrdersPage />} />
          <Route path="payments" element={<HqPaymentsPage />} />
          <Route path="settlement" element={<HqSettlementPage />} />
          <Route path="fees" element={<HqFeesPage />} />
          <Route path="disputes" element={<HqDisputesPage />} />
          <Route path="reports" element={<HqReportsPage />} />
          <Route path="campaigns" element={<HqCampaignsPage />} />
          <Route path="notifications" element={<HqNotificationsPage />} />
          <Route path="stats" element={<HqStatsPage />} />
          <Route path="rbac" element={<HqRbacPage />} />
        </Route>

        <Route path="/rider" element={<RiderHomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
