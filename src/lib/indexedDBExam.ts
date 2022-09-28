import { Button, renderInRoot } from "./_dom";

import { html, render,  } from 'lit-html';
import { HTMLElementWithContent } from "./_classes";

// indexed DB Api methods
const isExistIndexedDB = () => !!window.indexedDB;
const openRequest = (name: string, version: number) => indexedDB.open(name, version);
const closeRequest = (req: IDBRequest | null) => req && req.result.close();
const getDatabases = async () => await indexedDB.databases(); 
const delDatabases = (name: string) => indexedDB.deleteDatabase(name);


type Global = {
  dbRequest: IDBOpenDBRequest | null,
  database: IDBDatabase | null
}

const global: Global = {
  dbRequest: null,
  database: null,
}

// end indexed DB Api methods

type ToggleEvent =  CustomEvent<{
  shown: boolean
}>;

customElements.define('check-indexeddb', class extends HTMLElementWithContent {
  constructor() {
    super();
    this.render();
  }
  
  clickHanlder = {
    handleEvent: async () => {
      let enabled = false;
      if(isExistIndexedDB()) {
        enabled = true;
      }

      const e: ToggleEvent = new CustomEvent<{shown: boolean}>('toggle', {
        detail: {
          shown: enabled,
        }
      });

      this.dispatchEvent(e);
      this.renderInContent(html`${enabled ? '⭕️ 사용 가능한 브라우저 입니다' : '❌ 사용 불가한 브라우저 입니다.'}`);
    },
    passive: true
  }

  render() {
    render(html`
      <button @click="${this.clickHanlder}">Check</button>
      <div class="${this.contentId}"></div>
    `, this);
  }
});

customElements.define('show-indexeddb-databases', class extends HTMLElementWithContent {
  constructor() {
    super();
    this.render();
  }

  Item(id: string, version: number){
    return html`
      <div>id: ${id}, version: ${version}</div>
    `;
  } 

  async renderItems() {
    const databases = await getDatabases();
    console.log('databases: ', databases);

    if(databases.length === 0) {
      this.renderInContent(html``);
    } else {
      this.renderInContent(
        databases
          .map(
            (d) => this.Item(
              d.name || '', 
              d.version || 1
            )
          )
      );
    }
      
  }

  clickHandler = {
    handleEvent: () => {
      this.renderItems();
    }
  }

  clickHandlerClear = {
    handleEvent: async () => {
      const databases = await getDatabases();

      for(const db of databases) {
        closeRequest(global.dbRequest);
        if(db.name) {
          const dbRequest = delDatabases(db.name);
          console.log(dbRequest);
        }
      }

      await this.renderItems();
    }
  }

  render() {
    render(html`
      <div>
        <button @click="${this.clickHandler}">Search Databases</button>
        <button @click="${this.clickHandlerClear}">Clear</button>
      </div>
      <div class="${this.contentId}"></div>
    `, this);
  }
});

const Constant = {
  KEY: 'id',
  KEY_PATH: 'name',
} as const


const Ids = {
  // container
  dbInfo: 'dbInfo',
  process: 'process',
  // process
  dbName: 'dbName',
  dbVersion: 'dbVersion'
} as const;


const Container = () => {
  const toggleHandler = {
    handleEvent(e: ToggleEvent) {
      console.log(e.detail.shown);
    },
    capture: false,
    passive: true
  }

  return html`
    <h2>IndexedDB</h2>
    <check-indexeddb @toggle="${toggleHandler}"></check-indexeddb>
    <hr />
    <show-indexeddb-databases></show-indexeddb-databases>
    <hr />
    <process-indexeddb-section></process-indexeddb-section>
  `;
}


customElements.define('process-indexeddb-section', class extends HTMLElement {
  

  constructor() {
    super();
    this.renderFirst();
  }

  clickHandlerFirst = {
    handleEvent: () => {
      const name = (document.getElementById(Ids.dbName) as HTMLInputElement).value || 'my-db';
      const version = parseInt((document.getElementById(Ids.dbVersion) as HTMLInputElement).value) || 1;
  
      closeRequest(global.dbRequest);
      global.dbRequest = openRequest(name, version); //현재 혀버전보다 낮은 버전을 요청하면 오류 발생
      console.log(global.dbRequest)
      
      // render(
      //   html`${[
      //     html`<div>name : ${name}</div>`, 
      //     html`<div>version: ${version}</div>`
      //   ]}`, 
      //   document.getElementById(Ids.dbInfo) as HTMLElement
      // );
  
      global.dbRequest.onsuccess = function(e: Event) {
        console.log('🔫 ⭕️ onsuccess : ', e);
        console.log('=> 데이터 베이스 로드가 완료후 트리거 된다.')
        // global.db = request.result;
    
        // const transaction = global.db.transaction(['my-store'], 'readonly');
        // const objectStore = transaction.objectStore('my-store');
    
        // const cursor = objectStore.openCursor();
    
        // cursor.onsuccess = function(e) {
        //   const cursor = (e.target as any).result as IDBCursorWithValue;
    
        //   while(cursor) {
        //     console.log(cursor.value);
        //     cursor.continue();
        //   }
        //   console.log('end')
        // }
      }
  
      global.dbRequest.onerror = function(e: Event) {
        console.log('🔫 ❌ onerror : ', e);
        console.log('=> 데이터 베이스 로드가 완료 실패하면 트리거 된다.')
      }
  
      global.dbRequest.onupgradeneeded = function(e: IDBVersionChangeEvent) {
        console.log('🔫 ⭕️ onupgradeneeded : ', e);
        console.log('=> 기존 저장된 데이터베이스보다 큰 버전이 로드될때 트리거된다.')
        // if(!dbRequest) throw Error('not found dbRequest');
  
        // database = dbRequest.result;
        // store = database.createObjectStore('my-store', {keyPath: Constant.KEY})
        // index = store.createIndex('my-index', Constant.KEY_PATH);
    
        // // put test
        // const tmp = [
        //   {
        //     [Constant.KEY]: 1,
        //     [Constant.KEY_PATH]: 'name',
        //   },
        //   {
        //     [Constant.KEY]: 2,
        //     [Constant.KEY_PATH]: 'name!',
        //   }
        // ];
    
        // global.store?.put(tmp[0]);
        // global.store?.put(tmp[1]);
      }
    }
  }

  renderFirst() {
    render(
      html`
        <h3>Process 1</h3>
        <div>
          <label for="${Ids.dbName}">DB Name</label>
          <input id="${Ids.dbName}" />
        </div>
        <div>
          <label for="${Ids.dbVersion}">DB Version</label>
          <input id="${Ids.dbVersion}" type="number" />
        </div>
        <div>
          <button @click="${this.clickHandlerFirst}">Open</button>
        </div>
      `, this
    );
  }

  renderSecond() {
    render(
      html`
        <h3>Process 2</h3>
        <div>
          <label for="${Ids.dbName}">DB Name</label>
          <input id="${Ids.dbName}" />
        </div>
        <div>
          <label for="${Ids.dbVersion}">DB Version</label>
          <input id="${Ids.dbVersion}" type="number" />
        </div>
        <div>
          <button @click="${() => {}}">Open</button>
        </div>
      `, this
    );
  }

});

const ProcessContent1 = (onOpen: Function) => html`
  <h3>Process 1</h3>
  <div>
    <label for="${Ids.dbName}">DB Name</label>
    <input id="${Ids.dbName}" />
  </div>
  <div>
    <label for="${Ids.dbVersion}">DB Version</label>
    <input id="${Ids.dbVersion}" type="number" />
  </div>
  <div>
    <button @click="${onOpen}">Open</button>
  </div>
`;

const ProcessContent2 = (getDatabase: Function) => html`
  <h3>Process 2</h3>
  <div>
    <label for="${Ids.dbName}">DB Name</label>
    <input id="${Ids.dbName}" />
  </div>
  <div>
    <label for="${Ids.dbVersion}">DB Version</label>
    <input id="${Ids.dbVersion}" type="number" />
  </div>
  <div>
    <button @click="${getDatabase}">Open</button>
  </div>
`;

const main = () => {
  console.log('🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀');  
  console.log('🚀 indexedDB start 🚀');
  console.log('🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀'); 

  let dbRequest: IDBOpenDBRequest | null = null;
  let database: IDBDatabase | null = null;
  let store: IDBObjectStore | null = null;
  let index: IDBIndex | null = null;

  

  renderInRoot(Container());
}
export default () => {
  return Button('indexedDB', main);
}






