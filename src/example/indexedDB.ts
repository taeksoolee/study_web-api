import { html } from "lit-html";
import { getByChecker, getById, IndexedDBStore, openIndexedDb } from "../lib/indexedDB";
import { Button, renderInRoot } from "../lib/utils/dom";

const mainWithRawFunctions = async () => {
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

const main = async () => {
  console.log('🚀 indexedDB');  

  const dbHelper = await new IndexedDBStore<ExamItem>().init({
    name: 'my-test-db',
    version: 1,
    store: {
      name: 'taeksoo/my-store',
    }
  });

  const addItem = (e: Event) => {
    e.preventDefault();
    const $foo = (window as any).AddIndexedDBForm.foo as HTMLInputElement;
    const $bar = (window as any).AddIndexedDBForm.bar as HTMLInputElement;

    const item: ExamItem = {
      foo: $foo.value,
      bar: $bar.value
    }

    dbHelper.add(item);
    $foo.value = '';
    $bar.value = '';
  }

  const addForm = html`
    <form name="AddIndexedDBForm" @submit="${addItem}">
      <h5>Add Form</h5>
      <div>
        <label for="foo">foo</label>
        <input id="foo" name="foo" />
      </div>
      <div>
        <label for="bar">bar</label>
        <input id="bar" name="bar" />
      </div>
      <button type="submit">Add</button>
    </form>
  `;

  const clearDatabase = () => {
    dbHelper.clear();
  }

  const clearButton = html`
    <button @click="${clearDatabase}">Clear</button>
  `

  renderInRoot(html`
    ${addForm}
    <hr />
    ${clearButton}
  `);

  // await helper.add({
  //   foo: 1,
  //   bar: 2,
  // });

  const item = await dbHelper.getById(4);
  console.log(item);
}

export default () => {
  return Button('indexedDB', main);
}






