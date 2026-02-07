import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { Button, Card } from "../components/ui";

export default function PaymentScreen() {
  const [params] = useSearchParams();
  const tableId = params.get("table");
  const navigate = useNavigate();
  const { clearOrder } = useOrders();

  const completePayment = () => {
    clearOrder(tableId);
    navigate("/tables");
  };

  return (
    <div style={styles.center}>
      <Card>
        <h2>Payment</h2>
        <Button onClick={completePayment}>Cash</Button>
        <Button onClick={completePayment}>UPI</Button>
        <Button onClick={completePayment}>Card</Button>
      </Card>
    </div>
  );
}

const styles = {
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
