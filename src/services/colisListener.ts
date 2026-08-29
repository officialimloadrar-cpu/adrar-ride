import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/fb";

const COLLECTION = "colis_orders";

export type Zone = "adrar" | "timimoun";
export type ColisStatus = "pending" | "accepted" | "delivered" | "cancelled";

export interface ColisOrder {
  id: string;
  zone: Zone;
  status: ColisStatus;
  from: string;
  to: string;
  origin: string;
  dest: string;
  distance: number;
  total: number;
  net: number;
  weight: number;
  price: number;
  createdAt: Date;
  driverId?: string;
  acceptedAt?: Date;
}

export const subscribeToNewColis = (
  zones: Zone[],
  onAdded: (order: ColisOrder) => void
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION),
    where("zone", "in", zones),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type!== "added") continue;
      onAdded({ id: change.doc.id,...change.doc.data() } as ColisOrder);
    }
  });
};

export const listenColis = (
  zone: Zone,
  onChange: (orders: ColisOrder[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION),
    where("zone", "==", zone),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    onChange(snapshot.docs.map((d) => ({ id: d.id,...d.data() } as ColisOrder)));
  });
};

export const acceptColis = async (id: string, driverId: string): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    status: "accepted",
    driverId,
    acceptedAt: serverTimestamp(),
  });
};