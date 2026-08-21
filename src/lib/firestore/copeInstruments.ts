import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CopeInstrumentLinks } from "@/types";

const instrumentLinksDoc = doc(db, "settings", "copeInstruments");

const emptyLinks: CopeInstrumentLinks = {
  aaqUrl: "",
  resilienceScaleUrl: "",
  selfCompassionScaleUrl: "",
  perceivedStressScaleUrl: "",
};

export function subscribeToInstrumentLinks(onData: (links: CopeInstrumentLinks) => void) {
  return onSnapshot(instrumentLinksDoc, (snapshot) => {
    onData(snapshot.exists() ? (snapshot.data() as CopeInstrumentLinks) : emptyLinks);
  });
}

export async function updateInstrumentLinks(links: CopeInstrumentLinks) {
  return setDoc(instrumentLinksDoc, links);
}
