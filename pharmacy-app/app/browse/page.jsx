import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import BrowseClient from "@/components/BrowseClient";

export const dynamic = "force-dynamic";

async function getProductsWithPharmacy() {
  const [pharmSnap, prodSnap] = await Promise.all([
    getDocs(query(collection(db, "pharmacies"), orderBy("name"))),
    getDocs(query(collection(db, "products"), orderBy("name"))),
  ]);

  const pharmacies = Object.fromEntries(
    pharmSnap.docs.map((d) => [d.id, d.data().name || "Unknown pharmacy"])
  );

  return prodSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      pharmacyName: pharmacies[data.pharmacyId] || "Unknown pharmacy",
    };
  });
}

export default async function BrowsePage() {
  const products = await getProductsWithPharmacy();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Browse products
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search for medicines and health products across participating pharmacies.
        </p>
      </header>

      <BrowseClient products={products} />
    </div>
  );
}
