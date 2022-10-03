import { Nullable } from "./types/utils";

export const openIndexedDb = (name: string, version: number, storeNames: string[]) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req: IDBOpenDBRequest = indexedDB.open(name, version);
    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      // 새로운 버전 db를 생성할 경우 버전이 오를 경우 store를 초기화 한다.
      storeNames.forEach((storeName) => {
        req.result.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true});

        // ❗️ TODO-02: 데이터를 초기화 한다.
      });      
    }

    req.onsuccess = () => {
      resolve(req.result);
    }
  })
}

export const addObject = async <D>(db: IDBDatabase, storeNames: string[], storeName: string, data: D) => {
  const t = db.transaction(storeNames, 'readwrite');
  const store = t.objectStore(storeName);
  store.add(data);
  t.commit();
}

export const getById = async <D>(db: IDBDatabase, storeNames: string[], storeName: string, id: number) => {
  return new Promise<D | null>((resolve, _reject) => {
    db.transaction(storeNames).objectStore(storeName)
      .get(id).onsuccess = function(_e) {
        resolve(this.result ? this.result as D : null);
      };
  })
}

export const getByChecker = <D>(db: IDBDatabase, storeNames: string[], storeName: string, checker: (item: D) => boolean) => {
  return new Promise<any[]>(function(resolve, reject){
    const r: D[] = [];
    const t = db.transaction(storeNames);
    const c = t.objectStore(storeName)
      .openCursor();

    c.onsuccess = function(_e) {
      const cursor = this.result;
      
      if(cursor?.value && checker(cursor.value as D) ) {
        r.push(cursor.value);
      }
      cursor?.continue();
    }

    t.oncomplete = (_e) => {
      resolve(r);
    }
  });
}

export const clearDatabase = (db: IDBDatabase, storeNames: string[], storeName: string) => {
  const t = db.transaction(storeNames, 'readwrite');
  const s = t.objectStore(storeName);

  s.clear();
}

export namespace IndexedDB {
  export type DBConfig = {
    name: string, 
    version: number,
    store: {
      name: string,
    }
  }
}

export class IndexedDBHelper<D> {
  private _database: Nullable<IDBDatabase> = null;
  private _storeName: string = '';

  constructor() {
    // TODO: ...
  }

  async init(config: IndexedDB.DBConfig) {
    this._storeName = config.store.name;
    this._database = await openIndexedDb(config.name, config.version, [this._storeName]);

    return this;
  }

  get database() {
    return this._database;
  }

  private _checkDatabase(db: Nullable<IDBDatabase>): db is IDBDatabase {
    if(db === null) {
      throw new Error('❌ indexedDBHelper must call init method.')
    }

    return true;
  }

  getStoreNames() {
    const database = this._database;
    if (!this._checkDatabase(database)) {
      return;
    }

    return [...database.objectStoreNames];
  }


  async add(data: D) {
    const database = this._database;
    if (!this._checkDatabase(database)) {
      return false;
    }

    await addObject<D>(database, [this._storeName], this._storeName, data);
    return true;
  }

  async getById(id: number) {
    const database = this._database;
    if (!this._checkDatabase(database)) {
      return null;
    }

    const item = await getById<D>(database, [this._storeName], this._storeName, id);
    return item;
  }

  async clear() {
    const database = this._database;
    if (!this._checkDatabase(database)) {
      return null;
    }

    clearDatabase(database, [this._storeName], this._storeName);
  }
}