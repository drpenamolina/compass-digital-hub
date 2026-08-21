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
import type { CopeSession } from "@/types";

const copeCollection = collection(db, "copeSessions");

export function subscribeToPublishedCopeSessions(onData: (items: CopeSession[]) => void) {
  const q = query(copeCollection, where("status", "==", "published"));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CopeSession)));
  });
}

export function subscribeToAllCopeSessions(onData: (items: CopeSession[]) => void) {
  return onSnapshot(copeCollection, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CopeSession)));
  });
}

export async function createCopeSession(item: Omit<CopeSession, "id">) {
  return addDoc(copeCollection, item);
}

export async function updateCopeSession(id: string, item: Partial<Omit<CopeSession, "id">>) {
  return updateDoc(doc(db, "copeSessions", id), item);
}

export async function deleteCopeSession(id: string) {
  return deleteDoc(doc(db, "copeSessions", id));
}
