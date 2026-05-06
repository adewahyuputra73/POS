import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "./app/providers";

// Layouts
import AuthLayout from "./app/(auth)/layout";
import DashboardLayout from "./app/(dashboard)/layout";
import CustomerLayout from "./app/(customer)/layout";
import ReportsLayout from "./app/(dashboard)/reports/layout";

// Auth pages
import LoginPage from "./app/(auth)/login/page";
import RegisterPage from "./app/(auth)/register/page";
import ForgotPasswordPage from "./app/(auth)/forgot-password/page";

// Dashboard pages
import DashboardPage from "./app/(dashboard)/dashboard/page";
import BrandsPage from "./app/(dashboard)/brands/page";
import CategoriesPage from "./app/(dashboard)/categories/page";
import CustomersPage from "./app/(dashboard)/customers/page";
import CustomerReviewsPage from "./app/(dashboard)/customers/reviews/page";
import CustomerReviewsSettingsPage from "./app/(dashboard)/customers/reviews/settings/page";
import CustomerVouchersPage from "./app/(dashboard)/customers/vouchers/page";
import InventoryRawMaterialsPage from "./app/(dashboard)/inventory/raw-materials/page";
import InventoryRawMaterialDetailPage from "./app/(dashboard)/inventory/raw-materials/[id]/page";
import OutletsPage from "./app/(dashboard)/outlets/page";
import PaymentsPage from "./app/(dashboard)/payments/page";
import PengeluaranPage from "./app/(dashboard)/pengeluaran/page";
import PreordersPage from "./app/(dashboard)/preorders/page";
import ProductsPage from "./app/(dashboard)/products/page";
import ProductVariantsPage from "./app/(dashboard)/products/variants/page";
import ProfilePage from "./app/(dashboard)/profile/page";
import RolesPage from "./app/(dashboard)/roles/page";
import SettingsPage from "./app/(dashboard)/settings/page";
import ShiftPage from "./app/(dashboard)/shift/page";
import StaffPage from "./app/(dashboard)/staff/page";
import StorePage from "./app/(dashboard)/store/page";
import TableManagementAreaPage from "./app/(dashboard)/table-management/area/page";
import TableManagementLayoutPage from "./app/(dashboard)/table-management/layout/page";
import TableManagementTablesPage from "./app/(dashboard)/table-management/tables/page";
import TransactionsPage from "./app/(dashboard)/transactions/page";
import WalletPage from "./app/(dashboard)/wallet/page";

// Reports pages
import ReportsSalesSummaryPage from "./app/(dashboard)/reports/sales-summary/page";
import ReportsProductSalesPage from "./app/(dashboard)/reports/product-sales/page";
import ReportsCategorySalesPage from "./app/(dashboard)/reports/category-sales/page";
import ReportsStockFlowPage from "./app/(dashboard)/reports/stock-flow/page";
import ReportsGrossProfitPage from "./app/(dashboard)/reports/gross-profit/page";
import ReportsVoidReportPage from "./app/(dashboard)/reports/void-report/page";
import ReportsSendReportPage from "./app/(dashboard)/reports/send-report/page";
import ReportsDownloadReportPage from "./app/(dashboard)/reports/download-report/page";
import ReportsOrderHistoryPage from "./app/(dashboard)/reports/order-history/page";
import ReportsShiftsPage from "./app/(dashboard)/reports/shifts/page";

// Customer pages
import CustomerOrderPage from "./app/(customer)/order/page";
import CustomerCartPage from "./app/(customer)/order/cart/page";
import CustomerCheckoutPage from "./app/(customer)/order/checkout/page";
import CustomerConfirmationPage from "./app/(customer)/order/confirmation/page";
import CustomerReviewPage from "./app/(customer)/order/review/page";
import CustomerOrderStatusPage from "./app/(customer)/order/status/[orderId]/page";
import CustomerOrderTrackingPage from "./app/(customer)/order/tracking/[orderId]/page";
import InvoicePage from "./app/(customer)/invoice/[id]/page";

// 404
import NotFound from "./app/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/reviews" element={<CustomerReviewsPage />} />
            <Route path="/customers/reviews/settings" element={<CustomerReviewsSettingsPage />} />
            <Route path="/customers/vouchers" element={<CustomerVouchersPage />} />
            <Route path="/inventory/raw-materials" element={<InventoryRawMaterialsPage />} />
            <Route path="/inventory/raw-materials/:id" element={<InventoryRawMaterialDetailPage />} />
            <Route path="/outlets" element={<OutletsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/pengeluaran" element={<PengeluaranPage />} />
            <Route path="/preorders" element={<PreordersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/variants" element={<ProductVariantsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/shift" element={<ShiftPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/table-management/area" element={<TableManagementAreaPage />} />
            <Route path="/table-management/layout" element={<TableManagementLayoutPage />} />
            <Route path="/table-management/tables" element={<TableManagementTablesPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/wallet" element={<WalletPage />} />

            {/* Reports sub-routes with their own layout */}
            <Route path="/reports" element={<ReportsLayout />}>
              <Route index element={<Navigate to="/reports/sales-summary" replace />} />
              <Route path="sales-summary" element={<ReportsSalesSummaryPage />} />
              <Route path="product-sales" element={<ReportsProductSalesPage />} />
              <Route path="category-sales" element={<ReportsCategorySalesPage />} />
              <Route path="stock-flow" element={<ReportsStockFlowPage />} />
              <Route path="gross-profit" element={<ReportsGrossProfitPage />} />
              <Route path="void-report" element={<ReportsVoidReportPage />} />
              <Route path="send-report" element={<ReportsSendReportPage />} />
              <Route path="download-report" element={<ReportsDownloadReportPage />} />
              <Route path="order-history" element={<ReportsOrderHistoryPage />} />
              <Route path="shifts" element={<ReportsShiftsPage />} />
            </Route>
          </Route>

          {/* Customer-facing routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/order" element={<CustomerOrderPage />} />
            <Route path="/order/cart" element={<CustomerCartPage />} />
            <Route path="/order/checkout" element={<CustomerCheckoutPage />} />
            <Route path="/order/confirmation" element={<CustomerConfirmationPage />} />
            <Route path="/order/review" element={<CustomerReviewPage />} />
            <Route path="/order/status/:orderId" element={<CustomerOrderStatusPage />} />
            <Route path="/order/tracking/:orderId" element={<CustomerOrderTrackingPage />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />

          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
