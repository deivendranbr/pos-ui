import { useState, useEffect } from "react";
import { Button, Card } from "../components/ui";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const CATEGORIES = ["All", "Beverages", "Starters", "Main Course"];

const PRODUCTS = [
	{ id: 1, name: "Tea", price: 20, category: "Beverages" },
	{ id: 2, name: "Coffee", price: 30, category: "Beverages" },
	{ id: 3, name: "Veg Sandwich", price: 80, category: "Starters" },
	{ id: 4, name: "Paneer Butter Masala", price: 180, category: "Main Course" },
];

export default function BillingScreen({ onPay }) {
	const [category, setCategory] = useState("All");

	const [params] = useSearchParams();
	const tableId = params.get("table");
	const navigate = useNavigate();

	const { getOrder, setOrder } = useOrders();

	const [cart, setCart] = useState(() => getOrder(tableId));

	const filteredProducts =
		category === "All"
			? PRODUCTS
			: PRODUCTS.filter((p) => p.category === category);

	const addItem = (product) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.id === product.id);
			if (existing) {
				return prev.map((i) =>
					i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
				);
			}
			return [...prev, { ...product, qty: 1 }];
		});
	};

	const updateQty = (id, delta) => {
		setCart((prev) =>
			prev
				.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
				.filter((i) => i.qty > 0),
		);
	};
	useEffect(() => {
		if (tableId) {
			setOrder(tableId, cart);
		}
	}, [cart, tableId]);

	const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
	const tax = subtotal * 0.05;
	const total = subtotal + tax;

	return (
		<>
			<div className="min-h-screen bg-slate-100 p-4">
				<div style={styles.header}>
					<Button onClick={() => navigate("/tables")} style={styles.backBtn}>
						← Tables
					</Button>

					<h2 style={{ margin: 0 }}>Order – Table {tableId}</h2>
				</div>
				<div style={styles.container}>
					{/* LEFT: Products */}
					<div style={styles.left}>
						<Card>
							<h3>Categories</h3>
							<div style={styles.categories}>
								{CATEGORIES.map((c) => (
									<Button
										key={c}
										onClick={() => setCategory(c)}
										style={{
											background: category === c ? "#2563eb" : "#e5e7eb",
											color: category === c ? "#fff" : "#000",
										}}
									>
										{c}
									</Button>
								))}
							</div>
						</Card>

						<Card>
							<h3>Items</h3>
							<div style={styles.products}>
								{filteredProducts.map((p) => (
									<div
										key={p.id}
										style={styles.product}
										onClick={() => addItem(p)}
									>
										<strong>{p.name}</strong>
										<div>₹{p.price}</div>
									</div>
								))}
							</div>
						</Card>
					</div>

					{/* RIGHT: Bill */}
					<div style={styles.right}>
						<Card>
							<h3>Current Bill</h3>

							{cart.length === 0 && <p>No items added</p>}

							{cart.map((item) => (
								<div key={item.id} style={styles.cartItem}>
									<span>{item.name}</span>
									<div>
										<Button onClick={() => updateQty(item.id, -1)}>-</Button>
										<span style={{ margin: "0 8px" }}>{item.qty}</span>
										<Button onClick={() => updateQty(item.id, 1)}>+</Button>
									</div>
									<strong>₹{item.price * item.qty}</strong>
								</div>
							))}

							<hr />

							<div style={styles.summary}>
								<div>Subtotal: ₹{subtotal}</div>
								<div>Tax (5%): ₹{tax.toFixed(2)}</div>
								<h3>Total: ₹{total.toFixed(2)}</h3>
							</div>

							<Button onClick={() => alert("KOT sent to kitchen")}>
								Send to Kitchen
							</Button>

							<Button onClick={() => navigate(`/bill?table=${tableId}`)}>
								Generate Bill
							</Button>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}

const styles = {
	container: {
		display: "flex",
		height: "100vh",
		padding: 12,
		background: "#f3f4f6",
	},
	header: {
		display: "flex",
		alignItems: "center",
		gap: 12,
		marginBottom: 12,
	},
	backBtn: {
		background: "#6b7280",
	},
	left: {
		flex: 2,
		marginRight: 12,
		display: "flex",
		flexDirection: "column",
		gap: 12,
	},
	right: {
		flex: 1,
	},
	categories: {
		display: "flex",
		gap: 8,
		flexWrap: "wrap",
	},
	products: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: 10,
	},
	product: {
		padding: 12,
		border: "1px solid #d1d5db",
		borderRadius: 6,
		cursor: "pointer",
		background: "#fff",
	},
	cartItem: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	summary: {
		marginTop: 12,
	},
	payBtn: {
		marginTop: 12,
		width: "100%",
		background: "#16a34a",
	},
};
