import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "nine-balls";
const DB_VERSION = 1;
const STORE_NAME = "sessions";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          store.createIndex("updatedAt", "updatedAt");
        }
      },
    });
  }
  return dbPromise;
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
