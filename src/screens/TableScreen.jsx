import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui";
import { useOrders } from "../context/OrderContext";

const tables = Array.from({ length: 12 }, (_, i) => i + 1);

export default function TableScreen() {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div style={{ padding: 16 }}>
      <h2>Select Table</h2>
      <div style={styles.grid}>
        {tables.map((t) => {
          const occupied = orders[t]?.length > 0;

          return (
            <Card
              key={t}
              onClick={() => navigate(`/billing?table=${t}`)}
              style={{
                background: occupied ? "#fee2e2" : "#ecfeff",
                cursor: "pointer",
              }}
            >
              <strong>Table {t}</strong>
              <div>{occupied ? "Occupied" : "Free"}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
};
