import { Card } from "../components/ui";

const orders = [
  { id: 1, table: 3, items: ["Tea", "Sandwich"] },
  { id: 2, table: 5, items: ["Coffee", "Paneer Masala"] },
];

export default function KitchenScreen() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Kitchen Orders</h2>
      {orders.map((o) => (
        <Card key={o.id}>
          <strong>Table {o.table}</strong>
          <ul>
            {o.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
