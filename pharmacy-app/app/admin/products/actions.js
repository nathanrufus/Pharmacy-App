"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// CREATE
export async function createProduct(formData) {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const dosage = formData.get("dosage")?.toString().trim();
  const expiryDate = formData.get("expiryDate")?.toString().trim();
  const healthInfo = formData.get("healthInfo")?.toString().trim();
  const pharmacyId = formData.get("pharmacyId")?.toString().trim();

  const priceStr = formData.get("price")?.toString().trim();
  const quantityStr = formData.get("quantity")?.toString().trim();

  if (!name || !pharmacyId) {
    return;
  }

  const price = priceStr ? Number(priceStr) : 0;
  const quantity = quantityStr ? Number(quantityStr) : 0;

  await addDoc(collection(db, "products"), {
    name,
    category,
    dosage,
    expiryDate, // keep as string for simplicity
    healthInfo,
    pharmacyId,
    price,
    quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/admin/products");
}

// UPDATE
export async function updateProduct(id, formData) {
  if (!id) return;

  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const dosage = formData.get("dosage")?.toString().trim();
  const expiryDate = formData.get("expiryDate")?.toString().trim();
  const healthInfo = formData.get("healthInfo")?.toString().trim();
  const pharmacyId = formData.get("pharmacyId")?.toString().trim();

  const priceStr = formData.get("price")?.toString().trim();
  const quantityStr = formData.get("quantity")?.toString().trim();

  if (!name || !pharmacyId) {
    return;
  }

  const price = priceStr ? Number(priceStr) : 0;
  const quantity = quantityStr ? Number(quantityStr) : 0;

  const ref = doc(db, "products", id);

  await updateDoc(ref, {
    name,
    category,
    dosage,
    expiryDate,
    healthInfo,
    pharmacyId,
    price,
    quantity,
    updatedAt: new Date(),
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}

// DELETE
export async function deleteProduct(id) {
  if (!id) return;

  const ref = doc(db, "products", id);
  await deleteDoc(ref);

  revalidatePath("/admin/products");
}
