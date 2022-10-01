import { getByChecker, getById, openIndexedDb } from "../lib/indexedDB";
import { Button } from "../lib/utils/dom";

const main = async () => {
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

  const item = await getById<ExamItem>(db, storeNames, storeNames[0], 100);
  console.log(item);

  const r = await getByChecker<ExamItem>(
    db,
    storeNames,
    storeNames[0],
    (_item: ExamItem) => true
  );

  console.log(r);
}

export default () => {
  return Button('indexedDB', main);
}






