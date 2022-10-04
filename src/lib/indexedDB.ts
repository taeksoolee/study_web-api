import { Nullable } from "./types/utils";

/**
 * 새로운 indexedDB를 열어 Database 객체를 반환한다.
 * 오픈된 database가 새로운 버전일 경우 store를 생성한다.
 * @param name - database name
 * @param version - database version
 * @param storeNames  - store name list
 * @returns IndexedDB Database
 */
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

/**
 * database store에 data를 추가한다.
 * @param db - IndexedDB Database
 * @param storeNames - transaction store name list
 * @param storeName - target store names
 * @param data - data to add
 */
export const addObject = async <D>(db: IDBDatabase, storeNames: string[], storeName: string, data: D) => {
  const t = db.transaction(storeNames, 'readwrite');
  const store = t.objectStore(storeName);
  store.add(data);
  t.commit();
}
/**
 * databse store의 데이터중 id가 일치하는 데이터를 반환한다.
 * @param db 
 * @param storeNames 
 * @param storeName 
 * @param id 
 * @returns 
 */
export const getById = async <D>(db: IDBDatabase, storeNames: string[], storeName: string, id: number) => {
  return new Promise<D | null>((resolve, _reject) => {
    db.transaction(storeNames).objectStore(storeName)
      .get(id).onsuccess = function(_e) {
        resolve(this.result ? this.result as D : null);
      };
  })
}

/**
 * databse store의 데이터중 데이터를 check하여 true를 반환하는 데이터들를 반환한다.
 * @param db 
 * @param storeNames 
 * @param storeName 
 * @param checker 
 * @returns 
 */
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

/**
 * databse store의 모든 데이터를 삭제한다.
 * @param db 
 * @param storeNames 
 * @param storeName 
 */
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

export class IndexedDBStore<D> {
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