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
export async function createPharmacy(formData) {
  const name = formData.get("name")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const city = formData.get("city")?.toString().trim();
  const contactPhone = formData.get("contactPhone")?.toString().trim();
  const contactEmail = formData.get("contactEmail")?.toString().trim();
  const latStr = formData.get("lat")?.toString().trim();
  const lngStr = formData.get("lng")?.toString().trim();

  if (!name) {
    return;
  }

  const lat = latStr ? Number(latStr) : null;
  const lng = lngStr ? Number(lngStr) : null;

  await addDoc(collection(db, "pharmacies"), {
    name,
    address,
    city,
    contactPhone,
    contactEmail,
    location:
      lat != null && lng != null
        ? { lat, lng }
        : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Refresh the pharmacies page
  revalidatePath("/admin/pharmacies");
}

// UPDATE
export async function updatePharmacy(id, formData) {
  const name = formData.get("name")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const city = formData.get("city")?.toString().trim();
  const contactPhone = formData.get("contactPhone")?.toString().trim();
  const contactEmail = formData.get("contactEmail")?.toString().trim();
  const latStr = formData.get("lat")?.toString().trim();
  const lngStr = formData.get("lng")?.toString().trim();

  if (!id || !name) return;

  const lat = latStr ? Number(latStr) : null;
  const lng = lngStr ? Number(lngStr) : null;

  const ref = doc(db, "pharmacies", id);
  await updateDoc(ref, {
    name,
    address,
    city,
    contactPhone,
    contactEmail,
    location:
      lat != null && lng != null
        ? { lat, lng }
        : null,
    updatedAt: new Date(),
  });

  revalidatePath("/admin/pharmacies");
  revalidatePath(`/admin/pharmacies/${id}`);
}

// DELETE
export async function deletePharmacy(id) {
  if (!id) return;

  const ref = doc(db, "pharmacies", id);
  await deleteDoc(ref);

  revalidatePath("/admin/pharmacies");
}
