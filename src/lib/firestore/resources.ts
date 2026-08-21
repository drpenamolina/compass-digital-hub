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
import type { ResourceEntry } from "@/types";

const resourcesCollection = collection(db, "resources");

export function subscribeToPublishedResources(onData: (items: ResourceEntry[]) => void) {
  const q = query(resourcesCollection, where("status", "==", "published"));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ResourceEntry)));
  });
}

export function subscribeToAllResources(onData: (items: ResourceEntry[]) => void) {
  return onSnapshot(resourcesCollection, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ResourceEntry)));
  });
}

export async function createResource(item: Omit<ResourceEntry, "id">) {
  return addDoc(resourcesCollection, item);
}

export async function updateResource(id: string, item: Partial<Omit<ResourceEntry, "id">>) {
  return updateDoc(doc(db, "resources", id), item);
}

export async function deleteResource(id: string) {
  return deleteDoc(doc(db, "resources", id));
}
