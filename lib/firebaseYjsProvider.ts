import * as Y from 'yjs';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseClient';

export class FirebaseProvider {
  private doc: Y.Doc;
  private roomId: string;
  private firestoreDocRef: ReturnType<typeof doc>;
  private unsubscribe: (() => void) | null = null;
  private updateHandler: (() => void) | null = null;
  private isSyncing = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastUpdateHash: string | null = null;

  constructor(roomId: string, ydoc: Y.Doc) {
    this.doc = ydoc;
    this.roomId = roomId;
    this.firestoreDocRef = doc(db, 'collaborative-rooms', roomId);
    this.setup();
  }

  private async setup() {
    // Load initial state from Firestore
    const snapshot = await getDoc(this.firestoreDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data?.content) {
        try {
          const update = new Uint8Array(Object.values(data.content));
          Y.applyUpdate(this.doc, update);
        } catch (e) {
          console.error('Error applying initial update:', e);
        }
      }
    } else {
      // Create initial document
      const update = Y.encodeStateAsUpdate(this.doc);
      await setDoc(this.firestoreDocRef, {
        content: Array.from(update),
        lastModified: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    // Listen for remote changes
    this.unsubscribe = onSnapshot(this.firestoreDocRef, (snapshot) => {
      if (!snapshot.exists() || this.isSyncing) return;
      
      const data = snapshot.data();
      if (data?.content) {
        try {
          const update = new Uint8Array(Object.values(data.content));
          // Create a hash of the update to avoid applying our own updates
          const updateHash = Array.from(update).slice(0, 10).join(',');
          
          // Skip if this is the update we just sent
          if (this.lastUpdateHash === updateHash) {
            this.lastUpdateHash = null; // Reset after skipping
            return;
          }
          
          this.isSyncing = true;
          Y.applyUpdate(this.doc, update);
          this.isSyncing = false;
        } catch (e) {
          console.error('Error applying remote update:', e);
          this.isSyncing = false;
        }
      }
    });

    // Send local changes to Firestore (with debounce to prevent excessive writes)
    this.updateHandler = () => {
      if (this.isSyncing) return;
      
      // Clear existing timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // Debounce updates to Firestore (wait 100ms for batch updates)
      this.debounceTimer = setTimeout(() => {
        const update = Y.encodeStateAsUpdate(this.doc);
        const updateArray = Array.from(update);
        // Store hash to identify our own updates
        this.lastUpdateHash = updateArray.slice(0, 10).join(',');
        
        // Use setDoc with merge to handle both create and update cases
        setDoc(this.firestoreDocRef, {
          content: updateArray,
          lastModified: serverTimestamp(),
        }, { merge: true }).catch((e) => {
          console.error('Error syncing to Firestore:', e);
          this.lastUpdateHash = null; // Reset on error
        });
      }, 100);
    };

    this.doc.on('update', this.updateHandler);
  }

  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.updateHandler) {
      this.doc.off('update', this.updateHandler);
    }
  }
}
