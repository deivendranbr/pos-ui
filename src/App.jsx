import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import TableScreen from "./screens/TableScreen";
import BillingScreen from "./screens/Billingscreen";
import PaymentScreen from "./screens/PaymentScreen";
import KitchenScreen from "./screens/KitchenScreen";
import BillPreviewScreen from "./screens/BillPreviewScreen";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/tables" element={<TableScreen />} />
      <Route path="/billing" element={<BillingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/kitchen" element={<KitchenScreen />} />
      <Route path="/bill" element={<BillPreviewScreen />} />
    </Routes>
  );
}
