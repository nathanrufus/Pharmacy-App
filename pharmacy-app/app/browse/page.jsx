import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import BrowseClient from "@/components/BrowseClient";

export const dynamic = "force-dynamic";

// Turn Firestore doc into JSON-safe object
function docToPlain(docSnap) {
  const data = docSnap.data();
  const plain = JSON.parse(JSON.stringify(data));
  return { id: docSnap.id, ...plain };
}

async function getProductsWithPharmacy() {
  const [pharmSnap, prodSnap] = await Promise.all([
    getDocs(query(collection(db, "pharmacies"), orderBy("name"))),
    getDocs(query(collection(db, "products"), orderBy("name"))),
  ]);

  const pharmacies = Object.fromEntries(
    pharmSnap.docs.map((d) => {
      const p = docToPlain(d);
      return [p.id, p.name || "Unknown pharmacy"];
    })
  );

  return prodSnap.docs.map((d) => {
    const p = docToPlain(d);
    return {
      ...p,
      pharmacyName: pharmacies[p.pharmacyId] || "Unknown pharmacy",
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
