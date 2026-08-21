import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MatrixItem } from "@/types";

const matrixCollection = collection(db, "matrixItems");

export function subscribeToPublishedMatrixItems(
  onData: (items: MatrixItem[]) => void
) {
  const q = query(matrixCollection, where("status", "==", "published"));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MatrixItem)));
  });
}

export function subscribeToAllMatrixItems(onData: (items: MatrixItem[]) => void) {
  return onSnapshot(matrixCollection, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MatrixItem)));
  });
}

export function isExpired(nextReviewDue: string): boolean {
  return new Date(nextReviewDue) < new Date();
}

export function computeNextReviewDue(lastReviewedDate: string): string {
  const date = new Date(lastReviewedDate);
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().slice(0, 10);
}

export async function createMatrixItem(item: Omit<MatrixItem, "id">) {
  return addDoc(matrixCollection, item);
}

export async function updateMatrixItem(id: string, item: Partial<Omit<MatrixItem, "id">>) {
  return updateDoc(doc(db, "matrixItems", id), item);
}

export async function deleteMatrixItem(id: string) {
  return deleteDoc(doc(db, "matrixItems", id));
}

export async function setSelfTrack(id: string, uid: string, done: boolean) {
  return updateDoc(doc(db, "matrixItems", id), {
    [`residentSelfTrack.${uid}`]: done,
  });
}
