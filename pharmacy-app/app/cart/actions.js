"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function placeOrder(formData) {
  const userId = formData.get("userId")?.toString();
  const itemsJson = formData.get("items")?.toString();

  if (!userId || !itemsJson) {
    return;
  }

  let items;
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  // Transaction: check stock + decrement quantities
  await runTransaction(db, async (tx) => {
    for (const item of items) {
      const prodRef = doc(db, "products", item.productId);
      const snap = await tx.get(prodRef);
      if (!snap.exists()) {
        throw new Error("Product no longer exists");
      }
      const data = snap.data();
      const currentQty = data.quantity ?? 0;
      if (currentQty < item.quantity) {
        throw new Error(`Insufficient stock for ${data.name}`);
      }
      tx.update(prodRef, {
        quantity: currentQty - item.quantity,
      });
    }
  });

  const totalAmount = items.reduce(
    (sum, i) => sum + (i.price || 0) * i.quantity,
    0
  );

  await addDoc(collection(db, "orders"), {
    userId,
    items,
    totalAmount,
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/orders");
  revalidatePath("/admin/orders");
}
