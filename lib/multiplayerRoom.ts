import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient";

export interface PlayerData {
  name: string;
  code: string;
  status: "waiting" | "coding" | "submitted";
  submittedAt?: number;
  passed?: boolean;
}

export interface RoomData {
  challengeId: string;
  players: Record<string, PlayerData>;
  state: "waiting" | "countdown" | "playing" | "finished";
  startedAt?: number;
  createdAt?: unknown;
}

const COLLECTION = "multiplayer-rooms";

export function generateRoomId(): string {
  return `mp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function createRoom(
  roomId: string,
  challengeId: string,
  playerId: string,
  playerName: string,
): Promise<void> {
  await setDoc(doc(db, COLLECTION, roomId), {
    challengeId,
    players: {
      [playerId]: { name: playerName, code: "", status: "waiting" },
    },
    state: "waiting",
    createdAt: serverTimestamp(),
  });
}

export async function joinRoom(
  roomId: string,
  playerId: string,
  playerName: string,
): Promise<boolean> {
  const ref = doc(db, COLLECTION, roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const data = snap.data() as RoomData;
  if (Object.keys(data.players).length >= 2) return false;
  await updateDoc(ref, {
    [`players.${playerId}`]: {
      name: playerName,
      code: "",
      status: "waiting",
    },
  });
  return true;
}

export function subscribeToRoom(
  roomId: string,
  callback: (data: RoomData) => void,
): () => void {
  return onSnapshot(doc(db, COLLECTION, roomId), (snap) => {
    if (snap.exists()) callback(snap.data() as RoomData);
  });
}

export async function updatePlayerCode(
  roomId: string,
  playerId: string,
  code: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    [`players.${playerId}.code`]: code,
  });
}

export async function submitSolution(
  roomId: string,
  playerId: string,
  passed: boolean,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    [`players.${playerId}.status`]: "submitted",
    [`players.${playerId}.submittedAt`]: Date.now(),
    [`players.${playerId}.passed`]: passed,
  });
}

export async function startGame(roomId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, roomId), {
    state: "playing",
    startedAt: Date.now(),
  });
}
