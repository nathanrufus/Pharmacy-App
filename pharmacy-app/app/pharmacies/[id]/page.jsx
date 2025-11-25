// app/pharmacies/[id]/page.jsx
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import PharmacyProductList from "@/components/PharmacyProductList";

export const dynamic = "force-dynamic";

function docToPlain(docSnap) {
  const data = docSnap.data();
  const plain = JSON.parse(JSON.stringify(data));
  return { id: docSnap.id, ...plain };
}

async function getPharmacy(id) {
  if (!id || typeof id !== "string") return null;
  const ref = doc(db, "pharmacies", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return docToPlain(snap);
}

async function getProductsForPharmacy(pharmacyId) {
  const snap = await getDocs(
    query(
      collection(db, "products"),
      where("pharmacyId", "==", pharmacyId) 
    )
  );
  return snap.docs.map(docToPlain);
}

export default async function PharmacyDetailPage({ params }) {
  const { id } = await params; 

  const pharmacy = await getPharmacy(id);
  if (!pharmacy) {
    notFound();
  }

  const products = await getProductsForPharmacy(id);

  return (
    <div className="space-y-4">
      <header className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          {pharmacy.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {pharmacy.address || "Address not set"}
          {pharmacy.city ? `, ${pharmacy.city}` : ""}
        </p>
        <div className="mt-3 text-xs text-slate-500 space-y-1">
          {pharmacy.contactPhone && <p>Phone: {pharmacy.contactPhone}</p>}
          {pharmacy.contactEmail && <p>Email: {pharmacy.contactEmail}</p>}
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-slate-800">
          Products available
        </h2>
        {/* Now pharmacy & products are plain objects, safe for client component */}
        <PharmacyProductList pharmacy={pharmacy} products={products} />
      </section>
    </div>
  );
}
