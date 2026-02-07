import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("pos-orders");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("pos-orders", JSON.stringify(orders));
  }, [orders]);

  const getOrder = (tableId) => orders[tableId] || [];

  const setOrder = (tableId, items) => {
    setOrders((prev) => ({
      ...prev,
      [tableId]: items,
    }));
  };

  const clearOrder = (tableId) => {
    setOrders((prev) => {
      const copy = { ...prev };
      delete copy[tableId];
      return copy;
    });
  };

  return (
    <OrderContext.Provider
      value={{ orders, getOrder, setOrder, clearOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
