import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BelongEvent } from "@/types";

const belongCollection = collection(db, "belongEvents");

export function subscribeToPublishedBelongEvents(onData: (items: BelongEvent[]) => void) {
  const q = query(belongCollection, where("status", "==", "published"));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BelongEvent)));
  });
}

export function subscribeToAllBelongEvents(onData: (items: BelongEvent[]) => void) {
  return onSnapshot(belongCollection, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BelongEvent)));
  });
}

export async function createBelongEvent(item: Omit<BelongEvent, "id">) {
  return addDoc(belongCollection, item);
}

export async function updateBelongEvent(id: string, item: Partial<Omit<BelongEvent, "id">>) {
  return updateDoc(doc(db, "belongEvents", id), item);
}

export async function deleteBelongEvent(id: string) {
  return deleteDoc(doc(db, "belongEvents", id));
}
