import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { Button, Card } from "../components/ui";

export default function BillPreviewScreen() {
  const [params] = useSearchParams();
  const tableId = params.get("table");
  const navigate = useNavigate();
  const { getOrder } = useOrders();

  const cart = getOrder(tableId);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <h2>Bill Preview – Table {tableId}</h2>

        {cart.map((i) => (
          <div key={i.id}>
            {i.name} × {i.qty} = ₹{i.price * i.qty}
          </div>
        ))}

        <hr />
        <h3>Total: ₹{total}</h3>

        <Button onClick={() => navigate(`/payment?table=${tableId}`)}>
          Proceed to Payment
        </Button>
      </Card>
    </div>
  );
}
