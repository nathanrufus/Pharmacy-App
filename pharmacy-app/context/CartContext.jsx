"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function loadInitialCart() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem("pharmacy-cart-v1");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pharmacy-cart-v1", JSON.stringify(items));
    }
  }, [items]);

  const addItem = ({ productId, pharmacyId, name, price }) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === productId && i.pharmacyId === pharmacyId
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { productId, pharmacyId, name, price: price || 0, quantity: 1 },
      ];
    });
  };

  const updateQuantity = (productId, pharmacyId, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.pharmacyId === pharmacyId
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId, pharmacyId) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.pharmacyId === pharmacyId)
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, i) => sum + (i.price || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
