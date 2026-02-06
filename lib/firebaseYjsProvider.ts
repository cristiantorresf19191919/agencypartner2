import * as Y from 'yjs';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseClient';

export class FirebaseProvider {
  private ydoc: Y.Doc;
  private firestoreDocRef: ReturnType<typeof doc>;
  private unsubscribe: (() => void) | null = null;
  private updateHandler: ((update: Uint8Array, origin: unknown) => void) | null = null;
  private isSyncing = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _synced = false;
  private _destroyed = false;
  private syncedPromise: Promise<void>;
  private resolveSynced: (() => void) | null = null;

  constructor(roomId: string, ydoc: Y.Doc) {
    this.ydoc = ydoc;
    this.firestoreDocRef = doc(db, 'collaborative-rooms', roomId);

    // Create a promise that resolves when initial sync is complete
    this.syncedPromise = new Promise((resolve) => {
      this.resolveSynced = resolve;
    });

    this.setup();
  }

  /** Returns true when initial Firestore data has been loaded */
  get synced(): boolean {
    return this._synced;
  }

  /** Promise that resolves when initial sync is complete */
  whenSynced(): Promise<void> {
    return this.syncedPromise;
  }

  private async setup() {
    if (this._destroyed) return;

    try {
      // Load initial state from Firestore
      const snapshot = await getDoc(this.firestoreDocRef);

      if (this._destroyed) return;

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.content && Array.isArray(data.content)) {
          try {
            const update = new Uint8Array(data.content);
            this.isSyncing = true;
            Y.applyUpdate(this.ydoc, update);
            this.isSyncing = false;
          } catch (e) {
            console.error('[FirebaseProvider] Error applying initial update:', e);
            this.isSyncing = false;
          }
        }
      } else {
        // Create initial document in Firestore
        const update = Y.encodeStateAsUpdate(this.ydoc);
        await setDoc(this.firestoreDocRef, {
          content: Array.from(update),
          lastModified: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }

      // Mark as synced
      this._synced = true;
      this.resolveSynced?.();

      if (this._destroyed) return;


      // Listen for remote changes
      this.unsubscribe = onSnapshot(this.firestoreDocRef, (snapshot) => {
        if (this._destroyed || !snapshot.exists() || this.isSyncing) return;

        const data = snapshot.data();
        if (data?.content && Array.isArray(data.content)) {
          try {
            const remoteUpdate = new Uint8Array(data.content);

            // Use state vector comparison to determine if we need to apply this update
            // This is more reliable than hash comparison
            const localStateVector = Y.encodeStateVector(this.ydoc);

            // Check if remote has changes we don't have
            const diff = Y.diffUpdate(remoteUpdate, localStateVector);
            if (diff.length > 2) { // Empty diff is typically 2 bytes
              this.isSyncing = true;
              Y.applyUpdate(this.ydoc, diff);
              this.isSyncing = false;
            }
          } catch (e) {
            console.error('[FirebaseProvider] Error applying remote update:', e);
            this.isSyncing = false;
          }
        }
      });

      // Send local changes to Firestore (with debounce to prevent excessive writes)
      this.updateHandler = (_update: Uint8Array, origin: unknown) => {
        // Skip if this update originated from remote sync
        if (this.isSyncing || origin === 'remote') return;

        // Clear existing timer
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }

        // Debounce updates to Firestore (wait 150ms for batch updates)
        this.debounceTimer = setTimeout(() => {
          if (this._destroyed) return;

          const fullState = Y.encodeStateAsUpdate(this.ydoc);

          // Use setDoc with merge to handle both create and update cases
          setDoc(this.firestoreDocRef, {
            content: Array.from(fullState),
            lastModified: serverTimestamp(),
          }, { merge: true }).catch((e) => {
            console.error('[FirebaseProvider] Error syncing to Firestore:', e);
          });
        }, 150);
      };

      this.ydoc.on('update', this.updateHandler);

    } catch (e) {
      console.error('[FirebaseProvider] Setup failed:', e);
      // Still mark as synced so the editor can work (in offline mode)
      this._synced = true;
      this.resolveSynced?.();
    }
  }

  destroy() {
    this._destroyed = true;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.updateHandler) {
      this.ydoc.off('update', this.updateHandler);
      this.updateHandler = null;
    }
  }
}
