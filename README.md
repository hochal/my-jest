# Jest
> Facebook에서 만든 테스팅 프레임워크 
> 
> `"Delightful Javascript Testing"`
> 
> [공식 사이트](https://jestjs.io/)

## Getting Started

- 설치
```console
$ npm run i -D jest
```

- Babel 설정
```console
$ yarn add --dev babel-jest @babel/core @babel/preset-env
```

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```

- Typescript 설정
```console
$ yarn add --dev @babel/preset-typescript
```
```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
+    '@babel/preset-typescript',
  ],
};
```
## Matchers
- [Jest Matchers Docs](https://jestjs.io/docs/en/expect)
```js
/*
    주요 matchers
*/

const expectedResult = null; // 예상 결과값
toBe(expectedResult); // primitive 값만 비교 
toEqual(expectedResult); // object 값 비교
toBeTruthy(); // true 인지
toBeFalsy(); // false 인지
toThrow(); // 예외 발생 여부 확인

const arrayItem = null;
toContain(arrayItem); // === (strict check)했을 때 item이 array에 속할 때

const arrayItemObject = {key: 'value'};
toContainEqual(arrayItemObject); // array에 object item이 속할 때 (key-value 쌍 포함)

not.toXxx(); // 부정

const testTarget = null;
expect(testTarget).toThrow();
// 위 경우 testTarget은 함수여야합니다.
```

## 테스트 코드 그룹핑
```js
const myBeverage = {
  delicious: true,
  sour: false,
};

describe('my beverage', () => {
  test('is delicious', () => {
    expect(myBeverage.delicious).toBeTruthy();
  });
  it('is not sour', () => {
    // it은 test의 alias입니다.
    expect(myBeverage.sour).toBeFalsy();
  });
});
```

## 테스트 코드 선택 실행
```js
// only : 해당 테스트만 실행
describe.only('', () => { /* ... */});
test.only('', () => { /* ... */});
it.only('', () => { /* ... */});

// skip : 해당 테스트만 제외하고 실행
describe.skip('', () => { /* ... */});
test.skip('', () => { /* ... */});
it.skip('', () => { /* ... */});
```

## 테스트 전/후 처리
```js
const fn = () => {};
const timeout = 5000; // default

// timeout 은 how long to wait before aborting라는데 동작이.. 잘 모르겠음

// 모든 테스트의 전/후에 실행
beforeAll(fn, timeout)
afterAll(fn, timeout)

// 해당 테스트 전/후에 실행
beforeEach(fn, timeout)
afterEach(fn, timeout)
```

## 비동기 처리

- setTimeout
```js
function fetchUser(id, cb) {
  setTimeout(() => {
    const user = {/* ... */}
    cb(user);
  }, 200);
}
test('fetch a user', (done) => {
  fetchUser(1, (user) => {
    expect(user).toEqual(/* ... */);
    done(); // 비동기 코스트 테스트라는 걸 명시적으로 표시
  });
});
```
- Promise
```js
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
    const user = {/* ... */}
    resolve(user);
  }, 200);
  })
}
test('fetch a user', (done) => {
  // 1. Promise를 리턴  
  return fetchUser(1).then((user) => { 
    expect(user).toEqual(/* ... */);
  });

  // 2. 간단한 방법
  return expect(fetchUser(1)).resolves.toEqual(/* ... */);
});
```

- async/await

```js
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
    const user = {/* ... */}
    resolve(user);
  }, 200);
  })
}
test('fetch a user', (done) => {
  // 1. 기본 방법
  const user = await fetchUser(1);
  expect(user).toEqual(/* ... */);

  // 2. 간단한 방법
  await expect(fetchUser(1)).resolves.toEqual(/* ... */);
});
```

## Mocking
- 단위 테스트 코드가 의존하는 데이터를 가짜(mock)로 대체하는 기법
- jest의 mocking 지원
    - mock object 생성을 지원
    - 테스트 실행하는 동안 mock object 에 발생한 일들을 기억

## Mock Functions

### jest.fn() 
- 가짜 함수 생성

```js
import { register, deregister } from './userService';
import * as messageService from './messageService';

// 실제 sendEmail, sendSMS의 동작은 중요하지 않다.
// register, deregister에서 messageService의 sendEmail, sendSMS가 어떻게 불리는지를 테스트해야한다.
messageService.sendEmail = jest.fn();
messageService.sendSMS = jest.fn();

const sendEmail = messageService.sendEmail;
const sendSMS = messageService.sendSMS;

beforeEach(() => {
  sendEmail.mockClear();
  sendSMS.mockClear();
});

const user = {
  email: 'test@email.com',
  phone: '012-345-6789',
};

test('register sends messeges', () => {
  register(user);

  expect(sendEmail).toBeCalledTimes(1);
  expect(sendEmail).toBeCalledWith(user.email, '회원 가입을 환영합니다!');

  expect(sendSMS).toBeCalledTimes(1);
  expect(sendSMS).toBeCalledWith(user.phone, '회원 가입을 환영합니다!');
});
```

- 위 코드는 모듈의 함수를 일일이 jest.fn()으로 모킹한다.
- 아래 코드는 jest.mock()을 사용하여 **모듈을 전체 모킹**하여 필요한 함수만 사용한다.
  
```js
import { sendEmail, sendSMS } from "./messageService"

jest.mock('../src/messageService');
const { sendEmail, sendSMS } = require('../src/messageService');

beforeEach(() => {
  sendEmail.mockClear()
  sendSMS.mockClear()
})
```

### jest.spyOn(object, methodName)
- 가짜 함수로 대체하지 않고, **특정 함수**가 어떻게 호출되었는지를 확인한다.
  
```js
const calculator = {
  add: (a, b) => a + b,
}

const spyFn = jest.spyOn(calculator, "add")

const result = calculator.add(2, 3)

expect(spyFn).toBeCalledTimes(1)
expect(spyFn).toBeCalledWith(2, 3)
expect(result).toBe(5)
```

## test 실패하는 경우..
```js
/*
parameter를 사용하지 않을 때 에러 발생
=> 나머지연산자를 사용하여 ...notUsedParams로 받으면 에러 발생 안함.

: Timeout - Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Timeout - Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Error:
*/
test('fetch a user', (notUsedParams) => {
  expect(1 + 1).toBe(2);
});

```

## 추후 참고하면 좋을 것
- [Mock Timer](https://haeguri.github.io/2020/01/12/jest-mock-timer/)
- [Jest의 Snapshot](https://medium.com/@ljs0705/jest-snapshot-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-5300c0249dd)

## 참조
- https://jestjs.io/docs/en/getting-started
- https://velog.io/@rlcjf0014/Jest1-Intro
- https://www.daleseo.com/jest-mock-modules/