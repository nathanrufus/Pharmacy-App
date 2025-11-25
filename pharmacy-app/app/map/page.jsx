import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import PharmacyMap from "@/components/PharmacyMap";

export const dynamic = "force-dynamic";

function docToPlain(docSnap) {
  const data = docSnap.data();
  const plain = JSON.parse(JSON.stringify(data));
  return { id: docSnap.id, ...plain };
}

async function getPharmacies() {
  const snap = await getDocs(collection(db, "pharmacies"));
  return snap.docs.map(docToPlain);
}

export default async function MapPage() {
  const pharmacies = await getPharmacies();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Pharmacy map
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View participating pharmacies on an interactive map and start an order.
        </p>
      </header>

      <PharmacyMap pharmacies={pharmacies} />
    </div>
  );
}
