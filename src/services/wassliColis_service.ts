import { doc, collection, addDoc, runTransaction, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/fb';
import { calcLight, getZone, checkDebt } from './wassliColis';

export const createOrder = async (input: {
  userId: string;
  weight: number;
  maxDim: number;
  origin: string;
  dest: string;
  vehicle: 'moto' | 'car';
  type: 'light' | 'hilux' | 'fleet';
  currentDebt: number;
  distance: number;
}) => {
  const pricing = calcLight(input.weight, input.distance, input.maxDim, input.vehicle);
  if (!pricing) throw new Error('INVALID_RANGE');
  const debt = checkDebt(input.currentDebt, pricing.commission);
  if (!debt.allowed) throw new Error('DEBT_LIMIT');
  const ref = await addDoc(collection(db, 'colis_orders'), {
    userId: input.userId,
    weight: input.weight,
    maxDim: input.maxDim,
    origin: input.origin,
    dest: input.dest,
    vehicle: input.vehicle,
    type: input.type,
    distance: input.distance,
    zone: getZone(input.distance),
    total: pricing.total,
    commission: pricing.commission,
    net: pricing.net,
    category: pricing.category,
    status: 'pending',
    driverId: null,
    createdAt: serverTimestamp(),
    debt: debt.next,
  });
  return ref.id;
};

export const acceptOrder = async (orderId: string, driverId: string) => {
  const ref = doc(db, 'colis_orders', orderId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('NOT_FOUND');
    if (snap.data().status !== 'pending' || snap.data().driverId != null) throw new Error('ALREADY_TAKEN');
    tx.update(ref, { status: 'accepted', driverId, acceptedAt: serverTimestamp() });
  });
};

export const onColisStatus = (orderId: string, cb: (data: any) => void) =>
  onSnapshot(doc(db, 'colis_orders', orderId), (s) => cb(s.data()));

export const createColisOrder = createOrder;