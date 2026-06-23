import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "nine-balls";
const DB_VERSION = 2;
const STORE_NAME = "sessions";

interface WithSyncMeta {
  id: string;
  syncStatus?: string;
  deletedAt?: unknown;
  lastSyncedAt?: unknown;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt");
        }
        if (oldVersion < 2) {
          migrateV1ToV2(db);
        }
      },
    });
  }
  return dbPromise;
}

async function migrateV1ToV2(db: IDBPDatabase): Promise<void> {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  let cursor = await store.openCursor();
  while (cursor) {
    const record = cursor.value;
    if (!record.syncStatus) {
      record.deletedAt = null;
      record.syncStatus = "pending_upsert";
      record.lastSyncedAt = null;
      cursor.update(record);
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function getAllRecords<T>(): Promise<T[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function getRecord<T>(id: string): Promise<T | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function putRecord<T>(record: T): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, record);
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function getPendingRecords<T>(): Promise<T[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  return all.filter(
    (r) =>
      (r as WithSyncMeta).syncStatus === "pending_upsert" ||
      (r as WithSyncMeta).syncStatus === "pending_delete"
  ) as T[];
}

export async function markRecordSynced(id: string): Promise<void> {
  const db = await getDb();
  const record = (await db.get(STORE_NAME, id)) as WithSyncMeta | undefined;
  if (record) {
    record.syncStatus = "synced";
    record.lastSyncedAt = Date.now();
    await db.put(STORE_NAME, record);
  }
}

export async function markAllSynced(): Promise<void> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  for (const record of all) {
    const r = record as WithSyncMeta;
    r.syncStatus = "synced";
    r.lastSyncedAt = Date.now();
    store.put(r);
  }
  await tx.done;
}

export async function bulkPutRecords<T>(records: T[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  for (const record of records) {
    store.put(record);
  }
  await tx.done;
}
