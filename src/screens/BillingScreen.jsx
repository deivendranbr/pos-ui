import { useState, useEffect } from "react";
import { Button, Card } from "../components/ui";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const CATEGORIES = ["All", "Beverages", "Starters", "Main Course"];

const PRODUCTS = [
  // Beverages
  { id: 1, name: "Tea", price: 20, category: "Beverages" },
  { id: 2, name: "Coffee", price: 30, category: "Beverages" },
  { id: 5, name: "Cold Coffee", price: 50, category: "Beverages" },
  { id: 6, name: "Masala Chai", price: 25, category: "Beverages" },
  { id: 7, name: "Lemonade", price: 35, category: "Beverages" },
  { id: 8, name: "Mango Shake", price: 60, category: "Beverages" },

  // Starters
  { id: 3, name: "Veg Sandwich", price: 80, category: "Starters" },
  { id: 9, name: "Paneer Tikka", price: 120, category: "Starters" },
  { id: 10, name: "French Fries", price: 60, category: "Starters" },
  { id: 11, name: "Spring Roll", price: 90, category: "Starters" },
  { id: 12, name: "Cheese Garlic Bread", price: 100, category: "Starters" },

  // Main Course
  { id: 4, name: "Paneer Butter Masala", price: 180, category: "Main Course" },
  { id: 13, name: "Veg Biryani", price: 150, category: "Main Course" },
  { id: 14, name: "Dal Makhani", price: 140, category: "Main Course" },
  { id: 15, name: "Mix Veg Curry", price: 130, category: "Main Course" },
  { id: 16, name: "Chole Bhature", price: 120, category: "Main Course" },
  { id: 17, name: "Butter Naan", price: 40, category: "Main Course" },
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
		<div className="min-h-screen bg-slate-100 p-4">
			
			{/* Header */}
			<div className="flex items-center gap-3 mb-4">
			<Button
				onClick={() => navigate("/tables")}
				className="bg-slate-500 hover:bg-slate-600 text-white"
			>
				← Tables
			</Button>

			<h2 className="text-xl font-semibold">
				Order – Table {tableId}
			</h2>
			</div>

			{/* Main Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-100px)]">

			{/* LEFT SIDE */}
			<div className="lg:col-span-2 flex flex-col gap-4">

				{/* Categories */}
				<Card className="bg-white rounded-xl">
					<h3 className="text-lg font-semibold mb-3">Categories</h3>

					<div className="flex flex-wrap gap-2">
						{CATEGORIES.map((c) => (
							<Button
							key={c}
							onClick={() => setCategory(c)}
							className={`
								px-4 py-2 rounded-full text-sm font-medium
								transition-colors duration-200
								${
								category === c
									? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
									: "bg-slate-600 text-slate-800 hover:bg-slate-300"
								}
							`}
							>
							{c}
							</Button>
						))}
					</div>
				</Card>

				{/* Items */}
				<Card className="bg-white rounded-xl flex-1">
				<h3 className="text-lg font-semibold mb-3">Items</h3>

				<div className="grid grid-cols-2 gap-3 content-start">
					{filteredProducts.map((p) => (
					<div
						key={p.id}
						onClick={() => addItem(p)}
						className="border rounded-lg p-3 cursor-pointer
						hover:shadow-md transition bg-slate-50"
					>
						<strong className="block">{p.name}</strong>
						<span className="text-slate-600">₹{p.price}</span>
					</div>
					))}
				</div>
				</Card>
			</div>

			{/* RIGHT SIDE – BILL */}
			<div>
				<Card className="bg-white rounded-xl sticky top-4">
				<h3 className="text-lg font-semibold mb-3">Current Bill</h3>

				{cart.length === 0 && (
					<p className="text-slate-500">No items added</p>
				)}

				<div className="space-y-2">
					{cart.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between"
						>
						{/* Item Name */}
						<span className="w-24 text-slate-800 font-medium break-words leading-snug">
							{item.name}
						</span>

						{/* Quantity Controls */}
						<div className="flex items-center gap-2">
							{/* Decrease Button */}
							<button
							onClick={() => updateQty(item.id, -1)}
							className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 focus:outline-none"
							>
							-
							</button>

							{/* Quantity Display */}
							<span className="w-6 text-center">{item.qty}</span>

							{/* Increase Button */}
							<button
							onClick={() => updateQty(item.id, 1)}
							className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 focus:outline-none"
							>
							+
							</button>
						</div>

						{/* Total Price */}
						<strong>₹{item.price * item.qty}</strong>
						</div>

					))}
				</div>

				<hr className="my-4" />

				<div className="space-y-1 text-slate-700">
					<div className="flex justify-between">
					<span>Subtotal</span>
					<span>₹{subtotal}</span>
					</div>
					<div className="flex justify-between">
					<span>Tax (5%)</span>
					<span>₹{tax.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-lg font-semibold">
					<span>Total</span>
					<span>₹{total.toFixed(2)}</span>
					</div>
				</div>

				<div className="mt-4 flex flex-col gap-2">
					<Button
					onClick={() => alert("KOT sent to kitchen")}
					className="bg-orange-500 hover:bg-orange-600 text-white"
					>
					Send to Kitchen
					</Button>

					<Button
					onClick={() => navigate(`/bill?table=${tableId}`)}
					className="bg-green-600 hover:bg-green-700 text-white"
					>
					Generate Bill
					</Button>
				</div>
				</Card>
			</div>
			</div>
		</div>
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
