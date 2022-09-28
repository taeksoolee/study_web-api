# Webpack-ts(typescript)-Template

## 🛠 Config
``` shell
  npm install --global typescript
```


## 🚀 Command 
``` shell
  npm run dev # 개발 서버를 실행한다.
  npm run build # /dist 로 빌드한다.
```

---

# Battery
- 배터리의 잔량을 확인 할 수 있도록 하는 API 이다.

---
# 📚 IndexedDB

[Mozila DOCS](<https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>)

[CanIUse](<https://caniuse.com/?search=indexedDB>)

[Blog DOCS](<https://pks2974.medium.com/indexeddb-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-ca9be4add614>)

- Web Storage와 비교해 많은양의 데이터를 저장할 수 있다.
- 인덱싱을 사용하여 고성능 검색을 가능하게한다.
- 트랜젝션 데이터 베이스 시스템이다. 트랜젝션 내에서 문제발생시 롤백처리 된다.
- JavaScript 기반 객체 지향 데이터베이스이다.
- Key-Value로 데이터를 관리하며 B-Tree 데이터 구조를 가진다.
- same-origin policy를 따른다. (같은 도메인에서만 접근 가능)
- 일반적으로 영속성을 가지나 특정상황에 따라 삭제된다.


## 구성 요소
|  Name        | Description                      |
|-             |-                                 |
| Database     |[Link](#database)|
| Object Store |[Link](#object-store)|
| Transaction  |[Link](#transaction)|
| Cursor       |[Link](#cursor)|
| Index        |[Link](#index)|


### Database
- Version과 N개의 Object Store를 가진다.
- 브라우저는 여러 Database를 가진다.
- `indexedDB.open(version, dbName)` 함수를 호출하여 객체를 얻는다.

### Object Store
- 각 Object Store의 name은 고유해야 한다.
- 데이터를 담는 공간으로 N개의 Record(Key-Value)를 가진다.
- Record는 Key의 오름차순으로 정렬된다.
- 모든 Value의 형태는 일치하지 않도록 작성가능하다.
- key path를 설정하면 `in-line keys`를 사용하고, 그 외에는 `out-of-line-leys`를 사용한다.
- `IDBRequest.createObjectStore(storeName, options)` 함수를 호출하여 생성한다.

### Transaction
- IndexedDB API의 작업은 트랜젝션 내에서 발생하여 작업이 실해하면, 작업중이던 내용은 롤백된다.
- 트랜젝션 외부에서 IndexedDB API를 호출하면 오류가 발생한다.
- 트랜젝션은 `readonly`, `readwrite`,  `versionchange`의 상태를 가진다.
- `IDBReqeust.transaction(?)` 함수를 호출하여 트랙젝션을 얻는다.

### Cursor
- Record(Object Store)를 순회하거나 반복할 수 있다.
- `ObjectStore.openCursor(key or key range)`를 호출하여 `IDBCursorWithValue` 객체를 전달받아 continue 메소드를 사요하여 반복 조회한다.

### Index
- Object Store를 참조하는 Object Store이다.
- Object Store에 Index와 관련된 Record가 업데이트 되면 자동 갱신된다.
- `IDBObjectStore.creatIndex()`로 생성한다.