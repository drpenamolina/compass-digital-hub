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
import type { NavigateItem } from "@/types";

const navigateCollection = collection(db, "navigateItems");

export function subscribeToPublishedNavigateItems(onData: (items: NavigateItem[]) => void) {
  const q = query(navigateCollection, where("status", "==", "published"));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NavigateItem)));
  });
}

export function subscribeToAllNavigateItems(onData: (items: NavigateItem[]) => void) {
  return onSnapshot(navigateCollection, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NavigateItem)));
  });
}

export async function createNavigateItem(item: Omit<NavigateItem, "id">) {
  return addDoc(navigateCollection, item);
}

export async function updateNavigateItem(id: string, item: Partial<Omit<NavigateItem, "id">>) {
  return updateDoc(doc(db, "navigateItems", id), item);
}

export async function deleteNavigateItem(id: string) {
  return deleteDoc(doc(db, "navigateItems", id));
}
