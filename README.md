# Webpack-ts(typescript)-Template

## ๐  Config
``` shell
  npm install --global typescript
```


## ๐ Command 
``` shell
  npm run dev # ๊ฐ๋ฐ ์๋ฒ๋ฅผ ์คํํ๋ค.
  npm run build # /dist ๋ก ๋น๋ํ๋ค.
```

---

# Battery
- ๋ฐฐํฐ๋ฆฌ์ ์๋์ ํ์ธ ํ  ์ ์๋๋ก ํ๋ API ์ด๋ค.

---
# ๐ IndexedDB

[Mozila DOCS](<https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>)

[CanIUse](<https://caniuse.com/?search=indexedDB>)

[Blog DOCS](<https://pks2974.medium.com/indexeddb-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-ca9be4add614>)

- Web Storage์ ๋น๊ตํด ๋ง์์์ ๋ฐ์ดํฐ๋ฅผ ์ ์ฅํ  ์ ์๋ค.
- ์ธ๋ฑ์ฑ์ ์ฌ์ฉํ์ฌ ๊ณ ์ฑ๋ฅ ๊ฒ์์ ๊ฐ๋ฅํ๊ฒํ๋ค.
- ํธ๋์ ์ ๋ฐ์ดํฐ ๋ฒ ์ด์ค ์์คํ์ด๋ค. ํธ๋์ ์ ๋ด์์ ๋ฌธ์ ๋ฐ์์ ๋กค๋ฐฑ์ฒ๋ฆฌ ๋๋ค.
- JavaScript ๊ธฐ๋ฐ ๊ฐ์ฒด ์งํฅ ๋ฐ์ดํฐ๋ฒ ์ด์ค์ด๋ค.
- Key-Value๋ก ๋ฐ์ดํฐ๋ฅผ ๊ด๋ฆฌํ๋ฉฐ B-Tree ๋ฐ์ดํฐ ๊ตฌ์กฐ๋ฅผ ๊ฐ์ง๋ค.
- same-origin policy๋ฅผ ๋ฐ๋ฅธ๋ค. (๊ฐ์ ๋๋ฉ์ธ์์๋ง ์ ๊ทผ ๊ฐ๋ฅ)
- ์ผ๋ฐ์ ์ผ๋ก ์์์ฑ์ ๊ฐ์ง๋ ํน์ ์ํฉ์ ๋ฐ๋ผ ์ญ์ ๋๋ค.


## ๊ตฌ์ฑ ์์
|  Name        | Description                      |
|-             |-                                 |
| Database     |[Link](#database)|
| Object Store |[Link](#object-store)|
| Transaction  |[Link](#transaction)|
| Cursor       |[Link](#cursor)|
| Index        |[Link](#index)|


### Database
- Version๊ณผ N๊ฐ์ Object Store๋ฅผ ๊ฐ์ง๋ค.
- ๋ธ๋ผ์ฐ์ ๋ ์ฌ๋ฌ Database๋ฅผ ๊ฐ์ง๋ค.
- `indexedDB.open(version, dbName)` ํจ์๋ฅผ ํธ์ถํ์ฌ ๊ฐ์ฒด๋ฅผ ์ป๋๋ค.

### Object Store
- ๊ฐ Object Store์ name์ ๊ณ ์ ํด์ผ ํ๋ค.
- ๋ฐ์ดํฐ๋ฅผ ๋ด๋ ๊ณต๊ฐ์ผ๋ก N๊ฐ์ Record(Key-Value)๋ฅผ ๊ฐ์ง๋ค.
- Record๋ Key์ ์ค๋ฆ์ฐจ์์ผ๋ก ์ ๋ ฌ๋๋ค.
- ๋ชจ๋  Value์ ํํ๋ ์ผ์นํ์ง ์๋๋ก ์์ฑ๊ฐ๋ฅํ๋ค.
- key path๋ฅผ ์ค์ ํ๋ฉด `in-line keys`๋ฅผ ์ฌ์ฉํ๊ณ , ๊ทธ ์ธ์๋ `out-of-line-leys`๋ฅผ ์ฌ์ฉํ๋ค.
- `IDBRequest.createObjectStore(storeName, options)` ํจ์๋ฅผ ํธ์ถํ์ฌ ์์ฑํ๋ค.

### Transaction
- IndexedDB API์ ์์์ ํธ๋์ ์ ๋ด์์ ๋ฐ์ํ์ฌ ์์์ด ์คํดํ๋ฉด, ์์์ค์ด๋ ๋ด์ฉ์ ๋กค๋ฐฑ๋๋ค.
- ํธ๋์ ์ ์ธ๋ถ์์ IndexedDB API๋ฅผ ํธ์ถํ๋ฉด ์ค๋ฅ๊ฐ ๋ฐ์ํ๋ค.
- ํธ๋์ ์์ `readonly`, `readwrite`,  `versionchange`์ ์ํ๋ฅผ ๊ฐ์ง๋ค.
- `IDBReqeust.transaction(?)` ํจ์๋ฅผ ํธ์ถํ์ฌ ํธ๋์ ์์ ์ป๋๋ค.

### Cursor
- Record(Object Store)๋ฅผ ์ํํ๊ฑฐ๋ ๋ฐ๋ณตํ  ์ ์๋ค.
- `ObjectStore.openCursor(key or key range)`๋ฅผ ํธ์ถํ์ฌ `IDBCursorWithValue` ๊ฐ์ฒด๋ฅผ ์ ๋ฌ๋ฐ์ continue ๋ฉ์๋๋ฅผ ์ฌ์ํ์ฌ ๋ฐ๋ณต ์กฐํํ๋ค.

### Index
- Object Store๋ฅผ ์ฐธ์กฐํ๋ Object Store์ด๋ค.
- Object Store์ Index์ ๊ด๋ จ๋ Record๊ฐ ์๋ฐ์ดํธ ๋๋ฉด ์๋ ๊ฐฑ์ ๋๋ค.
- `IDBObjectStore.creatIndex()`๋ก ์์ฑํ๋ค.