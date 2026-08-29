import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    Timestamp,
    runTransaction,
  } from "firebase/firestore";
  import { db } from "../lib/fb";
  
  export const HoldStatus = {
    FAMILY_HOLD: "family_hold",
    CONFIRMED_4: "confirmed_family_4",
    EXPIRED: "expired",
  } as const;
  
  export type HoldStatusType = typeof HoldStatus[keyof typeof HoldStatus];
  
  export interface FamilyHold {
    rideId: string;
    userId: string;
    distance: number;
    seatsBooked: 3 | 4;
    price: number;
    status: HoldStatusType;
    expiresAt: Timestamp;
    createdAt: unknown;
    fourthSeatPrice: number;
  }
  
  export class HoldExpiredError extends Error {}
  export class UnauthorizedHoldAccessError extends Error {}
  export class HoldNotFoundError extends Error {}
  
  const HOLD_DURATION_MS = 15 * 60 * 1000;
  const FOURTH_SEAT_FEE = 350;
  
  export const createFamilyHold = async (
    userId: string,
    distance: number,
    priceForThree: number
  ): Promise<FamilyHold> => {
    const rideId = `hold_${userId}_${Date.now()}`;
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + HOLD_DURATION_MS));
  
    const payload: FamilyHold = {
      rideId,
      userId,
      distance,
      seatsBooked: 3,
      price: priceForThree,
      status: HoldStatus.FAMILY_HOLD,
      expiresAt,
      createdAt: serverTimestamp(),
      fourthSeatPrice: FOURTH_SEAT_FEE,
    };
  
    await setDoc(doc(db, "activeRides", rideId), payload);
    return payload;
  };
  
  export const addFourthFamilySeat = async (
    rideId: string,
    currentUserId: string
  ): Promise<void> => {
    const ref = doc(db, "activeRides", rideId);
  
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new HoldNotFoundError("Hold not found");
  
      const data = snap.data() as FamilyHold;
  
      if (data.userId !== currentUserId) {
        throw new UnauthorizedHoldAccessError("Fourth seat exclusive to holder");
      }
  
      if (data.status !== HoldStatus.FAMILY_HOLD) {
        throw new Error("Hold unavailable");
      }
  
      if (Timestamp.now() > data.expiresAt) {
        transaction.update(ref, { status: HoldStatus.EXPIRED });
        throw new HoldExpiredError("Hold expired");
      }
  
      transaction.update(ref, {
        seatsBooked: 4,
        price: data.price + data.fourthSeatPrice,
        status: HoldStatus.CONFIRMED_4,
      });
    });
  };
  
  export const getHoldById = async (rideId: string): Promise<FamilyHold | null> => {
    const snap = await getDoc(doc(db, "activeRides", rideId));
    return snap.exists() ? (snap.data() as FamilyHold) : null;
  };
  export const cleanupExpiredHolds = async () => {
    const { collection, query, where, getDocs, updateDoc } = await import("firebase/firestore");
    const q = query(collection(db, "activeRides"), where("status", "==", HoldStatus.FAMILY_HOLD));
    const snap = await getDocs(q);
    const now = Timestamp.now();
    for (const d of snap.docs) {
      const data = d.data() as FamilyHold;
      if (now > data.expiresAt) {
        await updateDoc(d.ref, { status: HoldStatus.EXPIRED });
      }
    }
  };