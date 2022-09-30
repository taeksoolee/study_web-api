import indexedDBExam from './lib/indexedDBExam';
import batteryExam from './lib/batteryExam';
import { html, render } from 'lit-html';
import { renderInRoot } from './lib/_dom';

render(
  html`
    ${[
      indexedDBExam(),
      batteryExam()
    ]}
  `,
  document.getElementById('buttons') as HTMLElement,
);

renderInRoot(
  html`<div>No Selected</div>`
);


// test code...

const openIndexedDb = (name: string, version: number, storeNames: string[]) => {
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

const addObject = <D>(db: IDBDatabase, storeNames: string[], storeName: string, data: D) => {
  const t = db.transaction(storeNames, 'readwrite');
  const store = t.objectStore(storeName);
  store.add(data);
  t.commit();
}

const getById = async <D>(db: IDBDatabase, storeNames: string[], storeName: string, id: number) => {
  return new Promise<D | null>((resolve, reject) => {
    db.transaction(storeNames).objectStore(storeName)
      .get(id).onsuccess = function(_e) {
        resolve(this.result ? this.result as D : null);
      };
  })
}

const getByChecker = <D>(db: IDBDatabase, storeNames: string[], storeName: string, checker: (item: D) => boolean) => {
  return new Promise<any[]>(function(resolve, reject){
    const r: D[] = [];
    const t = db.transaction(storeNames);
    const c = t.objectStore(storeName)
      .openCursor();

    c.onsuccess = function(e) {
      const cursor = this.result;
      
      if(cursor?.value && checker(cursor.value as D) ) {
        r.push(cursor.value);
      }
      cursor?.continue();
    }

    t.oncomplete = (e) => {
      resolve(r);
    }
  });
}


interface Item {
  foo: number,
  bar: number
}


// main...
(async () => {
  const storeNames = [
    'taeksoo/my-store',
  ]
  const db = await openIndexedDb('my-test-db', 1, storeNames);

  // ❗️ TODO-01: 작업 필요한 작업을 진행한다.
  console.log([...db.objectStoreNames]);

  // addObject<Item>(
  //   db,
  //   storeNames,
  //   storeNames[0],
  //   {
  //     foo: 10, bar: 2
  //   }
  // );

  console.log(await getById<Item>(db, storeNames, storeNames[0], 100));

  const r = await getByChecker<Item>(
    db,
    storeNames,
    storeNames[0],
    (_item: Item) => true
  );

  console.log(r);
})();





