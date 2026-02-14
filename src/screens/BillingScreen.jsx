import { useState, useEffect } from "react";
import { Button, Card } from "../components/ui";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const BillingScreen = ({ onPay }) => {
	const [categories, setCategories] = useState(["All"]);

	useEffect(() => {
		const storedCategories = JSON.parse(localStorage.getItem('appSettings_categories') || '["Beverages", "Starters", "Main Course"]');
		setCategories(["All", ...storedCategories]);
	}, []);

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


	const [category, setCategory] = useState("All");
	const currency = localStorage.getItem('currencySymbol') || '₹';

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
		<div className="min-h-screen bg-[#F0F4F8] p-4 font-sans">

			{/* Header */}
			<div className="flex items-center gap-3 mb-6 bg-transparent">
				<Button
					onClick={() => navigate("/hotel")}
					className="bg-[#6B728E] hover:bg-[#50577A] text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Tables
				</Button>

				<h2 className="text-xl font-black text-[#1E293B] tracking-tight">
					Order – Table {tableId}
				</h2>
			</div>

			{/* Main Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">

				{/* LEFT SIDE - Categories & Items */}
				<div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">

					{/* Categories */}
					<Card className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
						<h3 className="text-sm font-black text-[#64748B] uppercase tracking-wider mb-4">Categories</h3>

						<div className="flex flex-wrap gap-2">
							{categories.map((c) => (
								<button
									key={c}
									onClick={() => setCategory(c)}
									className={`
										px-5 py-2.5 rounded-lg text-sm font-black transition-all duration-200
										${category === c
											? "bg-[#2563EB] text-white shadow-md active:scale-95"
											: "bg-[#475569] text-white hover:bg-[#334155] active:scale-95"
										}
									`}
								>
									{c}
								</button>
							))}
						</div>
					</Card>

					{/* Items */}
					<Card className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 flex-1 overflow-y-auto">
						<h3 className="text-sm font-black text-[#64748B] uppercase tracking-wider mb-4">Items</h3>

						<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
							{filteredProducts.map((p) => (
								<div
									key={p.id}
									onClick={() => addItem(p)}
									className="group border border-[#E2E8F0] rounded-xl p-4 cursor-pointer hover:border-[#2563EB] hover:shadow-md transition-all bg-white"
								>
									<strong className="block text-[#1E293B] font-bold group-hover:text-[#2563EB] transition-colors">{p.name}</strong>
									<span className="text-[#64748B] text-sm font-semibold">₹{p.price}</span>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* RIGHT SIDE – BILL */}
				<div className="lg:col-span-1 h-full">
					<Card className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-5 h-full flex flex-col">
						<h3 className="text-sm font-black text-[#64748B] uppercase tracking-wider mb-4">Current Bill</h3>

						<div className="flex-1 overflow-y-auto space-y-4">
							{cart.length === 0 ? (
								<p className="text-[#94A3B8] text-sm font-medium italic">No items added</p>
							) : (
								cart.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3"
									>
										{/* Item Name */}
										<div className="flex-1">
											<span className="block text-[#1E293B] font-bold break-words leading-tight">
												{item.name}
											</span>
											<span className="text-[10px] text-[#64748B] font-bold">₹{item.price} x {item.qty}</span>
										</div>

										{/* Quantity Controls */}
										<div className="flex items-center bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-1">
											<button
												onClick={() => updateQty(item.id, -1)}
												className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#64748B] hover:text-[#EF4444] transition-colors"
											>
												-
											</button>
											<span className="w-8 text-center text-sm font-black text-[#1E293B]">{item.qty}</span>
											<button
												onClick={() => updateQty(item.id, 1)}
												className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#64748B] hover:text-[#22C55E] transition-colors"
											>
												+
											</button>
										</div>

										{/* Total Price */}
										<strong className="text-[#1E293B] font-black min-w-[50px] text-right">₹{item.price * item.qty}</strong>
									</div>
								))
							)}
						</div>

						<div className="pt-4 mt-4 border-t-2 border-dashed border-[#E2E8F0] space-y-2">
							<div className="flex justify-between text-sm font-bold text-[#64748B]">
								<span>Subtotal</span>
								<span>₹{subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm font-bold text-[#64748B]">
								<span>Tax (5%)</span>
								<span>₹{tax.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-lg font-black text-[#1E293B] pt-2">
								<span>Total</span>
								<span>₹{total.toFixed(2)}</span>
							</div>
						</div>

						<div className="mt-6 flex flex-col gap-3">
							<button
								onClick={() => alert("KOT sent to kitchen")}
								className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-xl text-sm font-black shadow-lg shadow-orange-100 transition-all active:scale-95"
							>
								Send to Kitchen
							</button>

							<button
								onClick={() => navigate(`/bill?table=${tableId}`)}
								className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 rounded-xl text-sm font-black shadow-lg shadow-green-100 transition-all active:scale-95"
							>
								Generate Bill
							</button>
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

export default BillingScreen;
